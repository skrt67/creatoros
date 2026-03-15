"""Billing and subscription routes with Stripe integration."""

import os
import stripe
from fastapi import APIRouter, Depends, HTTPException, status, Request

from ..models import (
    CheckoutRequest,
    CheckoutResponse,
    PortalRequest,
    PortalResponse,
    SubscriptionResponse,
    APIResponse
)
from ..auth import get_current_active_user
from ..database import get_prisma_client

# Initialize Stripe
stripe.api_key = os.getenv("STRIPE_SECRET_KEY")
webhook_secret = os.getenv("STRIPE_WEBHOOK_SECRET")

router = APIRouter(prefix="/billing", tags=["billing"])

@router.post("/create-checkout-session", response_model=CheckoutResponse)
async def create_checkout_session(
    checkout_data: CheckoutRequest,
    current_user = Depends(get_current_active_user)
):
    """Create a Stripe checkout session for subscription."""
    try:
        print(f"🔵 Creating checkout session for user: {current_user.id}, email: {current_user.email}")
        print(f"🔵 Price ID: {checkout_data.price_id}")

        prisma = get_prisma_client()

        subscription = await prisma.subscription.find_unique(
            where={"userId": current_user.id}
        )

        if subscription:
            customer_id = subscription.stripeCustomerId
            print(f"🔵 Found existing customer: {customer_id}")
        else:
            print(f"🔵 Creating new Stripe customer for {current_user.email}")
            customer = stripe.Customer.create(
                email=current_user.email,
                metadata={"user_id": current_user.id}
            )
            customer_id = customer.id
            print(f"🔵 Created customer: {customer_id}")

        print(f"🔵 Creating Stripe checkout session...")
        session = stripe.checkout.Session.create(
            customer=customer_id,
            payment_method_types=["card"],
            line_items=[{
                "price": checkout_data.price_id,
                "quantity": 1,
            }],
            mode="subscription",
            success_url=checkout_data.success_url,
            cancel_url=checkout_data.cancel_url,
            metadata={
                "user_id": current_user.id
            }
        )

        print(f"✅ Checkout session created: {session.id}")
        return CheckoutResponse(
            session_url=session.url,
            session_id=session.id
        )

    except stripe.error.StripeError as e:
        print(f"❌ Stripe error: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Stripe error: {str(e)}"
        )
    except Exception as e:
        print(f"❌ Exception creating checkout session: {str(e)}")
        import traceback
        traceback.print_exc()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to create checkout session: {str(e)}"
        )

@router.post("/create-portal-session", response_model=PortalResponse)
async def create_portal_session(
    portal_data: PortalRequest,
    current_user = Depends(get_current_active_user)
):
    """Create a Stripe customer portal session."""
    prisma = get_prisma_client()

    try:
        subscription = await prisma.subscription.find_unique(
            where={"userId": current_user.id}
        )

        if not subscription:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="No subscription found"
            )

        if subscription.stripeCustomerId.startswith("cus_test_"):
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Cannot manage test subscriptions. Please subscribe via Stripe to manage your subscription."
            )

        session = stripe.billing_portal.Session.create(
            customer=subscription.stripeCustomerId,
            return_url=portal_data.return_url,
        )

        return PortalResponse(portal_url=session.url)

    except stripe.error.StripeError as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Stripe error: {str(e)}"
        )
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to create portal session: {str(e)}"
        )


@router.post("/cancel-subscription")
async def cancel_subscription(
    current_user = Depends(get_current_active_user)
):
    """Cancel user's subscription. Handles both real Stripe and test subscriptions."""
    prisma = get_prisma_client()

    try:
        subscription = await prisma.subscription.find_unique(
            where={"userId": current_user.id}
        )

        if not subscription:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="No subscription found"
            )

        # For real Stripe subscriptions, cancel via Stripe API
        if not subscription.stripeSubscriptionId.startswith("sub_test_"):
            try:
                stripe.Subscription.cancel(subscription.stripeSubscriptionId)
            except stripe.error.StripeError as e:
                print(f"Stripe cancel error: {e}")

        # Update subscription status in database
        await prisma.subscription.update(
            where={"userId": current_user.id},
            data={"status": "canceled"}
        )

        # Downgrade user to FREE
        await prisma.user.update(
            where={"id": current_user.id},
            data={"plan": "FREE"}
        )

        print(f"✅ Subscription canceled for user {current_user.id}")

        return {"success": True, "message": "Abonnement annulé avec succès"}

    except HTTPException:
        raise
    except Exception as e:
        print(f"❌ Error canceling subscription: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to cancel subscription: {str(e)}"
        )


@router.get("/subscription")
async def get_user_subscription(current_user = Depends(get_current_active_user)):
    """Get current user's subscription details."""
    prisma = get_prisma_client()

    try:
        subscription = await prisma.subscription.find_unique(
            where={"userId": current_user.id}
        )

        if not subscription:
            return {
                "id": None,
                "user_id": current_user.id,
                "plan": "FREE",
                "status": "active",
                "stripe_customer_id": None,
                "stripe_subscription_id": None,
                "stripe_price_id": None,
                "stripe_current_period_end": None
            }

        is_active = subscription.status in ["active", "trialing"]

        return {
            "id": subscription.id,
            "user_id": subscription.userId,
            "plan": "PRO" if is_active else "FREE",
            "status": subscription.status,
            "stripe_customer_id": subscription.stripeCustomerId,
            "stripe_subscription_id": subscription.stripeSubscriptionId,
            "stripe_price_id": subscription.stripePriceId,
            "stripe_current_period_end": subscription.stripeCurrentPeriodEnd
        }
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to get subscription: {str(e)}"
        )


@router.post("/webhooks/stripe", response_model=APIResponse)
async def handle_stripe_webhook(request: Request):
    """Handle Stripe webhook events."""
    payload = await request.body()
    sig_header = request.headers.get("stripe-signature")

    try:
        event = stripe.Webhook.construct_event(
            payload, sig_header, webhook_secret
        )
    except ValueError:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid payload"
        )
    except stripe.error.SignatureVerificationError:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid signature"
        )

    if event["type"] == "checkout.session.completed":
        await handle_checkout_completed(event["data"]["object"])
    elif event["type"] == "invoice.payment_succeeded":
        await handle_payment_succeeded(event["data"]["object"])
    elif event["type"] == "customer.subscription.updated":
        await handle_subscription_updated(event["data"]["object"])
    elif event["type"] == "customer.subscription.deleted":
        await handle_subscription_deleted(event["data"]["object"])

    return APIResponse(success=True, message="Webhook processed")

async def handle_checkout_completed(session):
    """Handle successful checkout completion."""
    from datetime import datetime

    prisma = get_prisma_client()

    try:
        user_id = session["metadata"]["user_id"]
        customer_id = session["customer"]
        subscription_id = session["subscription"]

        print(f"🔔 Processing checkout completion for user {user_id}")

        subscription = stripe.Subscription.retrieve(subscription_id)

        print(f"📦 Subscription retrieved: {subscription.id}, status: {subscription.status}")

        period_end_timestamp = subscription['items']['data'][0]['current_period_end']
        period_end = datetime.fromtimestamp(period_end_timestamp)

        print(f"✅ Got period_end from items: {period_end}")

        await prisma.subscription.upsert(
            where={"userId": user_id},
            data={
                "create": {
                    "userId": user_id,
                    "stripeCustomerId": customer_id,
                    "stripeSubscriptionId": subscription_id,
                    "stripePriceId": subscription['items']['data'][0]['price']['id'],
                    "stripeCurrentPeriodEnd": period_end,
                    "status": subscription['status']
                },
                "update": {
                    "stripeCustomerId": customer_id,
                    "stripeSubscriptionId": subscription_id,
                    "stripePriceId": subscription['items']['data'][0]['price']['id'],
                    "stripeCurrentPeriodEnd": period_end,
                    "status": subscription['status']
                }
            }
        )

        if subscription['status'] in ["active", "trialing"]:
            await prisma.user.update(
                where={"id": user_id},
                data={"plan": "PRO"}
            )
            print(f"✅ User {user_id} upgraded to PRO")

        print(f"✅ Subscription record created/updated for user {user_id}")

    except Exception as e:
        print(f"❌ Error in handle_checkout_completed: {str(e)}")
        import traceback
        traceback.print_exc()
        raise

async def handle_payment_succeeded(invoice):
    """Handle successful payment."""
    pass

async def handle_subscription_updated(subscription):
    """Handle subscription updates."""
    from datetime import datetime

    prisma = get_prisma_client()

    try:
        period_end = datetime.fromtimestamp(subscription["current_period_end"])

        updated_sub = await prisma.subscription.update(
            where={"stripeSubscriptionId": subscription["id"]},
            data={
                "stripePriceId": subscription["items"]["data"][0]["price"]["id"],
                "stripeCurrentPeriodEnd": period_end,
                "status": subscription["status"]
            }
        )

        if subscription["status"] in ["active", "trialing"]:
            await prisma.user.update(
                where={"id": updated_sub.userId},
                data={"plan": "PRO"}
            )
        else:
            await prisma.user.update(
                where={"id": updated_sub.userId},
                data={"plan": "FREE"}
            )
    except Exception as e:
        print(f"❌ Error in handle_subscription_updated: {str(e)}")
        import traceback
        traceback.print_exc()
        raise

async def handle_subscription_deleted(subscription):
    """Handle subscription cancellation."""
    prisma = get_prisma_client()

    try:
        updated_sub = await prisma.subscription.update(
            where={"stripeSubscriptionId": subscription["id"]},
            data={"status": "canceled"}
        )

        await prisma.user.update(
            where={"id": updated_sub.userId},
            data={"plan": "FREE"}
        )
    except Exception as e:
        print(f"❌ Error in handle_subscription_deleted: {str(e)}")
        import traceback
        traceback.print_exc()
        raise

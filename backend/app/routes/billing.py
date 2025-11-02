"""Billing and subscription routes with Stripe integration."""

import os
import stripe
from fastapi import APIRouter, Depends, HTTPException, status, Request
from prisma import Prisma

from ..models import (
    CheckoutRequest,
    CheckoutResponse,
    PortalRequest,
    PortalResponse,
    SubscriptionResponse,
    APIResponse
)
from ..auth import get_current_active_user

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

        # Create or get Stripe customer
        prisma = Prisma()
        await prisma.connect()

        try:
            subscription = await prisma.subscription.find_unique(
                where={"userId": current_user.id}
            )

            if subscription:
                customer_id = subscription.stripeCustomerId
                print(f"🔵 Found existing customer: {customer_id}")
            else:
                # Create new Stripe customer
                print(f"🔵 Creating new Stripe customer for {current_user.email}")
                customer = stripe.Customer.create(
                    email=current_user.email,
                    metadata={"user_id": current_user.id}
                )
                customer_id = customer.id
                print(f"🔵 Created customer: {customer_id}")
        finally:
            await prisma.disconnect()

        # Create checkout session
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
    prisma = Prisma()
    await prisma.connect()
    
    try:
        subscription = await prisma.subscription.find_unique(
            where={"userId": current_user.id}
        )

        if not subscription:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="No subscription found"
            )

        # Check if this is a test subscription (manual)
        if subscription.stripeCustomerId.startswith("cus_test_"):
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Cannot manage test subscriptions. Please subscribe via Stripe to manage your subscription."
            )

        # Create portal session
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
    finally:
        await prisma.disconnect()

@router.get("/subscription")
async def get_user_subscription(current_user = Depends(get_current_active_user)):
    """Get current user's subscription details."""
    prisma = Prisma()
    await prisma.connect()

    try:
        subscription = await prisma.subscription.find_unique(
            where={"userId": current_user.id}
        )

        if not subscription:
            # Return FREE plan status if no subscription found
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

        # Check if subscription is active
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

    finally:
        await prisma.disconnect()

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
    
    # Handle the event
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

    prisma = Prisma()
    await prisma.connect()

    try:
        user_id = session["metadata"]["user_id"]
        customer_id = session["customer"]
        subscription_id = session["subscription"]

        print(f"🔔 Processing checkout completion for user {user_id}")

        # Get subscription details from Stripe
        subscription = stripe.Subscription.retrieve(subscription_id)

        print(f"📦 Subscription retrieved: {subscription.id}, status: {subscription.status}")

        # Convert Unix timestamp to datetime
        # Use bracket notation for Stripe objects
        period_end = datetime.fromtimestamp(subscription['current_period_end'])

        # Create or update subscription record
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

        # Update user plan to PRO if subscription is active
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
    finally:
        await prisma.disconnect()

async def handle_payment_succeeded(invoice):
    """Handle successful payment."""
    # Update subscription status if needed
    pass

async def handle_subscription_updated(subscription):
    """Handle subscription updates."""
    from datetime import datetime

    prisma = Prisma()
    await prisma.connect()

    try:
        # Convert Unix timestamp to datetime
        period_end = datetime.fromtimestamp(subscription["current_period_end"])

        # Update subscription
        updated_sub = await prisma.subscription.update(
            where={"stripeSubscriptionId": subscription["id"]},
            data={
                "stripePriceId": subscription["items"]["data"][0]["price"]["id"],
                "stripeCurrentPeriodEnd": period_end,
                "status": subscription["status"]
            }
        )

        # Update user plan based on subscription status
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

    finally:
        await prisma.disconnect()

async def handle_subscription_deleted(subscription):
    """Handle subscription cancellation."""
    prisma = Prisma()
    await prisma.connect()

    try:
        # Update subscription status
        updated_sub = await prisma.subscription.update(
            where={"stripeSubscriptionId": subscription["id"]},
            data={"status": "canceled"}
        )

        # Downgrade user to FREE plan
        await prisma.user.update(
            where={"id": updated_sub.userId},
            data={"plan": "FREE"}
        )

    finally:
        await prisma.disconnect()

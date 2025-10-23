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
        # Create or get Stripe customer
        prisma = Prisma()
        await prisma.connect()
        
        try:
            subscription = await prisma.subscription.find_unique(
                where={"userId": current_user.id}
            )
            
            if subscription:
                customer_id = subscription.stripeCustomerId
            else:
                # Create new Stripe customer
                customer = stripe.Customer.create(
                    email=current_user.email,
                    metadata={"user_id": current_user.id}
                )
                customer_id = customer.id
        finally:
            await prisma.disconnect()
        
        # Create checkout session
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
        
        return CheckoutResponse(
            session_url=session.url,
            session_id=session.id
        )
        
    except stripe.error.StripeError as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Stripe error: {str(e)}"
        )
    except Exception as e:
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
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to create portal session: {str(e)}"
        )
    finally:
        await prisma.disconnect()

@router.get("/subscription", response_model=SubscriptionResponse)
async def get_user_subscription(current_user = Depends(get_current_active_user)):
    """Get current user's subscription details."""
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
        
        return SubscriptionResponse(
            id=subscription.id,
            user_id=subscription.userId,
            stripe_customer_id=subscription.stripeCustomerId,
            stripe_subscription_id=subscription.stripeSubscriptionId,
            stripe_price_id=subscription.stripePriceId,
            stripe_current_period_end=subscription.stripeCurrentPeriodEnd,
            status=subscription.status
        )
        
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
    prisma = Prisma()
    await prisma.connect()
    
    try:
        user_id = session["metadata"]["user_id"]
        customer_id = session["customer"]
        subscription_id = session["subscription"]
        
        # Get subscription details from Stripe
        subscription = stripe.Subscription.retrieve(subscription_id)
        
        # Create or update subscription record
        await prisma.subscription.upsert(
            where={"userId": user_id},
            data={
                "create": {
                    "userId": user_id,
                    "stripeCustomerId": customer_id,
                    "stripeSubscriptionId": subscription_id,
                    "stripePriceId": subscription["items"]["data"][0]["price"]["id"],
                    "stripeCurrentPeriodEnd": subscription["current_period_end"],
                    "status": subscription["status"]
                },
                "update": {
                    "stripeCustomerId": customer_id,
                    "stripeSubscriptionId": subscription_id,
                    "stripePriceId": subscription["items"]["data"][0]["price"]["id"],
                    "stripeCurrentPeriodEnd": subscription["current_period_end"],
                    "status": subscription["status"]
                }
            }
        )
        
    finally:
        await prisma.disconnect()

async def handle_payment_succeeded(invoice):
    """Handle successful payment."""
    # Update subscription status if needed
    pass

async def handle_subscription_updated(subscription):
    """Handle subscription updates."""
    prisma = Prisma()
    await prisma.connect()
    
    try:
        await prisma.subscription.update(
            where={"stripeSubscriptionId": subscription["id"]},
            data={
                "stripePriceId": subscription["items"]["data"][0]["price"]["id"],
                "stripeCurrentPeriodEnd": subscription["current_period_end"],
                "status": subscription["status"]
            }
        )
    finally:
        await prisma.disconnect()

async def handle_subscription_deleted(subscription):
    """Handle subscription cancellation."""
    prisma = Prisma()
    await prisma.connect()
    
    try:
        await prisma.subscription.update(
            where={"stripeSubscriptionId": subscription["id"]},
            data={"status": "canceled"}
        )
    finally:
        await prisma.disconnect()

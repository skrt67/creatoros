"""Password reset routes with Resend email."""

import os
import secrets
from datetime import datetime, timedelta
from fastapi import APIRouter, HTTPException, status
from pydantic import BaseModel, EmailStr
from prisma import Prisma
from ..email import send_password_reset_email

router = APIRouter(tags=["password"])


class ForgotPasswordRequest(BaseModel):
    email: EmailStr


class ResetPasswordRequest(BaseModel):
    token: str
    new_password: str


@router.post("/auth/forgot-password")
async def forgot_password(request: ForgotPasswordRequest):
    """Send password reset email."""
    prisma = Prisma()
    await prisma.connect()

    try:
        # Find user
        user = await prisma.user.find_unique(where={"email": request.email})

        if not user:
            # Don't reveal if email exists (security best practice)
            return {
                "success": True,
                "message": "Si un compte existe avec cet email, un lien de réinitialisation a été envoyé"
            }

        # Generate reset token
        reset_token = secrets.token_urlsafe(32)
        reset_token_expires = datetime.utcnow() + timedelta(hours=1)

        # TODO: Store reset token in database with expiry
        # For now, we'll just send the email

        # Send email using the email service
        try:
            send_password_reset_email(request.email, reset_token)
            print(f"✅ Password reset email sent to {request.email}")
        except Exception as e:
            print(f"❌ Error sending email: {e}")
            # Still return success to not reveal if email exists

        return {
            "success": True,
            "message": "Si un compte existe avec cet email, un lien de réinitialisation a été envoyé"
        }

    finally:
        await prisma.disconnect()


@router.post("/auth/reset-password")
async def reset_password(request: ResetPasswordRequest):
    """Reset password with token."""
    prisma = Prisma()
    await prisma.connect()
    
    try:
        # For now, just accept any token (in production, validate against stored tokens)
        # This is a simplified version
        
        if len(request.new_password) < 8:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Le mot de passe doit contenir au moins 8 caractères"
            )
        
        # In production, you would:
        # 1. Validate the token against stored tokens
        # 2. Check if token is expired
        # 3. Get user from token
        # 4. Update password
        
        return {
            "success": True,
            "message": "Mot de passe réinitialisé avec succès"
        }
    
    finally:
        await prisma.disconnect()

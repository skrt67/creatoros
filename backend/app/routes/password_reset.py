"""Password reset routes with Resend email."""

import os
import secrets
from datetime import datetime, timedelta
from fastapi import APIRouter, HTTPException, status
from pydantic import BaseModel, EmailStr
from prisma import Prisma
from ..email import send_password_reset_email
from ..auth import get_password_hash

router = APIRouter(tags=["password"])

# In-memory store for reset tokens (in production, use Redis or database)
reset_tokens = {}


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

        # Store reset token with expiry and email
        reset_tokens[reset_token] = {
            "email": request.email,
            "expires": reset_token_expires
        }

        # Send email using the email service
        try:
            send_password_reset_email(request.email, reset_token)
            print(f"✅ Password reset email sent to {request.email}, token stored")
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
        # Validate password length
        if len(request.new_password) < 8:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Le mot de passe doit contenir au moins 8 caractères"
            )

        # Check if token exists
        if request.token not in reset_tokens:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Token invalide ou expiré"
            )

        token_data = reset_tokens[request.token]

        # Check if token is expired
        if datetime.utcnow() > token_data["expires"]:
            del reset_tokens[request.token]
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Token expiré"
            )

        # Get user by email
        user = await prisma.user.find_unique(where={"email": token_data["email"]})
        if not user:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Utilisateur non trouvé"
            )

        # Hash new password
        hashed_password = get_password_hash(request.new_password)

        # Update user password
        await prisma.user.update(
            where={"id": user.id},
            data={"hashedPassword": hashed_password}
        )

        # Delete used token
        del reset_tokens[request.token]

        print(f"✅ Password reset successfully for {token_data['email']}")

        return {
            "success": True,
            "message": "Mot de passe réinitialisé avec succès"
        }

    finally:
        await prisma.disconnect()

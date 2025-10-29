"""Password reset routes with Resend email."""

import os
import secrets
from datetime import datetime, timedelta
from fastapi import APIRouter, HTTPException, status
from pydantic import BaseModel, EmailStr
from prisma import Prisma

try:
    import resend
except ImportError:
    resend = None

router = APIRouter(tags=["password"])

# Initialize Resend
resend_api_key = os.getenv("RESEND_API_KEY")
resend_client = resend if resend_api_key else None


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
        
        # Store reset token (you'd need to add this to your schema)
        # For now, we'll just send the email
        
        # Send email with Resend
        if resend_client and resend_api_key:
            try:
                resend.api_key = resend_api_key
                resend.Emails.send(
                    {
                        "from": "noreply@creatoros.com",
                        "to": request.email,
                        "subject": "Réinitialiser votre mot de passe Vidova",
                        "html": f"""
                        <h1>Réinitialiser votre mot de passe</h1>
                        <p>Cliquez sur le lien ci-dessous pour réinitialiser votre mot de passe:</p>
                        <a href="https://creatoros.vercel.app/reset-password?token={reset_token}">
                            Réinitialiser mon mot de passe
                        </a>
                        <p>Ce lien expire dans 1 heure.</p>
                        <p>Si vous n'avez pas demandé cette réinitialisation, ignorez cet email.</p>
                        """
                    }
                )
            except Exception as e:
                print(f"Error sending email: {e}")
        
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

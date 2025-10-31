"""Password reset routes with Resend email."""

import os
import secrets
import json
from pathlib import Path
from datetime import datetime, timedelta
from fastapi import APIRouter, HTTPException, status
from pydantic import BaseModel, EmailStr
from prisma import Prisma
from ..email import send_password_reset_email
from ..auth import get_password_hash

router = APIRouter(tags=["password"])

# Token storage file path
TOKENS_FILE = Path("/tmp/reset_tokens.json")

def load_tokens():
    """Load tokens from file."""
    if TOKENS_FILE.exists():
        try:
            with open(TOKENS_FILE, 'r') as f:
                data = json.load(f)
                # Convert string dates back to datetime
                for token, token_data in data.items():
                    token_data['expires'] = datetime.fromisoformat(token_data['expires'])
                return data
        except Exception as e:
            print(f"Error loading tokens: {e}")
            return {}
    return {}

def save_tokens(tokens):
    """Save tokens to file."""
    print(f"🔄 save_tokens() called with {len(tokens)} tokens")
    print(f"📁 Token file path: {TOKENS_FILE}")
    try:
        # Convert datetime to ISO string for JSON serialization
        data = {}
        for token, token_data in tokens.items():
            data[token] = {
                'email': token_data['email'],
                'expires': token_data['expires'].isoformat()
            }
        print(f"📝 Writing {len(data)} tokens to file...")
        with open(TOKENS_FILE, 'w') as f:
            json.dump(data, f)
        print(f"✅ Successfully saved {len(data)} tokens to {TOKENS_FILE}")

        # Verify file was created
        if TOKENS_FILE.exists():
            size = TOKENS_FILE.stat().st_size
            print(f"✅ File exists, size: {size} bytes")
        else:
            print(f"❌ WARNING: File does not exist after write!")
    except Exception as e:
        print(f"❌ Error saving tokens: {e}")
        import traceback
        traceback.print_exc()


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
        print(f"🔑 Generated reset token: {reset_token[:10]}... for {request.email}")

        # Load existing tokens and add new one
        print(f"📂 Loading existing tokens...")
        reset_tokens = load_tokens()
        print(f"📋 Loaded {len(reset_tokens)} existing tokens")

        reset_tokens[reset_token] = {
            "email": request.email,
            "expires": reset_token_expires
        }
        print(f"➕ Added new token, total now: {len(reset_tokens)}")
        print(f"💾 Calling save_tokens()...")
        save_tokens(reset_tokens)
        print(f"✅ Token save complete")

        # Send email using the email service
        try:
            send_password_reset_email(request.email, reset_token)
            print(f"✅ Password reset email sent to {request.email}, token stored in file")
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

        # Load tokens from file
        reset_tokens = load_tokens()

        # Check if token exists
        if request.token not in reset_tokens:
            print(f"❌ Token not found: {request.token[:10]}... Available tokens: {len(reset_tokens)}")
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Token invalide ou expiré"
            )

        token_data = reset_tokens[request.token]

        # Check if token is expired
        if datetime.utcnow() > token_data["expires"]:
            del reset_tokens[request.token]
            save_tokens(reset_tokens)
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

        # Delete used token and save
        del reset_tokens[request.token]
        save_tokens(reset_tokens)

        print(f"✅ Password reset successfully for {token_data['email']}")

        return {
            "success": True,
            "message": "Mot de passe réinitialisé avec succès"
        }

    finally:
        await prisma.disconnect()

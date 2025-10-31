"""Email service using Resend."""

import os
import resend
import secrets

def generate_reset_token():
    """Generate a secure reset token."""
    return secrets.token_urlsafe(32)

def send_password_reset_email(email: str, reset_token: str):
    """Send password reset email."""
    # Set API key at runtime to ensure it's fresh
    resend.api_key = os.getenv("RESEND_API_KEY")

    reset_url = f"https://creatoros-henna.vercel.app/reset-password?token={reset_token}"

    params = {
        "from": "Vidova <onboarding@resend.dev>",
        "to": [email],
        "subject": "Réinitialisation de votre mot de passe Vidova",
        "html": f"""
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #6366f1;">Réinitialisation de mot de passe</h2>
            <p>Vous avez demandé à réinitialiser votre mot de passe Vidova.</p>
            <p>Cliquez sur le lien ci-dessous pour créer un nouveau mot de passe :</p>
            <a href="{reset_url}" style="display: inline-block; padding: 12px 24px; background-color: #6366f1; color: white; text-decoration: none; border-radius: 8px; margin: 20px 0;">
                Réinitialiser mon mot de passe
            </a>
            <p style="color: #666; font-size: 14px;">Ce lien expire dans 1 heure.</p>
            <p style="color: #666; font-size: 14px;">Si vous n'avez pas demandé cette réinitialisation, ignorez cet email.</p>
        </div>
        """
    }

    try:
        email_response = resend.Emails.send(params)
        print(f"✅ Email sent to {email}: {email_response}")
        return True
    except Exception as e:
        print(f"❌ Failed to send email: {str(e)}")
        return False

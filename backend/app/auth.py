"""Authentication utilities and dependencies."""

import os
from datetime import datetime, timedelta
from typing import Optional
from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from jose import JWTError, jwt
from passlib.context import CryptContext
from prisma import Prisma

from .models import TokenData

# Configuration
SECRET_KEY = os.getenv("JWT_SECRET_KEY", "your-secret-key-change-in-production")
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30

# Password hashing context
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

# JWT Bearer scheme
security = HTTPBearer()

def verify_password(plain_password: str, hashed_password: str) -> bool:
    """Verify a password against its hash."""
    try:
        return pwd_context.verify(plain_password, hashed_password)
    except Exception as e:
        print(f"Password verification error: {e}")
        return False

def get_password_hash(password: str) -> str:
    """Hash a password."""
    return pwd_context.hash(password)

def create_access_token(data: dict, expires_delta: Optional[timedelta] = None) -> str:
    """Create a JWT access token."""
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

async def get_user_by_email(email: str):
    """Get user by email address."""
    prisma = Prisma()
    await prisma.connect()

    try:
        user = await prisma.user.find_unique(
            where={"email": email},
            include={"workspaces": True}
        )
        return user
    finally:
        await prisma.disconnect()

async def get_user_by_id(user_id: str):
    """Get user by user ID."""
    prisma = Prisma()
    await prisma.connect()

    try:
        user = await prisma.user.find_unique(
            where={"id": user_id},
            include={"workspaces": True}
        )
        return user
    finally:
        await prisma.disconnect()

async def authenticate_user(email: str, password: str):
    """Authenticate user with email and password."""
    user = await get_user_by_email(email)
    if not user:
        return False
    if not verify_password(password, user.hashedPassword):
        return False
    return user

async def get_current_user(credentials: HTTPAuthorizationCredentials = Depends(security)):
    """Get current authenticated user from JWT token."""
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )

    try:
        token = credentials.credentials
        print(f"🔑 Validating token (first 20 chars): {token[:20]}...")
        print(f"🔐 Using SECRET_KEY (first 10 chars): {SECRET_KEY[:10]}...")
        
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        user_id: str = payload.get("sub")
        
        print(f"✅ Token decoded successfully. User ID: {user_id}")
        
        if user_id is None:
            print("❌ No user_id (sub) in token payload")
            raise credentials_exception
            
        # Keep email for backwards compatibility
        email: str = payload.get("email")
        token_data = TokenData(email=email or user_id)
        
    except JWTError as e:
        print(f"❌ JWT Error: {str(e)}")
        raise credentials_exception
    except Exception as e:
        print(f"❌ Unexpected error during token validation: {str(e)}")
        raise credentials_exception

    user = await get_user_by_id(user_id=user_id)
    if user is None:
        print(f"❌ User not found with ID: {user_id}")
        raise credentials_exception
        
    print(f"✅ User authenticated: {user.email}")
    return user

async def get_current_active_user(current_user = Depends(get_current_user)):
    """Get current active user (placeholder for future user status checks)."""
    return current_user

def check_workspace_access(user_id: str, workspace_id: str) -> bool:
    """Check if user has access to workspace."""
    # This will be implemented with database check
    # For now, we'll implement it in the route handlers
    return True

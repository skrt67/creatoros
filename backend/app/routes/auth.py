"""Authentication routes."""

from datetime import timedelta
from fastapi import APIRouter, Depends, HTTPException, status
from prisma import Prisma

from ..models import UserCreate, UserLogin, Token, UserResponse, APIResponse
from ..auth import (
    authenticate_user,
    create_access_token,
    get_password_hash,
    get_current_active_user,
    ACCESS_TOKEN_EXPIRE_MINUTES
)

router = APIRouter(prefix="/auth", tags=["authentication"])

@router.post("/register", response_model=APIResponse)
async def register_user(user_data: UserCreate):
    """Register a new user with workspace."""
    prisma = Prisma()
    await prisma.connect()
    
    try:
        # Check if user already exists
        existing_user = await prisma.user.find_unique(
            where={"email": user_data.email}
        )
        
        if existing_user:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Email already registered"
            )
        
        # Hash password
        hashed_password = get_password_hash(user_data.password)
        
        # Create user with workspace in a transaction
        async with prisma.tx() as transaction:
            # Create user
            user = await transaction.user.create(
                data={
                    "email": user_data.email,
                    "hashedPassword": hashed_password
                }
            )
            
            # Create default workspace
            workspace = await transaction.workspace.create(
                data={
                    "name": user_data.workspace_name,
                    "ownerId": user.id
                }
            )
        
        return APIResponse(
            success=True,
            message="User registered successfully",
            data={
                "user_id": user.id,
                "workspace_id": workspace.id
            }
        )
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Registration failed: {str(e)}"
        )
    finally:
        await prisma.disconnect()

@router.post("/login", response_model=Token)
async def login_user(user_credentials: UserLogin):
    """Authenticate user and return access token."""
    print(f"🔍 Login attempt for: {user_credentials.email}")
    user = await authenticate_user(user_credentials.email, user_credentials.password)
    print(f"🔍 Authentication result: {user is not None}")
    
    if not user:
        print(f"❌ Authentication failed for: {user_credentials.email}")
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": user.email}, expires_delta=access_token_expires
    )
    
    return Token(
        access_token=access_token,
        token_type="bearer",
        expires_in=ACCESS_TOKEN_EXPIRE_MINUTES * 60
    )

@router.get("/me", response_model=UserResponse)
async def get_current_user_info(current_user = Depends(get_current_active_user)):
    """Get current user information."""
    return UserResponse(
        id=current_user.id,
        email=current_user.email,
        created_at=current_user.createdAt,
        updated_at=current_user.updatedAt
    )

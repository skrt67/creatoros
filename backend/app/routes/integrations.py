"""Integration routes for external services like Discord."""

import os
import discord
from discord.ext import commands
from fastapi import APIRouter, Depends, HTTPException, status
from prisma import Prisma

from ..models import DiscordSyncRequest, APIResponse
from ..auth import get_current_active_user

router = APIRouter(prefix="/integrations", tags=["integrations"])

# Discord bot setup
discord_bot_token = os.getenv("DISCORD_BOT_TOKEN")
discord_guild_id = os.getenv("DISCORD_GUILD_ID")

# Initialize Discord client
intents = discord.Intents.default()
intents.members = True
bot = commands.Bot(command_prefix="!", intents=intents)

@router.post("/discord/sync-roles", response_model=APIResponse)
async def sync_discord_roles(
    sync_data: DiscordSyncRequest,
    current_user = Depends(get_current_active_user)
):
    """Sync Discord roles based on subscription status."""
    if not discord_bot_token:
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail="Discord integration not configured"
        )
    
    try:
        # Verify user has active subscription
        prisma = Prisma()
        await prisma.connect()
        
        try:
            subscription = await prisma.subscription.find_unique(
                where={"userId": current_user.id}
            )
            
            if not subscription or subscription.status != "active":
                raise HTTPException(
                    status_code=status.HTTP_403_FORBIDDEN,
                    detail="Active subscription required"
                )
        finally:
            await prisma.disconnect()
        
        # Connect to Discord and assign role
        if not bot.is_ready():
            await bot.login(discord_bot_token)
        
        guild = bot.get_guild(int(discord_guild_id))
        if not guild:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Discord server not found"
            )
        
        member = guild.get_member(int(sync_data.discord_user_id))
        if not member:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Discord user not found in server"
            )
        
        role = discord.utils.get(guild.roles, name=sync_data.role_name)
        if not role:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Role '{sync_data.role_name}' not found"
            )
        
        await member.add_roles(role)
        
        return APIResponse(
            success=True,
            message=f"Successfully assigned role '{sync_data.role_name}' to user"
        )
        
    except discord.errors.Forbidden:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Bot lacks permission to assign roles"
        )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to sync Discord roles: {str(e)}"
        )

@router.delete("/discord/remove-roles", response_model=APIResponse)
async def remove_discord_roles(
    sync_data: DiscordSyncRequest,
    current_user = Depends(get_current_active_user)
):
    """Remove Discord roles (e.g., when subscription ends)."""
    if not discord_bot_token:
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail="Discord integration not configured"
        )
    
    try:
        # Connect to Discord and remove role
        if not bot.is_ready():
            await bot.login(discord_bot_token)
        
        guild = bot.get_guild(int(discord_guild_id))
        if not guild:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Discord server not found"
            )
        
        member = guild.get_member(int(sync_data.discord_user_id))
        if not member:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Discord user not found in server"
            )
        
        role = discord.utils.get(guild.roles, name=sync_data.role_name)
        if not role:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Role '{sync_data.role_name}' not found"
            )
        
        await member.remove_roles(role)
        
        return APIResponse(
            success=True,
            message=f"Successfully removed role '{sync_data.role_name}' from user"
        )
        
    except discord.errors.Forbidden:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Bot lacks permission to remove roles"
        )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to remove Discord roles: {str(e)}"
        )

@router.get("/discord/status", response_model=APIResponse)
async def get_discord_integration_status():
    """Get Discord integration status."""
    if not discord_bot_token:
        return APIResponse(
            success=False,
            message="Discord integration not configured"
        )
    
    try:
        if not bot.is_ready():
            await bot.login(discord_bot_token)
        
        guild = bot.get_guild(int(discord_guild_id)) if discord_guild_id else None
        
        return APIResponse(
            success=True,
            message="Discord integration active",
            data={
                "bot_connected": bot.is_ready(),
                "guild_connected": guild is not None,
                "guild_name": guild.name if guild else None
            }
        )
        
    except Exception as e:
        return APIResponse(
            success=False,
            message=f"Discord integration error: {str(e)}"
        )

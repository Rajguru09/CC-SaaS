##backend/app/api/users.py
import logging
from fastapi import APIRouter, HTTPException, Depends
from app.core.db import table
from app.models.user import User
from app.core.security import get_current_user

logger = logging.getLogger(__name__)
router = APIRouter()

@router.get("/dashboard")
async def get_dashboard(user: User = Depends(get_current_user)):
    try:
        response = table.get_item(Key={"email": user.email})
        user_data = response.get("Item")
        if not user_data:
            raise HTTPException(status_code=404, detail="User data not found")
        
        logger.info(f"Fetched dashboard for {user.email}")
        return {"dashboard": user_data}
    except Exception as e:
        logger.error(f"Dashboard fetch failed: {e}")
        raise HTTPException(status_code=500, detail="Failed to fetch dashboard")

@router.get("/")
async def get_users():
    try:
        response = table.scan()
        users = response.get("Items", [])
        if not users:
            raise HTTPException(status_code=404, detail="No users found")
        return {"users": users}
    except Exception as e:
        logger.error(f"Error fetching users: {e}")
        raise HTTPException(status_code=500, detail="Failed to fetch users")

@router.get("/{email}")
async def get_user(email: str):
    try:
        response = table.get_item(Key={"email": email})
        user = response.get("Item")
        if not user:
            raise HTTPException(status_code=404, detail="User not found")
        return {"user": user}
    except Exception as e:
        logger.error(f"Error fetching user {email}: {e}")
        raise HTTPException(status_code=500, detail="Failed to fetch user")

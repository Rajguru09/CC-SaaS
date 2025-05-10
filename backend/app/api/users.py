import logging
from fastapi import APIRouter, HTTPException, Depends
from app.core.db import table
from app.models.user import User
from app.core.security import get_current_user

# Set up logging
logger = logging.getLogger(__name__)

router = APIRouter()

@router.get("/")
async def get_users():
    try:
        response = table.scan()
        users = response.get("Items", [])
        
        if not users:
            raise HTTPException(status_code=404, detail="No users found")
        
        return {"users": users}
    except Exception as e:
        logger.error(f"Error fetching users: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Error fetching users: {str(e)}")

@router.get("/{email}")
async def get_user(email: str):
    try:
        response = table.get_item(Key={"email": email})
        user = response.get("Item")
        
        if not user:
            raise HTTPException(status_code=404, detail="User not found")
        
        return {"user": user}
    except Exception as e:
        logger.error(f"Error fetching user with email {email}: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Error fetching user: {str(e)}")

@router.get("/dashboard")
async def get_dashboard(user: User = Depends(get_current_user)):
    try:
        response = table.get_item(Key={"email": user.email})
        
        if 'Item' not in response:
            raise HTTPException(status_code=404, detail="User data not found")
        
        logger.info(f"Fetched dashboard data for user with email {user.email}")
        return {"dashboard": response["Item"]}
    except Exception as e:
        logger.error(f"Error fetching dashboard for user with email {user.email}: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Error fetching dashboard: {str(e)}")

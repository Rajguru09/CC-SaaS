from fastapi import APIRouter, HTTPException, Depends
from app.core.db import table
from app.models.user import User
from app.core.security import get_current_user  # Assuming you have a function to get current user from JWT
import logging

# Initialize logger
logger = logging.getLogger(__name__)
logger.setLevel(logging.INFO)

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
        # Use email as the primary key to fetch the user
        response = table.get_item(Key={"email": email})
        user = response.get("Item")
        
        if not user:
            raise HTTPException(status_code=404, detail="User not found")
        
        return {"user": user}
    except Exception as e:
        logger.error(f"Error fetching user with email {email}: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Error fetching user: {str(e)}")

# Dashboard route - fetch user data for the logged-in user
@router.get("/dashboard")
async def get_dashboard(user: User = Depends(get_current_user)):  # Assuming you have a dependency to get the current user from JWT
    try:
        # Use the user's UID to fetch their dashboard data
        response = table.get_item(Key={"uid": user.uid})
        
        # Ensure proper response handling for DynamoDB
        if 'Item' not in response:
            raise HTTPException(status_code=404, detail="User data not found")
        
        logger.info(f"Fetched dashboard data for user {user.uid}")
        return {"dashboard": response["Item"]}  # Customize based on your dashboard data
    except Exception as e:
        logger.error(f"Error fetching dashboard for user {user.uid}: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Error fetching dashboard: {str(e)}")

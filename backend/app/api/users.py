import logging
from fastapi import APIRouter, HTTPException, Depends
from app.core.db import table
from app.models.user import User, UserOut  # Importing response models
from app.core.security import get_current_user  # Assuming you have a function to get current user from JWT

# Initialize logger
logger = logging.getLogger(__name__)
logger.setLevel(logging.INFO)

router = APIRouter()

@router.get("/dashboard", response_model=UserOut)  # Returning user dashboard data
async def get_dashboard(user: User = Depends(get_current_user)):  # Assuming you have a dependency to get the current user from JWT
    try:
        # Assuming 'user.email' contains the email of the logged-in user
        response = table.get_item(Key={"email": user.email})
        
        # Ensure proper response handling for DynamoDB
        if 'Item' not in response:
            raise HTTPException(status_code=404, detail="User data not found")
        
        logger.info(f"Fetched dashboard data for user with email {user.email}")
        return response["Item"]  # Customize based on your dashboard data
    except Exception as e:
        logger.exception(f"Error fetching dashboard for user with email {user.email}")
        raise HTTPException(status_code=500, detail="Internal server error")

@router.get("/", response_model=dict[str, list[UserOut]])  # Response model is now a list of users
async def get_users():
    try:
        response = table.scan()
        users = response.get("Items", [])
        
        if not users:
            raise HTTPException(status_code=404, detail="No users found")
        
        return {"users": users}
    except Exception as e:
        logger.exception("Error fetching users")
        raise HTTPException(status_code=500, detail="Internal server error")

@router.get("/{email}", response_model=UserOut)  # Return a single user from email
async def get_user(email: str):
    try:
        # Use email as the primary key to fetch the user
        response = table.get_item(Key={"email": email})
        user = response.get("Item")
        
        if not user:
            raise HTTPException(status_code=404, detail="User not found")
        
        return {"user": user}
    except Exception as e:
        logger.exception(f"Error fetching user with email {email}")
        raise HTTPException(status_code=500, detail="Internal server error")

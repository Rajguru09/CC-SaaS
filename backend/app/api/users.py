from fastapi import APIRouter, HTTPException
from app.core.db import table
import logging

# Set up logging
logger = logging.getLogger(__name__)

router = APIRouter()

@router.get("/")
async def get_users():
    try:
        # Perform the scan operation to retrieve users
        response = table.scan()
        users = response.get("Items", [])
        
        if not users:
            logger.info("No users found in the database.")
            raise HTTPException(status_code=404, detail="No users found")
        
        logger.info(f"Successfully retrieved {len(users)} users.")
        return {"users": users}
    
    except Exception as e:
        logger.error(f"Error fetching users from DynamoDB: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Error fetching users: {str(e)}")

@router.get("/{email}")
async def get_user(email: str):
    try:
        # Use email as the primary key to fetch the user
        response = table.get_item(Key={"email": email})
        user = response.get("Item")
        
        if not user:
            logger.warning(f"User with email {email} not found.")
            raise HTTPException(status_code=404, detail="User not found")
        
        logger.info(f"Successfully retrieved user with email: {email}.")
        return {"user": user}
    
    except Exception as e:
        logger.error(f"Error fetching user with email {email}: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Error fetching user: {str(e)}")

# backend/app/api/users.py
from fastapi import APIRouter, HTTPException
from app.core.db import table

router = APIRouter()

@router.get("/")
async def get_users():
    try:
        # Scan the DynamoDB table to fetch all users (not efficient for large tables)
        # For large data, consider optimizing with query or pagination
        response = table.scan()
        users = response.get("Items", [])
        
        if not users:
            # Return an empty list if no users are found
            raise HTTPException(status_code=404, detail="No users found")
        
        return {"users": users}
    except Exception as e:
        # If an error occurs, raise a 500 Internal Server Error
        raise HTTPException(status_code=500, detail=f"Error fetching users: {str(e)}")

@router.get("/{uid}")
async def get_user(uid: str):
    try:
        # Get a specific user from DynamoDB based on UID
        response = table.get_item(Key={"uid": uid})
        user = response.get("Item")
        
        if not user:
            # If no user is found, raise a 404 Not Found error
            raise HTTPException(status_code=404, detail="User not found")
        
        return {"user": user}
    except Exception as e:
        # If an error occurs, raise a 500 Internal Server Error
        raise HTTPException(status_code=500, detail=f"Error fetching user: {str(e)}")

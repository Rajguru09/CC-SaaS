# backend/app/api/users.py
from fastapi import APIRouter, HTTPException
from app.core.db import table

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
        raise HTTPException(status_code=500, detail=f"Error fetching user: {str(e)}")

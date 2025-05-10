from fastapi import APIRouter, HTTPException
from app.models.user import UserCreate, UserLogin, TokenOut
from app.core.security import hash_password, verify_password, create_access_token
from app.core.db import table
import uuid
import logging

# Set up logging
logger = logging.getLogger(__name__)

router = APIRouter()

# Signup route
@router.post("/signup", response_model=TokenOut)
def signup(user_data: UserCreate):
    # Check if the email already exists in DynamoDB
    try:
        response = table.get_item(Key={"email": user_data.email})
        if response.get("Item"):
            raise HTTPException(status_code=400, detail="Email already registered")
    except Exception as e:
        logger.error(f"Error checking email in DynamoDB: {e}")
        raise HTTPException(status_code=500, detail="Error checking email availability")

    # Generate a unique ID for the user
    uid = str(uuid.uuid4())

    # Hash the password before storing
    hashed_pwd = hash_password(user_data.password)

    # Insert user data into DynamoDB (ensure you have the proper attributes)
    try:
        table.put_item(Item={
            "uid": uid,
            "email": user_data.email,
            "password": hashed_pwd,
            "role": "basic"  # Default role if not provided
        })
        logger.info(f"New user created with email: {user_data.email} and UID: {uid}")
    except Exception as e:
        logger.error(f"Error saving user to DynamoDB: {e}")
        raise HTTPException(status_code=500, detail=f"Error saving user: {str(e)}")

    # Create the JWT token for the new user
    token = create_access_token({"sub": user_data.email, "uid": uid})

    # Return the JWT token for authentication
    return {"access_token": token, "token_type": "bearer"}

# Login route
@router.post("/login", response_model=TokenOut)
def login(user_data: UserLogin):
    # Retrieve the user from DynamoDB based on email
    try:
        response = table.get_item(Key={"email": user_data.email})
        db_user = response.get("Item")
    except Exception as e:
        logger.error(f"Error retrieving user from DynamoDB: {e}")
        raise HTTPException(status_code=500, detail="Error retrieving user data")

    # If the user is not found or the password doesn't match, raise an error
    if not db_user or not verify_password(user_data.password, db_user["password"]):
        logger.warning(f"Failed login attempt for email: {user_data.email}")
        raise HTTPException(status_code=401, detail="Invalid credentials")

    # Create a JWT token for the logged-in user
    token = create_access_token({"sub": user_data.email, "uid": db_user["uid"]})

    # Return the JWT token for authentication
    return {"access_token": token, "token_type": "bearer"}

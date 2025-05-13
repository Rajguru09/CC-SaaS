import logging
from fastapi import APIRouter, HTTPException, Depends
from app.models.user import UserCreate, UserLogin, TokenOut
from app.core.security import hash_password, verify_password, create_access_token
from app.core.db import table
import uuid
from pydantic import EmailStr, Field

# Set up logging
logger = logging.getLogger(__name__)

router = APIRouter()

# Updated UserCreate model with validation
class UserCreateWithValidation(UserCreate):
    email: EmailStr  # Ensures that the email is valid
    password: str = Field(..., min_length=8)  # Password must be at least 8 characters

# Signup route
@router.post("/signup", response_model=TokenOut)
def signup(user_data: UserCreateWithValidation):
    try:
        # Check if the email already exists in the database
        response = table.get_item(Key={"email": user_data.email})
        if response.get("Item"):
            raise HTTPException(status_code=400, detail="Email already registered")
    except Exception as e:
        logger.error(f"Error checking email in DynamoDB for {user_data.email}: {e}")
        raise HTTPException(status_code=500, detail="Error checking email availability")

    # Generate a unique user ID and hash the password
    uid = str(uuid.uuid4())
    hashed_pwd = hash_password(user_data.password)

    try:
        # Save user details in DynamoDB
        table.put_item(Item={
            "uid": uid,
            "email": user_data.email,
            "password": hashed_pwd,
            "role": "basic"  # Default role
        })
        logger.info(f"New user created with email: {user_data.email} and UID: {uid}")
    except Exception as e:
        logger.error(f"Error saving user {user_data.email} to DynamoDB: {e}")
        raise HTTPException(status_code=500, detail=f"Error saving user: {str(e)}")

    # Create JWT token
    token = create_access_token({"sub": user_data.email, "uid": uid})
    return {"access_token": token, "token_type": "bearer"}

# Login route
@router.post("/login", response_model=TokenOut)
def login(user_data: UserLogin):
    try:
        # Retrieve the user by email
        response = table.get_item(Key={"email": user_data.email})
        db_user = response.get("Item")

        # If user does not exist, raise error
        if not db_user:
            raise HTTPException(status_code=404, detail="User not found")
        
        # Verify password
        if not verify_password(user_data.password, db_user["password"]):
            logger.warning(f"Failed login attempt for email: {user_data.email}")
            raise HTTPException(status_code=401, detail="Invalid credentials")
        
    except Exception as e:
        logger.error(f"Error retrieving or verifying user {user_data.email}: {e}")
        raise HTTPException(status_code=500, detail="Error logging in")

    # Create JWT token after successful login
    token = create_access_token({"sub": user_data.email, "uid": db_user["uid"]})
    return {"access_token": token, "token_type": "bearer", "user": db_user}

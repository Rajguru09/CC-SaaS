import logging
import uuid
from fastapi import APIRouter, HTTPException
from app.models.user import UserCreate, UserLogin, TokenOut
from app.core.security import hash_password, verify_password, create_access_token
from app.core.db import table
from pydantic import EmailStr, Field

logger = logging.getLogger(__name__)
router = APIRouter()

# Extended model for input validation
class UserCreateWithValidation(UserCreate):
    email: EmailStr
    password: str = Field(..., min_length=8)

@router.post("/signup", response_model=TokenOut)
def signup(user_data: UserCreateWithValidation):
    try:
        # Check if the user already exists
        response = table.get_item(Key={"email": user_data.email})
        if response.get("Item"):
            raise HTTPException(status_code=400, detail="Email already registered")
    except Exception as e:
        logger.error(f"Error checking existing user: {e}")
        raise HTTPException(status_code=500, detail="Error checking user existence")

    uid = str(uuid.uuid4())
    hashed_pwd = hash_password(user_data.password)

    try:
        table.put_item(Item={
            "uid": uid,
            "email": user_data.email,
            "password": hashed_pwd,
            "role": "basic"
        })
        logger.info(f"New user created: {user_data.email}")
    except Exception as e:
        logger.error(f"Error saving new user: {e}")
        raise HTTPException(status_code=500, detail="Error saving user")

    token = create_access_token({"sub": user_data.email, "uid": uid})
    return {"access_token": token, "token_type": "bearer"}

@router.post("/login", response_model=TokenOut)
def login(user_data: UserLogin):
    try:
        response = table.get_item(Key={"email": user_data.email})
        db_user = response.get("Item")
        if not db_user:
            raise HTTPException(status_code=404, detail="User not found")

        if not verify_password(user_data.password, db_user["password"]):
            logger.warning(f"Invalid login attempt: {user_data.email}")
            raise HTTPException(status_code=401, detail="Invalid credentials")
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error during login: {e}")
        raise HTTPException(status_code=500, detail="Login failed")

    token = create_access_token({"sub": user_data.email, "uid": db_user["uid"]})
    return {
        "access_token": token,
        "token_type": "bearer",
        "user": db_user
    }

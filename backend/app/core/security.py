from fastapi.security import OAuth2PasswordBearer
from passlib.context import CryptContext
from jose import jwt, JWTError
from datetime import datetime, timedelta
from fastapi import HTTPException, Security, Depends
from app.models.user import User
from app.core.config import settings
from app.core.db import table
import logging

# Set up logger for better debugging and error handling
logger = logging.getLogger(__name__)

# OAuth2 scheme to extract token from Authorization header
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")

# Initialize password context for hashing and verifying passwords
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

# Function to create an access token (JWT)
def create_access_token(data: dict, expires_delta: int = 3600):
    to_encode = data.copy()
    expire = datetime.utcnow() + timedelta(seconds=expires_delta)
    to_encode.update({"exp": expire})

    try:
        token = jwt.encode(to_encode, settings.JWT_SECRET_KEY, algorithm=settings.JWT_ALGORITHM)
        logger.info(f"Access token successfully created for user: {data.get('sub')}.")
        return token
    except JWTError as e:
        logger.error(f"JWT encoding failed: {e}")
        raise Exception("Error creating access token due to JWT encoding failure.")
    except Exception as e:
        logger.error(f"Unexpected error while creating access token: {e}")
        raise Exception("Unexpected error creating access token.")

# Function to verify if the provided plain password matches the hashed password
def verify_password(plain_password: str, hashed_password: str) -> bool:
    try:
        is_verified = pwd_context.verify(plain_password, hashed_password)
        if is_verified:
            logger.info("Password verification successful.")
        else:
            logger.warning("Password verification failed.")
        return is_verified
    except Exception as e:
        logger.error(f"Error verifying password: {e}")
        raise Exception("Error verifying password.")

# Function to hash a plain password using bcrypt
def hash_password(password: str) -> str:
    try:
        hashed_pw = pwd_context.hash(password)
        logger.info("Password successfully hashed.")
        return hashed_pw
    except Exception as e:
        logger.error(f"Error hashing password: {e}")
        raise Exception("Error hashing password.")

# Function to decode JWT token and extract user info
def decode_jwt(token: str):
    try:
        payload = jwt.decode(token, settings.JWT_SECRET_KEY, algorithms=[settings.JWT_ALGORITHM])
        return payload
    except JWTError:
        raise HTTPException(status_code=401, detail="Invalid token")

# Dependency to get the current user from the JWT token
def get_current_user(token: str = Depends(oauth2_scheme)) -> User:
    try:
        payload = decode_jwt(token)
        user = get_user_by_uid(payload["sub"])  # Fetch user from database using UID (assuming 'sub' is UID)
        
        if not user:
            raise HTTPException(status_code=404, detail="User not found")
        
        return user
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error extracting user from token: {str(e)}")

# Helper function to retrieve a user from the database using UID
def get_user_by_uid(uid: str) -> User:
    try:
        response = table.get_item(Key={"uid": uid})
        user = response.get("Item")
        
        if not user:
            return None
        
        return User(**user)  # Assuming the user data matches the User model structure
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error fetching user: {str(e)}")

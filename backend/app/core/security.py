# backend/app/core/security.py

from passlib.context import CryptContext
from jose import jwt, JWTError
from datetime import datetime, timedelta
from app.core.config import settings
import logging

# Set up logger for better debugging and error handling
logger = logging.getLogger(__name__)
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

# Function to create an access token (JWT)
def create_access_token(data: dict, expires_delta: int = 3600) -> str:
    """
    Creates an access token with an expiration time.
    :param data: The data to be encoded in the JWT (e.g., user email, UID).
    :param expires_delta: The time in seconds until the token expires. Default is 1 hour (3600 seconds).
    :return: JWT as a string.
    """
    to_encode = data.copy()
    expire = datetime.utcnow() + timedelta(seconds=expires_delta)
    to_encode.update({"exp": expire})

    try:
        # Encode the JWT with the secret key and algorithm
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
    """
    Verifies if the provided plain password matches the hashed password.
    :param plain_password: The password entered by the user.
    :param hashed_password: The hashed password stored in the database.
    :return: Boolean indicating whether the passwords match.
    """
    try:
        is_verified = pwd_context.verify(plain_password, hashed_password)
        if is_verified:
            logger.info("Password verification successful.")
        else:
            logger.warning("Password verification failed.")
        return is_verified
    except Exception as e:
        logger.error(f"Error verifying password: {e}")
        raise Exception("Error verifying password due to an internal issue.")

# Function to hash a plain password using bcrypt
def hash_password(password: str) -> str:
    """
    Hashes the plain password using bcrypt.
    :param password: The plain text password to be hashed.
    :return: The hashed password.
    """
    try:
        hashed_pw = pwd_context.hash(password)
        logger.info("Password successfully hashed.")
        return hashed_pw
    except Exception as e:
        logger.error(f"Error hashing password: {e}")
        raise Exception("Error hashing password due to an internal issue.")

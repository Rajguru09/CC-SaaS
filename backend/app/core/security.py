#backend/app/core/security.py
from passlib.context import CryptContext
from jose import jwt
from datetime import datetime, timedelta
from app.core.config import settings
import logging

# Set up logger for better debugging
logger = logging.getLogger(__name__)
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def create_access_token(data: dict, expires_delta: int = 60*60):
    """
    Creates an access token with an expiration time.
    :param data: The data to be encoded in the JWT (e.g., user email, UID).
    :param expires_delta: The time in seconds until the token expires. Default is 1 hour.
    :return: JWT as a string.
    """
    to_encode = data.copy()
    expire = datetime.utcnow() + timedelta(seconds=expires_delta)
    to_encode.update({"exp": expire})
    
    # Try to encode the token and catch potential errors
    try:
        token = jwt.encode(to_encode, settings.JWT_SECRET_KEY, algorithm=settings.JWT_ALGORITHM)
        logger.info("Access token successfully created.")
        return token
    except Exception as e:
        logger.error(f"Error creating access token: {e}")
        raise Exception("Error creating access token")

def verify_password(plain_password, hashed_password):
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
        raise Exception("Error verifying password")

def hash_password(password):
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
        raise Exception("Error hashing password")

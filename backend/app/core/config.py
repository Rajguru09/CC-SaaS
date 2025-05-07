#backend/app/core/config.py
import os
from dotenv import load_dotenv

# Load environment variables from a .env file
load_dotenv()

class Settings:
    PROJECT_NAME: str = "CleanCloud"
    JWT_SECRET_KEY: str = os.getenv("JWT_SECRET_KEY", "super-secret")  # Secret key for JWT
    JWT_ALGORITHM: str = "HS256"  # JWT algorithm used for encoding/decoding tokens
    DYNAMODB_TABLE: str = os.getenv("DYNAMODB_TABLE", "users")  # DynamoDB table name

# Create an instance of Settings to access configuration values
settings = Settings()

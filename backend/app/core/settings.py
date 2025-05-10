import os
from pydantic import BaseSettings

class Settings(BaseSettings):
    AWS_REGION: str = os.getenv("AWS_REGION", "ap-south-1")
    DYNAMODB_USERS_TABLE_NAME: str = os.getenv("DYNAMODB_USERS_TABLE_NAME", "users")

    # 🔐 JWT Configuration
    JWT_SECRET_KEY: str = os.getenv("JWT_SECRET_KEY", "your-secret-key")  # Replace with a secure key or load from .env
    JWT_ALGORITHM: str = os.getenv("JWT_ALGORITHM", "HS256")  # Default algorithm

    class Config:
        env_file = ".env"
        env_file_encoding = 'utf-8'

settings = Settings()

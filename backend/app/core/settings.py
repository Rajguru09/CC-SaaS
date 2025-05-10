import os
from pydantic_settings import BaseSettings  # ✅ FIXED

class Settings(BaseSettings):
    AWS_REGION: str = "ap-south-1"  # Default to ap-south-1, but can be overridden via .env
    DYNAMODB_USERS_TABLE_NAME: str = "users"  # Default DynamoDB table name
    JWT_SECRET_KEY: str  # JWT Secret Key, should be set in environment variables
    JWT_ALGORITHM: str = "HS256"  # Default algorithm

    class Config:
        env_file = ".env"  # Specifies the environment file to load variables from
        env_file_encoding = 'utf-8'  # Specifies the encoding for the environment file

# Initialize the settings instance
settings = Settings()

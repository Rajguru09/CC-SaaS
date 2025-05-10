import os
from pydantic import BaseSettings

class Settings(BaseSettings):
    AWS_REGION: str = "ap-south-1"
    DYNAMODB_USERS_TABLE_NAME: str = "users"
    JWT_SECRET_KEY: str
    JWT_ALGORITHM: str = "HS256"  # Add this line

    class Config:
        env_file = ".env"
        env_file_encoding = 'utf-8'

settings = Settings()

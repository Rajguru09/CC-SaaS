import os
from pydantic_settings import BaseSettings  # ✅ FIXED

class Settings(BaseSettings):
    AWS_REGION: str = "ap-south-1"
    DYNAMODB_USERS_TABLE_NAME: str = "users"
    JWT_SECRET_KEY: str
    JWT_ALGORITHM: str = "HS256"

    class Config:
        env_file = ".env"
        env_file_encoding = 'utf-8'

settings = Settings()

import os
from pydantic import BaseSettings

class Settings(BaseSettings):
    # AWS Region - default to 'ap-south-1' as per your region
    AWS_REGION: str = os.getenv("AWS_REGION", "ap-south-1")

    # Optional: Add more settings for AWS access keys or other configurations if needed
    # AWS_ACCESS_KEY_ID: str
    # AWS_SECRET_ACCESS_KEY: str

    class Config:
        # Load environment variables from a .env file if it exists
        env_file = ".env"
        env_file_encoding = 'utf-8'

# Instance of the settings class to access the configurations
settings = Settings()

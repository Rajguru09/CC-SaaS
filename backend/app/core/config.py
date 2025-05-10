import os
from dotenv import load_dotenv

# Load environment variables from a .env file
load_dotenv()

class JWTConfig:
    JWT_SECRET_KEY: str = os.getenv("JWT_SECRET_KEY")  # Secret key for JWT
    JWT_ALGORITHM: str = "HS256"  # JWT algorithm used for encoding/decoding tokens

    def __init__(self):
        if not self.JWT_SECRET_KEY:
            raise ValueError("JWT_SECRET_KEY environment variable is required.")

class DynamoDBConfig:
    DYNAMODB_TABLE: str = os.getenv("DYNAMODB_TABLE", "users")  # DynamoDB table name
    AWS_REGION: str = os.getenv("AWS_REGION", "us-east-1")  # Default AWS region for DynamoDB

    def __init__(self):
        if not self.DYNAMODB_TABLE:
            raise ValueError("DYNAMODB_TABLE environment variable is required.")
        if not self.AWS_REGION:
            raise ValueError("AWS_REGION environment variable is required.")

class Settings:
    # Project name used in the application
    PROJECT_NAME: str = "CleanCloud"
    
    # Configurations for JWT
    jwt_config: JWTConfig = JWTConfig()
    
    # Configurations for DynamoDB
    dynamodb_config: DynamoDBConfig = DynamoDBConfig()

    # You can add more configurations in similar way

# Create an instance of Settings to access configuration values
settings = Settings()


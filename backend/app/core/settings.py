from pydantic_settings import BaseSettings, SettingsConfigDict

class Settings(BaseSettings):
    AWS_REGION: str = "ap-south-1"
    DYNAMODB_USERS_TABLE_NAME: str = "users"
    JWT_SECRET_KEY: str
    JWT_ALGORITHM: str = "HS256"

    model_config = SettingsConfigDict(
        env_file="app/core/.env",  # Path to your .env file
        env_file_encoding="utf-8"
    )

# Initialize the settings instance
settings = Settings()

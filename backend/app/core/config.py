import os

class Settings:
    PROJECT_NAME = "CleanCloud"
    JWT_SECRET_KEY = os.getenv("JWT_SECRET_KEY", "super-secret")
    JWT_ALGORITHM = "HS256"
    DYNAMODB_TABLE = os.getenv("DYNAMODB_TABLE", "cleancloud_users")

settings = Settings()

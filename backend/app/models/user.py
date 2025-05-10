from pydantic import BaseModel, EmailStr, Field, model_validator
from enum import Enum
import re

# Enum for user roles
class RoleEnum(str, Enum):
    basic = "basic"
    admin = "admin"  # You can add more roles as needed

# Model to create a new user
class UserCreate(BaseModel):
    email: EmailStr
    password: str = Field(..., min_length=8)
    confirm_password: str

    @model_validator(mode='after')
    def validate_passwords(self):
        if self.password != self.confirm_password:
            raise ValueError("Passwords do not match")
        
        # Additional password validation (optional)
        if not re.search(r"[A-Za-z]", self.password) or not re.search(r"[0-9]", self.password):
            raise ValueError("Password must contain at least one letter and one number")
        
        return self

# Model for user login
class UserLogin(BaseModel):
    email: EmailStr
    password: str

# Model for user output (user details to return)
class UserOut(BaseModel):
    uid: str
    email: EmailStr
    role: RoleEnum = RoleEnum.basic  # Default to basic role

    class Config:
        # Ensure that model output is in snake_case format
        alias_generator = lambda string: string.lower()

# Model for token output (to return access token)
class TokenOut(BaseModel):
    access_token: str
    token_type: str = "bearer"

    class Config:
        # Allow extra fields to be passed if needed for future expansion
        str_strip_whitespace = True

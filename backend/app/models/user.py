from pydantic import BaseModel, EmailStr, Field, model_validator
from enum import Enum
import re

# Enum for user roles
class RoleEnum(str, Enum):
    basic = "basic"
    admin = "admin"  # Extendable to more roles

# Model to create a new user (e.g., during registration)
class UserCreate(BaseModel):
    email: EmailStr
    password: str = Field(..., min_length=8)
    confirm_password: str

    @model_validator(mode='after')
    def validate_passwords(self):
        if self.password != self.confirm_password:
            raise ValueError("Passwords do not match")
        
        # Optional: Ensure password contains at least one letter and one number
        if not re.search(r"[A-Za-z]", self.password) or not re.search(r"[0-9]", self.password):
            raise ValueError("Password must contain at least one letter and one number")
        
        return self

# Model for user login
class UserLogin(BaseModel):
    email: EmailStr
    password: str

# Model for user output (e.g., when returning user info)
class UserOut(BaseModel):
    uid: str
    email: EmailStr
    role: RoleEnum = RoleEnum.basic  # Default to 'basic' role

    class Config:
        # Optional: convert field names to lowercase when outputting
        alias_generator = lambda string: string.lower()

# Model for returning JWT token
class TokenOut(BaseModel):
    access_token: str
    token_type: str = "bearer"

    class Config:
        str_strip_whitespace = True  # Cleanup leading/trailing spaces

# General User model (used in imports or shared schemas)
class User(UserOut):
    pass  # Extend here later if needed

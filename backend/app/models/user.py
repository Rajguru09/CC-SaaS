#backend/app/models/user.py
from pydantic import BaseModel, EmailStr, Field, validator

class UserCreate(BaseModel):
    email: EmailStr
    password: str = Field(..., min_length=8, description="Password must be at least 8 characters long")

    @validator('password')
    def validate_password(cls, v):
        if len(v) < 8:
            raise ValueError('Password must be at least 8 characters long')
        return v

class UserOut(BaseModel):
    uid: str
    email: EmailStr
    role: str = "basic"  # Default to basic role, can be modified later if needed.

    class Config:
        # Ensure that model output is in snake_case format
        alias_generator = lambda string: string.lower()

class TokenOut(BaseModel):
    access_token: str
    token_type: str = "bearer"

    class Config:
        # Allow extra fields to be passed if needed for future expansion
        str_strip_whitespace = True

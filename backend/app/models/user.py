//#backend/app/models/user.py
from pydantic import BaseModel, EmailStr, Field, model_validator
from enum import Enum

class RoleEnum(str, Enum):
    basic = "basic"
    admin = "admin"  # You can add more roles as needed

class UserCreate(BaseModel):
    email: EmailStr
    password: str = Field(..., min_length=8)
    confirm_password: str

    @model_validator(mode='after')
    def validate_passwords(self):
        if self.password != self.confirm_password:
            raise ValueError("Passwords do not match")
        return self

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class UserOut(BaseModel):
    uid: str
    email: EmailStr
    role: RoleEnum = RoleEnum.basic  # Default to basic role

    class Config:
        # Ensure that model output is in snake_case format
        alias_generator = lambda string: string.lower()

class TokenOut(BaseModel):
    access_token: str
    token_type: str = "bearer"

    class Config:
        # Allow extra fields to be passed if needed for future expansion
        str_strip_whitespace = True

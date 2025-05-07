from pydantic import BaseModel, EmailStr

class UserCreate(BaseModel):
    email: EmailStr
    password: str

class UserOut(BaseModel):
    uid: str
    email: EmailStr

class TokenOut(BaseModel):
    access_token: str
    token_type: str = "bearer"

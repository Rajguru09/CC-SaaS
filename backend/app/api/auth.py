##backend/app/api/auth.py
from fastapi import APIRouter, HTTPException
from app.models.user import UserCreate, UserLogin, TokenOut
from app.core.security import hash_password, verify_password, create_access_token
from app.core.db import table
import uuid

router = APIRouter()

@router.post("/signup", response_model=TokenOut)
def signup(user: UserCreate):
    existing_user = table.get_item(Key={"email": user.email})
    if "Item" in existing_user:
        raise HTTPException(status_code=400, detail="Email already registered")
    
    uid = str(uuid.uuid4())
    hashed_pwd = hash_password(user.password)
    table.put_item(Item={"uid": uid, "email": user.email, "password": hashed_pwd})
    
    token = create_access_token({"sub": user.email, "uid": uid})
    return {"access_token": token, "token_type": "bearer"}

@router.post("/login", response_model=TokenOut)
def login(user: UserLogin):
    response = table.get_item(Key={"email": user.email})
    db_user = response.get("Item")
    if not db_user or not verify_password(user.password, db_user["password"]):
        raise HTTPException(status_code=401, detail="Invalid credentials")
    
    token = create_access_token({"sub": user.email, "uid": db_user["uid"]})
    return {"access_token": token, "token_type": "bearer"}

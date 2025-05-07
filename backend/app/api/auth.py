from fastapi import APIRouter, HTTPException
import uuid
from app.models.user import UserCreate, TokenOut
from app.core.security import hash_password, create_access_token, verify_password
from app.core.db import table

router = APIRouter()

@router.post("/signup", response_model=TokenOut)
def signup(user: UserCreate):
    uid = str(uuid.uuid4())
    item = {
        "uid": uid,
        "email": user.email,
        "password": hash_password(user.password),
        "role": "basic"
    }
    table.put_item(Item=item)
    token = create_access_token({"sub": user.email, "uid": uid})
    return {"access_token": token}

@router.post("/login", response_model=TokenOut)
def login(user: UserCreate):
    res = table.get_item(Key={"email": user.email})
    db_user = res.get("Item")
    if not db_user or not verify_password(user.password, db_user["password"]):
        raise HTTPException(status_code=401, detail="Invalid credentials")
    token = create_access_token({"sub": user.email, "uid": db_user["uid"]})
    return {"access_token": token}

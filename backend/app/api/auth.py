from fastapi import APIRouter, HTTPException
import uuid
from app.models.user import UserCreate, TokenOut
from app.core.security import hash_password, create_access_token, verify_password
from app.core.db import table  # Ensure table is your DynamoDB instance or database connector

router = APIRouter()

# Sign-up route
@router.post("/signup", response_model=TokenOut)
def signup(user: UserCreate):
    # Check if email already exists in the database
    res = table.get_item(Key={"email": user.email})
    if "Item" in res:
        raise HTTPException(status_code=400, detail="Email already registered")

    # Create a new user
    uid = str(uuid.uuid4())
    item = {
        "uid": uid,
        "email": user.email,
        "password": hash_password(user.password),  # Ensure this is securely hashed
        "role": "basic"
    }

    # Insert into DynamoDB (or database)
    table.put_item(Item=item)

    # Generate access token for the new user
    token = create_access_token({"sub": user.email, "uid": uid})

    return {"access_token": token}

# Login route
@router.post("/login", response_model=TokenOut)
def login(user: UserCreate):
    # Retrieve user data from the database
    res = table.get_item(Key={"email": user.email})
    db_user = res.get("Item")

    # Check if user exists and password is correct
    if not db_user or not verify_password(user.password, db_user["password"]):
        raise HTTPException(status_code=401, detail="Invalid credentials")

    # Generate access token for the logged-in user
    token = create_access_token({"sub": user.email, "uid": db_user["uid"]})

    return {"access_token": token}

from fastapi import APIRouter, HTTPException
import uuid
from app.models.user import UserCreate, TokenOut
from app.core.security import hash_password, create_access_token, verify_password
from app.core.db import table

router = APIRouter()

# Sign-up route
@router.post("/signup", response_model=TokenOut)
def signup(user: UserCreate):
    # Check if email already exists
    res = table.get_item(Key={"email": user.email})
    if "Item" in res:
        raise HTTPException(status_code=400, detail="Email already registered")

    # Create new user
    uid = str(uuid.uuid4())
    item = {
        "uid": uid,
        "email": user.email,
        "password": hash_password(user.password),  # Hashing the password before storing
        "role": "basic"
    }

    # Insert into the database (e.g., DynamoDB)
    table.put_item(Item=item)

    # Generate the access token
    token = create_access_token({"sub": user.email, "uid": uid})

    return {"access_token": token, "token_type": "bearer"}

# Login route
@router.post("/login", response_model=TokenOut)
def login(user: UserCreate):
    # Retrieve user data from DB
    res = table.get_item(Key={"email": user.email})
    db_user = res.get("Item")

    # Check if user exists and verify password
    if not db_user or not verify_password(user.password, db_user["password"]):
        raise HTTPException(status_code=401, detail="Invalid credentials")

    # Generate the token for the user
    token = create_access_token({"sub": user.email, "uid": db_user["uid"]})

    return {"access_token": token, "token_type": "bearer"}

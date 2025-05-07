# backend/app/main.py
from fastapi import FastAPI
from app.api import auth, users  # Import the routers

app = FastAPI()

# Include the routers for authentication and users
app.include_router(auth.router, prefix="/auth", tags=["auth"])
app.include_router(users.router, prefix="/users", tags=["users"])

@app.get("/")
def root():
    return {"message": "Welcome to CleanCloud backend!"}

from fastapi import FastAPI
from app.api import auth, users  # Import routers

app = FastAPI()

# Include routers with the correct prefix
app.include_router(auth.router, prefix="/auth")
app.include_router(users.router, prefix="/users")  # Ensure '/users' is correctly included

@app.get("/")
def root():
    return {"message": "Welcome to CleanCloud backend!"}

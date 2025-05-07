from fastapi import FastAPI
from app.api import auth, users  # Optional, if you’ve created routers

app = FastAPI()

# Optional: include routers
# app.include_router(auth.router, prefix="/auth")
# app.include_router(users.router, prefix="/users")

@app.get("/")
def root():
    return {"message": "Welcome to CleanCloud backend!"}

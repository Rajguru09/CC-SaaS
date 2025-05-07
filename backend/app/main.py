from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api import auth, users  # Import routers

# Initialize the FastAPI app
app = FastAPI()

# Allow all origins (replace with specific origins in production)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allows all origins, change to specific domains in production
    allow_credentials=True,
    allow_methods=["*"],  # Allows all HTTP methods (GET, POST, etc.)
    allow_headers=["*"],  # Allows all headers
)

# Include routers with the correct prefix
app.include_router(auth.router, prefix="/auth")
app.include_router(users.router, prefix="/users")  # Ensure '/users' is correctly included

@app.get("/")
def root():
    return {"message": "Welcome to CleanCloud backend!"}

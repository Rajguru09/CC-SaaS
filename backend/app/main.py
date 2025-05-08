##backend/app/main.py
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

# Import the routers (Ensure these are correctly imported based on your actual project structure)
from app.api import auth, users

# Initialize the FastAPI app
app = FastAPI()

# Define the allowed origins for CORS (use actual domains in production)
allowed_origins = [
    "http://localhost:3000",  # Your frontend's local URL during development
    "https://yourfrontenddomain.com",  # Replace with your actual production frontend URL
]

# Add CORS middleware for cross-origin requests
app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,  # Use the allowed_origins list
    allow_credentials=True,
    allow_methods=["*"],  # Allows all HTTP methods (GET, POST, etc.)
    allow_headers=["*"],  # Allows all headers
)

# Include routers with the correct prefix
app.include_router(auth.router, prefix="/auth")  # Authentication routes (Login, Signup, etc.)
app.include_router(users.router, prefix="/users")  # User-related routes (profile, etc.)

# Root endpoint (for testing)
@app.get("/")
def root():
    return {"message": "Welcome to CleanCloud backend! The server is up and running."}

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

# Import the routers (Ensure these are correctly imported based on your actual project structure)
from app.api import auth, users

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
app.include_router(auth.router, prefix="/auth")  # Authentication routes (Login, Signup, etc.)
app.include_router(users.router, prefix="/users")  # User-related routes (profile, etc.)

# Root endpoint (for testing)
@app.get("/")
def root():
    return {"message": "Welcome to CleanCloud backend!"}

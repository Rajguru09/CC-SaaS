import logging
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api import auth, users
import os

# Set up logging
logger = logging.getLogger("uvicorn")
logger.setLevel(logging.INFO)

app = FastAPI()

# Update this based on where your frontend is served
allowed_origins = os.getenv("ALLOWED_ORIGINS", "http://localhost:3001").split(',')

# Add middleware for handling CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,  # Allow origins dynamically
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(auth.router, prefix="/auth")
app.include_router(users.router, prefix="/users")

@app.get("/")
def root():
    logger.info("Root endpoint hit.")
    return {"message": "Welcome to CleanCloud backend! The server is up and running."}

@app.get("/health")
def health_check():
    logger.info("Health check endpoint hit.")
    return {"status": "healthy"}

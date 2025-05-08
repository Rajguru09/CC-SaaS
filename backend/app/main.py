from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api import auth, users

app = FastAPI()

# Update this based on where your frontend is served
allowed_origins = [
    "http://localhost:5173",  # Vite dev server
    "https://yourfrontenddomain.com",  # Production domain
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(auth.router, prefix="/auth")
app.include_router(users.router, prefix="/users")

@app.get("/")
def root():
    return {"message": "Welcome to CleanCloud backend! The server is up and running."}

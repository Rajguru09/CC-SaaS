from fastapi import FastAPI
from app.api import users  # Ensure users is imported

app = FastAPI()

# Include the users router
app.include_router(users.router, prefix="/users")

@app.get("/")
def root():
    return {"message": "Welcome to CleanCloud backend!"}

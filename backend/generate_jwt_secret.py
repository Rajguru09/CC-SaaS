import os
from dotenv import load_dotenv
from secrets import token_urlsafe

# Load existing .env file or create one if it doesn't exist
load_dotenv()

# Generate a new JWT secret key
jwt_secret_key = token_urlsafe(32)

# Get the .env file path (in the current directory)
env_file_path = os.path.join(os.getcwd(), '.env')

# Check if the .env file exists
if not os.path.exists(env_file_path):
    with open(env_file_path, 'w') as env_file:
        env_file.write(f"JWT_SECRET_KEY={jwt_secret_key}\n")
    print(f"Created new .env file with JWT_SECRET_KEY: {jwt_secret_key}")
else:
    # If .env exists, update the JWT_SECRET_KEY entry
    with open(env_file_path, 'a') as env_file:
        env_file.write(f"JWT_SECRET_KEY={jwt_secret_key}\n")
    print(f"Appended JWT_SECRET_KEY to existing .env file: {jwt_secret_key}")

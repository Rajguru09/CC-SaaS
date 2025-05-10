import uuid
import boto3
from botocore.exceptions import ClientError
from passlib.context import CryptContext
import os

# Set DynamoDB region and table name according to your environment
dynamodb = boto3.resource('dynamodb', region_name=os.getenv('AWS_REGION', 'ap-south-1'))  # Using environment variable for region
table = dynamodb.Table(os.getenv('DYNAMODB_TABLE', 'users'))  # Table name from environment variable

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def create_user(user_data):
    # Validate input data
    if not user_data.get('email') or not user_data.get('password'):
        raise ValueError("Email and password are required fields.")

    user_id = str(uuid.uuid4())
    hashed_password = pwd_context.hash(user_data.password)

    try:
        # Insert the new user into the DynamoDB table
        table.put_item(
            Item={
                "uid": user_id,
                "email": user_data.email,
                "password": hashed_password,
                "role": "basic"  # Default role is "basic"
            },
            ConditionExpression="attribute_not_exists(email)"  # Ensure the email is unique
        )
    except ClientError as e:
        # If the email already exists, raise a custom error
        if e.response['Error']['Code'] == "ConditionalCheckFailedException":
            raise ValueError("User with this email already exists.")
        else:
            # Log and raise other errors
            raise RuntimeError(f"Failed to create user: {e.response['Error']['Message']}")

    # Return user data without the password for security purposes
    return {
        "uid": user_id,
        "email": user_data.email,
        "role": "basic"  # Default role
    }

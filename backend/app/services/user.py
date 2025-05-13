import uuid
import boto3
import os
from passlib.context import CryptContext
from botocore.exceptions import ClientError
from app.models.user import UserCreate

# Setup DynamoDB and Password Hasher
dynamodb = boto3.resource('dynamodb', region_name=os.getenv('AWS_REGION', 'ap-south-1'))
table = dynamodb.Table(os.getenv('DYNAMODB_TABLE', 'users'))

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def create_user(user_data: UserCreate):
    """
    Creates a new user in the DynamoDB table after hashing the password and validating uniqueness.
    """
    if not user_data.email or not user_data.password:
        raise ValueError("Email and password are required.")

    user_id = str(uuid.uuid4())
    hashed_password = pwd_context.hash(user_data.password)

    try:
        table.put_item(
            Item={
                "uid": user_id,
                "email": user_data.email,
                "password": hashed_password,
                "role": "basic"
            },
            ConditionExpression="attribute_not_exists(email)"  # Ensures unique email
        )
    except ClientError as e:
        if e.response['Error']['Code'] == "ConditionalCheckFailedException":
            raise ValueError("User with this email already exists.")
        raise RuntimeError(f"DynamoDB error: {e.response['Error']['Message']}")

    return {
        "uid": user_id,
        "email": user_data.email,
        "role": "basic"
    }

def get_user_by_email(email: str):
    """
    Retrieves a user from DynamoDB by email.
    """
    try:
        response = table.get_item(Key={"email": email})
        return response.get("Item")
    except ClientError as e:
        raise RuntimeError(f"Error fetching user: {e.response['Error']['Message']}")

def verify_password(plain_password: str, hashed_password: str) -> bool:
    """
    Verifies a plain password against its hash.
    """
    return pwd_context.verify(plain_password, hashed_password)

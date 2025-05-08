# app/services/user.py #
import uuid
import boto3
from botocore.exceptions import ClientError
from passlib.context import CryptContext
import os

# Set DynamoDB region and table name according to your environment
dynamodb = boto3.resource('dynamodb', region_name='ap-south-1')  # Correct region
table = dynamodb.Table('users')  # Correct table name

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def create_user(user_data):
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
            raise  # Raise any other errors

    # Return user data without the password for security purposes
    return {
        "uid": user_id,
        "email": user_data.email,
        "role": "basic"  # Default role, can be customized if needed
    }

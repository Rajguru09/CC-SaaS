# app/services/user.py #

import uuid
import boto3
from botocore.exceptions import ClientError
from passlib.context import CryptContext

dynamodb = boto3.resource('dynamodb', region_name='us-east-1')  # Update region as needed
table = dynamodb.Table('users')

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def create_user(user_data):
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
            ConditionExpression="attribute_not_exists(email)"  # prevent duplicates
        )
    except ClientError as e:
        if e.response['Error']['Code'] == "ConditionalCheckFailedException":
            raise ValueError("User already exists.")
        else:
            raise

    return {"uid": user_id, "email": user_data.email, "role": "basic"}

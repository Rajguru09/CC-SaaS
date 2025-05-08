import boto3
from app.core.config import settings

# Initialize DynamoDB resource and client
dynamodb = boto3.resource("dynamodb")
dynamodb_client = boto3.client("dynamodb")  # Initialize the client

# Table resource
table = dynamodb.Table("users")  # Updated table name

# Test to ensure we can access the table
try:
    # Use the client to describe the table
    response = dynamodb_client.describe_table(TableName="users")  # Correct method for client
    print(f"Table {settings.DYNAMODB_TABLE} exists!")
except Exception as e:
    print(f"Error accessing table: {e}")

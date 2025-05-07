import boto3
from app.core.config import settings

# Initialize DynamoDB resource and table
dynamodb = boto3.resource("dynamodb")
table = dynamodb.Table("users")  # Updated table name

# Test to ensure we can access the table
try:
    response = table.describe_table()
    print(f"Table {settings.DYNAMODB_TABLE} exists!")
except Exception as e:
    print(f"Error accessing table: {e}")

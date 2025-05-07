import boto3
from app.core.config import settings

dynamodb = boto3.resource("dynamodb")
table = dynamodb.Table(settings.DYNAMODB_TABLE)

# Test to ensure we can access the table
try:
    response = table.describe_table()
    print(f"Table {settings.DYNAMODB_TABLE} exists!")
except Exception as e:
    print(f"Error accessing table: {e}")

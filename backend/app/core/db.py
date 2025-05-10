from app.core.settings import settings  # Importing settings from your settings module
import boto3
from botocore.exceptions import ClientError

# Initialize DynamoDB resource and client with the correct region from settings
dynamodb = boto3.resource("dynamodb", region_name=settings.AWS_REGION)
dynamodb_client = boto3.client("dynamodb", region_name=settings.AWS_REGION)

# Correctly reference the table name from settings
table = dynamodb.Table(settings.DYNAMODB_USERS_TABLE_NAME)

# Test to ensure we can access the table
try:
    # Describing the table to check if it exists
    response = dynamodb_client.describe_table(TableName=settings.DYNAMODB_USERS_TABLE_NAME)
    print(f"Table '{settings.DYNAMODB_USERS_TABLE_NAME}' exists!")
except ClientError as e:
    error_code = e.response["Error"]["Code"]
    if error_code == "ResourceNotFoundException":
        print(f"Table '{settings.DYNAMODB_USERS_TABLE_NAME}' does not exist!")
    else:
        print(f"Error accessing table: {e.response['Error']['Message']}")
except Exception as e:
    print(f"An unexpected error occurred: {str(e)}")

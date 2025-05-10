import boto3
from botocore.exceptions import ClientError
from app.core.settings import settings  # Assuming settings is where AWS-related configurations are stored

# Initialize DynamoDB resource and client with the correct region from settings
dynamodb = boto3.resource("dynamodb", region_name=settings.AWS_REGION)  # Use region from config settings
dynamodb_client = boto3.client("dynamodb", region_name=settings.AWS_REGION)  # Use region from config settings

# Table resource using the table name "users" from config
table = dynamodb.Table(settings.DYNAMODB_USERS_TABLE_NAME)  # Use table name from config

# Test to ensure we can access the table
try:
    # Use the client to describe the table
    response = dynamodb_client.describe_table(TableName=settings.DYNAMODB_USERS_TABLE_NAME)
    print(f"Table '{settings.DYNAMODB_USERS_TABLE_NAME}' exists!")
except ClientError as e:
    # More specific error handling for DynamoDB-related errors
    error_code = e.response["Error"]["Code"]
    if error_code == "ResourceNotFoundException":
        print(f"Table '{settings.DYNAMODB_USERS_TABLE_NAME}' does not exist!")
    else:
        print(f"Error accessing table: {e.response['Error']['Message']}")
except Exception as e:
    print(f"An unexpected error occurred: {str(e)}")

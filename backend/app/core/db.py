import boto3
from botocore.exceptions import ClientError
from app.core.config import settings

# Initialize DynamoDB resource and client with the correct region
dynamodb = boto3.resource("dynamodb", region_name="ap-south-1")  # Set region to ap-south-1
dynamodb_client = boto3.client("dynamodb", region_name="ap-south-1")  # Set region to ap-south-1

# Table resource using the table name "users"
table = dynamodb.Table("users")

# Test to ensure we can access the table
try:
    # Use the client to describe the table
    response = dynamodb_client.describe_table(TableName="users")
    print(f"Table 'users' exists!")
except ClientError as e:
    # More specific error handling for DynamoDB-related errors
    error_code = e.response["Error"]["Code"]
    if error_code == "ResourceNotFoundException":
        print(f"Table 'users' does not exist!")
    else:
        print(f"Error accessing table: {e.response['Error']['Message']}")
except Exception as e:
    print(f"An unexpected error occurred: {str(e)}")

import boto3
from app.core.config import settings

dynamodb = boto3.resource("dynamodb")
table = dynamodb.Table(settings.DYNAMODB_TABLE)

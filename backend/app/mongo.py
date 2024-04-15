import os
from typing import Any, Mapping

from pymongo import MongoClient
from pymongo.database import Database

MONGO_DB_NAME = 'prudb'
MONGO_DB_CLIENT = None


def get_mongo_client() -> Database[Mapping[str, Any] | Any]:
    """Get a Mongo DB client."""
    global MONGO_DB_CLIENT

    # If client exists then return the same client to reuse
    if MONGO_DB_CLIENT is not None:
        return MONGO_DB_CLIENT

    # Get the URL from environment
    url = os.environ.get("MONGO_CONNECTION_URL")
    if not url:
        raise ValueError("MONGO_CONNECTION_URL not set")

    # Connect with the Mongo DB and get the DB client
    client = MongoClient(url)
    MONGO_DB_CLIENT = client[MONGO_DB_NAME]

    return MONGO_DB_CLIENT

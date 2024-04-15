import datetime
import os

import jwt
from fastapi import HTTPException, Depends
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials

security = HTTPBearer()


def get_token_secret():
    """Get the secret from environment and return."""
    secret = os.environ.get("TOKEN_SECRET_KEY")
    if not secret:
        raise ValueError("TOKEN_SECRET_KEY not set")
    return secret


def create_token(username):
    """Create JWT token."""
    secret = get_token_secret()
    return jwt.encode({
        'username': username,
        'exp': datetime.datetime.utcnow() + datetime.timedelta(hours=1)
    }, secret, algorithm="HS256")


def verify_token(credentials: HTTPAuthorizationCredentials = Depends(security)):
    """Verify JWT token."""
    token = credentials.credentials
    secret = get_token_secret()
    try:
        payload = jwt.decode(token, secret, algorithms=["HS256"])
        return payload
    except jwt.PyJWTError:
        raise HTTPException(status_code=403, detail="Could not validate credentials")

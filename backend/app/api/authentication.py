"""
Router to login and register user
from Frontend service
"""

import os
from typing import Dict

import bcrypt
from fastapi import APIRouter, HTTPException
from app.mongo import get_mongo_client

from app.api.token_management import create_token
from app.schema import User
from app.schema import UserRegistration, UserLogin

router = APIRouter()

db_client = get_mongo_client()


@router.post("/register")
async def register(user_data: UserRegistration) -> Dict:
    """Register User"""

    # Check if the username already exists
    if db_client.users.find_one({"username": user_data.username}):
        raise HTTPException(status_code=400, detail={'message': "Username already exists"})

    # encrypt password for the security
    hashed_password = bcrypt.hashpw(user_data.password.encode('utf-8'), bcrypt.gensalt())

    db_client.users.insert_one({
        'firstname': user_data.firstname,
        'lastname': user_data.lastname,
        'username': user_data.username,
        'password': hashed_password
    })

    # Create a token to return to the user
    token = create_token(user_data.username)

    return {
        'message': 'User registered successfully',
        "token": token
    }


@router.post("/login")
async def login(login_data: UserLogin) -> Dict:
    """Authenticate User"""

    username: str = login_data.username
    password: bytes = str(login_data.password).encode('utf-8')

    # Check if the username exists
    user: User = db_client.users.find_one({'username': username})

    # Check if the password matches
    if user and bcrypt.checkpw(password, user['password']):

        # Create a token to return to the user
        token = create_token(username)

        return {
            'message': 'Login successful',
            'token': token
        }
    else:
        return {
            'message': 'Invalid username or password'
        }

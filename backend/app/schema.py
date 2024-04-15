from datetime import datetime
from typing import Annotated, Optional
from uuid import UUID

from fastapi import Cookie
from pydantic import BaseModel, Field
from typing_extensions import TypedDict


class Assistant(TypedDict):
    """Assistant model."""

    assistant_id: UUID
    """The ID of the assistant."""
    user_id: str
    """The ID of the user that owns the assistant."""
    name: str
    """The name of the assistant."""
    config: dict
    """The assistant config."""
    updated_at: datetime
    """The last time the assistant was updated."""
    public: bool
    """Whether the assistant is public."""


class Thread(TypedDict):
    thread_id: UUID
    """The ID of the thread."""
    user_id: str
    """The ID of the user that owns the thread."""
    assistant_id: Optional[UUID]
    """The assistant that was used in conjunction with this thread."""
    name: str
    """The name of the thread."""
    updated_at: datetime
    """The last time the thread was updated."""


OpengptsUserId = Annotated[
    str,
    Cookie(
        description=(
            "A cookie that identifies the user. This is not an authentication "
            "mechanism that should be used in an actual production environment that "
            "contains sensitive information."
        )
    ),
]


class User(BaseModel):
    """User model."""

    _id: Optional[str] = Field(None, alias="id")
    """The ID of the user."""

    firstname: str
    """First name of the user."""

    lastname: str
    """Last name of the user."""

    username: str
    """Username of the user."""

    password: str
    """Password of the user."""

    class Config:
        allow_population_by_field_name = True
        schema_extra = {
            "example": {
                "firstname": "John",
                "lastname": "Doe",
                "username": "johndoe",
                "password": "s3cret",
            }
        }


class UserRegistration(BaseModel):
    firstname: str
    lastname: str
    username: str
    password: str


class UserLogin(BaseModel):
    username: str
    password: str
from datetime import datetime

from pydantic import BaseModel, ConfigDict, Field


class ResourceBase(BaseModel):
    title: str = Field(
        min_length=1,
        max_length=200,
    )

    type: str = Field(
        min_length=1,
        max_length=50,
    )

    url: str = Field(
        min_length=1,
        max_length=1000,
    )

    description: str | None = None


class ResourceCreate(ResourceBase):
    topic_id: int


class ResourceUpdate(BaseModel):
    title: str | None = Field(
        default=None,
        min_length=1,
        max_length=200,
    )

    type: str | None = Field(
        default=None,
        min_length=1,
        max_length=50,
    )

    url: str | None = Field(
        default=None,
        min_length=1,
        max_length=1000,
    )

    description: str | None = None


class ResourceResponse(ResourceBase):
    id: int
    topic_id: int
    created_at: datetime

    model_config = ConfigDict(
        from_attributes=True
    )
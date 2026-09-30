from datetime import datetime

from pydantic import BaseModel, ConfigDict, Field


class TopicBase(BaseModel):
    name: str = Field(
        min_length=1,
        max_length=150,
    )

    description: str | None = None

    order: int = Field(
        default=0,
        ge=0,
    )

    completed: bool = False


class TopicCreate(TopicBase):
    subject_id: int


class TopicUpdate(BaseModel):
    name: str | None = Field(
        default=None,
        min_length=1,
        max_length=150,
    )

    description: str | None = None

    order: int | None = Field(
        default=None,
        ge=0,
    )

    completed: bool | None = None


class TopicResponse(TopicBase):
    id: int
    subject_id: int
    created_at: datetime

    model_config = ConfigDict(
        from_attributes=True
    )
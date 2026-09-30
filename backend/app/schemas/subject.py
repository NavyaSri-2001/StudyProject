from datetime import datetime

from pydantic import BaseModel, ConfigDict, Field


class SubjectBase(BaseModel):
    name: str = Field(min_length=1, max_length=100)
    description: str | None = None
    icon: str | None = None
    progress: int = Field(default=0, ge=0, le=100)


class SubjectCreate(SubjectBase):
    pass


class SubjectUpdate(BaseModel):
    name: str | None = Field(
        default=None,
        min_length=1,
        max_length=100,
    )
    description: str | None = None
    icon: str | None = None
    progress: int | None = Field(
        default=None,
        ge=0,
        le=100,
    )


class SubjectResponse(SubjectBase):
    id: int
    created_at: datetime

    model_config = ConfigDict(
        from_attributes=True
    )
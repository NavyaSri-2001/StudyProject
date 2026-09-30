from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import select
from sqlalchemy.orm import Session

from app.database.connection import get_db
from app.models.subject import Subject
from app.models.topic import Topic
from app.schemas.topic import (
    TopicCreate,
    TopicResponse,
    TopicUpdate,
)

router = APIRouter(
    prefix="/api/topics",
    tags=["Topics"],
)


@router.get(
    "",
    response_model=list[TopicResponse],
)
def get_topics(
    subject_id: int | None = None,
    db: Session = Depends(get_db),
):
    query = select(Topic)

    if subject_id is not None:
        query = query.where(
            Topic.subject_id == subject_id
        )

    query = query.order_by(
        Topic.order,
        Topic.id,
    )

    return db.scalars(query).all()


@router.get(
    "/{topic_id}",
    response_model=TopicResponse,
)
def get_topic(
    topic_id: int,
    db: Session = Depends(get_db),
):
    topic = db.get(Topic, topic_id)

    if topic is None:
        raise HTTPException(
            status_code=404,
            detail="Topic not found",
        )

    return topic


@router.post(
    "",
    response_model=TopicResponse,
    status_code=201,
)
def create_topic(
    topic_data: TopicCreate,
    db: Session = Depends(get_db),
):
    subject = db.get(
        Subject,
        topic_data.subject_id,
    )

    if subject is None:
        raise HTTPException(
            status_code=404,
            detail="Subject not found",
        )

    topic = Topic(
        subject_id=topic_data.subject_id,
        name=topic_data.name,
        description=topic_data.description,
        order=topic_data.order,
        completed=topic_data.completed,
    )

    db.add(topic)
    db.commit()
    db.refresh(topic)

    return topic


@router.put(
    "/{topic_id}",
    response_model=TopicResponse,
)
def update_topic(
    topic_id: int,
    topic_data: TopicUpdate,
    db: Session = Depends(get_db),
):
    topic = db.get(Topic, topic_id)

    if topic is None:
        raise HTTPException(
            status_code=404,
            detail="Topic not found",
        )

    update_data = topic_data.model_dump(
        exclude_unset=True
    )

    for key, value in update_data.items():
        setattr(topic, key, value)

    db.commit()
    db.refresh(topic)

    return topic


@router.delete("/{topic_id}")
def delete_topic(
    topic_id: int,
    db: Session = Depends(get_db),
):
    topic = db.get(Topic, topic_id)

    if topic is None:
        raise HTTPException(
            status_code=404,
            detail="Topic not found",
        )

    db.delete(topic)
    db.commit()

    return {
        "message": "Topic deleted successfully"
    }
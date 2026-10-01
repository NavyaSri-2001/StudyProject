from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import select
from sqlalchemy.orm import Session

from app.database.connection import get_db
from app.models.resource import Resource
from app.models.topic import Topic
from app.schemas.resource import (
    ResourceCreate,
    ResourceResponse,
    ResourceUpdate,
)


router = APIRouter(
    prefix="/api/resources",
    tags=["Resources"],
)


@router.get(
    "",
    response_model=list[ResourceResponse],
)
def get_resources(
    topic_id: int | None = None,
    db: Session = Depends(get_db),
):
    query = select(Resource)

    if topic_id is not None:
        query = query.where(
            Resource.topic_id == topic_id
        )

    query = query.order_by(Resource.id)

    return db.scalars(query).all()


@router.get(
    "/{resource_id}",
    response_model=ResourceResponse,
)
def get_resource(
    resource_id: int,
    db: Session = Depends(get_db),
):
    resource = db.get(Resource, resource_id)

    if resource is None:
        raise HTTPException(
            status_code=404,
            detail="Resource not found",
        )

    return resource


@router.post(
    "",
    response_model=ResourceResponse,
    status_code=201,
)
def create_resource(
    resource_data: ResourceCreate,
    db: Session = Depends(get_db),
):
    topic = db.get(
        Topic,
        resource_data.topic_id,
    )

    if topic is None:
        raise HTTPException(
            status_code=404,
            detail="Topic not found",
        )

    resource = Resource(
        topic_id=resource_data.topic_id,
        title=resource_data.title,
        type=resource_data.type,
        url=resource_data.url,
        description=resource_data.description,
    )

    db.add(resource)
    db.commit()
    db.refresh(resource)

    return resource


@router.put(
    "/{resource_id}",
    response_model=ResourceResponse,
)
def update_resource(
    resource_id: int,
    resource_data: ResourceUpdate,
    db: Session = Depends(get_db),
):
    resource = db.get(Resource, resource_id)

    if resource is None:
        raise HTTPException(
            status_code=404,
            detail="Resource not found",
        )

    update_data = resource_data.model_dump(
        exclude_unset=True
    )

    for key, value in update_data.items():
        setattr(resource, key, value)

    db.commit()
    db.refresh(resource)

    return resource


@router.delete("/{resource_id}")
def delete_resource(
    resource_id: int,
    db: Session = Depends(get_db),
):
    resource = db.get(Resource, resource_id)

    if resource is None:
        raise HTTPException(
            status_code=404,
            detail="Resource not found",
        )

    db.delete(resource)
    db.commit()

    return {
        "message": "Resource deleted successfully"
    }
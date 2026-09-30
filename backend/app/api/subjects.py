from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import select
from sqlalchemy.orm import Session

from app.database.connection import get_db
from app.models.subject import Subject
from app.schemas.subject import (
    SubjectCreate,
    SubjectResponse,
    SubjectUpdate,
)

router = APIRouter(
    prefix="/api/subjects",
    tags=["Subjects"],
)


@router.get(
    "",
    response_model=list[SubjectResponse],
)
def get_subjects(
    db: Session = Depends(get_db),
):
    subjects = db.scalars(
        select(Subject).order_by(Subject.id)
    ).all()

    return subjects


@router.get(
    "/{subject_id}",
    response_model=SubjectResponse,
)
def get_subject(
    subject_id: int,
    db: Session = Depends(get_db),
):
    subject = db.get(Subject, subject_id)

    if subject is None:
        raise HTTPException(
            status_code=404,
            detail="Subject not found",
        )

    return subject


@router.post(
    "",
    response_model=SubjectResponse,
    status_code=201,
)
def create_subject(
    subject_data: SubjectCreate,
    db: Session = Depends(get_db),
):
    subject = Subject(
        name=subject_data.name,
        description=subject_data.description,
        icon=subject_data.icon,
        progress=subject_data.progress,
    )

    db.add(subject)
    db.commit()
    db.refresh(subject)

    return subject


@router.put(
    "/{subject_id}",
    response_model=SubjectResponse,
)
def update_subject(
    subject_id: int,
    subject_data: SubjectUpdate,
    db: Session = Depends(get_db),
):
    subject = db.get(Subject, subject_id)

    if subject is None:
        raise HTTPException(
            status_code=404,
            detail="Subject not found",
        )

    update_data = subject_data.model_dump(
        exclude_unset=True
    )

    for key, value in update_data.items():
        setattr(subject, key, value)

    db.commit()
    db.refresh(subject)

    return subject


@router.delete("/{subject_id}")
def delete_subject(
    subject_id: int,
    db: Session = Depends(get_db),
):
    subject = db.get(Subject, subject_id)

    if subject is None:
        raise HTTPException(
            status_code=404,
            detail="Subject not found",
        )

    db.delete(subject)
    db.commit()

    return {
        "message": "Subject deleted successfully"
    }
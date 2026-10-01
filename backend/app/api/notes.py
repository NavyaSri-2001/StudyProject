from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import select
from sqlalchemy.orm import Session

from app.database.connection import get_db
from app.models.note import Note
from app.models.topic import Topic
from app.schemas.note import (
    NoteCreate,
    NoteResponse,
    NoteUpdate,
)


router = APIRouter(
    prefix="/api/notes",
    tags=["Notes"],
)


@router.get(
    "",
    response_model=list[NoteResponse],
)
def get_notes(
    topic_id: int | None = None,
    db: Session = Depends(get_db),
):
    query = select(Note)

    if topic_id is not None:
        query = query.where(
            Note.topic_id == topic_id
        )

    query = query.order_by(Note.id)

    return db.scalars(query).all()


@router.get(
    "/{note_id}",
    response_model=NoteResponse,
)
def get_note(
    note_id: int,
    db: Session = Depends(get_db),
):
    note = db.get(Note, note_id)

    if note is None:
        raise HTTPException(
            status_code=404,
            detail="Note not found",
        )

    return note


@router.post(
    "",
    response_model=NoteResponse,
    status_code=201,
)
def create_note(
    note_data: NoteCreate,
    db: Session = Depends(get_db),
):
    topic = db.get(
        Topic,
        note_data.topic_id,
    )

    if topic is None:
        raise HTTPException(
            status_code=404,
            detail="Topic not found",
        )

    note = Note(
        topic_id=note_data.topic_id,
        title=note_data.title,
        content=note_data.content,
    )

    db.add(note)
    db.commit()
    db.refresh(note)

    return note


@router.put(
    "/{note_id}",
    response_model=NoteResponse,
)
def update_note(
    note_id: int,
    note_data: NoteUpdate,
    db: Session = Depends(get_db),
):
    note = db.get(Note, note_id)

    if note is None:
        raise HTTPException(
            status_code=404,
            detail="Note not found",
        )

    update_data = note_data.model_dump(
        exclude_unset=True
    )

    for key, value in update_data.items():
        setattr(note, key, value)

    db.commit()
    db.refresh(note)

    return note


@router.delete("/{note_id}")
def delete_note(
    note_id: int,
    db: Session = Depends(get_db),
):
    note = db.get(Note, note_id)

    if note is None:
        raise HTTPException(
            status_code=404,
            detail="Note not found",
        )

    db.delete(note)
    db.commit()

    return {
        "message": "Note deleted successfully"
    }
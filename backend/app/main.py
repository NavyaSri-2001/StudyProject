from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api.subjects import router as subjects_router
from app.api.topics import router as topics_router
from app.api.notes import router as notes_router

app = FastAPI(
    title="Study Hub API",
    description="Backend API for my personal study platform",
    version="0.2.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(subjects_router)
app.include_router(topics_router)
app.include_router(notes_router)

@app.get("/")
async def root():
    return {
        "message": "Study Hub API is running!"
    }


@app.get("/api/health")
async def health_check():
    return {
        "status": "healthy"
    }
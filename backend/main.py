from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(
    title="Study Hub API",
    description="Backend API for my personal study platform",
    version="0.1.0",
)

# Allow our Next.js frontend to communicate with the backend.
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


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
import sys
import os
from contextlib import asynccontextmanager
from fastapi import FastAPI

# Add the parent directory to Python path to discover 'app' package
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from app.database import engine, Base
from app import models

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Create tables on startup
    Base.metadata.create_all(bind=engine)
    yield

from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(
    title="PhishGuard API",
    description="Cyber Risk and Threat Simulator — Backend API",
    version="1.1.0",
    lifespan=lifespan
)

# Enable CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # In production, replace with specific origins
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

from app.routes import scenarios, attempts

app.include_router(scenarios.router, prefix="/api", tags=["Scenarios"])
app.include_router(attempts.router, prefix="/api", tags=["Attempts"])

@app.get("/", tags=["Health"])
async def root():
    return {
        "status": "ok",
        "message": "PhishGuard API is running 🛡️",
        "database": "SQLAlchemy/PostgreSQL integrated"
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("app.main:app", host="0.0.0.0", port=8000, reload=True)

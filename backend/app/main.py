"""
PhishGuard — FastAPI Backend
Main application entry point.
"""
import sys
import os

# Add the parent directory to Python path to discover 'app' package
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routes import scenarios, attempts
import uvicorn

app = FastAPI(
    title="PhishGuard API",
    description="Cyber Risk and Threat Simulator — Backend API",
    version="1.0.0",
)

# ── CORS ─────────────────────────────────────────────────────────────────────
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",   # Vite dev server
        "http://127.0.0.1:5173",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ── Routers ───────────────────────────────────────────────────────────────────
app.include_router(scenarios.router, prefix="/api", tags=["Scenarios"])
app.include_router(attempts.router, prefix="/api", tags=["Attempts"])


@app.get("/", tags=["Health"])
async def root():
    return {"status": "ok", "message": "PhishGuard API is running 🛡️"}


if __name__ == "__main__":
    uvicorn.run("app.main:app", host="0.0.0.0", port=8000, reload=True)

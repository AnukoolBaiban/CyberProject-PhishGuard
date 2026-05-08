from fastapi import APIRouter, HTTPException, Depends
from sqlalchemy.orm import Session
from app.database import get_db
from app.models import UserAttempt, AttemptCreate, AttemptResponse

router = APIRouter()

@router.post("/attempts", response_model=AttemptResponse, status_code=201)
async def create_attempt(attempt: AttemptCreate, db: Session = Depends(get_db)):
    """Save a user's scenario attempt to the user_attempts table."""
    try:
        db_attempt = UserAttempt(
            user_nickname=attempt.user_nickname,
            scenario_id=attempt.scenario_id,
            is_correct=attempt.is_correct,
            score_points=attempt.score_points,
            choice_label=attempt.choice_label
        )
        db.add(db_attempt)
        db.commit()
        db.refresh(db_attempt)
        return db_attempt
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=str(e))

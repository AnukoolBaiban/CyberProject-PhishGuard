"""POST /attempts — save a user attempt to Supabase."""
from fastapi import APIRouter, HTTPException
from app.database import supabase
from app.models import AttemptCreate, AttemptResponse

router = APIRouter()


@router.post("/attempts", response_model=AttemptResponse, status_code=201)
async def create_attempt(attempt: AttemptCreate):
    """Save a user's scenario attempt to the attempts table."""
    try:
        payload = {
            "nickname": attempt.nickname,
            "scenario_id": attempt.scenario_id,
            "choice_label": attempt.choice_label,
            "is_correct": attempt.is_correct,
            "score": attempt.score,
        }
        response = supabase.table("attempts").insert(payload).execute()
        if not response.data:
            raise HTTPException(status_code=500, detail="Failed to save attempt.")
        return response.data[0]
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

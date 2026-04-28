"""Pydantic models for PhishGuard API."""
from typing import List, Optional
from pydantic import BaseModel


class RedFlag(BaseModel):
    text: str
    reason: str


class Choice(BaseModel):
    label: str
    is_correct: bool
    explanation: str


class Scenario(BaseModel):
    id: str
    type: str        # "sms" | "email"
    sender: str
    subject: Optional[str] = None
    content: str
    red_flags: List[RedFlag]
    choices: List[Choice]


class AttemptCreate(BaseModel):
    nickname: str
    scenario_id: str
    choice_label: str
    is_correct: bool
    score: int


class AttemptResponse(BaseModel):
    id: str
    nickname: str
    scenario_id: str
    choice_label: str
    is_correct: bool
    score: int
    created_at: str

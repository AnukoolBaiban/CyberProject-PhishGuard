"""Pydantic models for PhishGuard API."""
from typing import List, Optional
from pydantic import BaseModel


class UiTrigger(BaseModel):
    label: str
    type: str

class UiTriggers(BaseModel):
    fail_triggers: List[UiTrigger]
    pass_triggers: List[UiTrigger]

class RedFlag(BaseModel):
    part: str
    desc: str

class Scenario(BaseModel):
    id: str
    title: Optional[str] = None
    category: str
    difficulty: Optional[str] = None
    sender_name: str
    content_body: str
    hint_message: Optional[str] = None
    red_flags: List[RedFlag]
    ui_triggers: UiTriggers
    explanation: str


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

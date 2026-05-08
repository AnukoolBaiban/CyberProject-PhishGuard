import uuid
from typing import List, Optional, Dict, Any
from sqlalchemy import Column, String, Text, Boolean, Integer, DateTime, ForeignKey, JSON, func
from sqlalchemy.dialects.postgresql import UUID
from app.database import Base
from pydantic import BaseModel, ConfigDict

# ── SQLAlchemy Models ────────────────────────────────────────────────────────

class Scenario(Base):
    __tablename__ = "scenarios"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    title = Column(String, nullable=True)
    category = Column(String, nullable=False) # SMS, EMAIL, CHAT, WEBSITE
    difficulty = Column(String, nullable=True)
    sender_name = Column(String, nullable=True)
    content_body = Column(Text, nullable=False)
    hint_message = Column(Text, nullable=True)
    red_flags = Column(JSON, nullable=True)
    ui_triggers = Column(JSON, nullable=True)
    explanation = Column(Text, nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

class UserAttempt(Base):
    __tablename__ = "user_attempts"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_nickname = Column(String, nullable=False)
    scenario_id = Column(UUID(as_uuid=True), ForeignKey("scenarios.id"), nullable=False)
    is_correct = Column(Boolean, default=False)
    score_points = Column(Integer, default=0)
    choice_label = Column(String, nullable=True)
    played_at = Column(DateTime(timezone=True), server_default=func.now())


# ── Pydantic Schemas ─────────────────────────────────────────────────────────

class ScenarioBase(BaseModel):
    title: Optional[str] = None
    category: str
    difficulty: Optional[str] = None
    sender_name: Optional[str] = None
    content_body: str
    hint_message: Optional[str] = None
    red_flags: Optional[List[Dict[str, Any]]] = None
    ui_triggers: Optional[Dict[str, Any]] = None
    explanation: Optional[str] = None

class ScenarioResponse(ScenarioBase):
    id: uuid.UUID
    created_at: Any
    
    model_config = ConfigDict(from_attributes=True)

class AttemptCreate(BaseModel):
    user_nickname: str
    scenario_id: uuid.UUID
    is_correct: bool
    score_points: int
    choice_label: Optional[str] = None

class AttemptResponse(AttemptCreate):
    id: uuid.UUID
    played_at: Any

    model_config = ConfigDict(from_attributes=True)

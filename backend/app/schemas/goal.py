from pydantic import BaseModel
from typing import Optional
from datetime import datetime

VALID_METRICS = {"sleep", "water", "steps", "heart_rate", "stress"}

class UserGoalCreate(BaseModel):
    metric: str
    target_value: float

class UserGoalUpdate(BaseModel):
    target_value: float

class UserGoalResponse(BaseModel):
    id: int
    user_id: int
    metric: str
    target_value: float
    created_at: datetime

    class Config:
        from_attributes = True
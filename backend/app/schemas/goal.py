from pydantic import BaseModel
from datetime import datetime

class UserGoalCreate(BaseModel):
    metric: str
    target_value: float

class UserGoalResponse(BaseModel):
    id: int
    user_id: int
    metric_type: str
    target_value: float
    created_at: datetime

    class Config:
        from_attributes = True
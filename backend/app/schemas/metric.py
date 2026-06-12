from pydantic import BaseModel
from typing import Optional
from datetime import date, datetime


class HealthMetricCreate(BaseModel):
    date: Optional[str] = None
    sleep: Optional[float] = None
    water: Optional[float] = None
    steps: Optional[int] = None
    heart_rate: Optional[int] = None
    stress: Optional[int] = None


class HealthMetricResponse(BaseModel):
    id: int
    user_id: int
    date: date
    sleep: Optional[float] = None
    water: Optional[float] = None
    steps: Optional[int] = None
    heart_rate: Optional[int] = None
    stress: Optional[int] = None
    created_at: datetime

    class Config:
        from_attributes = True
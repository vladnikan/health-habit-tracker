from pydantic import BaseModel
from typing import Optional
from datetime import datetime, date


class HabitCreate(BaseModel):
    name: str
    description: Optional[str] = None
    frequency: str = "daily"
    target_value: Optional[float] = None
    unit: Optional[str] = None
    duration_type: str = "indefinite"
    end_date: Optional[date] = None
    reminder_time: Optional[str] = None


class HabitResponse(BaseModel):
    id: int
    user_id: int
    name: str
    description: Optional[str] = None
    frequency: str
    target_value: Optional[float] = None
    unit: Optional[str] = None
    duration_type: str = "indefinite"
    end_date: Optional[date] = None
    reminder_time: Optional[str] = None
    is_active: bool = True
    current_streak: int = 0
    longest_streak: int = 0
    created_at: datetime

    class Config:
        from_attributes = True


class HabitCheckCreate(BaseModel):
    date: Optional[date] = None
    value: Optional[float] = None


class HabitCheckResponse(BaseModel):
    id: int
    habit_id: int
    date: date
    value: Optional[float] = None
    created_at: datetime

    class Config:
        from_attributes = True
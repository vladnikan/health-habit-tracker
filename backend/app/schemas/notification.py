from pydantic import BaseModel
from typing import Optional
from datetime import datetime

class NotificationCreate(BaseModel):
    habit_id: Optional[int] = None
    title: str
    message: str
    type: str

class NotificationResponse(BaseModel):
    id: int
    user_id: int
    habit_id: Optional[int] = None
    title: str
    message: str
    type: str
    sent_at: datetime
    is_read: bool
    read_at: Optional[datetime] = None

    class Config:
        from_attributes = True
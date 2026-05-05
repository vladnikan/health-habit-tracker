from pydantic import BaseModel, EmailStr
from typing import Optional
from datetime import date, datetime

class UserCreate(BaseModel):
    email: EmailStr
    username: str
    password: str
    full_name: Optional[str] = None
    gender: Optional[str] = None          # "male", "female", "other"
    height: Optional[float] = None
    weight: Optional[float] = None
    birth_date: Optional[date] = None


class UserResponse(BaseModel):
    id: int
    email: EmailStr
    username: str
    full_name: Optional[str] = None
    gender: Optional[str] = None
    height: Optional[float] = None
    weight: Optional[float] = None
    birth_date: Optional[date] = None
    is_active: bool = True
    created_at: datetime          # ← Изменено с date на datetime

    class Config:
        from_attributes = True
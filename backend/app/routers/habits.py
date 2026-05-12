from fastapi import APIRouter, Depends, HTTPException, Body
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, delete
from datetime import date

from app.core.database import get_db
from app.models.user import User
from app.models.habit import Habit, HabitCheck
from app.schemas.habit import (
    HabitCreate,
    HabitResponse,
    HabitCheckCreate,
    HabitCheckResponse,
)
from app.routers.auth import get_current_user
from datetime import date, timedelta

router = APIRouter(
    prefix="/habits",
    tags=["habits"]
)

# ========================
# CREATE HABIT
# ========================
@router.post("/", response_model=HabitResponse)
async def create_habit(
    habit: HabitCreate,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    new_habit = Habit(
        user_id=current_user.id,
        name=habit.name,
        description=habit.description,
        frequency=habit.frequency,
        target_value=habit.target_value,
        unit=habit.unit,
        duration_type=habit.duration_type or "indefinite",
        end_date=habit.end_date,
        reminder_time=habit.reminder_time,
        is_active=True,
        current_streak=0,
        longest_streak=0
    )
    
    db.add(new_habit)
    await db.commit()
    await db.refresh(new_habit)
    return new_habit


# ========================
# GET ALL HABITS
# ========================
@router.get("/", response_model=list[HabitResponse])
async def get_habits(
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    stmt = select(Habit).where(Habit.user_id == current_user.id)
    result = await db.execute(stmt)
    return result.scalars().all()


# ========================
# 🔥 IMPORTANT: GLOBAL CHECKS (MUST BE BEFORE /{habit_id})
# ========================
@router.get("/checks", response_model=list[HabitCheckResponse])
async def get_all_checks(
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Получить все чеки пользователя"""
    stmt = (
        select(HabitCheck)
        .join(Habit)
        .where(Habit.user_id == current_user.id)
        .order_by(HabitCheck.date.desc())
    )

    result = await db.execute(stmt)
    checks = result.scalars().all()

    # Принудительно преобразуем дату в строку, чтобы избежать проблем сериализации
    for check in checks:
        if hasattr(check, 'date') and check.date:
            check.date = check.date.isoformat()

    return checks


# ========================
# GET SINGLE HABIT
# ========================
@router.get("/{habit_id}", response_model=HabitResponse)
async def get_habit(
    habit_id: int,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    stmt = select(Habit).where(
        Habit.id == habit_id,
        Habit.user_id == current_user.id
    )

    result = await db.execute(stmt)
    habit = result.scalar_one_or_none()

    if not habit:
        raise HTTPException(status_code=404, detail="Привычка не найдена")

    return habit


from sqlalchemy import delete
from fastapi import HTTPException, status

#удаление

@router.delete("/{habit_id}")
async def delete_habit(habit_id: int, db: AsyncSession = Depends(get_db)):
    habit = await db.get(Habit, habit_id)

    if not habit:
        raise HTTPException(status_code=404, detail="Habit not found")

    await db.delete(habit)
    await db.commit()

    return {"ok": True}


# ========================
# CHECK HABIT
# ========================
@router.post("/{habit_id}/check", response_model=HabitCheckResponse)
async def check_habit(
    habit_id: int,
    check: HabitCheckCreate = Body(...),
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    habit = await db.get(Habit, habit_id)
    if not habit or habit.user_id != current_user.id:
        raise HTTPException(status_code=404, detail="Привычка не найдена")

    check_date = check.date or date.today()

    # Проверяем, есть ли уже отметка за сегодня
    existing = (await db.execute(
        select(HabitCheck).where(
            HabitCheck.habit_id == habit_id,
            HabitCheck.date == check_date
        )
    )).scalar_one_or_none()

    if existing:
        return existing

    # Создаём новую отметку
    new_check = HabitCheck(
        habit_id=habit_id,
        date=check_date,
        value=check.value
    )
    db.add(new_check)

    # === Обновляем streak ===
    yesterday = check_date - timedelta(days=1)

    # Была ли отметка вчера?
    yesterday_check = await db.execute(
        select(HabitCheck).where(
            HabitCheck.habit_id == habit_id,
            HabitCheck.date == yesterday
        )
    )
    was_done_yesterday = yesterday_check.scalar_one_or_none() is not None

    if was_done_yesterday:
        habit.current_streak += 1
    else:
        habit.current_streak = 1  # начинаем новую серию

    # Обновляем longest_streak
    if habit.current_streak > habit.longest_streak:
        habit.longest_streak = habit.current_streak

    await db.commit()
    await db.refresh(new_check)
    await db.refresh(habit)   # обновляем привычку

    return new_check
# ========================
# GET CHECKS FOR ONE HABIT
# ========================
@router.get("/{habit_id}/checks", response_model=list[HabitCheckResponse])
async def get_habit_checks(
    habit_id: int,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    habit = await db.get(Habit, habit_id)

    if not habit or habit.user_id != current_user.id:
        raise HTTPException(status_code=404, detail="Привычка не найдена")

    stmt = select(HabitCheck).where(
        HabitCheck.habit_id == habit_id
    )

    result = await db.execute(stmt)
    return result.scalars().all()

# ========================
# UPDATE HABITS
# ========================

from pydantic import BaseModel
from typing import Optional

class HabitUpdate(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None
    frequency: Optional[str] = None
    target_value: Optional[float] = None
    unit: Optional[str] = None
    reminder_time: Optional[str] = None

@router.patch("/{habit_id}", response_model=HabitResponse)
async def update_habit(
    habit_id: int,
    body: HabitUpdate,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    habit = await db.get(Habit, habit_id)
    if not habit or habit.user_id != current_user.id:
        raise HTTPException(status_code=404, detail="Привычка не найдена")

    for field, value in body.model_dump(exclude_unset=True).items():
        setattr(habit, field, value)

    await db.commit()
    await db.refresh(habit)
    return habit
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, delete
from app.core.database import get_db
from app.models.user import User
from app.models.goal import UserGoal
from app.schemas.goal import UserGoalCreate, UserGoalUpdate, UserGoalResponse
from app.routers.auth import get_current_user

router = APIRouter(prefix="/goals", tags=["goals"])

VALID_METRICS = {"sleep", "water", "steps", "heart_rate", "stress"}

@router.get("/", response_model=list[UserGoalResponse])
async def get_goals(
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    result = await db.execute(
        select(UserGoal).where(UserGoal.user_id == current_user.id)
    )
    return result.scalars().all()


@router.post("/", response_model=UserGoalResponse)
async def set_goal(
    body: UserGoalCreate,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    if body.metric not in VALID_METRICS:
        raise HTTPException(status_code=400, detail=f"Неверная метрика. Допустимые: {VALID_METRICS}")

    # Если цель для этой метрики уже есть — обновляем
    result = await db.execute(
        select(UserGoal).where(
            UserGoal.user_id == current_user.id,
            UserGoal.metric == body.metric
        )
    )
    existing = result.scalar_one_or_none()

    if existing:
        existing.target_value = body.target_value
        await db.commit()
        await db.refresh(existing)
        return existing

    new_goal = UserGoal(
        user_id=current_user.id,
        metric=body.metric,
        target_value=body.target_value
    )
    db.add(new_goal)
    await db.commit()
    await db.refresh(new_goal)
    return new_goal


@router.delete("/{metric}")
async def delete_goal(
    metric: str,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    result = await db.execute(
        select(UserGoal).where(
            UserGoal.user_id == current_user.id,
            UserGoal.metric == metric
        )
    )
    goal = result.scalar_one_or_none()
    if not goal:
        raise HTTPException(status_code=404, detail="Цель не найдена")

    await db.delete(goal)
    await db.commit()
    return {"ok": True}
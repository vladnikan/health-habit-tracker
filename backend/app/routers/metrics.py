from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from app.core.database import get_db
from app.models.user import User
from app.models.metric import HealthMetric
from app.schemas.metric import HealthMetricCreate, HealthMetricResponse
from app.routers.auth import get_current_user
from datetime import date

router = APIRouter(prefix="/metrics", tags=["metrics"])

@router.get("/", response_model=list[HealthMetricResponse])
async def get_metrics(
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    stmt = select(HealthMetric).where(HealthMetric.user_id == current_user.id).order_by(HealthMetric.date.desc())
    result = await db.execute(stmt)
    return result.scalars().all()

@router.post("/", response_model=HealthMetricResponse)
async def save_metrics(
    metric: HealthMetricCreate,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    # Приводим дату к объекту date
    if isinstance(metric.date, str):
        from datetime import datetime
        metric_date = datetime.strptime(metric.date, "%Y-%m-%d").date()
    else:
        metric_date = metric.date or date.today()

    # Запрос
    stmt = select(HealthMetric).where(
        HealthMetric.user_id == current_user.id,
        HealthMetric.date == metric_date
    )

    result = await db.execute(stmt)
    existing = result.scalar_one_or_none()

    if existing:
        # Обновляем
        update_data = metric.model_dump(exclude_unset=True, exclude={"date"})
        for field, value in update_data.items():
            if value is not None:
                setattr(existing, field, value)
        await db.commit()
        await db.refresh(existing)
        return existing
    else:
        # Создаём новую
        new_metric = HealthMetric(
            user_id=current_user.id,
            date=metric_date,
            **metric.model_dump(exclude_unset=True, exclude={"date"})
        )
        db.add(new_metric)
        await db.commit()
        await db.refresh(new_metric)
        return new_metric
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from datetime import datetime, timezone
from app.core.database import get_db
from app.models.user import User
from app.models.notification import NotificationLog
from app.schemas.notification import NotificationCreate, NotificationResponse
from app.routers.auth import get_current_user

router = APIRouter(prefix="/notifications", tags=["notifications"])


@router.get("/", response_model=list[NotificationResponse])
async def get_notifications(
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Получить все уведомления пользователя — свежие первыми"""
    result = await db.execute(
        select(NotificationLog)
        .where(NotificationLog.user_id == current_user.id)
        .order_by(NotificationLog.sent_at.desc())
    )
    return result.scalars().all()


@router.get("/unread-count")
async def get_unread_count(
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Количество непрочитанных уведомлений — для бейджа в шапке"""
    result = await db.execute(
        select(NotificationLog).where(
            NotificationLog.user_id == current_user.id,
            NotificationLog.is_read == False
        )
    )
    count = len(result.scalars().all())
    return {"count": count}


@router.post("/", response_model=NotificationResponse)
async def create_notification(
    body: NotificationCreate,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    new = NotificationLog(
        user_id=current_user.id,
        habit_id=body.habit_id,
        title=body.title,
        message=body.message,
        type=body.type,
    )
    db.add(new)
    await db.commit()
    await db.refresh(new)
    return new


@router.patch("/{notification_id}/read")
async def mark_as_read(
    notification_id: int,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    result = await db.execute(
        select(NotificationLog).where(
            NotificationLog.id == notification_id,
            NotificationLog.user_id == current_user.id
        )
    )
    notification = result.scalar_one_or_none()
    if not notification:
        raise HTTPException(status_code=404, detail="Уведомление не найдено")

    notification.is_read = True
    notification.read_at = datetime.now(timezone.utc)
    await db.commit()
    return {"ok": True}


@router.patch("/read-all")
async def mark_all_as_read(
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Отметить все уведомления как прочитанные"""
    result = await db.execute(
        select(NotificationLog).where(
            NotificationLog.user_id == current_user.id,
            NotificationLog.is_read == False
        )
    )
    notifications = result.scalars().all()
    for n in notifications:
        n.is_read = True
        n.read_at = datetime.now(timezone.utc)
    await db.commit()
    return {"ok": True, "marked": len(notifications)}
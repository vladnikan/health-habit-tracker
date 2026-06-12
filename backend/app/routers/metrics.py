from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from app.core.database import get_db
from app.models.user import User
from app.models.metric import HealthMetric
from app.schemas.metric import HealthMetricCreate, HealthMetricResponse
from app.routers.auth import get_current_user
from datetime import date
from app.utils.health_norms import calculate_norms

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
    
    if isinstance(metric.date, str):
        from datetime import datetime
        metric_date = datetime.strptime(metric.date, "%Y-%m-%d").date()
    else:
        metric_date = metric.date or date.today()

    stmt = select(HealthMetric).where(
        HealthMetric.user_id == current_user.id,
        HealthMetric.date == metric_date
    )

    result = await db.execute(stmt)
    existing = result.scalar_one_or_none()

    if existing:
        update_data = metric.model_dump(exclude_unset=True, exclude={"date"})
        for field, value in update_data.items():
            if value is not None:
                setattr(existing, field, value)
        await db.commit()
        await db.refresh(existing)
        return existing
    else:
        new_metric = HealthMetric(
            user_id=current_user.id,
            date=metric_date,
            **metric.model_dump(exclude_unset=True, exclude={"date"})
        )
        db.add(new_metric)
        await db.commit()
        await db.refresh(new_metric)
        return new_metric
    
from app.utils.health_norms import calculate_norms

@router.get("/norms")
async def get_norms(
    current_user: User = Depends(get_current_user)
):
    return calculate_norms(current_user)
    
from fastapi import UploadFile, File
import json

@router.post("/import")
async def import_metrics(
    file: UploadFile = File(...),
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    content = await file.read()
    
    try:
        raw = json.loads(content)
    except Exception:
        raise HTTPException(status_code=400, detail="Неверный формат файла")

    imported = []

    # Парсим формат Google Takeout
    buckets = raw.get("bucket", [])
    
    for bucket in buckets:
        # Дата из миллисекунд
        start_ms = int(bucket.get("startTimeMillis", 0))
        if not start_ms:
            continue
        
        from datetime import datetime, timezone
        metric_date = datetime.fromtimestamp(
            start_ms / 1000, tz=timezone.utc
        ).date()

        # Собираем данные из датасетов
        steps = None
        sleep = None

        for dataset in bucket.get("dataset", []):
            dtype = dataset.get("dataTypeName", "")
            points = dataset.get("point", [])
            
            if not points:
                continue
                
            value = points[0].get("value", [{}])[0]

            if "step_count" in dtype:
                steps = value.get("intVal")
            elif "sleep" in dtype:
                sleep_min = value.get("intVal", 0)
                sleep = round(sleep_min / 60, 1) if sleep_min else None

        if steps is None and sleep is None:
            continue

        stmt = select(HealthMetric).where(
            HealthMetric.user_id == current_user.id,
            HealthMetric.date == metric_date
        )
        existing = (await db.execute(stmt)).scalar_one_or_none()

        if existing:
            if steps: existing.steps = steps
            if sleep: existing.sleep = sleep
        else:
            new_metric = HealthMetric(
                user_id=current_user.id,
                date=metric_date,
                steps=steps,
                sleep=sleep,
            )
            db.add(new_metric)
            imported.append(metric_date.isoformat())

    await db.commit()
    return {"imported": len(imported), "dates": imported}

from fastapi.responses import StreamingResponse
import csv
import io

@router.get("/export/csv")
async def export_csv(
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    stmt = select(HealthMetric).where(
        HealthMetric.user_id == current_user.id
    ).order_by(HealthMetric.date.asc())
    
    result = await db.execute(stmt)
    metrics = result.scalars().all()

    output = io.StringIO()
    writer = csv.writer(output)
    
    writer.writerow(["Дата", "Сон (ч)", "Вода (л)", "Шаги", "Пульс", "Стресс"])
    
    for m in metrics:
        writer.writerow([
            m.date,
            m.sleep or "",
            m.water or "",
            m.steps or "",
            m.heart_rate or "",
            m.stress or "",
        ])

    output.seek(0)
    
    return StreamingResponse(
        iter([output.getvalue()]),
        media_type="text/csv",
        headers={"Content-Disposition": "attachment; filename=health_metrics.csv"}
    )


@router.get("/export/json")
async def export_json(
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    stmt = select(HealthMetric).where(
        HealthMetric.user_id == current_user.id
    ).order_by(HealthMetric.date.asc())
    
    result = await db.execute(stmt)
    metrics = result.scalars().all()

    data = [{
        "date": str(m.date),
        "sleep": m.sleep,
        "water": m.water,
        "steps": m.steps,
        "heart_rate": m.heart_rate,
        "stress": m.stress,
    } for m in metrics]

    content = json.dumps({"metrics": data}, ensure_ascii=False, indent=2)
    
    return StreamingResponse(
        iter([content]),
        media_type="application/json",
        headers={"Content-Disposition": "attachment; filename=health_metrics.json"}
    )
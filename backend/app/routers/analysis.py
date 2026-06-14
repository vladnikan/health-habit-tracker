from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from app.core.database import get_db
from app.models.user import User
from app.models.metric import HealthMetric
from app.models.habit import Habit, HabitCheck
from app.routers.auth import get_current_user
from datetime import date, timedelta
from typing import Optional

import httpx
import os

router = APIRouter(prefix="/analysis", tags=["analysis"])


def calc_trend(values: list[float]) -> str:
    if len(values) < 3:
        return "недостаточно данных"
    first_half = sum(values[:len(values)//2]) / (len(values)//2)
    second_half = sum(values[len(values)//2:]) / (len(values) - len(values)//2)
    diff = second_half - first_half
    if diff > 0.05 * first_half:
        return "растёт"
    elif diff < -0.05 * first_half:
        return "снижается"
    return "стабильно"


def pearson_correlation(x: list[float], y: list[float]) -> Optional[float]:
    n = len(x)
    if n < 3:
        return None
    mean_x = sum(x) / n
    mean_y = sum(y) / n
    num = sum((x[i] - mean_x) * (y[i] - mean_y) for i in range(n))
    den_x = sum((v - mean_x) ** 2 for v in x) ** 0.5
    den_y = sum((v - mean_y) ** 2 for v in y) ** 0.5
    if den_x == 0 or den_y == 0:
        return None
    return round(num / (den_x * den_y), 2)


@router.get("/")
async def get_analysis(
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    since = date.today() - timedelta(days=30)
    stmt = select(HealthMetric).where(
        HealthMetric.user_id == current_user.id,
        HealthMetric.date >= since
    ).order_by(HealthMetric.date.asc())
    result = await db.execute(stmt)
    metrics = result.scalars().all()

    habits_stmt = select(Habit).where(Habit.user_id == current_user.id)
    habits = (await db.execute(habits_stmt)).scalars().all()

    checks_stmt = select(HabitCheck).join(Habit).where(
        Habit.user_id == current_user.id,
        HabitCheck.date >= since
    )
    checks = (await db.execute(checks_stmt)).scalars().all()

    def avg(field):
        vals = [getattr(m, field) for m in metrics if getattr(m, field) is not None]
        return round(sum(vals) / len(vals), 1) if vals else None

    averages = {
        "sleep": avg("sleep"),
        "water": avg("water"),
        "steps": avg("steps"),
        "heart_rate": avg("heart_rate"),
        "stress": avg("stress"),
    }

    def vals(field):
        return [getattr(m, field) for m in metrics if getattr(m, field) is not None]

    trends = {
        "sleep": calc_trend(vals("sleep")),
        "water": calc_trend(vals("water")),
        "steps": calc_trend(vals("steps")),
        "stress": calc_trend(vals("stress")),
    }

    sleep_vals = vals("sleep")
    stress_vals = vals("stress")
    steps_vals = vals("steps")
    hr_vals = vals("heart_rate")

    def aligned(a, b, field_a, field_b):
        pairs = [(getattr(m, field_a), getattr(m, field_b))
                 for m in metrics
                 if getattr(m, field_a) is not None and getattr(m, field_b) is not None]
        return [p[0] for p in pairs], [p[1] for p in pairs]

    sl, st = aligned(None, None, "sleep", "stress")
    sp, hr = aligned(None, None, "steps", "heart_rate")

    correlations = {
        "sleep_stress": pearson_correlation(sl, st),
        "steps_heart_rate": pearson_correlation(sp, hr),
    }

    def day_score(m):
        score = 0
        if m.sleep: score += min(m.sleep / 8, 1) * 25
        if m.water: score += min(m.water / 2, 1) * 25
        if m.steps: score += min(m.steps / 10000, 1) * 25
        if m.stress: score += (1 - m.stress / 100) * 25
        return round(score, 1)

    scored = [(m.date.isoformat(), day_score(m)) for m in metrics]
    best_day = max(scored, key=lambda x: x[1]) if scored else None
    worst_day = min(scored, key=lambda x: x[1]) if scored else None

    habit_completion = []
    for habit in habits:
        habit_checks = [c for c in checks if c.habit_id == habit.id]
        completion_rate = round(len(habit_checks) / 30 * 100, 1)
        habit_completion.append({
            "name": habit.name,
            "completed_days": len(habit_checks),
            "completion_rate": completion_rate,
            "current_streak": habit.current_streak,
        })

    recommendations = []

    if averages["sleep"] and averages["sleep"] < 6:
        recommendations.append({
            "type": "danger",
            "metric": "sleep",
            "text": f"Среднее время сна ({averages['sleep']} ч) ниже нормы. Рекомендуется 7–9 часов для восстановления."
        })
    elif averages["sleep"] and averages["sleep"] < 7:
        recommendations.append({
            "type": "warning",
            "metric": "sleep",
            "text": f"Сон ({averages['sleep']} ч) немного ниже оптимума. Старайтесь ложиться на 30–60 минут раньше."
        })

    if averages["water"] and averages["water"] < 1.5:
        recommendations.append({
            "type": "danger",
            "metric": "water",
            "text": f"Вы пьёте мало воды (в среднем {averages['water']} л). Норма — 1.5–2.5 л в день."
        })

    if averages["steps"] and averages["steps"] < 5000:
        recommendations.append({
            "type": "warning",
            "metric": "steps",
            "text": f"Низкая активность: {int(averages['steps'])} шагов в день. ВОЗ рекомендует минимум 7500."
        })

    if averages["stress"] and averages["stress"] > 70:
        recommendations.append({
            "type": "danger",
            "metric": "stress",
            "text": f"Высокий уровень стресса ({averages['stress']}/100). Рассмотрите медитацию или дыхательные практики."
        })

    if trends["sleep"] == "снижается":
        recommendations.append({
            "type": "warning",
            "metric": "sleep",
            "text": "Качество сна ухудшается на протяжении последних недель. Обратите внимание на режим дня."
        })

    if correlations["sleep_stress"] and correlations["sleep_stress"] < -0.4:
        recommendations.append({
            "type": "info",
            "metric": "correlation",
            "text": f"Выявлена связь: когда вы меньше спите, уровень стресса растёт (корреляция {correlations['sleep_stress']}). Приоритизируйте сон."
        })

    if not recommendations:
        recommendations.append({
            "type": "success",
            "metric": "general",
            "text": "Все показатели в норме. Продолжайте в том же духе!"
        })

    return {
        "period_days": 30,
        "metrics_recorded": len(metrics),
        "averages": averages,
        "trends": trends,
        "correlations": correlations,
        "best_day": best_day,
        "worst_day": worst_day,
        "habit_completion": habit_completion,
        "recommendations": recommendations,
    }

@router.post("/ai-insight")
async def ai_insight(
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    analysis = await get_analysis(current_user=current_user, db=db)
    
    prompt = f"""Ты — персональный health-аналитик. Проанализируй данные пользователя за последние {analysis['period_days']} дней.

Средние показатели:
- Сон: {analysis['averages']['sleep']} ч (норма 7–9)
- Вода: {analysis['averages']['water']} л (норма 1.5–2.5)
- Шаги: {analysis['averages']['steps']} (норма 7500+)
- Пульс: {analysis['averages']['heart_rate']} уд/мин
- Стресс: {analysis['averages']['stress']}/100

Тренды: {analysis['trends']}
Корреляция сон↔стресс: {analysis['correlations']['sleep_stress']}
Лучший день: {analysis['best_day']}
Худший день: {analysis['worst_day']}

Привычки:
{chr(10).join(f"- {h['name']}: {h['completion_rate']}%, streak {h['current_streak']} дн" for h in analysis['habit_completion'])}

Дай 3–4 конкретных персонализированных совета. Опирайся на числа, не общие фразы."""

    async with httpx.AsyncClient() as client:
        response = await client.post(
            "https://api.groq.com/openai/v1/chat/completions",
            headers={
                "Authorization": f"Bearer {os.getenv('GROQ_API_KEY')}",
                "Content-Type": "application/json",
            },
            json={
                "model": "llama-3.3-70b-versatile",
                "messages": [{"role": "user", "content": prompt}],
                "max_tokens": 1000,
            },
            timeout=30.0,
    )

    result = response.json()
    text = result["choices"][0]["message"]["content"]
    return {"insight": text}
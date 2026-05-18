from datetime import date
from typing import Dict, Any


def calculate_norms(user) -> Dict[str, Any]:
    """
    Рассчитывает персонализированные нормы для пользователя
    на основе возраста, пола и веса.
    """
    norms: Dict[str, Any] = {}

    # === Расчёт возраста ===
    age = None
    if user.birth_date:
        today = date.today()
        age = today.year - user.birth_date.year - (
            (today.month, today.day) < (user.birth_date.month, user.birth_date.day)
        )

    # === Сон ===
    if age is not None:
        if age <= 13:
            norms["sleep"] = {"min": 9, "max": 11, "recommended": 10, "label": "9–11 часов"}
        elif age <= 18:
            norms["sleep"] = {"min": 8, "max": 10, "recommended": 9, "label": "8–10 часов"}
        elif age <= 64:
            norms["sleep"] = {"min": 7, "max": 9, "recommended": 8, "label": "7–9 часов"}
        else:
            norms["sleep"] = {"min": 7, "max": 8, "recommended": 7.5, "label": "7–8 часов"}
    else:
        norms["sleep"] = {"min": 7, "max": 9, "recommended": 8, "label": "7–9 часов"}

    # === Вода (≈33 мл на кг веса) ===
    if user.weight and user.weight > 0:
        water_recommended = round(user.weight * 0.033, 1)
        norms["water"] = {
            "min": round(water_recommended * 0.85, 1),
            "max": round(water_recommended * 1.15, 1),
            "recommended": water_recommended,
            "label": f"{water_recommended} л"
        }
    else:
        norms["water"] = {"min": 1.8, "max": 3.0, "recommended": 2.5, "label": "1.8–3.0 л"}

    # === Шаги ===
    if user.gender == "female":
        norms["steps"] = {"min": 7000, "max": 11000, "recommended": 8500, "label": "7000–11000"}
    else:
        norms["steps"] = {"min": 8000, "max": 13000, "recommended": 10000, "label": "8000–13000"}

    # === Пульс покоя ===
    norms["heart_rate"] = {"min": 55, "max": 100, "recommended": 70, "label": "55–100 уд/мин"}

    # === Стресс ===
    norms["stress"] = {"min": 0, "max": 40, "recommended": 25, "label": "0–40 баллов"}

    return norms
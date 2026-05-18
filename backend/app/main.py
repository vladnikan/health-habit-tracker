# backend/app/main.py
from fastapi import FastAPI, Depends
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv

# ←←← ВАЖНО: Импортируем модели, чтобы они зарегистрировались
from app.models.user import User
from app.models.habit import Habit

from app.core.database import engine, Base
from app.routers import auth, habits
from app.routers.auth import get_current_user
from app.routers import metrics

from app.routers import analysis
from app.routers import goals


load_dotenv()

app = FastAPI(
    title="Habit Tracker API",
    description="Backend для приложения трекинга привычек и здоровья",
    version="1.0.0"
)

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://127.0.0.1:5173"],  # добавили оба варианта
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],)

@app.get("/")
async def root():
    return {
        "message": "Habit Tracker Backend успешно запущен!",
        "status": "ok",
        "database": "Подключение настроено"
    }

# Создание таблиц при старте
@app.on_event("startup")
async def startup_event():
    try:
        async with engine.begin() as conn:
            await conn.run_sync(Base.metadata.create_all)
        print("✅ Таблицы успешно созданы или уже существуют")
    except Exception as e:
        print(f"❌ Ошибка при создании таблиц: {e}")

app.include_router(auth.router)
app.include_router(habits.router)
app.include_router(metrics.router)
app.include_router(analysis.router)
app.include_router(goals.router)

@app.get("/me", response_model=dict)
async def read_users_me(current_user: User = Depends(get_current_user)):
    """Защищённый эндпоинт — требует валидный JWT токен"""
    return {
        "id": current_user.id,
        "email": current_user.email,
        "username": current_user.username,
        "full_name": current_user.full_name,
        "message": "Вы успешно авторизованы через JWT токен!"
    }


if __name__ == "__main__":
    import uvicorn
    uvicorn.run("app.main:app", host="0.0.0.0", port=8000, reload=True)
from sqlalchemy import Column, Integer, String, Boolean, DateTime, ForeignKey, Float, Date, UniqueConstraint
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from datetime import date
from app.core.database import Base


class Habit(Base):
    __tablename__ = "habits"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)

    name = Column(String, nullable=False)
    description = Column(String, nullable=True)
    frequency = Column(String, default="daily")

    target_value = Column(Float, nullable=True)
    unit = Column(String(30), nullable=True)
    duration_type = Column(String(20), default="indefinite")
    end_date = Column(Date, nullable=True)
    reminder_time = Column(String(10), nullable=True)   # увеличил до 10 на всякий

    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    current_streak = Column(Integer, default=0)
    longest_streak = Column(Integer, default=0)

    user = relationship("User", back_populates="habits")
    checks = relationship(
        "HabitCheck",
        back_populates="habit",
        cascade="all, delete-orphan",
        passive_deletes=True
    )


class HabitCheck(Base):
    __tablename__ = "habit_checks"

    id = Column(Integer, primary_key=True, index=True)

    habit_id = Column(
        Integer,
        ForeignKey("habits.id", ondelete="CASCADE"),
        nullable=False
    )

    date = Column(Date, nullable=False, default=date.today)
    value = Column(Float, nullable=True)

    created_at = Column(DateTime(timezone=True), server_default=func.now())

    habit = relationship("Habit", back_populates="checks")

    # Уникальность: одна отметка на привычку в день
    __table_args__ = (
        UniqueConstraint('habit_id', 'date', name='uq_habit_check_date'),
    )
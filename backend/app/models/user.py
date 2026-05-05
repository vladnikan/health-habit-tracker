from sqlalchemy import Column, Integer, String, Boolean, DateTime, Float, Date
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
from app.core.database import Base
from datetime import date

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True, nullable=False)
    username = Column(String, unique=True, index=True, nullable=False)
    hashed_password = Column(String, nullable=False)
    full_name = Column(String, nullable=True)
    
    gender = Column(String(10), nullable=True)      # male / female / other
    height = Column(Float, nullable=True)           # см
    weight = Column(Float, nullable=True)           # кг
    birth_date = Column(Date, nullable=True)

    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    habits = relationship("Habit", back_populates="user", cascade="all, delete-orphan")
    metrics = relationship("HealthMetric", back_populates="user", cascade="all, delete-orphan")
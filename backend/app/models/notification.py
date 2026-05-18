from sqlalchemy import Column, Integer, String, Boolean, DateTime, ForeignKey
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
from app.core.database import Base

class NotificationLog(Base):
    __tablename__ = "notification_logs"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    habit_id = Column(Integer, ForeignKey("habits.id", ondelete="SET NULL"), nullable=True)
    
    title = Column(String(100), nullable=False)
    message = Column(String(255), nullable=False)
    type = Column(String(30), nullable=False)          # reminder, achievement, system, motivation
    
    sent_at = Column(DateTime(timezone=True), server_default=func.now())
    is_read = Column(Boolean, default=False)
    read_at = Column(DateTime(timezone=True), nullable=True)

    user = relationship("User")
    habit = relationship("Habit")

    def __repr__(self):
        return f"<NotificationLog {self.type} for user {self.user_id}>"
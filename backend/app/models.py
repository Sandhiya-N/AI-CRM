"""SQLAlchemy ORM models for HCP interactions."""

from datetime import date, datetime, time

from sqlalchemy import Date, DateTime, Integer, JSON, String, Text, Time, func
from sqlalchemy.orm import Mapped, mapped_column

from app.database import Base


class Interaction(Base):
    """Stores a single HCP interaction log entry."""

    __tablename__ = "interactions"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)

    doctor_name: Mapped[str] = mapped_column(String(255), nullable=False, index=True)
    hospital: Mapped[str | None] = mapped_column(String(255), nullable=True)
    specialization: Mapped[str | None] = mapped_column(String(255), nullable=True)
    meeting_date: Mapped[date | None] = mapped_column(Date, nullable=True, index=True)
    meeting_time: Mapped[time | None] = mapped_column(Time, nullable=True)
    interaction_type: Mapped[str | None] = mapped_column(String(100), nullable=True)
    attendees: Mapped[list[str] | None] = mapped_column(JSON, nullable=True)
    products_discussed: Mapped[list[str] | None] = mapped_column(JSON, nullable=True)
    discussion_summary: Mapped[str | None] = mapped_column(Text, nullable=True)
    materials_shared: Mapped[list[str] | None] = mapped_column(JSON, nullable=True)
    samples_distributed: Mapped[list[str] | None] = mapped_column(JSON, nullable=True)
    hcp_sentiment: Mapped[str | None] = mapped_column(String(50), nullable=True)
    outcomes: Mapped[str | None] = mapped_column(Text, nullable=True)
    follow_up_actions: Mapped[list[str] | None] = mapped_column(JSON, nullable=True)
    follow_up_date: Mapped[date | None] = mapped_column(Date, nullable=True)
    priority: Mapped[str | None] = mapped_column(String(50), nullable=True)
    next_action: Mapped[str | None] = mapped_column(String(500), nullable=True)

    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        server_default=func.now(),
        nullable=False,
    )
    updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        server_default=func.now(),
        onupdate=func.now(),
        nullable=False,
    )

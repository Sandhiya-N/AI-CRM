"""Pydantic schemas for request/response validation."""

from datetime import date, datetime, time
from typing import Any

from pydantic import BaseModel, ConfigDict, Field, field_validator


class InteractionBase(BaseModel):
    """Shared fields for interaction create/update."""

    doctor_name: str | None = None
    hospital: str | None = None
    specialization: str | None = None
    meeting_date: date | None = None
    meeting_time: time | None = None
    interaction_type: str | None = None
    attendees: list[str] = Field(default_factory=list)
    products_discussed: list[str] = Field(default_factory=list)
    discussion_summary: str | None = None
    materials_shared: list[str] = Field(default_factory=list)
    samples_distributed: list[str] = Field(default_factory=list)
    hcp_sentiment: str | None = None
    outcomes: str | None = None
    follow_up_actions: list[str] = Field(default_factory=list)
    follow_up_date: date | None = None
    priority: str | None = None
    next_action: str | None = None

    @field_validator("doctor_name")
    @classmethod
    def doctor_name_not_empty(cls, v: str | None) -> str | None:
        if v is not None and not v.strip():
            raise ValueError("doctor_name cannot be empty")
        return v.strip() if v else v


class InteractionCreate(InteractionBase):
    """Schema for manually saving an interaction."""

    doctor_name: str = Field(..., min_length=1, description="Required HCP name")


class InteractionUpdate(BaseModel):
    """Partial update schema — all fields optional."""

    doctor_name: str | None = None
    hospital: str | None = None
    specialization: str | None = None
    meeting_date: date | None = None
    meeting_time: time | None = None
    interaction_type: str | None = None
    attendees: list[str] | None = None
    products_discussed: list[str] | None = None
    discussion_summary: str | None = None
    materials_shared: list[str] | None = None
    samples_distributed: list[str] | None = None
    hcp_sentiment: str | None = None
    outcomes: str | None = None
    follow_up_actions: list[str] | None = None
    follow_up_date: date | None = None
    priority: str | None = None
    next_action: str | None = None


class InteractionResponse(InteractionBase):
    """Full interaction record returned by the API."""

    model_config = ConfigDict(from_attributes=True)

    id: int
    doctor_name: str
    created_at: datetime
    updated_at: datetime


class ChatRequest(BaseModel):
    """Natural-language message from the AI chat assistant."""

    message: str = Field(..., min_length=1, description="User conversation text")
    interaction_id: int | None = Field(
        default=None,
        description="Optional interaction ID when editing an existing record",
    )


class ChatResponse(BaseModel):
    """Chat reply plus the form fields extracted from the user's message."""

    success: bool = True
    reply: str = "Interaction logged successfully."
    extracted_data: dict[str, Any] = Field(default_factory=dict)
    action: str = Field(
        default="extract",
        description="Agent action: extract | log | edit | search | history | followup",
    )
    data: dict[str, Any] = Field(default_factory=dict)
    message: str | None = Field(
        default=None,
        description="Human-readable message or validation prompt",
    )
    validation_errors: list[str] = Field(default_factory=list)
    interaction: InteractionResponse | None = None


class FollowUpRecommendation(BaseModel):
    """LLM-generated follow-up suggestions."""

    doctor_name: str
    recommendations: list[str]
    suggested_follow_up_date: date | None = None
    priority: str | None = None
    rationale: str | None = None

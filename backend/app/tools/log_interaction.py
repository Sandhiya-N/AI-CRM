"""Tool: persist a new HCP interaction to PostgreSQL."""

import json
from datetime import date, time
from typing import Any

from langchain_core.tools import tool
from sqlalchemy.ext.asyncio import AsyncSession

from app.models import Interaction


def _parse_date(value: str | None) -> date | None:
    if not value:
        return None
    if isinstance(value, date):
        return value
    return date.fromisoformat(str(value))


def _parse_time(value: str | None) -> time | None:
    if not value:
        return None
    if isinstance(value, time):
        return value
    return time.fromisoformat(str(value))


def _build_interaction(data: dict[str, Any]) -> Interaction:
    """Map extracted dict to an ORM Interaction instance."""
    return Interaction(
        doctor_name=data["doctor_name"],
        hospital=data.get("hospital"),
        specialization=data.get("specialization"),
        meeting_date=_parse_date(data.get("meeting_date")),
        meeting_time=_parse_time(data.get("meeting_time")),
        interaction_type=data.get("interaction_type"),
        attendees=data.get("attendees") or [],
        products_discussed=data.get("products_discussed") or [],
        discussion_summary=data.get("discussion_summary"),
        materials_shared=data.get("materials_Distributed") or [],
        hcp_sentiment=data.get("hcp_sentiment"),
        outcomes=data.get("outcomes"),
        follow_up_actions=data.get("follow_up_actions") or [],
        follow_up_date=_parse_date(data.get("follow_up_date")),
        priority=data.get("priority"),
        next_action=data.get("next_action"),
    )
async def log_interaction_to_db(session: AsyncSession, data: dict[str, Any]) -> Interaction:
    """Save interaction — used by LangGraph tool and REST endpoint."""
    interaction = _build_interaction(data)
    session.add(interaction)
    await session.flush()
    await session.refresh(interaction)
    return interaction


def create_log_interaction_tool(session: AsyncSession):
    """Factory that binds the database session to the LangChain tool."""

    @tool
    async def log_interaction(interaction_json: str) -> str:
        """
        Save a new HCP interaction to the database.
        Input must be a JSON string with interaction fields including doctor_name.
        """
        data = json.loads(interaction_json)
        if not data.get("doctor_name"):
            return json.dumps({"success": False, "error": "doctor_name is required"})

        interaction = await log_interaction_to_db(session, data)
        return json.dumps({"success": True, "interaction_id": interaction.id})

    return log_interaction

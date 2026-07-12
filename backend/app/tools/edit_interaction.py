"""Tool: modify an existing HCP interaction."""

import json
from datetime import date, time
from typing import Any

from langchain_core.tools import tool
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.models import Interaction


def _apply_updates(interaction: Interaction, updates: dict[str, Any]) -> None:
    """Apply partial updates to an interaction record."""
    date_fields = {"meeting_date", "follow_up_date"}
    time_fields = {"meeting_time"}
    list_fields = {
        "attendees",
        "products_discussed",
        "materials_shared",
        "samples_distributed",
        "follow_up_actions",
    }

    for key, value in updates.items():
        if value is None or not hasattr(interaction, key):
            continue
        if key in date_fields and value:
            setattr(interaction, key, date.fromisoformat(str(value)))
        elif key in time_fields and value:
            setattr(interaction, key, time.fromisoformat(str(value)))
        elif key in list_fields:
            setattr(interaction, key, value or [])
        else:
            setattr(interaction, key, value)


async def edit_interaction_in_db(
    session: AsyncSession,
    interaction_id: int,
    updates: dict[str, Any],
) -> Interaction | None:
    """Update interaction by ID — used by LangGraph tool and REST endpoint."""
    result = await session.execute(
        select(Interaction).where(Interaction.id == interaction_id)
    )
    interaction = result.scalar_one_or_none()
    if interaction is None:
        return None

    _apply_updates(interaction, updates)
    await session.flush()
    await session.refresh(interaction)
    return interaction


def create_edit_interaction_tool(session: AsyncSession):
    """Factory that binds the database session to the LangChain tool."""

    @tool
    async def edit_interaction(payload_json: str) -> str:
        """
        Modify an existing HCP interaction.
        Input JSON: {"interaction_id": int, "updates": {...fields to change...}}
        """
        payload = json.loads(payload_json)
        interaction_id = payload.get("interaction_id")
        updates = payload.get("updates", {})

        if not interaction_id:
            return json.dumps({"success": False, "error": "interaction_id is required"})

        interaction = await edit_interaction_in_db(session, interaction_id, updates)
        if interaction is None:
            return json.dumps({"success": False, "error": f"Interaction {interaction_id} not found"})

        return json.dumps({"success": True, "interaction_id": interaction.id})

    return edit_interaction

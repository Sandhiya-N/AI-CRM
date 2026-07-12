"""Tool: return full interaction history."""

import json

from langchain_core.tools import tool
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.models import Interaction
from app.schemas import InteractionResponse


async def get_all_interactions(session: AsyncSession, limit: int = 100) -> list[Interaction]:
    """Fetch interactions ordered by most recent meeting/creation date."""
    result = await session.execute(
        select(Interaction)
        .order_by(Interaction.meeting_date.desc().nullslast(), Interaction.created_at.desc())
        .limit(limit)
    )
    return list(result.scalars().all())


def create_history_tool(session: AsyncSession):
    """Factory that binds the database session to the LangChain tool."""

    @tool
    async def interaction_history(limit: int = 50) -> str:
        """
        Return interaction history for all HCPs.
        Optional limit parameter (default 50).
        """
        interactions = await get_all_interactions(session, limit=limit)
        records = [
            InteractionResponse.model_validate(i).model_dump(mode="json")
            for i in interactions
        ]
        return json.dumps({"success": True, "count": len(records), "interactions": records})

    return interaction_history

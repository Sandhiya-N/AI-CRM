"""Tool: search previous interactions for a specific HCP."""

import json

from langchain_core.tools import tool
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.models import Interaction
from app.schemas import InteractionResponse


async def search_hcp_in_db(session: AsyncSession, doctor_name: str) -> list[Interaction]:
    """Case-insensitive partial match on doctor name."""
    pattern = f"%{doctor_name.strip()}%"
    result = await session.execute(
        select(Interaction)
        .where(Interaction.doctor_name.ilike(pattern))
        .order_by(Interaction.meeting_date.desc().nullslast(), Interaction.created_at.desc())
    )
    return list(result.scalars().all())


def create_search_hcp_tool(session: AsyncSession):
    """Factory that binds the database session to the LangChain tool."""

    @tool
    async def search_hcp(doctor_name: str) -> str:
        """
        Search previous doctor/HCP interactions by name.
        Returns matching interaction records as JSON.
        """
        interactions = await search_hcp_in_db(session, doctor_name)
        records = [
            InteractionResponse.model_validate(i).model_dump(mode="json")
            for i in interactions
        ]
        return json.dumps({"success": True, "count": len(records), "interactions": records})

    return search_hcp

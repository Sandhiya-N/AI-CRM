"""Tool: LLM-powered follow-up recommendations for an HCP."""

import json
import re

from langchain_core.tools import tool
from sqlalchemy.ext.asyncio import AsyncSession

from app.schemas import InteractionResponse
from app.services.groq_service import GroqService
from app.tools.search_hcp import search_hcp_in_db


async def generate_followup_for_doctor(
    session: AsyncSession,
    groq: GroqService,
    doctor_name: str,
) -> dict:
    """Fetch history and ask Groq for follow-up recommendations."""
    interactions = await search_hcp_in_db(session, doctor_name)
    if not interactions:
        return {
            "success": False,
            "error": f"No interactions found for {doctor_name}",
        }

    context = [
        InteractionResponse.model_validate(i).model_dump(mode="json")
        for i in interactions
    ]
    recommendation = await groq.generate_followup(doctor_name, context)
    return {
        "success": True,
        "doctor_name": doctor_name,
        **recommendation,
    }


def create_followup_tool(session: AsyncSession, groq: GroqService):
    """Factory that binds session and Groq service to the LangChain tool."""

    @tool
    async def followup_recommendation(doctor_name: str) -> str:
        """
        Generate intelligent follow-up suggestions for a doctor/HCP
        based on their interaction history.
        """
        result = await generate_followup_for_doctor(session, groq, doctor_name)
        return json.dumps(result, default=str)

    return followup_recommendation


def extract_doctor_name_from_message(message: str) -> str | None:
    """Heuristic extraction when user mentions a doctor in free text."""
    patterns = [
        r"(?:dr\.?|doctor)\s+([A-Z][a-z]+(?:\s+[A-Z][a-z]+)*)",
        r"for\s+(?:dr\.?|doctor)?\s*([A-Z][a-z]+(?:\s+[A-Z][a-z]+)*)",
    ]
    for pattern in patterns:
        match = re.search(pattern, message, re.IGNORECASE)
        if match:
            name = match.group(1).strip()
            return f"Dr. {name}" if not name.lower().startswith("dr") else name
    return None

"""FastAPI routers for HCP interaction endpoints."""

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.database import get_db
from app.langgraph.graph import build_agent_graph
from app.schemas import (
    ChatRequest,
    ChatResponse,
    InteractionCreate,
    InteractionResponse,
    InteractionUpdate,
)
from app.services.groq_service import GroqService, get_groq_service
from app.tools.edit_interaction import edit_interaction_in_db
from app.tools.history import get_all_interactions
from app.tools.log_interaction import log_interaction_to_db
from app.tools.search_hcp import search_hcp_in_db

router = APIRouter(tags=["interactions"])


def _to_form_extraction(data: dict) -> dict:
    """Expose the stable assistant contract while retaining CRM fields for the form."""
    return {
        **data,
        "hcp_name": data.get("doctor_name") or data.get("hcp_name"),
        "interaction_type": data.get("interaction_type"),
        "topics_discussed": data.get("discussion_summary") or data.get("topics_discussed"),
        "attendees": data.get("attendees") or [],
        "materials_shared": data.get("materials_shared") or [],
        "date": data.get("meeting_date") or data.get("date"),
        "time": data.get("meeting_time") or data.get("time"),
    }


@router.post("/chat", response_model=ChatResponse)
async def chat(
    request: ChatRequest,
    db: AsyncSession = Depends(get_db),
    groq: GroqService = Depends(get_groq_service),
) -> ChatResponse:
    """
    Accept natural-language conversation text, run LangGraph,
    and return structured JSON to populate the interaction form.
    """
    agent = build_agent_graph(session=db, groq=groq)
    result = await agent.process_chat(
        message=request.message,
        interaction_id=request.interaction_id,
    )
    extracted_data = _to_form_extraction(result.get("data") or {})
    return ChatResponse(
        **result,
        reply=result.get("message") or "Interaction logged successfully.",
        extracted_data=extracted_data,
    )


@router.post(
    "/interaction",
    response_model=InteractionResponse,
    status_code=status.HTTP_201_CREATED,
)
async def create_interaction(
    payload: InteractionCreate,
    db: AsyncSession = Depends(get_db),
) -> InteractionResponse:
    """Manually save an interaction (typically after AI extraction)."""
    interaction = await log_interaction_to_db(db, payload.model_dump(mode="json"))
    return InteractionResponse.model_validate(interaction)


@router.put("/interaction/{interaction_id}", response_model=InteractionResponse)
async def update_interaction(
    interaction_id: int,
    payload: InteractionUpdate,
    db: AsyncSession = Depends(get_db),
) -> InteractionResponse:
    """Edit an existing interaction by ID."""
    updates = payload.model_dump(exclude_unset=True, mode="json")
    if not updates:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="No fields provided for update",
        )

    interaction = await edit_interaction_in_db(db, interaction_id, updates)
    if interaction is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Interaction {interaction_id} not found",
        )
    return InteractionResponse.model_validate(interaction)


@router.get("/history", response_model=list[InteractionResponse])
async def history(
    limit: int = 100,
    db: AsyncSession = Depends(get_db),
) -> list[InteractionResponse]:
    """Return all stored interactions."""
    interactions = await get_all_interactions(db, limit=limit)
    return [InteractionResponse.model_validate(i) for i in interactions]


@router.get("/doctor/{doctor_name}", response_model=list[InteractionResponse])
async def search_doctor(
    doctor_name: str,
    db: AsyncSession = Depends(get_db),
) -> list[InteractionResponse]:
    """Search previous meetings for a specific doctor/HCP."""
    interactions = await search_hcp_in_db(db, doctor_name)
    return [InteractionResponse.model_validate(i) for i in interactions]

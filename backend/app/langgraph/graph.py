"""LangGraph agent — routes user messages to the appropriate CRM tool."""

import json
from datetime import datetime
from typing import Any

from langgraph.prebuilt import create_react_agent
from langchain_groq import ChatGroq
from sqlalchemy.ext.asyncio import AsyncSession

from app.config import get_settings
from app.services.groq_service import GroqService
from app.tools.edit_interaction import create_edit_interaction_tool, edit_interaction_in_db
from app.tools.followup import create_followup_tool, extract_doctor_name_from_message, generate_followup_for_doctor
from app.tools.history import create_history_tool, get_all_interactions
from app.tools.log_interaction import create_log_interaction_tool, log_interaction_to_db
from app.tools.search_hcp import create_search_hcp_tool, search_hcp_in_db
from app.schemas import InteractionResponse

settings = get_settings()


class HCPAgentGraph:
    """
    Orchestrates the HCP CRM AI workflow:
    1. Route user intent
    2. Extract structured data (for new interactions)
    3. Invoke the appropriate tool
    """

    def __init__(self, session: AsyncSession, groq: GroqService) -> None:
        self.session = session
        self.groq = groq
        self._react_agent = self._build_react_agent()

    def _build_react_agent(self):
        """Build a ReAct agent with all five CRM tools."""
        if not settings.groq_api_key:
            return None

        llm = ChatGroq(
            api_key=settings.groq_api_key,
            model=settings.groq_model,
            temperature=settings.groq_temperature,
        )
        tools = [
            create_log_interaction_tool(self.session),
            create_edit_interaction_tool(self.session),
            create_search_hcp_tool(self.session),
            create_history_tool(self.session),
            create_followup_tool(self.session, self.groq),
        ]
        return create_react_agent(llm, tools)

    async def process_chat(
        self,
        message: str,
        interaction_id: int | None = None,
    ) -> dict[str, Any]:
        """
        Main entry point for POST /chat.
        Returns structured JSON for the frontend form.
        """
        routing = await self.groq.route_message(message)
        action = routing.get("action", "extract")

        if action == "history":
            return await self._handle_history()

        if action == "search":
            doctor = extract_doctor_name_from_message(message) or self._extract_name_from_search(message)
            if not doctor:
                return self._validation_response(
                    action="search",
                    message="Which doctor would you like to search for? Please provide the doctor's name.",
                    validation_errors=["doctor_name is required for search"],
                )
            return await self._handle_search(doctor)

        if action == "followup":
            doctor = extract_doctor_name_from_message(message)
            if not doctor:
                return self._validation_response(
                    action="followup",
                    message="Please specify which doctor you need follow-up recommendations for.",
                    validation_errors=["doctor_name is required for follow-up"],
                )
            return await self._handle_followup(doctor)

        if action == "edit":
            return await self._handle_edit(message, interaction_id)

        # Default: extract (and optionally log)
        return await self._handle_extract(message, auto_save=action == "log")

    async def _handle_extract(self, message: str, auto_save: bool = False) -> dict[str, Any]:
        """Extract structured interaction data from natural language."""
        extracted = await self.groq.extract_interaction(message)

        # Fallback date inference
        if not extracted.get("meeting_date"):
            inferred = self.groq.infer_meeting_date(message)
            if inferred:
                extracted["meeting_date"] = inferred.isoformat()

        # A chat-created interaction represents the current conversation; make
        # the time immediately useful to the form when it was not stated.
        if not extracted.get("meeting_time"):
            extracted["meeting_time"] = datetime.now().strftime("%H:%M")

        validation_errors = self.groq.validate_extraction(extracted)

        if validation_errors:
            prompt_message = await self.groq.request_missing_info(validation_errors)
            return {
                "success": False,
                "action": "extract",
                "data": extracted,
                "message": prompt_message,
                "validation_errors": validation_errors,
                "interaction": None,
            }

        interaction_response = None
        if auto_save:
            interaction = await log_interaction_to_db(self.session, extracted)
            interaction_response = InteractionResponse.model_validate(interaction).model_dump(mode="json")

        return {
            "success": True,
            "action": "log" if auto_save else "extract",
            "data": extracted,
            "message": "Interaction extracted successfully." if not auto_save else "Interaction saved successfully.",
            "validation_errors": [],
            "interaction": interaction_response,
        }

    async def _handle_edit(
        self,
        message: str,
        interaction_id: int | None,
    ) -> dict[str, Any]:
        """Extract updates and apply to an existing interaction."""
        if not interaction_id:
            return self._validation_response(
                action="edit",
                message="Please specify which interaction to edit (interaction_id).",
                validation_errors=["interaction_id is required for edit"],
            )

        extracted = await self.groq.extract_interaction(message)
        # Remove null values so we only update provided fields
        updates = {k: v for k, v in extracted.items() if v is not None and v != []}

        interaction = await edit_interaction_in_db(self.session, interaction_id, updates)
        if interaction is None:
            return {
                "success": False,
                "action": "edit",
                "data": updates,
                "message": f"Interaction {interaction_id} not found.",
                "validation_errors": ["interaction not found"],
                "interaction": None,
            }

        return {
            "success": True,
            "action": "edit",
            "data": InteractionResponse.model_validate(interaction).model_dump(mode="json"),
            "message": "Interaction updated successfully.",
            "validation_errors": [],
            "interaction": InteractionResponse.model_validate(interaction).model_dump(mode="json"),
        }

    async def _handle_search(self, doctor_name: str) -> dict[str, Any]:
        interactions = await search_hcp_in_db(self.session, doctor_name)
        records = [
            InteractionResponse.model_validate(i).model_dump(mode="json")
            for i in interactions
        ]
        return {
            "success": True,
            "action": "search",
            "data": {"doctor_name": doctor_name, "interactions": records, "count": len(records)},
            "message": f"Found {len(records)} interaction(s) for {doctor_name}.",
            "validation_errors": [],
            "interaction": records[0] if records else None,
        }

    async def _handle_history(self) -> dict[str, Any]:
        interactions = await get_all_interactions(self.session)
        records = [
            InteractionResponse.model_validate(i).model_dump(mode="json")
            for i in interactions
        ]
        return {
            "success": True,
            "action": "history",
            "data": {"interactions": records, "count": len(records)},
            "message": f"Retrieved {len(records)} interaction(s).",
            "validation_errors": [],
            "interaction": None,
        }

    async def _handle_followup(self, doctor_name: str) -> dict[str, Any]:
        result = await generate_followup_for_doctor(self.session, self.groq, doctor_name)
        if not result.get("success"):
            return {
                "success": False,
                "action": "followup",
                "data": result,
                "message": result.get("error"),
                "validation_errors": [result.get("error", "unknown error")],
                "interaction": None,
            }
        return {
            "success": True,
            "action": "followup",
            "data": result,
            "message": f"Follow-up recommendations generated for {doctor_name}.",
            "validation_errors": [],
            "interaction": None,
        }

    async def run_react_agent(self, message: str) -> dict[str, Any]:
        """
        Alternative path: run the full ReAct agent for complex multi-step requests.
        Exposed for extensibility; primary flow uses process_chat().
        """
        if self._react_agent is None:
            return {
                "success": True,
                "action": "agent",
                "data": {"response": "Groq API key missing; offline chat fallback is active."},
                "message": "Groq API key missing; offline chat fallback is active.",
                "validation_errors": [],
            }

        result = await self._react_agent.ainvoke({"messages": [("user", message)]})
        last_message = result["messages"][-1]
        content = last_message.content if hasattr(last_message, "content") else str(last_message)

        try:
            parsed = json.loads(content)
            return {"success": True, "action": "agent", "data": parsed, "message": None, "validation_errors": []}
        except json.JSONDecodeError:
            return {"success": True, "action": "agent", "data": {"response": content}, "message": content, "validation_errors": []}

    @staticmethod
    def _validation_response(
        action: str,
        message: str,
        validation_errors: list[str],
    ) -> dict[str, Any]:
        return {
            "success": False,
            "action": action,
            "data": {},
            "message": message,
            "validation_errors": validation_errors,
            "interaction": None,
        }

    @staticmethod
    def _extract_name_from_search(message: str) -> str | None:
        """Pull a name after keywords like 'search' or 'find'."""
        lowered = message.lower()
        for keyword in ("search for", "find", "look up", "history of", "meetings with"):
            if keyword in lowered:
                remainder = message[lowered.index(keyword) + len(keyword):].strip()
                if remainder:
                    return remainder.rstrip("?.!")
        return None


def build_agent_graph(session: AsyncSession, groq: GroqService) -> HCPAgentGraph:
    """Factory for dependency injection."""
    return HCPAgentGraph(session=session, groq=groq)

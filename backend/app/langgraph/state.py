"""LangGraph agent state definition."""

from typing import Annotated, Any, TypedDict

from langgraph.graph.message import add_messages
from langchain_core.messages import BaseMessage


class AgentState(TypedDict):
    """Shared state passed between LangGraph nodes."""

    messages: Annotated[list[BaseMessage], add_messages]
    user_message: str
    action: str
    extracted_data: dict[str, Any]
    interaction_id: int | None
    result: dict[str, Any]
    validation_errors: list[str]
    success: bool

"""Application configuration loaded from environment variables."""

from functools import lru_cache
from pathlib import Path

from pydantic import field_validator
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    """Central configuration for the HCP CRM backend."""

    model_config = SettingsConfigDict(
        env_file=Path(__file__).resolve().parent / ".env",
        env_file_encoding="utf-8",
        case_sensitive=False,
        # Allow harmless legacy keys (for example MODEL_NAME) in an existing
        # local .env file instead of preventing the API from starting.
        extra="ignore",
    )

    # Application
    app_name: str = "HCP CRM Backend"
    debug: bool = False

    @field_validator("debug", mode="before")
    @classmethod
    def normalize_debug_value(cls, value: object) -> object:
        """Accept deployment labels commonly used in local environment files."""
        if isinstance(value, str) and value.strip().lower() in {"release", "production", "prod"}:
            return False
        return value

    # Database
    # Default to SQLite for local development so the backend can boot without
    # an external PostgreSQL credential. Override via the DATABASE_URL env var
    # when you want to point at a different server.
    database_url: str = "sqlite+aiosqlite:///./hcp_crm.db"

    # Groq
    groq_api_key: str = ""
    groq_model: str = "gemma2-9b-it"
    groq_temperature: float = 0.2


@lru_cache
def get_settings() -> Settings:
    """Return cached settings instance (dependency-injection friendly)."""
    return Settings()

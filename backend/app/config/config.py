import os
from pydantic import BaseSettings, Field

class Settings(BaseSettings):
    debug: bool = False  # Set to True in development, False in production
    secret_key: str = Field(default="your-secret-key-here", env="SECRET_KEY") # You MUST change this in production!
    database_url: str = Field(default="sqlite:///./thinkalike.db", env="DATABASE_URL")  # Default to SQLite
    ai_api_key: str | None = Field(default=None, env="AI_API_KEY") # Example: For an external AI service

    class Config:
        env_file = ".env"  # Load environment variables from a .env file

settings = Settings()

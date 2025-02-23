from pydantic import BaseSettings

class Settings(BaseSettings):
    app_name: str = "ThinkAlike"
    database_url: str
    ai_api_key: str
    secret_key: str

    class Config:
        env_file = ".env"

def get_settings():
    return Settings()

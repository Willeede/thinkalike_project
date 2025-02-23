import os
from dotenv import load_dotenv

load_dotenv()  # Load environment variables from .env file

class Config:
    """
    Configuration class for the backend application.
    Loads configuration settings from environment variables or defaults.
    """

    DEBUG = os.environ.get("DEBUG", False)  # Debug mode (default: False)
    SECRET_KEY = os.environ.get("SECRET_KEY", "your-secret-key-here")  # Replace with a strong secret key in production!

    # --- Database Configuration ---
    SQLALCHEMY_DATABASE_URI = os.environ.get("DATABASE_URL", "sqlite:///thinkalike.db")  # Example SQLite database URL (for development)
    SQLALCHEMY_TRACK_MODIFICATIONS = False  # Disable modification tracking for performance

    # --- API Keys and External Service Credentials ---
    AI_API_KEY = os.environ.get("AI_API_KEY")  # Placeholder for AI service API key

    # --- Application-Specific Configuration ---
    UI_URL = os.environ.get("UI_URL", "http://localhost:3000")  # URL of the UI application

    @staticmethod
    def init_app(app):
        """
        Initialize application-specific configuration.
        Currently a placeholder - add any app-level config here if needed.
        """
        pass

config = Config()  # Instantiate the Config class

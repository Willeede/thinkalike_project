from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import logging

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Corrected imports - relative imports within the 'app' package
from .api.agent import router as agent_router
from .api.feedback import router as feedback_router
from .api.api_v1_graph import router as graph_router
from .api.api_v1_connection_status import router as connection_status_router
from .api.index import router as index_router

app = FastAPI(title="ThinkAlike")

# Correct CORS configuration (SPECIFIC ORIGINS)
origins = [
    "http://localhost:3000",  # Local development
    "http://localhost:3001",  # Allow React on port 3001 (if used)
    "http://localhost:3002",
    "https://thinkalike-frontend.onrender.com",  # Your Render frontend URL
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include your routers, using the correct relative imports
logger.info("Registering routers...")
app.include_router(agent_router, prefix="/agent")
app.include_router(feedback_router, prefix="/feedback")
app.include_router(graph_router, prefix="/api/v1/graph")
app.include_router(connection_status_router, prefix="/api/v1/connection")
app.include_router(index_router)  # NO PREFIX


# NO ROOT ROUTE HERE - handled by index.py

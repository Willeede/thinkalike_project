from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse
import logging

# Local imports
from .api.agent import router as agent_router
from .api.feedback import router as feedback_router
from .api.api_v1_graph import router as graph_router
from .api.api_v1_connection_status import router as connection_status_router
from .api.index import router as index_router

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI(title="ThinkAlike")

# Updated CORS configuration
origins = [
    "http://localhost:3000",
    "http://localhost:3001",
    "https://thinkalike-frontend.onrender.com",
    "*"  # Temporarily allow all origins for testing
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.middleware("http")
async def log_requests(request, call_next):
    logger.info(f"Incoming request: {request.method} {request.url.path}")
    logger.info(f"Headers: {request.headers}")
    response = await call_next(request)
    logger.info(f"Response status: {response.status_code}")
    return response

@app.get("/favicon.ico")
async def favicon():
    return FileResponse("C:/Users/w_eed/Documents/thinkalike_project_fresh/backend/favicon.ico")

@app.get("/")
async def root():
    logger.info("Root endpoint called")
    return {"message": "ThinkAlike API Root. Access /api/v1/graph for graph data."}

# Register routers
logger.info("Registering routers...")
app.include_router(agent_router, prefix="/agent")
app.include_router(feedback_router, prefix="/feedback")
app.include_router(graph_router, prefix="/api/v1/graph", tags=["graph"])
app.include_router(connection_status_router, prefix="/api/v1/connection")
app.include_router(index_router)  # NO PREFIX

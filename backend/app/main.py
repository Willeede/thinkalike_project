from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

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
    "https://thinkalike-frontend.onrender.com",  # Your Render frontend URL
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    # "http://example.com",  # Add other specific origins as needed
    allow_headers=["*"],
)

# Include your routers, using the correct relative imports
app.include_router(agent_router, prefix="/api/v1/agent")
app.include_router(feedback_router, prefix="/feedback")
app.include_router(graph_router, prefix="/api/v1/graph", tags=["graph"])
app.include_router(connection_status_router, prefix="/api/v1/connection")
app.include_router(index_router)

# NO ROOT ROUTE HERE - handled by index.py
@app.get("/")
async def root():
    return {
        "message": "Welcome to the ThinkAlike API. Available endpoints:",
        "endpoints": {
            "/agent": "Agent related operations",
            "/feedback": "Feedback related operations",
            "/api/v1/graph": "Graph related operations",
            "/api/v1/connection": "Connection status operations",
            "/": "Index operations"
        }
    }

from starlette.middleware.base import BaseHTTPMiddleware
from starlette.requests import Request
import logging

# Configure logger
logger = logging.getLogger("thinkalike")
logger.setLevel(logging.INFO)
handler = logging.StreamHandler()
formatter = logging.Formatter("%(asctime)s - %(name)s - %(levelname)s - %(message)s")
handler.setFormatter(formatter)
logger.addHandler(handler)

class LogHeadersMiddleware(BaseHTTPMiddleware):
    async def dispatch(self, request: Request, call_next):
        # Log headers, masking sensitive information
        headers = dict(request.headers)
        sensitive_headers = ["authorization", "cookie"]
        for header in sensitive_headers:
            if header in headers:
                headers[header] = "*****"
        logging.info(f"Request headers: {headers}")

        response = await call_next(request)
        return response

# Add the custom middleware to the app
app.add_middleware(LogHeadersMiddleware)

# Middleware to log essential request information
@app.middleware("http")
async def log_requests(request: Request, call_next):
    logger.info(f"Request: {request.method} {request.url}")
    response = await call_next(request)
    logger.info(f"Response status: {response.status_code}")
    return response

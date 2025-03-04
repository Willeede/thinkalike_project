from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from api.agent import router as agent_router
from api.feedback import router as feedback_router
from api.api_v1_graph import router as graph_router
from api.api_v1_connection_status import router as connection_status_router
from api.index import router as index_router

app = FastAPI()

# CORS configuration (Update these origins when you deploy your frontend!)
origins = [
    "http://localhost:3000",  # For local React development (port 3000)
    "http://localhost:5173",  # For local React development (port 5173 - Vite default)
    "https://thinkalike-api.onrender.com",   # Your Render BACKEND URL - KEEP THIS
    "https://your-frontend-url.onrender.com",  # REPLACE THIS WITH YOUR FRONTEND URL
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include the routers from your API files.
app.include_router(index_router)  # No prefix for root
app.include_router(agent_router, prefix="/agent")
app.include_router(feedback_router, prefix="/feedback")
app.include_router(graph_router, prefix="/api/v1/graph")
app.include_router(connection_status_router, prefix="/api/v1/connection")
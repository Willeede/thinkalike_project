from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

# Corrected imports - relative imports within the 'app' package
from .api.agent import router as agent_router
from .api.feedback import router as feedback_router
from .api.api_v1_graph import router as graph_router
from .api.api_v1_connection_status import router as connection_status_router
from .api.index import router as index_router

app = FastAPI(title="ThinkAlike")

# CORS configuration with specific origins
origins = [
    "http://localhost:3000",
    "http://localhost:3001",
    "http://localhost:3002",
    "https://thinkalike-frontend.onrender.com",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include your routers, using the correct relative imports
app.include_router(agent_router, prefix="/agent")
app.include_router(feedback_router, prefix="/feedback")
app.include_router(graph_router, prefix="/api/v1/graph")
app.include_router(connection_status_router, prefix="/api/v1/connection")
app.include_router(index_router)  # NO PREFIX

# NO ROOT ROUTE HERE - handled by index.py

@app.get("/api/v1/graph/graph")
def get_graph():
    return {
        "nodes": [
            {"id": 1, "label": "Node 1", "group": 1, "isAI": False},
            {"id": 2, "label": "Node 2", "group": 2, "isAI": True}
        ],
        "edges": [
            {"source": 1, "target": 2, "value": "Connection"}
        ]
    }

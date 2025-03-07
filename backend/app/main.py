from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse, JSONResponse

from .api.agent import router as agent_router
from .api.feedback import router as feedback_router
from .api.api_v1_graph import router as graph_router
from .api.api_v1_connection_status import router as connection_status_router
from .api.index import router as index_router

app = FastAPI(title="ThinkAlike")

origins = [
    "http://localhost:3000",
    "http://localhost:3001",
    "http://127.0.0.1:3000",
    "http://127.0.0.1:3001",
    "https://thinkalike-frontend.onrender.com",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/favicon.ico")
async def favicon():
    # Serve favicon from the provided absolute path
    return FileResponse("C:/Users/w_eed/Documents/thinkalike_project_fresh/backend/favicon.ico")

# Define a test endpoint for graph data that avoids conflict with the router's path.
@app.get("/api/v1/graph/test")
async def get_graph_data():
    sample_data = {
        "nodes": [
            {"id": "node1", "label": "Node 1", "group": 1, "value": "Example value", "isAI": False},
            {"id": "node2", "label": "Node 2", "group": 2, "value": "Another value", "isAI": True}
        ],
        "edges": [
            {"from": "node1", "to": "node2", "value": "Connection between 1 and 2"}
        ]
    }
    return JSONResponse(content=sample_data)

# Include your routers below. Ensure that none of these conflict with the test endpoint.
app.include_router(agent_router, prefix="/agent")
app.include_router(feedback_router, prefix="/feedback")
app.include_router(graph_router, prefix="/api/v1/graph")
app.include_router(connection_status_router, prefix="/api/v1/connection")
app.include_router(index_router)
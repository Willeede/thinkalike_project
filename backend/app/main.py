import multiprocessing
import queue
import time
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from backend.app.config import get_settings
from backend.app.routes import agent_routes, feedback_routes

message_queue = queue.Queue()
settings = get_settings()

app = FastAPI(
    title=settings.app_name
)

# CORS configuration
origins = [
    "http://localhost:3000",  # React dev server
    "https://thinkalike-project.onrender.com",  # Your frontend domain
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
    expose_headers=["*"]
)

app.include_router(agent_routes.router)
app.include_router(feedback_routes.router)

@app.get("/api/v1/graph")
async def get_graph_data():
    try:
        data = {
            "nodes": [
                {"id": "node1", "label": "User Input", "group": 1, "value": "User data input"},
                {"id": "node2", "label": "AI Agent", "group": 4, "isAI": True, "value": "AI processing node"},
                {"id": "node3", "label": "Database", "group": 3, "value": "Persistent data storage"},
                {"id": "node4", "label": "Response", "group": 2, "value": "Response to the user"}
            ],
            "edges": [
                {"from": "node1", "to": "node2", "value": "User data"},
                {"from": "node2", "to": "node3", "value": "AI processed data"},
                {"from": "node3", "to": "node4", "value": "Data for response"}
            ]
        }
        return data
    except Exception as e:
        print(f"Error in /api/v1/graph: {str(e)}")
        raise

@app.get("/test-cors")
async def test_cors():
    return {"message": "CORS test successful"}

@app.post("/api/v1/connection/status")
async def set_connection_status(status: str):
    if status not in ["disconnected", "connecting", "connected"]:
        return {"error": "Invalid status"}
    return {"status": status}

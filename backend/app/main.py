import os
import sys
import multiprocessing
import queue
import time

from fastapi import FastAPI, Request, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse

# Add the project root directory (ThinkAlike) to the sys.path
sys.path.append(os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))))

# Use absolute imports from the project root
from backend.app.config import settings
from backend.app.endpoints import agent_routes, feedback_routes

app = FastAPI(title="ThinkAlike")

# CORS (Cross-Origin Resource Sharing) configuration - ALLOW ALL origins for now
origins = ["*"]
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,  # Start with allowing all origins, restrict later
    allow_credentials=True,
    allow_methods=["*"],    # Allow all methods
    allow_headers=["*"],    # Allow all headers
)

# Include your API routers
app.include_router(agent_routes.router)
app.include_router(feedback_routes.router)

# Accessing configuration settings for debugging
print(f"Debug mode: {settings.debug}")
print(f"Database URL: {settings.database_url}")

# VERY BASIC EXAMPLE ENDPOINT (replace with your actual data)
@app.get("/api/v1/graph")
async def get_graph_data():
    data = {
      "nodes": [
        { "id": "node1", "label": "User Input", "group": 1, "value": "User data input" },
        { "id": "node2", "label": "AI Agent", "group": 4, "isAI": True, "value": "AI processing node" },
        { "id": "node3", "label": "Database", "group": 3, "value": "Persistent data storage" },
        { "id": "node4", "label": "Response", "group": 2, "value": "Response to the user" }
      ],
      "edges": [
        { "from": "node1", "to": "node2", "value": "User data" },
        { "from": "node2", "to": "node3", "value": "AI processed data" },
        { "from": "node3", "to": "node4", "value": "Data for response" }
      ]
    }
    return data

# TEMPORARY endpoint to simulate connection status changes
@app.post("/api/v1/connection/status")
async def set_connection_status(status: str):
    if status not in ["disconnected", "connecting", "connected"]:
        raise HTTPException(status_code=400, detail="Invalid status")
    return {"status": status}

# Only add this block if you plan to run the backend directly (e.g. for local development)
if __name__ == "__main__":
    import uvicorn
    uvicorn.run("backend.app.main:app", host="0.0.0.0", port=8000, reload=True)
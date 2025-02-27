import os
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware

# Directly import the router objects from each route file
from backend.app.endpoints.agent_routes import router as agent_router
from backend.app.endpoints.feedback_routes import router as feedback_router

app = FastAPI(title="ThinkAlike")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(agent_router)
app.include_router(feedback_router)

@app.get("/api/v1/graph")
async def get_graph_data():
    return {
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

@app.post("/api/v1/connection/status")
async def set_connection_status(status: str):
    if status not in ["disconnected", "connecting", "connected"]:
        raise HTTPException(status_code=400, detail="Invalid status")
    return {"status": status}

if __name__ == "__main__":
    import uvicorn
    port = int(os.environ.get("PORT", 8000))
    uvicorn.run("backend.app.main:app", host="0.0.0.0", port=port, reload=True)
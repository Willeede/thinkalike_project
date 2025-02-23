import multiprocessing
import queue
import time
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse # Import JSONResponse

# Import your routes (assuming you have them in a 'routes' module)
from .routes import agent_routes, feedback_routes

# Import the settings from the config module
from .config.config import settings # Corrected import


app = FastAPI(
    title="ThinkAlike"
)

# CORS (Cross-Origin Resource Sharing) configuration
# THIS IS CRUCIAL
origins = [
    "http://localhost:3000",   # Allow local development frontend
    "https://thinkalike-project.onrender.com",  # Your *deployed* frontend URL
    # Add any other origins you need to allow (e.g., a staging environment)
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,  #  List of allowed origins
    allow_credentials=True,  #  Allow cookies (if you use them)
    allow_methods=["*"],    #  Allow all HTTP methods (GET, POST, PUT, DELETE, etc.)
    allow_headers=["*"],    #  Allow all headers
)


# Include your API routers
app.include_router(agent_routes.router)
app.include_router(feedback_routes.router)

# Accessing configuration settings
print(f"Debug mode: {settings.debug}")
print(f"Database URL: {settings.database_url}")
# You can now use settings.secret_key, settings.database_url, etc.


# VERY BASIC EXAMPLE ENDPOINT (replace with your actual data)
@app.get("/api/v1/graph")
async def get_graph_data():
    # For now, return some static data.  Later, you'll fetch this from a database.
    data = {
      "nodes": [
        { "id": 'node1', "label": 'User Input', "group": 1 , "value": "User data input"},
        { "id": 'node2', "label": 'AI Agent', "group": 4, "isAI": True, "value": "AI processing node" },
        { "id": 'node3', "label": 'Database', "group": 3, "value": "Persistent data storage" },
        { "id": 'node4', "label": 'Response', "group": 2, "value": "Response to the user" }
      ],
      "edges": [
        { "from": 'node1', "to": 'node2', "value": "User data" },
        { "from": 'node2', "to": 'node3', "value": "AI processed data" },
        { "from": 'node3', "to": 'node4', "value": "Data for response" },
      ]
    }
    return data


# TEMPORARY endpoint to simulate connection status changes
@app.post("/api/v1/connection/status")
async def set_connection_status(status: str):  # You'll likely want a Pydantic model here
    # In a real application, this would update the database
    # For now, we just return the status for testing purposes.
    if status not in ["disconnected", "connecting", "connected"]:
        return {"error": "Invalid status"}  # Basic validation
    return {"status": status}

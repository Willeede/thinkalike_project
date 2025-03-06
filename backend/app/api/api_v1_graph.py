#backend\app\api\api_v1_graph.py
from fastapi import APIRouter, HTTPException
import logging

router = APIRouter()
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

@router.get("/graph")  # This is the correct endpoint: /api/v1/graph/graph
async def get_graph():
    logger.info("Entering get_graph function")  # Log entry point
    try:
        # --- Your API logic (replace with your actual data fetching) ---
        logger.info("Before creating example data") # Add logging *before* any data fetching/processing
        message =  {
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
        logger.info(f"Returning graph data: {message}")  # Log the data *before* returning
        return message

    except Exception as e:
        logger.error(f"Error in get_graph: {e}") # Log any errors
        raise HTTPException(status_code=500, detail=str(e))
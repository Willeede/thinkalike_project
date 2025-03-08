from fastapi import APIRouter, HTTPException
import logging
import os
import psycopg2  # Ensure you have psycopg2-binary installed via pip
from dotenv import load_dotenv

# Attempt to load .env from the backend root
load_dotenv()

router = APIRouter()
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Sample fallback data if DATABASE_URL is missing or fails
SAMPLE_DATA = {
    "nodes": [
        {"id": "node1", "label": "Node 1", "group": 1, "value": "Example value", "isAI": False},
        {"id": "node2", "label": "Node 2", "group": 2, "value": "Another value", "isAI": True}
    ],
    "edges": [
        {"from": "node1", "to": "node2", "value": "Connection between 1 and 2"}
    ]
}

@router.get("/graph")
async def get_graph():
    logger.info("Entering get_graph function")
    try:
        # --- Database Connection ---
        logger.info("Retrieving DATABASE_URL from environment")
        db_url = os.environ.get("DATABASE_URL")
        logger.info(f"DEBUG: DATABASE_URL is: {db_url}")
        if not db_url:
            logger.warning("DATABASE_URL not configured, returning sample data")
            return SAMPLE_DATA

        logger.info("Connecting to the database")
        conn = psycopg2.connect(db_url)
        cur = conn.cursor()
        logger.info("Database connection established")

        # --- Node Query (update with your actual query if needed) ---
        cur.execute("SELECT id, label, \"group\", value, \"isAI\" FROM nodes;")
        nodes = []
        for row in cur.fetchall():
            node_id, label, group, value, is_ai = row
            node = {
                "id": str(node_id),
                "label": label,
                "group": group,
                "value": value,
                "isAI": bool(is_ai) if is_ai is not None else False,
            }
            nodes.append(node)
        logger.info(f"Fetched {len(nodes)} nodes")

        # --- Edge Query (update with your actual query if needed) ---
        cur.execute("SELECT source, target, value FROM edges;")
        edges = []
        for row in cur.fetchall():
            source, target, value = row
            edge = {
                "from": str(source),
                "to": str(target),
                "value": value,
            }
            edges.append(edge)
        logger.info(f"Fetched {len(edges)} edges")

        # --- Close Connection ---
        cur.close()
        conn.close()
        logger.info("Database connection closed")

        data = {"nodes": nodes, "edges": edges}
        logger.info(f"Returning graph data (first 3 nodes): {data['nodes'][:3]}...")
        return data

    except psycopg2.Error as db_err:
        logger.error(f"Database error: {db_err}")
        # If a database error occurs, return sample data instead of breaking the UI
        return SAMPLE_DATA
    except Exception as e:
        logger.error(f"Error in get_graph: {e}")
        raise HTTPException(status_code=500, detail=str(e))



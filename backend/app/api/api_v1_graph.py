from fastapi import APIRouter, HTTPException
import logging
import os
import psycopg2
from dotenv import load_dotenv

load_dotenv()

router = APIRouter()
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

@router.get("/graph")
async def get_graph():
    logger.info("Fetching graph data from database")
    try:
        # Database connection
        db_url = os.environ.get("DATABASE_URL")
        if not db_url:
            logger.error("DATABASE_URL not set")
            raise HTTPException(status_code=500, detail="Database configuration error")

        conn = psycopg2.connect(db_url)
        cur = conn.cursor()

        # Fetch nodes
        cur.execute("SELECT id, label, \"group\", value, \"isAI\" FROM nodes;")
        nodes = []
        for row in cur.fetchall():
            node_id, label, group, value, is_ai = row
            nodes.append({
                "id": str(node_id),
                "label": label,
                "group": group,
                "value": value,
                "isAI": bool(is_ai) if is_ai is not None else False,
            })

        # Fetch edges
        cur.execute("SELECT source, target, value FROM edges;")
        edges = []
        for row in cur.fetchall():
            source, target, value = row
            edges.append({
                "source": str(source),
                "target": str(target),
                "value": value,
            })

        # Close connection
        cur.close()
        conn.close()

        return {"nodes": nodes, "edges": edges}

    except psycopg2.Error as db_err:
        logger.error(f"Database error: {db_err}")
        raise HTTPException(status_code=500, detail=f"Database error: {str(db_err)}")
    except Exception as e:
        logger.error(f"Error in get_graph: {e}")
        raise HTTPException(status_code=500, detail=str(e))

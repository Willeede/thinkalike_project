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
    logger.info("Entering get_graph function")
    try:
        db_url = os.environ.get("DATABASE_URL")
        if not db_url:
            raise HTTPException(status_code=500, detail="DATABASE_URL not configured")

        conn = psycopg2.connect(db_url)
        cur = conn.cursor()

        cur.execute("SELECT id, label, \"group\", value, \"isAI\" FROM nodes;")
        nodes = []
        for row in cur.fetchall():
            node_id, label, group, value, is_ai = row
            nodes.append({
                "id": str(node_id),
                "label": label,
                "group": group,
                "value": value,
                "isAI": bool(is_ai),
            })

        cur.execute("SELECT source, target, value FROM edges;")
        edges = []
        for row in cur.fetchall():
            source, target, value = row
            edges.append({
                "from": str(source),
                "to": str(target),
                "value": value,
            })

        cur.close()
        conn.close()
        return {"nodes": nodes, "edges": edges}

    except psycopg2.Error as db_err:
        logger.error(f"Database error: {db_err}")
        raise HTTPException(status_code=500, detail=f"Database error: {db_err}")
    except Exception as e:
        logger.error(f"Error in get_graph: {e}")
        raise HTTPException(status_code=500, detail=str(e))



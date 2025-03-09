from fastapi import APIRouter, HTTPException
import logging
import os
import psycopg2
from dotenv import load_dotenv

load_dotenv()
router = APIRouter()
logger = logging.getLogger(__name__)

def validate_db_url():
    db_url = os.environ.get("DATABASE_URL")
    if not db_url:
        logger.error("DATABASE_URL environment variable not set")
        raise HTTPException(status_code=500, detail="DATABASE_URL not set")

    if "sslmode" not in db_url:
        db_url += "?sslmode=require"
        logger.info("Added SSL mode to database URL")

    return db_url

@router.get("/graph")
async def get_graph():
    """Fetch graph data from database"""
    logger.info("Starting graph endpoint")
    conn = None
    cur = None
    try:
        db_url = os.environ.get("DATABASE_URL")
        if not db_url:
            raise HTTPException(status_code=500, detail="DATABASE_URL not configured")

        conn = psycopg2.connect(db_url)
        cur = conn.cursor()

        # Fetch nodes
        cur.execute("""
            SELECT id, label, "group", value, "isAI"
            FROM nodes
            ORDER BY id;
        """)

        nodes = []
        node_ids = set()
        for row in cur.fetchall():
            node_id = str(row[0])
            node_ids.add(node_id)
            nodes.append({
                "id": node_id,
                "label": str(row[1]),
                "group": int(row[2]) if row[2] is not None else 1,
                "value": str(row[3]) if row[3] is not None else "",
                "isAI": bool(row[4]) if row[4] is not None else False
            })

        # Fetch edges with validation
        cur.execute("""
            SELECT source, target, value
            FROM edges
            ORDER BY source;
        """)

        edges = []
        for row in cur.fetchall():
            source = str(row[0])
            target = str(row[1])
            if source in node_ids and target in node_ids:
                edges.append({
                    "source": source,
                    "target": target,
                    "value": str(row[2]) if row[2] is not None else ""
                })

        return {"nodes": nodes, "edges": edges}

    except Exception as e:
        logger.error(f"Error: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))
    finally:
        if cur:
            cur.close()
        if conn:
            conn.close()

@router.get("/test-connection")
async def test_connection():
    logger.info("Testing database connection")
    conn = None
    cur = None
    try:
        db_url = validate_db_url()
        logger.info("Attempting connection...")
        conn = psycopg2.connect(db_url)
        cur = conn.cursor()
        cur.execute("SELECT 1")
        result = cur.fetchone()
        return {"status": "success", "message": "Database connection successful"}
    except Exception as e:
        logger.error(f"Connection test failed: {str(e)}")
        return {"status": "error", "message": str(e)}
    finally:
        if cur:
            cur.close()
        if conn:
            conn.close()

# filepath: c:\Users\w_eed\Documents\thinkalike_project_fresh\backend\app\api\api_v1_connection_status.py
from fastapi import APIRouter, HTTPException
import logging

router = APIRouter()
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

@router.get("/status")
async def get_connection_status():
    logger.info("Entering get_connection_status function")
    try:
        message = "connected"
        logger.info(f"Message: {message}")
        return {"status": message}
    except Exception as e:
        logger.error(f"Error in get_connection_status: {e}")
        raise HTTPException(status_code=500, detail=str(e))
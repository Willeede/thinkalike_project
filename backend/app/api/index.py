# filepath: c:\Users\w_eed\Documents\thinkalike_project_fresh\backend\app\api\index.py
from fastapi import APIRouter, HTTPException
import logging

router = APIRouter()
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

@router.get("/")
async def get_root():
    logger.info("Entering get_root function")
    try:
        message = "ThinkAlike API Root."
        logger.info(f"Message: {message}")
        return {"message": message}
    except Exception as e:
        logger.error(f"Error in get_root: {e}")
        raise HTTPException(status_code=500, detail=str(e))

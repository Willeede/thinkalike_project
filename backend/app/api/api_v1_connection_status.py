from fastapi import APIRouter, HTTPException
import logging

router = APIRouter()
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

@router.get("/status")  # Correct and explicit path
async def get_connection_status():
    logger.info("Entering get_connection_status function")
    try:
        # Replace with your actual logic to determine connection status
        message = "connected"  # Example status
        logger.info(f"Returning connection status: {message}")
        return {"status": message}
    except Exception as e:
        logger.error(f"Error in get_connection_status: {e}")
        raise HTTPException(status_code=500, detail=str(e))

# REMOVED: app = FastAPI() and app.include_router(router)
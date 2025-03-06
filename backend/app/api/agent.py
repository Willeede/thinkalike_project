from fastapi import APIRouter, HTTPException
import logging

router = APIRouter()
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

@router.get("")  # Corrected: Empty path becomes /agent under the prefix
async def get_agent():
    logger.info("Entering get_agent function")
    try:
        message = "This is the agent endpoint. Replace with your agent logic."
        logger.info(f"Message {message}")
        return {"message": message}
    except Exception as e:
        logger.error(f"Error in get_agent: {e}")
        raise HTTPException(status_code=500, detail=str(e))

# REMOVED: app = FastAPI() and app.include_router(router) - these belong in main.py
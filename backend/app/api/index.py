from fastapi import APIRouter, HTTPException
import logging

router = APIRouter()
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

@router.get("") # Corrected: Empty path becomes the root path (/)
async def root():
    logger.info("Entering root function")
    try:
        message = "ThinkAlike API Root.  Go to /docs for documentation."
        logger.info(f"Message: {message}")
        return {"message": message}
    except Exception as e:
        logger.error(f"Error in root: {e}")
        raise HTTPException(status_code=500, detail=str(e))

# REMOVED: app = FastAPI() and app.include_router(router)
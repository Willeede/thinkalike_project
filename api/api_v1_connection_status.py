from fastapi import APIRouter

router = APIRouter()

@router.get("/status") # Add explicit path
async def get_status():
    return {"message": "Connection status check successful."}
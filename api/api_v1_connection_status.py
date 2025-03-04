from fastapi import APIRouter, HTTPException
from pydantic import BaseModel

router = APIRouter()

class ConnectionStatus(BaseModel):
    message: str

@router.get("/status")  # Changed this line
async def get_connection_status():
    try:
        message = "This is the connection status endpoint under /api/v1/connection."
        return {"message": message}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
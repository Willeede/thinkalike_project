from fastapi import APIRouter, HTTPException
from pydantic import BaseModel

router = APIRouter()

class Index(BaseModel):
    message: str

@router.get("/")  # Changed from @router.get("")
async def root():
    try:
        message = "ThinkAlike API is running"
        return {"message": message}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
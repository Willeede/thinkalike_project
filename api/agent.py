from fastapi import APIRouter, HTTPException
from pydantic import BaseModel

router = APIRouter()

class Agent(BaseModel):
    message: str

@router.get("/agent")  # This line is crucial!
async def get_agent():
    try:
        message = "This is the agent endpoint."
        return {"message": message}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
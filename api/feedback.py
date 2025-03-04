from fastapi import APIRouter, HTTPException
from pydantic import BaseModel

router = APIRouter()

class Feedback(BaseModel):
    message: str

@router.get("/feedback")  # This line is crucial!
async def get_feedback():
    try:
        message = "This is the feedback endpoint."
        return {"message": message}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
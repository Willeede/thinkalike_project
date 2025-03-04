from fastapi import APIRouter, HTTPException
from pydantic import BaseModel

router = APIRouter()

class Graph(BaseModel):
    message: str

@router.get("/graph")  # Changed this line
async def get_graph():
    try:
        message = "This is the graph endpoint under /api/v1/graph."
        return {"message": message}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
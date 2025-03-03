from fastapi import APIRouter

router = APIRouter()

@router.get("/graph")  # Add explicit path.  IMPORTANT!
async def get_graph():
    return {"message": "Graph endpoint. Replace with graph data."}
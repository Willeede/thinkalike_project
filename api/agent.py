from fastapi import APIRouter

router = APIRouter()

@router.get("/agent") # Add the explicit path
async def get_agent():
    return {"message": "This is the agent endpoint. Replace with your agent logic."}
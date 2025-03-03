from fastapi import APIRouter

router = APIRouter()

@router.get("/feedback")  # Add explicit path
async def get_feedback():
    return {"message": "This is the feedback endpoint. Replace with your feedback logic."}
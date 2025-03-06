from fastapi import APIRouter

router = APIRouter()

@router.get("/feedback")
async def get_feedback():
    return {"message": "Feedback endpoint"}
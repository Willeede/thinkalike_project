from fastapi import APIRouter

router = APIRouter()

@router.get("/")  # Use "/" here, not ""
async def root():
    return {"message": "ThinkAlike API Root.  Go to /docs for documentation."}
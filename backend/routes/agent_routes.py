from fastapi import APIRouter

from typing import List

from backend.app.services import agent_service  # Import your agent_service
from backend.app.models import Agent, Task, Document  # Import your Pydantic models

router = APIRouter()


@router.get("/agents", response_model=List[Agent], tags=["agents"])
async def list_agents():
    """
    Lists all available agents.
    """
    return agent_service.list_agents()


@router.get("/agents/{agent_id}/tasks", response_model=List[Task], tags=["agents"])
async def get_agent_tasks(agent_id: str):
    """
    Retrieves tasks associated with a specific agent.
    """
    return agent_service.get_agent_tasks(agent_id)


@router.get("/agents/{agent_id}/tasks/{task_id}/documents", response_model=List[Document], tags=["agents"])
async def get_agent_task_documents(agent_id: str, task_id: str):
    """
    Retrieves documents associated with a specific task for an agent.
    """
    return agent_service.get_agent_task_documents(agent_id, task_id)


@router.get("/agents/{agent_id}/tasks/{task_id}/documents/{document_id}", response_model=Document, tags=["agents"])
async def get_document(agent_id: str, task_id: str, document_id: str):
    """
    Retrieves a specific document associated with a task for an agent.
    """
    return agent_service.get_document(agent_id, task_id, document_id)


# Placeholder Pydantic Models (if you haven't defined them in backend/app/models/ yet)
# You should ideally define these in backend/app/models/ and import them.
class Agent(BaseModel): # noqa: F821
    agent_id: str
    name: str

class Task(BaseModel): # noqa: F821
    task_id: str
    description: str

class Document(BaseModel): # noqa: F821
    document_id: str
    filename: str
    content: str

from pydantic import BaseModel # Import BaseModel here, after the placeholder classes (to avoid forward reference issues if you uncomment the placeholders)

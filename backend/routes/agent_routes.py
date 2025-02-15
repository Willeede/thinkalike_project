@app.get("/agents", response_model=List[Agent])
async def list_agents():
    """
    Lists all available agents.
    """
    return agent_service.list_agents()


@app.get("/agents/{agent_id}/tasks", response_model=List[Task])
async def get_agent_tasks(agent_id: str):
    """
    Retrieves tasks associated with a specific agent.
    """
    return agent_service.get_agent_tasks(agent_id)


@app.get("/agents/{agent_id}/tasks/{task_id}/documents", response_model=List[Document])
async def get_agent_task_documents(agent_id: str, task_id: str):
    """
    Retrieves documents associated with a specific task for an agent.
    """
    return agent_service.get_agent_task_documents(agent_id, task_id)


@app.get("/agents/{agent_id}/tasks/{task_id}/documents/{document_id}", response_model=Document)
async def get_document(agent_id: str, task_id: str, document_id: str):
    """
    Retrieves a specific document associated with a task for an agent.
    """
    return agent_service.get_document(agent_id, task_id, document_id)

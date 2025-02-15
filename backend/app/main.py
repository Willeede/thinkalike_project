import multiprocessing
import queue
import time
from fastapi import FastAPI

from backend.agents.code_developer_agent import CodeDeveloperAgent
from backend.agents.task_allocator_agent import TaskAllocatorAgent
from backend.agents.ethical_assurance_agent import EthicalAssuranceAgent
from backend.app.config import get_settings  # Import get_settings
from backend.app.routes import agent_routes  # Import agent_routes

message_queue = queue.Queue()  # Central Message Queue
settings = get_settings() # Load settings

app = FastAPI(
    title=settings.app_name # Use app_name from settings for title
)

app.include_router(agent_routes.router) # Include agent routes from agent_routes.py


@app.get("/")
async def read_root():
    return {"message": "ThinkAlike API is running", "app_name": settings.app_name} # Use app_name from settings


if __name__ == "__main__":
    # Initialize and start agents
    code_developer = CodeDeveloperAgent(agent_id="code_developer_agent", message_queue=message_queue)
    task_allocator = TaskAllocatorAgent(agent_id="task_allocator_agent", message_queue=message_queue)
    ethical_validator = EthicalAssuranceAgent(agent_id="ethical_validator_agent", message_queue=message_queue)

    agents = [code_developer, task_allocator, ethical_validator]

    for agent in agents:
        agent.start()

    print("All agents started. Main process running...")

    try:
        while True:
            time.sleep(1)  # Main process can do other tasks or just monitor agents
    except KeyboardInterrupt:
        print("Stopping agents...")
        for agent in agents:
            agent.stop()
    for agent in agents:
        agent.join()  # Wait for agents to finish
    print("Agents stopped. Exiting.")

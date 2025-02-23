import multiprocessing
import queue
import time
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from backend.agents.code_developer_agent import CodeDeveloperAgent
from backend.agents.task_allocator_agent import TaskAllocatorAgent
from backend.agents.ethical_assurance_agent import EthicalAssuranceAgent
from backend.app.config import get_settings
from backend.app.routes import agent_routes, feedback_routes

message_queue = queue.Queue()
settings = get_settings()

app = FastAPI(
    title=settings.app_name
)

# CORS configuration
origins = [
    "http://localhost:3000",  # React dev server
    "https://thinkalike-project.onrender.com",  # Your frontend domain
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(agent_routes.router)
app.include_router(feedback_routes.router)

@app.get("/")
async def read_root():
    return {"message": "ThinkAlike API is running", "app_name": settings.app_name}

if __name__ == "__main__":
    code_developer = CodeDeveloperAgent(agent_id="code_developer_agent", message_queue=message_queue)
    task_allocator = TaskAllocatorAgent(agent_id="task_allocator_agent", message_queue=message_queue)
    ethical_validator = EthicalAssuranceAgent(agent_id="ethical_validator_agent", message_queue=message_queue)

    agents = [code_developer, task_allocator, ethical_validator]

    for agent in agents:
        agent.start()

    print("All agents started. Main process running...")

    try:
        while True:
            time.sleep(1)
    except KeyboardInterrupt:
        print("Stopping agents...")
        for agent in agents:
            agent.stop()
    for agent in agents:
        agent.join()
    print("Agents stopped. Exiting.")

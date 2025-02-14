import multiprocessing
import queue
import time
from backend.agents.code_developer_agent import CodeDeveloperAgent
from backend.agents.task_allocator_agent import TaskAllocatorAgent
from backend.agents.ethical_assurance_agent import EthicalAssuranceAgent  # Corrected class name

message_queue = queue.Queue()  # Central Message Queue

if __name__ == "__main__":
    # Initialize and start agents
    code_developer = CodeDeveloperAgent(agent_id="code_developer_agent", message_queue=message_queue)
    task_allocator = TaskAllocatorAgent(agent_id="task_allocator_agent", message_queue=message_queue)
    ethical_validator = EthicalAssuranceAgent(agent_id="ethical_validator_agent", message_queue=message_queue) # Corrected variable name

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

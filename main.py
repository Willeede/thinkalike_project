from fastapi import FastAPI
from api.agent import router as agent_router
from api.feedback import router as feedback_router
from api.api_v1_graph import router as graph_router
from api.api_v1_connection_status import router as connection_status_router
from api.index import router as index_router

app = FastAPI()

app.include_router(agent_router, prefix="/agent")  # Added prefix
app.include_router(feedback_router, prefix="/feedback")  # Added prefix
app.include_router(graph_router, prefix="/api/v1/graph")
app.include_router(connection_status_router, prefix="/api/v1/connection")
app.include_router(index_router)
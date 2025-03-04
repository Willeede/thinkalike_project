from fastapi import FastAPI
   from fastapi.middleware.cors import CORSMiddleware
   from api.agent import router as agent_router
   from api.feedback import router as feedback_router
   from api.api_v1_graph import router as graph_router
   from api.api_v1_connection_status import router as connection_status_router
   from api.index import router as index_router

   app = FastAPI()

   # CORS configuration (Update these origins when you deploy your frontend!)
   origins = [
       "http://localhost:3000",  # For local React development (if using port 3000)
       "http://localhost:5173",  # For local React development (if using port 5173 - Vite default)
       # Add your Render frontend URL here after deploying the frontend!
   ]

   app.add_middleware(
       CORSMiddleware,
       allow_origins=origins,
       allow_credentials=True,
       allow_methods=["*"],
       allow_headers=["*"],
   )

   # Include the routers from your API files, WITH PREFIXES.
   app.include_router(index_router)  # NO prefix for root
   app.include_router(agent_router, prefix="/agent")
   app.include_router(feedback_router, prefix="/feedback")
   app.include_router(graph_router, prefix="/api/v1/graph")
   app.include_router(connection_status_router, prefix="/api/v1/connection")
   ```
*   **`vercel.json` (Project Root):**

```json
{
 "version": 2,
 "builds": [
   {
     "src": "api/**/*.py",
     "use": "@vercel/python"
   },
   {
     "src": "frontend/package.json",
     "use": "@vercel/static-build",
     "config": { "distDir": "build" }
   }
 ],
 "routes": [
   {
     "src": "/api/(.*)",
     "dest": "api/$1"
   },
   {
     "src": "/agent",
     "dest": "/api/agent.py"
   },
   {
     "src": "/feedback",
     "dest": "/api/feedback.py"
   },
   {
     "src": "/api/v1/connection/status",
     "dest": "/api/api_v1_connection_status.py"
   },
   {
     "src": "/api/v1/graph",
     "dest": "/api/api_v1_graph.py"
   },
   {
       "src": "/docs",
       "dest": "/api/index.py"
   },
   { "handle": "filesystem" },
   { "src": "/.*", "dest": "/index.html" }
 ]
}
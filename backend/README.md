# ThinkAlike Backend (FastAPI)

This directory contains the backend API for the ThinkAlike data traceability application. It's built with Python and the FastAPI framework to provide graph data visualization support.

## Technologies Used

*   **Python 3.9+**
*   **FastAPI:** Modern web framework for building APIs
*   **Uvicorn:** ASGI server for running FastAPI in production
*   **PostgreSQL:** Database (hosted on Render)
*   **psycopg2-binary:** PostgreSQL database adapter
*   **python-dotenv:** For loading environment variables (local development)
*   **SQLAlchemy:** ORM for database operations

## Project Structure

```
backend/
├── app/                 <-- Main application code
│   ├── api/             <-- API route definitions
│   │   ├── __init__.py
│   │   ├── agent.py     <-- Agent endpoint
│   │   ├── api_v1_connection_status.py
│   │   ├── api_v1_graph.py   <-- Graph data endpoint
│   │   ├── feedback.py
│   │   └── index.py     <-- Root endpoint
│   ├── __init__.py
│   └── main.py          <-- FastAPI app + CORS config
├── requirements.txt     <-- Dependencies
└── .env                 <-- Environment variables (not in repo)
```

## Local Development Setup

1.  **Clone the repository:**

    ```bash
    git clone https://github.com/Willeede/thinkalike_project.git
    cd thinkalike_project_fresh/backend
    ```

2.  **Create and activate a virtual environment:**

    ```bash
    python -m venv venv

    # Windows (PowerShell)
    .\venv\Scripts\Activate.ps1

    # Windows (Command Prompt)
    .\venv\Scripts\activate.bat

    # Mac/Linux
    source venv/bin/activate
    ```

3.  **Install dependencies:**

    ```bash
    pip install -r requirements.txt
    ```

4.  **Create `.env` file:**

    Create a file named `.env` in the `backend` directory with:

    ```
    DATABASE_URL=postgresql://your_user:your_password@your_host:5432/your_database
    ```

    Replace with your actual PostgreSQL connection string.

5.  **Run the backend server:**

    ```bash
    uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
    ```

6.  **Test the API:**
    - Open `http://localhost:8000/api/v1/graph/graph` in your browser
    - You should see JSON data with nodes and edges
    - API documentation is available at `http://localhost:8000/docs`

## API Endpoints

*   **`/api/v1/graph/graph`:** (GET) Returns graph data (nodes and edges) in JSON format
*   **`/`:** (GET) Returns a welcome message
*   **`/agent`:** Agent-related endpoints
*   **`/feedback`:** Feedback collection endpoints
*   **`/api/v1/connection/status`:** Connection status endpoint

## Database Schema

The PostgreSQL database contains two main tables:

1. **nodes:**
   - `id` (text): Node identifier
   - `label` (text): Node display name
   - `group` (integer): Group classification (determines color)
   - `value` (text): Node description/value
   - `isAI` (boolean): Whether the node represents an AI component

2. **edges:**
   - `source` (text): Source node ID
   - `target` (text): Target node ID
   - `value` (text): Edge description/value

## Deployment (Render)

*   **Root Directory:** `backend`
*   **Build Command:** `pip install -r requirements.txt`
*   **Start Command:** `uvicorn app.main:app --host 0.0.0.0 --port $PORT`
*   **Environment Variables:**
    *   `DATABASE_URL`: PostgreSQL connection string
    *   `PYTHON_VERSION`: 3.9.12 (or your preferred version)

## Environment Variables

Create a `.env.example` file in the backend directory to document required variables:

```
# Database connection
DATABASE_URL=

# Optional variables
PYTHON_VERSION=3.9.12
```


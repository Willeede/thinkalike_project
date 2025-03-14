# ThinkAlike Backend (FastAPI)

## Description

This is the backend API for the ThinkAlike data traceability application.  It's built with Python and the FastAPI framework. The API provides a single endpoint (`/api/v1/graph/graph`) that returns graph data (nodes and edges) representing the flow of data, which is fetched from a PostgreSQL database hosted on Render.

## Technology Stack

*   **Python:** 3.10.13 (Make sure this matches your Render configuration)
*   **FastAPI:** Web framework for building APIs.
*   **Uvicorn:** ASGI server for running FastAPI in production.
*   **psycopg2-binary:** PostgreSQL database adapter.
*   **python-dotenv:** For loading environment variables (local development).
*   **PostgreSQL:** Database (hosted on Render).
*   **Render:** Cloud platform for deployment.

## Project Structure

backend/
├── app/             <-- Main application code
│   ├── api/         <-- API route definitions
│   │   ├── init.py
│   │   ├── agent.py          <--  API route (example)
│   │   ├── api_v1_connection_status.py   <--  API route (example)
│   │   ├── api_v1_graph.py   <--  API route for graph data
│   │   ├── feedback.py       <--  API route (example)
│   │   └── index.py          <--  API route (example)
│   ├── config/
│   │   └── config.py
│   ├── models/
│   ├── services/
│   ├── init.py
│   ├── backend_utils/
│   │   ├── init.py
│   │   ├── agent_utils.py
│   └── main.py      <-- FastAPI app + CORS
├── requirements.txt  <-- FastAPI dependencies
└── venv/             <-- Virtual environment (should be ignored by Git)


## Local Development Setup

1.  **Clone the Repository:**

    ```bash
    git clone [https://github.com/Willeede/thinkalike_project.git](https://github.com/Willeede/thinkalike_project.git)
    cd thinkalike_project_fresh/backend
    ```
    *(Replace with your actual repository URL if it changes.)*

2.  **Create and Activate a Virtual Environment:**

    ```bash
    python -m venv venv
    .\venv\Scripts\Activate.ps1  # Windows (PowerShell)
    ```

3.  **Install Dependencies:**

    ```bash
    pip install -r requirements.txt
    ```

4.  **Set Environment Variables:**

    You need to set the `DATABASE_URL` environment variable to connect to your PostgreSQL database. You can use your *Render* PostgreSQL database for local development.  Get the *external* connection string from your Render dashboard (for the PostgreSQL database service, *not* the web service).

    Create a file named `.env` in the `backend` directory and add the following, replacing the placeholders with your actual values:

    ```
    DATABASE_URL=postgresql://your_user:your_password@your_host:5432/your_database
    SECRET_KEY=your_secret_key
    ```

    **Important:**  Do *not* commit the `.env` file to Git.  It should be in your `.gitignore`.

5. **Create a `.env.example` file:**
   Create a file named `.env.example`, inside the `backend` folder, to serve as example of environment variables:
    ```
    DEBUG=
    SECRET_KEY=
    DATABASE_URL=
    AI_API_KEY=
    ```

6.  **Run the Backend Server:**

    ```bash
    uvicorn app.main:app --host 0.0.0.0 --port 8000
    ```

7.  **Test:** Open `http://localhost:8000/api/v1/graph/graph` in your browser to verify the API is working. You should see JSON data. You can also view the automatically generated API documentation at `http://localhost:8000/docs`.

## API Endpoints

*   **`GET /api/v1/graph/graph`:** Retrieves the graph data (nodes and edges) in JSON format. This is the primary endpoint used by the frontend. The response has the following structure:

    ```json
    {
      "nodes": [
        { "id": "string", "label": "string", "group": number, "value": "string", "isAI": boolean },
        ...
      ],
      "edges": [
        { "source": "string", "target": "string", "value": "string" },
        ...
      ]
    }
    ```

*   **`GET /`:** Returns a basic message. This is defined in `index.py`.
* There are other routers in place for future developments, but for the graph, only the previous endpoint is used.

## Deployment (Render)

The backend is deployed to Render as a web service. Key settings:

*   **Root Directory:** `backend/app`
*   **Build Command:** `pip install -r ../requirements.txt`
*   **Start Command:** `uvicorn main:app --host 0.0.0.0 --port $PORT`
*   **Environment Variables:**
    *   `DATABASE_URL`: Set to your Render PostgreSQL connection string.
    *   `PYTHON_VERSION`: Set to your Python version (e.g., `3.10.13`).
    *   `SECRET_KEY`: Set to a strong, random value.

See the Render dashboard for detailed configuration. The deployed backend API is accessible at `https://thinkalike-api.onrender.com`.

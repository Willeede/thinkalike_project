# ThinkAlike Frontend (React)

## Description

This directory contains the frontend for the ThinkAlike data traceability application. It's built with React and uses the `react-force-graph-2d` library to visualize the flow of data as an interactive graph. The frontend fetches graph data (nodes and edges) from a separate FastAPI backend, which is also deployed on Render.

## Technology Stack

*   **React:** JavaScript library for building user interfaces.
*   **react-force-graph-2d:** React component for rendering 2D force-directed graphs on a canvas.
*   **react-router-dom:** For basic routing (currently, only the root path `/` is used).
*   **npm:** Package manager for JavaScript.

## Local Development Setup

1.  **Navigate to the `frontend` directory:**

    ```bash
    cd thinkalike_project_fresh/frontend
    ```

2.  **Install Dependencies:**

    ```bash
    npm install
    ```

3.  **Run the Development Server:**

    ```bash
    npm start
    ```

    This will start the React development server. The application will typically open automatically in your browser at `http://localhost:3001` (or another available port if 3000 and 3001 are already in use). The console where you run `npm start` *will show the URL*.

## Connecting to the Backend

*   **Local Development:** By default, the frontend is configured to connect to a backend server running *locally* at `http://localhost:8000`.  This is handled in `src/App.js` with the following line:

    ```javascript
    const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000';
    ```

    This code checks for an environment variable named `REACT_APP_API_URL`.  If that variable is *not* set (which is the case during local development), it uses the fallback URL `http://localhost:8000`.  *You must have your FastAPI backend running locally on port 8000 for the frontend to work in development.*

*   **Production (Render):** When the frontend is deployed to Render, the `REACT_APP_API_URL` environment variable *must* be set in the Render dashboard's environment settings.  It should be set to the URL of your *deployed* backend API on Render (e.g., `https://thinkalike-api.onrender.com`).  This ensures that the deployed frontend connects to the deployed backend.

## Build

To create a production build of the frontend:

```bash
npm run build
This will create a build directory containing the optimized, static assets ready for deployment.

Deployment (Render)
The frontend is deployed to Render as a static site. Key settings:

Build Command: npm install && npm run build
Publish Directory: build (This is relative to the frontend directory, so the full path within your repository is frontend/build).
Environment Variable: REACT_APP_API_URL=https://thinkalike-api.onrender.com (This must be set to the URL of your deployed backend API on Render – e.g., https://thinkalike-api.onrender.com).
The deployed frontend is accessible at https://thinkalike-frontend.onrender.com/.

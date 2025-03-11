# ThinkAlike Frontend (React)

This directory contains the frontend for the ThinkAlike data traceability application. It's built with React and uses `react-force-graph-2d` for graph visualization.

## Technologies Used

*   **React:** JavaScript library for building user interfaces.
*   **react-force-graph-2d:** React component for rendering 2D force-directed graphs.
*   **react-router-dom:** For routing.
*   **react-tooltip:** For tooltips.
*   **npm:** Package manager.

## Local Development Setup

1.  **Navigate to the `frontend` directory:**

    ```bash
    cd thinkalike_project_fresh/frontend
    ```

2.  **Install Dependencies:**

    ```bash
    npm install
    ```

3.  **Create `.env` file**
Create a file named `.env` and specify this environment variable:
    ```
    REACT_APP_API_URL=http://localhost:8000
    ```

4.  **Run the Development Server:**

    ```bash
    npm start
    ```

    This will start the React development server. The application will open automatically in your browser, and the used port will be displayed on the terminal. The application will automatically reload when you make changes to the code.

## Connecting to the Backend

*   **Local Development:** By default, the frontend will attempt to connect to a backend running on `http://localhost:8000`. Make sure your FastAPI backend is running locally (see the backend's `README.md` for instructions).
*   **Production (Render):** When deployed to Render, the `REACT_APP_API_URL` environment variable *must* be set in the Render environment settings to the URL of your *deployed* backend API (e.g., `https://thinkalike-api.onrender.com`).

## Build

To create a production build of the frontend:

```bash
npm run build
```

This will create a build directory containing the optimized, static assets ready for deployment.

## Deployment (Render)
The frontend is deployed to Render as a static site. Key settings:

*   **Root Directory:** (Leave this blank)
*   **Build Command:** `npm install && npm run build`
*   **Publish Directory:** `build`
*   **Environment Variables:**
    *   `REACT_APP_API_URL` (set to the URL of your deployed backend API on Render – e.g., `https://thinkalike-api.onrender.com`).
    *   `NODE_VERSION` (set to the appropriate Node version – e.g., `18.17.1`).

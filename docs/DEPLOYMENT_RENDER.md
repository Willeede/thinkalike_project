# ThinkAlike Project Deployment to Render

This guide details the steps required to deploy both the FastAPI backend and the React frontend of the ThinkAlike application to Render. Follow these steps carefully and verify each step with the provided instructions.

---

## 1. Backend Deployment (thinkalike-api)

### 1.1 Verify Render Settings for thinkalike-api

1. **Go to Render Dashboard:**
   Log in to the Render dashboard and select your `thinkalike-api` service.

2. **Settings Tab:**
   Verify or update the following settings:

   - **Root Directory:**
     Set to `backend/app`
     _Explanation:_ Commands in the build and start steps will be executed in this subdirectory.

   - **Build Command:**
     Set to:
     ```
     pip install -r ../requirements.txt
     ```
     _Explanation:_ The requirements file is located one directory above (`backend/requirements.txt`).

   - **Start Command:**
     Set to:
     ```
     uvicorn main:app --host 0.0.0.0 --port $PORT
     ```
     _Explanation:_ `main:app` tells Uvicorn to look for the `app` object in `main.py`. The flags `--host 0.0.0.0` and `--port $PORT` allow the service to be accessible on the Render-assigned port.

   - **Branch:**
     Ensure you are deploying from the `main` branch.

   - **Environment Variables:**
     Ensure the following are defined:
     - `DATABASE_URL`: Your Render PostgreSQL external connection string.
     - `PYTHON_VERSION`: e.g., `3.10.13` (check your local version with `python --version` in your virtual environment).
     - `SECRET_KEY`: Your secret key value.

3. **Manual Deploy:**
   - Click on **"Manual Deploy"** in the Render dashboard.
   - Choose **"Clear build cache & deploy"** to force a clean build.
   - **Monitor Logs:**
     Watch the deployment logs for Uvicorn startup messages and any errors.
   - **Direct API Test:**
     Once deployed, visit:
     ```
     https://thinkalike-api.onrender.com/api/v1/graph/graph
     ```
     Verify that you receive JSON data as expected.

---

## 2. Frontend Deployment (thinkalike-frontend)

### 2.1 Verify Render Settings for thinkalike-frontend

1. **Go to Render Dashboard:**
   Log in to the Render dashboard and select your `thinkalike-frontend` service.

2. **Settings Tab:**
   Verify or update the following settings:

   - **Build Command:**
     Set to:
     ```
     npm install && npm run build
     ```

   - **Publish Directory:**
     Set to:
     ```
     frontend/build
     ```
     _Explanation:_ The production build output is generated in the `build` folder within the frontend directory.

   - **Branch:**
     Ensure you are deploying from the `main` branch.

   - **Environment Variables:**
     Ensure:
     ```
     REACT_APP_API_URL=https://thinkalike-api.onrender.com
     ```
     _Explanation:_ This points the frontend to your deployed backend API over HTTPS instead of localhost.

3. **Manual Deploy:**
   - Click on **"Manual Deploy"** in the Render dashboard.
   - Start the deployment and **monitor the logs** for any errors.

---

## 3. Test Deployed Application

1. **Open Frontend:**
   Visit your deployed frontend URL, for example:
   ```
   https://thinkalike-frontend.onrender.com
   ```
   The graph should load using data from your backend.

2. **Verify Functionality:**
   - **Graph Display:** Ensure that nodes and edges are rendered properly.
   - **Tooltips and Interaction:** Hover over nodes/edges to see tooltips; clicking a node should log details in the console.

3. **Collect Output:**
   After deployment, please paste outputs from:
   - **Backend Logs:** Uvicorn startup messages and any error logs.
   - **API Test:** JSON output from `https://thinkalike-api.onrender.com/api/v1/graph/graph`.
   - **Frontend Test:** Browser console logs and network details (if issues persist).

---

## 4. Command Summary (Local Git Commands)

After ensuring your changes are committed locally, run:
```powershell
cd C:\Users\w_eed\Documents\thinkalike_project_fresh
git add .
git commit -m "Prepare for Render deployment: update settings and instructions"
git push origin main
```

Then trigger the manual deployments on Render as outlined above.

---

This guide should help in deploying both services to Render and verifying that everything works as expected. Please review each step carefully and report any issues you encounter with specific outputs (logs, screenshots, etc.) for collaborative debugging.

Happy Deploying!

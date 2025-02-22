# ThinkAlike Quickstart Guide

This guide provides the fastest way to get a local development environment set up for the ThinkAlike project and run both the frontend (React) and backend (Python/FastAPI).

**Prerequisites:**

Before you begin, make sure you have the following installed on your system:

*   **Node.js and npm:**  Version 16 or higher (LTS recommended). Download: [https://nodejs.org/](https://nodejs.org/)
*   **Python:** Version 3.9 or higher. Download: [https://www.python.org/downloads/](https://www.python.org/downloads/)
*   **Git:** Download: [https://git-scm.com/downloads](https://git-scm.com/downloads)
*   **GitHub Account:** You'll need a GitHub account to fork and clone the repository: [https://github.com/](https://github.com/)
* **A code editor:** (VS Code is recommended)

**1. Clone the Repository:**

Open your terminal (or command prompt) and run the following commands:

```bash
git clone https://github.com/Willeede/thinkalike_project.git
cd thinkalike_project
```

This will download the project code to your computer and navigate you into the project's root directory.

**2. Set up the Frontend (React):**

```bash
cd frontend
npm install
```

These commands navigate into the frontend directory and install the necessary JavaScript dependencies (React, react-force-graph-2d, etc.) listed in the `frontend/package.json` file.

**3. Set up the Backend (Python/FastAPI):**

It's highly recommended to use a Python virtual environment to isolate your project's dependencies.

**3.1 Create a Virtual Environment (Choose ONE method):**

Using `venv` (Recommended - built into Python):

```bash
cd backend
python3 -m venv venv  # Create a virtual environment named 'venv'
```

Using `virtualenv` (If you have it installed):

```bash
cd backend
virtualenv venv        # Create a virtual environment named 'venv'
```

**3.2 Activate the Virtual Environment:**

macOS/Linux:

```bash
source venv/bin/activate
```

Windows (PowerShell):

```powershell
.\venv\Scripts\Activate.ps1
```

Windows (Command Prompt):

```cmd
.\venv\Scripts\activate.bat
```

After activation, your terminal prompt should change to indicate that you're inside the virtual environment (usually by showing `(venv)` at the beginning of the prompt).

**3.3 Install Backend Dependencies:**

```bash
pip install -r requirements.txt
```

This installs all necessary libraries, like FastAPI, and any other dependencies.

**4. Database Setup (SQLite - Development):**

For the MVP, we're using SQLite for development. This requires minimal setup.

No initial setup is needed. The database file (`thinkalike.db`) will be created automatically in the `backend/app` directory when you first run the backend, if your backend code is set up to do so. Make sure your backend code includes the necessary database initialization logic. If it doesn't, you'll need to add that. (I'll help with this when we get to the backend development.)

**5. Run the Project (Development Mode):**

**Frontend (React):**
Open a new terminal window (or tab).  Do not deactivate the virtual environment. Navigate to the frontend directory:

```bash
cd ../frontend  # Go back to project root, then into frontend
npm start
```

This starts the React development server. Your browser should automatically open to `http://localhost:3000`. If it doesn't, open that URL manually.

**Backend (FastAPI):**
In your first terminal window (where you activated the virtual environment), navigate to the `backend/app` directory:

```bash
cd app # Make sure you are in backend/app
uvicorn main:app --reload --port 8000
```

This starts the FastAPI development server.  You can access the automatic API documentation at `http://localhost:8000/docs`.

**6. Accessing the Application:**

With both the frontend and backend running, you should be able to access the ThinkAlike application in your browser at `http://localhost:3000`.  Initially, you'll see the DataTraceability component with static data.

**7. Making a Change and Contributing (Brief Overview):**

This section provides a brief overview. See the full `CONTRIBUTING.md` for more details.

**Create a Feature Branch:**  Always create a new branch for your work:

```bash
git checkout -b feature/#<issue-number>-short-description
```

(Replace `<issue-number>` with the relevant GitHub issue number, and `short-description` with a brief description of your changes. Use `fix/`, `feature/`, `docs/`, or `style/` as appropriate prefixes.)

**Make Changes:**  Modify the code, documentation, etc.

**Test Thoroughly:**  Run the existing tests (if any), and add new tests for your changes. Use the UI to visually validate.

**Commit:**

```bash
git add .
git commit -m "feat(ui): add a helpful description of your changes"
```

Follow the Conventional Commits specification for commit messages.

**Push:**

```bash
git push origin your-branch-name
```

**Create Pull Request:**  Create a Pull Request on GitHub from your branch to the `main` branch.

**8. Finding Your First Task:**

Check the Issues tab on our GitHub repository for a list of open tasks. Start with tasks labeled "good first issue" or "help wanted".

**9. Code Style and Testing:**

Refer to the `docs/code_style.md` and `docs/testing_guide.md` files for detailed guidelines on code style and testing.

This Quickstart Guide provides the essential steps to get the project running.  For more detailed information, refer to the full Onboarding Guide and other documentation files in the `docs` directory.

# ThinkAlike Quickstart Guide

This guide provides the fastest way to set up a local development environment for the ThinkAlike project and run both the frontend (React) and backend (Python/FastAPI).

---

## Prerequisites

Before you begin, ensure that you have the following installed on your system:

- **Node.js and npm:** Version 16 or higher (LTS recommended)  
  Download: [https://nodejs.org/](https://nodejs.org/)
- **Python:** Version 3.9 or higher  
  Download: [https://www.python.org/downloads/](https://www.python.org/downloads/)
- **Git:**  
  Download: [https://git-scm.com/downloads](https://git-scm.com/downloads)
- **GitHub Account:** You'll need one to fork and clone the repository  
  [https://github.com/](https://github.com/)
- **A code editor:** (VS Code is recommended)

---

## 1. Clone the Repository

Open your terminal or command prompt and run:

```bash
git clone https://github.com/Willeede/thinkalike_project.git
cd thinkalike_project
```

This downloads the project code to your computer and navigates you into the project’s root directory.

---

## 2. Set up the Frontend (React)

Switch to the frontend directory and install the necessary dependencies:

```bash
cd frontend
npm install
```

---

## 3. Set up the Backend (Python/FastAPI)

It is recommended to use a Python virtual environment to isolate your project’s dependencies.

### 3.1 Create a Virtual Environment (Choose ONE method):

**Using `venv` (Recommended):**

```bash
cd backend
python3 -m venv venv  # Creates a virtual environment named 'venv'
```

**Using `virtualenv` (if installed):**

```bash
cd backend
virtualenv venv     # Creates a virtual environment named 'venv'
```

### 3.2 Activate the Virtual Environment:

- **macOS/Linux:**

  ```bash
  source venv/bin/activate
  ```

- **Windows (PowerShell):**

  ```powershell
  .\venv\Scripts\Activate.ps1
  ```

- **Windows (Command Prompt):**

  ```cmd
  .\venv\Scripts\activate.bat
  ```

After activation, your terminal prompt should show `(venv)` indicating you are inside the virtual environment.

### 3.3 Install Backend Dependencies

With the virtual environment activated, install the required libraries:

```bash
pip install -r requirements.txt
```

---

## 4. Database Setup (SQLite - For Development)

For the MVP, SQLite is used for development with minimal setup. The database file (`thinkalike.db`) will be created automatically in the `backend/app` directory upon running the backend (provided your code initializes the database properly).

---

## 5. Running the Project (Development Mode)

### Frontend (React)

Open a new terminal window (or tab) and **do not deactivate your virtual environment** if both parts share the same shell session. Then navigate to the frontend directory:

```bash
cd ../frontend  # Switch back to project root, then into the frontend folder
npm start
```

This command starts the React development server. Your browser should automatically open to [http://localhost:3000](http://localhost:3000). If it doesn’t, open that URL manually.

### Backend (FastAPI)

Using your first terminal window (with the virtual environment activated), navigate to the backend’s `app` directory and start the FastAPI server:

```bash
cd app  # Ensure you are in backend/app
uvicorn main:app --reload --port 8000
```

The FastAPI development server is launching with automatic reloading. You can access the interactive API documentation at:
[http://localhost:8000/docs](http://localhost:8000/docs)

---

## 6. Accessing the Application

With both frontend and backend running, you can access the ThinkAlike application in your browser at [http://localhost:3000](http://localhost:3000). Initially, you should see the DataTraceability component displaying static data.

---

## 7. Making a Change and Contributing

### Create a Feature Branch

Always create a branch for your work:

```bash
git checkout -b feature/#<issue-number>-short-description
```

Replace `<issue-number>` with the relevant GitHub issue number, and `short-description` with a brief description of your changes (prefix your branch with `fix/`, `feature/`, `docs/`, or `style/` as needed).

### Make Changes

Modify the code or documentation as needed, test your changes, and visually verify using the UI.

### Commit Your Changes

Stage and commit your changes:

```bash
git add .
git commit -m "feat(ui): add a helpful description of your changes"
```

We recommend following the Conventional Commits specification for commit messages.

### Push to GitHub

```bash
git push origin your-branch-name
```

### Create a Pull Request

On GitHub, create a new Pull Request from your branch to the `main` branch.

---

## 8. Finding Your First Task

Check the Issues tab on the GitHub repository for open tasks. Look for issues labeled "good first issue" or "help wanted" to get started.

---

## 9. Code Style and Testing

For detailed guidelines on code style and testing, refer to:  
- `docs/code_style.md`  
- `docs/testing_guide.md`

---

This Quickstart Guide provides all the essential steps to get your local development environment running. For more information, refer to the full onboarding documentation available in the `docs` directory.

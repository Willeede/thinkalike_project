# ThinkAlike Project - Installation Guide

## Welcome to ThinkAlike! - **Read This First!**

This guide will walk you through the steps to set up your local development environment for the ThinkAlike project. Whether you are a developer, contributor, or simply want to run the project locally, please **carefully read through these instructions *completely* before you begin the installation process.**

Ensuring you have all the **prerequisites installed** and follow each step **exactly as described** will help you avoid common issues and get your local environment set up smoothly.

Let's get started and build the revolution, comrade!

## Prerequisites

Before you begin, ensure you have the following software installed on your system:

1.  **Git:**  Download and install Git from [https://git-scm.com/](https://git-scm.com/). **Git is *essential* for version control** and for cloning the project repository from GitHub.
2.  **Python 3.9+:** Download and install **Python 3.9 or a *later version*** from [https://www.python.org/downloads/](https://www.python.org/downloads/). **Ensure that Python is added to your system's PATH environment variable** during installation.
3.  **Node.js 16+ and npm:** Download and install **Node.js (version 16 or later)** and **npm** (Node Package Manager) from [https://nodejs.org/](https://nodejs.org/). **npm is used to manage JavaScript dependencies for the UI project.**
4.  **Docker (Optional, but *Highly Recommended*):** Download and install **Docker Desktop** from [https://www.docker.com/products/docker-desktop](https://www.docker.com/products/docker-desktop). **Docker is *highly recommended* for containerizing the application and simplifying the setup of consistent development and deployment environments.**  Docker ensures a consistent development environment across different operating systems, simplifies dependency management, and makes deployment much easier later on. If you choose not to install Docker initially, you can skip the Docker-related steps, but it is strongly advised to set up Docker later for a smoother and more professional development experience.

---

**Command Prompt/Terminal Tips for Beginners (Optional):**

If you are new to using the command prompt or terminal, here are a few basic tips to help you navigate the command-line interface (CLI) during the installation process:

*   **What is the Command Prompt/Terminal?** The **command prompt** (on Windows) or **Terminal** (on macOS/Linux) is a text-based interface that allows you to interact with your computer by typing commands, instead of using a graphical user interface (GUI) with windows and menus.
*   **Navigating Directories:** To move between folders (directories) in the command line, use the `cd` command. For example:
    *   `cd Documents`  (navigates into the "Documents" folder)
    *   `cd ..` (navigates one folder up, to the parent directory)
*   **Executing Commands:** Commands are typed after the prompt (e.g., `C:\Users\YourName>` on Windows or `yourname$ ` on macOS/Linux) and executed by pressing the **Enter** key.
*   **Getting Help:** If you are unfamiliar with command-line interfaces, there are many excellent online tutorials available to help you get started. Search online for "command prompt tutorial" (for Windows) or "terminal tutorial" (for macOS/Linux) to find beginner-friendly guides.

---

## Installation Steps

Follow these steps to install and run the ThinkAlike project locally:

**Step 1: Clone the GitHub Repository**

1.  **Open File Explorer** (Windows) or **Finder** (macOS) and navigate to the directory where you want to clone the project (e.g., your `Projects` folder, your Desktop, or your user home directory).
2.  **Open Command Prompt or Terminal:**
    *   **Windows:** Open the "Command Prompt" application from the Start Menu.
    *   **macOS:** Open the "Terminal" application (you can find it in `/Applications/Utilities/` or by searching in Spotlight).
3.  **Navigate to the Desired Directory in Command Prompt/Terminal:** Use the `cd` command in your command prompt or terminal to navigate to the directory where you want to clone the project. For example, if you want to clone it to your "Projects" folder within your user home directory, you might type a command like:  `cd Projects` (and press Enter).
4.  **Run the Git Clone Command:** In your command prompt or terminal, run the following **`git clone`** command:

    ```bash
    git clone https://github.com/Willeede/thinkalike-project.git
    ```

    This command will:
    *   Download (clone) the entire ThinkAlike project codebase from the GitHub repository.
    *   Create a new folder named `thinkalike-project` in your current directory.
    *   Place all the project files and folders inside the newly created `thinkalike-project` folder.
5.  **Navigate into the Project Directory:** Use the `cd` command to navigate into the newly created `thinkalike-project` directory:

    ```bash
    cd thinkalike-project
    ```

**Step 2: Set Up Python Backend Environment**

1.  **Create a Virtual Environment:** **It is *highly recommended* to create a virtual environment** for the Python backend. This isolates the project's Python dependencies and prevents conflicts with other Python projects on your system.  From the root `thinkalike-project` directory in your command prompt/terminal, run:

    ```bash
    python -m venv venv
    ```

    This command will create a new virtual environment named `venv` inside your `thinkalike-project` folder.

2.  **Activate the Virtual Environment:** You must **activate the virtual environment** to use it for subsequent Python commands. The activation command is different for Windows and Linux/macOS:

    *   **Windows:**
        ```bash
        venv\Scripts\activate
        ```
    *   **Linux / macOS:**
        ```bash
        source venv/bin/activate
        ```

    After running the activation command, you will see **`(venv)`** at the beginning of your command prompt or terminal line. This indicates that the virtual environment is activated and that subsequent `python` and `pip` commands will use packages installed within this isolated environment.

3.  **Install Backend Dependencies:** Install the required Python packages for the backend. These dependencies are listed in the `backend/requirements.txt` file. Use the following **`pip install`** command:

    ```bash
    pip install -r backend/requirements.txt
    ```

    This command will:
    *   Use the `pip` package installer (which is now running within your activated virtual environment).
    *   Read the list of required Python packages from the `backend/requirements.txt` file.
    *   Download and install all the listed Python dependencies (Flask, Flask-Cors, etc.) *inside* your activated `venv` virtual environment.

**Step 3: Set Up and Run the React UI**

1.  **Navigate to the `ui` directory:** From the root `thinkalike-project` directory in your command prompt/terminal, navigate into the `ui` folder:

    ```bash
    cd ui
    ```

2.  **Install UI Dependencies:** Install the required Node.js packages for the React UI project. These dependencies are managed by npm (Node Package Manager) and listed in the `ui/package.json` file.  Run the following **`npm install`** command:

    ```bash
    npm install
    ```

    This command will:
    *   Use npm to install all the UI dependencies listed in `ui/package.json`.
    *   Download and install these dependencies into a new folder named `node_modules` inside the `ui` directory.

3.  **Start the React UI Development Server:** Start the React UI development server using npm. This server will compile your React code, launch the UI in your web browser, and automatically reload the UI when you make changes to the code. Run the following **`npm start`** command:

    ```bash
    npm start
    ```

    This command will:
    *   Start the React development server.
    *   Compile your React UI code.
    *   **Automatically open the ThinkAlike UI in your default web browser.** You should see the ThinkAlike User Interface running in your browser, usually at a URL like `http://localhost:3000` (or a different URL, which will be displayed in your terminal output).

**Step 4: Run the Python Backend**

1.  **Open a *New* Terminal or Command Prompt Window:** **Keep the terminal window running the React UI development server *open and running***. Open a *separate, new* terminal or command prompt window to run the backend.
2.  **Navigate to the `backend/app` directory in the *New* Terminal Window:** In the *new* terminal window, navigate to the `backend/app/` directory within your `thinkalike-project` folder:

    ```bash
    cd path/to/your/thinkalike-project/backend/app
    ```
    (Replace `path/to/your/thinkalike-project` with the actual path to your project directory).

3.  **Activate the Python Virtual Environment in the *New* Terminal Window (if not already activated):** If you closed the virtual environment terminal window, you need to activate it again in this *new* terminal window:

    *   **Windows:** `venv\Scripts\activate`
    *   **Linux / macOS:** `source venv/bin/activate`

4.  **Run the Flask Backend Application:** Start the Flask backend application by running the `main.py` script using the following **`python`** command:

    ```bash
    python main.py
    ```

    This command will:
    *   Start the Flask development server for the backend application.
    *   Display output in the terminal indicating that the backend server is running, usually at a URL like `http://127.0.0.1:5000` (or a different address, which will be displayed in the terminal output).

**Step 5: Access the ThinkAlike Application in Your Browser**

With both the React UI development server (running in one terminal window) and the Python backend application (running in a *separate* terminal window) running:

*   **Open your web browser** (if it's not already open from Step 3.3).
*   **Access the React UI:** Go to the URL where the React UI is running. This is usually `http://localhost:3000`.

You should now see the **ThinkAlike User Interface running in your web browser**, and it should be **connected to your local Python backend application!** You have successfully installed and run the ThinkAlike project locally!

Congratulations, comrade! You are now ready to start exploring the platform, modifying the code, and contributing to the Enlightenment 2.0 revolution!

## Troubleshooting

If you encounter any issues during the setup process, please refer to the Troubleshooting section of the Onboarding Manual (link to be added - see docs/ONBOARDING.md) or reach out to the ThinkAlike community for assistance (link to community channels to be added - see docs/ONBOARDING.md).

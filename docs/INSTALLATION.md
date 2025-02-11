# ThinkAlike Project - Installation Guide

## Welcome to ThinkAlike! - **Read This First!**

This guide will walk you through the steps to set up your local development environment for the ThinkAlike project. Whether you are a developer, contributor, or simply want to run the project locally, please **carefully read through these instructions *completely* before you begin the installation process.**

Ensuring you have all the **prerequisites installed** and follow each step **exactly as described** will save you time, prevent common issues, and help you get your local environment set up smoothly and efficiently.

Let's get started and build the revolution, comrade!

---

## Prerequisites - **Before You Begin**

Before you begin the installation process, please ensure you have the following software installed on your system:

1.  **Git:**  
    *   **Purpose:** Git is *essential* for version control and for cloning the project repository from GitHub.
    *   **Download & Installation:** Download and install Git from: **[https://git-scm.com/](https://git-scm.com/)**
2.  **Python 3.9+:**  
    *   **Purpose:** Python is the primary programming language for the ThinkAlike backend. Version 3.9 or later is required.
    *   **Download & Installation:** Download and install Python 3.9 or a *later version* from: **[https://www.python.org/downloads/](https://www.python.org/downloads/)**
    *   **Important:** **Ensure that you check the option to "Add Python to PATH"** during the installation process. This is crucial for running Python commands from your command prompt or terminal.
3.  **Node.js 16+ and npm:**  
    *   **Purpose:** Node.js and npm (Node Package Manager) are used to manage JavaScript dependencies and run the React UI project. Version 16 or later of Node.js is required.
    *   **Download & Installation:** Download and install **Node.js (version 16 or later)** and **npm** (Node Package Manager) from: **[https://nodejs.org/](https://nodejs.org/)**
4.  **Docker Desktop (Optional, but *Highly Recommended*):**  
    *   **Purpose:** Docker is *highly recommended* for containerizing the ThinkAlike application. Docker simplifies setup, ensures consistent development and deployment environments, and streamlines the entire development workflow.
    *   **Download & Installation:** Download and install **Docker Desktop** from: **[https://www.docker.com/products/docker-desktop](https://www.docker.com/products/docker-desktop)**
    *   **Benefits of Docker:** Docker ensures a **consistent development environment** across different operating systems, **simplifies dependency management**, and makes **deployment much easier** when you are ready to share your work or deploy the ThinkAlike platform to a server.
    *   **Optional for Initial Setup:** If you choose not to install Docker initially, you can skip the Docker-related steps in this guide. However, it is **strongly advised to set up Docker later** for a smoother and more professional development experience in the long run.

---

### **Command Prompt/Terminal Tips for Beginners (Optional)**:

If you are new to using the command prompt or terminal, don't worry! It's simpler than it looks. Here are a few basic tips to help you navigate the command-line interface (CLI) during the installation process:

*   **What is the Command Prompt/Terminal?** The **command prompt** (on Windows) or **Terminal** (on macOS/Linux) is a text-based interface that allows you to interact with your computer by typing commands, instead of using your mouse and graphical windows. It might seem intimidating at first, but it's a very powerful tool for developers!
*   **Navigating Directories (Folders):** To move between folders (directories) in the command line, use the **`cd`** command (which stands for "change directory"). For example:
    *   `cd Documents`  **(to go *into* the "Documents" folder)**
    *   `cd Projects/ThinkAlike` **(to go into a subfolder)**
    *   `cd ..` **(to go *up* one folder level, to the parent directory)**
*   **Executing Commands:** Commands are typed after the prompt (e.g., `C:\Users\YourName>` on Windows or `yourname$ ` on macOS/Linux) and executed by pressing the **Enter** key.  Just type the command and press Enter to run it!
*   **Getting Help:** If you are new to the command line and feel a bit lost, don't hesitate to seek out additional help! There are many excellent online tutorials available to help you get started with the command line. Just search online for **"command prompt tutorial"** (for Windows) or **"terminal tutorial"** (for macOS/Linux) to find beginner-friendly guides and videos that will walk you through the basics.  Learning a few basic command-line skills will greatly empower you as a developer!

---

## Installation Steps - **Let's Get Started!**

Follow these steps carefully to install and run the ThinkAlike project locally on your computer:

**Step 1: Clone the GitHub Repository - **Get the ThinkAlike Code**

1.  **Open File Explorer** (Windows) or **Finder** (macOS): Open your file manager application on your computer.
2.  **Navigate to Your Desired Project Directory:** Use File Explorer or Finder to navigate to the directory (folder) where you want to clone (download) the ThinkAlike project files. This could be your main `Projects` folder, your `Desktop`, your user home directory, or any other location on your computer where you like to keep your projects organized.
3.  **Open Command Prompt or Terminal in that Directory:**
    *   **Windows:** Open the "Command Prompt" application from the Start Menu. Then, use the `cd` command in the Command Prompt to navigate to the directory you selected in Step 1 (e.g., if you navigated to `C:\Users\YourName\Projects` in File Explorer, you would type `cd C:\Users\YourName\Projects` in the Command Prompt and press Enter).
    *   **macOS:** Open the "Terminal" application (you can find it in `/Applications/Utilities/` or by searching in Spotlight). Then, use the `cd` command in the Terminal to navigate to the directory you selected in Finder (e.g., if you navigated to your "Projects" folder in Finder, you might type `cd Projects` in the Terminal and press Enter).
4.  **Run the Git Clone Command:** In your command prompt or terminal, run the following **`git clone`** command (copy and paste the line below and press Enter):

    **`git clone https://github.com/Willeede/thinkalike-project.git`**

    This command will:
    *   **Download (clone) the entire ThinkAlike project codebase** from the GitHub repository to your computer.
    *   **Create a new folder named `thinkalike-project`** in your current directory (the directory you navigated to in Step 2).
    *   **Place all the project files and folders inside the newly created `thinkalike-project` folder.**

5.  **Navigate into the Project Directory:** Use the `cd` command to navigate *into* the newly created `thinkalike-project` directory.  Type the following command and press Enter:

    **`cd thinkalike-project`**

    Your command prompt or terminal should now show that you are inside the `thinkalike-project` folder (e.g., the prompt might change to something like `C:\Users\YourName\Projects\thinkalike-project>` or `yourname:thinkalike-project$`).

**Step 2: Set Up Python Backend Environment - **Prepare the Backend Engine**

1.  **Create a Virtual Environment:** **It is *highly recommended* to create a virtual environment** for the Python backend.  This keeps your project's Python dependencies isolated and organized. From the root `thinkalike-project` directory in your command prompt/terminal, run the following command:

    **`python -m venv venv`**

    This command will create a new virtual environment named `venv` inside your `thinkalike-project` folder. You will see a new folder named `venv` appear within your project directory.

2.  **Activate the Virtual Environment:** You must **activate the virtual environment** to use it for subsequent Python commands. The activation command is different depending on your operating system:

    *   **Windows:**  Run this command in your command prompt:

        **`venv\Scripts\activate`**

    *   **Linux / macOS:** Run this command in your terminal:

        **`source venv/bin/activate`**

    After running the activation command, you will notice that **`(venv)`** is added to the beginning of your command prompt or terminal line.  For example, it might look like:  `(venv) C:\Users\YourName\Projects\thinkalike-project>` (on Windows) or `(venv) yourname:thinkalike-project$ ` (on macOS/Linux). This **`(venv)` prefix indicates that the virtual environment is *activated*** and that subsequent `python` and `pip` commands will use the isolated environment you just created.

3.  **Install Backend Dependencies:** Install the required Python packages for the backend. These packages are listed in the `backend/requirements.txt` file, which tells Python which libraries your project needs. Use the following **`pip install`** command:

    **`pip install -r backend/requirements.txt`**

    This command will:
    *   Use the `pip` package installer (which is now running *within* your activated virtual environment).
    *   Read the list of required Python packages from the `backend/requirements.txt` file (located in the `backend/` directory).
    *   Download and install all the listed Python dependencies (Flask, Flask-Cors, etc.) *inside* your activated `venv` virtual environment. This may take a few minutes depending on your internet connection.

**Step 3: Set Up and Run the React UI - **Launch the User Interface**

1.  **Navigate to the `ui` directory:** From the root `thinkalike-project` directory in your command prompt/terminal, navigate into the `ui` folder:

    **`cd ui`**

2.  **Install UI Dependencies:** Install the required JavaScript packages for the React UI project. These dependencies are managed by **npm** (Node Package Manager) and are listed in the `ui/package.json` file.  Run the following **`npm install`** command:

    **`npm install`**

    This command will:
    *   Use npm to install all the UI dependencies listed in the `ui/package.json` file.
    *   Download and install these dependencies into a new folder named `node_modules` inside the `ui` directory. This may also take a few minutes depending on your internet connection.

3.  **Start the React UI Development Server:** Start the React UI development server using npm. This server will compile your React code, launch the UI in your web browser, and automatically update the UI in your browser whenever you make changes to the React code. Run the following **`npm start`** command:

    **`npm start`**

    This command will:
    *   Start the React development server.
    *   Compile your React UI code.
    *   **Automatically open the ThinkAlike UI in your default web browser.** You should see the ThinkAlike User Interface running in your browser, usually at a URL like **`http://localhost:3000`** (or a different URL, which will be displayed in your terminal output - pay attention to the terminal output for the exact URL if the browser doesn't open automatically).  **Leave this terminal window running** - this server needs to keep running while you are developing the UI.

**Step 4: Run the Python Backend - **Power the Engine**

1.  **Open a *New* Terminal or Command Prompt Window:** **Crucially, keep the terminal window running the React UI development server *open and running***.  Do not close the previous terminal window! Open a *separate, new* terminal or command prompt window to run the backend.
2.  **Navigate to the `backend/app` directory in the *New* Terminal Window:** In the *new* terminal window, navigate to the `backend/app/` directory within your `thinkalike-project` folder:

    **`cd path/to/your/thinkalike-project/backend/app`**

    (Replace `path/to/your/thinkalike-project` with the actual path to your project directory).

3.  **Activate the Python Virtual Environment in the *New* Terminal Window (if not already activated):** If you closed the virtual environment terminal window, you need to activate it again in this *new* terminal window, using the appropriate command for your operating system:

    *   **Windows:** **`venv\Scripts\activate`**
    *   **Linux / macOS:** **`source venv/bin/activate`**

    Again, you should see the **`(venv)` prefix** appear at the beginning of your command prompt/terminal line to confirm the virtual environment is activated in this *new* window.

4.  **Run the Flask Backend Application:** Start the Flask backend application by running the `main.py` script using the following **`python`** command:

    **`python main.py`**

    This command will:
    *   Start the Flask development server for the backend application.
    *   Display output in the terminal indicating that the backend server is running, usually at a URL like `http://127.0.0.1:5000` (or a different address, which will be displayed in the terminal output). **Leave this terminal window running as well** - the backend server needs to keep running while you are developing and using the application.

**Step 5: Access the ThinkAlike Application in Your Browser - **Experience the Magic!**

With both the React UI development server (running in one terminal window) and the Python backend application (running in a *separate* terminal window) now running in the background:

*   **Open your web browser** (if it's not already open from Step 3.3).
*   **Access the React UI:** Go to the URL where the React UI is running. This is usually **`http://localhost:3000`**.

If everything is set up correctly, you should now see the **ThinkAlike User Interface running in your web browser!**  You have successfully installed and launched the ThinkAlike application locally!

Congratulations, comrade! You are now ready to explore the ThinkAlike platform, start making code changes, and contribute to the revolution!

## Troubleshooting

If you experience any issues during the setup process, don't panic! Here are a few common troubleshooting tips:

*   **Check for Error Messages in Terminals:** Carefully examine the terminal windows where you started the React UI and Python backend servers. Look for any error messages (usually displayed in red text) that might indicate what went wrong during startup or dependency installation.  Error messages are your best clue for diagnosing problems.
*   **Port Conflicts:** If you see errors related to "port already in use" or similar, it means that another application on your computer is already using the default ports (port 3000 for UI, port 5000 for backend).  You can either:
    *   **Identify and close the other application** that is using the port (if you know what it is).
    *   **Change the default ports** for the ThinkAlike UI or backend to use different ports that are free on your system. (Changing ports is a more advanced configuration step - let me know if you need guidance on this).
*   **Dependency Installation Errors:** If you see errors during `npm install` or `pip install -r requirements.txt` steps, it usually indicates problems with dependency installation.  Try these steps:
    *   **Check Internet Connection:** Ensure you have a stable internet connection, as npm and pip need to download packages from online repositories.
    *   **Clear npm Cache (UI Dependencies):** If `npm install` fails, try clearing the npm cache and reinstalling dependencies:
        ```bash
        rm -rf node_modules  # Delete node_modules folder (in ui/ directory)
        npm cache clean --force
        npm install
        ```
    *   **Delete `venv` and Recreate (Python Dependencies):** If `pip install -r requirements.txt` fails, try deleting your Python virtual environment, recreating it, and reinstalling dependencies:
        ```bash
        deactivate  # Deactivate virtual environment (if activated)
        rmdir /s /q venv  # Delete venv folder on Windows
        rm -rf venv     # Delete venv folder on Linux/macOS
        python -m venv venv  # Recreate virtual environment
        # Activate virtual environment again (Windows or Linux/macOS activation command from Step 2.2)
        pip install -r backend/requirements.txt # Reinstall dependencies
        ```
*   **Environment Variable Issues:**  If you encounter errors related to missing environment variables or configuration settings, double-check your `backend/app/config.py` file and ensure you have correctly set up any necessary environment variables (although the default configuration should work for basic local setup without requiring environment variables initially).
*   **Seek Community Help:** If you are still experiencing persistent issues after trying these troubleshooting steps, don't hesitate to reach out to the ThinkAlike community for assistance! Provide clear details about the errors you are seeing (copy and paste the full error messages from your terminal) and describe the steps you have already tried, and other community members or maintainers will do their best to help you resolve the problem.

For more detailed troubleshooting information and solutions to common issues, please refer to the dedicated Troubleshooting section in the complete Onboarding Manual (link to be added - see `docs/ONBOARDING.md` when available).

Let me know if you encounter any specific errors or need further assistance at any point during the installation process! We are here to help you get your local environment set up and running smoothly so you can join the revolution!

# AI Workflow Example in ThinkAlike: Personalized Narrative Generation

This document provides a simplified example of an AI workflow within the ThinkAlike project, focusing on the AI-Driven Narrative Engine (Mode 1) as described in the Onboarding Manual and Architectural Design Specifications.

## Workflow Title: Personalized Narrative Generation based on User Choices

### 1. User Interaction (Presentation Layer - UI)

- **User Initiates Narrative:** User starts a new narrative experience within the ThinkAlike UI.
- **UI Presents Initial Narrative Prompt:** The UI displays an initial narrative prompt or scenario to the user, setting the stage for the narrative (e.g., "You are walking through a bustling city market. What do you do?").
- **User Makes a Choice (Action):** The UI presents the user with a set of choices or actions they can take in response to the prompt (e.g., "A) Explore the market stalls," "B) Ask a local for directions," "C) Check your map").
- **UI Captures User Input:** The UI captures the user's selected choice and packages it as structured data (e.g., JSON format) to send to the backend API.

**Example UI Component (Conceptual):** A React component (NarrativeUI.jsx) would handle the display of narrative prompts, user choice rendering (e.g., using buttons or a dropdown menu), and capturing user input.

### 2. Backend API Request & AI Service Invocation (Application Layer - Backend)

- **UI Sends API Request:** The UI sends an HTTP POST request to the backend API endpoint (e.g., `/api/narrative/next_scene`) with the user's input data (e.g., choice selected).
- **API Endpoint Receives Request:** The backend API endpoint (`/api/n ▋

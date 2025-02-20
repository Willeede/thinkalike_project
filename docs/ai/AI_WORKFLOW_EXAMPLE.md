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
- **API Endpoint Receives Request:** The backend API endpoint (`/api/narrative/next_scene` in `narrative_api.py` blueprint) receives the request and extracts the user input data.
- **API Endpoint Calls AI Service:** The API endpoint invokes the `AIService` (specifically the `NarrativeEngine` module within `AIService`) to generate the next scene in the narrative based on the user's input.
- **Data Transformation (Input to AI Model):** The API endpoint may perform some data transformation or preprocessing of the user input to format it appropriately for the AI Narrative Engine (e.g., converting user choice into a specific input format for the AI model).

### 3. AI Narrative Engine Processing (Application Layer - AI Service)

- **Narrative Engine Receives User Input:** The `NarrativeEngine` module within `AIService` receives the user input data from the API endpoint.

**AI Model Processing (Text Generation):**

- The `NarrativeEngine` utilizes a pre-trained AI model (e.g., a Transformer-based language model like GPT-2 or similar, implemented using Hugging Face Transformers library in Python).
- The AI model takes the user input and the current narrative context as input and generates the next scene in the narrative as text output.
- **Ethical Considerations within AI Model:** The AI model is designed and trained to adhere to ethical guidelines, ensuring that the generated narrative is non-biased, non-offensive, respects user privacy, and promotes positive and value-aligned content (as defined in the ThinkAlike Ethical Guidelines). Bias mitigation techniques are applied during model training and output generation.
- **Data Traceability and Transparency:** Data flow within the AI model is designed to be traceable and transparent where feasible. Input data, model processing steps, and output text are logged and can be inspected for debugging, auditing, and ethical validation purposes (by developers and authorized auditors, not necessarily end-users directly, depending on the context and user privacy considerations).
- **Data Transformation (AI Output to API Response):** The `NarrativeEngine` module formats the AI-generated narrative text output into a structured data format (e.g., JSON) for the API response.

### 4. Backend API Response & UI Update (Application Layer - Backend & Presentation Layer - UI)

- **API Endpoint Sends Response to UI:** The backend API endpoint (`/api/narrative/next_scene`) packages the AI-generated narrative text (and potentially other relevant data, like updated choices for the user) into a JSON response and sends it back to the UI.
- **UI Receives API Response:** The UI (`NarrativeUI.jsx` component) receives the API response containing the AI-generated narrative text.
- **UI Updates Narrative Display:** The UI dynamically updates the narrative display area to present the AI-generated next scene to the user, continuing the personalized narrative experience.
- **UI Renders Updated Choices (If Applicable):** If the API response includes updated choices or actions for the user to take in the new scene, the UI dynamically renders these choices, allowing the user to continue interacting with the AI-driven narrative.

### 5. Data Validation and Ethical Monitoring (Throughout Workflow)

- **Data Validation in AI Workflows:**
  - Data validation is critical throughout AI workflows. UI actionable feedback loops are used to validate data input to AI models, AI model outputs, and the overall data flow within AI-driven features.
  - UI components like `APIValidator` and `DataValidationError` (See Section 4.2: Core UI Components for `APIValidator` and `DataValidationError` Component details) are used to test and validate API interactions with AI models and to display data validation errors in AI workflows.
  - Ethical validation of AI workflows is also performed using UI components, such as the `CoreValuesValidator` (See Section 4.2: Core UI Components for `CoreValuesValidator` Component details), ensuring that AI implementations align with ThinkAlike's core values and ethical guidelines. UI components provide a user-facing interface for monitoring and validating the ethical behavior of AI systems.

### 6. Architectural Diagram (Mermaid) - AI Workflow Integration Highlighted

This diagram visually represents the data flow for the Personalized Narrative Generation workflow, highlighting the key components and interactions between the UI, Backend API, and AI Narrative Engine:

````mermaid
graph LR
    subgraph "Presentation Layer (UI)"
        UI[User Interface] --> API[API Layer]
    end

    subgraph "Application Layer (AI, API, Logic)"
        API --> AI[AI Models - Narrative Engine]
        API --> Logic[Business Logic]
        AI --> API
        Logic --> API
    end

    subgraph "Data Layer (Database, Storage)"
        Logic --> DB[Database Storage]
        AI --> DB
        DB --> Logic
    end

    UI --> API
    API --> AI
    API --> DB
    AI --> UI
    DB --> UI

    style UI fill:#f9f,stroke:#333,stroke-width:2px,color:#000
    style API fill:#ccf,stroke:#333,stroke-width:2px,color:#000
    style Logic fill:#ccf,stroke:#333,stroke-width:2px,color:#000
    style DB fill:#ccf,stroke:#333,stroke-width:2px,color:#000
    style AI fill:#aaf,stroke:#333,stroke-width:2px,stroke-dasharray: 5 5,color:#000
    linkStyle 0,1,2,3,4,5 stroke-width:2px
    linkStyle 1,3 stroke:blue,stroke-width:3px
    linkStyle 2,4 stroke:blue,stroke-width:3px

    classDef layerFill fill:#f9f,stroke:#333,stroke-width:2px,color:#000
    class PresentationLayer layerFill
    class ApplicationLayer layerFill
    class DataLayer layerFill
    class ApplicationLayerAI layerFill

# Mermaid Test

This is a simple test to see if Mermaid diagrams render correctly on GitHub.

```mermaid
graph LR
    subgraph "Presentation Layer (UI)"
        UI[User Interface]
    end

    subgraph "Application Layer (API, Logic)"
        API[API]
        Logic[Business Logic]
        AI[AI Agents]
    end

    subgraph "Data Layer (Database, Storage)"
        DB[Database]
    end

    UI -- Data & Requests --> API
    API -- Processed Data --> UI
    API -- Data Requests --> Logic
    Logic -- Data --> API
    Logic -- Data Requests --> DB
    DB -- Data --> Logic
    AI -- Data Analysis --> DB


This is text after the diagram.


    style UI fill:#FFC300,stroke:#333333,stroke-width:2px
    style API fill:#FF5733,stroke:#333333,stroke-width:2px
    style Logic fill:#FF5733,stroke:#333333,stroke-width:2px
    style DB fill:#800000,stroke:#333333,stroke-width:2px
    style AI fill:#001F3F,stroke:#333333,stroke-width:2px



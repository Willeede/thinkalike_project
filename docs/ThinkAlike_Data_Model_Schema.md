# ThinkAlike Data Model Schema

This document describes the data models and database schema used in the ThinkAlike platform.

**Database:** PostgreSQL

**Note:** The examples below use PostgreSQL syntax. For SQLite (development), some data types might need slight adjustments (e.g., `TEXT` instead of `VARCHAR`).

## Entity-Relationship Diagram (ERD)

*(Will: Insert an image of your ERD here. You can create this using a tool like dbdiagram.io, Lucidchart, or draw.io)*

![ER Diagram Placeholder](placeholder.png)

## Tables

### 1. Users

This table stores basic user account information.

| Column Name     | Data Type      | Constraints                                   | Description                                                                  | Ethical Considerations                                                                                                                                            |
|-----------------|----------------|-----------------------------------------------|------------------------------------------------------------------------------|--------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| **user_id**       | `SERIAL`       | `PRIMARY KEY`                                 | Unique, auto-incrementing user ID.                                           | Used as a primary key; never exposed directly to users.                                                                                                              |
| **username**      | `VARCHAR(30)`  | `UNIQUE`, `NOT NULL`                          | User's chosen username.                                                      | Must be unique.  Inform users about username visibility.                                                                                                       |
| **email**         | `VARCHAR(255)` | `UNIQUE`, `NOT NULL`                          | User's email address.                                                        | Used for login and communication.  Must be unique.  Implement email verification. Store securely.                                                               |
| **password_hash** | `VARCHAR(255)` | `NOT NULL`                                    | Hashed password (using a strong hashing algorithm like bcrypt).                | *Never* store passwords in plain text.  Use a well-vetted hashing library.                                                                                |
| **created_at**    | `TIMESTAMP`    | `NOT NULL`, `DEFAULT CURRENT_TIMESTAMP`       | Date and time the account was created.                                        | Used for auditing and data analysis.                                                                                                                          |
| **is_active**     | `BOOLEAN`      | `NOT NULL`, `DEFAULT TRUE`                     | Indicates whether the user account is active.                                | Used for account management (e.g., disabling accounts).                                                                                                      |
| **full_name**     | `VARCHAR(100)` |  `NOT NULL`                            | User's full name.                                            | Used for displaying the user's name.                                              |

**Example Data:**

| user_id | username  | email                   | password_hash | created_at              | is_active | full_name |
|---------|-----------|-------------------------|---------------|-------------------------|-----------|-----------|
| 1       | johndoe   | john.doe@example.com    | (hashed)      | 2024-03-15T10:00:00Z    | true      | John Doe  |
| 2       | janesmith | [email address removed] | (hashed)      | 2024-03-15T11:30:00Z    | true      | Jane Smith|

### 2. Profiles

This table stores detailed user profile information.

| Column Name          | Data Type     | Constraints                                  | Description                                  | Ethical Considerations                                                                                                                                                                                |
|----------------------|---------------|----------------------------------------------|----------------------------------------------|-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| **profile_id**         | `SERIAL`      | `PRIMARY KEY`                                | Unique, auto-incrementing profile ID.         | Used as primary key.                                                                                                                                                                          |
| **user_id**            | `INTEGER`     | `NOT NULL`, `FOREIGN KEY` referencing `Users` | The user this profile belongs to.            | Ensure referential integrity.  Link to the `Users` table.                                                                                                                                 |
| **bio**              | `TEXT`        |  `NOT NULL`                                      | A short biography or description.                   | Limit length to avoid storage issues. Sanitize input to prevent XSS.  Allow users to control visibility.                                                                          |
| **birthdate**          |    `DATE`     |    `NOT NULL`                                     |                User birthday.                          |    Ensure we are following privacy policies.|
| **location**         | `VARCHAR(255)` |                                              | User's location (city, country).            |  Consider privacy implications.  Allow users to control visibility. Be mindful of potential for misuse (e.g., stalking). Offer varying levels of granularity (city, region, country). |
| **profile_picture_url** | `VARCHAR(255)` |                                              | URL of the user's profile picture.          | Store securely; allow users to delete; do not use for purposes other than display.                                                                                           |

**Example Data:**

| profile_id | user_id | bio                                  | birthdate    | location     | profile_picture_url   |
|------------|---------|--------------------------------------|--------------|--------------|-----------------------|
| 1          | 1       | Software developer and AI enthusiast.| 1990-05-10   | New York, USA| /images/users/1.jpg   |
| 2          | 2       | Passionate about ethical technology. | 1995-03-15   | London, UK   | /images/users/2.jpg   |

### 3. Connections

This table stores relationships between users.

| Column Name      | Data Type     | Constraints                                                        | Description                                                                                                | Ethical Considerations                                                                                  |
|------------------|---------------|--------------------------------------------------------------------|------------------------------------------------------------------------------------------------------------|-----------------------------------------------------------------------------------------------------|
| **connection_id** | `SERIAL`      | `PRIMARY KEY`                                                      | Unique connection ID.                                                                                       | Used for internal reference only.                                                                   |
| **user1_id**       | `INTEGER`     | `NOT NULL`, `FOREIGN KEY` referencing `Users`                  | ID of the first user in the connection.                                                                     | Ensure referential integrity.                                                                       |
| **user2_id**       | `INTEGER`     | `NOT NULL`, `FOREIGN KEY` referencing `Users`, `CHECK (user1_id < user2_id)` | ID of the second user in the connection. The `CHECK` constraint prevents duplicate connections (e.g., (1, 2) and (2, 1)). | Ensure referential integrity and prevent duplicates.                                                  |
| **status**         | `VARCHAR(20)` | `NOT NULL`, `CHECK (status IN ('pending', 'accepted', 'rejected', 'blocked'))` | Status of the connection (pending, accepted, rejected, blocked).                                    | Clearly define and enforce the different connection states. Provide mechanisms for user reporting. |
| **created_at**     | `TIMESTAMP`    | `NOT NULL`, `DEFAULT CURRENT_TIMESTAMP`                            | Date and time the connection request was created.                                                        | Used for auditing and data analysis.                                                                 |

**Example Data:**

| connection_id | user1_id | user2_id | status    | created_at              |
|---------------|----------|----------|-----------|-------------------------|
| 1             | 1        | 2        | accepted  | 2024-03-15T12:00:00Z    |
| 2             | 1        | 3        | pending   | 2024-03-15T13:00:00Z    |

### 4. Values_Interests (Example - Adapt to your needs)

This is a *simplified* example. You'll likely need a more sophisticated structure for storing values and interests, possibly involving multiple tables and many-to-many relationships.

| Column Name           | Data Type      | Constraints                                   | Description                                                    | Ethical Considerations                                                     |
| --------------------- | -------------- |-----------------------------------------------|---------------------------------------------------------------|-------------------------------------------------------------------------|
| **value_interest_id**| `SERIAL`       |`PRIMARY KEY`                                  | Unique ID.                                                  |
| **user_id**           | `INTEGER`      | `NOT NULL`, `FOREIGN KEY` referencing `Users` | The user to whom this value/interest belongs.                   | Ensure referential integrity.                                          |
| **category**          | `VARCHAR(50)`  | `NOT NULL`                                    | Category of the value/interest (e.g., "Technology", "Ethics"). | Limit categories to prevent overly granular data collection; allow users to define custom categories (with moderation). |
| **value**             | `VARCHAR(100)` | `NOT NULL`                                    | The specific value or interest.                               | Avoid sensitive or potentially discriminatory values; allow user-defined values (with moderation).                    |
| **importance**        | `INTEGER`      | `NOT NULL`, `CHECK (importance BETWEEN 1 AND 5)` | Importance rating (1-5, for example).                           | Ensure users understand how this rating is used.                     |

**Example Data:**

| value_interest_id | user_id | category        | value              | importance |
|-------------------|---------|-----------------|--------------------|------------|
| 1                 | 1       | Technology      | AI Ethics          | 5          |
| 2                 | 1       | Social Impact   | Sustainable Development | 4          |
| 3                 | 2       | Ethics          | Data Privacy       | 5          |

---

**Data Validation:**

*   **Frontend:** Implement client-side validation in your React components to ensure data is in the correct format before sending it to the backend. Use UI components to provide clear feedback.
*   **Backend:** Implement server-side validation in your FastAPI endpoints using Pydantic models. This is *essential* for security and data integrity.
*   **Database:** Use database constraints (e.g., `NOT NULL`, `UNIQUE`, `CHECK`) to enforce data integrity at the database level.

**Ethical Considerations:**

*   **Data Minimization:** Collect *only* the data that is absolutely necessary for the platform's functionality. Avoid collecting sensitive personal information unless it's essential and you have explicit user consent.
*   **Transparency:** Clearly explain to users *what* data is being collected, *why* it's being collected, and *how* it will be used. This should be integrated into the UI.
*   **User Control:** Provide users with clear and easy-to-use controls to manage their data (view, modify, delete).
*   **Security:** Implement robust security measures to protect user data from unauthorized access and breaches.
* **Testing:** Use UI data to test and validate all the data workflows.

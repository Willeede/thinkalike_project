# ThinkAlike Data Model Schema

This document describes the data models and database schema used in the ThinkAlike platform.  We are using **SQLite for development** and **PostgreSQL for production**. This document reflects the PostgreSQL schema.

## Database: PostgreSQL

**Note:**  The examples below use PostgreSQL syntax. For SQLite (development), some data types might need slight adjustments (e.g., `TEXT` instead of `VARCHAR`).

## Entity-Relationship Diagram (ERD)

*(Will:  Insert an image of your ERD here.  You can create this using a tool like dbdiagram.io, Lucidchart, or draw.io)*

![ER Diagram Placeholder](placeholder.png)  ## Tables

### 1. Users

This table stores basic user account information.

| Column Name     | Data Type      | Constraints                                   | Description                                                                  | Ethical Considerations                                                                                                                                            |
|-----------------|----------------|-----------------------------------------------|------------------------------------------------------------------------------|--------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `user_id`       | `SERIAL`       | `PRIMARY KEY`                                 | Unique, auto-incrementing user ID.                                           | Used as a primary key; never exposed directly to users.                                                                                                              |
| `username`      | `VARCHAR(30)`  | `UNIQUE`, `NOT NULL`                          | User's chosen username.                                                      | Must be unique.  Inform users about username visibility.                                                                                                       |
| `email`         | `VARCHAR(255)` | `UNIQUE`, `NOT NULL`                          | User's email address.                                                        | Used for login and communication.  Must be unique.  Implement email verification. Store securely.                                                               |
| `password_hash` | `VARCHAR(255)` | `NOT NULL`                                    | Hashed password (using a strong hashing algorithm like bcrypt).                | *Never* store passwords in plain text.  Use a well-vetted hashing library.                                                                                |
| `created_at`    | `TIMESTAMP`    | `NOT NULL`, `DEFAULT CURRENT_TIMESTAMP`       | Date and time the account was created.                                        | Used for auditing and data analysis.                                                                                                                          |
| `is_active`     | `BOOLEAN`      | `NOT NULL`, `DEFAULT TRUE`                     | Indicates whether the user account is active.                                | Used for account management (e.g., disabling accounts).                                                                                                      |
| `full_name`     | `VARCHAR(100)` | `NOT NULL`                            | User's full name.                                            | Used for displaying the user's name.                                                                      |

**Example Data:**

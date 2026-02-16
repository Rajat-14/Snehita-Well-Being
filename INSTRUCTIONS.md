# How to Run Snehita Well-Being Project

This project uses Docker for the Frontend and Backend, but requires you to have **PostgreSQL installed manually** on your local machine.

## Prerequisites

1.  **Docker Desktop** installed and running.
2.  **PostgreSQL** installed locally.
3.  **Node.js** (optional, useful for local debugging).

## Step 1: Database Setup

1.  Open **pgAdmin** or your preferred database tool.
2.  Create a new database named `snehita`.
3.  Note down your PostgreSQL **username**, **password**, and **port** (default is usually 5432).

## Step 2: Configure Environment Variables

1.  Navigate to the `server` directory.
2.  Create or edit the `.env` file.
3.  Update the `DATABASE_URL` to point to your local machine from within Docker.

**Important:** Inside Docker, `localhost` refers to the container itself. To access your host machine's database, you must use `host.docker.internal`.

Update your `server/.env` file like this:

```env
# Replace 'username', 'password', and 'port' with your local PostgreSQL details.
# host.docker.internal resolves to your computer's IP address.

DATABASE_URL=postgres://YOUR_USERNAME:YOUR_PASSWORD@host.docker.internal:YOUR_PORT/snehita

# Example:
# DATABASE_URL=postgres://postgres:mysecretpassword@host.docker.internal:5432/snehita

# Keep these as is
MAIL=carewho.987@gmail.com
PASSWORD=sqib sves tips fpps
SECRET=1123326285sfgdgvx
BASE_URL=http://localhost:3001
```

## Step 3: Run the Application

1.  Open a terminal in the project root.
2.  Navigate to the docker directory:
    ```bash
    cd infra/docker
    ```
3.  Build and start the containers:
    ```bash
    docker-compose up --build
    ```

## Step 4: Access the Application

-   **Frontend**: [http://localhost:3000](http://localhost:3000)
-   **Backend API**: [http://localhost:8000](http://localhost:8000)

## Troubleshooting

-   **"connection refused"**:
    -   Make sure your local PostgreSQL is running.
    -   Check if the `DATABASE_URL` in `.env` uses `host.docker.internal` and the correct port.
    -   Ensure PostgreSQL is configured to allow connections (usually default).
-   **"password authentication failed"**: Check your username and password in `DATABASE_URL`.

#!/bin/bash

# Install necessary dependencies
echo "Installing dependencies..."
pip install -r backend/requirements.txt
npm install --prefix frontend

# Build the frontend
echo "Building frontend..."
npm run build --prefix frontend

# Start the backend server
echo "Starting backend server..."
python backend/app/main.py &

# Start the frontend server
echo "Starting frontend server..."
npm start --prefix frontend

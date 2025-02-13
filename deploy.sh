#!/bin/bash

# Install necessary dependencies
echo "Installing dependencies..."
pip install -r backend/requirements.txt
npm install --prefix ui

# Build the frontend
echo "Building frontend..."
npm run build --prefix ui

# Start the backend server
echo "Starting backend server..."
python backend/app/main.py &

# Start the frontend server
echo "Starting frontend server..."
npm start --prefix ui

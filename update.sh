#!/bin/bash
# This script updates the GitHub repository with your local changes.

# Check the status of changed files
echo "Checking status..."
git status

# Add all changes to the staging area (modified, deleted, untracked files)
echo "Staging all changes..."
git add .

# Commit changes with a commit message provided by the user
echo "Enter a commit message:"
read commit_message
git commit -m "$commit_message"

# Push the changes to the remote repository on the main branch
echo "Pushing changes to remote repository..."
git push origin main

echo "Repository successfully updated!"
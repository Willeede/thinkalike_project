@echo off
echo Checking status...
git status

echo Staging all changes...
git add .

set /p commit_message="Enter a commit message: "
git commit -m "%commit_message%"

echo Pushing changes to remote repository on the main branch...
git push origin main

echo Repository successfully updated!
pause
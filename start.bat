@echo off

set PROJECT_PATH=.\Admin
set FRONTEND_PATH=%PROJECT_PATH%\frontend
set BACKEND_PATH=%PROJECT_PATH%\backend

echo Updating the code...
cd %PROJECT_PATH%
git pull

echo Installing frontend dependencies...
cd %FRONTEND_PATH%
npm install

echo Building frontend...
npm run build

echo Installing backend dependencies...
cd %BACKEND_PATH%
npm install

echo Starting the backend server...
npm start

echo Starting the frontend server...
cd %FRONTEND_PATH%
npm start

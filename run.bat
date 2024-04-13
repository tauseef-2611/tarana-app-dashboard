@echo off
cls
echo Starting the application setup...
echo Please wait, this may take a few minutes.

set PROJECT_ROOT=E:\Programming\Tarana App\Admin Tarana Portal
set PROJECT_PATH=%PROJECT_ROOT%\Admin

set FRONTEND_PATH=%PROJECT_PATH%\frontend
set BACKEND_PATH=%PROJECT_PATH%\backend

cd /d %PROJECT_PATH%
if not exist "%PROJECT_PATH%" (
    echo Error: Project path not found.
    echo Please ensure you are running this script from the correct location.
    pause
    exit /b
)

echo Updating the code from the repository...
git -c http.extraHeader="AUTHORIZATION: bearer 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" pull
if errorlevel 1 (
    echo Error: Failed to update the code from the repository.
    pause
    exit /b
)

cd /d %FRONTEND_PATH%
if not exist "%FRONTEND_PATH%" (
    echo Error: Frontend path not found.
    pause
    exit /b
)

echo Installing frontend dependencies...
npm install
if errorlevel 1 (
    echo Error: Failed to install frontend dependencies.
    pause
    exit /b
)

echo Frontend dependencies installed successfully.

echo Building the frontend...
npm run build
if errorlevel 1 (
    echo Error: Failed to build the frontend.
    pause
    exit /b
)

echo Frontend built successfully.

cd /d %BACKEND_PATH%
if not exist "%BACKEND_PATH%" (
    echo Error: Backend path not found.
    pause
    exit /b
)

echo Installing backend dependencies...
npm install
if errorlevel 1 (
    echo Error: Failed to install backend dependencies.
    pause
    exit /b
)

echo Backend dependencies installed successfully.

echo Attempting to start the backend server...
start "Backend Server" cmd /k "cd /d %BACKEND_PATH% && npm start"
if errorlevel 1 (
    echo Error: Failed to start the backend server.
    pause
    exit /b
)

echo Backend server started successfully.

cd /d %FRONTEND_PATH%
echo Attempting to start the frontend server...
start "Frontend Server" cmd /k "cd /d %FRONTEND_PATH% && npm start"
if errorlevel 1 (
    echo Error: Failed to start the frontend server.
    pause
    exit /b
)

echo Frontend server started successfully.
pause

echo The application has been started successfully.
echo Please check the new command prompt windows for the servers.
pause

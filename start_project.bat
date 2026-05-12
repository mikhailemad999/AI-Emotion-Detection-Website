@echo off
setlocal enabledelayedexpansion
title EmotiSense - AI Emotion Analyzer
color 0B

echo.
echo  ╔══════════════════════════════════════════════════════════╗
echo  ║          EmotiSense - AI Emotion Analyzer                ║
echo  ║          Starting All Services...                        ║
echo  ╚══════════════════════════════════════════════════════════╝
echo.

:: ─── Check Docker is running ────────────────────────
echo [1/6] Checking Docker...
docker info >nul 2>&1
if %errorlevel% neq 0 (
    echo.
    echo  [ERROR] Docker is not running!
    echo  Please start Docker Desktop and try again.
    echo.
    pause
    exit /b 1
)
echo       Docker is running. OK

:: ─── Stop any existing containers ───────────────────
echo.
echo [2/6] Stopping old containers...
docker compose down >nul 2>&1
echo       Old containers stopped.

:: ─── Remove old frontend build volume ───────────────
echo.
echo [3/6] Clearing old frontend build cache...
docker volume rm emoji_frontend_build >nul 2>&1
echo       Build cache cleared.

:: ─── Build and start all services ───────────────────
echo.
echo [4/6] Building and starting services...
echo       This may take a few minutes on first run...
echo.
docker compose up -d --build
if %errorlevel% neq 0 (
    echo.
    echo  [ERROR] Failed to start services!
    echo  Run "docker compose logs" to see what went wrong.
    echo.
    pause
    exit /b 1
)

:: ─── Wait for backend to be ready ───────────────────
echo.
echo [5/6] Waiting for backend to be ready...
set /a attempts=0
set /a max_attempts=60

:wait_loop
set /a attempts+=1
if !attempts! gtr !max_attempts! (
    echo.
    echo  [WARNING] Backend is taking longer than expected.
    echo  Check logs with: docker compose logs backend
    goto :show_info
)

:: Check if backend responds to API root
docker exec emotisense-backend curl -s http://localhost:8000/api/ >nul 2>&1
if %errorlevel% neq 0 (
    <nul set /p "=."
    timeout /t 2 /nobreak >nul
    goto :wait_loop
)
echo.
echo       Backend is ready!

:: ─── Wait for Nginx ─────────────────────────────────
echo.
echo [6/6] Waiting for Nginx proxy...
timeout /t 5 /nobreak >nul
echo       Nginx is ready!

:show_info
echo.
echo  ╔══════════════════════════════════════════════════════════╗
echo  ║                                                          ║
echo  ║   EmotiSense is running!                                 ║
echo  ║                                                          ║
echo  ║   Application:   http://localhost:8080                   ║
echo  ║   Backend API:   http://localhost:8080/api/              ║
echo  ║   Django Admin:  http://localhost:8080/admin/            ║
echo  ║   Direct API:    http://localhost:8000/api/              ║
echo  ║                                                          ║
echo  ║   Commands:                                              ║
echo  ║     View logs:   docker compose logs -f                  ║
echo  ║     Stop:        docker compose down                     ║
echo  ║     Restart:     docker compose restart                  ║
echo  ║                                                          ║
echo  ╚══════════════════════════════════════════════════════════╝
echo.

:: ─── Open browser ───────────────────────────────────
echo Opening browser...
start http://localhost:8080
echo.
echo Press any key to view live logs (Ctrl+C to exit logs)...
pause >nul
docker compose logs -f

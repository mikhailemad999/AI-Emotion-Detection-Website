@echo off
echo ============================================================
echo           EmotiSense - AI Emotion Analyzer
echo ============================================================
echo.
echo Starting the project using Docker Compose...
echo.

docker compose up -d

echo.
echo ============================================================
echo   Project started successfully!
echo.
echo   Frontend:    http://localhost:8080
echo   Backend API: http://localhost:8080/api/
echo   Django Admin: http://localhost:8080/admin/
echo.
echo   To see logs, run: docker compose logs -f
echo   To stop the project, run: docker compose down
echo ============================================================
pause

@echo off
REM Batch Script to Restart Docker System
REM Run this script to completely restart the GraphQL project

echo.
echo ========================================
echo   Restarting GraphQL Docker System
echo ========================================
echo.

echo [1/4] Stopping all services...
docker-compose down -v

echo.
echo [2/4] Rebuilding all images...
docker-compose build --no-cache

echo.
echo [3/4] Starting all services...
docker-compose up -d

echo.
echo [4/4] Waiting for services to be ready...
timeout /t 10 /nobreak > nul

echo.
echo ========================================
echo   System Restarted Successfully!
echo ========================================
echo.
echo Next steps:
echo   1. Seed databases: docker exec -it graphql_api sh -c "node src/scripts/seedAll.js"
echo   2. View logs: docker-compose logs -f
echo   3. Access frontend: http://localhost:3000
echo   4. Access GraphQL: http://localhost:4000/graphql
echo.
echo Checking service status...
docker ps

echo.
pause


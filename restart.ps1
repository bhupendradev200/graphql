# PowerShell Script to Restart Docker System
# Run this script to completely restart the GraphQL project

Write-Host "🛑 Stopping all services..." -ForegroundColor Yellow
docker-compose down -v

Write-Host "🔨 Rebuilding all images..." -ForegroundColor Cyan
docker-compose build --no-cache

Write-Host "🚀 Starting all services..." -ForegroundColor Green
docker-compose up -d

Write-Host "⏳ Waiting for services to be ready..." -ForegroundColor Yellow
Start-Sleep -Seconds 10

Write-Host "📊 Checking service status..." -ForegroundColor Cyan
docker ps

Write-Host "✅ System restarted successfully!" -ForegroundColor Green
Write-Host "📝 Next steps:" -ForegroundColor Yellow
Write-Host "   1. Seed databases: docker exec -it graphql_api sh -c 'node src/scripts/seedAll.js'" -ForegroundColor White
Write-Host "   2. View logs: docker-compose logs -f" -ForegroundColor White
Write-Host "   3. Access frontend: http://localhost:3000" -ForegroundColor White
Write-Host "   4. Access GraphQL: http://localhost:4000/graphql" -ForegroundColor White


# Quick Start Guide - Fixing Common Errors

## Error: Docker Desktop Not Running

**Error Message:**
```
error during connect: Get "http://%2F%2F.%2Fpipe%2FdockerDesktopLinuxEngine...": 
open //./pipe/dockerDesktopLinuxEngine: The system cannot find the file specified.
```

**Solution:**
1. **Start Docker Desktop** on Windows
   - Click the Docker Desktop icon in your system tray
   - Or search for "Docker Desktop" in Start menu and launch it
   - Wait until Docker Desktop shows "Docker Desktop is running" in the system tray

2. **Verify Docker is running:**
   ```powershell
   docker ps
   ```
   If you see a list (even if empty), Docker is running. If you get an error, Docker is not running.

3. **Then run your command again:**
   ```powershell
   cd graphql
   docker-compose up --build
   ```

## Error: Version Attribute Obsolete

**Warning Message:**
```
warning msg="...docker-compose.yml: the attribute `version` is obsolete, it will be ignored"
```

**Solution:**
✅ **FIXED** - Removed `version: '3.8'` from docker-compose.yml

## Complete Step-by-Step Setup

### Step 1: Start Docker Desktop
- Open Docker Desktop application
- Wait for it to fully start (green icon in system tray)

### Step 2: Verify Docker is Running
```powershell
docker --version
docker-compose --version
```

### Step 3: Navigate to Project
```powershell
cd graphql
```

### Step 4: Start All Services
```powershell
docker-compose up --build
```

### Step 5: Seed Databases (in new terminal)
```powershell
docker exec -it graphql_api sh
node src/scripts/seedAll.js
exit
```

### Step 6: Access Application
- Frontend: http://localhost:3000
- GraphQL API: http://localhost:4000/graphql

## Troubleshooting

### Docker Desktop Won't Start
- Check Windows WSL 2 is enabled
- Restart your computer
- Reinstall Docker Desktop if needed

### Port Already in Use
- Stop other services using ports 3000, 4000, 5432, 27017
- Or change ports in docker-compose.yml

### Permission Errors
- Run PowerShell as Administrator
- Or ensure Docker Desktop has proper permissions


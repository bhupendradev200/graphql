# Restart Commands - After Fixing Errors

## 🔄 Complete Restart (Recommended After Fixes)

### Step 1: Stop and Remove Everything
```powershell
cd graphql
docker-compose down -v
```

**What this does:**
- Stops all running containers
- Removes containers
- Removes volumes (fresh start)
- Removes network

### Step 2: Rebuild Everything from Scratch
```powershell
docker-compose build --no-cache
```

**What this does:**
- Rebuilds all images without using cache
- Ensures OpenSSL is installed fresh
- Generates Prisma Client properly

### Step 3: Start All Services
```powershell
docker-compose up
```

**Or start in detached mode (background):**
```powershell
docker-compose up -d
```

---

## 🚀 Quick Restart (If Services Are Running)

### Option 1: Restart Specific Service
```powershell
# Restart just the API service
docker-compose restart api

# Restart frontend
docker-compose restart frontend

# Restart all services
docker-compose restart
```

### Option 2: Rebuild and Restart API Only
```powershell
docker-compose build --no-cache api
docker-compose up -d api
```

---

## 🔧 Complete Reset (Nuclear Option)

If you're still having issues, completely reset everything:

```powershell
# Stop everything
docker-compose down -v

# Remove all images
docker rmi graphql-api graphql-frontend

# Remove all containers
docker container prune -f

# Rebuild everything
docker-compose build --no-cache

# Start services
docker-compose up
```

---

## 📋 Step-by-Step Complete Restart

### 1. Navigate to Project
```powershell
cd graphql
```

### 2. Stop All Services
```powershell
docker-compose down -v
```

### 3. Rebuild All Images
```powershell
docker-compose build --no-cache
```

**Expected output:**
```
✅ Building api...
✅ Step 1/8 : FROM node:20-alpine
✅ Step 2/8 : RUN apk add --no-cache openssl libc6-compat
✅ Step 3/8 : COPY package*.json ./
✅ Step 4/8 : RUN npm install
✅ Step 5/8 : COPY prisma ./prisma
✅ Step 6/8 : RUN npx prisma generate
✅ Building frontend...
✅ Successfully built
```

### 4. Start All Services
```powershell
docker-compose up
```

**Or in background:**
```powershell
docker-compose up -d
```

### 5. Check Logs
```powershell
# View all logs
docker-compose logs -f

# View specific service logs
docker-compose logs -f api
docker-compose logs -f frontend
```

### 6. Verify Services Are Running
```powershell
docker ps
```

**Expected output:**
```
CONTAINER ID   IMAGE              STATUS
xxxxx          graphql-api        Up X minutes
xxxxx          graphql-frontend   Up X minutes
xxxxx          postgres:15        Up X minutes (healthy)
xxxxx          mongo:7            Up X minutes (healthy)
```

### 7. Seed Databases
```powershell
docker exec -it graphql_api sh
node src/scripts/seedAll.js
exit
```

---

## 🎯 Quick Commands Reference

```powershell
# Stop everything
docker-compose down

# Stop and remove volumes
docker-compose down -v

# Rebuild everything
docker-compose build --no-cache

# Start services
docker-compose up

# Start in background
docker-compose up -d

# Restart all services
docker-compose restart

# View logs
docker-compose logs -f

# Check status
docker ps

# Rebuild specific service
docker-compose build --no-cache api

# Restart specific service
docker-compose restart api
```

---

## ✅ After Restart - Verify Everything Works

1. **Check API Health:**
   ```powershell
   curl http://localhost:4000/health
   ```
   Or open: http://localhost:4000/health

2. **Check GraphQL:**
   Open: http://localhost:4000/graphql

3. **Check Frontend:**
   Open: http://localhost:3000

4. **Check Database Connection:**
   ```powershell
   docker exec -it graphql_api sh
   node -e "const {prisma} = require('./src/config/postgres.js'); prisma.user.findMany().then(console.log).catch(console.error)"
   ```

---

## 🐛 If Still Having Issues

### Check Docker Desktop
```powershell
docker version
docker ps
```

### Check Container Logs
```powershell
docker-compose logs api
docker-compose logs postgres
docker-compose logs mongodb
docker-compose logs frontend
```

### Check if Ports Are Available
```powershell
# Windows PowerShell
netstat -ano | findstr :4000
netstat -ano | findstr :3000
netstat -ano | findstr :5432
netstat -ano | findstr :27017
```

---

## 💡 Pro Tips

1. **Always use `--no-cache`** when rebuilding after Dockerfile changes
2. **Use `-v` flag** with `down` to remove volumes for fresh database
3. **Check logs immediately** after starting to catch errors early
4. **Use detached mode (`-d`)** for background operation
5. **Verify services** with `docker ps` before seeding

---

## 🎬 Complete Example Workflow

```powershell
# 1. Navigate to project
cd graphql

# 2. Clean everything
docker-compose down -v

# 3. Rebuild with no cache
docker-compose build --no-cache

# 4. Start in background
docker-compose up -d

# 5. Watch logs
docker-compose logs -f api

# 6. In another terminal, seed databases
docker exec -it graphql_api sh
node src/scripts/seedAll.js
exit

# 7. Verify
curl http://localhost:4000/health
# Open http://localhost:3000 in browser
```


# Setup Checklist - Step by Step

## ✅ Prerequisites Check

- [ ] Docker Desktop is installed and running
- [ ] Docker Desktop shows "Docker Desktop is running" in system tray
- [ ] You have navigated to the `graphql` folder

## 🚀 Step-by-Step Setup

### Step 1: Verify Docker is Running

```powershell
docker --version
docker ps
```

**Expected:** Should show Docker version and running containers (may be empty)

**If error:** Start Docker Desktop application

---

### Step 2: Clean Previous Builds (Optional but Recommended)

```powershell
cd graphql
docker-compose down -v
```

This removes any old containers and volumes.

---

### Step 3: Build and Start All Services

```powershell
docker-compose up --build
```

**What happens:**
1. Downloads PostgreSQL and MongoDB images (first time only)
2. Builds backend Docker image with OpenSSL
3. Builds frontend Docker image
4. Starts all services
5. Runs Prisma migrations
6. Connects to databases

**Expected output:**
```
✅ Creating network "graphql_graphql_network"...
✅ Creating volume "graphql_postgres_data"...
✅ Creating volume "graphql_mongodb_data"...
✅ Building api...
✅ Installing OpenSSL...
✅ Generating Prisma Client...
✅ Starting graphql_postgres...
✅ Starting graphql_mongodb...
✅ Starting graphql_api...
✅ Starting graphql_frontend...
✅ Connected to MongoDB
🚀 Server running on http://localhost:4000
```

**Wait for:** All services to show "healthy" status

---

### Step 4: Seed the Databases

**Open a NEW terminal/PowerShell window** (keep the first one running)

```powershell
# Connect to the API container
docker exec -it graphql_api sh

# Run the seed script
node src/scripts/seedAll.js

# You should see:
# ✅ Created 4 users
# ✅ Created 8 products
# ✅ Created 5 orders
# ✅ Created 7 reviews

# Exit the container
exit
```

---

### Step 5: Verify Everything is Working

1. **Check API Health:**
   - Open browser: http://localhost:4000/health
   - Should show: `{"status":"ok","timestamp":"..."}`

2. **Check GraphQL Playground:**
   - Open browser: http://localhost:4000/graphql
   - Should see GraphQL Playground interface

3. **Check Frontend:**
   - Open browser: http://localhost:3000
   - Should see the GraphQL Learning Project homepage

---

### Step 6: Test the Application

1. **Frontend UI:**
   - Navigate to Users page
   - Create a new user
   - Edit or delete a user
   - Do the same for Products and Orders

2. **GraphQL Playground:**
   - Try this query:
   ```graphql
   query {
     users {
       users {
         id
         name
         email
         orderCount
       }
     }
   }
   ```

---

## 🐛 Troubleshooting

### If Services Won't Start

```powershell
# Check Docker logs
docker-compose logs api
docker-compose logs postgres
docker-compose logs mongodb

# Restart services
docker-compose restart

# Full reset (removes all data)
docker-compose down -v
docker-compose up --build
```

### If Prisma Still Has Issues

```powershell
# Rebuild just the API container
docker-compose build --no-cache api
docker-compose up api
```

### If Ports Are Busy

- Check what's using ports: `netstat -ano | findstr :4000`
- Stop conflicting services
- Or change ports in `docker-compose.yml`

---

## ✅ Success Indicators

When everything is working, you should see:

1. **All containers running:**
   ```powershell
   docker ps
   # Should show 4 containers: postgres, mongodb, api, frontend
   ```

2. **API responds:**
   - http://localhost:4000/health → `{"status":"ok"}`

3. **GraphQL works:**
   - http://localhost:4000/graphql → GraphQL Playground loads

4. **Frontend loads:**
   - http://localhost:3000 → React app loads

5. **Database has data:**
   - Frontend shows users, products, orders
   - GraphQL queries return data

---

## 📝 Next Steps After Setup

1. **Explore GraphQL Queries** in the Playground
2. **Try Mutations** to create/update/delete data
3. **Test Relationships** - query user with orders and products
4. **Explore the Code** - understand how resolvers work
5. **Customize** - add your own types and queries

---

## 🎯 Common Commands

```powershell
# Start services
docker-compose up

# Stop services
docker-compose down

# View logs
docker-compose logs -f

# Restart a service
docker-compose restart api

# Rebuild everything
docker-compose down -v
docker-compose up --build
```


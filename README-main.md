# Full-Stack GraphQL Learning Project

A comprehensive learning project for understanding GraphQL deeply, featuring a full-stack application with Node.js, PostgreSQL, MongoDB, Docker, and React.

## 📚 Project Overview

This project demonstrates:
- **Backend**: Node.js with Apollo Server, Express.js, Prisma (PostgreSQL), and Mongoose (MongoDB)
- **Frontend**: React with Vite, TypeScript, Apollo Client, and TailwindCSS
- **Infrastructure**: Docker Compose for easy setup
- **Features**: Full CRUD operations, relationships, pagination, filtering, sorting, and complex queries

## 🗂️ Project Structure

```
.
├── graphql/                # Main project directory
│   ├── backend/            # Node.js GraphQL API Server
│   │   ├── src/
│   │   │   ├── config/     # Database configurations
│   │   │   ├── models/     # MongoDB Mongoose models
│   │   │   ├── graphql/    # GraphQL schema and resolvers
│   │   │   ├── scripts/    # Seed scripts
│   │   │   └── index.js    # Server entry point
│   │   ├── prisma/         # Prisma schema for PostgreSQL
│   │   ├── Dockerfile
│   │   └── package.json
│   ├── frontend/           # React frontend application
│   │   ├── src/
│   │   │   ├── pages/      # React pages/components
│   │   │   ├── apollo/     # Apollo Client configuration
│   │   │   └── App.tsx     # Main App component
│   │   └── package.json
│   ├── docker-compose.yml  # Docker Compose configuration
│   └── README.md           # This file
```

## 🚀 Quick Start

### Prerequisites

- Docker and Docker Compose installed
- Node.js 18+ and npm (for local development)
- Git

### Option 1: Using Docker Compose (Recommended)

1. **Clone or navigate to the project directory**

2. **Navigate to the graphql folder:**
   ```bash
   cd graphql
   ```

3. **Start all services with Docker Compose:**
   ```bash
   docker-compose up --build
   ```

   This will:
   - Start PostgreSQL database
   - Start MongoDB database
   - Build and start the Node.js API server
   - Run Prisma migrations
   - Wait for databases to be healthy

3. **Seed the databases (in a new terminal):**
   ```bash
   # Connect to the API container
   docker exec -it graphql_api sh
   
   # Run the complete seed script
   node src/scripts/seedAll.js
   ```

4. **Access the services:**
   - GraphQL API: http://localhost:4000/graphql
   - GraphQL Playground: http://localhost:4000/graphql (Apollo Studio)
   - PostgreSQL: localhost:5432
   - MongoDB: localhost:27017

5. **Start the frontend (in a new terminal):**
   ```bash
   cd graphql/frontend
   npm install
   npm run dev
   ```

   Frontend will be available at: http://localhost:3000

### Option 2: Local Development (Without Docker)

#### Backend Setup

1. **Install PostgreSQL and MongoDB locally**
   - PostgreSQL: https://www.postgresql.org/download/
   - MongoDB: https://www.mongodb.com/try/download/community

2. **Navigate to backend directory:**
   ```bash
   cd graphql/backend
   ```

3. **Install dependencies:**
   ```bash
   npm install
   ```

4. **Create `.env` file:**
   ```bash
   cp .env.example .env
   ```

   Update the `.env` file with your database credentials:
   ```env
   PORT=4000
   NODE_ENV=development
   DATABASE_URL="postgresql://your_user:your_password@localhost:5432/graphql_db?schema=public"
   MONGODB_URI="mongodb://your_user:your_password@localhost:27017/graphql_db?authSource=admin"
   ```

5. **Run Prisma migrations:**
   ```bash
   npx prisma migrate dev --name init
   ```

6. **Generate Prisma Client:**
   ```bash
   npx prisma generate
   ```

7. **Seed databases:**
   ```bash
   # Seed both databases with relationships
   node src/scripts/seedAll.js
   ```

8. **Start the server:**
   ```bash
   npm run dev
   ```

#### Frontend Setup

1. **Navigate to frontend directory:**
   ```bash
   cd graphql/frontend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start the development server:**
   ```bash
   npm run dev
   ```

## 📊 Database Schema

### PostgreSQL (Users & Orders)

**Users Table:**
- id (UUID)
- email (String, unique)
- name (String)
- age (Int, optional)
- createdAt, updatedAt (DateTime)

**Orders Table:**
- id (UUID)
- userId (Foreign Key → Users)
- productId (String, references MongoDB)
- total (Float)
- status (String: pending, completed, cancelled)
- createdAt, updatedAt (DateTime)

### MongoDB (Products & Reviews)

**Products Collection:**
- _id (ObjectId)
- name, description (String)
- price (Number)
- category (String: electronics, clothing, food, books, other)
- stock (Number)
- isActive (Boolean)
- createdAt, updatedAt (DateTime)

**Reviews Collection:**
- _id (ObjectId)
- productId (String, references Products)
- userId (String, references PostgreSQL Users)
- userName (String)
- rating (Number: 1-5)
- comment (String)
- createdAt, updatedAt (DateTime)

## 🔍 GraphQL API Examples

### Queries

#### 1. Get List of Users with Pagination

```graphql
query GetUsers($page: Int, $limit: Int) {
  users(page: $page, limit: $limit) {
    users {
      id
      email
      name
      age
      orderCount
      createdAt
    }
    pagination {
      page
      limit
      total
      totalPages
      hasNextPage
      hasPreviousPage
    }
  }
}
```

**Variables:**
```json
{
  "page": 1,
  "limit": 10
}
```

#### 2. Get Order History by User

```graphql
query GetUserOrders($userId: ID!) {
  ordersByUser(userId: $userId) {
    id
    total
    status
    createdAt
    product {
      id
      name
      price
      category
    }
    user {
      name
      email
    }
  }
}
```

**Variables:**
```json
{
  "userId": "user-uuid-here"
}
```

#### 3. Get Products with Filters and Sorting

```graphql
query GetProducts(
  $page: Int
  $limit: Int
  $filter: ProductFilterInput
  $sort: ProductSortInput
) {
  products(page: $page, limit: $limit, filter: $filter, sort: $sort) {
    products {
      id
      name
      description
      price
      category
      stock
      isActive
      reviewCount
      averageRating
    }
    pagination {
      page
      limit
      total
      totalPages
    }
  }
}
```

**Variables:**
```json
{
  "page": 1,
  "limit": 10,
  "filter": {
    "category": "electronics",
    "minPrice": 100,
    "maxPrice": 1000,
    "isActive": true,
    "search": "laptop"
  },
  "sort": {
    "field": "price",
    "order": "ASC"
  }
}
```

#### 4. Get Product Details with Reviews

```graphql
query GetProductWithReviews($id: ID!) {
  product(id: $id) {
    id
    name
    description
    price
    category
    stock
    reviewCount
    averageRating
    reviews {
      id
      userName
      rating
      comment
      createdAt
      user {
        id
        name
        email
      }
    }
  }
}
```

**Variables:**
```json
{
  "id": "product-id-here"
}
```

#### 5. Complex Query: User with Orders and Product Information

```graphql
query GetUserWithOrdersAndProducts($userId: ID!) {
  user(id: $userId) {
    id
    name
    email
    age
    orders {
      id
      total
      status
      createdAt
      product {
        id
        name
        price
        category
        description
        reviewCount
        averageRating
      }
    }
    orderCount
  }
}
```

**Variables:**
```json
{
  "userId": "user-uuid-here"
}
```

### Mutations

#### 1. Create User

```graphql
mutation CreateUser($input: CreateUserInput!) {
  createUser(input: $input) {
    id
    email
    name
    age
    createdAt
  }
}
```

**Variables:**
```json
{
  "input": {
    "email": "john@example.com",
    "name": "John Doe",
    "age": 28
  }
}
```

#### 2. Update User

```graphql
mutation UpdateUser($id: ID!, $input: UpdateUserInput!) {
  updateUser(id: $id, input: $input) {
    id
    email
    name
    age
    updatedAt
  }
}
```

**Variables:**
```json
{
  "id": "user-uuid-here",
  "input": {
    "name": "John Updated",
    "age": 29
  }
}
```

#### 3. Delete User

```graphql
mutation DeleteUser($id: ID!) {
  deleteUser(id: $id)
}
```

**Variables:**
```json
{
  "id": "user-uuid-here"
}
```

#### 4. Create Product

```graphql
mutation CreateProduct($input: CreateProductInput!) {
  createProduct(input: $input) {
    id
    name
    description
    price
    category
    stock
    isActive
  }
}
```

**Variables:**
```json
{
  "input": {
    "name": "New Laptop",
    "description": "High-performance laptop",
    "price": 1299.99,
    "category": "electronics",
    "stock": 50
  }
}
```

#### 5. Create Review for Product

```graphql
mutation CreateReview($input: CreateReviewInput!) {
  createReview(input: $input) {
    id
    productId
    userId
    userName
    rating
    comment
    createdAt
    product {
      id
      name
      averageRating
    }
  }
}
```

**Variables:**
```json
{
  "input": {
    "productId": "product-id-here",
    "userId": "user-uuid-here",
    "userName": "John Doe",
    "rating": 5,
    "comment": "Excellent product! Highly recommended."
  }
}
```

#### 6. Create Order (Links User to Product)

```graphql
mutation CreateOrder($input: CreateOrderInput!) {
  createOrder(input: $input) {
    id
    userId
    productId
    total
    status
    createdAt
    user {
      name
      email
    }
    product {
      name
      price
      category
    }
  }
}
```

**Variables:**
```json
{
  "input": {
    "userId": "user-uuid-here",
    "productId": "product-id-here",
    "total": 1299.99,
    "status": "pending"
  }
}
```

## 🧪 Testing the API

### Using GraphQL Playground

1. Navigate to http://localhost:4000/graphql
2. You'll see the GraphQL Playground interface
3. Try the queries and mutations above
4. Use the Schema tab to explore available types

### Using Postman

1. Create a new POST request
2. URL: `http://localhost:4000/graphql`
3. Headers: `Content-Type: application/json`
4. Body (select GraphQL or raw JSON):
   ```json
   {
     "query": "query { users { users { id name email } } }"
   }
   ```

### Using cURL

```bash
curl -X POST http://localhost:4000/graphql \
  -H "Content-Type: application/json" \
  -d '{
    "query": "query { users { users { id name email } } }"
  }'
```

## 🎨 Frontend Pages

### Users Page (`/users`)
- View all users with pagination
- Create new users
- Edit existing users
- Delete users
- View order count per user

### Products Page (`/products`)
- View all products with pagination
- Filter by category and search
- Sort by price, name, etc.
- Create, edit, and delete products
- View product details and reviews

### Product Details Page (`/products/:id`)
- View full product information
- See all reviews for the product
- Add new reviews
- View average rating

### Orders Page (`/orders`)
- View all orders with pagination
- Filter by status and user
- Create new orders linking users to products
- Edit order status
- Delete orders
- See cross-database relationships (User → Order → Product)

## 🔧 Available Scripts

### Backend (from `graphql/backend` directory)

```bash
npm run dev          # Start development server with nodemon
npm start            # Start production server
npm run prisma:generate    # Generate Prisma Client
npm run prisma:migrate     # Run database migrations
npm run prisma:seed        # Seed PostgreSQL
npm run mongo:seed         # Seed MongoDB
npm run seed:all           # Seed both databases
```

### Frontend (from `graphql/frontend` directory)

```bash
npm run dev          # Start Vite development server
npm run build        # Build for production
npm run preview      # Preview production build
```

## 📝 Key Learning Concepts

### 1. GraphQL Schema Design
- Type definitions
- Input types for mutations
- Enum types
- Scalar types (DateTime)
- Relationships and nested queries

### 2. Resolvers
- Query resolvers (data fetching)
- Mutation resolvers (data modification)
- Field resolvers (relationship resolution)
- Type resolvers (computed fields)

### 3. Cross-Database Relationships
- PostgreSQL Users → PostgreSQL Orders
- PostgreSQL Orders → MongoDB Products
- MongoDB Products → MongoDB Reviews
- MongoDB Reviews → PostgreSQL Users

### 4. Advanced Features
- Pagination (cursor-based and offset-based)
- Filtering (multiple criteria)
- Sorting (ascending/descending)
- Complex nested queries

### 5. Apollo Client
- Query hooks (`useQuery`)
- Mutation hooks (`useMutation`)
- Cache management
- Loading and error states

## 🐳 Docker Services

The project includes three Docker services:

1. **postgres** - PostgreSQL 15 database
2. **mongodb** - MongoDB 7 database
3. **api** - Node.js GraphQL API server

All services are connected via a Docker network for easy communication.

## 📚 Additional Resources

- [GraphQL Documentation](https://graphql.org/learn/)
- [Apollo Server Documentation](https://www.apollographql.com/docs/apollo-server/)
- [Apollo Client Documentation](https://www.apollographql.com/docs/react/)
- [Prisma Documentation](https://www.prisma.io/docs/)
- [Mongoose Documentation](https://mongoosejs.com/docs/)

## 🐛 Troubleshooting

### Database Connection Issues

1. **Check if databases are running:**
   ```bash
   docker-compose ps
   ```

2. **Check database logs:**
   ```bash
   docker-compose logs postgres
   docker-compose logs mongodb
   ```

3. **Reset databases:**
   ```bash
   docker-compose down -v  # Removes volumes
   docker-compose up --build
   ```

### Prisma Migration Issues

```bash
# Reset Prisma migrations
cd graphql/backend
npx prisma migrate reset
npx prisma migrate dev --name init
```

### Port Already in Use

If port 4000 or 3000 is already in use:
- Change the port in `backend/.env` (PORT)
- Change the port in `frontend/vite.config.ts` (server.port)

## 📄 License

This is a learning project. Feel free to use it for educational purposes.

---

**Happy Learning! 🚀**

For questions or issues, please refer to the code comments which explain each concept in detail.


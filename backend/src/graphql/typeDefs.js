import { gql } from 'graphql-tag';

/**
 * GraphQL Type Definitions
 * This file contains all the GraphQL schema types, queries, and mutations
 * 
 * Schema Structure:
 * - Types: User, Order, Product, Review
 * - Input Types: For mutations (CreateUserInput, UpdateUserInput, etc.)
 * - Queries: Read operations
 * - Mutations: Create, Update, Delete operations
 */

export const typeDefs = gql`
  # ==================== SCALAR TYPES ====================
  scalar DateTime

  # ==================== MAIN TYPES ====================
  
  type User {
    id: ID!
    email: String!
    name: String!
    age: Int
    createdAt: DateTime!
    updatedAt: DateTime!
    # Nested relationship: Get all orders for this user
    orders: [Order!]
    # Computed field: Get order count
    orderCount: Int
  }

  type Order {
    id: ID!
    userId: String!
    total: Float!
    status: String!
    createdAt: DateTime!
    updatedAt: DateTime!
    # Relationship: Get the user who made this order
    user: User!
    # Cross-database relationship: Get product from MongoDB
    product: Product
    # Reference to MongoDB product ID
    productId: String!
  }

  type Product {
    id: ID!
    name: String!
    description: String
    price: Float!
    category: String!
    stock: Int!
    isActive: Boolean!
    createdAt: DateTime!
    updatedAt: DateTime!
    # Nested relationship: Get all reviews for this product
    reviews: [Review!]
    # Computed field: Get average rating
    averageRating: Float
    # Computed field: Get review count
    reviewCount: Int
  }

  type Review {
    id: ID!
    productId: String!
    userId: String!
    userName: String!
    rating: Int!
    comment: String
    createdAt: DateTime!
    updatedAt: DateTime!
    # Relationship: Get the product this review is for
    product: Product
    # Relationship: Get user from PostgreSQL (if needed)
    user: User
  }

  # ==================== INPUT TYPES ====================
  
  input CreateUserInput {
    email: String!
    name: String!
    age: Int
  }

  input UpdateUserInput {
    email: String
    name: String
    age: Int
  }

  input CreateOrderInput {
    userId: String!
    productId: String!
    total: Float!
    status: String
  }

  input UpdateOrderInput {
    total: Float
    status: String
    productId: String
  }

  input CreateProductInput {
    name: String!
    description: String
    price: Float!
    category: String!
    stock: Int
  }

  input UpdateProductInput {
    name: String
    description: String
    price: Float
    category: String
    stock: Int
    isActive: Boolean
  }

  input CreateReviewInput {
    productId: String!
    userId: String!
    userName: String!
    rating: Int!
    comment: String
  }

  input UpdateReviewInput {
    rating: Int
    comment: String
  }

  # ==================== FILTER INPUTS ====================
  
  input ProductFilterInput {
    category: String
    minPrice: Float
    maxPrice: Float
    isActive: Boolean
    search: String
  }

  input OrderFilterInput {
    userId: String
    status: String
    minTotal: Float
    maxTotal: Float
  }

  # ==================== SORT INPUTS ====================
  
  enum SortOrder {
    ASC
    DESC
  }

  input ProductSortInput {
    field: String! # price, createdAt, name
    order: SortOrder!
  }

  input OrderSortInput {
    field: String! # total, createdAt
    order: SortOrder!
  }

  # ==================== PAGINATION ====================
  
  type PaginationInfo {
    page: Int!
    limit: Int!
    total: Int!
    totalPages: Int!
    hasNextPage: Boolean!
    hasPreviousPage: Boolean!
  }

  type ProductConnection {
    products: [Product!]!
    pagination: PaginationInfo!
  }

  type OrderConnection {
    orders: [Order!]!
    pagination: PaginationInfo!
  }

  type UserConnection {
    users: [User!]!
    pagination: PaginationInfo!
  }

  # ==================== QUERIES ====================
  
  type Query {
    # User queries
    users(page: Int = 1, limit: Int = 10): UserConnection!
    user(id: ID!): User
    userByEmail(email: String!): User

    # Order queries
    orders(page: Int = 1, limit: Int = 10, filter: OrderFilterInput): OrderConnection!
    order(id: ID!): Order
    ordersByUser(userId: ID!): [Order!]!

    # Product queries
    products(
      page: Int = 1
      limit: Int = 10
      filter: ProductFilterInput
      sort: ProductSortInput
    ): ProductConnection!
    product(id: ID!): Product
    productsByCategory(category: String!): [Product!]!

    # Review queries
    reviews(productId: ID!): [Review!]!
    review(id: ID!): Review
  }

  # ==================== MUTATIONS ====================
  
  type Mutation {
    # User mutations
    createUser(input: CreateUserInput!): User!
    updateUser(id: ID!, input: UpdateUserInput!): User!
    deleteUser(id: ID!): Boolean!

    # Order mutations
    createOrder(input: CreateOrderInput!): Order!
    updateOrder(id: ID!, input: UpdateOrderInput!): Order!
    deleteOrder(id: ID!): Boolean!

    # Product mutations
    createProduct(input: CreateProductInput!): Product!
    updateProduct(id: ID!, input: UpdateProductInput!): Product!
    deleteProduct(id: ID!): Boolean!

    # Review mutations
    createReview(input: CreateReviewInput!): Review!
    updateReview(id: ID!, input: UpdateReviewInput!): Review!
    deleteReview(id: ID!): Boolean!
  }
`;


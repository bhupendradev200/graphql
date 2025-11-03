import { PrismaClient } from '@prisma/client';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { connectMongoDB } from '../config/mongodb.js';
import { Product } from '../models/Product.js';
import { Review as ReviewModel } from '../models/Review.js';

dotenv.config();

const prisma = new PrismaClient();

/**
 * Complete seed script that seeds both PostgreSQL and MongoDB
 * and creates proper relationships between them
 */

async function seedAll() {
  console.log('🌱 Seeding both PostgreSQL and MongoDB databases...\n');

  try {
    // Connect to MongoDB
    await connectMongoDB();
    console.log('✅ Connected to MongoDB\n');

    // Clear all existing data
    console.log('🗑️  Clearing existing data...');
    await prisma.order.deleteMany();
    await prisma.user.deleteMany();
    await Product.deleteMany({});
    await ReviewModel.deleteMany({});

    // ==================== SEED POSTGRESQL ====================
    console.log('👥 Creating users in PostgreSQL...');
    const users = await Promise.all([
      prisma.user.create({
        data: {
          email: 'alice@example.com',
          name: 'Alice Johnson',
          age: 28,
        },
      }),
      prisma.user.create({
        data: {
          email: 'bob@example.com',
          name: 'Bob Smith',
          age: 35,
        },
      }),
      prisma.user.create({
        data: {
          email: 'charlie@example.com',
          name: 'Charlie Brown',
          age: 22,
        },
      }),
      prisma.user.create({
        data: {
          email: 'diana@example.com',
          name: 'Diana Prince',
          age: 30,
        },
      }),
    ]);
    console.log(`✅ Created ${users.length} users\n`);

    // ==================== SEED MONGODB ====================
    console.log('📦 Creating products in MongoDB...');
    const products = await Product.insertMany([
      {
        name: 'Laptop Pro 15',
        description: 'High-performance laptop with 16GB RAM and 512GB SSD',
        price: 1299.99,
        category: 'electronics',
        stock: 50,
        isActive: true,
      },
      {
        name: 'Wireless Headphones',
        description: 'Premium noise-canceling wireless headphones',
        price: 299.99,
        category: 'electronics',
        stock: 100,
        isActive: true,
      },
      {
        name: 'Smartphone X',
        description: 'Latest smartphone with advanced camera system',
        price: 899.99,
        category: 'electronics',
        stock: 75,
        isActive: true,
      },
      {
        name: 'Cotton T-Shirt',
        description: 'Comfortable 100% cotton t-shirt',
        price: 19.99,
        category: 'clothing',
        stock: 200,
        isActive: true,
      },
      {
        name: 'Designer Jeans',
        description: 'Premium denim jeans with perfect fit',
        price: 79.99,
        category: 'clothing',
        stock: 150,
        isActive: true,
      },
      {
        name: 'GraphQL Complete Guide',
        description: 'Comprehensive guide to GraphQL development',
        price: 39.99,
        category: 'books',
        stock: 80,
        isActive: true,
      },
      {
        name: 'Organic Coffee Beans',
        description: 'Premium organic coffee beans, 1kg pack',
        price: 24.99,
        category: 'food',
        stock: 300,
        isActive: true,
      },
      {
        name: 'Tablet Air',
        description: 'Lightweight tablet for work and entertainment',
        price: 599.99,
        category: 'electronics',
        stock: 60,
        isActive: true,
      },
    ]);
    console.log(`✅ Created ${products.length} products\n`);

    // ==================== CREATE ORDERS ====================
    console.log('🛒 Creating orders in PostgreSQL...');
    const orders = await Promise.all([
      prisma.order.create({
        data: {
          userId: users[0].id, // Alice
          productId: products[0]._id.toString(), // Laptop Pro 15
          total: 1299.99,
          status: 'completed',
        },
      }),
      prisma.order.create({
        data: {
          userId: users[0].id, // Alice
          productId: products[1]._id.toString(), // Wireless Headphones
          total: 299.99,
          status: 'completed',
        },
      }),
      prisma.order.create({
        data: {
          userId: users[1].id, // Bob
          productId: products[2]._id.toString(), // Smartphone X
          total: 899.99,
          status: 'pending',
        },
      }),
      prisma.order.create({
        data: {
          userId: users[2].id, // Charlie
          productId: products[3]._id.toString(), // Cotton T-Shirt
          total: 19.99,
          status: 'completed',
        },
      }),
      prisma.order.create({
        data: {
          userId: users[3].id, // Diana
          productId: products[6]._id.toString(), // Organic Coffee Beans
          total: 24.99,
          status: 'completed',
        },
      }),
    ]);
    console.log(`✅ Created ${orders.length} orders\n`);

    // ==================== CREATE REVIEWS ====================
    console.log('⭐ Creating reviews in MongoDB...');
    const reviews = await ReviewModel.insertMany([
      {
        productId: products[0]._id.toString(), // Laptop Pro 15
        userId: users[0].id, // Alice
        userName: users[0].name,
        rating: 5,
        comment: 'Excellent laptop! Fast and reliable. Highly recommended!',
      },
      {
        productId: products[0]._id.toString(), // Laptop Pro 15
        userId: users[1].id, // Bob
        userName: users[1].name,
        rating: 4,
        comment: 'Great performance, but battery could be better.',
      },
      {
        productId: products[1]._id.toString(), // Wireless Headphones
        userId: users[0].id, // Alice
        userName: users[0].name,
        rating: 5,
        comment: 'Amazing sound quality! Best headphones I\'ve owned.',
      },
      {
        productId: products[1]._id.toString(), // Wireless Headphones
        userId: users[2].id, // Charlie
        userName: users[2].name,
        rating: 5,
        comment: 'Perfect for daily use. Comfortable and durable.',
      },
      {
        productId: products[2]._id.toString(), // Smartphone X
        userId: users[1].id, // Bob
        userName: users[1].name,
        rating: 4,
        comment: 'Good camera and display. Battery life is decent.',
      },
      {
        productId: products[3]._id.toString(), // Cotton T-Shirt
        userId: users[2].id, // Charlie
        userName: users[2].name,
        rating: 5,
        comment: 'Very comfortable and good quality fabric.',
      },
      {
        productId: products[6]._id.toString(), // Organic Coffee Beans
        userId: users[3].id, // Diana
        userName: users[3].name,
        rating: 5,
        comment: 'Delicious coffee! Rich flavor and aroma.',
      },
    ]);
    console.log(`✅ Created ${reviews.length} reviews\n`);

    // ==================== SUMMARY ====================
    console.log('📊 Seeding Summary:');
    console.log('─────────────────────────────────────');
    console.log(`   PostgreSQL Users: ${users.length}`);
    console.log(`   PostgreSQL Orders: ${orders.length}`);
    console.log(`   MongoDB Products: ${products.length}`);
    console.log(`   MongoDB Reviews: ${reviews.length}`);
    console.log('─────────────────────────────────────\n');
    console.log('✅ All databases seeded successfully!\n');
    console.log('💡 You can now start the GraphQL server and test queries.');
  } catch (error) {
    console.error('❌ Error seeding databases:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
    await mongoose.connection.close();
    process.exit(0);
  }
}

seedAll();


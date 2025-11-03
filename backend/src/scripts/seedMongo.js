import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { connectMongoDB } from '../config/mongodb.js';
import { Product } from '../models/Product.js';
import { Review as ReviewModel } from '../models/Review.js';

dotenv.config();

/**
 * Seed script for MongoDB
 * This populates MongoDB with sample Products and Reviews
 * Make sure MongoDB is running before executing this script
 */

async function seed() {
  console.log('🌱 Seeding MongoDB database...');

  try {
    // Connect to MongoDB
    await connectMongoDB();

    // Clear existing data
    console.log('🗑️  Clearing existing data...');
    await Product.deleteMany({});
      await ReviewModel.deleteMany({});

    // Create sample products
    console.log('📦 Creating products...');
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

    console.log(`✅ Created ${products.length} products`);

    // Get some user IDs from PostgreSQL (these should match seeded users)
    // For demonstration, we'll use placeholder user IDs
    // In a real scenario, you'd fetch these from PostgreSQL first
    
    // Note: These userIds should match the users created in seedPostgres.js
    // Since we're seeding MongoDB separately, we'll use example user IDs
    // After running seedPostgres, you can update these with actual user IDs from PostgreSQL
    
    console.log('💡 Note: Reviews reference PostgreSQL user IDs.');
    console.log('💡 Create reviews via GraphQL mutations with actual user IDs.');

    // Create some sample reviews
    // We'll create a few reviews with placeholder userIds
    // You can update these after users are created in PostgreSQL
    const sampleUserIds = [
      'placeholder-user-1',
      'placeholder-user-2',
      'placeholder-user-3',
    ];

    if (products.length > 0) {
      const reviews = await ReviewModel.insertMany([
        {
          productId: products[0]._id.toString(),
          userId: sampleUserIds[0],
          userName: 'Alice Johnson',
          rating: 5,
          comment: 'Excellent laptop! Fast and reliable.',
        },
        {
          productId: products[0]._id.toString(),
          userId: sampleUserIds[1],
          userName: 'Bob Smith',
          rating: 4,
          comment: 'Great performance, but battery could be better.',
        },
        {
          productId: products[1]._id.toString(),
          userId: sampleUserIds[0],
          userName: 'Alice Johnson',
          rating: 5,
          comment: 'Amazing sound quality!',
        },
        {
          productId: products[2]._id.toString(),
          userId: sampleUserIds[2],
          userName: 'Charlie Brown',
          rating: 4,
          comment: 'Good camera and display.',
        },
      ]);

      console.log(`✅ Created ${reviews.length} reviews`);
    }

    console.log('\n📊 Sample Data Summary:');
    console.log(`   Products: ${products.length}`);
    console.log(`   Reviews: ${(await ReviewModel.countDocuments())}`);
    console.log('\n✅ MongoDB seeding completed!');
    console.log('\n💡 Next Steps:');
    console.log('   1. Run PostgreSQL seed: npm run prisma:seed');
    console.log('   2. Update orders and reviews with actual user/product IDs via GraphQL mutations');
    console.log('   3. Or use the full seed script that creates relationships automatically');
  } catch (error) {
    console.error('❌ Error seeding MongoDB:', error);
    throw error;
  } finally {
    await mongoose.connection.close();
    process.exit(0);
  }
}

seed();


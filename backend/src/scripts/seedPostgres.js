import { PrismaClient } from '@prisma/client';
import dotenv from 'dotenv';

dotenv.config();

const prisma = new PrismaClient();

/**
 * Seed script for PostgreSQL
 * This populates the PostgreSQL database with sample Users and Orders
 * Run this after running migrations: npm run prisma:migrate
 */

async function seed() {
  console.log('🌱 Seeding PostgreSQL database...');

  try {
    // Clear existing data
    console.log('🗑️  Clearing existing data...');
    await prisma.order.deleteMany();
    await prisma.user.deleteMany();

    // Create sample users
    console.log('👥 Creating users...');
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

    console.log(`✅ Created ${users.length} users`);

    // Note: Orders will reference MongoDB products
    // We'll create orders after MongoDB is seeded
    // For now, we'll use placeholder productIds
    // After MongoDB seeding, you can update these with actual product IDs

    console.log('📦 Sample users created. Orders should be created after MongoDB products are seeded.');
    console.log('💡 Tip: Create orders via GraphQL mutations after products are seeded.');

    console.log('✅ PostgreSQL seeding completed!');
  } catch (error) {
    console.error('❌ Error seeding PostgreSQL:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

seed();


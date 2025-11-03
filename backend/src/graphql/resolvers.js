import { prisma } from '../config/postgres.js';
import { Product as ProductModel } from '../models/Product.js';
import { Review as ReviewModel } from '../models/Review.js';

/**
 * GraphQL Resolvers
 * Resolvers are functions that resolve the value for a field in your schema
 * 
 * Resolver Structure:
 * - Query resolvers: Fetch data
 * - Mutation resolvers: Modify data
 * - Field resolvers: Resolve nested relationships
 * - Type resolvers: Resolve specific type fields
 */

// ==================== HELPER FUNCTIONS ====================

/**
 * Calculate pagination info
 */
const getPaginationInfo = (page, limit, total) => {
  const totalPages = Math.ceil(total / limit);
  return {
    page,
    limit,
    total,
    totalPages,
    hasNextPage: page < totalPages,
    hasPreviousPage: page > 1,
  };
};

// ==================== QUERY RESOLVERS ====================

const Query = {
  // User Queries
  users: async (_, { page = 1, limit = 10 }) => {
    const skip = (page - 1) * limit;
    const [users, total] = await Promise.all([
      prisma.user.findMany({
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      prisma.user.count(),
    ]);

    return {
      users,
      pagination: getPaginationInfo(page, limit, total),
    };
  },

  user: async (_, { id }) => {
    return prisma.user.findUnique({
      where: { id },
    });
  },

  userByEmail: async (_, { email }) => {
    return prisma.user.findUnique({
      where: { email },
    });
  },

  // Order Queries
  orders: async (_, { page = 1, limit = 10, filter = {} }) => {
    const skip = (page - 1) * limit;
    
    // Build where clause based on filters
    const where = {};
    if (filter.userId) where.userId = filter.userId;
    if (filter.status) where.status = filter.status;
    if (filter.minTotal !== undefined) where.total = { gte: filter.minTotal };
    if (filter.maxTotal !== undefined) {
      where.total = { ...where.total, lte: filter.maxTotal };
    }

    const [orders, total] = await Promise.all([
      prisma.order.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      prisma.order.count({ where }),
    ]);

    return {
      orders,
      pagination: getPaginationInfo(page, limit, total),
    };
  },

  order: async (_, { id }) => {
    return prisma.order.findUnique({
      where: { id },
    });
  },

  ordersByUser: async (_, { userId }) => {
    return prisma.order.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });
  },

  // Product Queries
  products: async (_, { page = 1, limit = 10, filter = {}, sort }) => {
    const skip = (page - 1) * limit;

    // Build MongoDB query filter
    const mongoFilter = {};
    if (filter.category) mongoFilter.category = filter.category;
    if (filter.isActive !== undefined) mongoFilter.isActive = filter.isActive;
    if (filter.minPrice !== undefined || filter.maxPrice !== undefined) {
      mongoFilter.price = {};
      if (filter.minPrice !== undefined) mongoFilter.price.$gte = filter.minPrice;
      if (filter.maxPrice !== undefined) mongoFilter.price.$lte = filter.maxPrice;
    }
    if (filter.search) {
      mongoFilter.$or = [
        { name: { $regex: filter.search, $options: 'i' } },
        { description: { $regex: filter.search, $options: 'i' } },
      ];
    }

    // Build sort object
    let sortObj = { createdAt: -1 }; // Default sort
    if (sort) {
      sortObj = {};
      sortObj[sort.field] = sort.order === 'ASC' ? 1 : -1;
    }

    const [products, total] = await Promise.all([
      ProductModel.find(mongoFilter)
        .skip(skip)
        .limit(limit)
        .sort(sortObj)
        .lean(),
      ProductModel.countDocuments(mongoFilter),
    ]);

    // Convert MongoDB _id to id
    const formattedProducts = products.map((p) => ({
      ...p,
      id: p._id.toString(),
    }));

    return {
      products: formattedProducts,
      pagination: getPaginationInfo(page, limit, total),
    };
  },

  product: async (_, { id }) => {
    const product = await ProductModel.findById(id).lean();
    if (!product) return null;
    return {
      ...product,
      id: product._id.toString(),
    };
  },

  productsByCategory: async (_, { category }) => {
    const products = await ProductModel.find({ category, isActive: true }).lean();
    return products.map((p) => ({
      ...p,
      id: p._id.toString(),
    }));
  },

  // Review Queries
  reviews: async (_, { productId }) => {
    const reviews = await ReviewModel.find({ productId })
      .sort({ createdAt: -1 })
      .lean();
    return reviews.map((r) => ({
      ...r,
      id: r._id.toString(),
    }));
  },

  review: async (_, { id }) => {
    const review = await ReviewModel.findById(id).lean();
    if (!review) return null;
    return {
      ...review,
      id: review._id.toString(),
    };
  },
};

// ==================== MUTATION RESOLVERS ====================

const Mutation = {
  // User Mutations
  createUser: async (_, { input }) => {
    return prisma.user.create({
      data: input,
    });
  },

  updateUser: async (_, { id, input }) => {
    return prisma.user.update({
      where: { id },
      data: input,
    });
  },

  deleteUser: async (_, { id }) => {
    await prisma.user.delete({
      where: { id },
    });
    return true;
  },

  // Order Mutations
  createOrder: async (_, { input }) => {
    // Verify user exists
    const user = await prisma.user.findUnique({
      where: { id: input.userId },
    });
    if (!user) {
      throw new Error(`User with id ${input.userId} not found`);
    }

    // Verify product exists in MongoDB
    const product = await ProductModel.findById(input.productId);
    if (!product) {
      throw new Error(`Product with id ${input.productId} not found`);
    }

    return prisma.order.create({
      data: {
        userId: input.userId,
        productId: input.productId,
        total: input.total,
        status: input.status || 'pending',
      },
    });
  },

  updateOrder: async (_, { id, input }) => {
    // If productId is being updated, verify it exists
    if (input.productId) {
      const product = await ProductModel.findById(input.productId);
      if (!product) {
        throw new Error(`Product with id ${input.productId} not found`);
      }
    }

    return prisma.order.update({
      where: { id },
      data: input,
    });
  },

  deleteOrder: async (_, { id }) => {
    await prisma.order.delete({
      where: { id },
    });
    return true;
  },

  // Product Mutations
  createProduct: async (_, { input }) => {
    const product = await ProductModel.create(input);
    return {
      ...product.toObject(),
      id: product._id.toString(),
    };
  },

  updateProduct: async (_, { id, input }) => {
    const product = await ProductModel.findByIdAndUpdate(
      id,
      { $set: input },
      { new: true, runValidators: true }
    ).lean();
    if (!product) {
      throw new Error(`Product with id ${id} not found`);
    }
    return {
      ...product,
      id: product._id.toString(),
    };
  },

  deleteProduct: async (_, { id }) => {
    // Also delete all reviews for this product
    await ReviewModel.deleteMany({ productId: id });
    await ProductModel.findByIdAndDelete(id);
    return true;
  },

  // Review Mutations
  createReview: async (_, { input }) => {
    // Verify product exists
    const product = await ProductModel.findById(input.productId);
    if (!product) {
      throw new Error(`Product with id ${input.productId} not found`);
    }

    // Verify user exists in PostgreSQL
    const user = await prisma.user.findUnique({
      where: { id: input.userId },
    });
    if (!user) {
      throw new Error(`User with id ${input.userId} not found`);
    }

    const review = await ReviewModel.create(input);
    return {
      ...review.toObject(),
      id: review._id.toString(),
    };
  },

  updateReview: async (_, { id, input }) => {
    const review = await ReviewModel.findByIdAndUpdate(
      id,
      { $set: input },
      { new: true, runValidators: true }
    ).lean();
    if (!review) {
      throw new Error(`Review with id ${id} not found`);
    }
    return {
      ...review,
      id: review._id.toString(),
    };
  },

  deleteReview: async (_, { id }) => {
    await ReviewModel.findByIdAndDelete(id);
    return true;
  },
};

// ==================== TYPE RESOLVERS ====================

const User = {
  // Resolve orders relationship
  orders: async (parent) => {
    return prisma.order.findMany({
      where: { userId: parent.id },
      orderBy: { createdAt: 'desc' },
    });
  },

  // Computed field: Count orders
  orderCount: async (parent) => {
    return prisma.order.count({
      where: { userId: parent.id },
    });
  },
};

const Order = {
  // Resolve user relationship
  user: async (parent) => {
    return prisma.user.findUnique({
      where: { id: parent.userId },
    });
  },

  // Resolve product from MongoDB
  product: async (parent) => {
    const product = await ProductModel.findById(parent.productId).lean();
    if (!product) return null;
    return {
      ...product,
      id: product._id.toString(),
    };
  },
};

const Product = {
  // Resolve reviews relationship
  reviews: async (parent) => {
    const reviews = await ReviewModel.find({ productId: parent.id })
      .sort({ createdAt: -1 })
      .lean();
    return reviews.map((r) => ({
      ...r,
      id: r._id.toString(),
    }));
  },

  // Computed field: Calculate average rating
  averageRating: async (parent) => {
    const reviews = await ReviewModel.find({ productId: parent.id }).lean();
    if (reviews.length === 0) return null;
    const sum = reviews.reduce((acc, r) => acc + r.rating, 0);
    return parseFloat((sum / reviews.length).toFixed(2));
  },

  // Computed field: Count reviews
  reviewCount: async (parent) => {
    return ReviewModel.countDocuments({ productId: parent.id });
  },
};

const Review = {
  // Resolve product relationship
  product: async (parent) => {
    const product = await ProductModel.findById(parent.productId).lean();
    if (!product) return null;
    return {
      ...product,
      id: product._id.toString(),
    };
  },

  // Resolve user from PostgreSQL
  user: async (parent) => {
    return prisma.user.findUnique({
      where: { id: parent.userId },
    });
  },
};

// DateTime scalar resolver
const DateTime = {
  parseValue: (value) => new Date(value),
  serialize: (value) => value.toISOString(),
  parseLiteral: (ast) => new Date(ast.value),
};

// ==================== EXPORT RESOLVERS ====================

export const resolvers = {
  Query,
  Mutation,
  User,
  Order,
  Product,
  Review,
  DateTime,
};


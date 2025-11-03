import mongoose from 'mongoose';

/**
 * Review Schema for MongoDB
 * Reviews are linked to Products via productId
 * This shows nested relationships in GraphQL
 */
const reviewSchema = new mongoose.Schema(
  {
    productId: {
      type: String,
      required: true,
      index: true, // Index for faster queries
    },
    userId: {
      type: String,
      required: true,
      // This references a User ID from PostgreSQL
      // Demonstrating cross-database relationships
    },
    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },
    comment: {
      type: String,
      default: '',
      maxlength: 1000,
    },
    userName: {
      type: String,
      required: true,
      // Store user name for easy access (denormalization)
    },
  },
  {
    timestamps: true, // Adds createdAt and updatedAt automatically
  }
);

// Create compound index for efficient queries
reviewSchema.index({ productId: 1, createdAt: -1 });
reviewSchema.index({ userId: 1 });

export const Review = mongoose.model('Review', reviewSchema);


import { useParams } from 'react-router-dom';
import { useQuery, useMutation, gql } from '@apollo/client';
import { useState } from 'react';
import { Link } from 'react-router-dom';

/**
 * GraphQL Queries and Mutations for Product Details and Reviews
 */
const GET_PRODUCT = gql`
  query GetProduct($id: ID!) {
    product(id: $id) {
      id
      name
      description
      price
      category
      stock
      isActive
      reviewCount
      averageRating
      reviews {
        id
        userId
        userName
        rating
        comment
        createdAt
      }
    }
  }
`;

const GET_USERS = gql`
  query GetUsers {
    users(page: 1, limit: 100) {
      users {
        id
        name
        email
      }
    }
  }
`;

const CREATE_REVIEW = gql`
  mutation CreateReview($input: CreateReviewInput!) {
    createReview(input: $input) {
      id
      rating
      comment
      userName
      createdAt
    }
  }
`;

interface Review {
  id: string;
  userId: string;
  userName: string;
  rating: number;
  comment?: string;
  createdAt: string;
}

function ProductDetails() {
  const { id } = useParams<{ id: string }>();
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [reviewForm, setReviewForm] = useState({
    userId: '',
    rating: '5',
    comment: '',
  });

  // Fetch product with reviews
  const { data, loading, error, refetch } = useQuery(GET_PRODUCT, {
    variables: { id },
  });

  // Fetch users for review form
  const { data: usersData } = useQuery(GET_USERS);

  // Create review mutation
  const [createReview] = useMutation(CREATE_REVIEW, {
    onCompleted: () => {
      refetch();
      setShowReviewForm(false);
      setReviewForm({ userId: '', rating: '5', comment: '' });
    },
  });

  const handleSubmitReview = (e: React.FormEvent) => {
    e.preventDefault();
    const user = usersData?.users?.users?.find((u: any) => u.id === reviewForm.userId);
    if (!user) {
      alert('Please select a user');
      return;
    }

    createReview({
      variables: {
        input: {
          productId: id,
          userId: reviewForm.userId,
          userName: user.name,
          rating: parseInt(reviewForm.rating),
          comment: reviewForm.comment || undefined,
        },
      },
    });
  };

  if (loading) return <div className="text-center py-12">Loading...</div>;
  if (error) return <div className="text-center py-12 text-red-500">Error: {error.message}</div>;
  if (!data?.product) return <div className="text-center py-12">Product not found</div>;

  const product = data.product;
  const reviews = product.reviews || [];
  const users = usersData?.users?.users || [];

  return (
    <div className="px-4 py-8">
      <Link to="/products" className="text-blue-600 hover:text-blue-800 mb-4 inline-block">
        ← Back to Products
      </Link>

      {/* Product Details */}
      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">{product.name}</h1>
        <p className="text-gray-600 mb-4">{product.description}</p>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
          <div>
            <span className="text-sm text-gray-500">Price</span>
            <p className="text-2xl font-bold text-blue-600">${product.price}</p>
          </div>
          <div>
            <span className="text-sm text-gray-500">Category</span>
            <p className="text-lg font-semibold">{product.category}</p>
          </div>
          <div>
            <span className="text-sm text-gray-500">Stock</span>
            <p className="text-lg font-semibold">{product.stock}</p>
          </div>
          <div>
            <span className="text-sm text-gray-500">Rating</span>
            <p className="text-lg font-semibold">
              {product.averageRating ? `${product.averageRating}/5` : 'No ratings'}
            </p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <span className={`px-3 py-1 rounded-full text-sm ${product.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
            {product.isActive ? 'Active' : 'Inactive'}
          </span>
          <span className="text-sm text-gray-500">
            {product.reviewCount || 0} reviews
          </span>
        </div>
      </div>

      {/* Reviews Section */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Reviews</h2>
          <button
            onClick={() => setShowReviewForm(true)}
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
          >
            Add Review
          </button>
        </div>

        {/* Reviews List */}
        {reviews.length === 0 ? (
          <p className="text-gray-500 text-center py-8">No reviews yet. Be the first to review!</p>
        ) : (
          <div className="space-y-4">
            {reviews.map((review: Review) => (
              <div key={review.id} className="border-b border-gray-200 pb-4">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <p className="font-semibold text-gray-900">{review.userName}</p>
                    <p className="text-sm text-gray-500">
                      {new Date(review.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="flex items-center">
                    <span className="text-yellow-500 mr-1">★</span>
                    <span className="font-semibold">{review.rating}/5</span>
                  </div>
                </div>
                {review.comment && (
                  <p className="text-gray-700 mt-2">{review.comment}</p>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Review Form Modal */}
      {showReviewForm && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <h3 className="text-lg font-bold mb-4">Add Review</h3>
            <form onSubmit={handleSubmitReview}>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  User
                </label>
                <select
                  required
                  value={reviewForm.userId}
                  onChange={(e) => setReviewForm({ ...reviewForm, userId: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                >
                  <option value="">Select a user</option>
                  {users.map((user: any) => (
                    <option key={user.id} value={user.id}>
                      {user.name} ({user.email})
                    </option>
                  ))}
                </select>
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Rating
                </label>
                <select
                  required
                  value={reviewForm.rating}
                  onChange={(e) => setReviewForm({ ...reviewForm, rating: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                >
                  <option value="5">5 - Excellent</option>
                  <option value="4">4 - Very Good</option>
                  <option value="3">3 - Good</option>
                  <option value="2">2 - Fair</option>
                  <option value="1">1 - Poor</option>
                </select>
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Comment
                </label>
                <textarea
                  value={reviewForm.comment}
                  onChange={(e) => setReviewForm({ ...reviewForm, comment: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  rows={4}
                  placeholder="Write your review..."
                />
              </div>
              <div className="flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => {
                    setShowReviewForm(false);
                    setReviewForm({ userId: '', rating: '5', comment: '' });
                  }}
                  className="px-4 py-2 border rounded-md"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                  Submit Review
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default ProductDetails;


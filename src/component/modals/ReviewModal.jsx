import React, { useState } from "react";
import axios from "axios";


function ReviewModal({ reviews, userId, teacherId, onReviewUpdate }) {
  const [editReviewId, setEditReviewId] = useState(null);
  const [editRating, setEditRating] = useState(0);
  const [editReviewText, setEditReviewText] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);
  
  const myReviews = reviews.filter(review => review.userId === userId);
  const otherReviews = reviews.filter(review => review.userId !== userId);
  
  const handleEdit = (review) => {
    setEditReviewId(review._id);
    setEditRating(review.rating);
    setEditReviewText(review.review);
  };
  
  const handleCancelEdit = () => {
    setEditReviewId(null);
    setEditRating(0);
    setEditReviewText("");
  };
  
  const handleUpdateReview = async (reviewId) => {
    setIsSubmitting(true);
    setError(null);
    
    try {
      const response = await axios.put(`/api/v1/rating/update-rating/${reviewId}`,{
          rating: editRating,
          review: editReviewText
        } , {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        }
      });
      
      setEditReviewId(null);
      if (onReviewUpdate) onReviewUpdate();
    } catch (error) {
      setError(error.message);
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const handleDeleteReview = async (reviewId) => {
    if (!window.confirm("Are you sure you want to delete this review?")) {
      return;
    }
    
    setIsSubmitting(true);
    setError(null);
    
    try {
      const response = await axios.delete(`/api/v1/rating/delete-rating/${reviewId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`
        }
      });

      if (onReviewUpdate) onReviewUpdate();
    } catch (error) {
      setError(error.message);
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <div>
      <h3 className="text-xl font-semibold mb-4">Teacher Reviews</h3>
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}
      
      {/* My Reviews */}
      {myReviews.length > 0 && (
        <div className="mb-8">
          <h4 className="text-lg font-medium mb-3">My Reviews</h4>
          
          {myReviews.map((review) => (
            <div key={review._id} className="mb-4 p-4 border rounded-lg">
              {editReviewId === review._id ? (
                <div>
                  <div className="mb-4">
                    <label className="block text-gray-700 mb-2">Edit Rating</label>
                    <div className="flex">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          type="button"
                          onClick={() => setEditRating(star)}
                          className="focus:outline-none"
                        >
                          <svg 
                            className={`w-6 h-6 ${
                              star <= editRating ? "text-yellow-400" : "text-gray-300"
                            } cursor-pointer hover:text-yellow-400`} 
                            fill="currentColor" 
                            viewBox="0 0 20 20"
                          >
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                          </svg>
                        </button>
                      ))}
                    </div>
                  </div>
                  
                  <div className="mb-4">
                    <label className="block text-gray-700 mb-2">
                      Edit Review
                    </label>
                    <textarea
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      rows="3"
                      value={editReviewText}
                      onChange={(e) => setEditReviewText(e.target.value)}
                    ></textarea>
                  </div>
                  
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleUpdateReview(review._id)}
                      disabled={isSubmitting}
                      className="bg-blue-600 text-white py-1 px-3 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
                    >
                      {isSubmitting ? "Saving..." : "Save Changes"}
                    </button>
                    <button
                      onClick={handleCancelEdit}
                      disabled={isSubmitting}
                      className="bg-gray-200 text-gray-800 py-1 px-3 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-400"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <div>
                  <div className="flex items-center mb-2">
                    <div className="flex">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <svg 
                          key={star}
                          className={`w-5 h-5 ${
                            star <= review.rating ? "text-yellow-400" : "text-gray-300"
                          }`} 
                          fill="currentColor" 
                          viewBox="0 0 20 20"
                        >
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      ))}
                    </div>
                    <span className="text-gray-500 text-sm ml-2">
                      {new Date(review.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  
                  <p className="text-gray-700 mb-3">{review.review}</p>
                  
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleEdit(review)}
                      className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDeleteReview(review._id)}
                      disabled={isSubmitting}
                      className="text-red-600 hover:text-red-800 text-sm font-medium"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
      
      {/* Other Reviews */}
      <div>
        <h4 className="text-lg font-medium mb-3">All Reviews</h4>
        
        {otherReviews.length > 0 ? (
          otherReviews.map((review) => (
            <div key={review._id} className="mb-4 p-4 border rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center">
                  <div className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center mr-2">
                    <span className="text-sm font-medium text-gray-600">
                      {review.username?.[0] || "U"}
                    </span>
                  </div>
                  <span className="font-medium">{review.username || "User"}</span>
                </div>
                <div className="flex">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <svg 
                      key={star}
                      className={`w-4 h-4 ${
                        star <= review.rating ? "text-yellow-400" : "text-gray-300"
                      }`} 
                      fill="currentColor" 
                      viewBox="0 0 20 20"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
              </div>
              
              <p className="text-gray-700">{review.review}</p>
              
              <div className="text-gray-500 text-sm mt-2">
                {new Date(review.createdAt).toLocaleDateString()}
              </div>
            </div>
          ))
        ) : (
          <p className="text-gray-500">No reviews yet.</p>
        )}
      </div>
    </div>
  );
}

export default ReviewModal;
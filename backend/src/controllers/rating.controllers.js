import Rating from '../models/rating.models.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import { ApiError } from '../utils/ApiError.js';
import { asyncHandler } from '../utils/asyncHandler.js';

const giveRating = asyncHandler(async (req, res) => {
  const raterId = req.user._id;
  const { rateeId } = req.params;
  const { rating, review } = req.body;

  if (!rateeId || !rating) {
    return res.status(400).json(new ApiError(400, "rateeId and rate are required"));
  }

  if (rating < 1 || rating > 5) {
    return res.status(400).json(new ApiError(400, "Rating must be between 1 and 5"));
  }

  const newRating = await Rating.create({
    raterId,
    rateeId,
    rating,  
    review
  });

  res
    .status(200)
    .json(new ApiResponse(200, newRating, "success"));
});


const updateRating = asyncHandler(async (req, res) => {
  const { ratingId } = req.params;
  const { rating, review } = req.body;

  const ratingObj = await Rating.findById(ratingId);
  if (!ratingObj) {
    throw new ApiError(404, 'Rating not found');
  }

  ratingObj.rating = rating || ratingObj.rating;
  ratingObj.review = review || ratingObj.review;

  await ratingObj.save();
  return res
    .status(200)
    .json(new ApiResponse(200, ratingObj, "success"));
});


const deleteRating = asyncHandler(async (req, res) => {
  const { ratingId } = req.params;

  const rating = await Rating.findByIdAndDelete(ratingId);

  if (!rating) {
    return res.status(404).json(new ApiError(404, "Rating not found"));
  }

  res
    .status(200)
    .json(new ApiResponse(200, rating, "success"));
});


const viewReviews = asyncHandler(async (req, res) => {
  const { rateeId } = req.params;
  
  const ratings = await Rating.find({ rateeId });

  if (ratings.length === 0) {
    throw new ApiError(200, "No ratings yet!");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, ratings, "success"));
});


const getAverageRating = asyncHandler(async (req, res) => {
  const { rateeId } = req.params;

  const ratings = await Rating.find({ rateeId }).select("rating");

  if (ratings.length === 0) {
    return res
      .status(200)
      .json(new ApiResponse(200, { averageRating: 0 }, "No ratings yet"));
  }

  const ratingsTot = ratings.reduce((sum, r) => sum + r.rating, 0);
  const averageRating = ratingsTot / ratings.length;

  return res
    .status(200)
    .json(new ApiResponse(200, { averageRating }, "success"));
});



export {
  giveRating,
  updateRating,
  deleteRating,
  viewReviews,
  getAverageRating
};

import Rating from '../models/Rating.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import { ApiError } from '../utils/ApiError.js';

class RatingController {
  static giveRating = async (req, res, next) => {
    try {
      const { user_id, teacher_id, rating_value, review_comment } = req.body;
      
      if (!user_id || !teacher_id || !rating_value) {
        throw new ApiError(400, 'Missing required fields');
      }

      const rating = new Rating({
        user_id,
        teacher_id,
        rating_value,
        review_comment
      });

      await rating.save();
      return res.status(201).json(new ApiResponse(201, 'Rating given successfully', rating));
    } catch (err) {
      next(err);
    }
  };

  static updateRating = async (req, res, next) => {
    try {
      const { rating_id } = req.params;
      const { rating_value, review_comment } = req.body;

      const rating = await Rating.findById(rating_id);
      if (!rating) {
        throw new ApiError(404, 'Rating not found');
      }

      rating.rating_value = rating_value || rating.rating_value;
      rating.review_comment = review_comment || rating.review_comment;

      await rating.save();
      return res.status(200).json(new ApiResponse(200, 'Rating updated successfully', rating));
    } catch (err) {
      next(err);
    }
  };

  static deleteRating = async (req, res, next) => {
    try {
      const { rating_id } = req.params;

      const rating = await Rating.findById(rating_id);
      if (!rating) {
        throw new ApiError(404, 'Rating not found');
      }

      await rating.remove();
      return res.status(200).json(new ApiResponse(200, 'Rating deleted successfully'));
    } catch (err) {
      next(err);
    }
  };

  static viewRating = async (req, res, next) => {
    try {
      const { rating_id } = req.params;

      const rating = await Rating.findById(rating_id);
      if (!rating) {
        throw new ApiError(404, 'Rating not found');
      }

      return res.status(200).json(new ApiResponse(200, 'Rating retrieved successfully', rating));
    } catch (err) {
      next(err);
    }
  };

  static getAverageRating = async (req, res, next) => {
    try {
      const { teacher_id } = req.params;

      const ratings = await Rating.find({ teacher_id });
      if (!ratings.length) {
        throw new ApiError(404, 'No ratings found for this teacher');
      }

      const averageRating = ratings.reduce((sum, rating) => sum + rating.rating_value, 0) / ratings.length;
      
      return res.status(200).json(new ApiResponse(200, 'Average rating calculated', { averageRating }));
    } catch (err) {
      next(err);
    }
  };
}

export default RatingController;

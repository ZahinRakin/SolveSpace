import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { 
  postToBatch, 
  monitorBatchSize 
} from "./post.controllers.js";

import Batch from "../models/batch.models.js";
import Post from "../models/post.models.js";
import Rating from "../models/rating.models.js";


const teacherDashboard = asyncHandler(async (req, res) => {
  const { id: teacherId, role } = req.user;

  if (role !== "teacher") {
    throw new ApiError(403, "Access denied");
  }

  console.log("at least came here"); //test ofc

  try {
    // Fetch teacher's ratings
    const ratings = await Rating.find({ rateeId: teacherId });

    if (!ratings.length) {
      return res.json(new ApiResponse(200, { averageRating: 0, ratingDistribution: {}, reviews: [] }, "No ratings yet"));
    }

    // Calculate average rating
    const totalRatings = ratings.length;
    const averageRating = (ratings.reduce((sum, r) => sum + r.rating, 0) / totalRatings).toFixed(1);

    // Count ratings per star
    const ratingDistribution = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
    ratings.forEach(r => ratingDistribution[r.rating]++);

    // Get latest reviews
    const reviews = ratings.slice(-5).map(r => ({
      reviewerId: r.raterId,
      rating: r.rating,
      review: r.review
    }));

    res.json(new ApiResponse(200, { averageRating, ratingDistribution, reviews }, "Success"));
  } catch (error) {
    throw new ApiError(500, "Failed to fetch teacher dashboard data");
  }
});

const showInterest = asyncHandler(async (req, res) => {
  const {
    params: { id: post_id },
    user: { _id: teacher_id, role }
  } = req;

  console.log("user: ", req.user); // Debugging

  const post = await Post.findById(post_id).select("owner interested_teachers");
  console.log("post: ", post); // Debugging

  if (!post) {
    return res.status(404).json(new ApiResponse(404, null, "Post not found"));
  }

  // Prevent users from showing interest in their own posts
  if (post.owner === role) {
    return res.status(400).json(new ApiResponse(400, null, "You can't show interest in your own post."));
  }

  // Check if the user already expressed interest
  if (post.interested_teachers.includes(teacher_id)) {
    return res.status(409).json(new ApiResponse(409, null, "You have already expressed interest in this post"));
  }

  post.interested_teachers.push(teacher_id);

  console.log("iside show interest: ", post.interested_teachers);// debugging log.
  await post.save();

  res.status(200).json(new ApiResponse(200, null, "Interest registered successfully"));
});

const cancelInterest = asyncHandler(async (req, res) => {
  const { id: post_id } = req.params;
  const { _id: teacher_id } = req.user;

  const post = await Post.findById(post_id);
  if (!post) {
    return res
      .status(404)
      .json(new ApiError(404, "Post not found"));
  }

  const interestIndex = post.interested_teachers.indexOf(teacher_id);
  if (interestIndex === -1) {
    return res
      .status(409)
      .json(new ApiError(409, "You have not expressed interest in this post"));
  }

  post.interested_teachers.splice(interestIndex, 1);
  await post.save();

  res
    .status(200)
    .json(new ApiResponse(200, null, "Interest cancelled successfully"));
});

const searchStudent = asyncHandler(async (req, res) => {
  const {
    query: filter
  } = req;

  const allowedFilters = ["subject", "class", "title", "subtitle", "description", "weekly_schedule", "time", "salary", "is_continuous", "is_batch", "max_size"];
  const sanitizedFilter = Object.keys(filter)
    .filter(key => allowedFilters.includes(key) && filter[key])
    .reduce((obj, key) => {
      obj[key] = filter[key];
      return obj;
    }, {});
  
  sanitizedFilter.owner = "student";
  if(filter.is_continuous){
    sanitizedFilter.is_continuous = sanitizedFilter.is_continuous === "true";
  }
  if(filter.is_batch){
    sanitizedFilter.is_batch = sanitizedFilter.is_batch === "true";
  }
  if(filter.salary){
    sanitizedFilter.salary = Number(sanitizedFilter.salary);
  }
  if(filter.max_size){
    sanitizedFilter.max_size = Number(sanitizedFilter.max_size) || 0;
  }

  const matched_posts = await Post
    .find(sanitizedFilter)
    .populate("owner_id", "username role")
    .populate("interested_students", "username")
    .populate("interested_teachers", "username")
    .lean();

  res
    .status(200)
    .json(new ApiResponse(200, matched_posts, "Success"));
});

const createBatch = asyncHandler(async (req, res) => {
  const {
    params: { post_id },
    user: { _id: teacher_id, role }
  } = req;

  if (role !== "teacher") {
    return res
      .status(403)
      .json(new ApiResponse(403, null, "Only teachers can create a batch from his post. If you are a student then select a teacher the batch will automatically be created."));
  }

  const post = await Post.findById(post_id);
  if (!post) {
    return res
      .status(404)
      .json(new ApiResponse(404, null, "Post not found."));
  }

  const batch = await postToBatch(post, teacher_id);
  if (!batch) {
    return res
      .status(500)
      .json(new ApiResponse(500, null, "Failed to create batch."));
  }

  res.status(201).json(new ApiResponse(201, batch, "Batch created successfully."));
});

export {
  teacherDashboard,

  showInterest,
  cancelInterest,

  searchStudent,

  createBatch,
};

import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

import User from "../models/users.models.js";
import Post from "../models/post.models.js";
import Batch from "../models/batch.models.js";
import Student from "../models/student.models.js";


const studentDashboard = asyncHandler(async (req, res) => {
  //here i will add recommended courses based on his previous courses.
});

const postRequest = asyncHandler(async (req, res) => {
  const {
    user: { _id : owner_id, role: owner },
    body: {
      subject,
      class: className,
      title,
      subtitle = "",
      description = "",
      schedule,
      time,
      is_batch,
      max_size
    }
  } = req;

  const newPost = await Post.create({
    owner_id,
    owner,
    subject,
    class: className,
    title,
    subtitle,
    description,
    schedule,
    time,
    is_batch,
    max_size
  });

  res
    .status(201)
    .json(new ApiResponse(201, "Post created successfully", newPost));

});

const deleteRequest = asyncHandler(async (req, res) => {
  const { id: post_id } = req.params;

  const post = await Post.findByIdAndDelete(post_id);

  if (!post) {
    return res.status(404).json(new ApiResponse(404, null, "Post not found"));
  }

  res
    .status(200)
    .json(new ApiResponse(200, post, "Post deleted successfully"));
});

const updateRequest = asyncHandler(async (req, res) => {
  const { id: post_id } = req.params;
  const updates = req.body;

  const post = await Post.findByIdAndUpdate(post_id, updates, { new: true, runValidators: true });

  if (!post) {
    return res.status(404).json(new ApiResponse(404, null, "Post not found"));
  }

  res
    .status(200)
    .json(new ApiResponse(200, post, "Post updated successfully"));
});

const acceptTeacher = asyncHandler(async (req, res) => {
  const { id: post_id } = req.params;
  const { teacher_id } = req.body;
  const { _id: student_id } = req.user;

  const post = await Post.findById(post_id);
  if (!post) {
    return res
      .status(404)
      .json(new ApiError(404, "Post not found"));
  }

  if (post.owner !== "student" || post.owner_id.toString() !== student_id.toString()) {
    return res
      .status(403)
      .json(new ApiError(403, "You don’t have permission to accept teachers for this post"));
  }

  if (!post.interested_teachers.includes(teacher_id)) {
    return res
      .status(400)
      .json(new ApiError(400, "This teacher hasn't expressed interest in this post"));
  }

  const existingBatch = await Batch.findOne({ teacher_id, student_ids: student_id });
  if (existingBatch) {
    return res
      .status(409)
      .json(new ApiError(409, "Batch already exists with this teacher and student"));
  }

  const batch = await Batch.create({
    teacher_id,
    subject: post.subject,
    class: post.class,
    schedule: post.schedule,
    time: post.time,
    student_ids: [student_id]
  });

  await post.deleteOne(); // Properly awaiting the delete operation

  res
    .status(201)
    .json(new ApiResponse(201, batch, "Batch created successfully"));
});

const destroyBatch = asyncHandler(async (req, res) => {
  const { id: batch_id } = req.params;
  const { _id: student_id } = req.user;

  const batch = await Batch.findById(batch_id);
  if (!batch) {
    return res
      .status(404)
      .json(new ApiError(404, "Batch not found"));
  }

  if (batch.owner === "student" && batch.owner_id.toString() === student_id.toString()) {
    await batch.deleteOne(); // Deletes the batch
    return res
      .status(200)
      .json(new ApiResponse(200, null, "Batch deleted successfully"));
  } else {
    return res
      .status(403) // Permission issue
      .json(new ApiError(403, "You don't have permission to delete this batch"));
  }
});

const applyToJoin = asyncHandler(async (req, res) => {
  const {
    params: {
      id: post_id
    },
    user: {
      _id: student_id
    }
  } = req;

  const post = await Post.findById(post_id);
  const student = await Student.findById(student_id);

  if (!post) {
    return res
      .status(404)
      .json(new ApiResponse(404, null, "Post not found"));
  }

  if (post.interested_students.includes(student_id)) {
    return res
      .status(400)
      .json(new ApiResponse(400, null, "You’ve already applied to join this post"));
  }

  post.interested_students.push(student_id);
  await post.save();

  student.prev_courses.push(post);
  await student.save();

  res
    .status(200)
    .json(new ApiResponse(200, post, "Join request sent successfully"));
});

const cancelJoin = asyncHandler(async (req, res) => {
  const { id: post_id } = req.params;
  const { _id: student_id } = req.user;

  const post = await Post.findById(post_id);

  if (!post) {
    return res.status(404).json(new ApiResponse(404, null, "Post not found"));
  }

  const index = post.interested_students.indexOf(student_id);
  if (index === -1) {
    return res.status(400).json(new ApiResponse(400, null, "You haven’t applied to this post"));
  }

  post.interested_students.splice(index, 1);
  await post.save();

  res.status(200).json(new ApiResponse(200, post, "Join request canceled successfully"));
});

const leaveBatch = asyncHandler(async(req, res) => {
  const { id: post_id } = req.params;
  const { _id: student_id } = req.user;

  const batch = await Batch.findById(post_id);

  if (!batch) {
    return res
      .status(404)
      .json(new ApiResponse(404, null, "Post not found"));
  }

  const index = batch.student_ids.indexOf(student_id);
  if (index === -1) {
    return res
      .status(400)
      .json(new ApiResponse(400, null, "You are not enrolled in this course"));
  }

  batch.student_ids.splice(index, 1);
  await batch.save();

  res
    .status(200)
    .json(new ApiResponse(200, batch, "Successfully left the course"));
});

const searchTeacher = asyncHandler(async (req, res) => {
  const {
    user: { _id: student_id },
    body: { subject, class: className, schedule, time, is_batch }
  } = req;

  const filter = {
    owner: "teacher",
    subject,
    class: className,
    schedule,
    time
  };

  if (typeof is_batch !== 'undefined') {
    filter.is_batch = is_batch;
  }

  const matched_posts = await Post.find(filter);

  console.log(matched_posts); // test

  if (!matched_posts || matched_posts.length === 0) {
    return res
      .status(404)
      .json(new ApiError(404, "No posts found"));
  }

  res
    .status(200)
    .json(new ApiResponse(200, matched_posts, "Success"));
});


export {
  studentDashboard,
  postRequest,
  deleteRequest,
  updateRequest,
  acceptTeacher,
  destroyBatch,
  applyToJoin,
  cancelJoin,
  searchTeacher,
  leaveBatch
};
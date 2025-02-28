import User from "../models/users.models.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { 
  sendNotification,
  systemNotification
} from "./notification.controllers.js";

import Batch from "../models/batch.models.js";
import Post from "../models/post.models.js";
import Student from "../models/student.models.js";


const teacherDashboard = asyncHandler(async (req, res) => {
  //yet to implement 
});

const updatePost = asyncHandler(async (req, res) => {
  const { id: post_id } = req.params;
  const { _id: teacher_id } = req.user;
  const updatedInfo = req.body;

  if (Object.keys(updatedInfo).length === 0) {
    return res
      .status(400)
      .json(new ApiError(400, "No update data provided"));
  }
  
  const post = await Post.findById(post_id);
  if (!post) {
    return res
      .status(404)
      .json(new ApiError(404, "Post not found"));
  }

  if (post.owner !== "teacher" || !post.owner_id.equals(teacher_id)) {
    return res
      .status(403)
      .json(new ApiError(403, "You don't have permission to update this post"));
  }

  try {
    const updatedPost = await Post.findByIdAndUpdate(post_id, {
      $set: updatedInfo
    }, { new: true });
  
    res
      .status(200)
      .json(new ApiResponse(200, updatedPost, "Post updated successfully"));
  } catch (error) {
    res
      .status(error.status || 500)
      .json(new ApiError(error.status || 500, error.message || "Problem with database"));
  }
});

const deletePost = asyncHandler(async (req, res) => {
  const { id: post_id } = req.params;
  const { _id: teacher_id } = req.user;

  const post = await Post.findById(post_id);
  if (!post) {
    return res
      .status(404)
      .json(new ApiError(404, "Post not found"));
  }

  if (post.owner !== "teacher" || !post.owner_id.equals(teacher_id)) {
    return res
      .status(403)
      .json(new ApiError(403, "You don't have permission to delete this post"));
  }

  await Post.findByIdAndDelete(post_id);

  res
    .status(200)
    .json(new ApiResponse(200, null, "Post deleted successfully"));
});

const showInterest = asyncHandler(async (req, res) => {
  const { id: post_id } = req.params;
  const { _id: teacher_id } = req.user;

  const post = await Post.findById(post_id);
  if (!post) {
    return res
      .status(404)
      .json(new ApiResponse(404, "Post not found", null, "false"));
  }

  // Check if teacher has already shown interest
  if (post.interested_teachers.includes(teacher_id)) {
    return res
      .status(409)
      .json(new ApiResponse(409, "You have already expressed interest in this post", null, "false"));
  }

  // Add teacher and save
  post.interested_teachers.push(teacher_id);
  await post.save();

  res
    .status(200)
    .json(new ApiResponse(200, null, "Interest registered successfully"));
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

//upto this point tested the APIs


const searchStudent = asyncHandler(async (req, res) => {
  const {
    user: { _id: teacher_id },
    body: { subject, class: className, weekly_schedule, time, is_batch }
  } = req;

  const filter = {
    owner: "student",
    subject,
    class: className,
    weekly_schedule,
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

const removeStudentFromBatch = asyncHandler(async (req, res) => {
  //here i should send notification to the student and teacher about the removal.
  const { id: student_id } = req.params;
  const { batch_id } = req.body;

  const batch = await Batch.findById(batch_id);
  if (!batch) {
    throw new ApiError(404, "Batch not found");
  }

  const studentIndex = batch.students.indexOf(student_id);
  if (studentIndex === -1) {
    throw new ApiError(404, "Student not found in batch");
  }

  batch.students.splice(studentIndex, 1);
  await batch.save();

  res
    .status(200)
    .json(new ApiResponse(200, "Student removed from batch successfully"));
});

const addStudentToBatch = asyncHandler(async (req, res) => {
  const { id: student_id } = req.params;
  const { batch_id } = req.body;

  const batch = await Batch.findById(batch_id);
  if (!batch) {
    throw new ApiError(404, "Batch not found");
  }

  if (batch.students.includes(student_id)) {
    throw new ApiError(400, "Student already in batch");
  }

  batch.students.push(student_id);
  await batch.save();

  res
    .status(200)
    .json(new ApiResponse(200, "Student added to batch successfully"));
});

const createBatch = asyncHandler(async (req, res) => {
  const {
    params: { id: post_id },
    user: { _id: teacher_id }
  } = req;

  const post = await Post.findById(post_id);
  if (!post) {
    return res.status(404).json(new ApiError(404, "Post not found"));
  }

  if (post.owner !== "teacher" || !post.owner_id.equals(teacher_id)) {
    return res.status(403).json(new ApiError(403, "Only your own posts can be transformed into a batch."));
  }

  try {
    const batch = await postToBatch(post);
    res.status(201).json(new ApiResponse(201, batch, "Batch created successfully"));
  } catch (error) {
    res.status(error.statusCode || 500).json(new ApiError(error.statusCode || 500, error.message));
  }
});

const postTuition = asyncHandler(async (req, res) => {
  const {
    user: { _id: owner_id, role: owner },
    body: {
      subject,
      class: className,
      title,
      subtitle = "",
      description = "",
      weekly_schedule = [],
      time,
      salary,
      is_continuous,
      is_batch,
      max_size
    }
  } = req;

  try {
    const post = await Post.create({
      owner_id,
      owner,
      subject,
      class: className,
      title,
      subtitle,
      description,
      weekly_schedule,
      time,
      salary,
      is_continuous,
      is_batch,
      max_size
    });

    // Start monitoring and keep track of the interval ID
    const intervalID = setInterval(() => monitorBatchSize(post._id, intervalID), 3600000);

    res
      .status(201)
      .json(new ApiResponse(201, post, "Post created successfully"));
  } catch (error) {
    res
      .status(400)
      .json(new ApiError(400, error.message || "Failed to create post"));
  }
});

async function monitorBatchSize(post_id, intervalID) {
  const post = await Post.findById(post_id);
  if (!post) {
    console.error("Post not found, stopping monitoring.");
    return clearInterval(intervalID); // Stop if the post is gone
  }

  if (post.interested_students.length >= post.max_size) {
    try {
      const batch = await postToBatch(post);
      await systemNotification(post.owner_id, `Post [${post._id}]'s capacity full. Batch [${batch._id}] created.`);
      clearInterval(intervalID); // Stop once the batch is created
    } catch (error) {
      console.error(`Failed to create batch: ${error.message}`);
    }
  }
}

async function postToBatch(post) {
  const student_ids = post.interested_students;

  const batch = await Batch.create({
    teacher_id: post.owner_id,
    subject: post.subject,
    class: post.class,
    weekly_schedule: post.weekly_schedule,
    time: post.time,
    salary: post.salary,
    is_continuous: post.is_continuous,
    is_batch: post.is_batch,
    student_ids
  });

  await Promise.all(student_ids.map(async (sid) => {
    const student = await Student.findOne({ user_id: sid });
    if (student) {
      student.prev_courses.push(batch._id);
      await student.save();
    }
  }));

  await post.deleteOne();

  return batch;
}


export {
  teacherDashboard,
  postTuition,
  updatePost,

  deletePost,
  showInterest,
  cancelInterest,

  searchStudent,
  removeStudentFromBatch,
  addStudentToBatch,

  createBatch
};

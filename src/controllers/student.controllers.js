import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

import Post from "../models/post.models.js";
import Batch from "../models/batch.models.js";
import Student from "../models/student.models.js";

import { postToBatch } from "./post.controllers.js";
import { systemNotification } from "./notification.controllers.js";


const studentDashboard = asyncHandler(async (req, res) => {
  //here i will add recommended courses based on his previous courses.
});

const applyToJoin = asyncHandler(async (req, res) => {
  const {
    params: {
      id: post_id
    },
    user: {
      _id: student_id,
      role
    }
  } = req;

  const post = await Post.findById(post_id);

  if (!post) {
    return res
      .status(404)
      .json(new ApiResponse(404, null, "Post not found"));
  }
  if(role === post.owner){
    return res
      .status(400)
      .json(new ApiResponse(400, null, "You can't join a post that is a student's post"));
  }

  const batch_size = post.interested_students.length + 1;
  if(batch_size >= post.max_size){
    try {
      const batch = postToBatch(post, post.owner_id);
      console.log("post[", post._id, "]is full. so batch[", batch._id ,"] is formed"); //test ofc
      systemNotification(post.owner_id, `Your post[${post._id}] has filled. So it is now a batch[${batch._id}].`);

      return res
        .status(400)
        .json(new ApiResponse(400, null, "Batch is full."));
    } catch (error) {
      throw new ApiError(error.statusCode, error.message);
    }
  }

  if (post.interested_students.includes(student_id)) {
    return res
      .status(400)
      .json(new ApiResponse(400, null, "You have already applied to join this post"));
  }

  post.interested_students.push(student_id);
  await post.save();

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

const acceptTeacher = asyncHandler(async (req, res) => {
  const {
    params: { post_id, teacher_id },
    user: { _id: student_id, role }
  } = req;

  console.log(`Post ID: ${post_id} \nTeacher ID: ${teacher_id}`); // Debugging

  const post = await Post.findById(post_id);
  if (!post) {
    return res.status(404).json(new ApiResponse(404, null, "Post not found"));
  }

  console.log(`Post: ${JSON.stringify(post)}`); // Debugging

  const student = await Student.findOne({ user_id: student_id }).select("prev_courses");
  if (!student) {
    return res.status(404).json(new ApiResponse(404, null, "Student not found"));
  }

  console.log(`Student: ${JSON.stringify(student)}`); // Debugging

  if (post.owner !== role || !post.owner_id.equals(student_id)) {
    return res.status(403).json(new ApiResponse(403, null, "You don’t have permission to accept teachers for this post"));
  }

  if (!post.interested_teachers.includes(teacher_id)) {
    return res.status(400).json(new ApiResponse(400, null, "This teacher hasn't expressed interest in this post"));
  }

  if (post.interested_students.includes(student_id)) {
    return res.status(409).json(new ApiResponse(409, null, "You have already accepted this teacher for the post"));
  }

  post.interested_students.push(student_id);

  const batch = await postToBatch(post, teacher_id);

  student.prev_courses.push(batch._id);
  await student.save();

  res.status(201).json(new ApiResponse(201, batch, "Batch created successfully"));
});

const searchTeacher = asyncHandler(async (req, res) => {
  const {
    // user: { _id: student_id , role },
    body: filter
  } = req;

  filter.owner = "teacher";

  const allowedFilters = ["owner" ,"subject", "class", "title", "subtitle", "description", "weekly_schedule", "time", "salary", "is_continuous", "is_batch", "max_size"];
  const sanitizedFilter = Object.keys(filter)
    .filter(key => allowedFilters.includes(key))
    .reduce((obj, key) => {
      obj[key] = filter[key];
      return obj;
    }, {});

  const matched_posts = await Post
    .find(sanitizedFilter)
    .select("-owner_id -owner -interested_teachers -interested_students");;

  if (!matched_posts || matched_posts.length === 0) {
    return res
      .status(404)
      .json(new ApiResponse(404, null, "No posts found"));
  }

  res
    .status(200)
    .json(new ApiResponse(200, matched_posts, "Success"));
});
//all tested. everything works fine but dashboard. will do this later.
const leaveBatch = asyncHandler(async (req, res) => {
  const {
    params: { id: batch_id },
    user: { _id: user_id, role }
  } = req;

  const batch = await Batch.findById(batch_id);
  if (!batch) {
    return res
      .status(404)
      .json(new ApiResponse(404, null, "Batch not found"));
  }

  if (role === "student") {
    const index = batch.student_ids.indexOf(user_id);
    if (index === -1) {
      return res
        .status(400)
        .json(new ApiResponse(400, null, "You are not enrolled in this batch"));
    }

    batch.student_ids.splice(index, 1);

    if (batch.student_ids.length === 0) {
      await batch.deleteOne();
      return res
        .status(200)
        .json(new ApiResponse(200, null, "Batch deleted as no students or teacher remain"));
    }

    await batch.save();

    return res
      .status(200)
      .json(new ApiResponse(200, batch, "Successfully left the batch"));
  }
  else if (role === "teacher") {
    return res
      .status(403)
      .json(new ApiResponse(403, null, "Teachers cannot leave the batch. If needed, delete the batch instead."));
  }

  res
    .status(400)
    .json(new ApiResponse(400, null, "Invalid role"));
});

export {
  studentDashboard,
  applyToJoin,
  cancelJoin,

  acceptTeacher,
  searchTeacher,

  leaveBatch
};
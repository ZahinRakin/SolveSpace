import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

import Post from "../models/post.models.js";
import Batch from "../models/batch.models.js";
import Student from "../models/student.models.js";
import Rating from "../models/rating.models.js";

import { postToBatch } from "./post.controllers.js";
import { systemNotification } from "./notification.controllers.js";


const studentDashboard = asyncHandler(async (req, res) => {
  const { id: student_id, role } = req.user;
  
  if (role === "student") {
    const recommendation = await recommendedCourses(student_id);
    return res.status(200).json(new ApiResponse(200, recommendation, "success")); 
  }
  
  return res.status(403).json(new ApiResponse(403, null, "Access denied"));
});

async function recommendedCourses(studentId) {
  try {
    // Get the student's previous courses (handle case where student record doesn't exist)
    const student = await Student.findOne({ user_id: studentId }).populate("prev_courses");
    const prevCourseIds = student?.prev_courses?.map(course => course._id) || [];

    // Get highest-rated teachers (e.g., top 5)
    const topTeachers = await Rating.aggregate([
      { $group: { _id: "$rateeId", avgRating: { $avg: "$rating" } } },
      { $sort: { avgRating: -1 } },
      { $limit: 5 }
    ]);

    const teacherIds = topTeachers.map(t => t._id);

    // Fetch recommended courses: priority to teachers + relevant subjects
    // const recommendedCourses = await Post.find({
    //   owner_id: { $in: teacherIds },
    //   _id: { $nin: prevCourseIds } // Exclude courses student already took
    // })
    // .populate("owner_id", "username")
    // .populate("interested_teachers", "username")
    // .populate("interested_students", "username")
    // .lean();
    const recommendedCourses = await Post
      .find({})
      .populate("owner_id", "username")
      .populate("interested_teachers", "username")
      .populate("interested_students", "username")
      .lean();

    return recommendedCourses;
  } catch (error) {
    console.error("Error fetching recommended courses:", error);
    throw new Error("Failed to fetch recommended courses");
  }
}

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

  if (post.interested_students.includes(student_id)) {
    return res
      .status(400)
      .json(new ApiResponse(400, null, "You have already applied to join this post"));
  }

  post.interested_students.push(student_id);
  await post.save();

  const batch_size = post.interested_students.length + 1;
  if(batch_size >= post.max_size){
    try {
      const batch = await postToBatch(post, post.owner_id);
      await systemNotification(post.owner_id, `Your post[${post._id}] has filled. So it is now a batch[${batch._id}].`);

      return res
        .status(200)
        .json(new ApiResponse(200, null, "joined successfully."));
    } catch (error) {
      res
        .status(error.statusCode)
        .json(new ApiResponse(error.statusCode, null, error.message));
    }
  }

  res
    .status(200)
    .json(new ApiResponse(200, post, "Joined successfully"));
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

  console.log("inside accept teacher"); //debugging log. control reached here.

  const post = await Post.findById(post_id);
  if (!post) {
    return res.status(404).json(new ApiResponse(404, null, "Post not found"));
  }

  const student = await Student.findOne({ user_id: student_id }).select("prev_courses");
  if (!student) {
    return res.status(404).json(new ApiResponse(404, null, "Student not found"));
  }

  if (post.owner !== role || !post.owner_id.equals(student_id)) {
    return res.status(403).json(new ApiResponse(403, null, "You don’t have permission to accept teachers for this post"));
  }

  if (!post.interested_teachers.includes(teacher_id)) {
    return res.status(400).json(new ApiResponse(400, null, "This teacher hasn't expressed interest in this post"));
  }

  post.interested_students.push(student_id);

  const batch = await postToBatch(post, teacher_id);

  student.prev_courses.push(batch._id);
  await student.save();

  res.status(201).json(new ApiResponse(201, batch, "Batch created successfully"));
});

const searchTeacher = asyncHandler(async (req, res) => {
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
  
  sanitizedFilter.owner = "teacher";
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
        .json(new ApiResponse(200, null, "Batch deleted as no students remain"));
    }

    let message = "";
    if(batch.owner_id.equals(user_id)){
      batch.owner = "teacher";
      batch.owner_id = batch.teacher_id;
      message = "Since the owner of the batch has left. the new owner is the teacher.";
    }

    await batch.save();

    return res
      .status(200)
      .json(new ApiResponse(200, batch, "Successfully left the batch" || message));
  } else if (role === "teacher") {
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
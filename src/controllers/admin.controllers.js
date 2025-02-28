import User from "../models/users.models.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

import Batch from "../models/batch.models.js";


const adminDashboard = asyncHandler(async (req, res) => {
  //here i can show the app performance. number of teachers and number of students
  //increment from the previous month. 
});

const addUser = asyncHandler(async (req, res) => {
  const { firstname, lastname, username, email, password, role } = req.sanitizedData;
  const sslczStoreId = req.sanitizedData?.sslczStoreId;
  const sslczStorePassword = req.sanitizedData?.sslczStorePassword;

  const userExists = await User.findOne({ $or: [{ username }, { email }] });

  if (userExists) {
    const message =
      userExists.email === email
        ? "Email is already registered"
        : "Username is already taken";
    throw new ApiError(400, message);
  }

  let refreshToken = "null";
  const user = await User.create({
    firstname,
    lastname,
    username,
    email,
    password,
    role,
    sslczStoreId,
    sslczStorePassword,
    refreshToken
  });
  refreshToken = await user.generateRefreshToken();
  user.refreshToken = refreshToken;
  await user.save();

  if (user) {
    res
      .status(201)
      .json(new ApiResponse(201, {
        _id: user._id,
        firstname: user.firstname,
        lastname: user.lastname,
        username: user.username,
        email: user.email,
        role: user.role,
      }, "success"));
  } else {
    res
      .status(400)
      .json(new ApiError(400, "Invalid user data."));
  }
});

const removeUser = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const user = await User.findById(id);

  if (!user) {
    res
      .status(404)
      .json(new ApiError(404, "User not found."));
  }

  await user.deleteOne();
  res
    .status(200)
    .json(new ApiResponse(200, "user removed", "success"));
});

const viewAllStudent = asyncHandler(async (req, res) => {
  const students = await User.find({ role: 'student' });

  if (students.length > 0) {
    res
      .status(200)
      .json(new ApiResponse(200, students, "success"));
  } else {
    res
      .status(404)
      .json(404, "No students found");
  }
});

const viewAllTeacher = asyncHandler(async (req, res) => {
  const teachers = await User.find({ role: 'teacher' });

  if (teachers.length > 0) {
    res
      .status(200)
      .json(new ApiResponse(200, teachers));
  } else {
    res
      .status(404)
      .json(new ApiError(404, "No teachers found."));
  }
});

const viewAllCourses = asyncHandler(async (req, res) => {
  const courses = await Batch.find().populate('teacher_id').populate('student_ids');

  if (courses.length > 0) {
    res
      .status(200)
      .json(new ApiResponse(200, courses, "Courses fetched successfully"));
  } else {
    res
      .status(404)
      .json(new ApiError(404, "No courses found."));
  }
});

const removeCourses = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const course = await Batch.findById(id);

  if (!course) {
    return res
      .status(404)
      .json(new ApiError(404, "Course not found."));
  }

  await course.deleteOne();
  res
    .status(200)
    .json(new ApiResponse(200, "Course removed successfully", "success"));
});

const addCourses = asyncHandler(async (req, res) => {
  const { teacher_id, subject, class: className, schedule, time, student_ids } = req.body;

  const course = await Batch.create({
    teacher_id,
    subject,
    class: className,
    schedule,
    time,
    student_ids
  });

  res
    .status(201)
    .json(new ApiResponse(201, course, "Course added successfully"));
});


export {
  adminDashboard,
  addUser,
  removeUser,
  viewAllStudent,
  viewAllTeacher,
  viewAllCourses,
  removeCourses,
  addCourses
};
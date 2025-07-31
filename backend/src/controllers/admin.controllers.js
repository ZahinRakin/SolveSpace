import User from "../models/users.models.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { clearUserData } from "../utils/removeUser.js";

import Batch from "../models/batch.models.js";
import UserStats from "../models/userStats.models.js";
import Admin from "../models/admin.models.js";
import Post from "../models/post.models.js";
import Report from "../models/Report.models.js";


const adminDashboard = asyncHandler(async (req, res) => {
  const adminStats = await Admin.findOne({})
    .select("total_students total_teachers total_posts total_batches")
    .lean();

  if (!adminStats) {
    return res.status(404).json(new ApiResponse(404, null, "Admin stats not found"));
  }

  const userGrowth = await UserStats.find({})
    .select("month year new_students new_teachers -_id")
    .sort({ year: -1, month: -1 })
    .lean();

  // Get recent activity (latest 5 posts and batches)
  const recentPosts = await Post.find().sort({ createdAt: -1 }).limit(5).select("title createdAt").lean();
  const recentBatches = await Batch.find().sort({ createdAt: -1 }).limit(5).select("subject createdAt").lean();

  // Calculate growth rate (if last two months' data is available)
  let growthRates = {};
  if (userGrowth.length > 1) {
    const [current, previous] = userGrowth;
    growthRates = {
      studentGrowth: ((current.new_students - previous.new_students) / (previous.new_students || 1)) * 100,
      teacherGrowth: ((current.new_teachers - previous.new_teachers) / (previous.new_teachers || 1)) * 100,
    };
  }

  res.status(200).json(
    new ApiResponse(200, { 
      stats: adminStats, 
      userGrowth, 
      recentPosts, 
      recentBatches, 
      growthRates 
    }, "Dashboard data fetched successfully")
  );
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
  console.log("inside admin remove user"); //debugging log..
  const { id } = req.params;
  const { role } = req.user;

  if (role !== "admin") {
    return res
      .status(403)
      .json(new ApiResponse(403, null, "Unauthorized to remove users."));
  }

  await clearUserData(id, res);
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

const viewAllBatches = asyncHandler(async (req, res) => {
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

const removeBatch = asyncHandler(async (req, res) => {
  const { role } = req.user;
  if (role !== "admin") {
    return res
      .status(401)
      .json(new ApiResponse(401, null, "Unauthorized access"));
  }

  const { batch_id } = req.params;
  const batch = await Batch.findById(batch_id);

  if (!batch) {
    return res
      .status(404)
      .json(new ApiError(404, "Batch not found."));
  }

  await batch.deleteOne();
  res
    .status(200)
    .json(new ApiResponse(200, null, `Batch [${batch_id}] deleted successfully`));
});

const addBatch = asyncHandler(async (req, res) => {
  const { role } = req.user;
  if (role !== "admin") {
    return res
      .status(401)
      .json(new ApiResponse(401, null, "Unauthorized access"));
  }

  
  const batchInfo = req.body;
  
  if (Object.keys(batchInfo).length === 0) {
    return res
    .status(400) // Bad Request
    .json(new ApiResponse(400, null, "No data provided."));
  }

  const batch_owner = await User
    .findOne({username: batchInfo.username})
    .select("_id role")
    .lean();

  
  if (!batch_owner) {
    return res
      .status(404) // Not Found
      .json(new ApiResponse(404, null, "Owner ID doesn't exist."));
  }

  const teacher = await User
    .findOne({username: batchInfo.teacher_username})
    .select("_id")
    .lean();
  if (!teacher) {
    return res.status(404).json(new ApiResponse(404, null, "Teacher not found."));
  }

  const student_usernames = batchInfo.student_ids;

  let student_ids = await Promise.all(
    student_usernames.map(async (username) => {
      const user = await User.findOne({ username }).select("_id");
      return user ? user._id : null; // Handle user not found
    })
  );
  student_ids = student_ids.filter(id => id); //removing null values


  const allowedInfo = [
    "subject", "class", "weekly_schedule", "time", "salary", "time_to_pay", "is_continuous", "is_batch"
  ];

  const sanitizedInfo = Object.keys(batchInfo)
    .filter((key) => allowedInfo.includes(key))
    .reduce((obj, key) => {
      obj[key] = batchInfo[key];
      return obj;
    }, {});

  sanitizedInfo.student_ids = student_ids;
  sanitizedInfo.owner_id = batch_owner._id;
  sanitizedInfo.owner = batch_owner.role;
  sanitizedInfo.teacher_id = teacher._id;

  console.log("inside teacher add batch: ", sanitizedInfo);

  try {
    const batch = await Batch.create(sanitizedInfo);
    return res
      .status(200)
      .json(new ApiResponse(200, batch, "Batch has been created."));
  } catch (error) {
    console.log(error.message);
    return res
      .status(500) // Internal Server Error
      .json(new ApiResponse(500, null, error.message || "An error occurred while creating the batch."));
  }
});

const viewAllPosts = asyncHandler(async (req, res) => {
  const {role } = req.user;
  if(role !== "admin"){
    return res
      .status(400)
      .json(new ApiResponse(400, null, "Unauthorized access"));
  }
  const allPosts = await Post
    .find({})
    .populate("owner_id", "username")
    .populate("interested_teachers", "username")
    .populate("interested_students", "username")
    .lean();
  
  return res
    .status(200)
    .json(new ApiResponse(200, allPosts, "successfully retrieved all the posts"));
});

const removePost = asyncHandler(async (req, res) => {
  const {role } = req.user;
  if(role !== "admin"){
    return res
      .status(400)
      .json(new ApiResponse(400, null, "Unauthorized access"));
  }
  const { id:post_id } = req.params;
  await Post.findOneAndDelete(post_id);
  res
    .status(200)
    .json(new ApiResponse(200, null, `post[${post_id}] deleted successfully`));

});

const addPost = asyncHandler(async (req, res) => {
  const { role } = req.user;
  if (role !== "admin") {
    return res
      .status(401)
      .json(new ApiResponse(401, null, "Unauthorized access"));
  }

  const postInfo = req.body;

  if (!postInfo) {
    return res
      .status(400) // Bad Request
      .json(new ApiResponse(400, null, "No data provided."));
  }

  const user = await User.findById(postInfo.owner_id).select("_id").lean();
  if (!user) {
    return res
      .status(404) // Not Found
      .json(new ApiResponse(404, null, "Owner ID doesn't exist."));
  }

  const teacher_usernames = postInfo.interested_teachers;
  const student_usernames = postInfo.interested_students;

  let interested_teachers = await Promise.all(
    teacher_usernames.map(async (username) => {
      const user = await User.findOne({ username }).select("_id");
      return user ? user._id : null; // Handle user not found
    })
  );

  let interested_students = await Promise.all(
    student_usernames.map(async (username) => {
      const user = await User.findOne({ username }).select("_id");
      return user ? user._id : null; // Handle user not found
    })
  );

  console.log("inside admin add post: ", postInfo); //debugging log

  const allowedInfo = [
    "owner_id", "owner", "subject", "class", "title", "subtitle", 
    "description", "weekly_schedule", "time", "salary", "is_continuous", 
    "is_batch", "max_size"
  ];

  const sanitizedInfo = Object.keys(postInfo)
    .filter((key) => allowedInfo.includes(key))
    .reduce((obj, key) => {
      obj[key] = postInfo[key];
      return obj;
    }, {});

  sanitizedInfo.interested_teachers = interested_teachers;
  sanitizedInfo.interested_students = interested_students;

  console.log("inside admin add post: ", sanitizedInfo); //debugging log

  try {
    const post = await Post.create(sanitizedInfo);
    return res
      .status(200)
      .json(new ApiResponse(200, post, "Post has been created."));
  } catch (error) {
    console.log(error.message);
    return res
      .status(500) // Internal Server Error
      .json(new ApiResponse(500, null, error.message || "An error occurred while creating the post."));
  }
});


const getAllReports = asyncHandler(async (req, res) => {
  try {
    console.log("inside getAllReports: Checking role");
    if (req.user.role !== "admin") {
      return res.status(403).json(new ApiResponse(403, null, "Only admin can do this"));
    }

    const reports = await Report.find({})
      .populate("reporter_id", "username")
      .populate("reportee_id", "username")
      .lean();

    if (!reports || reports.length === 0) {
      return res.status(404).json(new ApiResponse(404, null, "No reports found!"));
    }

    res.status(200).json(new ApiResponse(200, reports, "Successfully retrieved all reports"));
  } catch (error) {
    console.error("Error fetching reports:", error);
    res.status(500).json(new ApiResponse(500, null, "Internal Server Error"));
  }
});

async function updateAdminStats(post_count, batch_count){
  const admin = await Admin.findOne({}).select("total_posts total_batches");

  if (!admin) {
    return res.status(404).json(new ApiResponse(404, null, "Admin not found"));
  }
  admin.total_posts += post_count;
  admin.total_batches += batch_count;
  await admin.save();
}


export {
  adminDashboard,
  addUser,
  removeUser,
  viewAllStudent,
  viewAllTeacher,
  viewAllBatches,
  removeBatch,
  addBatch,
  viewAllPosts,
  removePost,
  addPost,
  updateAdminStats,
  getAllReports
};
import User from "../models/users.models.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import Batch from "../models/batch.models.js";
import UserStats from "../models/userStats.models.js";
import Admin from "../models/admin.models.js";
import Post from "../models/post.models.js";


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

const addBatch = asyncHandler(async (req, res) => {
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

const viewAllPosts = asyncHandler(async (req, res) => {
  const {role } = req.user;
  if(role !== "admin"){
    return res
      .status(400)
      .json(new ApiResponse(400, null, "Unauthorized access"));
  }
  const allPosts = await Post.find({});
  const ownerIds = allPosts
    .map(post => post.owner_id)
    .populate("owner_id", "username")
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
  if(role !== "admin"){
    return res
      .status(400)
      .json(new ApiResponse(400, null, "Unauthorized access"));
  }
  const { postInfo } = req.body;
  const allowedInfo = ["owner_id", "owner", "subject", "class", "title", "subtitle", "description", "weekly_schedule", "time", "salary", "is_continuous", "is_batch", "max_size"];

  const sanitizedInfo = Object.keys(postInfo)
    .filter(key => allowedInfo.includes(key))  // Fixed method to 'includes()'
    .reduce((obj, key) => {
      obj[key] = postInfo[key];
      return obj;
    }, {});

  const post = await Post.create(sanitizedInfo);
  return res
    .status(200)
    .json(new ApiResponse(200, post, "Post has been created."));
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
  updateAdminStats
};
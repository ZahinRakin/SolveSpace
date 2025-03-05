import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";
import { systemNotification } from "./notification.controllers.js";
import { updateAdminStats } from "./admin.controllers.js"; //post_count, batch_count

import Post from "../models/post.models.js";
import Batch from "../models/batch.models.js";
import Student from "../models/student.models.js";


const createPost = asyncHandler(async (req, res) => {
  const {
    user: { _id: owner_id, role: owner },
    body: postInfo
  } = req;
  postInfo.owner_id = owner_id;
  postInfo.owner = owner;

  const postFilter = ["owner_id", "owner", "subject", "class", "title", "subtitle", "description", "weekly_schedule", "time", "salary", "is_continuous", "is_batch", "max_size"];

  const sanitizedPostInfo = Object.keys(postInfo)
    .filter(key => postFilter.includes(key))
    .reduce((obj, key) => {
      obj[key] = postInfo[key];
      return obj;
    }, {});

  try {
    const post = await Post.create(sanitizedPostInfo);

    if(post.owner === "teacher"){
      const intervalID = setInterval(() => monitorBatchSize(post._id, intervalID), 300000);
    }
    await updateAdminStats(1, 0); //under construction.
    res
      .status(201)
      .json(new ApiResponse(201, post, "Post created successfully"));
  } catch (error) {
    res
      .status(400)
      .json(new ApiResponse(400, null, error.message || "Failed to create post"));
  }
});

const updatePost = asyncHandler(async (req, res) => {
  const {
    params: {
      id: post_id
    },
    body: updates,
    user: {
      _id: user_id,
      role
    }
  } = req;

  const post = await Post.findById(post_id);
  if (!post) {
    return res.status(404).json(new ApiResponse(404, null, "Post not found"));
  }

  if (!post.owner_id.equals(user_id) || post.owner !== role) {
    return res.status(403).json(new ApiError(403, "You don't have permission to update this post"));
  }

  const allowedUpdates = ["subject", "class", "title", "subtitle", "description", "weekly_schedule", "time", "salary", "is_continuous", "is_batch", "max_size"];
  const filteredUpdates = Object.keys(updates)
    .filter(key => allowedUpdates.includes(key))
    .reduce((obj, key) => {
      obj[key] = updates[key];
      return obj;
    }, {});

  if (Object.keys(filteredUpdates).length === 0) {
    return res
      .status(400)
      .json(new ApiResponse(400, null, "No valid updates provided"));
  }

  const updatedPost = await Post.findByIdAndUpdate(post_id, filteredUpdates, { new: true, runValidators: true });

  await updateAdminStats(1, 0); //under construction

  res
    .status(200)
    .json(new ApiResponse(200, updatedPost, "Post updated successfully"));
});

const deletePost = asyncHandler(async (req, res) => {
  const { id: post_id } = req.params;
  const { _id: user_id, role } = req.user;

  const post = await Post.findById(post_id);

  if (!post) {
    return res.status(404).json(new ApiResponse(404, null, "Post not found"));
  }

  if (!post.owner_id.equals(user_id) || post.owner !== role) {
    return res
      .status(403)
      .json(new ApiError(403, "You don't have permission to delete this post"));
  }

  await post.deleteOne();

  await updateAdminStats(-1, 0); //under construction

  res
    .status(200)
    .json(new ApiResponse(200, null, "Post deleted successfully"));
});

const getYourPosts = asyncHandler(async(req, res) => {
  const { _id: user_id, role } = req.user;
  const userPosts = await Post.find({owner_id: user_id, owner: role});
  res
    .status(200)
    .json(new ApiResponse(200, userPosts, "success"));
});


async function postToBatch(post, teacher_id) {
  const student_ids = post.interested_students;

  const batch = await Batch.create({
    owner_id: post.owner_id,
    owner: post.owner,
    teacher_id,
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
  await updateAdminStats(-1, 1); //under construction

  return batch;
}

async function monitorBatchSize(post_id, intervalID) {
  console.log("inside monitor batch size: ", post_id);
  const post = await Post.findById(post_id);
  if (!post) {
    console.error("Post not found, stopping monitoring.");
    return clearInterval(intervalID); // Stop if the post is gone
  }

  const batch_size = post.interested_students.length + 1;
  if (batch_size >= post.max_size) {
    try {
      const batch = await postToBatch(post, post.owner_id);
      await systemNotification(post.owner_id, `Post [${post._id}]'s capacity full. Batch [${batch._id}] created.`);
      clearInterval(intervalID); // Stop once the batch is created
    } catch (error) {
      console.error(`Failed to create batch: ${error.message}`);
    }
  }
}




export {
  createPost,
  updatePost,
  deletePost,
  getYourPosts,


  postToBatch,
  monitorBatchSize
}
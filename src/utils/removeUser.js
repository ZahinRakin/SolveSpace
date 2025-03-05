import Report from "../models/Report.models.js";
import Student from "../models/student.models.js";
import Teacher from "../models/teacher.models.js";
import Notification from "../models/notification.models.js";
import User from "../models/users.models.js";
import Post from "../models/post.models.js";
import Rating from "../models/rating.models.js";
import Batch from "../models/batch.models.js";
import { ApiResponse } from "../utils/ApiResponse.js";

async function clearUserData(id, res) {
  try {
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json(new ApiError(404, "User not found."));
    }

    await Promise.all([
      user.role === "student"
        ? Student.findOneAndDelete({ user_id: user._id })
        : Teacher.findOneAndDelete({ user_id: user._id }),

      Post.deleteMany({ owner_id: user._id }),
      Batch.deleteMany({ owner_id: user._id }),
      Notification.deleteMany({ recieverId: user._id }),
      Report.deleteMany({ reportee_id: user._id }),
      Rating.deleteMany({ ratee_id: user._id }),
    ]);

    await user.deleteOne();

    res.status(200).json(new ApiResponse(200, "User removed successfully", "success"));
  } catch (error) {
    console.error("Error removing user:", error);
    res.status(500).json(new ApiResponse(500, null, "Internal server error"));
  }
}

export { clearUserData };

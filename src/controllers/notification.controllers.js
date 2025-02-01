import Notification from "../models/notification.models.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";

const getNotifications = asyncHandler(async (req, res) => {
  try {
    const userId = req.user._id;
    const notifications = await Notification.find({ userId }).sort({ createdAt: -1 });

    res
      .status(200)
      .json(new ApiResponse(200, notifications, "success"));
  } catch (error) {
    console.error(error);
    res
      .status(error.statusCode || 500)
      .json(new ApiError(error.statusCode || 500, error.message, error.errors, error.stack));
  }
});

const sendNotifications = asyncHandler(async (req, res) => {
  const senderId = req.user._id;
  const userId = req.body.recieverId;
  const message = req.body.message;

  const notifications = Notification.create({
    userId,
    senderId,
    message
  });

  res
    .status(201)
    .json(new ApiResponse(201, "notification sent successfully", "success"));
});



const deleteNotifications = asyncHandler(async (req, res) => {
  try {
    const userId = req.user._id; 
    const notificationId = req.body.notificationId;

    const result = await Notification.findOneAndDelete({ 
      _id: notificationId, 
      userId
    });

    if (!result) {
      return res.status(404).json(new ApiError(404, "Notification not found or does not belong to the user"));
    }

    res.status(200).json(new ApiResponse(200, "Successfully deleted the notification.", "success"));
  } catch (error) {
    res
      .status(error.statusCode || 404)
      .json(new ApiError(error.statusCode || 404, error.message, error.errors, error.stack));
  }
});


export { 
  getNotifications, 
  sendNotifications,
  deleteNotifications 
};
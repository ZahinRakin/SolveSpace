import Notification from "../models/notification.models.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";

const getNotifications = asyncHandler(async (req, res) => {
  try {
    const recieverId = req.user._id;
    const notifications = await Notification.find({ recieverId }).sort({ createdAt: -1 });

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

///////// I don't think this method should be like this.
// const sendNotifications = asyncHandler(async (req, res) => {
//   const recieverId = req.params.recieverId; //recheck.
//   const senderId = req.user._id;
//   const message = req.body.message;

//   const notifications = await Notification.create({
//     recieverId,
//     senderId,
//     message
//   });

//   res
//     .status(201)
//     .json(new ApiResponse(201, "notification sent successfully", "success"));
// });
async function sendNotification(recieverID, senderID, message){
  try {
    const notification = await Notification.create({
      recieverID,
      senderID,
      message
    });
  } catch (error) {
    throw new ApiError(error.statusCode, error.message);
  }
}

async function systemNotification(recieverID, message) {
  try {
    const notifications = await Notification.create({
      recieverId: recieverID,
      senderID: null,
      message
    });
  } catch (error) {
    console.error(error);
  }
} 

const deleteNotification = asyncHandler(async (req, res) => {
  try {
    const recieverId = req.user._id; 
    const notificationId = req.body.notificationId;

    const result = await Notification.findOneAndDelete({ 
      _id: notificationId, 
      recieverId
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
  deleteNotification,

  sendNotification,
  systemNotification
};
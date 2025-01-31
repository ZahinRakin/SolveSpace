import User from "../models/users.models.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { uploadOnCloudinary, deleteFromCloudinary } from "../utils/cloudinary.js";
import fs from "fs";


const viewProfile = asyncHandler(async (req, res) => {
  try {
    const userid = req.user._id;
    const user = await User.findById(userid).select(
      "-_id -password -posts -batches -refreshToken -resetPasswordToken -resetPasswordExpires -createdAt -updatedAt"
    );

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    console.log("Fetched the data: ", user);
    res.status(200).json(user);
  } catch (error) {
    console.error("Error fetching user:", error);
    res.status(500).json({ message: "Server error" });
  }
});


const updateProfile = asyncHandler(async (req, res) => {
  const { firstname, lastname, username, email } = req.body;
  const localFilePath = req.file?.path;

  let coverImageUrl = undefined;
  if (localFilePath) {
    const response = await uploadOnCloudinary(localFilePath);
    coverImageUrl = response.secure_url;
  }

  const user = await User.findByIdAndUpdate(
    req.user._id, 
    {
      firstname,
      lastname,
      username,
      email,
      ...(coverImageUrl && { coverImage: coverImageUrl }) // Update coverImage only if a new one was uploaded
    },
    { new: true, runValidators: true } // Return updated user & validate changes
  );

  if (!user) {
    return res.status(404).json(new ApiResponse(404, "User not found", null));
  }

  res.status(200).json(new ApiResponse(200, "Profile updated successfully", user));
});


// const viewAllNotification = asyncHandler(async (req, res) => {

// });

// const addUser = asyncHandler(async (req, res) => {

// });

const deleteAccount = asyncHandler(async (req, res) => {
  const userId = req.user._id; 
  const user = await User.findByIdAndDelete(userId);
  if (!user) {
    return res.status(404).json({ error: "User not found" });
  }
  
  res.json({ message: "Account deleted successfully" });
});

export {
  deleteAccount,
  viewProfile,
  updateProfile
}
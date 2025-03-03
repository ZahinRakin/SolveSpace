import User from "../models/users.models.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { uploadOnCloudinary, deleteFromCloudinary } from "../utils/cloudinary.js";


const viewProfile = asyncHandler(async (req, res) => {
  try {
    const userid = req.user._id;
    const user = await User.findById(userid).select(
      "firstname lastname username email coverImage role"
    );

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    console.log("Fetched the data: ", user);

    res
      .status(200)
      .json(new ApiResponse(200, user, "success"));
  } catch (error) {
    console.error("Error fetching user:", error);
    res
      .status(500)
      .json(new ApiError(500, error.message, error.errors, error.stack));
  }
});

const updateProfile = asyncHandler(async (req, res) => {
  const { firstname, lastname, username, email } = req.body;
  const sslczStoreId = req.body?.sslczStoreId; //optionally available in the teacher 
  const sslczStorePassword = req.body?.sslczStorePassword; //optionally available in the teacher 
  const localFilePath = req.file?.path;
  console.log("local file path: ", localFilePath); //test

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
      ...(coverImageUrl && { coverImage: coverImageUrl }), // Update coverImage only if a new one was uploaded
      sslczStoreId,
      sslczStorePassword
    },
    { new: true, runValidators: true } // Return updated user & validate changes
  ).select("-password -refreshToken -resetPasswordToken -resetPasswordExpires -sslczStoreId -sslczStorePassword");

  if (!user) {
    return res
      .status(404)
      .json(new ApiError(404, "user not found"));
  }

  res
    .status(200)
    .json(new ApiResponse(200, user, "success"));
});

const deleteAccount = asyncHandler(async (req, res) => {
  const userId = req.user._id; 
  const user = await User.findByIdAndDelete(userId);
  if (!user) {
    return res
      .status(404)
      .json(new ApiError(404, "user not found"));
  }
  
  res
    .status(200)
    .json(new ApiResponse(200, "account deleted", "success"));
});

const getUser = asyncHandler(async (req, res) => {
  console.log("at least this has been touched.");
  const {id: user_id} = req.params;
  const user = await User.findById(user_id);
  res.status(200).json(new ApiResponse(200, user, "success"));
})

export {
  deleteAccount,
  viewProfile,
  updateProfile,
  getUser
}
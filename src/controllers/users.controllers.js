import User from "../models/users.models.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import jwt from "jsonwebtoken";

const registerUser = asyncHandler(async (req, res) => {
  const { firstname, lastname, username, email, password, role } = req.sanitizedData;

  const existingUser = await User.findOne({
    $or: [{ email: email }, { username: username }]
  });

  if (existingUser) {
    const message =
      existingUser.email === email
        ? "Email is already registered"
        : "Username is already taken";
    throw new ApiError(400, message);
  }

  let accessToken = "";
  let refreshToken = "null";
  const newUser = await User.create({
    firstname,
    lastname,
    username,
    email,
    password,
    role: role || "student",
    refreshToken
  });

  accessToken = await newUser.generateAccessToken();
  refreshToken = await newUser.generateRefreshToken();
  newUser.refreshToken = refreshToken;
  await newUser.save();

  res
    .status(201)
    .json( new ApiResponse(201, newUser.username, "Registration successful.") );
});

const loginUser = asyncHandler(async (req, res) => {
  const { username, password, rememberMe } = req.sanitizedData;

  if (!username || !password) {
    throw new ApiError(400, "Email and password are required");
  }

  const user = await User.findOne({ username });
  if (!user) {
    throw new ApiError(401, "Invalid username");
  }

  const isPasswordCorrect = await user.isPasswordCorrect(password);
  if (!isPasswordCorrect) {
    throw new ApiError(401, "Invalid password");
  }

  const accessToken = user.generateAccessToken();
  const refreshToken = user.generateRefreshToken();

  user.refreshToken = refreshToken;
  await user.save();

  //sending the access token and refreshtoken through cookies with httpOnly request.
  let maxAge = 7 * 24 * 60 * 60 * 1000; // 7 days
  if (rememberMe) {
    maxAge = 30 * 24 * 60 * 60 * 1000; // 30 days
  }
  res
    .cookie('refreshToken', refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'Strict',
        maxAge: maxAge
      })
    .setHeader('Authorization', `Bearer ${accessToken}`)
    .status(200)
    .json(new ApiResponse(200, user.username, "Login successful."));
});

//this needs to be re-evaluated.
async function generateAccessAndRefreshToken(userId) {
  try {
    const user = await User.findById(userId)
    //small check for user existence

    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();

    user.refreshToken = refreshToken;
    await user.save({validateBeforeSave: false}); //validateBeforeSave ?
    return {accessToken, refreshToken};

  } catch (error) {
    throw new ApiError(500, "Something went wrong while generating access and refresh tokens.");
  }
}

const refreshAccessToken = asyncHandler(async (req, res) => {
  const incomingRefreshToken =
    req.cookies.refreshToken ||
    req.body.refreshToken ||
    req.header("Authorization")?.replace("Bearer ", "");
  
  if (!incomingRefreshToken || typeof incomingRefreshToken !== "string") {
    throw new ApiError(400, "Invalid or missing refresh token.");
  }

  try {
    const decodedToken = jwt.verify(
      incomingRefreshToken,
      process.env.REFRESH_TOKEN_SECRET
    );

    const user = await User.findById(decodedToken?._id);

    if (!user || incomingRefreshToken !== user.refreshToken) {
      throw new ApiError(401, "Invalid or mismatched refresh token.");
    }

    const { accessToken, newRefreshToken } = await generateAccessAndRefreshToken(
      user._id
    );

    res.status(200).json({
      accessToken,
      refreshToken: newRefreshToken,
      message: "Token refreshed successfully.",
    });
  } catch (error) {
    console.error("Error during token verification:", error);

    if (error.name === "JsonWebTokenError") {
      throw new ApiError(401, "Malformed or invalid token.");
    } else if (error.name === "TokenExpiredError") {
      throw new ApiError(401, "Token expired.");
    } else {
      throw new ApiError(500, "Server error while refreshing token.");
    }
  }
});

const logoutUser = asyncHandler( async (req, res) => {
  const user = req.user;
  await User.findByIdAndUpdate(
    user._id,
    {
      $unset: { refreshToken: "" },
    },
    { new: true }
  );


  const options = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production"
  }
  res
    .status(200)
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .json( new ApiResponse(200, {}, "User logged out successfully"));
});

const deleteAccount = asyncHandler(async (req, res) => {
  const userId = req.user._id; 

  const user = await User.findByIdAndDelete(userId);

  if (!user) {
    return res.status(404).json({ error: "User not found" });
  }

  res.json({ message: "Account deleted successfully" });
});



export { 
  registerUser, 
  loginUser, 
  logoutUser,
  refreshAccessToken,
  deleteAccount
};
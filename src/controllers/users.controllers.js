import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

import User from "../models/users.models.js";
import { ApiError } from "../utils/ApiError.js";

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
  const { email, password } = req.body;

  if (!email || !password) {
    throw new ApiError(400, "Email and password are required");
  }

  const user = await User.findOne({ email: email.toLowerCase() });
  if (!user) {
    throw new ApiError(401, "Invalid email or password");
  }

  const isPasswordCorrect = await user.isPasswordCorrect(password);
  if (!isPasswordCorrect) {
    throw new ApiError(401, "Invalid email or password");
  }

  const accessToken = user.generateAccessToken();
  const refreshToken = user.generateRefreshToken();

  user.refreshToken = refreshToken;
  await user.save();
  res.status(200).json(new ApiResponse(200, user.username, "Login successful."));
});

//this needs to be re-evaluated.
const logoutUser = asyncHandler(async (req, res) => {
  const { refreshToken } = req.body;

  if (!refreshToken) {
    throw new ApiError(400, "Refresh token is required");
  }

  const user = await User.findOne({ refreshToken });

  if (!user) {
    throw new ApiError(401, "Invalid refresh token");
  }

  user.refreshToken = null;
  await user.save();

  res
    .status(200)
    .json(new ApiResponse(200, null, "Logout successful"));
});


export { registerUser, loginUser, logoutUser };
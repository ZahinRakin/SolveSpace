import jwt from "jsonwebtoken";
import crypto from 'crypto';

import User from "../models/users.models.js";
import Teacher from "../models/teacher.models.js";
import Student from "../models/student.models.js";
import UserStats from "../models/userStats.models.js";
import Admin from "../models/admin.models.js";

import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { sendEmail } from "./emailService.controllers.js";



const registerUser = asyncHandler(async (req, res) => {
  const { firstname, lastname, username, email, password, role } = req.sanitizedData;
  const sslczStoreId = req.sanitizedData?.sslczStoreId;
  const sslczStorePassword = req.sanitizedData?.sslczStorePassword;

  const existingUser = await User.findOne({ $or: [{ username }, { email }] });

  if (existingUser) {
    const message =
      existingUser.email === email
        ? "Email is already registered"
        : "Username is already taken";
    throw new ApiError(400, message);
  }

  let refreshToken = "null";
  const newUser = await User.create({
    firstname,
    lastname,
    username,
    email,
    password,
    role,
    refreshToken
  });

  try {
    if (role === "student") {
      await Student.create({
        user_id: newUser._id,
      });
    } else if (role === "teacher") {
      await Teacher.create({
        user_id: newUser._id,
        sslcz_store_id: sslczStoreId,
        sslcz_store_password: sslczStorePassword
      });
    }
  } catch (error) {
    console.error("Error in creating associated role details:", error);
    throw new ApiError(500, "Error in creating associated role details.");
  }

  try {
    refreshToken = await newUser.generateRefreshToken();
    newUser.refreshToken = refreshToken;
  } catch (error) {
    console.error("Error generating refresh token:", error);
    throw new ApiError(500, "Failed to generate refresh token.");
  }

  try {
    await updateUserStats(newUser.role, res);
    await updateAdminStats(newUser.role, res);
  } catch (error) {
    console.error("Error updating stats:", error);
    // Not throwing, so it doesn’t break the flow
  }

  await newUser.save();

  res.status(201).json(
    new ApiResponse(201, newUser.username, "Registration successful.")
  );
});


async function updateUserStats(role) {
  const month = new Date().toLocaleString('default', { month: 'long' });
  const year = new Date().getFullYear(); // Remove .toString()
  let userStats = await UserStats.findOne({ 
    month, 
    year 
  });

  if (!userStats) {
    try {
      userStats = await UserStats.create({
        month,
        year
      });
    } catch (error) {
      console.log("inside update stats function registrationlogincontroller.js", error)
    }
  }

  if (role === "student") {
    userStats.new_students += 1;
  } else if (role === "teacher") {
    userStats.new_teachers += 1;
  }

  await userStats.save();
}

async function updateAdminStats(role) {
  const admin = await Admin.findOne({}).select("total_students total_teachers");
  if (!admin) {
    throw new ApiError(500, "Internal server error - Admin record not found");
  }

  if (role === "student") {
    admin.total_students += 1;
  } else if (role === "teacher") {
    admin.total_teachers += 1;
  }

  await admin.save();
}

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

const forgetPassword = asyncHandler(async (req, res) => {
  const email = req.body.email;

  const user = await User.findOne({ email }).select("resetPasswordToken resetPasswordExpires");

  const resetToken = await crypto.randomBytes(32).toString('hex');
  const resetTokenExpiry = await Date.now() + 3600000;

  let response = "";
  
  if (user) {
    user.resetPasswordToken = resetToken;
    user.resetPasswordExpires = resetTokenExpiry;
    await user.save();


    const body = `
      <p>You requested a password reset.</p>
      <p>Copy and paste this link in the to reset your password:</p>
      <div>${resetToken}</div>
      <p>This link will expire in 1 hour.</p>
    `;
    await sendEmail(email,'Password Reset Request.', body);
    response = "Password reset token has been sent to you email";
  } else {
    response = "There is no account with this email";
  }

  res
    .status(200)
    .json({ 
      message: response
    });
});

const resetPassword = asyncHandler(async (req, res) => {
  const { token, newPassword } = req.body;

  if (!token || !newPassword) {
    return res
      .status(400)
      .json(new ApiResponse(400, null, "Token and new password are required."));
  }

  try {
    const user = await verifyResetToken(token);

    user.password = newPassword;
    user.resetPasswordToken = null;
    user.resetPasswordExpires = null;

    await user.save();

    await sendEmail(
      user.email,
      "Password Reset Successful",
      `<p>Your password has been successfully reset.</p>
       <p>If you didn't make this change, please contact support immediately.</p>`
    );

    res
      .status(200)
      .json(new ApiResponse(200, null, "Password reset successful."));
  } catch (error) {

    res
      .status(error.statusCode || 500)
      .json(
        new ApiResponse(
          error.statusCode || 500,
          null,
          error.message || "An unexpected error occurred."
        )
      );
  }
});

async function verifyResetToken(token) {
  if (!token) {
    throw new ApiError({
      statusCode: 400,
      message: "Reset token is required!",
    });
  }

  const user = await User.findOne({
    resetPasswordToken: token,
  }).select("email resetPasswordExpires");

  if (!user || user.resetPasswordExpires < Date.now()) {
    throw new ApiError({
      statusCode: 400,
      message: "Invalid or expired reset token!",
    });
  }

  return user;
}

async function generateAccessAndRefreshToken(userId) {
  try {
    const user = await User.findById(userId)
    const accessToken = await user.generateAccessToken();
    const refreshToken = await user.generateRefreshToken();

    user.refreshToken = refreshToken;
    await user.save({validateBeforeSave: false});
    return {accessToken, refreshToken};

  } catch (error) {
    throw new ApiError(500, "Something went wrong while generating access and refresh tokens.");
  }
}

const refreshAccessToken = asyncHandler(async (req, res) => {
  const incomingRefreshToken = req.cookies.refreshToken || req.body.refreshToken || req.header("Authorization")?.replace("Bearer ", "");

  if (!incomingRefreshToken || typeof incomingRefreshToken !== "string") {
    return res
      .status(400)
      .json(new ApiResponse(400, null, "Invalid or missing refresh token."));
  }

  try {
    const decodedToken = jwt.verify(incomingRefreshToken, process.env.REFRESH_TOKEN_SECRET);

    const user = await User.findById(decodedToken?._id);

    if (!user || incomingRefreshToken !== user.refreshToken) {
      return res
        .status(401)
        .json(new ApiResponse(401, null, "Invalid or mismatched refresh token."));
    }

    const { accessToken, accessToken: newRefreshToken } = await generateAccessAndRefreshToken(user._id);

    let maxAge = 30 * 24 * 60 * 60 * 1000; //here I would have to process.
    res
      .cookie('refreshToken', newRefreshToken, {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'Strict',
          maxAge: maxAge
        })
      .setHeader('Authorization', `Bearer ${accessToken}`)
      .status(200)
      .json(new ApiResponse(200, {accessToken: accessToken}, "access token refreshed"));
  } catch (error) {
    handleTokenVerificationError(error);
  }
});

function handleTokenVerificationError(error) {
  if (error.name === "JsonWebTokenError") {
    return res
      .status(401)
      .json(new ApiResponse(401, null, "Malformed or invalid token."));
  }

  if (error.name === "TokenExpiredError") {
    return res
      .status(401)
      .json(new ApiResponse(401, null, "Token expired."));
  }

  return res
    .status(500)
    .json(new ApiResponse(500, null, "Server error while refreshing token."));
}


export { 
  registerUser, 
  loginUser, 
  logoutUser,
  refreshAccessToken,
  generateAccessAndRefreshToken,
  forgetPassword,
  resetPassword
};
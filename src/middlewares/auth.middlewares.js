import jwt from "jsonwebtoken";
import User from "../models/users.models.js";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";


const verifyJWT = asyncHandler( async (req, res, next) => {
  const token = req.cookies.accessToken || req.body.accessToken || req.header("Authorization")?.replace("Bearer ", "");

  if(!token){
    return res
      .status(401)
      .json(new ApiResponse(401, null, "Unathorized token"));
  }

  try {
    const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

    const user = await User.findById(decodedToken?._id).select("-password -refreshToken");

    if(!user){
      return res
        .status(401)
        .json(new ApiResponse(401, "Unathorized user"));
    }

    req.user = user;
    next()

  } catch (error) {
    return res
      .status(401)
      .json(new ApiResponse(401, null, error?.message || "Invalid access token"));
  }
});


export { verifyJWT }
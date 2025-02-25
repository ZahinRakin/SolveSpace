import User from "../models/users.models.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";


const studentDashboard = asyncHandler(async (req, res) => {
  //here i will add recommended courses based on his previous courses.
});

const postRequest = asyncHandler(async (req, res) => {
  // Implement the logic for posting a request
});

const deleteRequest = asyncHandler(async (req, res) => {
  // Implement the logic for deleting a request
});

const updateRequest = asyncHandler(async (req, res) => {
  // Implement the logic for updating a request
});

const applyToJoin = asyncHandler(async (req, res) => {
  // Implement the logic for applying to join
});

const cancelJoin = asyncHandler(async (req, res) => {
  // Implement the logic for canceling a join request
});

const searchTeacher = asyncHandler(async (req, res) => {
  // Implement the logic for searching a teacher
});




export {
  studentDashboard,
  postRequest,
  deleteRequest,
  updateRequest,
  applyToJoin,
  cancelJoin,
  searchTeacher
};
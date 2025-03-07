import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import Batch from "../models/batch.models.js";
import User from "../models/users.models.js";
import { updateAdminStats } from "./admin.controllers.js";

import { systemNotification, sendNotification } from "./notification.controllers.js";
import { sendEmail } from "./emailService.controllers.js";

const createBatch = asyncHandler(async (req, res) => {
  const {
    user: { _id: owner_id, role: owner },
    body: batchInfo
  } = req;

  batchInfo.owner_id = owner_id;
  batchInfo.owner = owner;

  const batchFilter = [
    "owner_id", "owner", "teacher_id", "subject", "class", 
    "weekly_schedule", "time", "salary", "is_continuous", 
    "is_batch", "student_ids"
  ];

  const sanitizedBatchInfo = Object.keys(batchInfo)
    .filter(key => batchFilter.includes(key))
    .reduce((obj, key) => {
      obj[key] = batchInfo[key];
      return obj;
    }, {});

  try {
    const batch = await Batch.create(sanitizedBatchInfo);

    await updateAdminStats(0, 1);

    res.status(201).json(new ApiResponse(201, batch, "Batch created successfully"));
  } catch (error) {
    res.status(400).json(new ApiResponse(400, null, error.message || "Failed to create batch"));
  }
});

const addUserToBatch = asyncHandler(async (req, res) => {
  const {
    params: { batch_id, user_id },
    user: { _id: owner_id }
  } = req;

  const batch = await Batch.findById(batch_id).select("teacher_id owner_id student_ids");
  if (!batch) {
    return res.status(404).json(new ApiResponse(404, null, "Batch not found"));
  }
  if (!batch.owner_id.equals(owner_id)) {
    return res.status(403).json(new ApiResponse(403, null, "You don't own the batch"));
  }

  const user = await User.findById(user_id).select("_id role");
  if (!user) {
    return res.status(404).json(new ApiResponse(404, null, "User not found"));
  }

  if (user.role === "teacher") {
    return res.status(400).json(new ApiResponse(400, null, "One batch can have only one teacher."));
  }

  if (batch.student_ids.includes(user._id)) {
    return res.status(409).json(new ApiResponse(409, null, "User already part of the batch."));
  }

  batch.student_ids.push(user._id);
  await batch.save();
  await systemNotification(user._id, `You have been added to the batch [${batch._id}]`);

  res.status(200).json(new ApiResponse(200, null, "User added to the batch successfully"));
});

const removeUserFromBatch = asyncHandler(async (req, res) => {
  const {
    params: { batch_id, user_id },
    user: { _id: owner_id }
  } = req;

  const batch = await Batch.findById(batch_id).select("owner_id student_ids");
  if (!batch) {
    return res.status(404).json(new ApiResponse(404, null, "Batch not found"));
  }
  if (!batch.owner_id.equals(owner_id)) {
    return res.status(403).json(new ApiResponse(403, null, "You don't own the batch"));
  }

  const idx = batch.student_ids.indexOf(user_id);
  if (idx === -1) {
    return res.status(404).json(new ApiResponse(404, null, "Specified user not part of the batch."));
  }

  batch.student_ids.splice(idx, 1);
  await batch.save();

  res.status(200).json(new ApiResponse(200, null, "User removed from batch successfully"));
});

const destroyBatch = asyncHandler(async (req, res) => {
  const {
    params: { id: batch_id },
    user: { _id: owner_id, role }
  } = req;

  const batch = await Batch.findById(batch_id).select("owner_id student_ids");
  if (!batch) {
    return res.status(404).json(new ApiResponse(404, null, "Batch not found"));
  }
  if (role !== "teacher" && !batch.owner_id.equals(owner_id)) {
    return res.status(403).json(new ApiResponse(403, null, "You don't own the batch and you are not the teacher of the batch."));
  }

  const student_ids = batch.student_ids;
  if (student_ids.length) {
    await Promise.all(
      student_ids.map(user_id =>
        systemNotification(user_id, `${batch._id} batch has been deleted`)
      )
    );
  }

  await Batch.findByIdAndDelete(batch_id);

  await updateAdminStats(0, -1); //under construction

  res.status(200).json(new ApiResponse(200, null, "Batch successfully deleted"));
});

const updateBatch = asyncHandler(async (req, res) => {
  const {
    params: { id: batch_id },
    user: { _id: owner_id },
    body: updates
  } = req;

  const allowedUpdates = ["teacher_id", "subject", "class", "weekly_schedule", "time", "salary", "is_continuous", "is_batch"];
  const filteredUpdates = Object.keys(updates)
    .filter(key => allowedUpdates.includes(key))
    .reduce((obj, key) => {
      obj[key] = updates[key];
      return obj;
    }, {});

  const batch = await Batch.findById(batch_id);
  if (!batch) {
    return res.status(404).json(new ApiResponse(404, null, "Batch not found"));
  }
  if (!batch.owner_id.equals(owner_id)) {
    return res.status(403).json(new ApiResponse(403, null, "You don't own the batch"));
  }

  batch.set(filteredUpdates);

  try {
    await batch.save();
    res.status(200).json(new ApiResponse(200, batch, "Batch updated successfully"));
  } catch (error) {
    res.status(400).json(new ApiResponse(400, null, error.message));
  }
});

const getYourBatches = asyncHandler(async (req, res) => {
  try {
    const { _id: user_id } = req.user;

    const batches = await Batch
      .find({
        $or: [
          { owner_id: user_id }, // Batches where the user is the owner
          { 
            $and: [
              { $or: [{ teacher_id: user_id }, { student_ids: user_id }] }, // Batches where the user is a teacher or student
              { owner_id: { $ne: user_id } } // Ensure that the user is not the owner
            ]
          }
        ]
      })
      .populate("owner_id", "username")
      .populate("student_ids", "username")
      .populate("teacher_id", "username")
      .lean();

    res.status(200).json(new ApiResponse(200, batches, "success"));
  } catch (error) {
    res.status(500).json(new ApiResponse(500, null, "Server Error"));
  }
});

const askForPayment = asyncHandler(async (req, res) => {
  const { _id: teacher_id } = req.body;
  const { id: batch_id } = req.params;

  const batch = await Batch.findById(batch_id);
  if (!batch) {
    return res.status(404).json(new ApiResponse(404, null, "Batch not found"));
  }

  const student_ids = batch.student_ids;

  const students = await User.find({ _id: { $in: student_ids } });

  if (!students.length) {
    return res.status(404).json(new ApiResponse(404, null, "No students found in this batch"));
  }

  const updatePromises = students.map(async (student) => {
    student.time_to_pay = true;
    await student.save();

    sendNotification(student._id, teacher_id, `Teacher is asking for payment from batch[${batch_id}].`);
    sendEmail(student.email, "Payment notice", `Teacher is asking for payment from batch[${batch_id}].`);
  });

  // Execute all updates in parallel
  await Promise.all(updatePromises);

  res.status(200).json(new ApiResponse(200, batch, "Successfully asked for payment."));
});


export {
  addUserToBatch,
  removeUserFromBatch,
  destroyBatch,
  updateBatch,
  getYourBatches,
  createBatch,
  askForPayment
}
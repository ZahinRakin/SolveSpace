import { asyncHandler } from "../utils/asyncHandler";
import { ApiResponse } from "../utils/ApiResponse";
import Batch from "../models/batch.models";
import User from "../models/users.models";

import { systemNotification } from "./notification.controllers";



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
    user: { _id: owner_id }
  } = req;

  const batch = await Batch.findById(batch_id).select("owner_id student_ids");
  if (!batch) {
    return res.status(404).json(new ApiResponse(404, null, "Batch not found"));
  }
  if (!batch.owner_id.equals(owner_id)) {
    return res.status(403).json(new ApiResponse(403, null, "You don't own the batch"));
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

  res.status(200).json(new ApiResponse(200, null, "Batch successfully deleted"));
});

const paymentSystem = asyncHandler(async(req, res) => {
  //have to do something is order to do the payment thing.
});

export {
  addUserToBatch,
  removeUserFromBatch,
  destroyBatch
}
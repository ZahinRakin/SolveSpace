import mongoose, { Schema } from "mongoose";
import User from "./users.models.js";

const batchSchema = new Schema({
  teacher_id: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  class: {
    type: String,
    required: true,
    enum: ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "12", "hons", "masters"]
  },
  subject: {
    type: String,
    required: true,
  },
  date: {
    type: String,
    required: true
  },
  time: {
    type: String,
    required: true
  },
  student_ids:[
    {
      type: Schema.Types.ObjectId,
      ref: "User"
    },
  ]
},{timestamps: true});


const Batch = mongoose.model("Batch", batchSchema);
export default Batch;
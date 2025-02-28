import mongoose, { Schema } from "mongoose";
import User from "./users.models.js";
import Batch from "./batch.models.js";

const studentSchema = new Schema({
  user_id: {
    type: Schema.Types.ObjectId,
    ref: "User"
  },
  prev_courses: [
    {
      type: Schema.Types.ObjectId,
      ref: "Batch"
    }
  ]
},{timestamps: true});

const Student = mongoose.model("Student", studentSchema);
export default Student;
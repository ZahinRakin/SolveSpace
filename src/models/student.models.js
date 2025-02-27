import mongoose, { Schema } from "mongoose";
import User from "./users.models.js";
import Post from "./post.models.js";

const studentSchema = new Schema({
  user_id: {
    type: Schema.Types.ObjectId,
    ref: "User"
  },
  prev_courses: [
    {
      type: Schema.Types.ObjectId,
      ref: "Post"
    }
  ]
},{timestamps: true});

const Student = mongoose.model("Student", studentSchema);
export default Student;
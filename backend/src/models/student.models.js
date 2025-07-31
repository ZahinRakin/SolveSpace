import mongoose, { Schema } from "mongoose";

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
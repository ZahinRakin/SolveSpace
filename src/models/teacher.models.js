import mongoose, { Schema } from "mongoose";
import User from "./users.models.js";

const teacherSchema = new Schema({
  user_id: {
    type: Schema.Types.ObjectId,
    ref: "User"
  },
  sslcz_store_id: {
    type: String,
    default: null
  },
  sslcz_store_password: {
    type: String,
    default: null
  }
},{timestamps: true});


const Teacher = mongoose.model("Teacher", teacherSchema);
export default Teacher;
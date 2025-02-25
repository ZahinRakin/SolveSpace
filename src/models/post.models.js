import mongoose, { Schema } from "mongoose";
import User from "./users.models";

const postSchema = new Schema({
  // Owner details (who created the post)
  owner_id: {
    type: String,
    required: true,
  },
  owner: {
    type: String,
    enum: ["teacher", "student"],
    required: true
  },

  // Batch details (whether it's a batch or not, max size)
  is_batch: {
    type: Boolean,  // Corrected the type to "Boolean"
    required: true,
    default: false
  },
  max_size: {
    type: Number,  // Corrected the type to "Number"
    default: 1
  },

  // Subject and class details
  subject: {
    type: String,
    lowercase: true,
  },
  class: {
    type: String,
    required: true,
    enum: ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "12", "hons", "masters"]
  },

  // Title, subtitle, and description
  title: {
    type: String
  },
  subtitle: {
    type: String
  },
  description: {
    type: String
  },

  // Schedule and time for the session
  schedule: {
    type: String,
    enum: ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
    required: true
  },
  time: {
    type: String,  // Store the time as a string (e.g., "10:00 AM")
    required: true
  },

  // Interested teachers and students
  interested_teachers: [
    {
      type: Schema.Types.ObjectId,
      ref: "User"
    }
  ],
  interested_students: [
    {
      type: Schema.Types.ObjectId,
      ref: "User"
    }
  ]
}, {timestamps: true});

const Post = mongoose.model("Post", postSchema);
export default Post;

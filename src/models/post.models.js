import mongoose, { Schema } from "mongoose";

const postSchema = new Schema({
  owner_id: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  owner: {
    type: String,
    enum: ["teacher", "student"],
    required: true
  },


  subject: {
    type: String,
    lowercase: true,
    trim: true
  },

  class: {
    type: String,
    required: true,
    enum: ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "12", "hons", "masters"],
    trim: true,
    lowercase: true
  },


  title: {
    type: String,
    required: true,
    trim: true
  },
  subtitle: {
    type: String,
    trim: true
  },
  description: {
    type: String,
    trim: true
  },


  weekly_schedule: [
    {
      type: String,
      enum: ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
      required: true
    }
  ],
  time: {
    type: String,  //(e.g., "10:00 AM")
    required: true
  },
  salary: {
    type: Number,
    defualt: 0,
  },


  is_continuous: {
    type: Boolean,
    default: false
  },
  is_batch: {
    type: Boolean,
    default: false
  },
  max_size: {
    type: Number,
    default: 2
  },


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

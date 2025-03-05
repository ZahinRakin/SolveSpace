import mongoose, { Schema } from "mongoose";

const adminSchema = new Schema({
  user_id: { 
    type: Schema.Types.ObjectId, 
    ref: "User", 
    required: true 
  },
  reports: [
    {
      type: Schema.Types.ObjectId,
      ref: "Report",
    }
  ],
  total_students: { 
    type: Number, 
    default: 0 
  },
  total_teachers: { 
    type: Number, 
    default: 0 
  },
  total_posts: { 
    type: Number, 
    default: 0 
  },
  total_batches: { 
    type: Number, 
    default: 0 
  }
}, { timestamps: true });

const Admin = mongoose.model("Admin", adminSchema);
export default Admin;
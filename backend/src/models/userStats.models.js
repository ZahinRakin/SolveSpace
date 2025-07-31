import mongoose, { Schema } from "mongoose";

const UserStatsSchema = new mongoose.Schema({
  month: {
    type: String,
    enum: [
      "January", "February", "March", "April", "May", "June", 
      "July", "August", "September", "October", "November", "December"
    ],
    required: true
  },
  year: {
    type: Number,
    required: true
  },
  new_students: {
    type: Number,
    default: 0
  },
  new_teachers: {
    type: Number,
    default: 0
  },
});

const UserStats = mongoose.model("UserStats", UserStatsSchema);
export default UserStats;
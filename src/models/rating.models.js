import mongoose, { Schema } from "mongoose";

const ratingSchema = new Schema({
  raterId: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  rateeId: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  rating: {
    type: Number,  
    required: true
  },
  review: {
    type: String,
    required: true
  }
}, { timestamps: true });

const Rating = mongoose.model("Rating", ratingSchema);
export default Rating;

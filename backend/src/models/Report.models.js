import mongoose, { Schema } from "mongoose";

const reportSchema = new Schema({
  reporter_id: {
    type: Schema.Types.ObjectId,
    ref: "User"
  },
  reportee_id: {
    type: Schema.Types.ObjectId,
    ref: "User"
  },
  message: {
    type: String,
    required: true
  }
},{timestamps: true});


const Report = mongoose.model("Report", reportSchema);
export default Report;
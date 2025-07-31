import mongoose, { Schema } from "mongoose";

const batchSchema = new Schema({
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
  teacher_id: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true
  },

  subject: {
    type: String,
    required: true,
  },

  class: {
    type: String,
    required: true,
    enum: ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "12", "hons", "masters"]
  },
  
  weekly_schedule: 
  [
    {
      type: String,
      enum: ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
      required: true
    }
  ],
  time: {
    type: String,
    required: true
  },
  salary: {
    type: Number,
    defualt: 0,
  },
  time_to_pay: {
    type: Boolean,
    default: false
  },

  join_class_link: {
    type: String,
    default: null
  },


  is_continuous: {
    type: Boolean,
    default: false
  },
  is_batch: {
    type: Boolean,
    default: false
  },
  student_ids:[
    {
      type: Schema.Types.ObjectId,
      ref: "User"
    },
  ]
},{timestamps: true});


const Batch = mongoose.model("Batch", batchSchema);
export default Batch;
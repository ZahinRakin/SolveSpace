import mongoose, { Schema } from "mongoose";

const paymentSchema = new Schema({
  trnx_id: { 
    type: String, 
    required: true, 
    unique: true 
  },
  student_id: { 
    type: Schema.Types.ObjectId, 
    ref: "Student", 
    required: true 
  },
  batch_id: {
    type: Schema.Types.ObjectId,
    refPath: "batch_model", //inquire about it when working with this payment model.
    required: true
  },
  batch_model: { 
    type: String, 
    required: true, 
    enum: ["TuitionPost", "TutorRequest"] 
  },
  amount: { 
    type: Number, 
    required: true 
  },
  currency: { 
    type: String, 
    default: "BDT" 
  },
  payment_status: { 
    type: String, 
    enum: ["Pending", "Completed", "Failed", "Canceled"], 
    default: "Pending" 
  },
  payment_method: { 
    type: String, 
    required: true 
  },
  val_id: { 
    type: String 
  },
  gateaway_response: { 
    type: Object 
  }, // Store raw response from SSLCommerz
  fail_reason: { 
    type: String 
  },
}, { timestamps: true });

const Payment = mongoose.model("Payment", paymentSchema);
export default Payment;

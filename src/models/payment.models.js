import mongoose, { Schema } from "mongoose";

const paymentSchema = new Schema({
  trnx_id: { 
    type: String, 
    required: true, 
    unique: true 
  },
  student_id: { 
    type: Schema.Types.ObjectId, 
    ref: "User", 
    required: true 
  },
  batch_id: {
    type: Schema.Types.ObjectId,
    ref: "Post",
    required: true
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
  },
  payment_method: { 
    type: String, 
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

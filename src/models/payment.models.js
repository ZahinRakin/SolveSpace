import mongoose, { Schema } from "mongoose";

const paymentSchema = new Schema({
  
},{timestamps: true});


const Payment = mongoose.model("Payment", paymentSchema);
export default Payment;
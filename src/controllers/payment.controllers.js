import SSLCommerzPayment from 'sslcommerz-lts';
import { v4 as uuidv4 } from 'uuid';
import { asyncHandler } from '../utils/asyncHandler.js';
import Payment from '../models/payment.models.js';
import User from '../models/users.models.js';
import Batch from '../models/batch.models.js';
import { ApiError } from '../utils/ApiError.js';
import Teacher from '../models/teacher.models.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import { sendEmail } from './emailService.controllers.js';

// need: verifyJWT, totalAmount, productName, batchId, teacherId method: post
const sslczPay = asyncHandler(async (req, res) => { 
  const { totalAmount, productName, batchId, teacherId } = req.body;
  console.log(`total amount: ${totalAmount} -- productname: ${productName} -- batchId: ${batchId} -- teacherid: ${teacherId}`); //debug === reached
  const studentId = req.user._id;
  console.log(`user: ${studentId}`); //debug === reached

  // Checking if student is part of the batch
  const batch = await Batch.findById(batchId).select("student_ids");

  console.log(`batch: ${batch}`); //debug

  if (!batch) {
    return res.status(404).json(new ApiResponse(404, "Batch nowhere", "Batch not found"));
  }

  if (!batch.student_ids.includes(studentId)) {
    return res.status(400).json(new ApiResponse(400, "You are alien", "You are not part of the batch"));
  }

  // Fetch teacher's SSLCommerz credentials
  const teacher = await Teacher
    .findOne({user_id: teacherId})
    .select("sslcz_store_id sslcz_store_password")
    .lean();
  
  console.log("teacher: ", teacher); //debugging log.

  if (!teacher || !teacher.sslcz_store_id || !teacher.sslcz_store_password) {
    return res.status(400).json(new ApiResponse(400,"SSL problem", "Teacher's SSLCommerz credentials are missing"));
  }

  const cus_name = `${req.user.firstname} ${req.user.lastname}`;
  const tranId = uuidv4(); // Generate a unique transaction ID

  const data = {
    total_amount: totalAmount,
    currency: "BDT",
    tran_id: tranId,
    success_url: process.env.SSLCOMMERZ_SUCCESS_URL,
    fail_url: process.env.SSLCOMMERZ_FAIL_URL,
    cancel_url: process.env.SSLCOMMERZ_CANCEL_URL,
    ipn_url: process.env.SSLCOMMERZ_IPN_URL,
    shipping_method: "NO",
    product_name: productName,
    product_category: "Education",
    product_profile: "non-physical-goods",
    cus_name,
    cus_email: req.user.email,
    cus_phone: "01614211335",
  };

  try {
    const sslcz = new SSLCommerzPayment(
      teacher.sslcz_store_id, 
      teacher.sslcz_store_password, 
      process.env.SSLCOMMERZ_IS_LIVE?.toLowerCase() === "true"
    );

    const apiResponse = await sslcz.init(data);

    // Saving partial info in DB
    await Payment.create({
      trnx_id: tranId,
      student_id: studentId,
      teacher_id: teacherId,
      batch_id: batchId,
      amount: totalAmount,
      currency: "BDT",
    });

    if (apiResponse && apiResponse.GatewayPageURL) {
      console.log("Redirecting to:", apiResponse.GatewayPageURL);
      return res.json({redirectUrl: apiResponse.GatewayPageURL});
    } else {
      throw new Error("Failed to initiate SSLCommerz payment session");
    }
  } catch (error) {
    console.error("SSLCommerz Payment Error:", error);
    return res.status(500).json({ status: "error", message: error.message });
  }
});


const sslczSuccess = asyncHandler(async (req, res) => {
  console.log("inside success"); //debugging log
  const { val_id, amount, status, tran_id, card_type } = req.body;

  console.log(`val id: ${val_id} amount: ${amount} status: ${status} trnxid: ${tran_id} card type: ${card_type}`); //debugging log.
  const payment = await Payment.findOne({ trnx_id: tran_id })
    .select("teacher_id")
    .populate("student_id", "email username");
  if (!payment) {
    throw new Error("Payment record not found");
  }

  const { sslcz_store_id, sslcz_store_password } = await Teacher.findOne({user_id: payment.teacher_id})
    .select("sslcz_store_id sslcz_store_password")
    .lean();
  console.log(`sslcz store id: ${sslcz_store_id}  sslcz store password: ${sslcz_store_password}`); //debugging log.

  try {
    const sslcz = new SSLCommerzPayment(
      sslcz_store_id,
      sslcz_store_password,
      process.env.SSLCOMMERZ_IS_LIVE?.toLowerCase() === "true"
    );

    const validationData = await sslcz.validate({ val_id });

    console.log(`validation data: ${validationData}`); //debugging log.

    if (validationData.status === "VALID" && validationData.amount == amount) {
      console.log("Payment validated successfully:", validationData);

      // Update the payment in the database
      const payment = await Payment.findOneAndUpdate(
        { trnx_id: tran_id },
        {
          payment_status: validationData.status,
          payment_method: card_type || "Unknown",
          val_id: val_id,
          gateaway_response: validationData, // Store raw response
        },
        { new: true }
      );

      if (!payment) {
        return res.status(404).json({ status: "error", message: "Payment record not found" });
      }
      return res
        .redirect("http://localhost:5173/payment/success");
    } else {
      return res.status(400).json({ status: "failed", message: "Payment validation failed" });
    }
  } catch (error) {
    console.error("SSLCommerz validation error:", error);
    return res.status(500).json({ error: "Payment validation failed", details: error.message });
  }
});


const sslczFailure = asyncHandler(async (req, res) => {
  console.log("inside failure"); //debugging log
  const { tran_id, status, error, amount, currency, fail_reason } = req.body;

  console.error("Payment Failed:", {
    tran_id,
    status,
    error,
    amount,
    currency,
    fail_reason,
  });

  try {
    const payment = await Payment.findOneAndUpdate(
      { trnx_id: tran_id },
      {
        payment_status: status || "FAILED",
        fail_reason: fail_reason || error || "Unknown reason",
        gateaway_response: req.body,
      },
      { new: true }
    );

    if (!payment) {
      return res.status(404).json({ status: "error", message: "Payment record not found" });
    }

    return res.status(400).json({
      success: false,
      message: "Payment failed",
      transaction_id: tran_id,
      error: fail_reason || error,
      details: req.body,
    });
  } catch (dbError) {
    console.error("Database Update Error:", dbError);
    return res.status(500).json({
      status: "error",
      message: "Failed to update payment record",
      details: dbError.message,
    });
  }
});



const sslczCancel = asyncHandler(async (req, res) => {
  console.log("inside cancel"); //debugging log
  const { tran_id, status, error, amount, currency, cancel_reason } = req.body;

  console.log("Canceled transaction data: ", req.body);

  try {
    const payment = await Payment.findOneAndUpdate(
      { trnx_id: tran_id },
      {
        payment_status: "CANCELED",
        fail_reason: cancel_reason || error || "User canceled the payment",
        gateaway_response: req.body, 
      },
      { new: true }
    );

    if (!payment) {
      return res.status(404).json({ status: "error", message: "Payment record not found" });
    }
    return res.status(200).json({
      status: "canceled",
      message: "Payment was canceled by the user",
      transaction_id: tran_id,
      cancel_reason: cancel_reason || error || "User canceled",
      details: req.body,
    });
  } catch (dbError) {
    console.error("Database Update Error:", dbError);
    return res.status(500).json({
      status: "error",
      message: "Failed to update payment record after cancellation",
      details: dbError.message,
    });
  }
});



const sslczIPN = asyncHandler(async (req, res) => {
    console.log("inside ipn"); //debugging log
  const { val_id, amount, status, tran_id, currency } = req.body;

  const payment = await Payment.findOne({ trnx_id: tran_id }).select("teacher_id");
  if (!payment) {
    throw new Error("Payment record not found");
  }

  const { sslcz_store_id, sslcz_store_password } = await Teacher.findOne({user_id: payment.teacher_id})
    .select("sslcz_store_id sslcz_store_password")
    .lean();
    
  const sslcz = new SSLCommerzPayment(
    sslcz_store_id,
    sslcz_store_password,
    process.env.SSLCOMMERZ_IS_LIVE?.toLowerCase() === "true"
  );

  try {
    const validationData = await sslcz.validate({ val_id });

    if (validationData.status === "VALID" && validationData.amount === amount) {
      console.log("IPN Payment validated successfully:", validationData);

      const payment = await Payment.findOne({ trnx_id: tran_id });

      if (payment) {
        payment.payment_status = "SUCCESS";
        payment.val_id = val_id;
        payment.gateaway_response = req.body;

        await payment.save();
      } else {
        await Payment.create({
          trnx_id: tran_id,
          amount,
          currency,
          payment_status: "SUCCESS",
          val_id,
          gateaway_response: req.body,
        });
      }
      return res
        .redirect("http://localhost:5173/payment/success");
    } else {
      console.log("IPN Payment validation failed:", validationData);
      return res.status(400).json({
        status: "failed",
        message: "Payment validation failed",
        details: validationData,
      });
    }
  } catch (error) {
    console.error("SSLCommerz IPN validation error:", error);
    return res.status(500).json({
      status: "error",
      message: "Failed to validate payment through IPN",
      details: error.message,
    });
  }
});

const getLatestPayment = asyncHandler(async (req, res) => {
  console.log("get last payment has been hit: "); //debugging log.
  const user_id = req.user._id;
  const lastPayment = await Payment.findOne({ student_id: user_id }).sort({ createdAt: -1 });
  console.log("last payment: ", lastPayment); //debugging log.
  if(!lastPayment){
    return res
      .status(300)
      .json(new ApiResponse(200, lastPayment, "no payments yet"));
  }
  return res
    .status(200)
    .json(new ApiResponse(200, lastPayment, "success"));
});



export { 
  sslczPay, 
  sslczSuccess, 
  sslczFailure, 
  sslczCancel, 
  sslczIPN,
  getLatestPayment
};
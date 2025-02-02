import SSLCommerzPayment from 'sslcommerz-lts';
import { v4 as uuidv4 } from 'uuid';
import { asyncHandler } from '../utils/asyncHandler.js';

const sslczPay = asyncHandler(async (req, res) => {
  const {total_amount, product_name, } = req.body;
  const cus_name = `${req.user.firstname} ${req.user.lastname}`;

  console.log(`total amount: ${total_amount} ---- product name: ${product_name} ---- cus_name: ${cus_name}----`);
  const data = {
    total_amount,
    currency: 'BDT',
    tran_id: uuidv4(),
    success_url: process.env.SSLCOMMERZ_SUCCESS_URL,
    fail_url: process.env.SSLCOMMERZ_FAIL_URL,
    cancel_url: process.env.SSLCOMMERZ_CANCEL_URL,
    ipn_url: process.env.SSLCOMMERZ_IPN_URL,
    shipping_method: 'Courier',
    product_name,
    product_category: 'Education',
    product_profile: 'Online tuition',
    cus_name,
    cus_email: req.user.email,
    // cus_add1: 'Dhaka',
    // cus_add2: 'Dhaka',
    // cus_city: 'Dhaka',
    // cus_state: 'Dhaka',
    // cus_postcode: '1000',
    // cus_country: 'Bangladesh',
    cus_phone: '01614211335',
    // cus_fax: '01614211335',
    ship_name: cus_name,
    ship_add1: 'Dhaka',
    // ship_add2: 'Dhaka',
    ship_city: 'Dhaka',
    // ship_state: 'Dhaka',
    ship_postcode: 1000,
    ship_country: 'Bangladesh',
  };

  const sslcz = new SSLCommerzPayment(
    process.env.SSLCOMMERZ_STORE_ID, 
    process.env.SSLCOMMERZ_STORE_PASSWORD, 
    process.env.SSLCOMMERZ_IS_LIVE?.toLowerCase() === 'true'
  );

  sslcz.init(data)
    .then(apiResponse => {
      let GatewayPageURL = apiResponse.GatewayPageURL
      res.redirect(GatewayPageURL)
      console.log('Redirecting to: ', GatewayPageURL);
    })
    .catch(error => {
      return res
        .status(500)
        .json({ status: 'error', message: error.message });
    });
});


const sslczSuccess = asyncHandler(async (req, res) => {
  const { val_id, amount, status } = req.body;

  const sslcz = new SSLCommerzPayment(
    process.env.SSLCOMMERZ_STORE_ID, 
    process.env.SSLCOMMERZ_STORE_PASSWORD, 
    process.env.SSLCOMMERZ_IS_LIVE?.toLowerCase() === 'true'
  );

  try {
    const validationData = await sslcz.validate({ val_id });

    if (validationData.status === "VALID" && validationData.amount === amount) {
      console.log("Payment validated successfully:", validationData);

      // Store payment details in the database (Order completed)
      // Example: await Order.update({ transaction_id: val_id, status: "Paid" });

      return res.status(200).json({ status: "success", data: validationData });
    } else {
      return res.status(400).json({ status: "failed", message: "Payment validation failed" });
    }
  } catch (error) {
    console.error("SSLCommerz validation error:", error);
    return res.status(500).json({ error: "Payment validation failed", details: error.message });
  }
});



const sslczFailure = asyncHandler(async (req, res) => {
  const { tran_id, status, error, amount, currency } = req.body;

  console.error("Payment Failed:", {
    tran_id,
    status,
    error,
    amount,
    currency,
  });

  // TODO: Store the failed transaction in the database
  // Save `tran_id`, `status`, `error`, `amount`, `currency`, and `timestamp`
  // This helps in tracking failed payments

  return res
    .status(400)
    .json({
      success: false,
      message: "Payment failed",
      transaction_id: tran_id,
      error,
      details: req.body,
    });
});


const sslczCancel = asyncHandler(async (req, res) => {
  console.log("Canceled transaction data: ", req.body);

  return res.status(200).json({
    status: "canceled",
    message: "Payment was canceled by the user",
    details: req.body,
  });
});


const sslczIPN = asyncHandler(async (req, res) => {
  const { val_id, amount, status } = req.body;

  const sslcz = new SSLCommerzPayment(
    process.env.SSLCOMMERZ_STORE_ID, 
    process.env.SSLCOMMERZ_STORE_PASSWORD, 
    process.env.SSLCOMMERZ_IS_LIVE?.toLowerCase() === 'true'
  );

  try {
    const validationData = await sslcz.validate({ val_id });

    if (validationData.status === "VALID" && validationData.amount === amount) {
      console.log("IPN Payment validated successfully:", validationData);

      // ✅ Store payment details in the database
      return res.status(200).json({ status: "success", data: validationData });
    } else {
      return res.status(400).json({ status: "failed", message: "Payment validation failed" });
    }
  } catch (error) {
    console.error("SSLCommerz validation error:", error);
    return res.status(500).json({ error: "Payment validation failed", details: error.message });
  }
});


export { 
  sslczPay, 
  sslczSuccess, 
  sslczFailure, 
  sslczCancel, 
  sslczIPN 
};
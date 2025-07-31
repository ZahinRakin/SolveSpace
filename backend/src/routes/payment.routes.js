import { Router } from 'express';
import { sslczPay, sslczSuccess, sslczFailure, sslczCancel, sslczIPN, getLatestPayment } from '../controllers/payment.controllers.js';
import { verifyJWT } from '../middlewares/auth.middlewares.js';

const router = Router();

router.route('/pay').post(verifyJWT, sslczPay);
router.route('/success').post(sslczSuccess);
router.route('/failure').post(sslczFailure);
router.route('/cancel').post(sslczCancel);
router.route('/ipn').post(sslczIPN);
router.route('/get-last-payment').get(verifyJWT, getLatestPayment);


export default router;


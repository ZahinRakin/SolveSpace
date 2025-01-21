import { Router } from "express";

import { forgetPassword, resetPassword } from "../controllers/root.controllers.js";
import { validateEmail, validatePassword } from "../middlewares/validate.middlewares.js";

const router = Router();

router.route('/forget-password').post(validateEmail, forgetPassword);
router.route('/reset-password').post(validatePassword, resetPassword);

export default router;
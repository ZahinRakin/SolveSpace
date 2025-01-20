import { Router } from "express";

import { forgetPassword, veryfyResetToken, resetPassword } from "../controllers/root.controllers.js";
import { validateEmail } from "../middlewares/validate.middlewares.js";

const router = Router();

router.route('/forget-password').post(validateEmail, forgetPassword);
import { Router } from "express";
import { upload } from "../middlewares/multer.middlewares.js"; //this will be in need in the future.

import { 
  registerUser, 
  loginUser, 
  logoutUser, 
  refreshAccessToken, 
  forgetPassword,
  resetPassword
} from "../controllers/registrationLogin.controllers.js";

import { 
  validateRegistration, 
  validateLogin,
  validateEmail,
  validatePassword
} from "../middlewares/validate.middlewares.js";

import { verifyJWT } from "../middlewares/auth.middlewares.js";

const router = Router();

router.route("/register").post(validateRegistration, registerUser);
router.route("/login").post(validateLogin, loginUser);
router.route("/refresh-accesstoken").post(refreshAccessToken);
router.route('/forget-password').post(validateEmail, forgetPassword);
router.route('/reset-password').post(validatePassword, resetPassword);
//protected routes.
router.route("/logout").post(verifyJWT, logoutUser);

export default router;
import { Router } from "express";

import { registerUser, loginUser, logoutUser, refreshAccessToken, deleteAccount } from "../controllers/users.controllers.js";
import { upload } from "../middlewares/multer.middlewares.js"; //this will be needed to deal with multipart form.
import { validateRegistration, validateLogin } from "../middlewares/validate.middlewares.js";
import { verifyJWT } from "../middlewares/auth.middlewares.js";

const router = Router();

router.route("/register").post(validateRegistration, registerUser);
router.route("/login").post(validateLogin, loginUser);
router.route("/refresh-accesstoken").post(refreshAccessToken);


//protected routes.
router.route("/logout").post(verifyJWT, logoutUser);
router.route("/delete-account").delete(verifyJWT, deleteAccount);

export default router;
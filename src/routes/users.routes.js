import { Router } from "express";

import { registerUser, loginUser } from "../controllers/users.controllers.js";
import { upload } from "../middlewares/multer.middlewares.js";
import validateRegistration from "../middlewares/validate.middlewares.js";

const router = Router();

router.route("/register").post(
  validateRegistration,
  registerUser
);
router.route("/login").post(loginUser)

export default router;
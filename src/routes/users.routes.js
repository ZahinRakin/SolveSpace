import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middlewares.js";
import { deleteAccount, viewProfile, updateProfile } from "../controllers/users.controllers.js";
import { upload } from "../middlewares/multer.middlewares.js";

const router = Router();

router.route("/viewprofile").get(verifyJWT, viewProfile);
router.route("/deleteaccount").delete(verifyJWT, deleteAccount);
router.route("/updateprofile").post(
  verifyJWT, 
  upload.single('coverImage'), 
  updateProfile
);


export default router;
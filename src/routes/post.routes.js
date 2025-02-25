import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middlewares.js";
import { 
  teacherDashboard,
  postTuition,
  deleteTuition,
  showInterest,
  cancelInterest,
  searchStudent,
} from "../controllers/post.controllers.js";

const router = Router();

router.route("/dashboard").get(verifyJWT, teacherDashboard);
router.route("/post-tuition").post(verifyJWT, postTuition);
router.route("/delete-tuition/:id").delete(verifyJWT, deleteTuition);
router.route("/show-interest/:id").post(verifyJWT, showInterest);
router.route("/cancel-interest/:id").delete(verifyJWT, cancelInterest);
router.route("/search-student").get(verifyJWT, searchStudent);

export default router;
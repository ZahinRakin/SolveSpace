import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middlewares.js";
import { 
  teacherDashboard,
  searchStudent,
} from "../controllers/teacher.controllers.js";

const router = Router();

router.route("/dashboard").get(verifyJWT, teacherDashboard);
router.route("/search-student").get(verifyJWT, searchStudent);

export default router;
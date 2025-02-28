import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middlewares.js";
import { 
  studentDashboard,
  searchTeacher
} from "../controllers/student.controllers.js";

const router = Router();

router.route("/dashboard").get(verifyJWT, studentDashboard);
router.route("/search-teacher").get(verifyJWT, searchTeacher);

export default router;
import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middlewares.js";
import { 
  adminDashboard,
  addUser,
  removeUser,
  viewAllStudent,
  viewAllTeacher
} from "../controllers/admin.controllers.js";

import { validateRegistration } from "../middlewares/validate.middlewares.js";

const router = Router();

router.route("/dashboard").get(verifyJWT, adminDashboard);
router.route("/add-user").post(verifyJWT, validateRegistration, addUser);
router.route("/remove-user/:id").delete(verifyJWT, removeUser);
router.route("/students").get(verifyJWT, viewAllStudent);
router.route("/teachers").get(verifyJWT, viewAllTeacher);


export default router;
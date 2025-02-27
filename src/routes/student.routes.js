import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middlewares.js";
import { 
  studentDashboard,
  postRequest,
  deleteRequest,
  updateRequest,
  applyToJoin,
  cancelJoin,
  searchTeacher,
  leaveBatch,
  acceptTeacher,
  destroyBatch
} from "../controllers/student.controllers.js";

const router = Router();

router.route("/dashboard").get(verifyJWT, studentDashboard);
router.route("/post-request").post(verifyJWT, postRequest);
router.route("/delete-request/:id").delete(verifyJWT, deleteRequest);
router.route("/update-request/:id").put(verifyJWT, updateRequest);
router.route("/apply-to-join/:id").post(verifyJWT, applyToJoin);
router.route("/cancel-join/:id").delete(verifyJWT, cancelJoin);
router.route("/search-teacher").get(verifyJWT, searchTeacher);
router.route("/leave-batch/:id").get(verifyJWT, leaveBatch);
router.route("/accept-teacher/:id").put(verifyJWT, acceptTeacher);
router.route("/destroy-batch/:id").delete(verifyJWT, destroyBatch);


export default router;
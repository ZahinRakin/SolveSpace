import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middlewares.js";
import { createMeeting } from "../controllers/zoom.controllers.js";

const router = Router();

router.route("/create-meeting/:batch_id").post(verifyJWT, createMeeting);


export default router;
import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middlewares.js";
import { getNotifications, deleteNotifications, sendNotifications } from "../controllers/notification.controllers.js";

const router = Router();

router.route("/getnotifications").get(verifyJWT, getNotifications);
router.route("/delete-notifications").delete(verifyJWT, deleteNotifications);
router.route("/send-notification").post(verifyJWT, sendNotifications);


export default router;
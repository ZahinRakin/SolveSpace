import { Router } from "express";
import { giveRating, updateRating, deleteRating, viewReviews, getAverageRating } from "../controllers/rating.controllers.js";
import { verifyJWT } from "../middlewares/auth.middlewares.js";

const router = Router();

router.route("/give-rating/:rateeId").post(verifyJWT, giveRating);
router.route("/update-rating/:ratingId").put(verifyJWT, updateRating);
router.route("/delete-rating/:ratingId").delete(verifyJWT, deleteRating);
router.route("/view-reviews/:rateeId").get(verifyJWT, viewReviews);
router.route("/get-rating/:rateeId").get(verifyJWT, getAverageRating);

export default router;
import express from "express";
import {
  createTracker,
  getTrackers,
  updateTracker,
  deleteTracker,
} from "../controllers/tracker.controller.js";
import { protect } from "../middleware/auth.middleware.js";

const router = express.Router();

router.use(protect);

router.post("/", createTracker);
router.get("/", getTrackers);
router.put("/:id", updateTracker);
router.delete("/:id", deleteTracker);

export default router;
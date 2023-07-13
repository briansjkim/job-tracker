import express from "express";
import {
  createJob,
  deleteJob,
  getAllJobs,
  updateJob,
  showStats,
} from "../controllers/jobsController.js";
import { authenticateUser } from "../middleware/auth.js";
import testUser from "../middleware/testUser.js";

const router = express();

router
  .route("/")
  .post(authenticateUser, testUser, createJob)
  .get(authenticateUser, getAllJobs);
// important to have /stats before /:id because 'stats' will be mistaken for a job id
router.route("/stats").get(authenticateUser, showStats);
router
  .route("/:id")
  .delete(authenticateUser, testUser, deleteJob)
  .patch(authenticateUser, testUser, updateJob);

export default router;

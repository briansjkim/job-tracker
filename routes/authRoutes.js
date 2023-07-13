import express from "express";
import {
  register,
  login,
  updateUser,
  getCurrentUser,
  logout,
} from "../controllers/authController.js";
import { authenticateUser } from "../middleware/auth.js";
import rateLimiter from "express-rate-limit";
import testUser from "../middleware/testUser.js";

const router = express();

// limits the amount of requests
const apiLimiter = rateLimiter({
  windowMs: 15 * 60 * 1000, // 15 mins
  max: 10, // limit each IP to 100 requests per 'windowMs'
  message: "Too many requests. Please try again for 15 minutes",
});

router.route("/register").post(apiLimiter, register);
router.route("/login").post(apiLimiter, login);
router.route("/logout").get(logout);
// login and register are public routes, but /updateUser is a private route, so the user needs to be authenticated
router.route("/updateUser").patch(authenticateUser, testUser, updateUser);
router.route("/getCurrentUser").get(authenticateUser, getCurrentUser);

export default router;

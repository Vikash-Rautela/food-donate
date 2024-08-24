import express from "express";
import { signupController, signinController, getUserController } from "../controllers/authController.js";

const router = express.Router();

router.post("/signup", signupController);
router.post("/signin", signinController);
router.get("/:userId", getUserController);

export default router;

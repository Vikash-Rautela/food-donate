import express from "express";
import authMiddleware from "../middleware/authMiddleware.js";
import {
    donateFood,
    requestFood,
    confirmFood,
    getAllFoods,
    getFoodDetail
} from "../controllers/foodController.js";

const router = express.Router();

router.post("/donate", authMiddleware, donateFood);
router.post("/request/:foodId", authMiddleware, requestFood);
router.post("/confirm/:foodId", authMiddleware, confirmFood);
router.get('/allfoods', getAllFoods);
router.get("/detail/:foodId", getFoodDetail);

export default router;

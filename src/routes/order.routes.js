import express from "express";
import { verifyToken } from "../utils/verifyToken.js";
import { placeOrder, getUserOrders } from "../controllers/order.controllers.js";

const router = express.Router();

router.post("/checkout", verifyToken, placeOrder);
router.get("/", verifyToken, getUserOrders);

export default router;

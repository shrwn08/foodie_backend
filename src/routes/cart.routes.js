import express from "express";
import { verifyToken } from "../utils/verifyToken.js";
import {
    addToCart,
    getCart,
    removeFromCart,
    updateCartQuantity,
} from "../controllers/cart.controllers.js";

const router = express.Router();

router.post("/add", verifyToken, addToCart);
router.get("/", verifyToken, getCart);
router.delete("/remove/:productId", verifyToken, removeFromCart);
router.put("/update", verifyToken, updateCartQuantity);

export default router;

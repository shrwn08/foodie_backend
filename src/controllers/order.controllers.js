// controllers/order.controllers.js
import Cart from "../models/cart.model.js";
import Order from "../models/order.model.js";
import userModel from "../models/user.model.js";

export const placeOrder = async (req, res) => {
    try {
        const userId = req.user.id;

        // Fetch user and cart
        const user = await userModel.findById(userId);
        const cart = await Cart.findOne({ user: userId }).populate("items.product");

        if (!cart || cart.items.length === 0) {
            return res.status(400).json({ message: "Cart is empty" });
        }

        // Check wallet balance
        if (user.wallet < cart.totalPrice) {
            return res.status(400).json({ message: "Insufficient wallet balance" });
        }

        // Deduct from wallet
        user.wallet -= cart.totalPrice;
        await user.save();

        // Create order
        const newOrder = new Order({
            user: userId,
            items: cart.items.map((item) => ({
                product: item.product._id,
                quantity: item.quantity,
                subtotal: item.subtotal,
            })),
            totalPrice: cart.totalPrice,
        });

        await newOrder.save();

        // Clear cart
        cart.items = [];
        cart.totalPrice = 0;
        await cart.save();

        res.status(201).json({
            message: "Order placed successfully",
            order: newOrder,
            remainingWallet: user.wallet,
        });
    } catch (err) {
        res.status(500).json({ message: "Server error", error: err.message });
    }
};

// Get user orders
export const getUserOrders = async (req, res) => {
    try {
        const orders = await Order.find({ user: req.user.id }).populate(
            "items.product"
        );
        res.status(200).json({ orders });
    } catch (err) {
        res.status(500).json({ message: "Server error", error: err.message });
    }
};

import Cart from "../models/cart.model.js";
import productModel from "../models/product.model.js";

// Add product to cart
export const addToCart = async (req, res) => {
    try {
        const { productId, quantity } = req.body;
        const userId = req.user.id;

        // Check if product exists
        const product = await productModel.findById(productId);
        if (!product) {
            return res.status(404).json({ message: "Product not found" });
        }

        let cart = await Cart.findOne({ user: userId });

        if (!cart) {
            cart = new Cart({ user: userId, items: [], totalPrice: 0 });
        }

        const existingItem = cart.items.find(
            (item) => item.product.toString() === productId
        );

        if (existingItem) {
            existingItem.quantity += quantity;
            existingItem.subtotal = existingItem.quantity * product.price;
        } else {
            cart.items.push({
                product: productId,
                quantity,
                subtotal: quantity * product.price,
            });
        }

        cart.totalPrice = cart.items.reduce((sum, item) => sum + item.subtotal, 0);

        await cart.save();
        res.status(200).json({ message: "Product added to cart", cart });
    } catch (err) {
        res.status(500).json({ message: "Server error", error: err.message });
    }
};

// Get user cart
export const getCart = async (req, res) => {
    try {
        const cart = await Cart.findOne({ user: req.user.id }).populate(
            "items.product"
        );
        if (!cart) {
            return res.status(404).json({ message: "Cart is empty" });
        }
        res.status(200).json(cart);
    } catch (err) {
        res.status(500).json({ message: "Server error", error: err.message });
    }
};

// Remove product from cart
export const removeFromCart = async (req, res) => {
    try {
        const { productId } = req.params;
        const cart = await Cart.findOne({ user: req.user.id });

        if (!cart) {
            return res.status(404).json({ message: "Cart not found" });
        }

        cart.items = cart.items.filter(
            (item) => item.product.toString() !== productId
        );

        cart.totalPrice = cart.items.reduce((sum, item) => sum + item.subtotal, 0);

        await cart.save();
        res.status(200).json({ message: "Product removed", cart });
    } catch (err) {
        res.status(500).json({ message: "Server error", error: err.message });
    }
};

// Update quantity
export const updateCartQuantity = async (req, res) => {
    try {
        const { productId, quantity } = req.body;
        const cart = await Cart.findOne({ user: req.user.id }).populate(
            "items.product"
        );

        if (!cart) {
            return res.status(404).json({ message: "Cart not found" });
        }

        const item = cart.items.find(
            (item) => item.product._id.toString() === productId
        );

        if (!item) {
            return res.status(404).json({ message: "Product not in cart" });
        }

        item.quantity = quantity;
        item.subtotal = quantity * item.product.price;

        cart.totalPrice = cart.items.reduce((sum, item) => sum + item.subtotal, 0);

        await cart.save();
        res.status(200).json({ message: "Quantity updated", cart });
    } catch (err) {
        res.status(500).json({ message: "Server error", error: err.message });
    }
};

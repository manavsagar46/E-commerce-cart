import express from "express";
import Cart from "../models/Cart.js";
import Product from "../models/Product.js";

const router = express.Router();

// Add Products Cart
router.post("/add", async (req, res) => {
  try {
    const { userId, quantity, productId } = req.body;

    const product = await Product.findById(productId);
    if (!product) return res.status(404).json({ message: "Product not found" });
    if (product.stock < quantity){
        
      return res.status(400).json({ message: "Sorry, not enough stock" });
    }

    let cart = await Cart.findOne({ userId });

    if (!cart) {
      cart = new Cart({ userId, products: [{ productId, quantity }] });
    } else {
      const existingItem = cart.products.find(
        (i) => i.productId.toString() === productId
      );
      if (existingItem) existingItem.quantity += quantity;
      else cart.products.push({ productId, quantity });
    }

    await cart.save();

    res.status(200).json({ message: "Added to cart", cart });
  } catch (error) {
    console.error("Error in Adding Products: ", error);
    res.status(500).json({ error: error.message });
  }
});

// Total Price of Cart
router.get("/total/:userId", async (req, res) => {
  try {
    const { userId } = req.params;

    const cart = await Cart.findOne({ userId }).populate("products.productId");

    if (!cart) return res.status(404).json({ message: "Cart not found" });

    const subtotal = cart.products.reduce(
      (sum, item) => sum + item.productId.price * item.quantity,
      0
    );

    const tax = subtotal * 0.1;
    const total = subtotal + tax;

    res.status(200).json({
      message: "Total amount to be paid",
      subtotal,
      tax,
      total,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;

import mongoose from "mongoose";

const cartSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
    trim: true,
  },
  products: [
    {
      productId: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
      quantity: { type: Number, required: true, min: 1 },
    },
  ],
});

const Cart = mongoose.models.Cart || mongoose.model("Cart", cartSchema);

export default Cart;

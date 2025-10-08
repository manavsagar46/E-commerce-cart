import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cartRoutes from "./Routes/cartRoutes.js"
import productRoutes from "./Routes/productsRoutes.js"
import cors from "cors";

dotenv.config();

const app = express();
app.use(express.json());
app.use(cors());

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected"))
  .catch((error) => console.log("Error in MongoDb Connection : ",error));

app.use("/api/products", productRoutes);
app.use("/api/cart", cartRoutes);

app.get("/", (req, res) => {
  res.send("Welcome to Todo Backend !!");
});

// const PORT = process.env.PORT || 5000;
// app.listen(PORT, () => {
//   console.log(`Server is Running on : ${PORT}`);
// });

export default app
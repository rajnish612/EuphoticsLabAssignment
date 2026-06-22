import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";

import dishRoutes from "./routes/dish.routes.js";

dotenv.config();

const app = express();

app.use(express.json());

app.use("/api/dishes", dishRoutes);

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    app.listen(3000, () => {
      console.log("Server running on port 3000");
    });
  })
  .catch(console.error);

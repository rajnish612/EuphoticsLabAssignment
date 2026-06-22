import dotenv from "dotenv";
dotenv.config();
import mongoose from "mongoose";
import Dish from "./models/dish.js";

import dishes from "./data/dishes.json" with { type: "json" };
async function seed() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);

    await Dish.deleteMany({});
    await Dish.insertMany(dishes);

    console.log("Data inserted successfully");

    process.exit();
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
}

seed();

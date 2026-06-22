import express from "express";
import {
  getAllDishes,
  togglePublishStatus,
} from "../controllers/dish.controller.js";

const router = express.Router();

router.get("/", getAllDishes);

router.patch("/:dishId/toggle", togglePublishStatus);

export default router;

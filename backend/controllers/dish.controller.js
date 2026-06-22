import Dish from "../models/dish.js";

export const getAllDishes = async (req, res) => {
  try {
    const dishes = await Dish.find();
    res.status(200).json({
      success: true,
      data: dishes,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const togglePublishStatus = async (req, res) => {
  try {
    const { dishId } = req.params;

    const dish = await Dish.findOne({ dishId });

    if (!dish) {
      return res.status(404).json({
        success: false,
        message: "Dish not found",
      });
    }

    dish.isPublished = !dish.isPublished;

    await dish.save();
    const io = req.app.get("io");
    io.emit("dishUpdated", dish);

    res.status(200).json({
      success: true,
      data: dish,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

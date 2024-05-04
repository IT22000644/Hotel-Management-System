import { Router } from "express";
import uploadImage from "../middleware/uploadImage";
import {
  createFoodItem,
  getFoodItems,
  putFoodItem,
  getFoodItem,
  deleteFoodItem,
} from "../controllers/foodItem.controller";

const foodItemRouter = Router();

foodItemRouter.post("/", uploadImage("food"), createFoodItem);
foodItemRouter.get("/", getFoodItems);
foodItemRouter.put("/:id", uploadImage("food"), putFoodItem);
foodItemRouter.get("/:id", getFoodItem);
foodItemRouter.delete("/:id", deleteFoodItem);

export default foodItemRouter;

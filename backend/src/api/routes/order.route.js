import { Router } from "express";
import {
  createOrder,
  getOrders,
  putOrder,
  getOrder,
  deleteOrder,
  searchOrders,
} from "../controllers/order.controller";

const orderRouter = Router();

orderRouter.post("/", createOrder);
orderRouter.get("/", getOrders);
orderRouter.put("/:id", putOrder);
orderRouter.get("/:id", getOrder);
orderRouter.delete("/:id", deleteOrder);
orderRouter.get("/search/:query", searchOrders);

export default orderRouter;

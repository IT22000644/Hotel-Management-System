import { Router } from "express";
import uploadImage from "../middleware/uploadImage";
import {
  createMenu,
  getMenus,
  putMenu,
  getMenu,
  deleteMenu,
} from "../controllers/menu.controller";

const menuRouter = Router();

menuRouter.post("/", uploadImage("menu"), createMenu);
menuRouter.get("/", getMenus);
menuRouter.put("/:id", uploadImage("menu"), putMenu);
menuRouter.get("/:id", getMenu);
menuRouter.delete("/:id", deleteMenu);

export default menuRouter;

import express from "express";
import {
  createComplain,
  getComplains,
  getComplain,
  updateComplain,
  deleteComplain,
} from "../controllers/complain.controller";

const complainRouter = express.Router();

complainRouter.post("/", createComplain);
complainRouter.get("/", getComplains);
complainRouter.get("/:id", getComplain);
complainRouter.patch("/:id", updateComplain);
complainRouter.delete("/:id", deleteComplain);

export default complainRouter;

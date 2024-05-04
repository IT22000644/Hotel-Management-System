import express from "express";
import * as tableController from "../controllers/table.controller";

const tableRouter = express.Router();

tableRouter.post("/", tableController.createTable);
tableRouter.get("/", tableController.getTables);
tableRouter.get("/:id", tableController.getTable);
tableRouter.patch("/:id", tableController.updateTable);
tableRouter.delete("/:id", tableController.deleteTable);

export default tableRouter;

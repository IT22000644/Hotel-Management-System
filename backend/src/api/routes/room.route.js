import express from "express";

import * as RoomController from "../controllers/room.controller";

const roomsrouter = express.Router();

roomsrouter.get("/", RoomController.getAllRooms);
roomsrouter.post("/", RoomController.addRooms);
roomsrouter.get("/:id", RoomController.getById);
roomsrouter.put("/:id", RoomController.updateRooms);
roomsrouter.delete("/:id", RoomController.deleteRooms);

export default roomsrouter;

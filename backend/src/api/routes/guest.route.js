import express from "express";

import * as GuestController from "../controllers/guest.controller";

const guestsrouter = express.Router();

guestsrouter.get("/", GuestController.getAllGuests);
guestsrouter.post("/", GuestController.addGuests);
guestsrouter.get("/:id", GuestController.getById);
guestsrouter.put("/:id", GuestController.updateGuests);
guestsrouter.delete("/:id", GuestController.deleteGuests);

guestsrouter.post("/login", GuestController.login);

guestsrouter.get("/:passportid/reservations", GuestController.getReservations);

export default guestsrouter;

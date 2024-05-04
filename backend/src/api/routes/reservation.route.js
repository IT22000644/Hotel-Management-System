import { Router } from "express";
import {
  createReservation,
  getReservations,
  getReservation,
  patchReservation,
  deleteReservation,
  getTablesInTimeRange,
} from "../controllers/reservation.controller";

const reservationRouter = Router();

reservationRouter.post("/", createReservation);
reservationRouter.get("/", getReservations);
reservationRouter.get("/:id", getReservation);
reservationRouter.patch("/:id", patchReservation);
reservationRouter.delete("/:id", deleteReservation);
reservationRouter.get(
  "/time-range/:date/:startTime/:endTime",
  getTablesInTimeRange
);

export default reservationRouter;

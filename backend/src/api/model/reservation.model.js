import mongoose from "mongoose";
import logger from "../../utils/logger";

const reservationSchema = new mongoose.Schema({
  reservationNumber: { type: String, unique: true },
  tableNumber: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Table",
    required: true,
  },
  date: { type: Date, required: true },
  startTime: { type: Date, required: true },
  endTime: { type: Date, required: true },
  numberOfGuests: { type: Number },
  customerID: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Customer",
    required: true,
  },
  status: { type: String, required: true, default: "pending" },
});

reservationSchema.pre("save", async function (next) {
  const newReservation = this;

  if (newReservation.isNew) {
    newReservation.reservationNumber = Date.now().toString();
  }

  // Find overlapping reservations
  const overlappingReservations = await mongoose.model("Reservation").find({
    tableNumber: newReservation.tableNumber,
    date: newReservation.date,
    $or: [
      {
        startTime: {
          $lt: newReservation.endTime,
          $gte: newReservation.startTime,
        },
      },
      {
        endTime: {
          $gt: newReservation.startTime,
          $lte: newReservation.endTime,
        },
      },
      {
        startTime: { $lte: newReservation.startTime },
        endTime: { $gte: newReservation.endTime },
      },
    ],
  });

  if (overlappingReservations.length > 0) {
    logger.error("Overlapping reservations");
    next(new Error("Overlapping reservations"));
  } else {
    next();
  }
});

const Reservation = mongoose.model("Reservation", reservationSchema);
export default Reservation;

import mongoose from "mongoose";
import logger from "../../utils/logger";

const reservationSchema = new mongoose.Schema({
  reservationNumber: { type: String, required: true, unique: true },
  tableNumber: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Table",
    required: true,
  },
  date: { type: Date, required: true },
  startTime: { type: Date, required: true }, // Change this
  endTime: { type: Date, required: true }, // Change this
  numberOfGuests: { type: Number, required: true },
  customerID: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Customer",
    required: true,
  },
  status: { type: String, required: true },
});

const Reservation = mongoose.model("Reservation", reservationSchema);

reservationSchema.pre("save", async function (next) {
  const newReservation = this;

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
export default Reservation;

import mongoose from "mongoose";

const reservationSchema = new mongoose.Schema({
  tableNumber: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Table",
    required: true,
  },
  date: { type: Date, required: true },
  time: { type: String, required: true },
  numberOfGuests: { type: Number, required: true },
  customerID: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Customer",
    required: true,
  },
  status: { type: String, required: true },
});

const Reservation = mongoose.model("Reservation", reservationSchema);
export default Reservation;

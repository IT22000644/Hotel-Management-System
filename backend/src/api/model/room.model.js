import mongoose from "mongoose";

const roomSchema = new mongoose.Schema({
  roomno: {
    type: String,
    required: true,
  },
  floor: {
    type: Number,
    required: true,
  },
  type: {
    type: String,
    required: true,
  },
  noofbeds: {
    type: Number,
    required: true,
  },
  balcony: {
    type: String,
    required: true,
  },
  ac: {
    type: String,
    required: true,
  },
});

export default mongoose.model("RoomModel", roomSchema);

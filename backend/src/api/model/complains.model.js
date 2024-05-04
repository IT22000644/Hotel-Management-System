import mongoose from "mongoose";

const maintenanceComplainSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  asset: { type: mongoose.Schema.Types.ObjectId, ref: "Asset" },
  location: { type: mongoose.Schema.Types.ObjectId, ref: "Room" },
});

const MaintenanceComplain = mongoose.model(
  "MaintenanceComplain",
  maintenanceComplainSchema
);

export default MaintenanceComplain;

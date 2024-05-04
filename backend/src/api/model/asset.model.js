import mongoose from "mongoose";

const assetSchema = new mongoose.Schema({
  assetCode: {
    type: String,
    required: true,
  },
  assetName: {
    type: String,
    required: true,
  },
  lastServiceDate: {
    type: Date,
    required: true,
  },
  nextServiceDate: {
    type: Date,
  },
  serviceDuration: {
    type: Number,
    required: true,
  },
  imageURL: {
    type: String,
    required: true,
  },
  location: {
    type: mongoose.Schema.Types.Mixed,
    required: true,
  },
  assetType: {
    type: String,
    enum: ["Electronic", "Furniture", "Other"],
    required: true,
  },
  status: {
    type: String,
  },
});

const Asset = mongoose.model("Asset", assetSchema);

assetSchema.pre("save", function setNextServiceDate(next) {
  if (
    this.isModified("lastServiceDate") ||
    this.isModified("serviceDuration")
  ) {
    const lastServiceDate = new Date(this.lastServiceDate);
    lastServiceDate.setFullYear(
      lastServiceDate.getFullYear() + this.serviceDuration
    );
    this.nextServiceDate = lastServiceDate;
  }
  next();
});

export default Asset;

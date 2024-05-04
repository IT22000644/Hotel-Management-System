import mongoose from "mongoose";

const rawMaterialRequestSchema = new mongoose.Schema({
  items: [
    {
      item: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "InvItem",
      },
      quantity: {
        type: Number,
        required: true,
      },
    },
  ],
  status: String,
});

const RawMaterialRequest = mongoose.model(
  "RawMaterialRequest",
  rawMaterialRequestSchema
);
export default RawMaterialRequest;

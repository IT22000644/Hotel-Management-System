import mongoose from "mongoose";

const tableSchema = new mongoose.Schema({
  number: { type: Number, required: true },
  name: { type: String, require: true },
  seatingCapacity: { type: Number, required: true },
});

const Table = mongoose.model("Table", tableSchema);
export default Table;

import mongoose from "mongoose";

const brandSchema = new mongoose.Schema(
  {
    brand_id: {
      type: String,
      required: true,
      unique: true,
      uppercase: true,
    },
    brand_name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
    },
  },
  { timestamp: true }
);

const Brand = mongoose.model("brand", brandSchema);
export default Brand;

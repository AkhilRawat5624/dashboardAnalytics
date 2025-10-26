import mongoose, { Schema, Document } from "mongoose";

export interface ISale extends Document {
  date: Date;
  productId?: mongoose.Types.ObjectId;
  region?: string;
  revenue: number;
  orders: number;
  avgOrderValue: number;
  target?: number;
  achieved?: number;
}

const SaleSchema = new Schema<ISale>({
  date: { type: Date, required: true },
  productId: { type: Schema.Types.ObjectId, ref: "Product" },
  region: String,
  revenue: Number,
  orders: Number,
  avgOrderValue: Number,
  target: Number,
  achieved: Number,
});

export default mongoose.models.Sale || mongoose.model<ISale>("Sale", SaleSchema);

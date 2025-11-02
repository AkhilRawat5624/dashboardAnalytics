import mongoose, { Document, Schema } from "mongoose";

export interface IDataSource extends Document {
    name: string;
    type: "sales" | "marketing" | "client" | "finance";
    lastSync: Date;
    recordsCount: number;
    status: "active" | "inactive" | "error";
}

const DataSourceSchema = new Schema<IDataSource>({
    name: { type: String, required: true },
    type: { type: String, enum: ["sales", "marketing", "client", "finance"], required: true },
    lastSync: { type: Date, default: Date.now },
    recordsCount: { type: Number, default: 0 },
    status: { type: String, enum: ["active", "inactive", "error"], default: "active" },
});

export default mongoose.models.DataSource ||
    mongoose.model<IDataSource>("DataSource", DataSourceSchema);
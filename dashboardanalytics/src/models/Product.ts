import mongoose, { Document, Schema } from "mongoose";

export interface IProduct extends Document {
    name: string;
    category?: string;
    price: number;
    stock: number;
    createdAt: Date;
}

const productSchema = new Schema<IProduct>(
    {
        name: { type: String, required: true },
        category: { type: String, },
        price: { type: Number, required: true },
        stock: { type: Number, default: 0 }
    },
    {timestamps:true},
);
export default mongoose.models.Product || mongoose.model<IProduct>("Product",productSchema)

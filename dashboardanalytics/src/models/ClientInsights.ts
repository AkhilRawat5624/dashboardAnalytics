import mongoose, { Document, Schema } from "mongoose";

export  interface IClientInsight extends Document {
    date: Date;
    newUsers: number;
    traffic: number;
    campaign?: string;
    requestVolume: number;
    serviceLevel: number;
    satisfactionScore?: number;
}
const ClientInsightsSchema = new Schema<IClientInsight>({
    date:{type:Date, required:true},
    newUsers: Number,
    traffic: Number,
    campaign: String,
    requestVolume: Number,
    serviceLevel: Number,
    satisfactionScore: Number,
});

export default mongoose.models.ClientInsight || mongoose.model<IClientInsight>("ClientInsight",ClientInsightsSchema);
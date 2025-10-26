import mongoose, { Schema, Document } from "mongoose";

export interface IMarketingMetric extends Document {
    date: Date;
    campaignId?: string,
    clicks: number,
    cpo: number, //cost per order
    goalValue: number;
    goalRate: number;
    bounceRate: number;
    avgDuration: number;
    topCountries: string[];
    performance: number;
}

const MarketingMetricsSchema = new Schema<IMarketingMetric>({
    date: { type: Date, required: true },
    campaignId: String,
    clicks: Number,
    cpo: Number,
    goalValue: Number,
    goalRate: Number,
    bounceRate: Number,
    avgDuration: Number,
    topCountries: [String],
    performance: Number,
});

export default mongoose.models.IMarketingMetric || mongoose.model<IMarketingMetric>("MarketingMetrics", MarketingMetricsSchema);

import mongoose, { Document, Schema } from "mongoose";

export interface IFinancial extends Document {
    date: Date;
    workingCapital: number;
    currentRatio: number;
    cashFlowRatio: number;
    grossProfit: number;
    opexRatio: number;
    operationProfit: number;
    liquidityRatio: number;
    netWorth: number;
    currentCapital: number;
}
const FinancialSchema = new Schema<IFinancial>(
    {
        date: { type: Date, required: true },
        workingCapital: Number,
        currentRatio: Number,
        cashFlowRatio: Number,
        grossProfit: Number,
        opexRatio: Number,
        operationProfit: Number,
        liquidityRatio: Number,
        netWorth: Number,
        currentCapital: Number,
    }
)
export default mongoose.models.Financial || mongoose.model<IFinancial>("Financial",FinancialSchema);
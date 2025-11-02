import mongoose, { Schema, Document } from "mongoose";

export interface IAiSuggestion extends Document {
  type: string;
  contextHash: string;
  insight: string;
  createdAt: Date;
}

const AiSuggestionSchema = new Schema<IAiSuggestion>(
  {
    type: String,
    contextHash: String,
    insight: String,
  },
  { timestamps: true }
);

export default mongoose.models.AiSuggestion ||
  mongoose.model<IAiSuggestion>("AiSuggestion", AiSuggestionSchema);

import mongoose, { Schema, Document } from "mongoose";

export interface IUser extends Document {
    name: string;
    email: string;
    username: string;
    passwordHash: string;
    role?: "admin" | "analyst" | "viewer";
    mfaEnabled?: boolean;
    recoveryEmail: string;
    createdAt: Date;
    updatedAt: Date;
}

const userSchema = new Schema<IUser>(
    {
        name: { type: String, required: true },
        email: { type: String, required: true, unique: true },
        username: { type: String, required: true, unique: true },
        passwordHash: { type: String, required: true },
        role: { type: String, enum: ["viewer", "admin", "analyst"], default: "viewer" },
        mfaEnabled: { type: Boolean, default: false },
        recoveryEmail: { type: String },
    },
    { timestamps: true }
);
export default mongoose.models.User || mongoose.model<IUser>("User", userSchema);
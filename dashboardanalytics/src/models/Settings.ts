import mongoose, { Schema, Document } from "mongoose";

export interface ISettings extends Document {
    userId: string;
    general: {
        companyName: string;
        timezone: string;
        dateFormat: string;
        currency: string;
        language: string;
    };
    security: {
        twoFactorEnabled: boolean;
        sessionTimeout: number;
        passwordExpiry: number;
        loginNotifications: boolean;
    };
    notifications: {
        emailNotifications: boolean;
        pushNotifications: boolean;
        weeklyReports: boolean;
        alertThreshold: number;
    };
    createdAt: Date;
    updatedAt: Date;
}

const settingsSchema = new Schema<ISettings>(
    {
        userId: { type: String, required: true, unique: true },
        general: {
            companyName: { type: String, default: "My Company" },
            timezone: { type: String, default: "UTC" },
            dateFormat: { type: String, default: "MM/DD/YYYY" },
            currency: { type: String, default: "USD" },
            language: { type: String, default: "en" },
        },
        security: {
            twoFactorEnabled: { type: Boolean, default: false },
            sessionTimeout: { type: Number, default: 30 },
            passwordExpiry: { type: Number, default: 90 },
            loginNotifications: { type: Boolean, default: true },
        },
        notifications: {
            emailNotifications: { type: Boolean, default: true },
            pushNotifications: { type: Boolean, default: false },
            weeklyReports: { type: Boolean, default: true },
            alertThreshold: { type: Number, default: 80 },
        },
    },
    { timestamps: true }
);

export default mongoose.models.Settings || mongoose.model<ISettings>("Settings", settingsSchema);

import { NextResponse } from "next/server";
import dbconnect from "@/lib/db";
import Settings from "@/models/Settings";
import { generalSettingsSchema, validateQueryParams, validateRequestBody, userIdSchema } from "@/lib/validations";
import { z } from "zod";

export async function GET(req: Request) {
    try {
        await dbconnect();

        const { searchParams } = new URL(req.url);
        
        // Validate query parameters
        const validation = validateQueryParams(searchParams, z.object({ userId: userIdSchema }));
        if (!validation.success) {
            return NextResponse.json(
                { success: false, message: `Validation error: ${validation.error}` },
                { status: 400 }
            );
        }

        const { userId } = validation.data;

        const settings = await Settings.findOne({ userId });

        return NextResponse.json({
            success: true,
            data: settings?.general || {},
        });
    } catch (error: any) {
        return NextResponse.json(
            { success: false, message: error.message || "Server Error" },
            { status: 500 }
        );
    }
}

export async function PUT(req: Request) {
    try {
        await dbconnect();

        const body = await req.json();
        
        // Validate request body
        const validation = validateRequestBody(body, generalSettingsSchema);
        if (!validation.success) {
            return NextResponse.json(
                { success: false, message: `Validation error: ${validation.error}` },
                { status: 400 }
            );
        }

        const { userId, ...generalData } = validation.data;

        const settings = await Settings.findOneAndUpdate(
            { userId },
            { $set: { general: generalData } },
            { new: true, upsert: true, runValidators: true }
        );

        return NextResponse.json({
            success: true,
            data: settings.general,
        });
    } catch (error: any) {
        return NextResponse.json(
            { success: false, message: error.message || "Server Error" },
            { status: 500 }
        );
    }
}

import dbconnect from "@/lib/db";
import Sale from "@/models/Sale";
import { NextResponse } from "next/server";
import { salesQuerySchema, validateQueryParams } from "@/lib/validations";

export async function GET(req: Request) {
    try {
        await dbconnect();
        
        const { searchParams } = new URL(req.url);
        
        // Validate query parameters
        const validation = validateQueryParams(searchParams, salesQuerySchema);
        if (!validation.success) {
            return NextResponse.json(
                { success: false, message: `Validation error: ${validation.error}` },
                { status: 400 }
            );
        }

        const { page = 1, limit = 10, region, startDate, endDate } = validation.data;
        const skip = (page - 1) * limit;

        // Build filters
        const filters: any = {};
        if (region) filters.region = region;
        if (startDate || endDate) {
            filters.date = {};
            if (startDate) {
                const start = new Date(startDate);
                start.setHours(0, 0, 0, 0);
                filters.date.$gte = start;
            }
            if (endDate) {
                const end = new Date(endDate);
                end.setHours(23, 59, 59, 999);
                filters.date.$lte = end;
            }
        }

        const total = await Sale.countDocuments(filters);
        const sales = await Sale.find(filters).sort({ date: -1 }).skip(skip).limit(limit).lean();

        return NextResponse.json({
            success: true,
            data: sales,
            pagination: {
                page,
                limit,
                total,
                totalPages: Math.ceil(total / limit),
            }
        });
    } catch (error: any) {
        return NextResponse.json(
            { success: false, message: error.message || "Server Error" },
            { status: 500 }
        );
    }
}

import dbconnect from "@/lib/db";
import Sale from "@/models/Sale";
import { NextResponse } from "next/server";

export async function GET(req: Request, res: Response) {
    try {
        await dbconnect();
        const { searchParams } = new URL(req.url);
        const page = Number(searchParams.get("page")) || 1;
        const limit = Number(searchParams.get("limit")) || 10;
        const skip = (page - 1) * limit;

        const total = await Sale.countDocuments();
        const sales = await Sale.find().sort({ date: -1 }).skip(skip).limit(limit);


        return NextResponse.json({
            success: true,
            data: sales,
            pagination: {
                page,
                limit,
                total,
                totalPages: Math.ceil(total / limit),
            }
        })
    } catch (error: any) {
        return NextResponse.json(
            { success: false, message: error.message || "Server Error" },
            { status: 500 }
        );
    }

}
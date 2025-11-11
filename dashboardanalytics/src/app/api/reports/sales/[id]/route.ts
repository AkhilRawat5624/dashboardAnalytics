import { NextResponse } from "next/server";
import dbconnect from "@/lib/db";
import Sale, { ISale } from "@/models/Sale";
import Product from "@/models/Product";
import mongoose from "mongoose";

export async function GET(
    req: Request,
    { params }: { params: { id: string } }
) {
    try {
        await dbconnect();

        const { id } = params;

        // Validate ObjectId
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return NextResponse.json(
                { success: false, message: "Invalid sale ID" },
                { status: 400 }
            );
        }

        const sale = await Sale.findById(id).lean<ISale>();

        if (!sale) {
            return NextResponse.json(
                { success: false, message: "Sale not found" },
                { status: 404 }
            );
        }

        // Populate product info if productId exists
        let productInfo = null;
        if (sale.productId) {
            productInfo = await Product.findById(sale.productId).lean();
        }

        return NextResponse.json({
            success: true,
            data: {
                ...sale,
                product: productInfo,
            },
        });
    } catch (error: any) {
        return NextResponse.json(
            { success: false, message: error.message || "Server Error" },
            { status: 500 }
        );
    }
}

export async function PUT(
    req: Request,
    { params }: { params: { id: string } }
) {
    try {
        await dbconnect();

        const { id } = params;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return NextResponse.json(
                { success: false, message: "Invalid sale ID" },
                { status: 400 }
            );
        }

        const body = await req.json();

        const updatedSale = await Sale.findByIdAndUpdate(
            id,
            { $set: body },
            { new: true, runValidators: true }
        ).lean();

        if (!updatedSale) {
            return NextResponse.json(
                { success: false, message: "Sale not found" },
                { status: 404 }
            );
        }

        return NextResponse.json({
            success: true,
            data: updatedSale,
        });
    } catch (error: any) {
        return NextResponse.json(
            { success: false, message: error.message || "Server Error" },
            { status: 500 }
        );
    }
}

export async function DELETE(
    req: Request,
    { params }: { params: { id: string } }
) {
    try {
        await dbconnect();

        const { id } = params;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return NextResponse.json(
                { success: false, message: "Invalid sale ID" },
                { status: 400 }
            );
        }

        const deletedSale = await Sale.findByIdAndDelete(id).lean();

        if (!deletedSale) {
            return NextResponse.json(
                { success: false, message: "Sale not found" },
                { status: 404 }
            );
        }

        return NextResponse.json({
            success: true,
            message: "Sale deleted successfully",
            data: deletedSale,
        });
    } catch (error: any) {
        return NextResponse.json(
            { success: false, message: error.message || "Server Error" },
            { status: 500 }
        );
    }
}

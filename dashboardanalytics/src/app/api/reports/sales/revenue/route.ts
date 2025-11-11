import { NextResponse } from "next/server";
import dbconnect from "@/lib/db";
import Sale from "@/models/Sale";

/**
 * GET /api/reports/sales/revenue
 * Returns revenue breakdown and analysis
 * Query params:
 * - startDate: ISO date string (optional)
 * - endDate: ISO date string (optional)
 * - groupBy: "region" | "product" | "date" (default: "date")
 */
export async function GET(req: Request) {
  try {
    await dbconnect();

    const { searchParams } = new URL(req.url);
    const startDate = searchParams.get("startDate");
    const endDate = searchParams.get("endDate");
    const groupBy = searchParams.get("groupBy") || "date";

    // Build date filter
    const dateFilter: any = {};
    if (startDate) {
      dateFilter.$gte = new Date(startDate);
    }
    if (endDate) {
      dateFilter.$lte = new Date(endDate);
    }

    const matchStage: any = {};
    if (Object.keys(dateFilter).length > 0) {
      matchStage.date = dateFilter;
    }

    // Total revenue summary
    const totalStats = await Sale.aggregate([
      ...(Object.keys(matchStage).length > 0 ? [{ $match: matchStage }] : []),
      {
        $group: {
          _id: null,
          totalRevenue: { $sum: { $ifNull: ["$revenue", 0] } },
          totalOrders: { $sum: { $ifNull: ["$orders", 0] } },
          avgRevenue: { $avg: { $ifNull: ["$revenue", 0] } },
          minRevenue: { $min: "$revenue" },
          maxRevenue: { $max: "$revenue" },
        },
      },
    ]);

    const summary = totalStats[0] || {
      totalRevenue: 0,
      totalOrders: 0,
      avgRevenue: 0,
      minRevenue: 0,
      maxRevenue: 0,
    };

    // Revenue breakdown based on groupBy parameter
    let breakdown: any[] = [];

    switch (groupBy) {
      case "region":
        breakdown = await Sale.aggregate([
          ...(Object.keys(matchStage).length > 0 ? [{ $match: matchStage }] : []),
          {
            $group: {
              _id: { $ifNull: ["$region", "Unknown"] },
              revenue: { $sum: { $ifNull: ["$revenue", 0] } },
              orders: { $sum: { $ifNull: ["$orders", 0] } },
              avgOrderValue: { $avg: { $ifNull: ["$avgOrderValue", 0] } },
            },
          },
          { $sort: { revenue: -1 } },
          {
            $project: {
              _id: 0,
              region: "$_id",
              revenue: 1,
              orders: 1,
              avgOrderValue: { $round: ["$avgOrderValue", 2] },
              revenuePercentage: {
                $round: [
                  {
                    $multiply: [
                      { $divide: ["$revenue", summary.totalRevenue || 1] },
                      100,
                    ],
                  },
                  2,
                ],
              },
            },
          },
        ]);
        break;

      case "product":
        breakdown = await Sale.aggregate([
          ...(Object.keys(matchStage).length > 0 ? [{ $match: matchStage }] : []),
          { $match: { productId: { $exists: true, $ne: null } } },
          {
            $group: {
              _id: "$productId",
              revenue: { $sum: { $ifNull: ["$revenue", 0] } },
              orders: { $sum: { $ifNull: ["$orders", 0] } },
              avgOrderValue: { $avg: { $ifNull: ["$avgOrderValue", 0] } },
            },
          },
          { $sort: { revenue: -1 } },
          { $limit: 20 },
          {
            $project: {
              _id: 0,
              productId: "$_id",
              revenue: 1,
              orders: 1,
              avgOrderValue: { $round: ["$avgOrderValue", 2] },
              revenuePercentage: {
                $round: [
                  {
                    $multiply: [
                      { $divide: ["$revenue", summary.totalRevenue || 1] },
                      100,
                    ],
                  },
                  2,
                ],
              },
            },
          },
        ]);
        break;

      case "date":
      default:
        breakdown = await Sale.aggregate([
          ...(Object.keys(matchStage).length > 0 ? [{ $match: matchStage }] : []),
          {
            $group: {
              _id: {
                year: { $year: "$date" },
                month: { $month: "$date" },
                day: { $dayOfMonth: "$date" },
              },
              revenue: { $sum: { $ifNull: ["$revenue", 0] } },
              orders: { $sum: { $ifNull: ["$orders", 0] } },
              avgOrderValue: { $avg: { $ifNull: ["$avgOrderValue", 0] } },
            },
          },
          { $sort: { "_id.year": 1, "_id.month": 1, "_id.day": 1 } },
          {
            $project: {
              _id: 0,
              date: {
                $dateFromParts: {
                  year: "$_id.year",
                  month: "$_id.month",
                  day: "$_id.day",
                },
              },
              revenue: 1,
              orders: 1,
              avgOrderValue: { $round: ["$avgOrderValue", 2] },
            },
          },
        ]);
        break;
    }

    return NextResponse.json({
      success: true,
      data: {
        summary: {
          totalRevenue: summary.totalRevenue,
          totalOrders: summary.totalOrders,
          avgRevenue: Number(summary.avgRevenue.toFixed(2)),
          minRevenue: summary.minRevenue,
          maxRevenue: summary.maxRevenue,
          avgOrderValue:
            summary.totalOrders > 0
              ? Number((summary.totalRevenue / summary.totalOrders).toFixed(2))
              : 0,
        },
        groupBy,
        breakdown,
        filters: {
          startDate: startDate || null,
          endDate: endDate || null,
        },
      },
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message || "Server Error" },
      { status: 500 }
    );
  }
}

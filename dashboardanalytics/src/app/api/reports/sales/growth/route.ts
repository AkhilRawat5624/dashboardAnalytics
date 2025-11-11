import { NextResponse } from "next/server";
import dbconnect from "@/lib/db";
import Sale from "@/models/Sale";

/**
 * GET /api/reports/sales/growth
 * Returns growth metrics comparing different time periods
 * Query params:
 * - period: "daily" | "weekly" | "monthly" | "yearly" (default: "monthly")
 * - compare: number of periods to compare (default: 2)
 */
export async function GET(req: Request) {
  try {
    await dbconnect();

    const { searchParams } = new URL(req.url);
    const period = searchParams.get("period") || "monthly";
    const comparePeriods = Number(searchParams.get("compare")) || 2;

    let groupBy: any;
    let dateRange: Date;
    const now = new Date();

    // Define grouping and date range based on period
    switch (period) {
      case "daily":
        groupBy = {
          year: { $year: "$date" },
          month: { $month: "$date" },
          day: { $dayOfMonth: "$date" },
        };
        dateRange = new Date(now.getTime() - comparePeriods * 24 * 60 * 60 * 1000);
        break;
      case "weekly":
        groupBy = {
          year: { $year: "$date" },
          week: { $week: "$date" },
        };
        dateRange = new Date(now.getTime() - comparePeriods * 7 * 24 * 60 * 60 * 1000);
        break;
      case "yearly":
        groupBy = {
          year: { $year: "$date" },
        };
        dateRange = new Date(now.getFullYear() - comparePeriods, now.getMonth(), now.getDate());
        break;
      case "monthly":
      default:
        groupBy = {
          year: { $year: "$date" },
          month: { $month: "$date" },
        };
        dateRange = new Date(now.getFullYear(), now.getMonth() - comparePeriods, 1);
        break;
    }

    // Aggregate sales data by period
    const salesData = await Sale.aggregate([
      {
        $match: {
          date: { $gte: dateRange },
        },
      },
      {
        $group: {
          _id: groupBy,
          revenue: { $sum: { $ifNull: ["$revenue", 0] } },
          orders: { $sum: { $ifNull: ["$orders", 0] } },
          avgOrderValue: { $avg: { $ifNull: ["$avgOrderValue", 0] } },
        },
      },
      { $sort: { "_id.year": 1, "_id.month": 1, "_id.week": 1, "_id.day": 1 } },
    ]);

    if (salesData.length < 2) {
      return NextResponse.json({
        success: true,
        data: {
          period,
          growthMetrics: {
            revenue: { current: 0, previous: 0, growth: 0, growthRate: 0 },
            orders: { current: 0, previous: 0, growth: 0, growthRate: 0 },
            avgOrderValue: { current: 0, previous: 0, growth: 0, growthRate: 0 },
          },
          periodData: salesData,
        },
        message: "Insufficient data for growth comparison",
      });
    }

    // Get current and previous period data
    const current = salesData[salesData.length - 1];
    const previous = salesData[salesData.length - 2];

    // Calculate growth metrics
    const calculateGrowth = (curr: number, prev: number) => {
      const growth = curr - prev;
      const growthRate = prev === 0 ? (curr === 0 ? 0 : 100) : Number(((growth / prev) * 100).toFixed(2));
      return { current: curr, previous: prev, growth, growthRate };
    };

    const growthMetrics = {
      revenue: calculateGrowth(current.revenue, previous.revenue),
      orders: calculateGrowth(current.orders, previous.orders),
      avgOrderValue: calculateGrowth(
        Number(current.avgOrderValue.toFixed(2)),
        Number(previous.avgOrderValue.toFixed(2))
      ),
    };

    // Calculate overall trend across all periods
    const overallTrend = salesData.length > 0 ? {
      totalRevenue: salesData.reduce((sum, p) => sum + p.revenue, 0),
      totalOrders: salesData.reduce((sum, p) => sum + p.orders, 0),
      avgRevenue: salesData.reduce((sum, p) => sum + p.revenue, 0) / salesData.length,
      avgOrders: salesData.reduce((sum, p) => sum + p.orders, 0) / salesData.length,
    } : null;

    return NextResponse.json({
      success: true,
      data: {
        period,
        growthMetrics,
        overallTrend,
        periodData: salesData,
      },
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message || "Server Error" },
      { status: 500 }
    );
  }
}

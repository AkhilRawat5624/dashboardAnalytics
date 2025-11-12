import { NextResponse } from "next/server";
import dbconnect from "@/lib/db";
import Sale from "@/models/Sale";

/**
 * GET /api/reports/sales/trends
 * Returns time-series trend analysis with moving averages and forecasting indicators
 * Query params:
 * - period: "daily" | "weekly" | "monthly" (default: "daily")
 * - days: number of days to analyze (default: 30)
 * - movingAvg: calculate moving average window (default: 7)
 */
export async function GET(req: Request) {
  try {
    await dbconnect();

    const { searchParams } = new URL(req.url);
    const period = searchParams.get("period") || "daily";
    const days = Number(searchParams.get("days")) || 30;
    const movingAvgWindow = Number(searchParams.get("movingAvg")) || 7;

    const now = new Date();
    const startDate = new Date(now.getTime() - days * 24 * 60 * 60 * 1000);

    let groupBy: any;

    // Define grouping based on period
    switch (period) {
      case "weekly":
        groupBy = {
          year: { $year: "$date" },
          week: { $week: "$date" },
        };
        break;
      case "monthly":
        groupBy = {
          year: { $year: "$date" },
          month: { $month: "$date" },
        };
        break;
      case "daily":
      default:
        groupBy = {
          year: { $year: "$date" },
          month: { $month: "$date" },
          day: { $dayOfMonth: "$date" },
        };
        break;
    }

    // Get time-series data
    const trendData = await Sale.aggregate([
      {
        $match: {
          date: { $gte: startDate },
        },
      },
      {
        $group: {
          _id: groupBy,
          revenue: { $sum: { $ifNull: ["$revenue", 0] } },
          orders: { $sum: { $ifNull: ["$orders", 0] } },
          avgOrderValue: { $avg: { $ifNull: ["$avgOrderValue", 0] } },
          count: { $sum: 1 },
        },
      },
      { $sort: { "_id.year": 1, "_id.month": 1, "_id.week": 1, "_id.day": 1 } },
    ]);

    if (trendData.length === 0) {
      return NextResponse.json({
        success: true,
        data: {
          period,
          trends: [],
          analysis: {
            direction: "neutral",
            strength: 0,
            volatility: 0,
          },
        },
        message: "No data available for the specified period",
      });
    }

    // Format trend data with dates
    const formattedTrends = trendData.map((item) => {
      let date: Date;
      if (period === "weekly") {
        // Approximate week start date
        const firstDayOfYear = new Date(item._id.year, 0, 1);
        date = new Date(firstDayOfYear.getTime() + (item._id.week - 1) * 7 * 24 * 60 * 60 * 1000);
      } else if (period === "monthly") {
        date = new Date(item._id.year, item._id.month - 1, 1);
      } else {
        date = new Date(item._id.year, item._id.month - 1, item._id.day);
      }

      return {
        date,
        revenue: item.revenue,
        orders: item.orders,
        avgOrderValue: Number(item.avgOrderValue.toFixed(2)),
        count: item.count,
      };
    });

    // Calculate moving averages
    const calculateMovingAverage = (data: number[], window: number) => {
      return data.map((_, idx, arr) => {
        if (idx < window - 1) return null;
        const slice = arr.slice(idx - window + 1, idx + 1);
        return Number((slice.reduce((sum, val) => sum + val, 0) / window).toFixed(2));
      });
    };

    const revenueValues = formattedTrends.map((t) => t.revenue);
    const ordersValues = formattedTrends.map((t) => t.orders);

    const revenueMA = calculateMovingAverage(revenueValues, movingAvgWindow);
    const ordersMA = calculateMovingAverage(ordersValues, movingAvgWindow);

    // Add moving averages to trend data
    const trendsWithMA = formattedTrends.map((trend, idx) => ({
      ...trend,
      revenueMA: revenueMA[idx],
      ordersMA: ordersMA[idx],
    }));

    // Trend analysis
    const firstHalf = revenueValues.slice(0, Math.floor(revenueValues.length / 2));
    const secondHalf = revenueValues.slice(Math.floor(revenueValues.length / 2));

    const avgFirstHalf = firstHalf.reduce((sum, val) => sum + val, 0) / firstHalf.length;
    const avgSecondHalf = secondHalf.reduce((sum, val) => sum + val, 0) / secondHalf.length;

    const trendDirection =
      avgSecondHalf > avgFirstHalf * 1.1
        ? "upward"
        : avgSecondHalf < avgFirstHalf * 0.9
        ? "downward"
        : "stable";

    const trendStrength = Math.abs(
      Number((((avgSecondHalf - avgFirstHalf) / avgFirstHalf) * 100).toFixed(2))
    );

    // Calculate volatility (standard deviation)
    const mean = revenueValues.reduce((sum, val) => sum + val, 0) / revenueValues.length;
    const variance =
      revenueValues.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / revenueValues.length;
    const volatility = Number(Math.sqrt(variance).toFixed(2));

    // Peak and trough analysis
    const maxRevenue = Math.max(...revenueValues);
    const minRevenue = Math.min(...revenueValues);
    const maxRevenueIdx = revenueValues.indexOf(maxRevenue);
    const minRevenueIdx = revenueValues.indexOf(minRevenue);

    // Calculate correlation between orders and revenue
    const meanOrders = ordersValues.reduce((sum, val) => sum + val, 0) / ordersValues.length;
    const meanRevenue = revenueValues.reduce((sum, val) => sum + val, 0) / revenueValues.length;

    let numerator = 0;
    let denomOrders = 0;
    let denomRevenue = 0;

    for (let i = 0; i < ordersValues.length; i++) {
      const orderDiff = ordersValues[i] - meanOrders;
      const revenueDiff = revenueValues[i] - meanRevenue;
      numerator += orderDiff * revenueDiff;
      denomOrders += orderDiff * orderDiff;
      denomRevenue += revenueDiff * revenueDiff;
    }

    const correlation =
      denomOrders && denomRevenue
        ? Number((numerator / Math.sqrt(denomOrders * denomRevenue)).toFixed(2))
        : 0;

    return NextResponse.json({
      success: true,
      data: {
        period,
        movingAvgWindow,
        trends: trendsWithMA,
        analysis: {
          direction: trendDirection,
          strength: trendStrength,
          volatility,
          correlation,
          peak: {
            revenue: maxRevenue,
            date: formattedTrends[maxRevenueIdx]?.date,
          },
          trough: {
            revenue: minRevenue,
            date: formattedTrends[minRevenueIdx]?.date,
          },
          averages: {
            firstHalf: Number(avgFirstHalf.toFixed(2)),
            secondHalf: Number(avgSecondHalf.toFixed(2)),
            overall: Number(mean.toFixed(2)),
          },
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

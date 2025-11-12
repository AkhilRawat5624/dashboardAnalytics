import { NextResponse } from "next/server";
import dbconnect from "@/lib/db";
import Sale from "@/models/Sale";

/**
 * GET /api/reports/sales/targets
 * Returns target vs achievement analysis
 * Query params:
 * - startDate: ISO date string (optional)
 * - endDate: ISO date string (optional)
 * - groupBy: "region" | "month" | "overall" (default: "overall")
 */
export async function GET(req: Request) {
  try {
    await dbconnect();

    const { searchParams } = new URL(req.url);
    const startDate = searchParams.get("startDate");
    const endDate = searchParams.get("endDate");
    const groupBy = searchParams.get("groupBy") || "overall";

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

    // Overall targets summary
    const overallStats = await Sale.aggregate([
      ...(Object.keys(matchStage).length > 0 ? [{ $match: matchStage }] : []),
      {
        $group: {
          _id: null,
          totalTarget: { $sum: { $ifNull: ["$target", 0] } },
          totalAchieved: { $sum: { $ifNull: ["$achieved", 0] } },
          totalRevenue: { $sum: { $ifNull: ["$revenue", 0] } },
          recordsWithTargets: {
            $sum: { $cond: [{ $gt: ["$target", 0] }, 1, 0] },
          },
          recordsMetTarget: {
            $sum: {
              $cond: [
                { $gte: ["$achieved", "$target"] },
                1,
                0,
              ],
            },
          },
        },
      },
    ]);

    const overall = overallStats[0] || {
      totalTarget: 0,
      totalAchieved: 0,
      totalRevenue: 0,
      recordsWithTargets: 0,
      recordsMetTarget: 0,
    };

    const completionRate =
      overall.totalTarget > 0
        ? Number(((overall.totalAchieved / overall.totalTarget) * 100).toFixed(2))
        : 0;

    const successRate =
      overall.recordsWithTargets > 0
        ? Number(((overall.recordsMetTarget / overall.recordsWithTargets) * 100).toFixed(2))
        : 0;

    // Detailed breakdown based on groupBy
    let breakdown: any[] = [];

    switch (groupBy) {
      case "region":
        breakdown = await Sale.aggregate([
          ...(Object.keys(matchStage).length > 0 ? [{ $match: matchStage }] : []),
          {
            $group: {
              _id: { $ifNull: ["$region", "Unknown"] },
              target: { $sum: { $ifNull: ["$target", 0] } },
              achieved: { $sum: { $ifNull: ["$achieved", 0] } },
              revenue: { $sum: { $ifNull: ["$revenue", 0] } },
              count: { $sum: 1 },
            },
          },
          { $sort: { achieved: -1 } },
          {
            $project: {
              _id: 0,
              region: "$_id",
              target: 1,
              achieved: 1,
              revenue: 1,
              count: 1,
              completionRate: {
                $round: [
                  {
                    $cond: [
                      { $gt: ["$target", 0] },
                      { $multiply: [{ $divide: ["$achieved", "$target"] }, 100] },
                      0,
                    ],
                  },
                  2,
                ],
              },
              variance: { $subtract: ["$achieved", "$target"] },
              status: {
                $cond: [
                  { $gte: ["$achieved", "$target"] },
                  "met",
                  { $cond: [{ $gte: ["$achieved", { $multiply: ["$target", 0.8] }] }, "near", "below"] },
                ],
              },
            },
          },
        ]);
        break;

      case "month":
        breakdown = await Sale.aggregate([
          ...(Object.keys(matchStage).length > 0 ? [{ $match: matchStage }] : []),
          {
            $group: {
              _id: {
                year: { $year: "$date" },
                month: { $month: "$date" },
              },
              target: { $sum: { $ifNull: ["$target", 0] } },
              achieved: { $sum: { $ifNull: ["$achieved", 0] } },
              revenue: { $sum: { $ifNull: ["$revenue", 0] } },
              count: { $sum: 1 },
            },
          },
          { $sort: { "_id.year": 1, "_id.month": 1 } },
          {
            $project: {
              _id: 0,
              year: "$_id.year",
              month: "$_id.month",
              target: 1,
              achieved: 1,
              revenue: 1,
              count: 1,
              completionRate: {
                $round: [
                  {
                    $cond: [
                      { $gt: ["$target", 0] },
                      { $multiply: [{ $divide: ["$achieved", "$target"] }, 100] },
                      0,
                    ],
                  },
                  2,
                ],
              },
              variance: { $subtract: ["$achieved", "$target"] },
              status: {
                $cond: [
                  { $gte: ["$achieved", "$target"] },
                  "met",
                  { $cond: [{ $gte: ["$achieved", { $multiply: ["$target", 0.8] }] }, "near", "below"] },
                ],
              },
            },
          },
        ]);
        break;

      case "overall":
      default:
        // Return individual sales with target tracking
        breakdown = await Sale.aggregate([
          ...(Object.keys(matchStage).length > 0 ? [{ $match: matchStage }] : []),
          { $match: { target: { $exists: true, $gt: 0 } } },
          { $sort: { date: -1 } },
          { $limit: 50 },
          {
            $project: {
              _id: 1,
              date: 1,
              region: 1,
              target: 1,
              achieved: 1,
              revenue: 1,
              completionRate: {
                $round: [
                  { $multiply: [{ $divide: ["$achieved", "$target"] }, 100] },
                  2,
                ],
              },
              variance: { $subtract: ["$achieved", "$target"] },
              status: {
                $cond: [
                  { $gte: ["$achieved", "$target"] },
                  "met",
                  { $cond: [{ $gte: ["$achieved", { $multiply: ["$target", 0.8] }] }, "near", "below"] },
                ],
              },
            },
          },
        ]);
        break;
    }

    return NextResponse.json({
      success: true,
      data: {
        summary: {
          totalTarget: overall.totalTarget,
          totalAchieved: overall.totalAchieved,
          totalRevenue: overall.totalRevenue,
          completionRate,
          variance: overall.totalAchieved - overall.totalTarget,
          recordsWithTargets: overall.recordsWithTargets,
          recordsMetTarget: overall.recordsMetTarget,
          successRate,
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

import { NextResponse } from "next/server";
import dbconnect from "@/lib/db";
import ClientInsight, { IClientInsight } from "@/models/ClientInsights";
import { clientInsightsQuerySchema, validateQueryParams } from "@/lib/validations";

/**
 * GET /api/reports/client-insights
 * Returns comprehensive client behavior and satisfaction analytics
 * Query params:
 * - startDate: ISO date string (optional)
 * - endDate: ISO date string (optional)
 * - campaign: filter by campaign (optional)
 */
export async function GET(req: Request) {
  try {
    await dbconnect();

    const { searchParams } = new URL(req.url);
    
    // Validate query parameters
    const validation = validateQueryParams(searchParams, clientInsightsQuerySchema);
    if (!validation.success) {
      return NextResponse.json(
        { success: false, message: `Validation error: ${validation.error}` },
        { status: 400 }
      );
    }

    const { startDate, endDate, campaign } = validation.data;

    // Build filters
    const matchStage: any = {};
    if (startDate || endDate) {
      matchStage.date = {};
      if (startDate) {
        const start = new Date(startDate);
        start.setHours(0, 0, 0, 0);
        matchStage.date.$gte = start;
      }
      if (endDate) {
        const end = new Date(endDate);
        end.setHours(23, 59, 59, 999);
        matchStage.date.$lte = end;
      }
    }
    if (campaign) {
      matchStage.campaign = campaign;
    }

    // Overall client metrics
    const metricsAgg = await ClientInsight.aggregate([
      ...(Object.keys(matchStage).length > 0 ? [{ $match: matchStage }] : []),
      {
        $group: {
          _id: null,
          totalNewUsers: { $sum: { $ifNull: ["$newUsers", 0] } },
          totalTraffic: { $sum: { $ifNull: ["$traffic", 0] } },
          totalRequests: { $sum: { $ifNull: ["$requestVolume", 0] } },
          avgServiceLevel: { $avg: { $ifNull: ["$serviceLevel", 0] } },
          avgSatisfaction: { $avg: { $ifNull: ["$satisfactionScore", 0] } },
          totalRecords: { $sum: 1 },
        },
      },
    ]);

    const metrics = metricsAgg[0] || {
      totalNewUsers: 0,
      totalTraffic: 0,
      totalRequests: 0,
      avgServiceLevel: 0,
      avgSatisfaction: 0,
      totalRecords: 0,
    };

    // User acquisition rate
    const userAcquisitionRate =
      metrics.totalTraffic > 0
        ? Number(((metrics.totalNewUsers / metrics.totalTraffic) * 100).toFixed(2))
        : 0;

    // Requests per user
    const requestsPerUser =
      metrics.totalNewUsers > 0
        ? Number((metrics.totalRequests / metrics.totalNewUsers).toFixed(2))
        : 0;

    // Campaign performance
    const campaignPerformance = await ClientInsight.aggregate([
      ...(Object.keys(matchStage).length > 0 ? [{ $match: matchStage }] : []),
      { $match: { campaign: { $exists: true, $ne: null } } },
      {
        $group: {
          _id: "$campaign",
          newUsers: { $sum: { $ifNull: ["$newUsers", 0] } },
          traffic: { $sum: { $ifNull: ["$traffic", 0] } },
          requests: { $sum: { $ifNull: ["$requestVolume", 0] } },
          avgServiceLevel: { $avg: { $ifNull: ["$serviceLevel", 0] } },
          avgSatisfaction: { $avg: { $ifNull: ["$satisfactionScore", 0] } },
        },
      },
      { $sort: { newUsers: -1 } },
      { $limit: 10 },
      {
        $project: {
          _id: 0,
          campaign: "$_id",
          newUsers: 1,
          traffic: 1,
          requests: 1,
          avgServiceLevel: { $round: ["$avgServiceLevel", 2] },
          avgSatisfaction: { $round: ["$avgSatisfaction", 2] },
          conversionRate: {
            $round: [
              {
                $cond: [
                  { $gt: ["$traffic", 0] },
                  { $multiply: [{ $divide: ["$newUsers", "$traffic"] }, 100] },
                  0,
                ],
              },
              2,
            ],
          },
        },
      },
    ]);

    // Daily trend analysis
    const trendData = await ClientInsight.aggregate([
      ...(Object.keys(matchStage).length > 0 ? [{ $match: matchStage }] : []),
      {
        $group: {
          _id: {
            year: { $year: "$date" },
            month: { $month: "$date" },
            day: { $dayOfMonth: "$date" },
          },
          newUsers: { $sum: { $ifNull: ["$newUsers", 0] } },
          traffic: { $sum: { $ifNull: ["$traffic", 0] } },
          requests: { $sum: { $ifNull: ["$requestVolume", 0] } },
          avgServiceLevel: { $avg: { $ifNull: ["$serviceLevel", 0] } },
          avgSatisfaction: { $avg: { $ifNull: ["$satisfactionScore", 0] } },
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
          newUsers: 1,
          traffic: 1,
          requests: 1,
          avgServiceLevel: { $round: ["$avgServiceLevel", 2] },
          avgSatisfaction: { $round: ["$avgSatisfaction", 2] },
          conversionRate: {
            $round: [
              {
                $cond: [
                  { $gt: ["$traffic", 0] },
                  { $multiply: [{ $divide: ["$newUsers", "$traffic"] }, 100] },
                  0,
                ],
              },
              2,
            ],
          },
        },
      },
    ]);

    // Satisfaction distribution
    const satisfactionDistribution = await ClientInsight.aggregate([
      ...(Object.keys(matchStage).length > 0 ? [{ $match: matchStage }] : []),
      { $match: { satisfactionScore: { $exists: true, $ne: null } } },
      {
        $bucket: {
          groupBy: "$satisfactionScore",
          boundaries: [0, 1, 2, 3, 4, 5],
          default: "other",
          output: {
            count: { $sum: 1 },
            avgNewUsers: { $avg: "$newUsers" },
            avgTraffic: { $avg: "$traffic" },
          },
        },
      },
      {
        $project: {
          _id: 0,
          range: {
            $switch: {
              branches: [
                { case: { $eq: ["$_id", 0] }, then: "0-1" },
                { case: { $eq: ["$_id", 1] }, then: "1-2" },
                { case: { $eq: ["$_id", 2] }, then: "2-3" },
                { case: { $eq: ["$_id", 3] }, then: "3-4" },
                { case: { $eq: ["$_id", 4] }, then: "4-5" },
              ],
              default: "other",
            },
          },
          count: 1,
          avgNewUsers: { $round: ["$avgNewUsers", 0] },
          avgTraffic: { $round: ["$avgTraffic", 0] },
        },
      },
    ]);

    // Service level analysis
    const serviceLevelStats = await ClientInsight.aggregate([
      ...(Object.keys(matchStage).length > 0 ? [{ $match: matchStage }] : []),
      {
        $group: {
          _id: null,
          minServiceLevel: { $min: "$serviceLevel" },
          maxServiceLevel: { $max: "$serviceLevel" },
          avgServiceLevel: { $avg: "$serviceLevel" },
          recordsAbove80: {
            $sum: { $cond: [{ $gte: ["$serviceLevel", 80] }, 1, 0] },
          },
          recordsBelow50: {
            $sum: { $cond: [{ $lt: ["$serviceLevel", 50] }, 1, 0] },
          },
        },
      },
    ]);

    const serviceLevel = serviceLevelStats[0] || {
      minServiceLevel: 0,
      maxServiceLevel: 0,
      avgServiceLevel: 0,
      recordsAbove80: 0,
      recordsBelow50: 0,
    };

    // Client engagement score (composite metric)
    const engagementScore = Number(
      (
        (requestsPerUser * 0.3 +
          metrics.avgServiceLevel * 0.3 +
          metrics.avgSatisfaction * 20 * 0.4) /
        3
      ).toFixed(2)
    );

    // Growth analysis
    const growthAnalysis =
      trendData.length >= 2
        ? {
            userGrowth: Number(
              (
                ((trendData[trendData.length - 1].newUsers - trendData[0].newUsers) /
                  (trendData[0].newUsers || 1)) *
                100
              ).toFixed(2)
            ),
            trafficGrowth: Number(
              (
                ((trendData[trendData.length - 1].traffic - trendData[0].traffic) /
                  (trendData[0].traffic || 1)) *
                100
              ).toFixed(2)
            ),
            satisfactionTrend:
              trendData[trendData.length - 1].avgSatisfaction >
              trendData[0].avgSatisfaction
                ? "improving"
                : trendData[trendData.length - 1].avgSatisfaction <
                  trendData[0].avgSatisfaction
                ? "declining"
                : "stable",
          }
        : null;

    return NextResponse.json({
      success: true,
      data: {
        summary: {
          totalNewUsers: metrics.totalNewUsers,
          totalTraffic: metrics.totalTraffic,
          totalRequests: metrics.totalRequests,
          avgServiceLevel: Number(metrics.avgServiceLevel.toFixed(2)),
          avgSatisfaction: Number(metrics.avgSatisfaction.toFixed(2)),
          userAcquisitionRate,
          requestsPerUser,
          engagementScore,
          totalRecords: metrics.totalRecords,
        },
        serviceLevel: {
          min: serviceLevel.minServiceLevel,
          max: serviceLevel.maxServiceLevel,
          avg: Number(serviceLevel.avgServiceLevel.toFixed(2)),
          recordsAbove80: serviceLevel.recordsAbove80,
          recordsBelow50: serviceLevel.recordsBelow50,
          performanceRate:
            metrics.totalRecords > 0
              ? Number(
                  ((serviceLevel.recordsAbove80 / metrics.totalRecords) * 100).toFixed(2)
                )
              : 0,
        },
        campaignPerformance,
        trend: trendData,
        satisfactionDistribution,
        growthAnalysis,
        filters: {
          startDate: startDate || null,
          endDate: endDate || null,
          campaign: campaign || null,
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

export async function POST(req: Request) {
  try {
    await dbconnect();

    const body = await req.json();

    const newInsight = await ClientInsight.create(body);

    return NextResponse.json({
      success: true,
      data: newInsight,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message || "Server Error" },
      { status: 500 }
    );
  }
}

import { NextResponse } from "next/server";
import dbconnect from "@/lib/db";
import MarketingMetric, { IMarketingMetric } from "@/models/MarketingMetric";

/**
 * GET /api/reports/marketing
 * Returns comprehensive marketing analytics
 * Query params:
 * - startDate: ISO date string (optional)
 * - endDate: ISO date string (optional)
 * - campaignId: filter by specific campaign (optional)
 */
export async function GET(req: Request) {
    try {
        await dbconnect();

        const { searchParams } = new URL(req.url);
        const startDate = searchParams.get("startDate");
        const endDate = searchParams.get("endDate");
        const campaignId = searchParams.get("campaignId");

        // Build filters
        const matchStage: any = {};
        if (startDate || endDate) {
            matchStage.date = {};
            if (startDate) matchStage.date.$gte = new Date(startDate);
            if (endDate) matchStage.date.$lte = new Date(endDate);
        }
        if (campaignId) {
            matchStage.campaignId = campaignId;
        }

        // Overall KPIs
        const kpisAgg = await MarketingMetric.aggregate([
            ...(Object.keys(matchStage).length > 0 ? [{ $match: matchStage }] : []),
            {
                $group: {
                    _id: null,
                    totalClicks: { $sum: { $ifNull: ["$clicks", 0] } },
                    avgCPO: { $avg: { $ifNull: ["$cpo", 0] } },
                    totalGoalValue: { $sum: { $ifNull: ["$goalValue", 0] } },
                    avgGoalRate: { $avg: { $ifNull: ["$goalRate", 0] } },
                    avgBounceRate: { $avg: { $ifNull: ["$bounceRate", 0] } },
                    avgDuration: { $avg: { $ifNull: ["$avgDuration", 0] } },
                    avgPerformance: { $avg: { $ifNull: ["$performance", 0] } },
                    totalRecords: { $sum: 1 },
                },
            },
        ]);

        const kpis = kpisAgg[0] || {
            totalClicks: 0,
            avgCPO: 0,
            totalGoalValue: 0,
            avgGoalRate: 0,
            avgBounceRate: 0,
            avgDuration: 0,
            avgPerformance: 0,
            totalRecords: 0,
        };

        // Campaign performance breakdown
        const campaignPerformance = await MarketingMetric.aggregate([
            ...(Object.keys(matchStage).length > 0 ? [{ $match: matchStage }] : []),
            { $match: { campaignId: { $exists: true, $ne: null } } },
            {
                $group: {
                    _id: "$campaignId",
                    clicks: { $sum: { $ifNull: ["$clicks", 0] } },
                    avgCPO: { $avg: { $ifNull: ["$cpo", 0] } },
                    goalValue: { $sum: { $ifNull: ["$goalValue", 0] } },
                    avgGoalRate: { $avg: { $ifNull: ["$goalRate", 0] } },
                    avgBounceRate: { $avg: { $ifNull: ["$bounceRate", 0] } },
                    avgPerformance: { $avg: { $ifNull: ["$performance", 0] } },
                    records: { $sum: 1 },
                },
            },
            { $sort: { clicks: -1 } },
            { $limit: 10 },
            {
                $project: {
                    _id: 0,
                    campaignId: "$_id",
                    clicks: 1,
                    avgCPO: { $round: ["$avgCPO", 2] },
                    goalValue: 1,
                    avgGoalRate: { $round: ["$avgGoalRate", 2] },
                    avgBounceRate: { $round: ["$avgBounceRate", 2] },
                    avgPerformance: { $round: ["$avgPerformance", 2] },
                    records: 1,
                    roi: {
                        $round: [
                            {
                                $cond: [
                                    { $gt: ["$avgCPO", 0] },
                                    { $divide: ["$goalValue", { $multiply: ["$avgCPO", "$clicks"] }] },
                                    0,
                                ],
                            },
                            2,
                        ],
                    },
                },
            },
        ]);

        // Time-based trend (last 30 days or filtered range)
        const trendAgg = await MarketingMetric.aggregate([
            ...(Object.keys(matchStage).length > 0 ? [{ $match: matchStage }] : []),
            {
                $group: {
                    _id: {
                        year: { $year: "$date" },
                        month: { $month: "$date" },
                        day: { $dayOfMonth: "$date" },
                    },
                    clicks: { $sum: { $ifNull: ["$clicks", 0] } },
                    goalValue: { $sum: { $ifNull: ["$goalValue", 0] } },
                    avgGoalRate: { $avg: { $ifNull: ["$goalRate", 0] } },
                    avgBounceRate: { $avg: { $ifNull: ["$bounceRate", 0] } },
                    avgPerformance: { $avg: { $ifNull: ["$performance", 0] } },
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
                    clicks: 1,
                    goalValue: 1,
                    avgGoalRate: { $round: ["$avgGoalRate", 2] },
                    avgBounceRate: { $round: ["$avgBounceRate", 2] },
                    avgPerformance: { $round: ["$avgPerformance", 2] },
                },
            },
        ]);

        // Top countries analysis
        const countriesAgg = await MarketingMetric.aggregate([
            ...(Object.keys(matchStage).length > 0 ? [{ $match: matchStage }] : []),
            { $unwind: "$topCountries" },
            {
                $group: {
                    _id: "$topCountries",
                    count: { $sum: 1 },
                },
            },
            { $sort: { count: -1 } },
            { $limit: 10 },
            {
                $project: {
                    _id: 0,
                    country: "$_id",
                    count: 1,
                },
            },
        ]);

        // Performance distribution
        const performanceDistribution = await MarketingMetric.aggregate([
            ...(Object.keys(matchStage).length > 0 ? [{ $match: matchStage }] : []),
            {
                $bucket: {
                    groupBy: "$performance",
                    boundaries: [0, 20, 40, 60, 80, 100],
                    default: "other",
                    output: {
                        count: { $sum: 1 },
                        avgClicks: { $avg: "$clicks" },
                        avgGoalValue: { $avg: "$goalValue" },
                    },
                },
            },
            {
                $project: {
                    _id: 0,
                    range: {
                        $switch: {
                            branches: [
                                { case: { $eq: ["$_id", 0] }, then: "0-20" },
                                { case: { $eq: ["$_id", 20] }, then: "20-40" },
                                { case: { $eq: ["$_id", 40] }, then: "40-60" },
                                { case: { $eq: ["$_id", 60] }, then: "60-80" },
                                { case: { $eq: ["$_id", 80] }, then: "80-100" },
                            ],
                            default: "other",
                        },
                    },
                    count: 1,
                    avgClicks: { $round: ["$avgClicks", 0] },
                    avgGoalValue: { $round: ["$avgGoalValue", 2] },
                },
            },
        ]);

        return NextResponse.json({
            success: true,
            data: {
                kpis: {
                    totalClicks: kpis.totalClicks,
                    avgCPO: Number(kpis.avgCPO.toFixed(2)),
                    totalGoalValue: kpis.totalGoalValue,
                    avgGoalRate: Number(kpis.avgGoalRate.toFixed(2)),
                    avgBounceRate: Number(kpis.avgBounceRate.toFixed(2)),
                    avgDuration: Number(kpis.avgDuration.toFixed(2)),
                    avgPerformance: Number(kpis.avgPerformance.toFixed(2)),
                    totalRecords: kpis.totalRecords,
                },
                campaignPerformance,
                trend: trendAgg,
                topCountries: countriesAgg,
                performanceDistribution,
                filters: {
                    startDate: startDate || null,
                    endDate: endDate || null,
                    campaignId: campaignId || null,
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

        const newMetric = await MarketingMetric.create(body);

        return NextResponse.json({
            success: true,
            data: newMetric,
        });
    } catch (error: any) {
        return NextResponse.json(
            { success: false, message: error.message || "Server Error" },
            { status: 500 }
        );
    }
}

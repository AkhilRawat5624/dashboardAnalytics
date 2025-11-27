import { NextResponse } from "next/server";
import dbconnect from "@/lib/db";
import Financial, { IFinancial } from "@/models/Financial";
import { financialQuerySchema, validateQueryParams } from "@/lib/validations";

/**
 * GET /api/reports/financial
 * Returns comprehensive financial metrics and health indicators
 * Query params:
 * - startDate: ISO date string (optional)
 * - endDate: ISO date string (optional)
 * - period: "daily" | "monthly" | "quarterly" (default: "monthly")
 */
export async function GET(req: Request) {
  try {
    await dbconnect();

    const { searchParams } = new URL(req.url);
    
    // Validate query parameters
    const validation = validateQueryParams(searchParams, financialQuerySchema);
    if (!validation.success) {
      return NextResponse.json(
        { success: false, message: `Validation error: ${validation.error}` },
        { status: 400 }
      );
    }

    const { startDate, endDate, period = "monthly" } = validation.data;

    // Build date filter
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

    // Latest financial snapshot
    const latestRecord = await Financial.findOne()
      .sort({ date: -1 })
      .lean<IFinancial>();

    // Overall financial health metrics
    const healthMetrics = await Financial.aggregate([
      ...(Object.keys(matchStage).length > 0 ? [{ $match: matchStage }] : []),
      {
        $group: {
          _id: null,
          avgWorkingCapital: { $avg: { $ifNull: ["$workingCapital", 0] } },
          avgCurrentRatio: { $avg: { $ifNull: ["$currentRatio", 0] } },
          avgCashFlowRatio: { $avg: { $ifNull: ["$cashFlowRatio", 0] } },
          avgGrossProfit: { $avg: { $ifNull: ["$grossProfit", 0] } },
          avgOpexRatio: { $avg: { $ifNull: ["$opexRatio", 0] } },
          avgOperationProfit: { $avg: { $ifNull: ["$operationProfit", 0] } },
          avgLiquidityRatio: { $avg: { $ifNull: ["$liquidityRatio", 0] } },
          avgNetWorth: { $avg: { $ifNull: ["$netWorth", 0] } },
          avgCurrentCapital: { $avg: { $ifNull: ["$currentCapital", 0] } },
          totalRecords: { $sum: 1 },
        },
      },
    ]);

    const health = healthMetrics[0] || {
      avgWorkingCapital: 0,
      avgCurrentRatio: 0,
      avgCashFlowRatio: 0,
      avgGrossProfit: 0,
      avgOpexRatio: 0,
      avgOperationProfit: 0,
      avgLiquidityRatio: 0,
      avgNetWorth: 0,
      avgCurrentCapital: 0,
      totalRecords: 0,
    };

    // Financial health score calculation
    const calculateHealthScore = () => {
      let score = 0;
      let factors = 0;

      // Current Ratio (healthy: > 1.5)
      if (health.avgCurrentRatio > 0) {
        score += health.avgCurrentRatio >= 1.5 ? 20 : (health.avgCurrentRatio / 1.5) * 20;
        factors++;
      }

      // Cash Flow Ratio (healthy: > 1)
      if (health.avgCashFlowRatio > 0) {
        score += health.avgCashFlowRatio >= 1 ? 20 : health.avgCashFlowRatio * 20;
        factors++;
      }

      // Liquidity Ratio (healthy: > 1)
      if (health.avgLiquidityRatio > 0) {
        score += health.avgLiquidityRatio >= 1 ? 20 : health.avgLiquidityRatio * 20;
        factors++;
      }

      // Opex Ratio (healthy: < 30%)
      if (health.avgOpexRatio > 0) {
        score += health.avgOpexRatio <= 30 ? 20 : Math.max(0, 20 - (health.avgOpexRatio - 30));
        factors++;
      }

      // Profitability (positive operation profit)
      if (health.avgOperationProfit > 0) {
        score += 20;
        factors++;
      }

      return factors > 0 ? Number((score / factors).toFixed(2)) : 0;
    };

    const healthScore = calculateHealthScore();

    // Time-based trend
    let groupBy: any;
    switch (period) {
      case "quarterly":
        groupBy = {
          year: { $year: "$date" },
          quarter: { $ceil: { $divide: [{ $month: "$date" }, 3] } },
        };
        break;
      case "daily":
        groupBy = {
          year: { $year: "$date" },
          month: { $month: "$date" },
          day: { $dayOfMonth: "$date" },
        };
        break;
      case "monthly":
      default:
        groupBy = {
          year: { $year: "$date" },
          month: { $month: "$date" },
        };
        break;
    }

    const trendData = await Financial.aggregate([
      ...(Object.keys(matchStage).length > 0 ? [{ $match: matchStage }] : []),
      {
        $group: {
          _id: groupBy,
          workingCapital: { $avg: { $ifNull: ["$workingCapital", 0] } },
          currentRatio: { $avg: { $ifNull: ["$currentRatio", 0] } },
          cashFlowRatio: { $avg: { $ifNull: ["$cashFlowRatio", 0] } },
          grossProfit: { $avg: { $ifNull: ["$grossProfit", 0] } },
          operationProfit: { $avg: { $ifNull: ["$operationProfit", 0] } },
          netWorth: { $avg: { $ifNull: ["$netWorth", 0] } },
          liquidityRatio: { $avg: { $ifNull: ["$liquidityRatio", 0] } },
        },
      },
      {
        $sort: {
          "_id.year": 1,
          "_id.quarter": 1,
          "_id.month": 1,
          "_id.day": 1,
        },
      },
      {
        $project: {
          _id: 0,
          period: "$_id",
          workingCapital: { $round: ["$workingCapital", 2] },
          currentRatio: { $round: ["$currentRatio", 2] },
          cashFlowRatio: { $round: ["$cashFlowRatio", 2] },
          grossProfit: { $round: ["$grossProfit", 2] },
          operationProfit: { $round: ["$operationProfit", 2] },
          netWorth: { $round: ["$netWorth", 2] },
          liquidityRatio: { $round: ["$liquidityRatio", 2] },
        },
      },
    ]);

    // Profitability analysis
    const profitabilityTrend = trendData.map((item) => ({
      period: item.period,
      grossProfit: item.grossProfit,
      operationProfit: item.operationProfit,
      profitMargin:
        item.grossProfit > 0
          ? Number(((item.operationProfit / item.grossProfit) * 100).toFixed(2))
          : 0,
    }));

    // Liquidity analysis
    const liquidityTrend = trendData.map((item) => ({
      period: item.period,
      currentRatio: item.currentRatio,
      cashFlowRatio: item.cashFlowRatio,
      liquidityRatio: item.liquidityRatio,
      workingCapital: item.workingCapital,
    }));

    // Growth analysis (compare first and last period)
    const growthAnalysis =
      trendData.length >= 2
        ? {
            netWorthGrowth: Number(
              (
                ((trendData[trendData.length - 1].netWorth - trendData[0].netWorth) /
                  Math.abs(trendData[0].netWorth || 1)) *
                100
              ).toFixed(2)
            ),
            profitGrowth: Number(
              (
                ((trendData[trendData.length - 1].operationProfit -
                  trendData[0].operationProfit) /
                  Math.abs(trendData[0].operationProfit || 1)) *
                100
              ).toFixed(2)
            ),
            capitalGrowth: Number(
              (
                ((trendData[trendData.length - 1].workingCapital -
                  trendData[0].workingCapital) /
                  Math.abs(trendData[0].workingCapital || 1)) *
                100
              ).toFixed(2)
            ),
          }
        : null;

    return NextResponse.json({
      success: true,
      data: {
        latest: latestRecord
          ? {
              date: latestRecord.date,
              workingCapital: latestRecord.workingCapital,
              currentRatio: latestRecord.currentRatio,
              cashFlowRatio: latestRecord.cashFlowRatio,
              grossProfit: latestRecord.grossProfit,
              operationProfit: latestRecord.operationProfit,
              netWorth: latestRecord.netWorth,
              liquidityRatio: latestRecord.liquidityRatio,
            }
          : null,
        healthMetrics: {
          avgWorkingCapital: Number(health.avgWorkingCapital.toFixed(2)),
          avgCurrentRatio: Number(health.avgCurrentRatio.toFixed(2)),
          avgCashFlowRatio: Number(health.avgCashFlowRatio.toFixed(2)),
          avgGrossProfit: Number(health.avgGrossProfit.toFixed(2)),
          avgOpexRatio: Number(health.avgOpexRatio.toFixed(2)),
          avgOperationProfit: Number(health.avgOperationProfit.toFixed(2)),
          avgLiquidityRatio: Number(health.avgLiquidityRatio.toFixed(2)),
          avgNetWorth: Number(health.avgNetWorth.toFixed(2)),
          healthScore,
          status:
            healthScore >= 80
              ? "excellent"
              : healthScore >= 60
              ? "good"
              : healthScore >= 40
              ? "fair"
              : "poor",
        },
        profitabilityTrend,
        liquidityTrend,
        growthAnalysis,
        filters: {
          startDate: startDate || null,
          endDate: endDate || null,
          period,
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

    const newFinancial = await Financial.create(body);

    return NextResponse.json({
      success: true,
      data: newFinancial,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message || "Server Error" },
      { status: 500 }
    );
  }
}

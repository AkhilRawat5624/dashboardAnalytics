import { NextResponse } from "next/server";
import dbconnect from "@/lib/db";
import { generateInsight } from "@/lib/gemini";
import Sale from "@/models/Sale";
import MarketingMetric from "@/models/MarketingMetric";
import ClientInsight from "@/models/ClientInsights";
import Financial from "@/models/Financial";
import { z } from "zod";
import { validateRequestBody } from "@/lib/validations";

const aiSummariseBodySchema = z.object({
  period: z.enum(["daily", "weekly", "monthly"]).default("weekly"),
  includeMetrics: z.array(z.string()).default(["all"]),
  format: z.enum(["brief", "detailed"]).default("brief"),
});

/**
 * POST /api/ai/summarise
 * Generates AI-powered summary of analytics data
 * Body params:
 * - period: "daily" | "weekly" | "monthly" (default: "weekly")
 * - includeMetrics: string[] - Which metrics to include (default: all)
 * - format: "brief" | "detailed" (default: "brief")
 */
export async function POST(req: Request) {
  try {
    await dbconnect();

    const body = await req.json();
    
    // Validate request body
    const validation = validateRequestBody(body, aiSummariseBodySchema);
    if (!validation.success) {
      return NextResponse.json(
        { success: false, message: `Validation error: ${validation.error}` },
        { status: 400 }
      );
    }

    const { period, includeMetrics, format } = validation.data;

    // Calculate date range based on period
    const now = new Date();
    let startDate: Date;

    switch (period) {
      case "daily":
        startDate = new Date(now.getTime() - 24 * 60 * 60 * 1000);
        break;
      case "monthly":
        startDate = new Date(now.getFullYear(), now.getMonth() - 1, now.getDate());
        break;
      case "weekly":
      default:
        startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        break;
    }

    const shouldInclude = (metric: string) =>
      includeMetrics.includes("all") || includeMetrics.includes(metric);

    let summaryData = "";

    // Sales Summary
    if (shouldInclude("sales")) {
      const salesSummary = await Sale.aggregate([
        { $match: { date: { $gte: startDate } } },
        {
          $group: {
            _id: null,
            totalRevenue: { $sum: "$revenue" },
            totalOrders: { $sum: "$orders" },
            avgOrderValue: { $avg: "$avgOrderValue" },
            totalTarget: { $sum: "$target" },
            totalAchieved: { $sum: "$achieved" },
          },
        },
      ]);

      const sales = salesSummary[0] || {};
      const targetCompletion =
        sales.totalTarget > 0
          ? ((sales.totalAchieved / sales.totalTarget) * 100).toFixed(2)
          : 0;

      summaryData += `\n📊 SALES (${period.toUpperCase()})
- Revenue: $${sales.totalRevenue || 0}
- Orders: ${sales.totalOrders || 0}
- Avg Order Value: $${sales.avgOrderValue?.toFixed(2) || 0}
- Target Completion: ${targetCompletion}%\n`;
    }

    // Marketing Summary
    if (shouldInclude("marketing")) {
      const marketingSummary = await MarketingMetric.aggregate([
        { $match: { date: { $gte: startDate } } },
        {
          $group: {
            _id: null,
            totalClicks: { $sum: "$clicks" },
            avgCPO: { $avg: "$cpo" },
            totalGoalValue: { $sum: "$goalValue" },
            avgGoalRate: { $avg: "$goalRate" },
            avgBounceRate: { $avg: "$bounceRate" },
            avgPerformance: { $avg: "$performance" },
          },
        },
      ]);

      const marketing = marketingSummary[0] || {};
      summaryData += `\n📈 MARKETING (${period.toUpperCase()})
- Total Clicks: ${marketing.totalClicks || 0}
- Avg CPO: $${marketing.avgCPO?.toFixed(2) || 0}
- Goal Value: $${marketing.totalGoalValue || 0}
- Avg Goal Rate: ${marketing.avgGoalRate?.toFixed(2) || 0}%
- Avg Bounce Rate: ${marketing.avgBounceRate?.toFixed(2) || 0}%
- Avg Performance: ${marketing.avgPerformance?.toFixed(2) || 0}\n`;
    }

    // Client Summary
    if (shouldInclude("clients")) {
      const clientSummary = await ClientInsight.aggregate([
        { $match: { date: { $gte: startDate } } },
        {
          $group: {
            _id: null,
            totalNewUsers: { $sum: "$newUsers" },
            totalTraffic: { $sum: "$traffic" },
            totalRequests: { $sum: "$requestVolume" },
            avgServiceLevel: { $avg: "$serviceLevel" },
            avgSatisfaction: { $avg: "$satisfactionScore" },
          },
        },
      ]);

      const clients = clientSummary[0] || {};
      const conversionRate =
        clients.totalTraffic > 0
          ? ((clients.totalNewUsers / clients.totalTraffic) * 100).toFixed(2)
          : 0;

      summaryData += `\n👥 CLIENT INSIGHTS (${period.toUpperCase()})
- New Users: ${clients.totalNewUsers || 0}
- Total Traffic: ${clients.totalTraffic || 0}
- Conversion Rate: ${conversionRate}%
- Avg Service Level: ${clients.avgServiceLevel?.toFixed(2) || 0}
- Avg Satisfaction: ${clients.avgSatisfaction?.toFixed(2) || 0}/5\n`;
    }

    // Financial Summary
    if (shouldInclude("financial")) {
      const financialSummary = await Financial.aggregate([
        { $match: { date: { $gte: startDate } } },
        {
          $group: {
            _id: null,
            avgWorkingCapital: { $avg: "$workingCapital" },
            avgCurrentRatio: { $avg: "$currentRatio" },
            avgCashFlowRatio: { $avg: "$cashFlowRatio" },
            avgGrossProfit: { $avg: "$grossProfit" },
            avgOperationProfit: { $avg: "$operationProfit" },
            avgNetWorth: { $avg: "$netWorth" },
          },
        },
      ]);

      const financial = financialSummary[0] || {};
      summaryData += `\n💰 FINANCIAL (${period.toUpperCase()})
- Avg Working Capital: $${financial.avgWorkingCapital?.toFixed(2) || 0}
- Avg Current Ratio: ${financial.avgCurrentRatio?.toFixed(2) || 0}
- Avg Cash Flow Ratio: ${financial.avgCashFlowRatio?.toFixed(2) || 0}
- Avg Gross Profit: $${financial.avgGrossProfit?.toFixed(2) || 0}
- Avg Operation Profit: $${financial.avgOperationProfit?.toFixed(2) || 0}
- Avg Net Worth: $${financial.avgNetWorth?.toFixed(2) || 0}\n`;
    }

    if (!summaryData) {
      return NextResponse.json(
        { success: false, message: "No metrics selected for summary" },
        { status: 400 }
      );
    }

    // Build prompt for Gemini
    const promptStyle =
      format === "detailed"
        ? "Provide a detailed executive summary with analysis of trends, comparisons, and strategic recommendations."
        : "Provide a brief, concise executive summary highlighting the most important points.";

    const prompt = `You are a business analytics AI assistant. Create an executive summary based on the following ${period} analytics data:

${summaryData}

${promptStyle}

Structure your summary with:
1. Overall Performance Overview
2. Key Highlights (positive trends)
3. Areas of Concern (if any)
4. Quick Recommendations

Keep it professional and actionable.`;

    // Generate summary using Gemini
    const summary = await generateInsight(prompt);

    return NextResponse.json({
      success: true,
      data: {
        summary,
        period,
        dateRange: {
          start: startDate,
          end: now,
        },
        rawData: summaryData,
      },
    });
  } catch (error: any) {
    console.error("AI Summarise error:", error);
    return NextResponse.json(
      { success: false, message: error.message || "Failed to generate summary" },
      { status: 500 }
    );
  }
}

import { NextResponse } from "next/server";
import dbconnect from "@/lib/db";
import { generateInsight } from "@/lib/gemini";
import AiSuggestion from "@/models/AiSuggestion";
import Sale from "@/models/Sale";
import MarketingMetric from "@/models/MarketingMetric";
import ClientInsight from "@/models/ClientInsights";
import Financial from "@/models/Financial";
import crypto from "crypto";

/**
 * POST /api/ai/suggest
 * Generates AI-powered suggestions based on analytics data
 * Body params:
 * - type: "sales" | "marketing" | "financial" | "client" | "general"
 * - context: object (optional) - Additional context data
 * - useCache: boolean (optional) - Use cached suggestions if available
 */
export async function POST(req: Request) {
  try {
    await dbconnect();

    const body = await req.json();
    const { type = "general", context = {}, useCache = true } = body;

    // Create context hash for caching
    const contextString = JSON.stringify({ type, context });
    const contextHash = crypto.createHash("md5").update(contextString).digest("hex");

    // Check cache if enabled
    if (useCache) {
      const cached = await AiSuggestion.findOne({ contextHash })
        .sort({ createdAt: -1 })
        .lean();

      // Return cached if less than 1 hour old
      if (cached && Date.now() - new Date(cached.createdAt).getTime() < 3600000) {
        return NextResponse.json({
          success: true,
          data: {
            insight: cached.insight,
            type: cached.type,
            cached: true,
            createdAt: cached.createdAt,
          },
        });
      }
    }

    // Gather relevant data based on type
    let dataContext = "";

    switch (type) {
      case "sales": {
        const recentSales = await Sale.aggregate([
          { $sort: { date: -1 } },
          { $limit: 30 },
          {
            $group: {
              _id: null,
              totalRevenue: { $sum: "$revenue" },
              totalOrders: { $sum: "$orders" },
              avgOrderValue: { $avg: "$avgOrderValue" },
              topRegion: { $first: "$region" },
            },
          },
        ]);

        const salesData = recentSales[0] || {};
        dataContext = `Recent sales data (last 30 records):
- Total Revenue: $${salesData.totalRevenue || 0}
- Total Orders: ${salesData.totalOrders || 0}
- Average Order Value: $${salesData.avgOrderValue?.toFixed(2) || 0}
- Top Region: ${salesData.topRegion || "N/A"}`;
        break;
      }

      case "marketing": {
        const recentMarketing = await MarketingMetric.aggregate([
          { $sort: { date: -1 } },
          { $limit: 20 },
          {
            $group: {
              _id: null,
              totalClicks: { $sum: "$clicks" },
              avgCPO: { $avg: "$cpo" },
              avgGoalRate: { $avg: "$goalRate" },
              avgBounceRate: { $avg: "$bounceRate" },
              avgPerformance: { $avg: "$performance" },
            },
          },
        ]);

        const marketingData = recentMarketing[0] || {};
        dataContext = `Recent marketing metrics (last 20 records):
- Total Clicks: ${marketingData.totalClicks || 0}
- Average CPO: $${marketingData.avgCPO?.toFixed(2) || 0}
- Average Goal Rate: ${marketingData.avgGoalRate?.toFixed(2) || 0}%
- Average Bounce Rate: ${marketingData.avgBounceRate?.toFixed(2) || 0}%
- Average Performance: ${marketingData.avgPerformance?.toFixed(2) || 0}`;
        break;
      }

      case "financial": {
        const recentFinancial = await Financial.findOne().sort({ date: -1 }).lean();

        if (recentFinancial) {
          dataContext = `Latest financial metrics:
- Working Capital: $${recentFinancial.workingCapital}
- Current Ratio: ${recentFinancial.currentRatio}
- Cash Flow Ratio: ${recentFinancial.cashFlowRatio}
- Gross Profit: $${recentFinancial.grossProfit}
- Operation Profit: $${recentFinancial.operationProfit}
- Net Worth: $${recentFinancial.netWorth}
- Liquidity Ratio: ${recentFinancial.liquidityRatio}`;
        }
        break;
      }

      case "client": {
        const recentClients = await ClientInsight.aggregate([
          { $sort: { date: -1 } },
          { $limit: 20 },
          {
            $group: {
              _id: null,
              totalNewUsers: { $sum: "$newUsers" },
              totalTraffic: { $sum: "$traffic" },
              avgServiceLevel: { $avg: "$serviceLevel" },
              avgSatisfaction: { $avg: "$satisfactionScore" },
            },
          },
        ]);

        const clientData = recentClients[0] || {};
        dataContext = `Recent client insights (last 20 records):
- Total New Users: ${clientData.totalNewUsers || 0}
- Total Traffic: ${clientData.totalTraffic || 0}
- Average Service Level: ${clientData.avgServiceLevel?.toFixed(2) || 0}
- Average Satisfaction: ${clientData.avgSatisfaction?.toFixed(2) || 0}/5`;
        break;
      }

      case "general":
      default: {
        const [salesCount, marketingCount, clientsCount, financialsCount] = await Promise.all([
          Sale.countDocuments(),
          MarketingMetric.countDocuments(),
          ClientInsight.countDocuments(),
          Financial.countDocuments(),
        ]);

        dataContext = `Overall dashboard statistics:
- Sales Records: ${salesCount}
- Marketing Records: ${marketingCount}
- Client Records: ${clientsCount}
- Financial Records: ${financialsCount}`;
        break;
      }
    }

    // Build prompt for Gemini
    const prompt = `You are a business analytics AI assistant. Based on the following data, provide 3-5 actionable insights and recommendations.

${dataContext}

${context.additionalInfo ? `Additional Context: ${context.additionalInfo}` : ""}

Provide clear, concise, and actionable suggestions that a business analyst or manager can implement. Focus on:
1. Key trends or patterns
2. Areas of concern or opportunity
3. Specific actionable recommendations
4. Potential risks or challenges

Format your response as a numbered list of insights.`;

    // Generate insight using Gemini
    const insight = await generateInsight(prompt);

    // Save to database
    const suggestion = await AiSuggestion.create({
      type,
      contextHash,
      insight,
    });

    return NextResponse.json({
      success: true,
      data: {
        insight: suggestion.insight,
        type: suggestion.type,
        cached: false,
        createdAt: suggestion.createdAt,
      },
    });
  } catch (error: any) {
    console.error("AI Suggest error:", error);
    return NextResponse.json(
      { success: false, message: error.message || "Failed to generate suggestions" },
      { status: 500 }
    );
  }
}

/**
 * GET /api/ai/suggest
 * Retrieves recent AI suggestions
 * Query params:
 * - type: filter by type (optional)
 * - limit: number of suggestions to return (default: 10)
 */
export async function GET(req: Request) {
  try {
    await dbconnect();

    const { searchParams } = new URL(req.url);
    const type = searchParams.get("type");
    const limit = Number(searchParams.get("limit")) || 10;

    const query: any = {};
    if (type) {
      query.type = type;
    }

    const suggestions = await AiSuggestion.find(query)
      .sort({ createdAt: -1 })
      .limit(limit)
      .lean();

    return NextResponse.json({
      success: true,
      data: suggestions,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message || "Failed to retrieve suggestions" },
      { status: 500 }
    );
  }
}

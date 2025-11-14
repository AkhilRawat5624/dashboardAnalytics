import { NextResponse } from "next/server";
import dbconnect from "@/lib/db";
import Sale from "@/models/Sale";
import MarketingMetric from "@/models/MarketingMetric";
import ClientInsight from "@/models/ClientInsights";
import Financial, { IFinancial } from "@/models/Financial";
import DataSource from "@/models/DataSource";

/**
 * GET /api/analytics
 * Main dashboard aggregator - returns comprehensive overview of all metrics
 * Query params:
 * - period: "today" | "week" | "month" | "quarter" | "year" (default: "month")
 */
export async function GET(req: Request) {
    try {
        await dbconnect();

        const { searchParams } = new URL(req.url);
        const period = searchParams.get("period") || "month";

        // Calculate date range
        const now = new Date();
        let startDate: Date;
        let previousStartDate: Date;

        switch (period) {
            case "today":
                startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());
                previousStartDate = new Date(startDate.getTime() - 24 * 60 * 60 * 1000);
                break;
            case "week":
                startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
                previousStartDate = new Date(startDate.getTime() - 7 * 24 * 60 * 60 * 1000);
                break;
            case "quarter":
                startDate = new Date(now.getFullYear(), now.getMonth() - 3, now.getDate());
                previousStartDate = new Date(startDate.getTime() - 90 * 24 * 60 * 60 * 1000);
                break;
            case "year":
                startDate = new Date(now.getFullYear() - 1, now.getMonth(), now.getDate());
                previousStartDate = new Date(startDate.getTime() - 365 * 24 * 60 * 60 * 1000);
                break;
            case "month":
            default:
                startDate = new Date(now.getFullYear(), now.getMonth() - 1, now.getDate());
                previousStartDate = new Date(now.getFullYear(), now.getMonth() - 2, now.getDate());
                break;
        }

        // Parallel data fetching for performance
        const [
            salesMetrics,
            previousSalesMetrics,
            marketingMetrics,
            previousMarketingMetrics,
            clientMetrics,
            previousClientMetrics,
            latestFinancial,
            topRegions,
            topCampaigns,
            recentActivity,
            dataSources,
        ] = await Promise.all([
            // Current period sales
            Sale.aggregate([
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
            ]),

            // Previous period sales for comparison
            Sale.aggregate([
                { $match: { date: { $gte: previousStartDate, $lt: startDate } } },
                {
                    $group: {
                        _id: null,
                        totalRevenue: { $sum: "$revenue" },
                        totalOrders: { $sum: "$orders" },
                    },
                },
            ]),

            // Current period marketing
            MarketingMetric.aggregate([
                { $match: { date: { $gte: startDate } } },
                {
                    $group: {
                        _id: null,
                        totalClicks: { $sum: "$clicks" },
                        avgCPO: { $avg: "$cpo" },
                        totalGoalValue: { $sum: "$goalValue" },
                        avgPerformance: { $avg: "$performance" },
                        avgBounceRate: { $avg: "$bounceRate" },
                    },
                },
            ]),

            // Previous period marketing
            MarketingMetric.aggregate([
                { $match: { date: { $gte: previousStartDate, $lt: startDate } } },
                {
                    $group: {
                        _id: null,
                        totalClicks: { $sum: "$clicks" },
                    },
                },
            ]),

            // Current period clients
            ClientInsight.aggregate([
                { $match: { date: { $gte: startDate } } },
                {
                    $group: {
                        _id: null,
                        totalNewUsers: { $sum: "$newUsers" },
                        totalTraffic: { $sum: "$traffic" },
                        avgSatisfaction: { $avg: "$satisfactionScore" },
                        avgServiceLevel: { $avg: "$serviceLevel" },
                    },
                },
            ]),

            // Previous period clients
            ClientInsight.aggregate([
                { $match: { date: { $gte: previousStartDate, $lt: startDate } } },
                {
                    $group: {
                        _id: null,
                        totalNewUsers: { $sum: "$newUsers" },
                    },
                },
            ]),

            // Latest financial snapshot
            Financial.findOne().sort({ date: -1 }).lean<IFinancial>(),

            // Top 5 regions by revenue
            Sale.aggregate([
                { $match: { date: { $gte: startDate } } },
                {
                    $group: {
                        _id: "$region",
                        revenue: { $sum: "$revenue" },
                        orders: { $sum: "$orders" },
                    },
                },
                { $sort: { revenue: -1 } },
                { $limit: 5 },
                {
                    $project: {
                        _id: 0,
                        region: "$_id",
                        revenue: 1,
                        orders: 1,
                    },
                },
            ]),

            // Top 5 campaigns by performance
            MarketingMetric.aggregate([
                { $match: { date: { $gte: startDate }, campaignId: { $exists: true, $ne: null } } },
                {
                    $group: {
                        _id: "$campaignId",
                        clicks: { $sum: "$clicks" },
                        avgPerformance: { $avg: "$performance" },
                        goalValue: { $sum: "$goalValue" },
                    },
                },
                { $sort: { avgPerformance: -1 } },
                { $limit: 5 },
                {
                    $project: {
                        _id: 0,
                        campaignId: "$_id",
                        clicks: 1,
                        avgPerformance: { $round: ["$avgPerformance", 2] },
                        goalValue: 1,
                    },
                },
            ]),

            // Recent activity (last 10 sales)
            Sale.find()
                .sort({ date: -1 })
                .limit(10)
                .select("date region revenue orders")
                .lean(),

            // Data sources status
            DataSource.find().lean(),
        ]);

        // Process sales data
        const sales = salesMetrics[0] || {
            totalRevenue: 0,
            totalOrders: 0,
            avgOrderValue: 0,
            totalTarget: 0,
            totalAchieved: 0,
        };
        const prevSales = previousSalesMetrics[0] || { totalRevenue: 0, totalOrders: 0 };

        const revenueGrowth =
            prevSales.totalRevenue > 0
                ? Number((((sales.totalRevenue - prevSales.totalRevenue) / prevSales.totalRevenue) * 100).toFixed(2))
                : 0;

        const ordersGrowth =
            prevSales.totalOrders > 0
                ? Number((((sales.totalOrders - prevSales.totalOrders) / prevSales.totalOrders) * 100).toFixed(2))
                : 0;

        const targetCompletion =
            sales.totalTarget > 0
                ? Number(((sales.totalAchieved / sales.totalTarget) * 100).toFixed(2))
                : 0;

        // Process marketing data
        const marketing = marketingMetrics[0] || {
            totalClicks: 0,
            avgCPO: 0,
            totalGoalValue: 0,
            avgPerformance: 0,
            avgBounceRate: 0,
        };
        const prevMarketing = previousMarketingMetrics[0] || { totalClicks: 0 };

        const clicksGrowth =
            prevMarketing.totalClicks > 0
                ? Number((((marketing.totalClicks - prevMarketing.totalClicks) / prevMarketing.totalClicks) * 100).toFixed(2))
                : 0;

        // Process client data
        const clients = clientMetrics[0] || {
            totalNewUsers: 0,
            totalTraffic: 0,
            avgSatisfaction: 0,
            avgServiceLevel: 0,
        };
        const prevClients = previousClientMetrics[0] || { totalNewUsers: 0 };

        const usersGrowth =
            prevClients.totalNewUsers > 0
                ? Number((((clients.totalNewUsers - prevClients.totalNewUsers) / prevClients.totalNewUsers) * 100).toFixed(2))
                : 0;

        const conversionRate =
            clients.totalTraffic > 0
                ? Number(((clients.totalNewUsers / clients.totalTraffic) * 100).toFixed(2))
                : 0;

        // Financial health score
        let financialHealthScore = 0;
        let financialStatus = "unknown";

        if (latestFinancial) {
            let score = 0;
            let factors = 0;

            if (latestFinancial.currentRatio > 0) {
                score += latestFinancial.currentRatio >= 1.5 ? 25 : (latestFinancial.currentRatio / 1.5) * 25;
                factors++;
            }
            if (latestFinancial.cashFlowRatio > 0) {
                score += latestFinancial.cashFlowRatio >= 1 ? 25 : latestFinancial.cashFlowRatio * 25;
                factors++;
            }
            if (latestFinancial.liquidityRatio > 0) {
                score += latestFinancial.liquidityRatio >= 1 ? 25 : latestFinancial.liquidityRatio * 25;
                factors++;
            }
            if (latestFinancial.operationProfit > 0) {
                score += 25;
                factors++;
            }

            financialHealthScore = factors > 0 ? Number((score / factors).toFixed(2)) : 0;
            financialStatus =
                financialHealthScore >= 80
                    ? "excellent"
                    : financialHealthScore >= 60
                        ? "good"
                        : financialHealthScore >= 40
                            ? "fair"
                            : "poor";
        }

        // Generate alerts
        const alerts = [];

        if (targetCompletion < 80 && sales.totalTarget > 0) {
            alerts.push({
                type: "warning",
                category: "sales",
                message: `Sales target completion at ${targetCompletion}%`,
                severity: targetCompletion < 50 ? "high" : "medium",
            });
        }

        if (clients.avgSatisfaction < 3 && clients.avgSatisfaction > 0) {
            alerts.push({
                type: "warning",
                category: "client",
                message: `Low customer satisfaction: ${clients.avgSatisfaction.toFixed(2)}/5`,
                severity: "high",
            });
        }

        if (marketing.avgBounceRate > 70) {
            alerts.push({
                type: "warning",
                category: "marketing",
                message: `High bounce rate: ${marketing.avgBounceRate.toFixed(2)}%`,
                severity: "medium",
            });
        }

        if (financialStatus === "poor" || financialStatus === "fair") {
            alerts.push({
                type: "warning",
                category: "financial",
                message: `Financial health status: ${financialStatus}`,
                severity: financialStatus === "poor" ? "high" : "medium",
            });
        }

        if (revenueGrowth < -10) {
            alerts.push({
                type: "alert",
                category: "sales",
                message: `Revenue declined by ${Math.abs(revenueGrowth)}%`,
                severity: "high",
            });
        }

        // Build response
        return NextResponse.json({
            success: true,
            data: {
                period,
                dateRange: {
                    start: startDate,
                    end: now,
                },
                kpis: {
                    sales: {
                        revenue: sales.totalRevenue,
                        revenueGrowth,
                        orders: sales.totalOrders,
                        ordersGrowth,
                        avgOrderValue: Number(sales.avgOrderValue.toFixed(2)),
                        targetCompletion,
                    },
                    marketing: {
                        clicks: marketing.totalClicks,
                        clicksGrowth,
                        avgCPO: Number(marketing.avgCPO.toFixed(2)),
                        goalValue: marketing.totalGoalValue,
                        avgPerformance: Number(marketing.avgPerformance.toFixed(2)),
                        avgBounceRate: Number(marketing.avgBounceRate.toFixed(2)),
                    },
                    clients: {
                        newUsers: clients.totalNewUsers,
                        usersGrowth,
                        traffic: clients.totalTraffic,
                        conversionRate,
                        avgSatisfaction: Number(clients.avgSatisfaction.toFixed(2)),
                        avgServiceLevel: Number(clients.avgServiceLevel.toFixed(2)),
                    },
                    financial: latestFinancial
                        ? {
                            netWorth: latestFinancial.netWorth,
                            workingCapital: latestFinancial.workingCapital,
                            currentRatio: latestFinancial.currentRatio,
                            operationProfit: latestFinancial.operationProfit,
                            healthScore: financialHealthScore,
                            status: financialStatus,
                        }
                        : null,
                },
                topPerformers: {
                    regions: topRegions,
                    campaigns: topCampaigns,
                },
                recentActivity,
                dataSources: dataSources.map((ds) => ({
                    name: ds.name,
                    type: ds.type,
                    status: ds.status,
                    lastSync: ds.lastSync,
                    recordsCount: ds.recordsCount,
                })),
                alerts,
                summary: {
                    totalAlerts: alerts.length,
                    criticalAlerts: alerts.filter((a) => a.severity === "high").length,
                    overallTrend:
                        revenueGrowth > 5 && usersGrowth > 5
                            ? "positive"
                            : revenueGrowth < -5 || usersGrowth < -5
                                ? "negative"
                                : "stable",
                },
            },
        });
    } catch (error: any) {
        console.error("Analytics error:", error);
        return NextResponse.json(
            { success: false, message: error.message || "Failed to fetch analytics" },
            { status: 500 }
        );
    }
}

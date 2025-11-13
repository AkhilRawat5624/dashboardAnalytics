import { NextResponse } from "next/server";
import dbconnect from "@/lib/db";
import Sale from "@/models/Sale";
import MarketingMetric from "@/models/MarketingMetric";
import ClientInsight from "@/models/ClientInsights";
import Financial from "@/models/Financial";
import DataSource from "@/models/DataSource";
import {
  generateFakeSales,
  generateFakeMarketing,
  generateFakeClients,
  generateFakeFinancials,
  generateFakeDataSources,
} from "@/utils/fakerHelpers";

/**
 * POST /api/seed
 * Seeds the database with fake data
 * Body params:
 * - clear: boolean (optional) - Clear existing data before seeding
 * - counts: object (optional) - Custom counts for each collection
 */
export async function POST(req: Request) {
  try {
    await dbconnect();

    const body = await req.json().catch(() => ({}));
    const { clear = true, counts = {} } = body;

    const defaultCounts = {
      sales: 30,
      marketing: 25,
      clients: 20,
      financials: 15,
    };

    const finalCounts = { ...defaultCounts, ...counts };

    // Clear existing data if requested
    if (clear) {
      await Promise.all([
        Sale.deleteMany({}),
        MarketingMetric.deleteMany({}),
        ClientInsight.deleteMany({}),
        Financial.deleteMany({}),
        DataSource.deleteMany({}),
      ]);
    }

    // Generate and insert fake data
    const [salesResult, marketingResult, clientsResult, financialsResult, dataSourcesResult] =
      await Promise.all([
        Sale.insertMany(generateFakeSales(finalCounts.sales)),
        MarketingMetric.insertMany(generateFakeMarketing(finalCounts.marketing)),
        ClientInsight.insertMany(generateFakeClients(finalCounts.clients)),
        Financial.insertMany(generateFakeFinancials(finalCounts.financials)),
        DataSource.insertMany(generateFakeDataSources()),
      ]);

    return NextResponse.json({
      success: true,
      message: "Database seeded successfully",
      data: {
        sales: salesResult.length,
        marketing: marketingResult.length,
        clients: clientsResult.length,
        financials: financialsResult.length,
        dataSources: dataSourcesResult.length,
      },
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message || "Seeding failed" },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/seed
 * Clears all data from the database
 */
export async function DELETE() {
  try {
    await dbconnect();

    const results = await Promise.all([
      Sale.deleteMany({}),
      MarketingMetric.deleteMany({}),
      ClientInsight.deleteMany({}),
      Financial.deleteMany({}),
      DataSource.deleteMany({}),
    ]);

    const totalDeleted = results.reduce((sum, result) => sum + result.deletedCount, 0);

    return NextResponse.json({
      success: true,
      message: "Database cleared successfully",
      data: {
        totalDeleted,
        sales: results[0].deletedCount,
        marketing: results[1].deletedCount,
        clients: results[2].deletedCount,
        financials: results[3].deletedCount,
        dataSources: results[4].deletedCount,
      },
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message || "Clear failed" },
      { status: 500 }
    );
  }
}

/**
 * GET /api/seed
 * Returns current database statistics
 */
export async function GET() {
  try {
    await dbconnect();

    const [salesCount, marketingCount, clientsCount, financialsCount, dataSourcesCount] =
      await Promise.all([
        Sale.countDocuments(),
        MarketingMetric.countDocuments(),
        ClientInsight.countDocuments(),
        Financial.countDocuments(),
        DataSource.countDocuments(),
      ]);

    const total = salesCount + marketingCount + clientsCount + financialsCount + dataSourcesCount;

    return NextResponse.json({
      success: true,
      data: {
        total,
        collections: {
          sales: salesCount,
          marketing: marketingCount,
          clients: clientsCount,
          financials: financialsCount,
          dataSources: dataSourcesCount,
        },
      },
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message || "Failed to get stats" },
      { status: 500 }
    );
  }
}

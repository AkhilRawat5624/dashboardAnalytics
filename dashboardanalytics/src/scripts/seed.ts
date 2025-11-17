import dbconnect from "@/lib/db";
import Sale from "@/models/Sale";
import MarketingMetrics from "@/models/MarketingMetric";
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
import 'dotenv/config';

async function seed() {
  await dbconnect();

  console.log("🗑️  Clearing existing data...");
  await Promise.all([
    Sale.deleteMany({}),
    MarketingMetrics.deleteMany({}),
    ClientInsight.deleteMany({}),
    Financial.deleteMany({}),
    DataSource.deleteMany({}),
  ]);

  console.log("📊 Generating fake data...");
  const [sales, marketing, clients, financials, dataSources] = await Promise.all([
    Sale.insertMany(generateFakeSales(30)),
    MarketingMetrics.insertMany(generateFakeMarketing(25)),
    ClientInsight.insertMany(generateFakeClients(20)),
    Financial.insertMany(generateFakeFinancials(15)),
    DataSource.insertMany(generateFakeDataSources()),
  ]);

  console.log("✅ Database seeded successfully!");
  console.log(`   - Sales: ${sales.length}`);
  console.log(`   - Marketing: ${marketing.length}`);
  console.log(`   - Clients: ${clients.length}`);
  console.log(`   - Financials: ${financials.length}`);
  console.log(`   - Data Sources: ${dataSources.length}`);

  process.exit(0);
}

seed();

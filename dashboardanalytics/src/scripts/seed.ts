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
  dbconnect();

  await Promise.all([
    Sale.deleteMany({}),
    MarketingMetrics.deleteMany({}),
    ClientInsight.deleteMany({}),
    Financial.deleteMany({}),
    DataSource.deleteMany({}),
  ]);

  await Sale.insertMany(generateFakeSales());
  await MarketingMetrics.insertMany(generateFakeMarketing());
  await ClientInsight.insertMany(generateFakeClients());
  await Financial.insertMany(generateFakeFinancials());
  await DataSource.insertMany(generateFakeDataSources());

  console.log("🎉 Database seeded successfully with fake data!");
  process.exit(0);
}

seed();

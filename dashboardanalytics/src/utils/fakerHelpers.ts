import { faker } from "@faker-js/faker";

// 🟩 Generate fake Sales Data
export function generateFakeSales(count = 30) {
  return Array.from({ length: count }).map(() => ({
    date: faker.date.recent({ days: 30 }),
    region: faker.location.country(),
    revenue: faker.number.int({ min: 1000, max: 20000 }),
    orders: faker.number.int({ min: 10, max: 300 }),
    avgOrderValue: faker.number.float({ min: 50, max: 500,
        fractionDigits:2
         }),
    target: faker.number.int({ min: 10000, max: 25000 }),
    achieved: faker.number.int({ min: 5000, max: 25000 }),
  }));
}

// 🟦 Generate fake Marketing Data
export function generateFakeMarketing(count = 25) {
  return Array.from({ length: count }).map(() => ({
    campaignName: faker.company.name(),
    clicks: faker.number.int({ min: 1000, max: 10000 }),
    impressions: faker.number.int({ min: 10000, max: 50000 }),
    cpc: faker.number.float({ min: 0.5, max: 5, fractionDigits:2 }),
    cpo: faker.number.float({ min: 2, max: 10, fractionDigits:2 }),
    goalCompletion: faker.number.int({ min: 100, max: 2000 }),
    bounceRate: faker.number.float({ min: 20, max: 80 }),
    avgSessionDuration: faker.number.float({ min: 30, max: 300 }),
    topCountry: faker.location.country(),
  }));
}

// 🟨 Generate fake Client Data
export function generateFakeClients(count = 20) {
  return Array.from({ length: count }).map(() => ({
    name: faker.person.fullName(),
    email: faker.internet.email(),
    engagementScore: faker.number.int({ min: 20, max: 100 }),
    feedback: faker.lorem.sentence(),
    satisfaction: faker.number.float({ min: 1, max: 5, fractionDigits:2 }),
    requests: faker.number.int({ min: 0, max: 50 }),
    serviceLevel: faker.helpers.arrayElement(["Gold", "Silver", "Bronze"]),
  }));
}

// 🟥 Generate fake Financial Data
export function generateFakeFinancials(count = 15) {
  return Array.from({ length: count }).map(() => ({
    workingCapital: faker.number.int({ min: 50000, max: 200000 }),
    currentRatio: faker.number.float({ min: 1, max: 3, fractionDigits:2 }),
    cashFlowRatio: faker.number.float({ min: 0.5, max: 2, fractionDigits:2 }),
    grossProfit: faker.number.int({ min: 10000, max: 50000 }),
    opexRatio: faker.number.float({ min: 10, max: 50, fractionDigits:2 }),
    netWorth: faker.number.int({ min: 50000, max: 250000 }),
    liquidityRatio: faker.number.float({ min: 0.5, max: 2, fractionDigits:2 }),
  }));
}

// 🟪 Generate fake Data Sources
export function generateFakeDataSources() {
  return [
    {
      name: "Sales Database",
      type: "sales",
      lastSync: faker.date.recent({ days: 3 }),
      recordsCount: 30,
      status: "active",
    },
    {
      name: "Marketing Analytics",
      type: "marketing",
      lastSync: faker.date.recent({ days: 2 }),
      recordsCount: 25,
      status: "active",
    },
    {
      name: "Client CRM",
      type: "client",
      lastSync: faker.date.recent({ days: 4 }),
      recordsCount: 20,
      status: "inactive",
    },
    {
      name: "Financial Ledger",
      type: "finance",
      lastSync: faker.date.recent({ days: 1 }),
      recordsCount: 15,
      status: "active",
    },
  ];
}

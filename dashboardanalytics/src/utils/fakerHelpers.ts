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
    date: faker.date.recent({ days: 30 }),
    campaignId: faker.string.alphanumeric(8),
    clicks: faker.number.int({ min: 1000, max: 10000 }),
    cpo: faker.number.float({ min: 2, max: 10, fractionDigits: 2 }),
    goalValue: faker.number.int({ min: 500, max: 5000 }),
    goalRate: faker.number.float({ min: 5, max: 50, fractionDigits: 2 }),
    bounceRate: faker.number.float({ min: 20, max: 80, fractionDigits: 2 }),
    avgDuration: faker.number.float({ min: 30, max: 300, fractionDigits: 2 }),
    topCountries: [
      faker.location.country(),
      faker.location.country(),
      faker.location.country(),
    ],
    performance: faker.number.int({ min: 40, max: 95 }),
  }));
}

// 🟨 Generate fake Client Data
export function generateFakeClients(count = 20) {
  return Array.from({ length: count }).map(() => ({
    date: faker.date.recent({ days: 30 }),
    newUsers: faker.number.int({ min: 10, max: 500 }),
    traffic: faker.number.int({ min: 100, max: 2000 }),
    campaign: faker.helpers.arrayElement(["Summer Sale", "Black Friday", "Spring Launch", "Holiday Special", null]),
    requestVolume: faker.number.int({ min: 50, max: 1000 }),
    serviceLevel: faker.number.int({ min: 60, max: 100 }),
    satisfactionScore: faker.number.float({ min: 1, max: 5, fractionDigits: 2 }),
  }));
}

// 🟥 Generate fake Financial Data
export function generateFakeFinancials(count = 15) {
  return Array.from({ length: count }).map(() => ({
    date: faker.date.recent({ days: 30 }),
    workingCapital: faker.number.int({ min: 50000, max: 200000 }),
    currentRatio: faker.number.float({ min: 1, max: 3, fractionDigits: 2 }),
    cashFlowRatio: faker.number.float({ min: 0.5, max: 2, fractionDigits: 2 }),
    grossProfit: faker.number.int({ min: 10000, max: 50000 }),
    opexRatio: faker.number.float({ min: 10, max: 50, fractionDigits: 2 }),
    operationProfit: faker.number.int({ min: 5000, max: 30000 }),
    liquidityRatio: faker.number.float({ min: 0.5, max: 2, fractionDigits: 2 }),
    netWorth: faker.number.int({ min: 50000, max: 250000 }),
    currentCapital: faker.number.int({ min: 30000, max: 150000 }),
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

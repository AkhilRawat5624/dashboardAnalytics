import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

export interface AnalyticsData {
  success: boolean;
  data: {
    period: string;
    dateRange: {
      start: string;
      end: string;
    };
    kpis: {
      sales: {
        revenue: number;
        revenueGrowth: number;
        orders: number;
        ordersGrowth: number;
        avgOrderValue: number;
        targetCompletion: number;
      };
      marketing: {
        clicks: number;
        clicksGrowth: number;
        avgCPO: number;
        goalValue: number;
        avgPerformance: number;
        avgBounceRate: number;
      };
      clients: {
        newUsers: number;
        usersGrowth: number;
        traffic: number;
        conversionRate: number;
        avgSatisfaction: number;
        avgServiceLevel: number;
      };
      financial: {
        netWorth: number;
        workingCapital: number;
        currentRatio: number;
        operationProfit: number;
        healthScore: number;
        status: string;
      } | null;
    };
    topPerformers: {
      regions: Array<{ region: string; revenue: number; orders: number }>;
      campaigns: Array<{ campaignId: string; clicks: number; avgPerformance: number; goalValue: number }>;
    };
    recentActivity: Array<any>;
    dataSources: Array<any>;
    alerts: Array<{
      type: string;
      category: string;
      message: string;
      severity: string;
    }>;
    summary: {
      totalAlerts: number;
      criticalAlerts: number;
      overallTrend: string;
    };
  };
}

export const analyticsApi = {
  getAnalytics: (period: string = 'month') =>
    api.get<AnalyticsData>(`/analytics?period=${period}`),
  
  getSalesReport: (period: string = 'month') =>
    api.get(`/reports/sales?period=${period}`),
  
  getMarketingReport: (period: string = 'month') =>
    api.get(`/reports/marketing?period=${period}`),
  
  getClientInsights: (period: string = 'month') =>
    api.get(`/reports/client-insights?period=${period}`),
  
  getFinancialReport: (period: string = 'month') =>
    api.get(`/reports/financial?period=${period}`),
};

export default api;

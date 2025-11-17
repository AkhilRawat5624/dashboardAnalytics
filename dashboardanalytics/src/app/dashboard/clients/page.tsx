"use client";

import { useEffect, useState } from "react";

interface ClientMetrics {
  totalNewUsers: number;
  totalTraffic: number;
  totalRequests: number;
  avgServiceLevel: number;
  avgSatisfaction: number;
  userAcquisitionRate: number;
  requestsPerUser: number;
  engagementScore: number;
  totalRecords: number;
}

interface ServiceLevel {
  min: number;
  max: number;
  avg: number;
  recordsAbove80: number;
  recordsBelow50: number;
  performanceRate: number;
}

interface CampaignPerformance {
  campaign: string;
  newUsers: number;
  traffic: number;
  requests: number;
  avgServiceLevel: number;
  avgSatisfaction: number;
  conversionRate: number;
}

interface TrendData {
  date: string;
  newUsers: number;
  traffic: number;
  requests: number;
  avgServiceLevel: number;
  avgSatisfaction: number;
  conversionRate: number;
}

interface ClientData {
  summary: ClientMetrics;
  serviceLevel: ServiceLevel;
  campaignPerformance: CampaignPerformance[];
  trend: TrendData[];
  satisfactionDistribution: any[];
  growthAnalysis: {
    userGrowth: number;
    trafficGrowth: number;
    satisfactionTrend: string;
  } | null;
}

export default function ClientsPage() {
  const [data, setData] = useState<ClientData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchClientData();
  }, []);

  const fetchClientData = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/reports/client-insights");
      const result = await response.json();

      if (result.success) {
        setData(result.data);
      } else {
        setError(result.message || "Failed to fetch data");
      }
    } catch (err: any) {
      setError(err.message || "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-8">
        <div className="max-w-7xl mx-auto">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/4 mb-8"></div>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="h-32 bg-gray-200 rounded"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="min-h-screen bg-gray-50 p-8">
        <div className="max-w-7xl mx-auto">
          <div className="bg-red-50 border border-red-200 rounded-lg p-6">
            <h2 className="text-red-800 font-semibold mb-2">Error</h2>
            <p className="text-red-600">{error || "No data available"}</p>
            <button
              onClick={fetchClientData}
              className="mt-4 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
            >
              Retry
            </button>
          </div>
        </div>
      </div>
    );
  }

  const { summary, serviceLevel, campaignPerformance, trend, growthAnalysis } = data;

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Client Insights</h1>
          <p className="text-gray-600">Monitor user behavior and satisfaction metrics</p>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="text-sm text-gray-600 mb-1">New Users</div>
            <div className="text-3xl font-bold text-gray-900">{summary.totalNewUsers.toLocaleString()}</div>
            <div className="text-sm text-green-600 mt-2">
              {summary.userAcquisitionRate}% conversion
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="text-sm text-gray-600 mb-1">Total Traffic</div>
            <div className="text-3xl font-bold text-gray-900">{summary.totalTraffic.toLocaleString()}</div>
            <div className="text-sm text-gray-500 mt-2">
              {summary.totalRecords} records
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="text-sm text-gray-600 mb-1">Avg Satisfaction</div>
            <div className="text-3xl font-bold text-gray-900">{summary.avgSatisfaction.toFixed(1)}/5</div>
            <div className="text-sm text-gray-500 mt-2">
              ⭐ {(summary.avgSatisfaction / 5 * 100).toFixed(0)}%
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="text-sm text-gray-600 mb-1">Engagement Score</div>
            <div className="text-3xl font-bold text-gray-900">{summary.engagementScore.toFixed(1)}</div>
            <div className="text-sm text-gray-500 mt-2">
              {summary.requestsPerUser.toFixed(1)} req/user
            </div>
          </div>
        </div>

        {/* Service Level & Growth */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {/* Service Level */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Service Level</h2>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Average</span>
                <span className="text-2xl font-bold text-gray-900">{serviceLevel.avg.toFixed(1)}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div
                  className="bg-blue-600 h-3 rounded-full"
                  style={{ width: `${serviceLevel.avg}%` }}
                ></div>
              </div>
              <div className="grid grid-cols-2 gap-4 pt-4 border-t">
                <div>
                  <div className="text-sm text-gray-600">Above 80%</div>
                  <div className="text-lg font-semibold text-green-600">{serviceLevel.recordsAbove80}</div>
                </div>
                <div>
                  <div className="text-sm text-gray-600">Below 50%</div>
                  <div className="text-lg font-semibold text-red-600">{serviceLevel.recordsBelow50}</div>
                </div>
              </div>
            </div>
          </div>

          {/* Growth Analysis */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Growth Analysis</h2>
            {growthAnalysis ? (
              <div className="space-y-4">
                <div className="flex justify-between items-center p-3 bg-gray-50 rounded">
                  <span className="text-gray-600">User Growth</span>
                  <span className={`text-lg font-semibold ${growthAnalysis.userGrowth >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {growthAnalysis.userGrowth >= 0 ? '+' : ''}{growthAnalysis.userGrowth.toFixed(1)}%
                  </span>
                </div>
                <div className="flex justify-between items-center p-3 bg-gray-50 rounded">
                  <span className="text-gray-600">Traffic Growth</span>
                  <span className={`text-lg font-semibold ${growthAnalysis.trafficGrowth >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {growthAnalysis.trafficGrowth >= 0 ? '+' : ''}{growthAnalysis.trafficGrowth.toFixed(1)}%
                  </span>
                </div>
                <div className="flex justify-between items-center p-3 bg-gray-50 rounded">
                  <span className="text-gray-600">Satisfaction Trend</span>
                  <span className={`text-lg font-semibold capitalize ${
                    growthAnalysis.satisfactionTrend === 'improving' ? 'text-green-600' :
                    growthAnalysis.satisfactionTrend === 'declining' ? 'text-red-600' : 'text-gray-600'
                  }`}>
                    {growthAnalysis.satisfactionTrend}
                  </span>
                </div>
              </div>
            ) : (
              <p className="text-gray-500">Insufficient data for growth analysis</p>
            )}
          </div>
        </div>

        {/* Campaign Performance */}
        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Campaign Performance</h2>
          {campaignPerformance.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3 px-4 text-gray-600 font-medium">Campaign</th>
                    <th className="text-right py-3 px-4 text-gray-600 font-medium">New Users</th>
                    <th className="text-right py-3 px-4 text-gray-600 font-medium">Traffic</th>
                    <th className="text-right py-3 px-4 text-gray-600 font-medium">Conversion</th>
                    <th className="text-right py-3 px-4 text-gray-600 font-medium">Satisfaction</th>
                  </tr>
                </thead>
                <tbody>
                  {campaignPerformance.map((campaign, idx) => (
                    <tr key={idx} className="border-b hover:bg-gray-50">
                      <td className="py-3 px-4 font-medium text-gray-900">{campaign.campaign}</td>
                      <td className="py-3 px-4 text-right text-gray-900">{campaign.newUsers.toLocaleString()}</td>
                      <td className="py-3 px-4 text-right text-gray-600">{campaign.traffic.toLocaleString()}</td>
                      <td className="py-3 px-4 text-right text-green-600 font-medium">{campaign.conversionRate}%</td>
                      <td className="py-3 px-4 text-right text-gray-900">{campaign.avgSatisfaction.toFixed(1)}/5</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="text-gray-500">No campaign data available</p>
          )}
        </div>

        {/* Trend Chart */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Daily Trend</h2>
          {trend.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-2 px-3 text-gray-600 font-medium">Date</th>
                    <th className="text-right py-2 px-3 text-gray-600 font-medium">Users</th>
                    <th className="text-right py-2 px-3 text-gray-600 font-medium">Traffic</th>
                    <th className="text-right py-2 px-3 text-gray-600 font-medium">Conversion</th>
                    <th className="text-right py-2 px-3 text-gray-600 font-medium">Satisfaction</th>
                  </tr>
                </thead>
                <tbody>
                  {trend.slice(-10).map((item, idx) => (
                    <tr key={idx} className="border-b hover:bg-gray-50">
                      <td className="py-2 px-3 text-gray-900">
                        {new Date(item.date).toLocaleDateString()}
                      </td>
                      <td className="py-2 px-3 text-right text-gray-900">{item.newUsers}</td>
                      <td className="py-2 px-3 text-right text-gray-600">{item.traffic}</td>
                      <td className="py-2 px-3 text-right text-green-600">{item.conversionRate}%</td>
                      <td className="py-2 px-3 text-right text-gray-900">{item.avgSatisfaction.toFixed(1)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="text-gray-500">No trend data available</p>
          )}
        </div>
      </div>
    </div>
  );
}

'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { MousePointer, DollarSign, Target, TrendingUp, Globe, BarChart3 } from 'lucide-react';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

export default function MarketingPage() {
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [campaignId, setCampaignId] = useState('');

  const { data, isLoading, error } = useQuery({
    queryKey: ['marketing', startDate, endDate, campaignId],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (startDate) params.append('startDate', startDate);
      if (endDate) params.append('endDate', endDate);
      if (campaignId) params.append('campaignId', campaignId);
      
      const response = await axios.get(`/api/reports/marketing?${params.toString()}`);
      return response.data;
    },
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg">Loading marketing data...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg text-red-500">Error loading marketing data</div>
      </div>
    );
  }

  const marketingData = data?.data;
  const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];

  return (
    <div className="p-8 space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Marketing Analytics</h1>
          <p className="text-gray-500">Campaign performance and marketing metrics</p>
        </div>
      </div>

      <div className="flex gap-4 flex-wrap">
        <input
          type="date"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
          className="px-4 py-2 border rounded-lg"
          placeholder="Start Date"
        />
        <input
          type="date"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
          className="px-4 py-2 border rounded-lg"
          placeholder="End Date"
        />
        <input
          type="text"
          value={campaignId}
          onChange={(e) => setCampaignId(e.target.value)}
          className="px-4 py-2 border rounded-lg"
          placeholder="Campaign ID"
        />
        <button
          onClick={() => {
            setStartDate('');
            setEndDate('');
            setCampaignId('');
          }}
          className="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300"
        >
          Clear Filters
        </button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <MetricCard
          title="Total Clicks"
          value={marketingData?.kpis.totalClicks.toLocaleString()}
          icon={<MousePointer className="h-4 w-4 text-gray-500" />}
        />
        <MetricCard
          title="Avg CPO"
          value={`$${marketingData?.kpis.avgCPO.toFixed(2)}`}
          icon={<DollarSign className="h-4 w-4 text-gray-500" />}
        />
        <MetricCard
          title="Total Goal Value"
          value={`$${marketingData?.kpis.totalGoalValue.toLocaleString()}`}
          icon={<Target className="h-4 w-4 text-gray-500" />}
        />
        <MetricCard
          title="Avg Performance"
          value={`${marketingData?.kpis.avgPerformance.toFixed(1)}%`}
          icon={<TrendingUp className="h-4 w-4 text-gray-500" />}
        />
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <div className="border rounded-lg p-4">
          <div className="text-sm text-gray-500 mb-1">Avg Goal Rate</div>
          <div className="text-2xl font-bold">{marketingData?.kpis.avgGoalRate.toFixed(2)}%</div>
        </div>
        <div className="border rounded-lg p-4">
          <div className="text-sm text-gray-500 mb-1">Avg Bounce Rate</div>
          <div className="text-2xl font-bold">{marketingData?.kpis.avgBounceRate.toFixed(2)}%</div>
        </div>
        <div className="border rounded-lg p-4">
          <div className="text-sm text-gray-500 mb-1">Avg Duration</div>
          <div className="text-2xl font-bold">{marketingData?.kpis.avgDuration.toFixed(0)}s</div>
        </div>
        <div className="border rounded-lg p-4">
          <div className="text-sm text-gray-500 mb-1">Total Records</div>
          <div className="text-2xl font-bold">{marketingData?.kpis.totalRecords.toLocaleString()}</div>
        </div>
      </div>

      <div className="border rounded-lg p-6">
        <h3 className="font-semibold mb-4 flex items-center gap-2">
          <TrendingUp className="h-5 w-5" />
          Performance Trend
        </h3>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={marketingData?.trend}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis 
              dataKey="date" 
              tickFormatter={(value) => new Date(value).toLocaleDateString()}
            />
            <YAxis yAxisId="left" />
            <YAxis yAxisId="right" orientation="right" />
            <Tooltip 
              labelFormatter={(value) => new Date(value).toLocaleDateString()}
            />
            <Legend />
            <Line yAxisId="left" type="monotone" dataKey="clicks" stroke="#3b82f6" name="Clicks" />
            <Line yAxisId="right" type="monotone" dataKey="goalValue" stroke="#10b981" name="Goal Value" />
            <Line yAxisId="right" type="monotone" dataKey="avgPerformance" stroke="#f59e0b" name="Performance %" />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="border rounded-lg p-6">
          <h3 className="font-semibold mb-4 flex items-center gap-2">
            <BarChart3 className="h-5 w-5" />
            Campaign Performance
          </h3>
          <div className="space-y-3 max-h-96 overflow-y-auto">
            {marketingData?.campaignPerformance.map((campaign: any, idx: number) => (
              <div key={idx} className="border-b pb-3">
                <div className="flex justify-between items-center mb-2">
                  <span className="font-medium">{campaign.campaignId}</span>
                  <span className="text-sm text-gray-500">{campaign.clicks.toLocaleString()} clicks</span>
                </div>
                <div className="grid grid-cols-3 gap-2 text-sm">
                  <div>
                    <div className="text-gray-500">CPO</div>
                    <div className="font-medium">${campaign.avgCPO}</div>
                  </div>
                  <div>
                    <div className="text-gray-500">Goal Value</div>
                    <div className="font-medium">${campaign.goalValue.toLocaleString()}</div>
                  </div>
                  <div>
                    <div className="text-gray-500">ROI</div>
                    <div className="font-medium">{campaign.roi}x</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="border rounded-lg p-6">
          <h3 className="font-semibold mb-4 flex items-center gap-2">
            <Globe className="h-5 w-5" />
            Top Countries
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={marketingData?.topCountries}
                dataKey="count"
                nameKey="country"
                cx="50%"
                cy="50%"
                outerRadius={100}
                label
              >
                {marketingData?.topCountries.map((entry: any, index: number) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="border rounded-lg p-6">
        <h3 className="font-semibold mb-4">Performance Distribution</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={marketingData?.performanceDistribution}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="range" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="count" fill="#3b82f6" name="Count" />
            <Bar dataKey="avgClicks" fill="#10b981" name="Avg Clicks" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

function MetricCard({ title, value, icon }: { title: string; value: string; icon: React.ReactNode }) {
  return (
    <div className="border rounded-lg p-6">
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm text-gray-500">{title}</span>
        {icon}
      </div>
      <div className="text-2xl font-bold">{value}</div>
    </div>
  );
}

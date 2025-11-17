'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { analyticsApi } from '@/lib/api';
import MetricCard from '@/components/dashboard/MetricCard';
import { DollarSign, ShoppingCart, Users, TrendingUp } from 'lucide-react';

export default function DashboardPage() {
  const [period, setPeriod] = useState('month');

  const { data, isLoading, error } = useQuery({
    queryKey: ['analytics', period],
    queryFn: () => analyticsApi.getAnalytics(period),
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg">Loading dashboard...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg text-red-500">Error loading dashboard data</div>
      </div>
    );
  }

  const analytics = data?.data.data;

  return (
    <div className="p-8 space-y-8">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Analytics Dashboard</h1>
          <p className="text-gray-500">Overview of your business metrics</p>
        </div>
        <select
          value={period}
          onChange={(e) => setPeriod(e.target.value)}
          className="px-4 py-2 border rounded-lg"
        >
          <option value="today">Today</option>
          <option value="week">This Week</option>
          <option value="month">This Month</option>
          <option value="quarter">This Quarter</option>
          <option value="year">This Year</option>
        </select>
      </div>

      {/* KPI Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <MetricCard
          title="Total Revenue"
          value={`$${analytics?.kpis.sales.revenue.toLocaleString()}`}
          change={analytics?.kpis.sales.revenueGrowth}
          icon={<DollarSign className="h-4 w-4 text-gray-500" />}
        />
        <MetricCard
          title="Total Orders"
          value={analytics?.kpis.sales.orders.toLocaleString()}
          change={analytics?.kpis.sales.ordersGrowth}
          icon={<ShoppingCart className="h-4 w-4 text-gray-500" />}
        />
        <MetricCard
          title="New Users"
          value={analytics?.kpis.clients.newUsers.toLocaleString()}
          change={analytics?.kpis.clients.usersGrowth}
          icon={<Users className="h-4 w-4 text-gray-500" />}
        />
        <MetricCard
          title="Avg Order Value"
          value={`$${analytics?.kpis.sales.avgOrderValue.toFixed(2)}`}
          icon={<TrendingUp className="h-4 w-4 text-gray-500" />}
        />
      </div>

      {/* Alerts */}
      {analytics?.alerts && analytics.alerts.length > 0 && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <h3 className="font-semibold mb-2">Alerts ({analytics.alerts.length})</h3>
          <div className="space-y-2">
            {analytics.alerts.map((alert, idx) => (
              <div key={idx} className="text-sm">
                <span className={`font-medium ${
                  alert.severity === 'high' ? 'text-red-600' : 'text-yellow-600'
                }`}>
                  [{alert.category.toUpperCase()}]
                </span>{' '}
                {alert.message}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Top Performers */}
      <div className="grid gap-4 md:grid-cols-2">
        <div className="border rounded-lg p-6">
          <h3 className="font-semibold mb-4">Top Regions</h3>
          <div className="space-y-3">
            {analytics?.topPerformers.regions.map((region, idx) => (
              <div key={idx} className="flex justify-between items-center">
                <span className="font-medium">{region.region}</span>
                <span className="text-gray-600">${region.revenue.toLocaleString()}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="border rounded-lg p-6">
          <h3 className="font-semibold mb-4">Top Campaigns</h3>
          <div className="space-y-3">
            {analytics?.topPerformers.campaigns.map((campaign, idx) => (
              <div key={idx} className="flex justify-between items-center">
                <span className="font-medium">{campaign.campaignId}</span>
                <span className="text-gray-600">{campaign.avgPerformance}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

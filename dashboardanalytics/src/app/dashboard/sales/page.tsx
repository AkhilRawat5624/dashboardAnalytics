'use client';

import { useState, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { analyticsApi } from '@/lib/api';
import MetricCard from '@/components/dashboard/MetricCard';
import { DollarSign, ShoppingCart, TrendingUp, Target } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

export default function SalesPage() {
  const [page, setPage] = useState(1);

  const { data, isLoading, error } = useQuery({
    queryKey: ['sales-report', page],
    queryFn: () => analyticsApi.getSalesReport('month'),
  });

  // Calculate summary metrics from raw sales data
  const summary = useMemo(() => {
    const sales = data?.data.data || [];
    
    const totalRevenue = sales.reduce((sum: number, sale: any) => sum + (sale.revenue || 0), 0);
    const totalOrders = sales.reduce((sum: number, sale: any) => sum + (sale.orders || 0), 0);
    const avgOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;
    const totalTarget = sales.reduce((sum: number, sale: any) => sum + (sale.target || 0), 0);
    const totalAchieved = sales.reduce((sum: number, sale: any) => sum + (sale.achieved || 0), 0);
    const targetCompletion = totalTarget > 0 ? (totalAchieved / totalTarget) * 100 : 0;

    return {
      totalRevenue,
      totalOrders,
      avgOrderValue,
      targetCompletion,
    };
  }, [data]);

  // Group by region
  const byRegion = useMemo(() => {
    const sales = data?.data.data || [];
    const regionMap = new Map();

    sales.forEach((sale: any) => {
      const region = sale.region || 'Unknown';
      if (!regionMap.has(region)) {
        regionMap.set(region, {
          region,
          revenue: 0,
          orders: 0,
        });
      }
      const regionData = regionMap.get(region);
      regionData.revenue += sale.revenue || 0;
      regionData.orders += sale.orders || 0;
    });

    return Array.from(regionMap.values()).sort((a, b) => b.revenue - a.revenue);
  }, [data]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg">Loading sales data...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg text-red-500">Error loading sales data</div>
      </div>
    );
  }

  const salesData = data?.data.data || [];
  const pagination = data?.data.pagination;

  return (
    <div className="p-8 space-y-8">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Sales Report</h1>
          <p className="text-gray-500">Recent sales transactions and performance</p>
        </div>
        <div className="text-sm text-gray-500">
          Page {pagination?.page} of {pagination?.totalPages} ({pagination?.total} total records)
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <MetricCard
          title="Total Revenue"
          value={`$${summary.totalRevenue.toLocaleString()}`}
          icon={<DollarSign className="h-4 w-4 text-gray-500" />}
        />
        <MetricCard
          title="Total Orders"
          value={summary.totalOrders.toLocaleString()}
          icon={<ShoppingCart className="h-4 w-4 text-gray-500" />}
        />
        <MetricCard
          title="Avg Order Value"
          value={`$${summary.avgOrderValue.toFixed(2)}`}
          icon={<TrendingUp className="h-4 w-4 text-gray-500" />}
        />
        <MetricCard
          title="Target Completion"
          value={`${summary.targetCompletion.toFixed(1)}%`}
          icon={<Target className="h-4 w-4 text-gray-500" />}
        />
      </div>

      {/* Regional Performance Chart */}
      {byRegion.length > 0 && (
        <div className="bg-white p-6 rounded-lg border">
          <h3 className="text-lg font-semibold mb-4">Performance by Region</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={byRegion}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="region" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="revenue" fill="#3b82f6" name="Revenue ($)" />
              <Bar dataKey="orders" fill="#10b981" name="Orders" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* Recent Sales Table */}
      <div className="bg-white p-6 rounded-lg border">
        <h3 className="text-lg font-semibold mb-4">Recent Sales</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Region
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Revenue
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Orders
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Avg Order Value
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Target
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {salesData.map((sale: any, idx: number) => (
                <tr key={idx}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {new Date(sale.date).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {sale.region || 'N/A'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-medium">
                    ${sale.revenue?.toLocaleString() || 0}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {sale.orders?.toLocaleString() || 0}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    ${sale.avgOrderValue?.toFixed(2) || 0}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <span className={`${(sale.achieved || 0) >= (sale.target || 0) ? 'text-green-600' : 'text-yellow-600'}`}>
                      {sale.target ? `${((sale.achieved / sale.target) * 100).toFixed(0)}%` : 'N/A'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {pagination && pagination.totalPages > 1 && (
          <div className="flex items-center justify-between mt-4">
            <button
              onClick={() => setPage(p => Math.max(1, p - 1))}
              disabled={page === 1}
              className="px-4 py-2 border rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
            >
              Previous
            </button>
            <span className="text-sm text-gray-600">
              Page {page} of {pagination.totalPages}
            </span>
            <button
              onClick={() => setPage(p => Math.min(pagination.totalPages, p + 1))}
              disabled={page === pagination.totalPages}
              className="px-4 py-2 border rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
            >
              Next
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

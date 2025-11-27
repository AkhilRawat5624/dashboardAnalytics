"use client";

import { useEffect, useState } from "react";
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Area, AreaChart, ComposedChart, Cell } from 'recharts';

interface LatestFinancial {
  date: string;
  workingCapital: number;
  currentRatio: number;
  cashFlowRatio: number;
  grossProfit: number;
  operationProfit: number;
  netWorth: number;
  liquidityRatio: number;
}

interface HealthMetrics {
  avgWorkingCapital: number;
  avgCurrentRatio: number;
  avgCashFlowRatio: number;
  avgGrossProfit: number;
  avgOpexRatio: number;
  avgOperationProfit: number;
  avgLiquidityRatio: number;
  avgNetWorth: number;
  healthScore: number;
  status: string;
}

interface ProfitabilityTrend {
  period: any;
  grossProfit: number;
  operationProfit: number;
  profitMargin: number;
}

interface LiquidityTrend {
  period: any;
  currentRatio: number;
  cashFlowRatio: number;
  liquidityRatio: number;
  workingCapital: number;
}

interface GrowthAnalysis {
  netWorthGrowth: number;
  profitGrowth: number;
  capitalGrowth: number;
}

interface FinancialData {
  latest: LatestFinancial | null;
  healthMetrics: HealthMetrics;
  profitabilityTrend: ProfitabilityTrend[];
  liquidityTrend: LiquidityTrend[];
  growthAnalysis: GrowthAnalysis | null;
}

export default function FinancialPage() {
  const [data, setData] = useState<FinancialData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [period, setPeriod] = useState("monthly");

  useEffect(() => {
    fetchFinancialData();
  }, [period]);

  const fetchFinancialData = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/reports/financial?period=${period}`);
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

  const getHealthColor = (status: string) => {
    switch (status) {
      case "excellent": return "text-green-600 bg-green-50";
      case "good": return "text-blue-600 bg-blue-50";
      case "fair": return "text-yellow-600 bg-yellow-50";
      case "poor": return "text-red-600 bg-red-50";
      default: return "text-gray-600 bg-gray-50";
    }
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  const formatPeriod = (period: any) => {
    if (period.quarter) return `Q${period.quarter} ${period.year}`;
    if (period.month) return `${period.month}/${period.year}`;
    if (period.day) return `${period.month}/${period.day}/${period.year}`;
    return period.year;
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
              onClick={fetchFinancialData}
              className="mt-4 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
            >
              Retry
            </button>
          </div>
        </div>
      </div>
    );
  }

  const { latest, healthMetrics, profitabilityTrend, liquidityTrend, growthAnalysis } = data;

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Financial Overview</h1>
            <p className="text-gray-600">Monitor financial health and performance metrics</p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setPeriod("daily")}
              className={`px-4 py-2 rounded ${period === "daily" ? "bg-blue-600 text-white" : "bg-white text-gray-700 hover:bg-gray-100"}`}
            >
              Daily
            </button>
            <button
              onClick={() => setPeriod("monthly")}
              className={`px-4 py-2 rounded ${period === "monthly" ? "bg-blue-600 text-white" : "bg-white text-gray-700 hover:bg-gray-100"}`}
            >
              Monthly
            </button>
            <button
              onClick={() => setPeriod("quarterly")}
              className={`px-4 py-2 rounded ${period === "quarterly" ? "bg-blue-600 text-white" : "bg-white text-gray-700 hover:bg-gray-100"}`}
            >
              Quarterly
            </button>
          </div>
        </div>

        {/* Health Score Card */}
        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-2">Financial Health Score</h2>
              <p className="text-gray-600">Overall financial wellness indicator</p>
            </div>
            <div className="text-center">
              <div className="text-5xl font-bold text-gray-900 mb-2">{healthMetrics.healthScore}</div>
              <span className={`px-4 py-2 rounded-full text-sm font-semibold uppercase ${getHealthColor(healthMetrics.status)}`}>
                {healthMetrics.status}
              </span>
            </div>
          </div>
          <div className="mt-6">
            <div className="w-full bg-gray-200 rounded-full h-4">
              <div
                className={`h-4 rounded-full ${
                  healthMetrics.healthScore >= 80 ? "bg-green-600" :
                  healthMetrics.healthScore >= 60 ? "bg-blue-600" :
                  healthMetrics.healthScore >= 40 ? "bg-yellow-600" : "bg-red-600"
                }`}
                style={{ width: `${healthMetrics.healthScore}%` }}
              ></div>
            </div>
          </div>
        </div>

        {/* Latest Snapshot */}
        {latest && (
          <div className="bg-white rounded-lg shadow p-6 mb-8">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-gray-900">Latest Snapshot</h2>
              <span className="text-sm text-gray-600">
                {new Date(latest.date).toLocaleDateString()}
              </span>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              <div>
                <div className="text-sm text-gray-600 mb-1">Net Worth</div>
                <div className="text-2xl font-bold text-gray-900">{formatCurrency(latest.netWorth)}</div>
              </div>
              <div>
                <div className="text-sm text-gray-600 mb-1">Working Capital</div>
                <div className="text-2xl font-bold text-gray-900">{formatCurrency(latest.workingCapital)}</div>
              </div>
              <div>
                <div className="text-sm text-gray-600 mb-1">Gross Profit</div>
                <div className="text-2xl font-bold text-green-600">{formatCurrency(latest.grossProfit)}</div>
              </div>
              <div>
                <div className="text-sm text-gray-600 mb-1">Operation Profit</div>
                <div className="text-2xl font-bold text-green-600">{formatCurrency(latest.operationProfit)}</div>
              </div>
            </div>
          </div>
        )}

        {/* Key Ratios */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Liquidity Ratios</h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Current Ratio</span>
                <span className="text-lg font-semibold text-gray-900">{healthMetrics.avgCurrentRatio.toFixed(2)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Cash Flow Ratio</span>
                <span className="text-lg font-semibold text-gray-900">{healthMetrics.avgCashFlowRatio.toFixed(2)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Liquidity Ratio</span>
                <span className="text-lg font-semibold text-gray-900">{healthMetrics.avgLiquidityRatio.toFixed(2)}</span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Profitability</h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Avg Gross Profit</span>
                <span className="text-lg font-semibold text-green-600">{formatCurrency(healthMetrics.avgGrossProfit)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Avg Operation Profit</span>
                <span className="text-lg font-semibold text-green-600">{formatCurrency(healthMetrics.avgOperationProfit)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Opex Ratio</span>
                <span className="text-lg font-semibold text-gray-900">{healthMetrics.avgOpexRatio.toFixed(1)}%</span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Capital</h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Avg Net Worth</span>
                <span className="text-lg font-semibold text-gray-900">{formatCurrency(healthMetrics.avgNetWorth)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Avg Working Capital</span>
                <span className="text-lg font-semibold text-gray-900">{formatCurrency(healthMetrics.avgWorkingCapital)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Growth Analysis */}
        {growthAnalysis && (
          <div className="bg-white rounded-lg shadow p-6 mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Growth Analysis</h2>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart 
                data={[
                  { metric: 'Net Worth', growth: growthAnalysis.netWorthGrowth },
                  { metric: 'Profit', growth: growthAnalysis.profitGrowth },
                  { metric: 'Capital', growth: growthAnalysis.capitalGrowth },
                ]}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="metric" />
                <YAxis tickFormatter={(value) => `${value}%`} />
                <Tooltip formatter={(value: any) => `${value.toFixed(1)}%`} />
                <Legend />
                <Bar 
                  dataKey="growth" 
                  name="Growth %" 
                  fill="#3b82f6"
                  label={{ position: 'top', formatter: (value: any) => `${value.toFixed(1)}%` }}
                >
                  {[growthAnalysis.netWorthGrowth, growthAnalysis.profitGrowth, growthAnalysis.capitalGrowth].map((value, index) => (
                    <Cell key={`cell-${index}`} fill={value >= 0 ? '#10b981' : '#ef4444'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}

        {/* Profitability Trend */}
        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Profitability Trend</h2>
          {profitabilityTrend.length > 0 ? (
            <ResponsiveContainer width="100%" height={350}>
              <ComposedChart 
                data={profitabilityTrend.map(item => ({
                  ...item,
                  periodLabel: formatPeriod(item.period)
                }))}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="periodLabel" angle={-45} textAnchor="end" height={80} />
                <YAxis yAxisId="left" tickFormatter={(value) => `$${(value / 1000).toFixed(0)}k`} />
                <YAxis yAxisId="right" orientation="right" tickFormatter={(value) => `${value}%`} />
                <Tooltip 
                  formatter={(value: any, name: string) => {
                    if (name === 'Profit Margin') return `${value.toFixed(1)}%`;
                    return formatCurrency(value);
                  }}
                />
                <Legend />
                <Bar yAxisId="left" dataKey="grossProfit" fill="#10b981" name="Gross Profit" />
                <Bar yAxisId="left" dataKey="operationProfit" fill="#3b82f6" name="Operation Profit" />
                <Line yAxisId="right" type="monotone" dataKey="profitMargin" stroke="#f59e0b" strokeWidth={2} name="Profit Margin" />
              </ComposedChart>
            </ResponsiveContainer>
          ) : (
            <p className="text-gray-500">No profitability data available</p>
          )}
        </div>

        {/* Liquidity Trend */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Liquidity Trend</h2>
          {liquidityTrend.length > 0 ? (
            <ResponsiveContainer width="100%" height={350}>
              <ComposedChart 
                data={liquidityTrend.map(item => ({
                  ...item,
                  periodLabel: formatPeriod(item.period)
                }))}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="periodLabel" angle={-45} textAnchor="end" height={80} />
                <YAxis yAxisId="left" />
                <YAxis yAxisId="right" orientation="right" tickFormatter={(value) => `$${(value / 1000).toFixed(0)}k`} />
                <Tooltip 
                  formatter={(value: any, name: string) => {
                    if (name === 'Working Capital') return formatCurrency(value);
                    return value.toFixed(2);
                  }}
                />
                <Legend />
                <Line yAxisId="left" type="monotone" dataKey="currentRatio" stroke="#3b82f6" strokeWidth={2} name="Current Ratio" />
                <Line yAxisId="left" type="monotone" dataKey="cashFlowRatio" stroke="#8b5cf6" strokeWidth={2} name="Cash Flow Ratio" />
                <Line yAxisId="left" type="monotone" dataKey="liquidityRatio" stroke="#f59e0b" strokeWidth={2} name="Liquidity Ratio" />
                <Bar yAxisId="right" dataKey="workingCapital" fill="#10b981" name="Working Capital" />
              </ComposedChart>
            </ResponsiveContainer>
          ) : (
            <p className="text-gray-500">No liquidity data available</p>
          )}
        </div>
      </div>
    </div>
  );
}

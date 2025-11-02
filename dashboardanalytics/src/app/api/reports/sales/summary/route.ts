import { NextResponse } from "next/server";
import dbconnect from "@/lib/db"; // ensure this path matches your project
import Sale from "@/models/Sale";
import Product from "@/models/Product";
import mongoose from "mongoose";

/**
 * GET /api/sales/summary
 * Returns a full analytics package:
 * - kpis: totalRecords, totalOrders, totalRevenue, avgOrderValue
 * - trend: last 12 months [{ month: "Jan", year: 2025, revenue, orders, avgOrderValue }]
 * - topProducts: populated product info + orders + revenue
 * - topRegions: regions by revenue
 * - targets: totalTarget, totalAchieved, targetCompletionRate
 */
export async function GET() {
  try {
    await dbconnect();

    // 1) Totals aggregation (total records, totalOrders, totalRevenue, sum target/achieved)
    const totalsAgg = await Sale.aggregate([
      {
        $group: {
          _id: null,
          totalRecords: { $sum: 1 },
          totalOrders: { $sum: { $ifNull: ["$orders", 0] } },
          totalRevenue: { $sum: { $ifNull: ["$revenue", 0] } },
          totalTarget: { $sum: { $ifNull: ["$target", 0] } },
          totalAchieved: { $sum: { $ifNull: ["$achieved", 0] } },
        },
      },
    ]);

    const totals = totalsAgg[0] || {
      totalRecords: 0,
      totalOrders: 0,
      totalRevenue: 0,
      totalTarget: 0,
      totalAchieved: 0,
    };

    const totalOrders = totals.totalOrders;
    const totalRevenue = totals.totalRevenue;
    const avgOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;

    // 2) Monthly trend for last 12 months (including current month)
    // We'll build an aggregation that groups by year & month
    const now = new Date();
    // build an array of last 12 months (year, monthIndex)
    const months: { year: number; monthIndex: number; label: string }[] = [];
    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    for (let i = 11; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      months.push({ year: d.getFullYear(), monthIndex: d.getMonth(), label: monthNames[d.getMonth()] });
    }

    // Aggregate sales by year & month
    const monthAgg = await Sale.aggregate([
      {
        $match: {
          date: { $exists: true },
        },
      },
      {
        $group: {
          _id: { year: { $year: "$date" }, month: { $month: "$date" } },
          revenue: { $sum: { $ifNull: ["$revenue", 0] } },
          orders: { $sum: { $ifNull: ["$orders", 0] } },
        },
      },
    ]);

    // Convert monthAgg to a map for quick lookup
    const monthMap = new Map<string, { revenue: number; orders: number }>();
    monthAgg.forEach((m) => {
      const key = `${m._id.year}-${String(m._id.month).padStart(2, "0")}`; // e.g. "2025-03"
      monthMap.set(key, { revenue: m.revenue, orders: m.orders });
    });

    const trend = months.map((m) => {
      const key = `${m.year}-${String(m.monthIndex + 1).padStart(2, "0")}`; // monthIndex +1 because $month is 1-based
      const data = monthMap.get(key) || { revenue: 0, orders: 0 };
      return {
        month: m.label,
        year: m.year,
        revenue: data.revenue,
        orders: data.orders,
        avgOrderValue: data.orders > 0 ? Number((data.revenue / data.orders).toFixed(2)) : 0,
      };
    });

    // 3) Top products (by revenue) with product population
    // Group by productId
    const topProductsAgg = await Sale.aggregate([
      { $match: { productId: { $exists: true, $ne: null } } },
      {
        $group: {
          _id: "$productId",
          revenue: { $sum: { $ifNull: ["$revenue", 0] } },
          orders: { $sum: { $ifNull: ["$orders", 0] } },
        },
      },
      { $sort: { revenue: -1 } },
      { $limit: 5 },
    ]);

    // Populate product info (name, category) by querying Product model for the list of ids
    const productIds = topProductsAgg.map((p) => new mongoose.Types.ObjectId(p._id));
    const productsById = new Map<string, any>();
    if (productIds.length) {
      const products = await Product.find({ _id: { $in: productIds } }).lean();
      products.forEach((p) => productsById.set(String(p._id), p));
    }

    const topProducts = topProductsAgg.map((p) => {
      const prod = productsById.get(String(p._id)) || null;
      return {
        productId: p._id,
        name: prod?.name || null,
        category: prod?.category || null,
        revenue: p.revenue,
        orders: p.orders,
      };
    });

    // 4) Top regions by revenue
    const topRegionsAgg = await Sale.aggregate([
      {
        $group: {
          _id: { $ifNull: ["$region", "Unknown"] },
          revenue: { $sum: { $ifNull: ["$revenue", 0] } },
          orders: { $sum: { $ifNull: ["$orders", 0] } },
        },
      },
      { $sort: { revenue: -1 } },
      { $limit: 10 },
    ]);

    const topRegions = topRegionsAgg.map((r) => ({
      region: r._id,
      revenue: r.revenue,
      orders: r.orders,
    }));

    // 5) Targets summary
    const totalTarget = totals.totalTarget || 0;
    const totalAchieved = totals.totalAchieved || 0;
    const targetCompletionRate = totalTarget > 0 ? Number(((totalAchieved / totalTarget) * 100).toFixed(2)) : 0;

    // 6) Month-over-month growth: compare revenue of current month vs previous month
    const curr = trend[trend.length - 1]; // most recent month (last element)
    const prev = trend[trend.length - 2] || { revenue: 0 };
    const growthRate = prev.revenue === 0 ? (curr.revenue === 0 ? 0 : 100) : Number((((curr.revenue - prev.revenue) / prev.revenue) * 100).toFixed(2));

    // Build final response
    const response = {
      success: true,
      data: {
        kpis: {
          totalRecords: totals.totalRecords,
          totalOrders,
          totalRevenue,
          avgOrderValue: Number(avgOrderValue.toFixed(2)),
        },
        trend, // monthly trend array (12 points)
        topProducts,
        topRegions,
        targets: {
          totalTarget,
          totalAchieved,
          targetCompletionRate,
        },
        growthRate,
      },
    };

    return NextResponse.json(response);
  } catch (err: any) {
    console.error("sales/summary error:", err);
    return NextResponse.json({ success: false, message: err.message || "Server error" }, { status: 500 });
  }
}

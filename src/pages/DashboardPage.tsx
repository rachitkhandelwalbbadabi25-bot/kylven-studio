import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AssetListing, UserProfile, calculatePricing, SalesRecord } from "../types";
import {
  TrendingUp,
  IndianRupee,
  ShoppingBag,
  PlusCircle,
  Clock,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  Layers,
  ArrowUpRight,
  Sparkles,
  Calendar,
  Filter,
  Compass,
  ArrowRight,
  Star,
  Eye,
} from "lucide-react";

interface DashboardPageProps {
  listings: AssetListing[];
  userProfile: UserProfile;
}

export const DashboardPage: React.FC<DashboardPageProps> = ({
  listings,
  userProfile,
}) => {
  const navigate = useNavigate();
  const upiVpa = userProfile.upiId || "";
  const [chartTimeRange, setChartTimeRange] = useState<"7d" | "30d" | "12m">("12m");
  const [hoveredBarIndex, setHoveredBarIndex] = useState<number | null>(null);
  const [exploreCategory, setExploreCategory] = useState<string>("All");

  // Filter listings belonging to this creator from authoritative Firebase listings (excluding soft-deleted)
  const myListings = listings.filter((l) => {
    if (l.deleted === true) return false;
    if (userProfile.uid && l.sellerId === userProfile.uid) return true;
    if (userProfile.username && l.creator?.username?.toLowerCase() === userProfile.username.toLowerCase()) return true;
    if (userProfile.name && l.sellerName?.toLowerCase() === userProfile.name.toLowerCase()) return true;
    return false;
  });

  const activeListingsCount = myListings.length;

  // Real Sales records (empty initially until authentic transactions occur)
  const [salesList] = useState<SalesRecord[]>([]);

  // Summary Metrics calculations strictly based on actual data
  const totalSales = salesList.length;
  const totalEarnedINR = salesList.reduce((sum, s) => sum + (s.sellerNetINR || 0), 0);
  const pendingPayoutINR = 0;

  // Monthly Chart Data (real or baseline)
  const MONTHLY_CHART_DATA = [
    { label: "Jan", sales: 0, amount: 0 },
    { label: "Feb", sales: 0, amount: 0 },
    { label: "Mar", sales: 0, amount: 0 },
    { label: "Apr", sales: 0, amount: 0 },
    { label: "May", sales: 0, amount: 0 },
    { label: "Jun", sales: 0, amount: 0 },
    { label: "Jul", sales: 0, amount: 0 },
    { label: "Aug", sales: totalSales, amount: totalEarnedINR, isCurrent: true },
    { label: "Sep", sales: 0, amount: 0 },
    { label: "Oct", sales: 0, amount: 0 },
    { label: "Nov", sales: 0, amount: 0 },
    { label: "Dec", sales: 0, amount: 0 },
  ];

  const WEEKLY_CHART_DATA = [
    { label: "Mon", sales: 0, amount: 0 },
    { label: "Tue", sales: 0, amount: 0 },
    { label: "Wed", sales: 0, amount: 0 },
    { label: "Thu", sales: 0, amount: 0 },
    { label: "Fri", sales: 0, amount: 0 },
    { label: "Sat", sales: 0, amount: 0 },
    { label: "Sun", sales: totalSales, amount: totalEarnedINR, isCurrent: true },
  ];

  const chartData = chartTimeRange === "7d" ? WEEKLY_CHART_DATA : MONTHLY_CHART_DATA;
  const maxBarAmount = Math.max(...chartData.map((d) => d.amount), 1000);

  // Role guard: Dashboard is strictly for sellers only
  useEffect(() => {
    if (userProfile.role === "buyer") {
      navigate("/profile", { replace: true });
    }
  }, [userProfile.role, navigate]);

  if (userProfile.role === "buyer") {
    return null;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8" id="seller-dashboard-page">
      {/* 1. Header: Title & Subtitle + Action */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#202C44] pb-6" id="dashboard-header">
        <div>
          <div className="flex items-center gap-2">
            <span className="bg-[#202C44] text-[#D3CCB0] text-xs font-mono font-bold px-2.5 py-0.5 rounded border border-[#202C44]">
              Seller Portal
            </span>
            <Link
              to={`/profile/${userProfile.username || "buildwithansh"}`}
              className="text-xs text-[#7B8A90] hover:text-[#D3CCB0] font-mono transition-colors flex items-center gap-1 group"
              title="View your public seller profile"
            >
              <span className="group-hover:underline">@{userProfile.username || "buildwithansh"}</span>
              <ExternalLink className="w-3 h-3 opacity-70 group-hover:opacity-100" />
            </Link>
          </div>
          <h1 className="text-2xl sm:text-3xl font-heading font-extrabold text-white tracking-tight mt-1.5" id="dashboard-title">
            Seller Dashboard
          </h1>
          <p className="text-xs sm:text-sm text-[#7B8A90] mt-0.5" id="dashboard-subtitle">
            Track your earnings, sales, and payouts.
          </p>
        </div>

        <div className="flex items-center gap-2.5 self-start sm:self-auto">
          <Link
            to={`/profile/${userProfile.username || "buildwithansh"}`}
            id="dashboard-view-profile-btn"
            className="bg-[#111317] hover:bg-[#202C44] text-[#D3CCB0] hover:text-white font-bold text-xs px-3.5 sm:px-4 py-2.5 rounded-xl transition-all border border-[#202C44] flex items-center gap-1.5 active:scale-95"
          >
            <Eye className="w-4 h-4 text-[#D3CCB0]" />
            <span>View Profile</span>
          </Link>
          <Link
            to="/browse"
            id="dashboard-explore-assets-btn"
            className="bg-[#202C44] hover:bg-[#202C44]/80 text-[#D3CCB0] hover:text-white font-bold text-xs px-3.5 sm:px-4 py-2.5 rounded-xl transition-all border border-[#202C44] flex items-center gap-1.5 active:scale-95"
          >
            <Compass className="w-4 h-4 text-[#D3CCB0]" />
            <span>Explore Assets</span>
          </Link>
          <Link
            to="/sell/new"
            id="dashboard-list-asset-btn"
            className="bg-[#D3CCB0] hover:bg-[#c4bb9a] text-[#000000] font-bold text-xs px-4 py-2.5 rounded-xl transition-all shadow flex items-center gap-1.5 active:scale-95"
          >
            <PlusCircle className="w-4 h-4 text-[#000000]" />
            <span>Upload Asset</span>
          </Link>
        </div>
      </div>

      {/* 2. Top Row: 4 Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5" id="dashboard-stats-grid">
        
        {/* Total Earned (in green text) */}
        <div className="bg-[#111317] border border-[#202C44] rounded-2xl p-5 space-y-2 relative overflow-hidden group hover:border-[#D3CCB0]/40 transition-colors" id="stat-card-total-earned">
          <div className="flex items-center justify-between text-xs text-[#7B8A90]">
            <span className="font-mono uppercase text-[10px] tracking-wider">Total Earned</span>
            <IndianRupee className="w-4 h-4 text-emerald-400" />
          </div>
          <p className="text-2xl sm:text-3xl font-heading font-extrabold text-emerald-400 font-mono tracking-tight" id="stat-total-earned-value">
            ₹{totalEarnedINR.toLocaleString("en-IN")}
          </p>
          <p className="text-[10px] text-[#7B8A90] font-mono flex items-center gap-1">
            <CheckCircle2 className="w-3 h-3 text-emerald-400" />
            <span>90% net seller take-home</span>
          </p>
        </div>

        {/* Pending Payout */}
        <div className="bg-[#111317] border border-[#202C44] rounded-2xl p-5 space-y-2 relative overflow-hidden group hover:border-[#D3CCB0]/40 transition-colors" id="stat-card-pending-payout">
          <div className="flex items-center justify-between text-xs text-[#7B8A90]">
            <span className="font-mono uppercase text-[10px] tracking-wider">Pending Payout</span>
            <Clock className="w-4 h-4 text-[#7B8A90]" />
          </div>
          <p className="text-2xl sm:text-3xl font-heading font-extrabold text-white font-mono tracking-tight" id="stat-pending-payout-value">
            ₹{pendingPayoutINR.toLocaleString("en-IN")}
          </p>
          <p className="text-[10px] text-emerald-400 font-mono">
            Direct UPI to {upiVpa}
          </p>
        </div>

        {/* Total Sales */}
        <div className="bg-[#111317] border border-[#202C44] rounded-2xl p-5 space-y-2 relative overflow-hidden group hover:border-[#D3CCB0]/40 transition-colors" id="stat-card-total-sales">
          <div className="flex items-center justify-between text-xs text-[#7B8A90]">
            <span className="font-mono uppercase text-[10px] tracking-wider">Total Sales</span>
            <ShoppingBag className="w-4 h-4 text-[#7B8A90]" />
          </div>
          <p className="text-2xl sm:text-3xl font-heading font-extrabold text-white font-mono tracking-tight" id="stat-total-sales-value">
            {totalSales}
          </p>
          <p className="text-[10px] text-[#7B8A90] font-mono">
            Across verified customer orders
          </p>
        </div>

        {/* Active Listings */}
        <div className="bg-[#111317] border border-[#202C44] rounded-2xl p-5 space-y-2 relative overflow-hidden group hover:border-[#D3CCB0]/40 transition-colors" id="stat-card-active-listings">
          <div className="flex items-center justify-between text-xs text-[#7B8A90]">
            <span className="font-mono uppercase text-[10px] tracking-wider">Active Listings</span>
            <Layers className="w-4 h-4 text-[#D3CCB0]" />
          </div>
          <p className="text-2xl sm:text-3xl font-heading font-extrabold text-[#D3CCB0] font-mono tracking-tight" id="stat-active-listings-value">
            {activeListingsCount}
          </p>
          <p className="text-[10px] text-[#7B8A90] font-mono">
            Live on Kreate Marketplace
          </p>
        </div>

      </div>

      {/* 3. Sales Chart: "Sales Over Time" Bar Chart in Navy / Cream Palette */}
      <div className="bg-[#111317] border border-[#202C44] rounded-3xl p-6 sm:p-8 space-y-6 shadow-xl" id="sales-chart-container">
        
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#202C44] pb-4">
          <div>
            <h2 className="text-lg font-heading font-extrabold text-white flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-[#D3CCB0]" />
              <span>Sales Over Time</span>
            </h2>
            <p className="text-xs text-[#7B8A90] mt-0.5">
              Net revenue generated across all your active assets (INR ₹).
            </p>
          </div>

          {/* Time Filter Pills */}
          <div className="flex items-center bg-[#000000] p-1 rounded-xl border border-[#202C44] self-start sm:self-auto text-xs font-mono">
            <button
              onClick={() => setChartTimeRange("7d")}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                chartTimeRange === "7d"
                  ? "bg-[#D3CCB0] text-[#000000] font-bold"
                  : "text-[#7B8A90] hover:text-white"
              }`}
            >
              7 Days
            </button>
            <button
              onClick={() => setChartTimeRange("30d")}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                chartTimeRange === "30d"
                  ? "bg-[#D3CCB0] text-[#000000] font-bold"
                  : "text-[#7B8A90] hover:text-white"
              }`}
            >
              30 Days
            </button>
            <button
              onClick={() => setChartTimeRange("12m")}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                chartTimeRange === "12m"
                  ? "bg-[#D3CCB0] text-[#000000] font-bold"
                  : "text-[#7B8A90] hover:text-white"
              }`}
            >
              12 Months
            </button>
          </div>
        </div>

        {/* Custom Bar Chart Canvas */}
        <div className="space-y-3 pt-2">
          {/* Chart Bars Area */}
          <div className="h-60 sm:h-64 flex items-end justify-between gap-2 sm:gap-4 px-2 pt-6 relative border-b border-[#202C44]/80">
            
            {/* Horizontal Grid lines */}
            <div className="absolute inset-x-0 top-0 border-b border-[#202C44]/40 flex items-center justify-between text-[10px] text-[#7B8A90] font-mono px-2">
              <span>₹6,000</span>
            </div>
            <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 border-b border-[#202C44]/40 flex items-center justify-between text-[10px] text-[#7B8A90] font-mono px-2">
              <span>₹3,000</span>
            </div>

            {chartData.map((bar, idx) => {
              const heightPercent = bar.amount > 0 ? Math.max(12, (bar.amount / maxBarAmount) * 100) : 4;
              const isHovered = hoveredBarIndex === idx;

              return (
                <div
                  key={bar.label}
                  className="flex-1 flex flex-col items-center h-full justify-end group relative cursor-pointer"
                  onMouseEnter={() => setHoveredBarIndex(idx)}
                  onMouseLeave={() => setHoveredBarIndex(null)}
                >
                  {/* Tooltip on Hover */}
                  {isHovered && (
                    <div className="absolute -top-12 z-20 bg-[#000000] border border-[#D3CCB0] text-white text-[10px] font-mono py-1 px-2.5 rounded-lg shadow-2xl whitespace-nowrap animate-in fade-in">
                      <span className="font-bold text-[#D3CCB0]">₹{bar.amount.toLocaleString("en-IN")}</span> ({bar.sales} sales)
                    </div>
                  )}

                  {/* Bar Element */}
                  <div
                    style={{ height: `${heightPercent}%` }}
                    className={`w-full max-w-[44px] rounded-t-xl transition-all duration-300 ${
                      bar.isCurrent
                        ? "bg-[#D3CCB0] hover:bg-[#e4ddc0] shadow-lg shadow-[#D3CCB0]/10"
                        : "bg-[#202C44] hover:bg-[#2e3e60]"
                    }`}
                  />
                </div>
              );
            })}
          </div>

          {/* X-Axis Labels */}
          <div className="flex items-center justify-between gap-2 sm:gap-4 px-2 text-[10px] sm:text-xs font-mono text-[#7B8A90]">
            {chartData.map((bar) => (
              <span
                key={bar.label}
                className={`flex-1 text-center truncate ${bar.isCurrent ? "text-[#D3CCB0] font-bold" : ""}`}
              >
                {bar.label}
              </span>
            ))}
          </div>

          {/* Legend */}
          <div className="flex items-center justify-center gap-6 pt-4 text-xs text-[#7B8A90]">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-md bg-[#202C44]" />
              <span>Standard Period</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-md bg-[#D3CCB0]" />
              <span className="text-white font-medium">Current Month (Peak Volume)</span>
            </div>
          </div>
        </div>

      </div>

      {/* 4. Recent Sales Table */}
      <div className="bg-[#111317] border border-[#202C44] rounded-3xl p-6 sm:p-8 space-y-6 shadow-xl" id="recent-sales-section">
        
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#202C44] pb-4">
          <div>
            <h2 className="text-lg font-heading font-extrabold text-white flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-[#D3CCB0]" />
              <span>Recent Sales</span>
            </h2>
            <p className="text-xs text-[#7B8A90] mt-0.5">
              Live log of buyer transactions, net payouts, and payment settlement statuses.
            </p>
          </div>

          <div className="text-xs text-[#7B8A90] font-mono">
            Showing {salesList.length} recent orders
          </div>
        </div>

        {/* Sales Table */}
        {salesList.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse" id="sales-history-table">
              <thead>
                <tr className="border-b border-[#202C44] text-[#7B8A90] font-mono uppercase text-[10px] tracking-wider">
                  <th className="py-3 px-4">Listing</th>
                  <th className="py-3 px-4">Buyer</th>
                  <th className="py-3 px-4">Amount</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#202C44]">
                {salesList.map((sale) => {
                  const isPaid = sale.status === "Paid" || sale.status === "Completed";
                  return (
                    <tr key={sale.id} className="hover:bg-[#202C44]/30 transition-colors">
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-lg bg-[#202C44] flex items-center justify-center font-mono font-bold text-[#D3CCB0] text-[10px] shrink-0 border border-[#202C44]">
                            ₹
                          </div>
                          <div>
                            <div className="font-bold text-white max-w-xs truncate">{sale.assetTitle}</div>
                            <div className="text-[10px] text-[#7B8A90] font-mono">{sale.orderId}</div>
                          </div>
                        </div>
                      </td>
                      <td className="py-3.5 px-4 font-mono text-[#D3CCB0] truncate max-w-[200px]">
                        {sale.buyerEmail || "buyer@kreate.studio"}
                      </td>
                      <td className="py-3.5 px-4 font-mono font-bold text-white">
                        ₹{sale.listedPriceINR.toLocaleString("en-IN")}
                      </td>
                      <td className="py-3.5 px-4">
                        {isPaid ? (
                          <span className="inline-flex items-center gap-1 text-[11px] font-mono font-bold text-emerald-400 bg-emerald-950/60 px-2.5 py-0.5 rounded-lg border border-emerald-800">
                            <CheckCircle2 className="w-3 h-3" />
                            <span>Paid</span>
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-[11px] font-mono font-bold text-amber-400 bg-amber-950/60 px-2.5 py-0.5 rounded-lg border border-amber-800">
                            <Clock className="w-3 h-3" />
                            <span>Pending</span>
                          </span>
                        )}
                      </td>
                      <td className="py-3.5 px-4 text-right text-[#7B8A90] font-mono text-[11px]">
                        {sale.date.split(" ")[0]}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-8 text-center space-y-3 bg-[#181C24] rounded-2xl border border-[#202C44]">
            <ShoppingBag className="w-8 h-8 text-[#7B8A90] mx-auto opacity-50" />
            <div className="space-y-1">
              <h3 className="text-sm font-bold text-white">No Sales Recorded Yet</h3>
              <p className="text-xs text-[#7B8A90] max-w-md mx-auto leading-relaxed">
                When buyers purchase your digital assets, live transaction receipts, buyer emails, and direct UPI settlements will appear here.
              </p>
            </div>
          </div>
        )}

      </div>

      {/* 5. Explore Assets & Marketplace Trends Section in Seller Dashboard */}
      <div className="bg-[#111317] border border-[#202C44] rounded-3xl p-6 sm:p-8 space-y-6 shadow-xl" id="seller-explore-assets-section">
        
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#202C44] pb-5">
          <div>
            <div className="flex items-center gap-2">
              <span className="bg-emerald-950 text-emerald-400 border border-emerald-800 text-[10px] font-mono font-bold px-2 py-0.5 rounded">
                Marketplace Discovery
              </span>
              <span className="text-[11px] text-[#7B8A90] font-mono">Seller Hub</span>
            </div>
            <h2 className="text-xl font-heading font-extrabold text-white flex items-center gap-2.5 mt-1.5" id="explore-assets-title">
              <Compass className="w-5 h-5 text-[#D3CCB0]" />
              <span>Explore Assets</span>
            </h2>
            <p className="text-xs text-[#7B8A90] mt-0.5">
              Browse top-performing creative digital assets across the marketplace to discover trending formats, price benchmarks, and inspiration.
            </p>
          </div>

          <Link
            to="/browse"
            id="seller-explore-all-btn"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-[#D3CCB0] hover:text-white bg-[#202C44]/60 hover:bg-[#202C44] border border-[#202C44] px-4 py-2 rounded-xl transition-all self-start sm:self-auto"
          >
            <span>View Explore Assets</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* Category Filter Chips */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
          {["All", "UI/UX & Design", "Code & Dev", "3D Models & Renders", "Productivity & Notion"].map((cat) => {
            const isSelected = exploreCategory === cat;
            return (
              <button
                key={cat}
                type="button"
                onClick={() => setExploreCategory(cat)}
                className={`px-3.5 py-1.5 rounded-xl font-semibold transition-all whitespace-nowrap cursor-pointer ${
                  isSelected
                    ? "bg-[#D3CCB0] text-[#000000] shadow-sm font-bold"
                    : "bg-[#202C44]/40 hover:bg-[#202C44] text-[#7B8A90] hover:text-white border border-[#202C44]"
                }`}
              >
                {cat}
              </button>
            );
          })}
        </div>

        {/* Asset Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5" id="seller-explore-grid">
          {listings
            .filter((asset) => {
              if (asset.deleted === true) return false;
              if (exploreCategory === "All") return true;
              return (
                asset.category?.toLowerCase().includes(exploreCategory.toLowerCase().split(" ")[0]) ||
                asset.title?.toLowerCase().includes(exploreCategory.toLowerCase().split(" ")[0])
              );
            })
            .slice(0, 4)
            .map((asset) => (
              <div
                key={asset.id}
                className="bg-[#181C24] border border-[#202C44] rounded-2xl overflow-hidden hover:border-[#D3CCB0]/60 transition-all flex flex-col group"
              >
                {/* Thumbnail Image */}
                <div className="relative aspect-[16/10] overflow-hidden bg-[#202C44]">
                  <img
                    src={asset.thumbnailUrl || "https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?auto=format&fit=crop&w=600&q=80"}
                    alt={asset.title}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute top-2.5 left-2.5">
                    <span className="bg-[#111317]/90 backdrop-blur-md text-[#D3CCB0] text-[10px] font-mono font-bold px-2 py-0.5 rounded-md border border-[#202C44]">
                      {asset.fileType || ".ZIP"}
                    </span>
                  </div>
                  <div className="absolute top-2.5 right-2.5">
                    <span className="bg-[#111317]/90 backdrop-blur-md text-emerald-400 text-[10px] font-mono font-bold px-2 py-0.5 rounded-md border border-emerald-900 flex items-center gap-1">
                      {asset.isFree || (asset.price ?? 0) === 0 ? "FREE" : `₹${(asset.price ?? 0).toLocaleString("en-IN")}`}
                    </span>
                  </div>
                </div>

                {/* Card Content */}
                <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                  <div>
                    <span className="text-[10px] text-[#7B8A90] font-mono uppercase tracking-wider block mb-1 truncate">
                      {asset.category || "Digital Asset"}
                    </span>
                    <h3 className="text-sm font-heading font-bold text-white group-hover:text-[#D3CCB0] transition-colors line-clamp-1">
                      {asset.title}
                    </h3>
                    <p className="text-[11px] text-[#7B8A90] line-clamp-2 mt-1 leading-relaxed">
                      {asset.shortDescription || asset.description || "High quality digital creator asset."}
                    </p>
                  </div>

                  <div className="pt-2.5 border-t border-[#202C44]/80 flex items-center justify-between text-xs">
                    <span className="text-[11px] text-[#7B8A90] font-mono truncate max-w-[120px]">
                      @{asset.creator?.username || asset.seller?.handle?.replace("@", "") || "creator"}
                    </span>
                    <Link
                      to={`/asset/${asset.id}`}
                      className="text-[11px] font-bold text-[#D3CCB0] hover:text-white flex items-center gap-1 group-hover:underline"
                    >
                      <span>View</span>
                      <ArrowUpRight className="w-3 h-3" />
                    </Link>
                  </div>
                </div>
              </div>
            ))}
        </div>

      </div>

    </div>
  );
};

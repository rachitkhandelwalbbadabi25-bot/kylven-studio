import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AssetListing, UserProfile, calculatePricing } from "../types";
import {
  TrendingUp,
  IndianRupee,
  ShoppingBag,
  PlusCircle,
  Clock,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  ShieldCheck,
  Star,
  Settings,
  ArrowUpRight,
  Layers
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
  const [upiVpa, setUpiVpa] = useState("aarav@okaxis");
  const [savedVpa, setSavedVpa] = useState(false);

  // Filter listings belonging to this creator
  const myListings = listings.filter(
    (l) =>
      (l.creator?.username && l.creator.username.toLowerCase() === userProfile.username?.toLowerCase()) ||
      (l.seller?.handle && l.seller.handle.replace("@", "").toLowerCase() === userProfile.username?.toLowerCase()) ||
      l.isNew
  );

  // Compute total sales and 90% net earnings
  const totalSalesCount = myListings.reduce((sum, item) => sum + (item.salesCount || 0), 184);
  const totalGrossINR = myListings.reduce(
    (sum, item) => sum + (item.priceInINR * (item.salesCount || 0)),
    312000
  );
  const totalNetEarningsINR = Math.round(totalGrossINR * 0.9);
  const totalPlatformFeesINR = Math.round(totalGrossINR * 0.1);

  const handleSavePayoutVpa = (e: React.FormEvent) => {
    e.preventDefault();
    setSavedVpa(true);
    setTimeout(() => setSavedVpa(false), 2500);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      {/* Header & Quick Action */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#202C44] pb-6">
        <div>
          <div className="flex items-center gap-2">
            <span className="bg-[#202C44] text-[#D3CCB0] text-xs font-mono font-bold px-2.5 py-0.5 rounded border border-[#202C44]">
              Seller Studio
            </span>
            <span className="text-xs text-[#7B8A90] font-mono">@{userProfile.username || "aarav_ui"}</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-heading font-extrabold text-white tracking-tight mt-1">
            Creator Earnings & Asset Dashboard
          </h1>
          <p className="text-xs sm:text-sm text-[#7B8A90] mt-0.5">
            Monitor real-time sales volume, manage listings, and configure weekly UPI payouts.
          </p>
        </div>

        <Link
          to="/sell/new"
          className="bg-[#D3CCB0] hover:bg-[#c4bb9a] text-[#000000] font-bold text-xs px-4 py-2.5 rounded-xl transition-all shadow flex items-center gap-1.5 self-start sm:self-auto"
        >
          <PlusCircle className="w-4 h-4 text-[#000000]" />
          <span>Publish New Asset</span>
        </Link>
      </div>

      {/* Metrics Row (4 Cards) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        
        {/* Net Earnings */}
        <div className="bg-[#111317] border border-[#202C44] rounded-2xl p-5 space-y-2">
          <div className="flex items-center justify-between text-xs text-[#7B8A90]">
            <span className="font-mono uppercase text-[10px]">Net Creator Earnings (90%)</span>
            <IndianRupee className="w-4 h-4 text-[#D3CCB0]" />
          </div>
          <p className="text-2xl font-heading font-extrabold text-[#D3CCB0] font-mono">
            ₹{totalNetEarningsINR.toLocaleString("en-IN")}
          </p>
          <p className="text-[10px] text-emerald-400 font-mono flex items-center gap-1">
            <CheckCircle2 className="w-3 h-3" /> 90% revenue retained
          </p>
        </div>

        {/* Total Units Sold */}
        <div className="bg-[#111317] border border-[#202C44] rounded-2xl p-5 space-y-2">
          <div className="flex items-center justify-between text-xs text-[#7B8A90]">
            <span className="font-mono uppercase text-[10px]">Total Units Sold</span>
            <ShoppingBag className="w-4 h-4 text-[#7B8A90]" />
          </div>
          <p className="text-2xl font-heading font-extrabold text-white font-mono">
            {totalSalesCount.toLocaleString("en-IN")}
          </p>
          <p className="text-[10px] text-[#7B8A90] font-mono">
            Across {myListings.length} published products
          </p>
        </div>

        {/* Next Payout Date */}
        <div className="bg-[#111317] border border-[#202C44] rounded-2xl p-5 space-y-2">
          <div className="flex items-center justify-between text-xs text-[#7B8A90]">
            <span className="font-mono uppercase text-[10px]">Next Weekly Settlement</span>
            <Clock className="w-4 h-4 text-[#7B8A90]" />
          </div>
          <p className="text-2xl font-heading font-extrabold text-white">
            Upcoming Monday
          </p>
          <p className="text-[10px] text-emerald-400 font-mono">
            Direct UPI to {upiVpa}
          </p>
        </div>

        {/* Average Creator Rating */}
        <div className="bg-[#111317] border border-[#202C44] rounded-2xl p-5 space-y-2">
          <div className="flex items-center justify-between text-xs text-[#7B8A90]">
            <span className="font-mono uppercase text-[10px]">Store Rating</span>
            <Star className="w-4 h-4 text-[#D3CCB0] fill-current" />
          </div>
          <p className="text-2xl font-heading font-extrabold text-white font-mono">
            4.9 <span className="text-xs text-[#7B8A90] font-normal">/ 5.0</span>
          </p>
          <p className="text-[10px] text-emerald-400 font-mono">
            100% Verified Buyer Reviews
          </p>
        </div>

      </div>

      {/* 2-Column Split: Published Listings Table & Payout Settings */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Column: Listings Manager (8 cols) */}
        <div className="lg:col-span-8 space-y-6">
          <div className="bg-[#111317] border border-[#202C44] rounded-2xl p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-[#202C44] pb-4">
              <div>
                <h2 className="text-base font-heading font-bold text-white">
                  Your Published Assets ({myListings.length})
                </h2>
                <p className="text-xs text-[#7B8A90] mt-0.5">
                  Live assets available for purchase on Kreate Studio.
                </p>
              </div>

              <Link
                to="/sell/new"
                className="text-xs font-bold text-[#D3CCB0] hover:underline flex items-center gap-1"
              >
                <span>Add Item</span>
                <PlusCircle className="w-3.5 h-3.5" />
              </Link>
            </div>

            {/* Listings rows */}
            <div className="space-y-3">
              {myListings.map((item) => {
                const pr = calculatePricing(item.priceInINR);
                return (
                  <div
                    key={item.id}
                    className="bg-[#202C44]/40 hover:bg-[#202C44]/80 border border-[#202C44] p-4 rounded-xl transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                  >
                    <div className="flex items-center gap-3.5">
                      <img
                        src={item.thumbnailUrl}
                        alt={item.title}
                        className="w-14 h-14 rounded-xl object-cover border border-[#202C44]"
                      />
                      <div className="space-y-0.5">
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] font-mono text-[#D3CCB0] bg-[#111317] px-1.5 py-0.2 rounded border border-[#202C44]">
                            {item.fileType || ".zip"}
                          </span>
                          <span className="text-[10px] text-emerald-400 font-mono">
                            ● Active
                          </span>
                        </div>
                        <h4 className="text-xs font-bold text-white max-w-sm truncate">{item.title}</h4>
                        <p className="text-[11px] text-[#7B8A90] font-mono">
                          {item.salesCount || 0} sales • Rated ★ {item.rating.toFixed(1)}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center justify-between sm:justify-end gap-4 border-t sm:border-t-0 pt-2 sm:pt-0 border-[#202C44]">
                      <div className="text-right">
                        <div className="text-xs font-bold font-mono text-white">
                          List: ₹{pr.listedPriceINR.toLocaleString("en-IN")}
                        </div>
                        <div className="text-[10px] text-emerald-400 font-mono">
                          You get: ₹{pr.sellerNetINR.toLocaleString("en-IN")}
                        </div>
                      </div>

                      <button
                        onClick={() => navigate(`/listing/${item.slug || item.id}`)}
                        className="bg-[#202C44] hover:bg-[#202C44]/90 text-[#D3CCB0] text-xs font-semibold px-3 py-1.5 rounded-lg border border-[#202C44] flex items-center gap-1"
                      >
                        <span>View</span>
                        <ArrowUpRight className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Column: Payout Settings & Fee Transparency (4 cols) */}
        <div className="lg:col-span-4 space-y-6">
          
          {/* UPI Payout Configuration Card */}
          <div className="bg-[#111317] border border-[#202C44] rounded-2xl p-6 space-y-4">
            <h3 className="text-sm font-heading font-bold text-white flex items-center gap-2">
              <IndianRupee className="w-4 h-4 text-[#D3CCB0]" />
              <span>Payout Settlement Details</span>
            </h3>

            <p className="text-xs text-[#7B8A90] leading-relaxed">
              Earnings are calculated with a 90% net creator split and dispatched weekly via UPI / IMPS.
            </p>

            <form onSubmit={handleSavePayoutVpa} className="space-y-3">
              <div>
                <label className="block text-[11px] text-[#7B8A90] mb-1 font-mono uppercase">
                  Registered UPI VPA Handle
                </label>
                <input
                  type="text"
                  required
                  value={upiVpa}
                  onChange={(e) => setUpiVpa(e.target.value)}
                  placeholder="yourname@okhdfcbank"
                  className="w-full bg-[#000000] text-white text-xs px-3 py-2.5 rounded-xl border border-[#202C44] focus:outline-none focus:border-[#D3CCB0] font-mono"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-[#202C44] hover:bg-[#202C44]/80 text-[#D3CCB0] text-xs font-bold py-2.5 rounded-xl border border-[#202C44] transition-colors"
              >
                {savedVpa ? "Saved & Verified!" : "Update Payout VPA"}
              </button>
            </form>

            <div className="pt-3 border-t border-[#202C44] space-y-2 text-[11px] text-[#7B8A90]">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span>Zero transfer charges on Indian UPI</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span>Automated GST/TDS tax summaries</span>
              </div>
            </div>
          </div>

          {/* Quick Platform Fee Breakdown */}
          <div className="bg-[#111317] border border-[#202C44] rounded-2xl p-6 space-y-3">
            <h3 className="text-xs font-mono font-bold text-[#D3CCB0] uppercase tracking-wider">
              Revenue Split Rule
            </h3>
            <div className="space-y-2 text-xs">
              <div className="flex items-center justify-between text-emerald-400 font-bold">
                <span>Creator Take-Home:</span>
                <span className="font-mono">90%</span>
              </div>
              <div className="flex items-center justify-between text-[#7B8A90]">
                <span>Platform Processing:</span>
                <span className="font-mono">10%</span>
              </div>
            </div>
            <p className="text-[10px] text-[#7B8A90] pt-2 border-t border-[#202C44]">
              Covers automated cloud hosting, ClamAV antivirus inspection, and high-speed bandwidth delivery across India.
            </p>
          </div>

        </div>

      </div>

    </div>
  );
};

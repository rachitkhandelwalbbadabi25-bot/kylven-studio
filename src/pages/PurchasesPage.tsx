import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { SalesRecord, AssetListing } from "../types";
import { Download, FileText, CheckCircle2, ShieldCheck, ExternalLink, ShoppingBag, ArrowRight } from "lucide-react";

interface PurchasesPageProps {
  salesHistory: SalesRecord[];
  allListings: AssetListing[];
  userEmail: string;
}

export const PurchasesPage: React.FC<PurchasesPageProps> = ({
  salesHistory,
  allListings,
  userEmail,
}) => {
  const navigate = useNavigate();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-[#202C44] pb-6">
        <div>
          <div className="flex items-center gap-2">
            <span className="bg-[#202C44] text-[#D3CCB0] text-xs font-mono font-bold px-2.5 py-0.5 rounded border border-[#202C44]">
              Buyer Library
            </span>
            <span className="text-xs text-[#7B8A90]">/ Verified Downloads</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-heading font-extrabold text-white tracking-tight mt-1">
            Your Purchased Assets & Invoices
          </h1>
          <p className="text-xs sm:text-sm text-[#7B8A90] mt-0.5">
            Access lifetime source files, commercial license keys, and GST-ready UPI payment receipts.
          </p>
        </div>

        <Link
          to="/browse"
          className="bg-[#202C44] hover:bg-[#202C44]/80 text-[#D3CCB0] text-xs font-bold px-4 py-2.5 rounded-xl border border-[#202C44] transition-all flex items-center gap-1.5 self-start md:self-auto"
        >
          <ShoppingBag className="w-4 h-4" />
          <span>Browse More Assets</span>
        </Link>
      </div>

      {/* Purchased Items List */}
      {salesHistory.length > 0 ? (
        <div className="space-y-4">
          {salesHistory.map((order) => {
            // Find corresponding listing if available
            const matchingAsset = allListings.find(
              (a) => a.title.toLowerCase() === order.assetTitle.toLowerCase()
            );

            return (
              <div
                key={order.id}
                className="bg-[#111317] border border-[#202C44] rounded-2xl p-6 space-y-4 hover:border-[#7B8A90]/40 transition-all"
              >
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-[#202C44]">
                  
                  <div className="flex items-start gap-4">
                    {matchingAsset ? (
                      <img
                        src={matchingAsset.thumbnailUrl}
                        alt={order.assetTitle}
                        className="w-16 h-16 rounded-xl object-cover border border-[#202C44] shrink-0"
                      />
                    ) : (
                      <div className="w-16 h-16 rounded-xl bg-[#202C44] border border-[#202C44] flex items-center justify-center text-[#D3CCB0] shrink-0">
                        <FileText className="w-8 h-8" />
                      </div>
                    )}

                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-mono bg-[#202C44] text-[#D3CCB0] px-2 py-0.5 rounded border border-[#202C44]">
                          Order ID: {order.orderId}
                        </span>
                        <span className="text-[10px] text-[#7B8A90] font-mono">{order.date}</span>
                      </div>

                      <h3 className="font-heading font-bold text-base text-white">
                        {order.assetTitle}
                      </h3>

                      <div className="flex items-center gap-2 text-xs text-[#7B8A90]">
                        <span className="text-[#D3CCB0] font-semibold">Payment Method:</span>
                        <span>{order.paymentMethod}</span>
                        <span>•</span>
                        <span className="text-emerald-400 flex items-center gap-1 font-medium">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>Paid & Verified</span>
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Price & Invoice badge */}
                  <div className="text-left md:text-right shrink-0">
                    <div className="text-xs text-[#7B8A90]">Total Amount Paid</div>
                    <div className="font-mono font-bold text-lg text-white">
                      ₹{order.totalPaidINR.toLocaleString("en-IN")}
                    </div>
                    <div className="text-[10px] text-[#7B8A90]">
                      Listed: ₹{order.listedPriceINR} + Platform Fee: ₹{order.platformFeeINR}
                    </div>
                  </div>

                </div>

                {/* Download Actions & License Key */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-1">
                  
                  <div className="bg-[#000000] border border-[#202C44] px-3 py-2 rounded-xl flex items-center gap-3 text-xs font-mono text-[#7B8A90]">
                    <ShieldCheck className="w-4 h-4 text-[#D3CCB0] shrink-0" />
                    <div className="truncate">
                      <span className="text-[#D3CCB0] font-semibold">License Key: </span>
                      <span className="text-white select-all">LIC-KS-2026-{order.orderId.replace("KS-ORD-", "")}-VERIFIED</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    {matchingAsset && (
                      <Link
                        to={`/asset/${matchingAsset.id}`}
                        className="p-2.5 rounded-xl bg-[#202C44] text-[#7B8A90] hover:text-white border border-[#202C44] transition-colors"
                        title="View Asset Details"
                      >
                        <ExternalLink className="w-4 h-4" />
                      </Link>
                    )}

                    <a
                      href="#"
                      onClick={(e) => {
                        e.preventDefault();
                        alert(`Downloading digital package for "${order.assetTitle}"...\nFile Size: 124 MB ZIP\nSource files & commercial license key included.`);
                      }}
                      className="bg-[#D3CCB0] hover:bg-[#c4bb9a] text-[#000000] font-bold text-xs px-4 py-2.5 rounded-xl transition-all flex items-center gap-1.5 shadow"
                    >
                      <Download className="w-4 h-4" />
                      <span>Download Source (.zip)</span>
                    </a>
                  </div>

                </div>

              </div>
            );
          })}
        </div>
      ) : (
        /* Empty State */
        <div className="bg-[#111317] border border-[#202C44] rounded-2xl p-12 text-center space-y-4 max-w-md mx-auto my-12">
          <div className="w-12 h-12 rounded-2xl bg-[#202C44] text-[#D3CCB0] flex items-center justify-center mx-auto">
            <ShoppingBag className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-base font-heading font-bold text-white">No Purchases Yet</h3>
            <p className="text-xs text-[#7B8A90] mt-1">
              When you purchase a UI kit, Flutter template, or AI notebook via UPI, your direct download links will appear here.
            </p>
          </div>
          <button
            onClick={() => navigate("/browse")}
            className="bg-[#D3CCB0] text-[#000000] text-xs font-bold px-5 py-2.5 rounded-xl shadow inline-flex items-center gap-2"
          >
            <span>Explore Marketplace</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      )}

    </div>
  );
};

import React, { useState } from "react";
import { Link } from "react-router-dom";
import { UserPurchase } from "../types";
import {
  ShoppingBag,
  Download,
  Key,
  Copy,
  ExternalLink,
  CheckCircle2,
  FileArchive,
  ArrowRight,
  ShieldCheck,
  Check
} from "lucide-react";

interface PurchasesPageProps {
  purchases: UserPurchase[];
}

export const PurchasesPage: React.FC<PurchasesPageProps> = ({ purchases }) => {
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [downloadingId, setDownloadingId] = useState<string | null>(null);

  const handleCopyKey = (key: string) => {
    navigator.clipboard?.writeText(key);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const handleDownload = (purchase: UserPurchase) => {
    setDownloadingId(purchase.orderId);
    // Simulate real download trigger or create blob
    setTimeout(() => {
      const element = document.createElement("a");
      const file = new Blob([
        `KREATE STUDIO DIGITAL ASSET DELIVERY\n====================================\nOrder ID: ${purchase.orderId}\nAsset Title: ${purchase.title}\nCategory: ${purchase.category}\nLicense Key: ${purchase.licenseKey}\nPurchase Date: ${purchase.purchaseDate}\nPrice Paid: ₹${purchase.pricePaidINR}\nLicense Type: Standard Commercial License\n\nThank you for supporting Indian creator economy!\nVisit https://kreatestudio.in to download updates anytime.`
      ], { type: "text/plain" });
      element.href = URL.createObjectURL(file);
      element.download = `${purchase.title.toLowerCase().replace(/[^a-z0-9]/g, "-")}-license-package.txt`;
      document.body.appendChild(element);
      element.click();
      document.body.removeChild(element);
      setDownloadingId(null);
    }, 600);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      {/* 1. Page Title & Subtitle (7_purchases.png) */}
      <div className="border-b border-[#202C44] pb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-heading font-extrabold text-white tracking-tight">
            My Purchases
          </h1>
          <p className="text-xs sm:text-sm text-[#7B8A90] mt-1">
            Access and re-download everything you’ve bought.
          </p>
        </div>

        <Link
          to="/browse"
          className="text-xs font-bold text-[#D3CCB0] hover:underline flex items-center gap-1.5 self-start sm:self-auto"
        >
          <span>Browse More Assets</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      {/* 2. Purchase List: Vertical list of cards */}
      {purchases.length > 0 ? (
        <div className="space-y-4">
          {purchases.map((item) => (
            <div
              key={item.orderId}
              className="bg-[#111317] border border-[#202C44] rounded-2xl p-5 sm:p-6 transition-all hover:border-[#D3CCB0]/40 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6"
            >
              
              {/* Asset Details: Icon/Image, Title, Date, Price */}
              <div className="flex items-center gap-4 flex-1 min-w-0">
                <img
                  src={item.thumbnailUrl}
                  alt={item.title}
                  className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl object-cover border border-[#202C44] shrink-0"
                />
                <div className="space-y-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-mono text-[#D3CCB0] bg-[#202C44] px-2 py-0.5 rounded border border-[#202C44]">
                      {item.fileType || ".zip"}
                    </span>
                    <span className="text-[11px] text-[#7B8A90] font-mono">
                      Order #{item.orderId}
                    </span>
                  </div>
                  <h3 className="text-sm sm:text-base font-bold text-white leading-snug truncate">
                    {item.title}
                  </h3>
                  <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-[#7B8A90]">
                    <span>Purchased on {item.purchaseDate}</span>
                    <span>•</span>
                    <span className="font-mono text-white font-semibold">
                      ₹{item.pricePaidINR.toLocaleString("en-IN")}
                    </span>
                  </div>
                </div>
              </div>

              {/* Action: Cream "Download" button on the right */}
              <div className="flex items-center gap-3 shrink-0 self-end md:self-center">
                
                {/* License Key Snippet */}
                {item.licenseKey && (
                  <button
                    type="button"
                    onClick={() => handleCopyKey(item.licenseKey)}
                    className="hidden sm:flex items-center gap-1.5 text-xs font-mono text-[#7B8A90] hover:text-white bg-[#000000] border border-[#202C44] px-3 py-2.5 rounded-xl transition-colors"
                    title="Click to copy license key"
                  >
                    <Key className="w-3.5 h-3.5 text-[#D3CCB0]" />
                    <span className="truncate max-w-[120px]">{item.licenseKey}</span>
                    {copiedKey === item.licenseKey ? (
                      <Check className="w-3 h-3 text-emerald-400" />
                    ) : (
                      <Copy className="w-3 h-3 text-[#7B8A90]" />
                    )}
                  </button>
                )}

                <button
                  type="button"
                  onClick={() => handleDownload(item)}
                  disabled={downloadingId === item.orderId}
                  className="bg-[#D3CCB0] hover:bg-[#c4bb9a] text-[#000000] font-bold text-xs sm:text-sm px-6 py-3 rounded-xl transition-all shadow-md active:scale-95 flex items-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  <Download className="w-4 h-4 text-[#000000]" />
                  <span>
                    {downloadingId === item.orderId ? "Preparing..." : "Download"}
                  </span>
                </button>

                <Link
                  to={`/listing/${item.listingId}`}
                  className="p-3 bg-[#202C44] hover:bg-[#202C44]/80 text-[#D3CCB0] rounded-xl border border-[#202C44] transition-colors"
                  title="View original asset listing"
                >
                  <ExternalLink className="w-4 h-4" />
                </Link>
              </div>

            </div>
          ))}
        </div>
      ) : (
        /* 3. Empty State with "Browse Assets" button (7_purchases.png) */
        <div className="bg-[#111317] border border-[#202C44] rounded-3xl p-12 text-center space-y-5 max-w-md mx-auto my-12 shadow-2xl">
          <div className="w-16 h-16 rounded-2xl bg-[#202C44] text-[#D3CCB0] flex items-center justify-center mx-auto border border-[#202C44]">
            <ShoppingBag className="w-8 h-8" />
          </div>
          <div className="space-y-1.5">
            <h2 className="text-lg font-heading font-bold text-white">No Purchases Yet</h2>
            <p className="text-xs text-[#7B8A90] leading-relaxed">
              You haven’t bought any digital assets yet. Browse our curated collection of UI kits, machine learning pipelines, and 3D models.
            </p>
          </div>
          <Link
            to="/browse"
            className="inline-flex items-center gap-2 bg-[#D3CCB0] hover:bg-[#c4bb9a] text-[#000000] text-xs font-bold px-6 py-3 rounded-xl transition-all shadow active:scale-95"
          >
            <span>Browse Assets</span>
            <ArrowRight className="w-4 h-4 text-[#000000]" />
          </Link>
        </div>
      )}

    </div>
  );
};

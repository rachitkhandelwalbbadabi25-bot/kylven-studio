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
  ShieldCheck
} from "lucide-react";

interface PurchasesPageProps {
  purchases: UserPurchase[];
}

export const PurchasesPage: React.FC<PurchasesPageProps> = ({ purchases }) => {
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const handleCopyKey = (key: string) => {
    navigator.clipboard?.writeText(key);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      {/* Header */}
      <div className="border-b border-[#202C44] pb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="bg-[#202C44] text-[#D3CCB0] text-xs font-mono font-bold px-2.5 py-0.5 rounded border border-[#202C44]">
              Buyer Library
            </span>
            <span className="text-xs text-[#7B8A90] font-mono">Lifetime Re-download Access</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-heading font-extrabold text-white tracking-tight mt-1">
            My Digital Purchases & Licenses
          </h1>
          <p className="text-xs sm:text-sm text-[#7B8A90] mt-0.5">
            Instant uncompressed source packages and commercial license keys for your acquired assets.
          </p>
        </div>

        <Link
          to="/browse"
          className="text-xs font-bold text-[#D3CCB0] hover:underline flex items-center gap-1"
        >
          <span>Browse More Assets</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      {/* Purchases List */}
      {purchases.length > 0 ? (
        <div className="space-y-4">
          {purchases.map((item) => (
            <div
              key={item.orderId}
              className="bg-[#111317] border border-[#202C44] rounded-2xl p-6 transition-all hover:border-[#D3CCB0]/40 shadow-xl space-y-4"
            >
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-[#202C44] pb-4">
                
                {/* Product thumbnail & title */}
                <div className="flex items-center gap-4">
                  <img
                    src={item.thumbnailUrl}
                    alt={item.title}
                    className="w-16 h-16 rounded-xl object-cover border border-[#202C44]"
                  />
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-mono text-[#D3CCB0] bg-[#202C44] px-1.5 py-0.2 rounded border border-[#202C44]">
                        {item.fileType || ".zip"}
                      </span>
                      <span className="text-[10px] text-[#7B8A90] font-mono">
                        Order #{item.orderId}
                      </span>
                    </div>
                    <h3 className="text-sm sm:text-base font-bold text-white leading-snug">
                      {item.title}
                    </h3>
                    <p className="text-xs text-[#7B8A90] font-mono">
                      Purchased on {item.purchaseDate} • Paid ₹{item.pricePaidINR.toLocaleString("en-IN")} via {item.paymentMethod}
                    </p>
                  </div>
                </div>

                {/* Download CTA */}
                <div className="flex items-center gap-3">
                  <a
                    href={item.downloadUrl || "https://kreatestudio.in/downloads/package.zip"}
                    download
                    className="bg-[#D3CCB0] hover:bg-[#c4bb9a] text-[#000000] font-bold text-xs px-5 py-3 rounded-xl transition-all shadow flex items-center gap-2"
                  >
                    <Download className="w-4 h-4 text-[#000000]" />
                    <span>Download Source Package</span>
                  </a>

                  <Link
                    to={`/listing/${item.listingId}`}
                    className="bg-[#202C44] hover:bg-[#202C44]/80 text-[#D3CCB0] text-xs font-semibold px-3.5 py-3 rounded-xl border border-[#202C44] transition-colors"
                    title="View Listing Details"
                  >
                    <ExternalLink className="w-4 h-4" />
                  </Link>
                </div>

              </div>

              {/* License Certificate & Key Row */}
              <div className="bg-[#202C44]/40 border border-[#202C44] rounded-xl p-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                <div className="flex items-center gap-2">
                  <Key className="w-4 h-4 text-[#D3CCB0] shrink-0" />
                  <span className="text-[#7B8A90]">Commercial License:</span>
                  <span className="font-mono text-white font-bold bg-[#111317] px-2 py-0.5 rounded border border-[#202C44]">
                    {item.licenseKey}
                  </span>
                </div>

                <button
                  type="button"
                  onClick={() => handleCopyKey(item.licenseKey)}
                  className="text-xs font-mono text-[#D3CCB0] hover:underline flex items-center gap-1 self-start sm:self-auto"
                >
                  <Copy className="w-3.5 h-3.5" />
                  <span>{copiedKey === item.licenseKey ? "Copied to clipboard!" : "Copy License Key"}</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        /* Empty State */
        <div className="bg-[#111317] border border-[#202C44] rounded-2xl p-12 text-center space-y-4 max-w-md mx-auto my-8">
          <div className="w-14 h-14 rounded-2xl bg-[#202C44] text-[#D3CCB0] flex items-center justify-center mx-auto">
            <ShoppingBag className="w-7 h-7" />
          </div>
          <div>
            <h2 className="text-base font-heading font-bold text-white">No Purchases Found</h2>
            <p className="text-xs text-[#7B8A90] mt-1">
              You have not purchased any digital assets yet. Browse our catalog of UI kits, templates, and notebooks.
            </p>
          </div>
          <Link
            to="/browse"
            className="inline-block bg-[#D3CCB0] text-[#000000] text-xs font-bold px-5 py-2.5 rounded-xl shadow"
          >
            Explore Marketplace
          </Link>
        </div>
      )}

    </div>
  );
};

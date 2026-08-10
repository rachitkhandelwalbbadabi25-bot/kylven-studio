import React, { useState } from "react";
import { Search, ShieldCheck, Download, Upload, CheckCircle2, IndianRupee, Clock, Lock } from "lucide-react";

export const HowItWorks: React.FC = () => {
  const [activeTab, setActiveTab] = useState<"buyers" | "sellers">("buyers");

  return (
    <section className="py-16 bg-[#000000] border-b border-[#202C44]/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Title */}
        <div className="text-center max-w-2xl mx-auto mb-10">
          <div className="inline-flex items-center gap-2 text-[#D3CCB0] text-xs font-mono uppercase tracking-wider mb-2">
            <ShieldCheck className="w-4 h-4" />
            <span>Transparent Workflow</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-heading font-bold text-white tracking-tight">
            How Kreate Studio Works
          </h2>
          <p className="text-xs sm:text-sm text-[#7B8A90] mt-1">
            Seamless marketplace experience built specifically for the Indian creator ecosystem.
          </p>

          {/* Tab Switcher */}
          <div className="inline-flex p-1 bg-[#111317] border border-[#202C44] rounded-xl mt-6">
            <button
              onClick={() => setActiveTab("buyers")}
              className={`px-5 py-2 rounded-lg text-xs font-semibold transition-all ${
                activeTab === "buyers"
                  ? "bg-[#202C44] text-[#D3CCB0] shadow border border-[#202C44]"
                  : "text-[#7B8A90] hover:text-white"
              }`}
            >
              For Asset Buyers
            </button>
            <button
              onClick={() => setActiveTab("sellers")}
              className={`px-5 py-2 rounded-lg text-xs font-semibold transition-all ${
                activeTab === "sellers"
                  ? "bg-[#202C44] text-[#D3CCB0] shadow border border-[#202C44]"
                  : "text-[#7B8A90] hover:text-white"
              }`}
            >
              For Creators & Sellers (90% Split)
            </button>
          </div>
        </div>

        {/* Tab Content */}
        {activeTab === "buyers" ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {/* Step 1 */}
            <div className="bg-[#202C44] border border-[#202C44] rounded-2xl p-6 relative flex flex-col justify-between">
              <div>
                <div className="w-10 h-10 rounded-xl bg-[#111317] text-[#D3CCB0] font-heading font-bold flex items-center justify-center text-lg mb-4 border border-[#202C44]">
                  01
                </div>
                <h3 className="text-base font-heading font-bold text-white mb-2">
                  Browse Reviewed Assets
                </h3>
                <p className="text-xs text-[#7B8A90] leading-relaxed">
                  Search through 239 categories of Flutter templates, Figma design kits, Jupyter notebooks, and LUTs. All items pass manual code & asset review.
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-[#111317] flex items-center gap-2 text-[11px] text-[#D3CCB0]">
                <Search className="w-3.5 h-3.5" />
                <span>Filter by file extension (.fig, .dart, .blend)</span>
              </div>
            </div>

            {/* Step 2 */}
            <div className="bg-[#202C44] border border-[#202C44] rounded-2xl p-6 relative flex flex-col justify-between">
              <div>
                <div className="w-10 h-10 rounded-xl bg-[#111317] text-[#D3CCB0] font-heading font-bold flex items-center justify-center text-lg mb-4 border border-[#202C44]">
                  02
                </div>
                <h3 className="text-base font-heading font-bold text-white mb-2">
                  Instant UPI Checkout (₹)
                </h3>
                <p className="text-xs text-[#7B8A90] leading-relaxed">
                  Pay listed price + 12.5% platform fee directly in Indian Rupees via GPay, PhonePe, Paytm, BHIM or Cards. Zero USD currency conversions.
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-[#111317] flex items-center gap-2 text-[11px] text-[#D3CCB0]">
                <IndianRupee className="w-3.5 h-3.5" />
                <span>GPay, PhonePe, Cards supported</span>
              </div>
            </div>

            {/* Step 3 */}
            <div className="bg-[#202C44] border border-[#202C44] rounded-2xl p-6 relative flex flex-col justify-between">
              <div>
                <div className="w-10 h-10 rounded-xl bg-[#111317] text-[#D3CCB0] font-heading font-bold flex items-center justify-center text-lg mb-4 border border-[#202C44]">
                  03
                </div>
                <h3 className="text-base font-heading font-bold text-white mb-2">
                  Instant File Access
                </h3>
                <p className="text-xs text-[#7B8A90] leading-relaxed">
                  The exact second payment completes, your uncompressed source files (.zip) unlock along with commercial license documentation.
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-[#111317] flex items-center gap-2 text-[11px] text-[#D3CCB0]">
                <Download className="w-3.5 h-3.5" />
                <span>Lifetime re-downloads from account</span>
              </div>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {/* Step 1 */}
            <div className="bg-[#202C44] border border-[#202C44] rounded-2xl p-6 relative flex flex-col justify-between">
              <div>
                <div className="w-10 h-10 rounded-xl bg-[#111317] text-[#D3CCB0] font-heading font-bold flex items-center justify-center text-lg mb-4 border border-[#202C44]">
                  01
                </div>
                <h3 className="text-base font-heading font-bold text-white mb-2">
                  Upload & Price in ₹
                </h3>
                <p className="text-xs text-[#7B8A90] leading-relaxed">
                  Upload your digital files (.zip, .fig, .ipynb), add screenshots, set your desired listed price in Indian Rupees (₹).
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-[#111317] flex items-center gap-2 text-[11px] text-[#D3CCB0]">
                <Upload className="w-3.5 h-3.5" />
                <span>Simple 4-step upload form</span>
              </div>
            </div>

            {/* Step 2 */}
            <div className="bg-[#202C44] border border-[#202C44] rounded-2xl p-6 relative flex flex-col justify-between">
              <div>
                <div className="w-10 h-10 rounded-xl bg-[#111317] text-[#D3CCB0] font-heading font-bold flex items-center justify-center text-lg mb-4 border border-[#202C44]">
                  02
                </div>
                <h3 className="text-base font-heading font-bold text-white mb-2">
                  Manual Quality Review
                </h3>
                <p className="text-xs text-[#7B8A90] leading-relaxed">
                  Our team reviews code compile state, asset quality, and license parameters within 24 hours to guarantee high marketplace trust.
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-[#111317] flex items-center gap-2 text-[11px] text-[#D3CCB0]">
                <Clock className="w-3.5 h-3.5" />
                <span>Max 24-hr review turnaround</span>
              </div>
            </div>

            {/* Step 3 */}
            <div className="bg-[#202C44] border border-[#202C44] rounded-2xl p-6 relative flex flex-col justify-between">
              <div>
                <div className="w-10 h-10 rounded-xl bg-[#111317] text-[#D3CCB0] font-heading font-bold flex items-center justify-center text-lg mb-4 border border-[#202C44]">
                  03
                </div>
                <h3 className="text-base font-heading font-bold text-white mb-2">
                  Keep 90% Net Earnings
                </h3>
                <p className="text-xs text-[#7B8A90] leading-relaxed">
                  Receive 90% guaranteed split on every sale. Funds settle directly into your Indian bank account via NEFT/UPI automatically.
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-[#111317] flex items-center gap-2 text-[11px] text-[#D3CCB0]">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>0% hidden processing cuts</span>
              </div>
            </div>
          </div>
        )}

        {/* Manual Review Trust Signal Callout */}
        <div className="mt-12 bg-[#111317] border border-[#202C44] rounded-2xl p-6 max-w-4xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-[#202C44] border border-[#202C44] flex items-center justify-center shrink-0">
              <ShieldCheck className="w-6 h-6 text-[#D3CCB0]" />
            </div>
            <div>
              <h4 className="text-white font-semibold text-sm font-heading">
                Why Manual Review Matters
              </h4>
              <p className="text-xs text-[#7B8A90] leading-snug mt-0.5">
                Unlike unmoderated marketplaces flooded with broken links and stolen code, Kreate Studio verifies every upload for compilability, virus safety, and license authenticity.
              </p>
            </div>
          </div>

          <div className="bg-[#202C44] text-[#D3CCB0] px-4 py-2 rounded-xl text-xs font-mono shrink-0 border border-[#202C44]">
            100% Quality Guarantee
          </div>
        </div>

      </div>
    </section>
  );
};

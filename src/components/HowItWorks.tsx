import React, { useState } from "react";
import { Search, ShieldCheck, Download, Upload, IndianRupee, Zap, CheckCircle2 } from "lucide-react";

export const HowItWorks: React.FC = () => {
  const [activeTab, setActiveTab] = useState<"buyers" | "sellers">("buyers");

  return (
    <section className="py-16 bg-[#000000] border-b border-[#202C44]/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Title */}
        <div className="text-center max-w-2xl mx-auto mb-10">
          <div className="inline-flex items-center gap-2 text-[#D3CCB0] text-[11px] font-mono font-bold uppercase tracking-[0.1em] mb-2">
            <ShieldCheck className="w-4 h-4" />
            <span>TRANSPARENT WORKFLOW</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-heading font-extrabold text-white tracking-[-0.02em]">
            How Kreate Studio Works
          </h2>
          <p className="text-xs sm:text-sm text-[#7B8A90] font-normal mt-1 leading-relaxed">
            Direct Indian Rupee (₹) payments, instant digital delivery, and 90% creator earnings.
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
              For Buyers
            </button>
            <button
              onClick={() => setActiveTab("sellers")}
              className={`px-5 py-2 rounded-lg text-xs font-semibold transition-all ${
                activeTab === "sellers"
                  ? "bg-[#202C44] text-[#D3CCB0] shadow border border-[#202C44]"
                  : "text-[#7B8A90] hover:text-white"
              }`}
            >
              For Creators (90% Payout)
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
                  Browse Verified Assets
                </h3>
                <p className="text-xs text-[#7B8A90] leading-relaxed">
                  Search through Flutter templates, Figma design kits, Jupyter notebooks, 3D assets, and LUTs. All items pass code & file integrity review.
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-[#111317] flex items-center gap-2 text-[11px] text-[#D3CCB0]">
                <Search className="w-3.5 h-3.5" />
                <span>Filter by file format (.fig, .dart, .blend)</span>
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
                  Pay listed price + 10% platform fee directly in Indian Rupees via GPay, PhonePe, Paytm, BHIM or UPI ID. Zero FX markup.
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-[#111317] flex items-center gap-2 text-[11px] text-[#D3CCB0]">
                <IndianRupee className="w-3.5 h-3.5" />
                <span>GPay, PhonePe, BHIM supported</span>
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
                  The exact second payment completes, your uncompressed source files unlock along with commercial license certificates and lifetime access.
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
                  Upload your digital files (.zip, .fig, .ipynb), add preview screenshots, and set your listed price in Indian Rupees.
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-[#111317] flex items-center gap-2 text-[11px] text-[#D3CCB0]">
                <Upload className="w-3.5 h-3.5" />
                <span>₹0 listing fee • No upfront charges</span>
              </div>
            </div>

            {/* Step 2 */}
            <div className="bg-[#202C44] border border-[#202C44] rounded-2xl p-6 relative flex flex-col justify-between">
              <div>
                <div className="w-10 h-10 rounded-xl bg-[#111317] text-[#D3CCB0] font-heading font-bold flex items-center justify-center text-lg mb-4 border border-[#202C44]">
                  02
                </div>
                <h3 className="text-base font-heading font-bold text-white mb-2">
                  Quality & Safety Review
                </h3>
                <p className="text-xs text-[#7B8A90] leading-relaxed">
                  Our team checks code compile state, archive integrity, and license clarity within 24 hours to ensure high buyer confidence.
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-[#111317] flex items-center gap-2 text-[11px] text-[#D3CCB0]">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>ClamAV malware scanning</span>
              </div>
            </div>

            {/* Step 3 */}
            <div className="bg-[#202C44] border border-[#202C44] rounded-2xl p-6 relative flex flex-col justify-between">
              <div>
                <div className="w-10 h-10 rounded-xl bg-[#111317] text-[#D3CCB0] font-heading font-bold flex items-center justify-center text-lg mb-4 border border-[#202C44]">
                  03
                </div>
                <h3 className="text-base font-heading font-bold text-white mb-2">
                  90% Guaranteed Payout
                </h3>
                <p className="text-xs text-[#7B8A90] leading-relaxed">
                  Earn 90% net from every sale paid directly to your registered UPI ID (VPA) or Indian bank account weekly.
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-[#111317] flex items-center gap-2 text-[11px] text-[#D3CCB0]">
                <Zap className="w-3.5 h-3.5" />
                <span>Direct settlement to UPI VPA</span>
              </div>
            </div>
          </div>
        )}

      </div>
    </section>
  );
};

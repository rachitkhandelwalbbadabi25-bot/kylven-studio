import React, { useState } from "react";
import { Link } from "react-router-dom";
import { calculatePricing } from "../types";
import {
  IndianRupee,
  ShieldCheck,
  Zap,
  CheckCircle2,
  HelpCircle,
  ArrowRight,
  TrendingUp,
  Percent,
  Lock,
  Clock,
  Sliders
} from "lucide-react";

export const PricingPage: React.FC = () => {
  const [calculatorInput, setCalculatorInput] = useState<number>(1499);
  
  // Safe sanitized numeric value
  const sanitizedInput = Math.max(0, Number(calculatorInput) || 0);
  const pricing = calculatePricing(sanitizedInput);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12" id="pricing-page-root">
      
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <div className="inline-flex items-center gap-2 bg-[#202C44] text-[#D3CCB0] text-xs font-mono font-bold px-3 py-1 rounded-full border border-[#202C44]">
          <Percent className="w-3.5 h-3.5" />
          <span>TRANSPARENT ECONOMICS</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-heading font-extrabold text-white tracking-tight">
          Simple, Fair & Transparent Marketplace Fees
        </h1>
        <p className="text-sm sm:text-base text-[#7B8A90] leading-relaxed">
          Zero upfront listing fees. Sellers keep 90% of their listed price from every sale. Platform commission is fixed at 10%.
        </p>
      </div>

      {/* 2 Core Columns: Seller Terms vs Buyer Terms */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
        
        {/* Seller Card */}
        <div className="bg-[#111317] border border-[#202C44] rounded-3xl p-8 space-y-6 relative overflow-hidden shadow-2xl">
          <div className="space-y-2">
            <span className="bg-[#202C44] text-[#D3CCB0] text-xs font-mono font-bold px-3 py-1 rounded-full border border-[#202C44]">
              FOR SELLERS & DEVELOPERS
            </span>
            <h2 className="text-2xl font-heading font-extrabold text-white">
              90% Guaranteed Net Payout
            </h2>
            <p className="text-xs text-[#7B8A90] leading-relaxed">
              Monetize your code, 3D models, UI kits, and presets with transparent seller earnings.
            </p>
          </div>

          <div className="text-3xl font-heading font-extrabold text-[#D3CCB0] font-mono">
            90% <span className="text-xs font-sans text-[#7B8A90] font-normal">of listed asset price</span>
          </div>

          <ul className="space-y-3 text-xs text-[#7B8A90] border-t border-[#202C44] pt-4">
            <li className="flex items-start gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              <span className="text-white"><strong>₹0 Listing Fee:</strong> Post unlimited assets with zero upfront payment.</span>
            </li>
            <li className="flex items-start gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              <span className="text-white"><strong>Weekly UPI Settlement:</strong> Payouts direct to your UPI VPA or Indian Bank Account.</span>
            </li>
            <li className="flex items-start gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              <span className="text-white"><strong>High-Speed Delivery CDN:</strong> Automated file hosting, virus checks & download bandwidth handled for you.</span>
            </li>
          </ul>

          <Link
            to="/sell/new"
            className="block w-full text-center bg-[#D3CCB0] hover:bg-[#c4bb9a] text-[#000000] font-bold text-xs py-3 rounded-xl transition-all shadow"
          >
            Start Selling for Free
          </Link>
        </div>

        {/* Buyer Card */}
        <div className="bg-[#111317] border border-[#202C44] rounded-3xl p-8 space-y-6 relative overflow-hidden shadow-2xl">
          <div className="space-y-2">
            <span className="bg-[#202C44] text-[#D3CCB0] text-xs font-mono font-bold px-3 py-1 rounded-full border border-[#202C44]">
              FOR ASSET BUYERS
            </span>
            <h2 className="text-2xl font-heading font-extrabold text-white">
              10% Quality & Platform Fee
            </h2>
            <p className="text-xs text-[#7B8A90] leading-relaxed">
              Transparent per-transaction processing fee covering security reviews, file integrity validation, and 24/7 file availability.
            </p>
          </div>

          <div className="text-3xl font-heading font-extrabold text-white font-mono">
            + 10% <span className="text-xs font-sans text-[#7B8A90] font-normal">added at UPI checkout</span>
          </div>

          <ul className="space-y-3 text-xs text-[#7B8A90] border-t border-[#202C44] pt-4">
            <li className="flex items-start gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              <span className="text-white"><strong>Zero Currency Conversion Markup:</strong> Pay directly in INR via GPay, PhonePe, Paytm, BHIM.</span>
            </li>
            <li className="flex items-start gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              <span className="text-white"><strong>Instant Download & Commercial License:</strong> Files unlock the same second payment is confirmed.</span>
            </li>
            <li className="flex items-start gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              <span className="text-white"><strong>Lifetime Re-download Access:</strong> Access all past orders anytime from your account.</span>
            </li>
          </ul>

          <Link
            to="/browse"
            className="block w-full text-center bg-[#202C44] hover:bg-[#202C44]/80 text-white font-bold text-xs py-3 rounded-xl border border-[#202C44] transition-all"
          >
            Explore Verified Catalog
          </Link>
        </div>

      </div>

      {/* Interactive Pricing Calculator */}
      <div className="bg-[#111317] border border-[#202C44] rounded-3xl p-8 max-w-4xl mx-auto space-y-6" id="interactive-pricing-calculator">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#202C44] pb-4">
          <div>
            <h3 className="text-lg font-heading font-bold text-white flex items-center gap-2">
              <IndianRupee className="w-5 h-5 text-[#D3CCB0]" />
              <span>Interactive Fee & Split Calculator</span>
            </h3>
            <p className="text-xs text-[#7B8A90] mt-0.5">
              Test how any price is calculated between seller net payout and buyer checkout total.
            </p>
          </div>
          <span className="text-xs font-mono text-[#D3CCB0] bg-[#202C44] px-3 py-1 rounded-full border border-[#202C44] self-start sm:self-auto font-semibold">
            10% Platform Fee • 90% Seller Net Split
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
          {/* Input Controls */}
          <div className="space-y-5">
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label htmlFor="calculator-price-input" className="block text-xs font-mono text-[#7B8A90] uppercase">
                  Base Listed Price (₹ INR)
                </label>
                <span className="text-xs font-mono text-[#D3CCB0] font-bold">
                  ₹{sanitizedInput.toLocaleString("en-IN")}
                </span>
              </div>
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-sm font-bold text-[#D3CCB0]">₹</span>
                <input
                  id="calculator-price-input"
                  type="number"
                  min={0}
                  max={100000}
                  step={50}
                  value={calculatorInput === 0 ? "" : calculatorInput}
                  onChange={(e) => {
                    const val = e.target.value === "" ? 0 : Number(e.target.value);
                    setCalculatorInput(isNaN(val) ? 0 : Math.max(0, val));
                  }}
                  className="w-full bg-[#000000] text-white text-base font-mono font-bold pl-8 pr-4 py-3 rounded-xl border border-[#202C44] focus:outline-none focus:border-[#D3CCB0] transition-colors"
                  placeholder="Enter price in ₹"
                />
              </div>
            </div>

            {/* Range Slider for smooth real-time drag */}
            <div>
              <div className="flex items-center justify-between text-[11px] text-[#7B8A90] mb-1">
                <span className="flex items-center gap-1">
                  <Sliders className="w-3 h-3 text-[#D3CCB0]" />
                  <span>Drag Slider</span>
                </span>
                <span>₹100 – ₹10,000</span>
              </div>
              <input
                type="range"
                min={100}
                max={10000}
                step={50}
                value={Math.min(10000, Math.max(100, sanitizedInput))}
                onChange={(e) => setCalculatorInput(Number(e.target.value))}
                className="w-full h-2 bg-[#202C44] rounded-lg appearance-none cursor-pointer accent-[#D3CCB0]"
              />
            </div>

            {/* Quick preset buttons */}
            <div>
              <span className="block text-[10px] font-mono uppercase text-[#7B8A90] mb-2 font-semibold">
                Quick Price Benchmarks:
              </span>
              <div className="flex flex-wrap gap-2">
                {[499, 999, 1499, 2999, 4999, 9999].map((amt) => (
                  <button
                    key={amt}
                    type="button"
                    onClick={() => setCalculatorInput(amt)}
                    className={`text-xs font-mono px-3 py-1.5 rounded-lg border transition-all cursor-pointer ${
                      sanitizedInput === amt
                        ? "bg-[#D3CCB0] text-[#000000] border-[#D3CCB0] font-bold shadow"
                        : "bg-[#202C44] text-slate-300 hover:text-white hover:bg-[#202C44]/80 border-[#202C44]"
                    }`}
                  >
                    ₹{amt.toLocaleString("en-IN")}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Real-time Calculation Breakdown Box */}
          <div className="bg-[#111317] border border-[#202C44] rounded-2xl p-5 space-y-3.5 text-xs shadow-inner">
            <div className="flex items-center justify-between text-[#7B8A90]">
              <span>Seller Listed Base Price:</span>
              <span className="font-mono text-white font-bold text-sm">
                ₹{pricing.listedPriceINR.toLocaleString("en-IN")}
              </span>
            </div>

            <div className="flex items-center justify-between text-emerald-400 font-medium">
              <span>Seller Net Take-Home (90%):</span>
              <span className="font-mono font-bold text-sm">
                ₹{pricing.sellerNetINR.toLocaleString("en-IN")}
              </span>
            </div>

            <div className="flex items-center justify-between text-[#7B8A90]">
              <span>Platform Processing Fee (10%):</span>
              <span className="font-mono text-[#D3CCB0] font-semibold">
                + ₹{pricing.platformFeeINR.toLocaleString("en-IN")}
              </span>
            </div>

            <div className="pt-3 border-t border-[#202C44] flex items-center justify-between text-sm font-bold text-white">
              <span>Total Buyer Checkout (UPI):</span>
              <span className="text-lg font-heading font-extrabold text-[#D3CCB0]">
                ₹{pricing.buyerTotalINR.toLocaleString("en-IN")}
              </span>
            </div>

            <div className="text-[10px] text-[#7B8A90] font-mono pt-1 text-right bg-[#000000]/40 p-2 rounded-lg border border-[#202C44]/60">
              Formula: ₹{pricing.listedPriceINR.toLocaleString("en-IN")} (Base) + ₹{pricing.platformFeeINR.toLocaleString("en-IN")} (10% Fee) = ₹{pricing.buyerTotalINR.toLocaleString("en-IN")}
            </div>

            {/* Metric Glossary & Terms Explanation */}
            <div className="mt-3 pt-3 border-t border-[#202C44] space-y-2 text-[11px] text-[#7B8A90] bg-[#000000]/60 p-3 rounded-xl">
              <p className="font-bold text-white text-xs">Metric Breakdown Glossary:</p>
              <ul className="space-y-1.5 text-[11px]">
                <li><strong className="text-white">Seller List Price:</strong> The catalog base price set by the seller.</li>
                <li><strong className="text-emerald-400">Seller Net (90%):</strong> The guaranteed net payout settled directly to the seller's UPI account.</li>
                <li><strong className="text-[#D3CCB0]">Platform Fee (10%):</strong> Covers high-speed CDN hosting, file validation, and UPI transaction processing.</li>
                <li><strong className="text-white">Buyer Total:</strong> The complete, final sum paid by the customer at UPI checkout.</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Frequently Asked Questions */}
      <div className="max-w-4xl mx-auto space-y-6">
        <h3 className="text-xl font-heading font-bold text-white text-center">
          Frequently Asked Questions About Payments & Payouts
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          <div className="bg-[#111317] border border-[#202C44] p-5 rounded-2xl space-y-2">
            <h4 className="font-bold text-white text-sm">When do sellers receive payouts?</h4>
            <p className="text-[#7B8A90] leading-relaxed">
              Payouts are calculated weekly on Mondays and settled directly to your registered UPI Virtual Payment Address (VPA) or IMPS bank transfer for all cleared sales.
            </p>
          </div>

          <div className="bg-[#111317] border border-[#202C44] p-5 rounded-2xl space-y-2">
            <h4 className="font-bold text-white text-sm">What payment apps are supported for buyers?</h4>
            <p className="text-[#7B8A90] leading-relaxed">
              All major Indian UPI applications including Google Pay, PhonePe, Paytm, BHIM, Cred, and custom bank UPI handles, plus RuPay, Visa, and Mastercard cards.
            </p>
          </div>

          <div className="bg-[#111317] border border-[#202C44] p-5 rounded-2xl space-y-2">
            <h4 className="font-bold text-white text-sm">What is the refund & dispute policy?</h4>
            <p className="text-[#7B8A90] leading-relaxed">
              Because digital assets are instant uncompressed downloads, refunds are issued if a file is proven corrupted, missing core advertised components, or fails syntax compilation within 7 days.
            </p>
          </div>

          <div className="bg-[#111317] border border-[#202C44] p-5 rounded-2xl space-y-2">
            <h4 className="font-bold text-white text-sm">Are there any hidden or monthly fees?</h4>
            <p className="text-[#7B8A90] leading-relaxed">
              None. Listing on Kreate Studio is 100% free with no monthly subscription. The platform fee of 10% only applies when a sale is successfully transacted.
            </p>
          </div>
        </div>
      </div>

      {/* Upgrade to Seller CTA Card */}
      <div className="bg-[#111317] border border-emerald-500/30 rounded-3xl p-8 sm:p-10 text-center space-y-5 max-w-4xl mx-auto shadow-2xl relative overflow-hidden">
        <div className="space-y-2">
          <span className="bg-emerald-950 text-emerald-400 text-xs font-mono font-bold px-3 py-1 rounded-full border border-emerald-900">
            START EARNING TODAY
          </span>
          <h3 className="text-2xl sm:text-3xl font-heading font-black text-white">
            Ready to publish your creative assets?
          </h3>
          <p className="text-xs sm:text-sm text-[#7B8A90] max-w-lg mx-auto leading-relaxed">
            Upgrade your account in seconds, enter your UPI ID, and receive 90% direct payouts with zero upfront fees.
          </p>
        </div>

        <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link
            to="/upgrade-seller"
            className="w-full sm:w-auto px-8 py-3.5 rounded-2xl bg-[#D3CCB0] hover:bg-[#c4bb9a] text-[#000000] font-heading font-black text-sm transition-all shadow-lg flex items-center justify-center gap-2"
          >
            <span>Upgrade to Seller</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
          <Link
            to="/browse"
            className="w-full sm:w-auto px-6 py-3.5 rounded-2xl bg-[#202C44] hover:bg-[#202C44]/80 text-white font-mono text-xs transition-all border border-[#202C44]"
          >
            Browse Marketplace
          </Link>
        </div>
      </div>

    </div>
  );
};

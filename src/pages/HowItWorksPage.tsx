import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Sparkles,
  ArrowRight,
  UserCheck,
  Search,
  IndianRupee,
  Download,
  UploadCloud,
  ShieldCheck,
  Coins,
  CheckCircle2,
  HelpCircle,
  ChevronDown,
  Layers,
  Zap,
  Percent,
  Check
} from "lucide-react";
import { motion } from "motion/react";

export const HowItWorksPage: React.FC = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<"both" | "buyer" | "seller">("both");
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const faqs = [
    {
      q: "How does UPI native checkout work on Kreate Studio?",
      a: "When you click 'Buy Now' or proceed to checkout, you can pay directly via Google Pay, PhonePe, Paytm, BHIM, or by entering your UPI ID. There are zero international transaction fees, no credit card requirement, and zero currency conversion markups.",
    },
    {
      q: "When and how do sellers receive their 90% payout?",
      a: "Sellers receive 90% of the listed price on every asset sold. Payouts are batched and transferred automatically every Monday directly to your registered Indian Bank Account or UPI VPA.",
    },
    {
      q: "What is the manual review process for new listings?",
      a: "Every listing is reviewed within 24 hours by our engineering team. We inspect the ZIP archive for clean directory structure, run malware and antivirus scans, and verify file integrity to guarantee buyer safety.",
    },
    {
      q: "Can I use purchased digital assets in commercial client projects?",
      a: "Yes! Every standard asset download on Kreate Studio includes a Commercial License allowing you to build client projects, apps, web applications, and commercial products freely.",
    },
    {
      q: "Can I switch between Buyer and Seller modes on the same account?",
      a: "Yes, absolutely. Your Kreate Studio account is universal. You can switch between 'Buyer Mode' (to purchase tools) and 'Seller Mode' (to manage listings & earnings) instantly from the top header.",
    },
  ];

  return (
    <div className="min-h-screen bg-[#000000] text-white selection:bg-[#202C44] selection:text-[#D3CCB0]" id="how-it-works-page">
      
      {/* 1. Header Hero */}
      <section className="py-20 bg-[#111317] border-b border-[#202C44] relative overflow-hidden text-center">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-60 bg-[#202C44]/60 blur-[120px] pointer-events-none" />

        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-4">
          <div className="inline-flex items-center gap-2 bg-[#202C44] border border-[#202C44] px-4 py-1.5 rounded-full text-xs font-mono font-bold text-[#D3CCB0]">
            <Sparkles className="w-3.5 h-3.5" />
            <span>PLATFORM TOUR & PROCESS</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-heading font-black text-white tracking-tight">
            How Kreate Studio Works
          </h1>

          <p className="text-sm sm:text-base text-[#7B8A90] max-w-2xl mx-auto leading-relaxed">
            From account classification to instant UPI checkout and automated weekly seller payouts. A seamless end-to-end workflow for India’s digital economy.
          </p>

          {/* Interactive Filter Pills */}
          <div className="pt-4 flex items-center justify-center gap-2">
            <button
              onClick={() => setActiveTab("both")}
              className={`px-4 py-2 rounded-xl text-xs font-mono font-bold transition-all ${
                activeTab === "both"
                  ? "bg-[#D3CCB0] text-[#000000]"
                  : "bg-[#202C44]/70 text-[#7B8A90] hover:text-white"
              }`}
            >
              Complete Tour (Both)
            </button>
            <button
              onClick={() => setActiveTab("buyer")}
              className={`px-4 py-2 rounded-xl text-xs font-mono font-bold transition-all ${
                activeTab === "buyer"
                  ? "bg-[#D3CCB0] text-[#000000]"
                  : "bg-[#202C44]/70 text-[#7B8A90] hover:text-white"
              }`}
            >
              Buyer Journey
            </button>
            <button
              onClick={() => setActiveTab("seller")}
              className={`px-4 py-2 rounded-xl text-xs font-mono font-bold transition-all ${
                activeTab === "seller"
                  ? "bg-emerald-400 text-[#000000]"
                  : "bg-[#202C44]/70 text-[#7B8A90] hover:text-white"
              }`}
            >
              Seller Journey
            </button>
          </div>
        </div>
      </section>

      {/* 2. Vertical Timeline Walkthrough */}
      <section className="py-20 bg-[#000000] border-b border-[#202C44]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="space-y-12 relative before:absolute before:inset-0 before:left-8 md:before:left-1/2 before:-translate-x-1/2 before:h-full before:w-0.5 before:bg-[#202C44]">
            
            {/* STEP 1: Profile & Workspace Classification (Common to all) */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="relative flex flex-col md:flex-row items-center gap-8 group"
            >
              <div className="flex items-center md:w-1/2 md:justify-end">
                <div className="w-full bg-[#111317] border border-[#202C44] rounded-3xl p-6 sm:p-8 space-y-3 shadow-xl">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-mono font-bold text-[#D3CCB0] bg-[#202C44] px-2.5 py-1 rounded-md">
                      STEP 01
                    </span>
                    <UserCheck className="w-5 h-5 text-[#D3CCB0]" />
                  </div>
                  <h3 className="text-xl font-heading font-bold text-white">
                    Create Profile & Choose Your Workspace
                  </h3>
                  <p className="text-xs text-[#7B8A90] leading-relaxed">
                    Sign up with your email. You will be greeted by our <strong>Choose Your Workspace</strong> screen to pick <strong>Buyer Mode</strong> (explore codebases, UI kits) or <strong>Seller Mode</strong> (list assets, track earnings).
                  </p>
                </div>
              </div>

              {/* Timeline Center Node */}
              <div className="absolute left-8 md:left-1/2 -translate-x-1/2 w-10 h-10 rounded-full bg-[#202C44] border-4 border-[#000000] text-[#D3CCB0] font-mono font-bold text-xs flex items-center justify-center shadow-lg z-10">
                1
              </div>

              <div className="hidden md:block md:w-1/2 pl-8">
                <div className="text-xs font-mono text-[#7B8A90] bg-[#111317]/50 border border-[#202C44] p-4 rounded-2xl">
                  <span>Classification establishes your personalized home feed and tailored navigation bar.</span>
                </div>
              </div>
            </motion.div>

            {/* STEP 2 (BUYER PATH) */}
            {(activeTab === "both" || activeTab === "buyer") && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="relative flex flex-col md:flex-row items-center gap-8 group"
              >
                <div className="hidden md:block md:w-1/2 pr-8 text-right">
                  <span className="text-xs font-mono text-[#D3CCB0] bg-[#202C44] px-3 py-1 rounded-full border border-[#202C44]">
                    BUYER PATHWAY
                  </span>
                </div>

                {/* Timeline Center Node */}
                <div className="absolute left-8 md:left-1/2 -translate-x-1/2 w-10 h-10 rounded-full bg-[#D3CCB0] border-4 border-[#000000] text-[#000000] font-mono font-black text-xs flex items-center justify-center shadow-lg z-10">
                  2A
                </div>

                <div className="flex items-center md:w-1/2 pl-0 md:pl-8 w-full">
                  <div className="w-full bg-[#111317] border-2 border-[#D3CCB0]/40 rounded-3xl p-6 sm:p-8 space-y-4 shadow-xl">
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-mono font-bold text-[#000000] bg-[#D3CCB0] px-2.5 py-1 rounded-md">
                        FOR BUYERS
                      </span>
                      <Search className="w-5 h-5 text-[#D3CCB0]" />
                    </div>
                    <h3 className="text-xl font-heading font-bold text-white">
                      Browse, Pay via UPI & Download Instantly
                    </h3>
                    <p className="text-xs text-[#7B8A90] leading-relaxed">
                      1. Explore 239+ categories with verified source files.<br />
                      2. Pay the exact Rupee amount in 1 click using GPay, PhonePe, Paytm, or BHIM.<br />
                      3. Download the full ZIP archive instantly with your license key.
                    </p>
                    <div className="flex flex-wrap gap-1.5 pt-2">
                      <span className="text-[10px] font-mono bg-[#000000] text-[#D3CCB0] px-2 py-0.5 rounded border border-[#202C44]">Zero Declines</span>
                      <span className="text-[10px] font-mono bg-[#000000] text-emerald-400 px-2 py-0.5 rounded border border-[#202C44]">Instant Access</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* STEP 2 (SELLER PATH) */}
            {(activeTab === "both" || activeTab === "seller") && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="relative flex flex-col md:flex-row items-center gap-8 group"
              >
                <div className="flex items-center md:w-1/2 md:justify-end w-full">
                  <div className="w-full bg-[#111317] border-2 border-emerald-500/40 rounded-3xl p-6 sm:p-8 space-y-4 shadow-xl">
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-mono font-bold text-[#000000] bg-emerald-400 px-2.5 py-1 rounded-md">
                        FOR CREATORS
                      </span>
                      <UploadCloud className="w-5 h-5 text-emerald-400" />
                    </div>
                    <h3 className="text-xl font-heading font-bold text-white">
                      Upload ZIP, Pass Review & Get Paid 90%
                    </h3>
                    <p className="text-xs text-[#7B8A90] leading-relaxed">
                      1. Drag and drop your project ZIP, set your INR price, and pick tags.<br />
                      2. Automated syntax & malware scan completes in &lt;24 hours.<br />
                      3. Receive 90% payout automatically every Monday directly to your Indian bank / UPI.
                    </p>
                    <div className="flex flex-wrap gap-1.5 pt-2">
                      <span className="text-[10px] font-mono bg-[#000000] text-emerald-400 px-2 py-0.5 rounded border border-[#202C44]">90% Creator Split</span>
                      <span className="text-[10px] font-mono bg-[#000000] text-[#D3CCB0] px-2 py-0.5 rounded border border-[#202C44]">₹0 Listing Fee</span>
                    </div>
                  </div>
                </div>

                {/* Timeline Center Node */}
                <div className="absolute left-8 md:left-1/2 -translate-x-1/2 w-10 h-10 rounded-full bg-emerald-400 border-4 border-[#000000] text-[#000000] font-mono font-black text-xs flex items-center justify-center shadow-lg z-10">
                  2B
                </div>

                <div className="hidden md:block md:w-1/2 pl-8">
                  <span className="text-xs font-mono text-emerald-400 bg-emerald-950/60 px-3 py-1 rounded-full border border-emerald-800">
                    SELLER PATHWAY
                  </span>
                </div>
              </motion.div>
            )}

            {/* STEP 3: Lifetime Updates & Growth */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="relative flex flex-col md:flex-row items-center gap-8 group"
            >
              <div className="hidden md:block md:w-1/2 pr-8 text-right">
                <span className="text-xs font-mono text-[#7B8A90]">Continuous Value</span>
              </div>

              {/* Timeline Center Node */}
              <div className="absolute left-8 md:left-1/2 -translate-x-1/2 w-10 h-10 rounded-full bg-[#202C44] border-4 border-[#000000] text-[#D3CCB0] font-mono font-bold text-xs flex items-center justify-center shadow-lg z-10">
                3
              </div>

              <div className="flex items-center md:w-1/2 pl-0 md:pl-8 w-full">
                <div className="w-full bg-[#111317] border border-[#202C44] rounded-3xl p-6 sm:p-8 space-y-3 shadow-xl">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-mono font-bold text-[#D3CCB0] bg-[#202C44] px-2.5 py-1 rounded-md">
                      STEP 03
                    </span>
                    <Zap className="w-5 h-5 text-amber-400" />
                  </div>
                  <h3 className="text-xl font-heading font-bold text-white">
                    Lifetime Updates & Store Analytics
                  </h3>
                  <p className="text-xs text-[#7B8A90] leading-relaxed">
                    Buyers get free access to version updates published by creators. Sellers get detailed real-time telemetry on impressions, orders, and customer ratings.
                  </p>
                </div>
              </div>
            </motion.div>

          </div>

        </div>
      </section>

      {/* 3. Frequently Asked Questions */}
      <section className="py-20 bg-[#111317] border-b border-[#202C44]" id="faq">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          
          <div className="text-center space-y-3">
            <h2 className="text-2xl sm:text-3xl font-heading font-extrabold text-white tracking-tight">
              Frequently Asked Questions
            </h2>
            <p className="text-xs sm:text-sm text-[#7B8A90]">
              Everything you need to know about payments, licensing, and creator economics.
            </p>
          </div>

          <div className="space-y-3">
            {faqs.map((faq, index) => {
              const isOpen = openFaq === index;
              return (
                <div
                  key={index}
                  className="bg-[#000000] border border-[#202C44] rounded-2xl overflow-hidden transition-all"
                >
                  <button
                    type="button"
                    onClick={() => setOpenFaq(isOpen ? null : index)}
                    className="w-full px-6 py-4.5 text-left flex items-center justify-between gap-4 focus:outline-none"
                  >
                    <span className="font-heading font-bold text-sm text-white">
                      {faq.q}
                    </span>
                    <ChevronDown className={`w-4 h-4 text-[#D3CCB0] transition-transform duration-200 shrink-0 ${isOpen ? "rotate-180" : ""}`} />
                  </button>
                  {isOpen && (
                    <div className="px-6 pb-5 pt-1 text-xs text-[#7B8A90] leading-relaxed border-t border-[#202C44]/50">
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

        </div>
      </section>

      {/* 4. Action Banner */}
      <section className="py-20 bg-[#000000]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="bg-[#111317] border border-[#202C44] rounded-3xl p-8 sm:p-12 space-y-6 shadow-2xl">
            <h2 className="text-3xl font-heading font-black text-white">
              Ready to pick your workspace?
            </h2>
            <p className="text-xs sm:text-sm text-[#7B8A90] max-w-md mx-auto">
              Get started as a buyer or creator in seconds with instant UPI integration.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                to="/signup?role=buyer"
                className="w-full sm:w-auto bg-[#D3CCB0] hover:bg-[#c4bb9a] text-[#000000] font-heading font-black text-xs px-7 py-3.5 rounded-xl transition-all shadow-lg active:scale-95 flex items-center justify-center gap-2"
              >
                <span>Enter as Buyer</span>
                <ArrowRight className="w-4 h-4 text-[#000000]" />
              </Link>
              <Link
                to="/signup?role=seller"
                className="w-full sm:w-auto bg-[#202C44] hover:bg-[#202C44]/80 text-white font-heading font-bold text-xs px-7 py-3.5 rounded-xl border border-[#202C44] transition-all flex items-center justify-center gap-2"
              >
                <span>Enter as Creator</span>
                <ArrowRight className="w-4 h-4 text-emerald-400" />
              </Link>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
};

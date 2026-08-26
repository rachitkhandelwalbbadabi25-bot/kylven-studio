import React from "react";
import { Link } from "react-router-dom";
import { ArrowRight, CheckCircle2, ShoppingCart, Zap, IndianRupee, Sparkles, ShieldCheck, Wallet, Code2, Layers } from "lucide-react";
import { motion } from "motion/react";

export const DualPathSection: React.FC = () => {
  return (
    <section className="py-20 bg-[#000000] border-b border-[#202C44]" id="dual-paths-section">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-14 space-y-3">
          <div className="inline-flex items-center gap-2 bg-[#111317] border border-[#202C44] px-3.5 py-1.5 rounded-full text-xs font-mono font-bold text-[#D3CCB0]">
            <Layers className="w-3.5 h-3.5" />
            <span>THE CREATOR & BUILDER ECOSYSTEM</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-heading font-extrabold text-white tracking-tight">
            Built for both sides of the screen
          </h2>
          <p className="text-sm sm:text-base text-[#7B8A90] font-normal leading-relaxed">
            Whether you need to ship products at lightning speed or monetize your digital engineering craftsmanship, Kreate Studio removes every barrier.
          </p>
        </div>

        {/* Dual Cards Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          {/* Card 1: For Buyers */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="relative bg-[#111317] border border-[#202C44] hover:border-[#D3CCB0]/40 rounded-3xl p-8 sm:p-10 flex flex-col justify-between shadow-2xl transition-all group overflow-hidden"
          >
            {/* Subtle Gradient Accent */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-[#202C44]/30 rounded-full blur-3xl pointer-events-none group-hover:bg-[#D3CCB0]/10 transition-colors" />

            <div className="relative z-10 space-y-6">
              
              {/* Header Pill */}
              <div className="flex items-center justify-between">
                <div className="inline-flex items-center gap-2 bg-[#202C44] text-[#D3CCB0] text-xs font-mono font-bold px-3 py-1.5 rounded-xl border border-[#202C44]">
                  <ShoppingCart className="w-4 h-4" />
                  <span>FOR DEVELOPERS & DESIGNERS</span>
                </div>
                <span className="text-xs font-mono text-emerald-400 font-bold bg-emerald-950/40 border border-emerald-800/40 px-2.5 py-1 rounded-lg">
                  Instant UPI
                </span>
              </div>

              {/* Exact Copy Heading & Description */}
              <div className="space-y-3">
                <h3 className="text-2xl font-heading font-bold text-white group-hover:text-[#D3CCB0] transition-colors">
                  Accelerate your workflow.
                </h3>
                <p className="text-sm text-[#7B8A90] leading-relaxed">
                  Get verified Figma kits, Flutter templates, and AI notebooks. Pay instantly via UPI and start building in seconds.
                </p>
              </div>

              {/* Value Checkpoints */}
              <div className="space-y-3 pt-2 border-t border-[#202C44]/60">
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="w-4 h-4 text-[#D3CCB0] shrink-0 mt-0.5" />
                  <span className="text-xs text-white">
                    <strong className="text-white">Direct Rupee Pricing:</strong> Pay exact amounts with GPay, PhonePe, or BHIM. Zero card declines or FX markup.
                  </span>
                </div>

                <div className="flex items-start gap-3">
                  <CheckCircle2 className="w-4 h-4 text-[#D3CCB0] shrink-0 mt-0.5" />
                  <span className="text-xs text-white">
                    <strong className="text-white">Verified Code Quality:</strong> Every listing is manually reviewed for file integrity, dependencies, and clean code.
                  </span>
                </div>

                <div className="flex items-start gap-3">
                  <CheckCircle2 className="w-4 h-4 text-[#D3CCB0] shrink-0 mt-0.5" />
                  <span className="text-xs text-white">
                    <strong className="text-white">Commercial Licenses:</strong> Use bought source files freely across personal and high-traffic client projects.
                  </span>
                </div>
              </div>

            </div>

            {/* Bottom Action */}
            <div className="relative z-10 pt-8 mt-8 border-t border-[#202C44]/80">
              <Link
                to="/browse"
                className="inline-flex items-center justify-center gap-2 w-full sm:w-auto bg-[#D3CCB0] hover:bg-[#c4bb9a] text-[#000000] text-xs font-heading font-bold px-6 py-3.5 rounded-xl transition-all shadow active:scale-95"
              >
                <span>Explore Buyer Catalog</span>
                <ArrowRight className="w-4 h-4 text-[#000000]" />
              </Link>
            </div>
          </motion.div>

          {/* Card 2: For Sellers */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.15 }}
            className="relative bg-[#111317] border border-[#202C44] hover:border-[#D3CCB0]/40 rounded-3xl p-8 sm:p-10 flex flex-col justify-between shadow-2xl transition-all group overflow-hidden"
          >
            {/* Subtle Gradient Accent */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-[#202C44]/40 rounded-full blur-3xl pointer-events-none group-hover:bg-[#D3CCB0]/10 transition-colors" />

            <div className="relative z-10 space-y-6">
              
              {/* Header Pill */}
              <div className="flex items-center justify-between">
                <div className="inline-flex items-center gap-2 bg-[#202C44] text-[#D3CCB0] text-xs font-mono font-bold px-3 py-1.5 rounded-xl border border-[#202C44]">
                  <Code2 className="w-4 h-4" />
                  <span>FOR CREATORS & BUILDERS</span>
                </div>
                <span className="text-xs font-mono text-[#D3CCB0] font-bold bg-[#202C44] border border-[#202C44] px-2.5 py-1 rounded-lg">
                  90% Payout
                </span>
              </div>

              {/* Exact Copy Heading & Description */}
              <div className="space-y-3">
                <h3 className="text-2xl font-heading font-bold text-white group-hover:text-[#D3CCB0] transition-colors">
                  Turn your code into capital.
                </h3>
                <p className="text-sm text-[#7B8A90] leading-relaxed">
                  List your assets in minutes, keep 90% of every sale, and get direct bank payouts every Monday. No PayPal, no USD conversions.
                </p>
              </div>

              {/* Value Checkpoints */}
              <div className="space-y-3 pt-2 border-t border-[#202C44]/60">
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="w-4 h-4 text-[#D3CCB0] shrink-0 mt-0.5" />
                  <span className="text-xs text-white">
                    <strong className="text-white">90% Creator Revenue Split:</strong> The highest creator take-home in India. Keep 90% net of your listed price.
                  </span>
                </div>

                <div className="flex items-start gap-3">
                  <CheckCircle2 className="w-4 h-4 text-[#D3CCB0] shrink-0 mt-0.5" />
                  <span className="text-xs text-white">
                    <strong className="text-white">Direct Weekly Bank/UPI Payouts:</strong> Automated payouts straight to your UPI VPA or IFSC account every week.
                  </span>
                </div>

                <div className="flex items-start gap-3">
                  <CheckCircle2 className="w-4 h-4 text-[#D3CCB0] shrink-0 mt-0.5" />
                  <span className="text-xs text-white">
                    <strong className="text-white">₹0 Upfront Cost:</strong> Zero listing fees and zero monthly subscription. Publish unlimited digital assets.
                  </span>
                </div>
              </div>

            </div>

            {/* Bottom Action */}
            <div className="relative z-10 pt-8 mt-8 border-t border-[#202C44]/80">
              <Link
                to="/sell/new"
                className="inline-flex items-center justify-center gap-2 w-full sm:w-auto bg-[#202C44] hover:bg-[#202C44]/80 text-white text-xs font-heading font-bold px-6 py-3.5 rounded-xl border border-[#202C44] hover:border-[#D3CCB0]/60 transition-all shadow active:scale-95"
              >
                <span>Start Selling Today</span>
                <ArrowRight className="w-4 h-4 text-[#D3CCB0]" />
              </Link>
            </div>
          </motion.div>

        </div>

      </div>
    </section>
  );
};

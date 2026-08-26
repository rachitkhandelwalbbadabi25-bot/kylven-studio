import React from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Sparkles, ShieldCheck, Zap, IndianRupee, Users } from "lucide-react";
import { motion } from "motion/react";

export const BottomCTA: React.FC = () => {
  return (
    <section className="py-20 bg-[#000000] relative overflow-hidden" id="bottom-call-to-adventure">
      {/* Background Decorative Grids & Glow */}
      <div className="absolute inset-0 bg-[radial-gradient(#202C44_1px,transparent_1px)] [background-size:28px_28px] opacity-20 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Bold Navy Section Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="relative bg-[#111317] border border-[#202C44] rounded-3xl p-8 sm:p-14 lg:p-16 text-center shadow-2xl overflow-hidden"
        >
          {/* Ambient Lighting Background Accents */}
          <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-[36rem] h-72 bg-[#202C44]/70 blur-[100px] pointer-events-none" />
          <div className="absolute bottom-0 right-0 w-80 h-80 bg-[#D3CCB0]/5 blur-[90px] pointer-events-none" />

          <div className="max-w-3xl mx-auto space-y-6 relative z-10">
            
            {/* Pill Tag */}
            <div className="inline-flex items-center gap-2 bg-[#202C44] border border-[#202C44] px-4 py-1.5 rounded-full text-xs font-mono font-bold text-[#D3CCB0]">
              <Sparkles className="w-3.5 h-3.5" />
              <span>JOIN INDIA’S DIGITAL CREATIVE ECONOMY</span>
            </div>

            {/* Exact Required Heading */}
            <h2 className="text-3xl sm:text-5xl font-heading font-black text-white tracking-tight leading-[1.15]">
              Ready to build your <span className="text-[#D3CCB0]">next big thing</span>?
            </h2>

            {/* Supporting Subtext */}
            <p className="text-sm sm:text-base text-[#7B8A90] font-normal max-w-xl mx-auto leading-relaxed">
              Join 5,000+ Indian creators, engineers, and designers accelerating production with verified assets and 90% seller payouts.
            </p>

            {/* Exact Required Large Cream CTA Button & Secondary CTA */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
              <Link
                to="/browse"
                id="bottom-cta-get-started-btn"
                className="w-full sm:w-auto bg-[#D3CCB0] hover:bg-[#c4bb9a] text-[#000000] text-sm font-heading font-black px-8 py-4 rounded-xl transition-all shadow-xl hover:shadow-[#D3CCB0]/20 active:scale-95 flex items-center justify-center gap-2.5"
              >
                <span>Get Started for Free</span>
                <ArrowRight className="w-4 h-4 text-[#000000]" />
              </Link>

              <Link
                to="/sell/new"
                id="bottom-cta-sell-btn"
                className="w-full sm:w-auto bg-[#202C44] hover:bg-[#202C44]/80 text-white text-sm font-heading font-bold px-8 py-4 rounded-xl border border-[#202C44] hover:border-[#D3CCB0]/50 transition-all flex items-center justify-center gap-2"
              >
                <span>Start Selling (Keep 90%)</span>
              </Link>
            </div>

            {/* Trust Checklist Footer */}
            <div className="pt-8 mt-6 border-t border-[#202C44]/70 flex flex-wrap items-center justify-center gap-6 text-xs text-[#7B8A90]">
              <div className="flex items-center gap-1.5 text-white">
                <IndianRupee className="w-3.5 h-3.5 text-emerald-400" />
                <span>₹0 Listing Fees</span>
              </div>

              <div className="flex items-center gap-1.5 text-white">
                <Zap className="w-3.5 h-3.5 text-[#D3CCB0]" />
                <span>Instant UPI Checkout</span>
              </div>

              <div className="flex items-center gap-1.5 text-white">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                <span>100% Virus-Free Scanned</span>
              </div>
            </div>

          </div>
        </motion.div>

      </div>
    </section>
  );
};

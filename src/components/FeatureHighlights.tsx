import React from "react";
import { ShieldCheck, Zap, Percent, Smartphone, IndianRupee, CheckCircle2, Sparkles, Lock } from "lucide-react";
import { motion } from "motion/react";

export const FeatureHighlights: React.FC = () => {
  const features = [
    {
      icon: <Smartphone className="w-6 h-6 text-emerald-400" />,
      flag: "🇮🇳",
      title: "UPI Native",
      badge: "Zero Card Declines",
      description:
        "Built specifically for India. No credit card required, no international transaction failures. Pay directly via GPay, PhonePe, Paytm, or BHIM.",
    },
    {
      icon: <ShieldCheck className="w-6 h-6 text-[#D3CCB0]" />,
      flag: "🛡️",
      title: "Quality Verified",
      badge: "Manual Review",
      description:
        "Every single asset is manually reviewed by our team for code quality and virus safety before appearing in the marketplace.",
    },
    {
      icon: <Percent className="w-6 h-6 text-[#D3CCB0]" />,
      flag: "💰",
      title: "90% Creator Split",
      badge: "Fair Economics",
      description:
        "We believe creators should keep the lion's share. Only a flat 12.5% platform fee for buyers. No hidden charges or foreign exchange markups.",
    },
    {
      icon: <Zap className="w-6 h-6 text-amber-400" />,
      flag: "⚡",
      title: "Instant Delivery",
      badge: "Zero Delay",
      description:
        "No waiting for 'seller approval.' Your download link unlocks the millisecond your payment is confirmed with lifetime re-download access.",
    },
  ];

  return (
    <section className="py-20 bg-[#111317] border-b border-[#202C44]" id="feature-highlights-section">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-14 space-y-3">
          <div className="inline-flex items-center gap-2 bg-[#202C44] border border-[#202C44] px-3.5 py-1.5 rounded-full text-xs font-mono font-bold text-[#D3CCB0]">
            <Sparkles className="w-3.5 h-3.5" />
            <span>THE KREATE ADVANTAGE</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-heading font-extrabold text-white tracking-tight">
            Why Indian Creators Choose Kreate Studio
          </h2>
          <p className="text-sm sm:text-base text-[#7B8A90] font-normal leading-relaxed">
            We redesigned digital asset commerce from first principles to eliminate high global fees, PayPal delays, and currency friction.
          </p>
        </div>

        {/* 4 Feature Pillars Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((item, idx) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: idx * 0.1 }}
              className="bg-[#000000]/60 border border-[#202C44] hover:border-[#D3CCB0]/50 rounded-2xl p-6 flex flex-col justify-between shadow-xl transition-all group"
            >
              <div className="space-y-4">
                {/* Icon & Badge Row */}
                <div className="flex items-center justify-between">
                  <div className="w-12 h-12 rounded-xl bg-[#202C44] border border-[#202C44] flex items-center justify-center text-xl group-hover:scale-105 transition-transform">
                    {item.icon}
                  </div>
                  <span className="text-[11px] font-mono font-semibold text-[#D3CCB0] bg-[#202C44]/80 px-2.5 py-1 rounded-lg border border-[#202C44]">
                    {item.badge}
                  </span>
                </div>

                {/* Title with Emoji Flag */}
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-base">{item.flag}</span>
                    <h3 className="text-lg font-heading font-bold text-white group-hover:text-[#D3CCB0] transition-colors">
                      {item.title}
                    </h3>
                  </div>
                </div>

                {/* Exact Copy Description */}
                <p className="text-xs text-[#7B8A90] leading-relaxed">
                  {item.description}
                </p>
              </div>

              {/* Bottom Micro Indicator */}
              <div className="mt-6 pt-3 border-t border-[#202C44]/60 flex items-center gap-1.5 text-[11px] text-[#D3CCB0]">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span>Engineered for India</span>
              </div>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
};

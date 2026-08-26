import React from "react";
import { Search, IndianRupee, Download, Sparkles, CheckCircle2, ShieldCheck, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { motion } from "motion/react";

export const HowItWorks: React.FC = () => {
  const steps = [
    {
      number: "01",
      title: "Discover",
      description: "Browse 239+ categories of manually reviewed digital assets.",
      highlight: "Verified Code & Assets",
      icon: <Search className="w-5 h-5 text-[#D3CCB0]" />,
      badgeList: [".fig", ".dart", ".ipynb", ".blend", ".zip"],
    },
    {
      number: "02",
      title: "Instant UPI Pay",
      description: "Pay the exact Rupee price using GPay, PhonePe, or any UPI app.",
      highlight: "Zero FX / Zero Friction",
      icon: <IndianRupee className="w-5 h-5 text-emerald-400" />,
      badgeList: ["GPay", "PhonePe", "Paytm", "BHIM", "UPI QR"],
    },
    {
      number: "03",
      title: "Lifetime Access",
      description: "Download your source files instantly and get lifetime updates.",
      highlight: "Commercial License Included",
      icon: <Download className="w-5 h-5 text-[#D3CCB0]" />,
      badgeList: ["Instant Unlock", "Lifetime Updates", "Raw Files"],
    },
  ];

  return (
    <section className="py-20 bg-[#000000] border-b border-[#202C44]" id="how-it-works-section">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
          <div className="inline-flex items-center gap-2 bg-[#111317] border border-[#202C44] px-3.5 py-1.5 rounded-full text-xs font-mono font-bold text-[#D3CCB0]">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>THE 1-2-3 PROCESS</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-heading font-extrabold text-white tracking-tight">
            How Kreate Studio Works
          </h2>
          <p className="text-sm sm:text-base text-[#7B8A90] font-normal leading-relaxed">
            From search to production-ready code in less than 60 seconds.
          </p>
        </div>

        {/* Clean Numbered Horizontal Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
          
          {steps.map((step, index) => (
            <motion.div
              key={step.number}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: index * 0.15 }}
              className="relative bg-[#111317] border border-[#202C44] hover:border-[#D3CCB0]/40 rounded-3xl p-8 flex flex-col justify-between shadow-2xl transition-all group"
            >
              <div>
                {/* Step Number & Icon Header */}
                <div className="flex items-center justify-between mb-6">
                  <div className="w-12 h-12 rounded-2xl bg-[#202C44] border border-[#202C44] text-[#D3CCB0] font-heading font-black text-xl flex items-center justify-center group-hover:scale-105 transition-transform">
                    {step.number}
                  </div>
                  <div className="w-10 h-10 rounded-xl bg-[#000000] border border-[#202C44] flex items-center justify-center">
                    {step.icon}
                  </div>
                </div>

                {/* Title */}
                <h3 className="text-xl font-heading font-bold text-white mb-2 group-hover:text-[#D3CCB0] transition-colors">
                  {step.title}
                </h3>

                {/* Exact Copy Description */}
                <p className="text-xs sm:text-sm text-[#7B8A90] leading-relaxed mb-6">
                  {step.description}
                </p>
              </div>

              {/* Tags / Highlight Row */}
              <div className="pt-4 border-t border-[#202C44]/60 space-y-3">
                <div className="flex items-center gap-1.5 text-[11px] font-medium text-emerald-400">
                  <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                  <span>{step.highlight}</span>
                </div>

                <div className="flex flex-wrap gap-1.5">
                  {step.badgeList.map((badge) => (
                    <span
                      key={badge}
                      className="text-[10px] font-mono bg-[#000000] text-[#7B8A90] px-2 py-0.5 rounded border border-[#202C44]"
                    >
                      {badge}
                    </span>
                  ))}
                </div>
              </div>
            </motion.div>
          ))}

        </div>

        {/* Action Link below */}
        <div className="mt-12 text-center">
          <Link
            to="/browse"
            className="inline-flex items-center gap-2 text-xs font-mono font-bold text-[#D3CCB0] hover:text-white transition-colors"
          >
            <span>Browse 239+ Categories Now</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

      </div>
    </section>
  );
};

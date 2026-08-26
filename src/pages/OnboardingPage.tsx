import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { UserProfile, UserRole } from "../types";
import {
  ShoppingBag,
  Store,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  Zap,
  Percent,
  IndianRupee,
  ShieldCheck,
  Code2,
  Palette,
  Layers,
  ChevronRight
} from "lucide-react";
import { motion } from "motion/react";

interface OnboardingPageProps {
  userProfile: UserProfile;
  onSelectRole: (role: UserRole) => void;
}

export const OnboardingPage: React.FC<OnboardingPageProps> = ({
  userProfile,
  onSelectRole,
}) => {
  const navigate = useNavigate();
  const [selectedRole, setSelectedRole] = useState<UserRole>(userProfile?.role === "seller" ? "seller" : "buyer");
  const [isProcessing, setIsProcessing] = useState(false);

  const handleConfirm = (roleToSet: UserRole) => {
    setIsProcessing(true);
    onSelectRole(roleToSet);

    setTimeout(() => {
      if (roleToSet === "seller") {
        navigate("/dashboard");
      } else {
        navigate("/browse");
      }
    }, 400);
  };

  return (
    <div className="min-h-screen bg-[#000000] text-white flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden" id="onboarding-page-root">
      {/* Ambient background glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[44rem] h-80 bg-[#202C44]/50 blur-[130px] pointer-events-none" />

      <div className="max-w-4xl w-full mx-auto relative z-10 space-y-10">
        
        {/* Header Title */}
        <div className="text-center space-y-3">
          <div className="inline-flex items-center gap-2 bg-[#111317] border border-[#202C44] px-4 py-1.5 rounded-full text-xs font-mono font-bold text-[#D3CCB0]">
            <Sparkles className="w-3.5 h-3.5" />
            <span>ACCOUNT CLASSIFICATION</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-heading font-black text-white tracking-tight">
            Choose Your Workspace
          </h1>

          <p className="text-sm sm:text-base text-[#7B8A90] max-w-xl mx-auto leading-relaxed">
            Welcome, <span className="text-white font-medium">{userProfile?.name || "Creator"}</span>! Select how you want to use Kreate Studio today. You can always switch between modes later with 1-click.
          </p>
        </div>

        {/* Two Big Options: Option A (Buyer) & Option B (Seller) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* OPTION A: Enter as a Buyer */}
          <motion.div
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
            onClick={() => setSelectedRole("buyer")}
            id="workspace-option-buyer"
            className={`cursor-pointer rounded-3xl p-8 border-2 transition-all flex flex-col justify-between shadow-2xl relative ${
              selectedRole === "buyer"
                ? "bg-[#111317] border-[#D3CCB0] ring-1 ring-[#D3CCB0]"
                : "bg-[#111317]/60 border-[#202C44] hover:border-[#202C44]/80 opacity-85 hover:opacity-100"
            }`}
          >
            {/* Top Selection Radio Indicator */}
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="w-14 h-14 rounded-2xl bg-[#202C44] border border-[#202C44] text-[#D3CCB0] flex items-center justify-center text-2xl shadow">
                  <ShoppingBag className="w-7 h-7" />
                </div>

                <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${
                  selectedRole === "buyer"
                    ? "border-[#D3CCB0] bg-[#D3CCB0]"
                    : "border-[#202C44] bg-[#000000]"
                }`}>
                  {selectedRole === "buyer" && (
                    <div className="w-2.5 h-2.5 rounded-full bg-[#000000]" />
                  )}
                </div>
              </div>

              <div>
                <span className="text-[11px] font-mono font-bold text-[#D3CCB0] tracking-wider uppercase block mb-1">
                  OPTION A
                </span>
                <h2 className="text-2xl font-heading font-black text-white mb-2">
                  Enter as a Buyer
                </h2>
                <p className="text-xs sm:text-sm text-[#7B8A90] leading-relaxed">
                  "I'm here to browse and buy assets for my projects."
                </p>
              </div>

              {/* Feature Checklist */}
              <div className="space-y-3 pt-4 border-t border-[#202C44]">
                <div className="flex items-center gap-2.5 text-xs text-[#7B8A90]">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span className="text-white font-medium">Instant UPI payments via GPay, PhonePe, Paytm</span>
                </div>
                <div className="flex items-center gap-2.5 text-xs text-[#7B8A90]">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span className="text-white font-medium">Access 239+ categories of verified source files</span>
                </div>
                <div className="flex items-center gap-2.5 text-xs text-[#7B8A90]">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span className="text-white font-medium">Instant file delivery with commercial license</span>
                </div>
              </div>
            </div>

            {/* Launch Button */}
            <div className="pt-8">
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  handleConfirm("buyer");
                }}
                disabled={isProcessing}
                id="btn-confirm-buyer"
                className={`w-full py-3.5 px-6 rounded-xl font-heading font-bold text-xs transition-all flex items-center justify-center gap-2 ${
                  selectedRole === "buyer"
                    ? "bg-[#D3CCB0] text-[#000000] shadow-lg"
                    : "bg-[#202C44] text-white hover:bg-[#202C44]/80"
                }`}
              >
                <span>Launch Buyer Marketplace</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </motion.div>

          {/* OPTION B: Enter as a Seller */}
          <motion.div
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
            onClick={() => setSelectedRole("seller")}
            id="workspace-option-seller"
            className={`cursor-pointer rounded-3xl p-8 border-2 transition-all flex flex-col justify-between shadow-2xl relative ${
              selectedRole === "seller"
                ? "bg-[#111317] border-emerald-400 ring-1 ring-emerald-400"
                : "bg-[#111317]/60 border-[#202C44] hover:border-[#202C44]/80 opacity-85 hover:opacity-100"
            }`}
          >
            {/* Top Selection Radio Indicator */}
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="w-14 h-14 rounded-2xl bg-emerald-950/60 border border-emerald-800 text-emerald-400 flex items-center justify-center text-2xl shadow">
                  <Store className="w-7 h-7" />
                </div>

                <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${
                  selectedRole === "seller"
                    ? "border-emerald-400 bg-emerald-400"
                    : "border-[#202C44] bg-[#000000]"
                }`}>
                  {selectedRole === "seller" && (
                    <div className="w-2.5 h-2.5 rounded-full bg-[#000000]" />
                  )}
                </div>
              </div>

              <div>
                <span className="text-[11px] font-mono font-bold text-emerald-400 tracking-wider uppercase block mb-1">
                  OPTION B
                </span>
                <h2 className="text-2xl font-heading font-black text-white mb-2">
                  Enter as a Seller
                </h2>
                <p className="text-xs sm:text-sm text-[#7B8A90] leading-relaxed">
                  "I'm here to list my products and manage my earnings."
                </p>
              </div>

              {/* Feature Checklist */}
              <div className="space-y-3 pt-4 border-t border-[#202C44]">
                <div className="flex items-center gap-2.5 text-xs text-[#7B8A90]">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span className="text-white font-medium">Industry-leading 90% creator revenue split</span>
                </div>
                <div className="flex items-center gap-2.5 text-xs text-[#7B8A90]">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span className="text-white font-medium">₹0 listing fees with direct weekly UPI bank payout</span>
                </div>
                <div className="flex items-center gap-2.5 text-xs text-[#7B8A90]">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span className="text-white font-medium">Real-time sales analytics and creator dashboard</span>
                </div>
              </div>
            </div>

            {/* Launch Button */}
            <div className="pt-8">
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  handleConfirm("seller");
                }}
                disabled={isProcessing}
                id="btn-confirm-seller"
                className={`w-full py-3.5 px-6 rounded-xl font-heading font-bold text-xs transition-all flex items-center justify-center gap-2 ${
                  selectedRole === "seller"
                    ? "bg-emerald-400 text-[#000000] shadow-lg"
                    : "bg-[#202C44] text-white hover:bg-[#202C44]/80"
                }`}
              >
                <span>Launch Creator Studio</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </motion.div>

        </div>

        {/* Bottom Helper Note */}
        <div className="text-center text-xs text-[#7B8A90]">
          <span>Need help deciding? You can toggle between <strong>Buyer Mode</strong> and <strong>Seller Mode</strong> anytime from your top navigation bar.</span>
        </div>

      </div>
    </div>
  );
};

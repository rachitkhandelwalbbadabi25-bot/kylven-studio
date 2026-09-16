import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { UserProfile, UserRole } from "../types";
import {
  ArrowLeft,
  Store,
  UploadCloud,
  Banknote,
  TrendingUp,
  AlertTriangle,
  Check,
  CheckCircle2,
  Sparkles,
  ShieldCheck,
  Zap,
  Info,
  ArrowRight,
  ExternalLink
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface UpgradeToSellerPageProps {
  userProfile: UserProfile;
  onUpgradeToSeller: (upiId: string, redirectTo?: string) => void;
}

export const UpgradeToSellerPage: React.FC<UpgradeToSellerPageProps> = ({
  userProfile,
  onUpgradeToSeller,
}) => {
  const navigate = useNavigate();

  // Form State
  const [upiId, setUpiId] = useState(userProfile.upiId || "");
  const [agreedToPolicy, setAgreedToPolicy] = useState(false);
  const [showPolicyModal, setShowPolicyModal] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  // Quick UPI ID validation
  const validateUpi = (val: string): boolean => {
    const trimmed = val.trim();
    // Basic UPI ID format: username@bank / handle@vpa
    return /^[a-zA-Z0-9.\-_]{2,64}@[a-zA-Z0-9.\-_]{2,64}$/.test(trimmed);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const cleanUpi = upiId.trim();

    if (!cleanUpi) {
      setError("Please enter your UPI ID to receive direct payouts.");
      return;
    }

    if (!validateUpi(cleanUpi)) {
      setError("Please enter a valid UPI ID format (e.g., yourname@okhdfcbank or 9876543210@paytm).");
      return;
    }

    if (!agreedToPolicy) {
      setError("You must agree to the Seller Policy to start publishing assets.");
      return;
    }

    setIsSubmitting(true);

    // Simulate short transition animation
    setTimeout(() => {
      onUpgradeToSeller(cleanUpi, "/sell/new");
      setIsSubmitting(false);
      setIsSuccess(true);

      // Smooth redirect to Upload Asset screen after success feedback
      setTimeout(() => {
        navigate("/sell/new");
      }, 1200);
    }, 600);
  };

  const handleBack = () => {
    if (window.history.length > 2) {
      navigate(-1);
    } else {
      navigate("/browse");
    }
  };

  return (
    <div
      className="min-h-screen bg-[#000000] text-white flex flex-col selection:bg-[#202C44] selection:text-[#D3CCB0]"
      id="upgrade-to-seller-root"
    >
      {/* =========================================================
          1. HEADER
          - Back arrow button on the top left
          - Title "Upload Asset" in the center
         ========================================================= */}
      <header
        className="sticky top-0 z-30 bg-[#000000]/95 backdrop-blur-md border-b border-[#202C44]"
        id="upgrade-screen-header"
      >
        <div className="max-w-2xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between relative">
          
          {/* Back Arrow Button */}
          <button
            type="button"
            id="upgrade-back-button"
            onClick={handleBack}
            className="flex items-center gap-2 p-2 -ml-2 rounded-xl text-[#7B8A90] hover:text-white hover:bg-[#202C44]/60 border border-transparent hover:border-[#202C44] transition-all cursor-pointer"
            aria-label="Back to previous page"
            title="Back"
          >
            <ArrowLeft className="w-5 h-5 stroke-[2.2]" />
            <span className="hidden sm:inline text-xs font-mono font-medium">Back</span>
          </button>

          {/* Title in Center */}
          <div className="absolute left-1/2 -translate-x-1/2 text-center">
            <h1 className="font-heading font-bold text-base sm:text-lg text-white tracking-tight">
              Upload Asset
            </h1>
          </div>

          {/* Right Spacer for balanced centering */}
          <div className="w-10 sm:w-16 flex justify-end">
            <span className="text-[10px] font-mono text-[#D3CCB0] bg-[#202C44] px-2 py-0.5 rounded-full border border-[#202C44]">
              Step 1/2
            </span>
          </div>
        </div>
      </header>

      {/* =========================================================
          MAIN CONTAINER (Mobile-First Centered Card Layout)
         ========================================================= */}
      <main className="flex-1 max-w-xl mx-auto w-full px-4 sm:px-6 py-8 sm:py-12 flex flex-col justify-center">
        
        {isSuccess ? (
          /* Success Screen Animation */
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-[#111317] border border-emerald-500/40 rounded-3xl p-8 sm:p-10 text-center space-y-6 shadow-2xl"
          >
            <div className="w-20 h-20 rounded-3xl bg-emerald-950/80 border border-emerald-500/60 flex items-center justify-center mx-auto text-emerald-400 shadow-[0_0_30px_rgba(16,185,129,0.2)]">
              <CheckCircle2 className="w-10 h-10 stroke-[2.5]" />
            </div>

            <div className="space-y-2">
              <h2 className="text-2xl font-heading font-black text-white">
                Seller Account Activated!
              </h2>
              <p className="text-sm text-[#7B8A90] max-w-sm mx-auto leading-relaxed">
                Your UPI ID <span className="font-mono text-emerald-400 font-bold">{upiId}</span> has been linked. You can now publish assets and receive direct payouts.
              </p>
            </div>

            <div className="pt-2 flex items-center justify-center gap-2 text-xs font-mono text-emerald-400">
              <Sparkles className="w-4 h-4 animate-spin" />
              <span>Redirecting to Upload Asset Studio…</span>
            </div>
          </motion.div>
        ) : (
          <div className="space-y-8">
            
            {/* =========================================================
                2. TOP VISUAL & HEADLINE
                - Storefront icon in dark navy square
                - Headline: "Want to sell your creative assets?"
                - Subheadline: "Upgrade to a Seller account..."
               ========================================================= */}
            <div className="text-center space-y-4" id="upgrade-hero-visual">
              
              {/* Storefront icon in dark navy square */}
              <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-3xl bg-[#111317] border border-[#202C44] flex items-center justify-center mx-auto text-[#D3CCB0] shadow-2xl relative group">
                <div className="absolute inset-0 bg-[#202C44]/20 rounded-3xl blur-md -z-10 group-hover:bg-[#D3CCB0]/10 transition-all" />
                <Store className="w-10 h-10 sm:w-12 sm:h-12 stroke-[1.8] text-[#D3CCB0]" />
              </div>

              <div className="space-y-2 max-w-md mx-auto">
                <h2 className="text-2xl sm:text-3xl font-heading font-black text-white tracking-tight leading-tight">
                  Want to sell your creative assets?
                </h2>
                <p className="text-xs sm:text-sm text-[#7B8A90] leading-relaxed">
                  Upgrade to a Seller account to publish assets and earn — buyers pay you directly via UPI.
                </p>
              </div>
            </div>

            {/* =========================================================
                3. VALUE PROPOSITION CARDS (3 Dark-Blue Cards)
                - Card 1: Publish unlimited creative assets (Upload/Cloud icon)
                - Card 2: Get paid directly to your UPI (Money/Bill icon)
                - Card 3: Reach creators across India (Trend/Growth icon)
               ========================================================= */}
            <div className="space-y-3" id="upgrade-value-props">
              
              {/* Card 1: Publish unlimited creative assets */}
              <div className="p-4 rounded-2xl bg-[#111317] border border-[#202C44] flex items-center gap-4 transition-all hover:border-[#202C44]/90">
                <div className="w-11 h-11 rounded-xl bg-[#202C44] border border-[#202C44] flex items-center justify-center shrink-0 text-[#D3CCB0]">
                  <UploadCloud className="w-5 h-5 stroke-[2]" />
                </div>
                <div>
                  <h3 className="font-heading font-bold text-sm text-white">
                    Publish unlimited creative assets
                  </h3>
                  <p className="text-xs text-[#7B8A90] mt-0.5 leading-snug">
                    List Figma kits, Flutter code, Blender 3D, notebooks, and LUTs with ₹0 listing fees.
                  </p>
                </div>
              </div>

              {/* Card 2: Get paid directly to your UPI */}
              <div className="p-4 rounded-2xl bg-[#111317] border border-[#202C44] flex items-center gap-4 transition-all hover:border-[#202C44]/90">
                <div className="w-11 h-11 rounded-xl bg-[#202C44] border border-[#202C44] flex items-center justify-center shrink-0 text-emerald-400">
                  <Banknote className="w-5 h-5 stroke-[2]" />
                </div>
                <div>
                  <h3 className="font-heading font-bold text-sm text-white">
                    Get paid directly to your UPI
                  </h3>
                  <p className="text-xs text-[#7B8A90] mt-0.5 leading-snug">
                    Enjoy a 90% seller revenue split paid directly to your GPay, PhonePe, or Paytm VPA.
                  </p>
                </div>
              </div>

              {/* Card 3: Reach buyers across India */}
              <div className="p-4 rounded-2xl bg-[#111317] border border-[#202C44] flex items-center gap-4 transition-all hover:border-[#202C44]/90">
                <div className="w-11 h-11 rounded-xl bg-[#202C44] border border-[#202C44] flex items-center justify-center shrink-0 text-[#D3CCB0]">
                  <TrendingUp className="w-5 h-5 stroke-[2]" />
                </div>
                <div>
                  <h3 className="font-heading font-bold text-sm text-white">
                    Reach buyers across India
                  </h3>
                  <p className="text-xs text-[#7B8A90] mt-0.5 leading-snug">
                    Get discovered by tens of thousands of active builders, startup teams, and designers.
                  </p>
                </div>
              </div>

            </div>

            {/* =========================================================
                4. SELLER SETUP FORM
                - Input: "Your UPI ID"
                - Caption: "Buyers will pay directly to this UPI."
                - Warning Box: "⚠️ Please ensure your UPI ID is correct..."
                - Checkbox: "I agree to the Seller Policy"
                - Primary Button: Cream "Upgrade to Seller" button
               ========================================================= */}
            <form onSubmit={handleSubmit} className="space-y-5" id="upgrade-seller-form">
              
              {/* Error Banner if any */}
              {error && (
                <div
                  className="p-3.5 rounded-2xl bg-red-950/40 border border-red-500/50 text-red-200 text-xs flex items-start gap-2.5 animate-in fade-in"
                  id="upgrade-error-banner"
                >
                  <AlertTriangle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
                  <span>{error}</span>
                </div>
              )}

              {/* Input: Your UPI ID */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label
                    htmlFor="upi-id-input"
                    className="block text-xs font-mono uppercase font-bold text-[#7B8A90] tracking-wider"
                  >
                    Your UPI ID <span className="text-red-400">*</span>
                  </label>
                  <span className="text-[11px] font-mono text-emerald-400">90% Payout</span>
                </div>

                <div className="relative">
                  <input
                    id="upi-id-input"
                    type="text"
                    required
                    value={upiId}
                    onChange={(e) => {
                      setUpiId(e.target.value);
                      if (error) setError(null);
                    }}
                    placeholder="yourname@upi or 9876543210@okhdfcbank"
                    className="w-full bg-[#111317] border border-[#202C44] text-white text-sm px-4 py-3.5 rounded-2xl focus:outline-none focus:border-[#D3CCB0] focus:ring-1 focus:ring-[#D3CCB0] placeholder:text-[#7B8A90]/60 font-mono transition-all"
                  />
                </div>

                {/* Caption */}
                <p className="text-[11px] text-[#7B8A90] pl-1">
                  Buyers will pay directly to this UPI.
                </p>
              </div>

              {/* Warning Box */}
              <div
                className="p-4 rounded-2xl bg-amber-950/30 border border-amber-500/40 text-amber-200 text-xs sm:text-[13px] leading-relaxed flex items-start gap-3 shadow-inner"
                id="upi-warning-box"
              >
                <span className="text-base select-none shrink-0 mt-0.5">⚠️</span>
                <div>
                  <p className="font-semibold text-amber-300 mb-0.5">Important Payout Verification</p>
                  <p className="text-amber-200/90 text-xs leading-normal">
                    Please ensure your UPI ID is correct. Incorrect UPI ID will result in failed payments and you won&apos;t receive money from your sales.
                  </p>
                </div>
              </div>

              {/* Mandatory Checkbox: Seller Policy */}
              <div className="pt-1">
                <label
                  htmlFor="seller-policy-checkbox"
                  className="flex items-start gap-3 p-3 rounded-2xl bg-[#111317]/60 border border-[#202C44] hover:border-[#202C44]/80 cursor-pointer select-none transition-all group"
                >
                  <div className="relative flex items-center justify-center shrink-0 mt-0.5">
                    <input
                      id="seller-policy-checkbox"
                      type="checkbox"
                      checked={agreedToPolicy}
                      onChange={(e) => {
                        setAgreedToPolicy(e.target.checked);
                        if (error) setError(null);
                      }}
                      className="sr-only"
                    />
                    <div
                      className={`w-5 h-5 rounded-lg border flex items-center justify-center transition-all ${
                        agreedToPolicy
                          ? "bg-[#D3CCB0] border-[#D3CCB0] text-[#000000]"
                          : "bg-[#000000] border-[#202C44] group-hover:border-[#D3CCB0]/60"
                      }`}
                    >
                      {agreedToPolicy && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                    </div>
                  </div>

                  <div className="text-xs text-slate-300 leading-snug">
                    <span>I agree to the </span>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setShowPolicyModal(true);
                      }}
                      className="text-[#D3CCB0] underline underline-offset-2 hover:text-white font-medium inline-flex items-center gap-0.5 cursor-pointer"
                    >
                      Seller Policy
                      <ExternalLink className="w-2.5 h-2.5 inline" />
                    </button>
                    <span> and acknowledge that I own the distribution rights to all uploaded digital assets.</span>
                  </div>
                </label>
              </div>

              {/* Primary Action Button: Large Cream Button */}
              <div className="pt-2">
                <button
                  type="submit"
                  id="upgrade-submit-button"
                  disabled={isSubmitting}
                  className={`w-full py-4 px-6 rounded-2xl font-heading font-black text-sm sm:text-base text-[#000000] transition-all flex items-center justify-center gap-2 cursor-pointer shadow-xl ${
                    isSubmitting
                      ? "bg-[#D3CCB0]/70 cursor-wait opacity-80"
                      : "bg-[#D3CCB0] hover:bg-[#c4bb9a] hover:shadow-[0_0_25px_rgba(211,204,176,0.3)] active:scale-[0.99]"
                  }`}
                >
                  {isSubmitting ? (
                    <>
                      <Sparkles className="w-4 h-4 animate-spin text-[#000000]" />
                      <span>Upgrading to Seller…</span>
                    </>
                  ) : (
                    <>
                      <span>Upgrade to Seller</span>
                      <ArrowRight className="w-4 h-4 stroke-[2.5]" />
                    </>
                  )}
                </button>

                {/* Safe Guard & Library Guarantee Note */}
                <p className="text-center text-[11px] text-[#7B8A90] mt-3 font-sans">
                  🔒 Your existing buyer purchases and saved library remain 100% intact.
                </p>
              </div>

            </form>

          </div>
        )}

      </main>

      {/* =========================================================
          SELLER POLICY MODAL
         ========================================================= */}
      <AnimatePresence>
        {showPolicyModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div
              className="fixed inset-0 bg-[#000000]/80 backdrop-blur-sm"
              onClick={() => setShowPolicyModal(false)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative w-full max-w-lg bg-[#111317] border border-[#202C44] rounded-3xl p-6 space-y-5 shadow-2xl z-10 max-h-[85vh] overflow-y-auto"
            >
              <div className="flex items-center justify-between border-b border-[#202C44] pb-4">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-[#202C44] flex items-center justify-center text-[#D3CCB0]">
                    <ShieldCheck className="w-4 h-4" />
                  </div>
                  <h3 className="font-heading font-bold text-white text-base">
                    Kreate Studio Seller Policy
                  </h3>
                </div>
                <button
                  type="button"
                  onClick={() => setShowPolicyModal(false)}
                  className="p-1.5 rounded-lg text-[#7B8A90] hover:text-white bg-[#202C44]/40"
                >
                  ✕
                </button>
              </div>

              <div className="space-y-4 text-xs text-[#7B8A90] leading-relaxed">
                <div className="p-3 rounded-xl bg-[#202C44]/30 border border-[#202C44] space-y-1">
                  <p className="font-bold text-white">1. 90% Seller Revenue Guarantee</p>
                  <p>Sellers retain 90% of listed price for every sale. The 10% platform fee covers platform maintenance and secure cloud delivery bandwidth.</p>
                </div>

                <div className="p-3 rounded-xl bg-[#202C44]/30 border border-[#202C44] space-y-1">
                  <p className="font-bold text-white">2. Direct UPI Payouts</p>
                  <p>Settlements are routed directly to your submitted UPI ID. Sellers are responsible for keeping their VPA accurate and functional.</p>
                </div>

                <div className="p-3 rounded-xl bg-[#202C44]/30 border border-[#202C44] space-y-1">
                  <p className="font-bold text-white">3. Original Work & Licensing</p>
                  <p>You warrant that you own or possess valid commercial distribution rights to all uploaded kits, codebases, 3D models, and design assets.</p>
                </div>

                <div className="p-3 rounded-xl bg-[#202C44]/30 border border-[#202C44] space-y-1">
                  <p className="font-bold text-white">4. Zero Malware & Clean Code Guarantee</p>
                  <p>Every asset must pass automated virus scanning and manual syntax validation before going live on the marketplace feed.</p>
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setAgreedToPolicy(true);
                    setShowPolicyModal(false);
                  }}
                  className="w-full py-3 rounded-xl bg-[#D3CCB0] text-[#000000] font-heading font-bold text-xs hover:bg-[#c4bb9a] transition-all"
                >
                  I Understand & Agree to Policy
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
};

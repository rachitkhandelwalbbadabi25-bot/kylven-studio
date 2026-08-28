import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation, useSearchParams } from "react-router-dom";
import {
  Sparkles,
  ArrowRight,
  Code2,
  Palette,
  BrainCircuit,
  Box,
  Video,
  IndianRupee,
  ShieldCheck,
  Zap,
  Percent,
  Smartphone,
  CheckCircle2,
  Layers,
  ArrowUpRight,
  Download,
  Lock,
  Flame,
  Check,
  Star,
  Users,
  X,
  LogOut
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface IntroLandingPageProps {
  onGetStarted: (intent?: "buyer" | "seller") => void;
}

export const IntroLandingPage: React.FC<IntroLandingPageProps> = ({ onGetStarted }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams, setSearchParams] = useSearchParams();
  const [showSignedOutToast, setShowSignedOutToast] = useState(
    searchParams.get("signedOut") === "true" || location.state?.signedOut === true
  );

  useEffect(() => {
    if (showSignedOutToast) {
      const timer = setTimeout(() => {
        setShowSignedOutToast(false);
        if (searchParams.get("signedOut")) {
          searchParams.delete("signedOut");
          setSearchParams(searchParams, { replace: true });
        }
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [showSignedOutToast, searchParams, setSearchParams]);

  const handleStartBuyer = () => {
    navigate("/signup?role=buyer");
  };

  const handleStartSeller = () => {
    navigate("/signup?role=seller");
  };

  const features = [
    {
      icon: <Smartphone className="w-6 h-6 text-emerald-400" />,
      flag: "🇮🇳",
      title: "UPI Native Payments",
      badge: "Zero Declines",
      description:
        "Built specifically for India. No credit card required, no international transaction failures. Pay directly via GPay, PhonePe, Paytm, or BHIM.",
    },
    {
      icon: <ShieldCheck className="w-6 h-6 text-[#D3CCB0]" />,
      flag: "🛡️",
      title: "Quality Verified",
      badge: "Manual Review",
      description:
        "Every single asset is manually reviewed by our engineering team for code cleanliness, syntax validity, and virus safety before appearing.",
    },
    {
      icon: <Percent className="w-6 h-6 text-amber-400" />,
      flag: "💰",
      title: "90% Creator Split",
      badge: "Fair Economics",
      description:
        "We believe creators should keep the lion's share. Direct weekly UPI settlements to Indian bank accounts with ₹0 listing fees.",
    },
    {
      icon: <Zap className="w-6 h-6 text-[#D3CCB0]" />,
      flag: "⚡",
      title: "Instant Delivery",
      badge: "Zero Delay",
      description:
        "No waiting for manual seller approval. Your download link unlocks the millisecond your UPI payment is confirmed, with lifetime updates.",
    },
  ];

  const popularFormats = [
    { ext: ".fig", name: "Figma UI Kits", color: "text-purple-400" },
    { ext: ".dart", name: "Flutter Apps", color: "text-sky-400" },
    { ext: ".ipynb", name: "AI/ML Notebooks", color: "text-amber-400" },
    { ext: ".blend", name: "Blender 3D", color: "text-orange-400" },
    { ext: ".cube", name: "Color LUTs", color: "text-emerald-400" },
    { ext: ".notion", name: "Notion Systems", color: "text-[#D3CCB0]" },
  ];

  return (
    <div className="min-h-screen bg-[#000000] text-white selection:bg-[#202C44] selection:text-[#D3CCB0] relative" id="intro-landing-root">
      
      {/* Sign Out Confirmation Toast */}
      <AnimatePresence>
        {showSignedOutToast && (
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.96 }}
            transition={{ duration: 0.25 }}
            id="signed-out-toast"
            className="fixed top-20 left-1/2 -translate-x-1/2 z-50 max-w-md w-[calc(100%-2rem)] bg-[#111317] border border-emerald-900/80 shadow-[0_10px_40px_rgba(0,0,0,0.8)] rounded-2xl p-4 flex items-start gap-3.5 backdrop-blur-md"
          >
            <div className="w-8 h-8 rounded-xl bg-emerald-950/80 border border-emerald-800 flex items-center justify-center shrink-0 text-emerald-400">
              <LogOut className="w-4 h-4" />
            </div>
            <div className="flex-1 min-w-0 pr-2">
              <h4 className="text-xs font-heading font-bold text-white flex items-center gap-1.5">
                <span>You have been signed out</span>
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 inline-block"></span>
              </h4>
              <p className="text-[11px] text-[#7B8A90] mt-0.5 leading-relaxed">
                Your session tokens and cache have been securely cleared. All marketplace and studio access is locked.
              </p>
            </div>
            <button
              type="button"
              onClick={() => {
                setShowSignedOutToast(false);
                if (searchParams.get("signedOut")) {
                  searchParams.delete("signedOut");
                  setSearchParams(searchParams, { replace: true });
                }
              }}
              className="text-[#7B8A90] hover:text-white p-1 rounded-lg hover:bg-[#202C44]/60 transition-colors shrink-0 cursor-pointer"
              aria-label="Close notification"
            >
              <X className="w-4 h-4" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 1. HERO SECTION (Massive Headline + Subtext) */}
      <section className="relative pt-20 pb-20 md:pt-28 md:pb-28 overflow-hidden border-b border-[#202C44]" id="intro-hero">
        {/* Subtle Ambient Background Gradients */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[42rem] h-[22rem] bg-[#202C44]/40 blur-[130px] pointer-events-none" />
        <div className="absolute top-1/3 right-10 w-72 h-72 bg-[#D3CCB0]/5 blur-[100px] pointer-events-none" />
        <div className="absolute inset-0 bg-[radial-gradient(#202C44_1px,transparent_1px)] [background-size:32px_32px] opacity-20 pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          
          <div className="max-w-4xl mx-auto text-center space-y-6">
            
            {/* Pill Tag */}
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="inline-flex items-center gap-2 bg-[#111317] border border-[#202C44] px-4 py-1.5 rounded-full text-xs font-mono font-bold text-[#D3CCB0]"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>INDIA’S DEDICATED DIGITAL ASSET MARKETPLACE</span>
            </motion.div>

            {/* Massive Hero Headline */}
            <motion.h1
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="text-4xl sm:text-6xl lg:text-7xl font-heading font-black text-white tracking-tight leading-[1.1]"
            >
              Welcome to <span className="text-[#D3CCB0]">Kreate Studio.</span>
            </motion.h1>

            {/* Exact Required Sub-text */}
            <motion.p
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="text-base sm:text-xl text-[#7B8A90] font-normal leading-relaxed max-w-3xl mx-auto"
            >
              India's first dedicated marketplace for digital source files. Whether you are building the next big app or selling your creative masterwork, we've built a home for you.
            </motion.p>

            {/* Social Proof Bar */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="pt-2 flex flex-wrap items-center justify-center gap-4 sm:gap-6 text-xs text-[#7B8A90]"
            >
              <div className="flex items-center gap-2">
                <div className="flex -space-x-2">
                  <img className="inline-block h-7 w-7 rounded-full ring-2 ring-[#000000] object-cover" src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80" alt="Creator" />
                  <img className="inline-block h-7 w-7 rounded-full ring-2 ring-[#000000] object-cover" src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80" alt="Creator" />
                  <img className="inline-block h-7 w-7 rounded-full ring-2 ring-[#000000] object-cover" src="https://images.unsplash.com/photo-1517841905240-472988babdf9?w=100&auto=format&fit=crop&q=80" alt="Creator" />
                  <div className="w-7 h-7 rounded-full bg-[#202C44] border-2 border-[#000000] text-[#D3CCB0] text-[10px] font-mono font-bold flex items-center justify-center">
                    +5k
                  </div>
                </div>
                <span className="text-white font-medium">5,000+ Indian Creators & Builders</span>
              </div>

              <div className="flex items-center gap-1.5 text-amber-400">
                <div className="flex">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                  ))}
                </div>
                <span className="text-white font-mono font-bold">4.9/5</span>
                <span className="text-[#7B8A90]">(Quality Verified)</span>
              </div>
            </motion.div>

          </div>

        </div>
      </section>

      {/* 2. THE "TWO PATHS" INTRO (Side-by-side Large Cards) */}
      <section className="py-20 bg-[#111317] border-b border-[#202C44]" id="intro-two-paths">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Section Header */}
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
            <div className="inline-flex items-center gap-2 bg-[#202C44] border border-[#202C44] px-3.5 py-1.5 rounded-full text-xs font-mono font-bold text-[#D3CCB0]">
              <Layers className="w-3.5 h-3.5" />
              <span>CHOOSE YOUR OBJECTIVE</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-heading font-extrabold text-white tracking-tight">
              Built for both sides of the screen.
            </h2>
            <p className="text-sm sm:text-base text-[#7B8A90]">
              Pick your primary path to get started with the right tools, workflows, and economic incentives.
            </p>
          </div>

          {/* Two Large Side-by-Side Intro Cards */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-5xl mx-auto">
            
            {/* PATH 1: BUYER CARD ("I want to Build") */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="bg-[#000000] border-2 border-[#202C44] hover:border-[#D3CCB0] rounded-3xl p-8 sm:p-10 flex flex-col justify-between shadow-2xl transition-all group relative overflow-hidden"
              id="intro-buyer-card"
            >
              <div className="absolute top-0 right-0 w-48 h-48 bg-[#D3CCB0]/5 rounded-full blur-3xl pointer-events-none" />

              <div className="space-y-6 relative z-10">
                {/* Header Badge */}
                <div className="flex items-center justify-between">
                  <div className="w-14 h-14 rounded-2xl bg-[#111317] border border-[#202C44] text-[#D3CCB0] flex items-center justify-center text-2xl group-hover:scale-105 transition-transform">
                    🚀
                  </div>
                  <span className="text-xs font-mono font-bold text-[#D3CCB0] bg-[#202C44] px-3 py-1 rounded-full border border-[#202C44]">
                    FOR DEVELOPERS & DESIGNERS
                  </span>
                </div>

                {/* Card Title */}
                <div>
                  <h3 className="text-2xl sm:text-3xl font-heading font-black text-white group-hover:text-[#D3CCB0] transition-colors">
                    I want to Build
                  </h3>
                  <p className="text-sm text-[#7B8A90] mt-2 leading-relaxed">
                    Find production-tested Flutter code, complete Figma design kits, AI Jupyter notebooks, 3D models, and Notion workspaces built by top Indian talent.
                  </p>
                </div>

                {/* Value Highlights */}
                <div className="space-y-3 pt-2">
                  <div className="flex items-start gap-3 text-xs">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <div>
                      <strong className="text-white block font-medium">UPI Native Checkout</strong>
                      <span className="text-[#7B8A90]">Pay via GPay, PhonePe, Paytm, or BHIM. Zero card declines.</span>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 text-xs">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <div>
                      <strong className="text-white block font-medium">Instant Source Downloads</strong>
                      <span className="text-[#7B8A90]">Raw files (.fig, .dart, .ipynb, .blend) delivered in milliseconds.</span>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 text-xs">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <div>
                      <strong className="text-white block font-medium">Commercial License Included</strong>
                      <span className="text-[#7B8A90]">Ship client apps, commercial products, and SaaS projects freely.</span>
                    </div>
                  </div>
                </div>

              </div>

              {/* Action Button */}
              <div className="pt-8 mt-6 border-t border-[#202C44]/70 relative z-10">
                <button
                  type="button"
                  onClick={handleStartBuyer}
                  id="intro-start-buyer-btn"
                  className="w-full bg-[#D3CCB0] hover:bg-[#c4bb9a] text-[#000000] font-heading font-black text-sm py-4 px-6 rounded-2xl transition-all shadow-xl hover:shadow-[#D3CCB0]/20 active:scale-98 flex items-center justify-center gap-2"
                >
                  <span>Get Started as a Buyer</span>
                  <ArrowRight className="w-4 h-4 text-[#000000]" />
                </button>
              </div>
            </motion.div>

            {/* PATH 2: SELLER CARD ("I want to Earn") */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="bg-[#000000] border-2 border-[#202C44] hover:border-emerald-400/80 rounded-3xl p-8 sm:p-10 flex flex-col justify-between shadow-2xl transition-all group relative overflow-hidden"
              id="intro-seller-card"
            >
              <div className="absolute top-0 right-0 w-48 h-48 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none" />

              <div className="space-y-6 relative z-10">
                {/* Header Badge */}
                <div className="flex items-center justify-between">
                  <div className="w-14 h-14 rounded-2xl bg-[#111317] border border-[#202C44] text-emerald-400 flex items-center justify-center text-2xl group-hover:scale-105 transition-transform">
                    💰
                  </div>
                  <span className="text-xs font-mono font-bold text-emerald-400 bg-emerald-950/60 px-3 py-1 rounded-full border border-emerald-800/60">
                    FOR CREATORS & ENGINEERS
                  </span>
                </div>

                {/* Card Title */}
                <div>
                  <h3 className="text-2xl sm:text-3xl font-heading font-black text-white group-hover:text-emerald-400 transition-colors">
                    I want to Earn
                  </h3>
                  <p className="text-sm text-[#7B8A90] mt-2 leading-relaxed">
                    Monetize your codebases, UI systems, models, and presets with fair economics. Keep 90% of every sale with direct weekly bank settlements.
                  </p>
                </div>

                {/* Value Highlights */}
                <div className="space-y-3 pt-2">
                  <div className="flex items-start gap-3 text-xs">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <div>
                      <strong className="text-white block font-medium">Industry-Leading 90% Payout</strong>
                      <span className="text-[#7B8A90]">Keep 90% of your listed price. No hidden wire transfer fees.</span>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 text-xs">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <div>
                      <strong className="text-white block font-medium">Direct Indian Bank Settlements</strong>
                      <span className="text-[#7B8A90]">Weekly automatic UPI / NEFT payouts straight into your Indian account.</span>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 text-xs">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <div>
                      <strong className="text-white block font-medium">Manual Review & Creator Shield</strong>
                      <span className="text-[#7B8A90]">Protect your intellectual property with verified commercial licenses.</span>
                    </div>
                  </div>
                </div>

              </div>

              {/* Action Button */}
              <div className="pt-8 mt-6 border-t border-[#202C44]/70 relative z-10">
                <button
                  type="button"
                  onClick={handleStartSeller}
                  id="intro-start-seller-btn"
                  className="w-full bg-[#202C44] hover:bg-[#202C44]/80 text-white font-heading font-bold text-sm py-4 px-6 rounded-2xl border border-[#202C44] hover:border-emerald-400 transition-all shadow-xl active:scale-98 flex items-center justify-center gap-2"
                >
                  <span>Start Selling (Keep 90%)</span>
                  <ArrowRight className="w-4 h-4 text-emerald-400" />
                </button>
              </div>
            </motion.div>

          </div>

        </div>
      </section>

      {/* 3. WHY WE'RE DIFFERENT (Feature Highlights) */}
      <section className="py-20 bg-[#000000] border-b border-[#202C44]" id="features">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-3xl mx-auto mb-14 space-y-3">
            <div className="inline-flex items-center gap-2 bg-[#111317] border border-[#202C44] px-3.5 py-1.5 rounded-full text-xs font-mono font-bold text-[#D3CCB0]">
              <Sparkles className="w-3.5 h-3.5" />
              <span>THE KREATE ADVANTAGE</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-heading font-extrabold text-white tracking-tight">
              Why Indian Creators Choose Kreate Studio
            </h2>
            <p className="text-sm sm:text-base text-[#7B8A90]">
              We redesigned digital asset commerce from first principles to eliminate high global fees, PayPal delays, and currency friction.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((item, idx) => (
              <div
                key={item.title}
                className="bg-[#111317] border border-[#202C44] hover:border-[#D3CCB0]/40 rounded-2xl p-6 flex flex-col justify-between shadow-xl transition-all group"
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="w-12 h-12 rounded-xl bg-[#202C44] border border-[#202C44] flex items-center justify-center text-xl group-hover:scale-105 transition-transform">
                      {item.icon}
                    </div>
                    <span className="text-[11px] font-mono font-semibold text-[#D3CCB0] bg-[#202C44]/80 px-2.5 py-1 rounded-lg border border-[#202C44]">
                      {item.badge}
                    </span>
                  </div>

                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-base">{item.flag}</span>
                      <h3 className="text-lg font-heading font-bold text-white group-hover:text-[#D3CCB0] transition-colors">
                        {item.title}
                      </h3>
                    </div>
                  </div>

                  <p className="text-xs text-[#7B8A90] leading-relaxed">
                    {item.description}
                  </p>
                </div>

                <div className="mt-6 pt-3 border-t border-[#202C44]/60 flex items-center gap-1.5 text-[11px] text-[#D3CCB0]">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span>Engineered for India</span>
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* 4. FILE FORMATS & 239+ CATEGORIES PREVIEW */}
      <section className="py-20 bg-[#111317] border-b border-[#202C44]" id="about">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-8">
          
          <div className="max-w-2xl mx-auto space-y-3">
            <h2 className="text-2xl sm:text-3xl font-heading font-extrabold text-white tracking-tight">
              Support for 100+ Raw Source Formats
            </h2>
            <p className="text-xs sm:text-sm text-[#7B8A90]">
              From mobile application templates to neural network weights, 3D meshes, and video color profiles.
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3 max-w-4xl mx-auto">
            {popularFormats.map((fmt) => (
              <div
                key={fmt.ext}
                className="bg-[#000000] border border-[#202C44] rounded-xl px-4 py-2.5 flex items-center gap-2.5 text-xs shadow-md"
              >
                <span className={`font-mono font-bold text-sm ${fmt.color}`}>{fmt.ext}</span>
                <span className="text-white font-medium">{fmt.name}</span>
              </div>
            ))}
          </div>

          <div className="pt-4">
            <Link
              to="/how-it-works"
              id="intro-learn-more-link"
              className="inline-flex items-center gap-2 text-xs font-mono font-bold text-[#D3CCB0] hover:text-white transition-colors"
            >
              <span>Learn How Kreate Studio Works (Interactive Tour)</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

        </div>
      </section>

      {/* 5. FINAL CALL TO ACTION */}
      <section className="py-20 bg-[#000000]" id="intro-bottom-cta">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="bg-[#111317] border border-[#202C44] rounded-3xl p-8 sm:p-14 space-y-6 shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-80 h-32 bg-[#D3CCB0]/10 blur-3xl pointer-events-none" />

            <div className="inline-flex items-center gap-2 bg-[#202C44] border border-[#202C44] px-4 py-1.5 rounded-full text-xs font-mono font-bold text-[#D3CCB0]">
              <Sparkles className="w-3.5 h-3.5" />
              <span>JOIN TODAY</span>
            </div>

            <h2 className="text-3xl sm:text-4xl font-heading font-black text-white">
              Ready to enter Kreate Studio?
            </h2>

            <p className="text-xs sm:text-sm text-[#7B8A90] max-w-lg mx-auto">
              Sign up in 30 seconds to download production source files or start selling to thousands of developers across India.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
              <Link
                to="/signup"
                id="intro-bottom-signup-btn"
                className="w-full sm:w-auto bg-[#D3CCB0] hover:bg-[#c4bb9a] text-[#000000] font-heading font-black text-xs sm:text-sm px-8 py-3.5 rounded-xl transition-all shadow-xl active:scale-95 flex items-center justify-center gap-2"
              >
                <span>Create Free Account</span>
                <ArrowRight className="w-4 h-4 text-[#000000]" />
              </Link>

              <Link
                to="/signin"
                id="intro-bottom-signin-btn"
                className="w-full sm:w-auto bg-[#202C44] hover:bg-[#202C44]/80 text-white font-heading font-bold text-xs sm:text-sm px-8 py-3.5 rounded-xl border border-[#202C44] transition-all flex items-center justify-center gap-2"
              >
                <span>Sign In to Existing Account</span>
              </Link>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
};

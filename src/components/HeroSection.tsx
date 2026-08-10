import React from "react";
import { Search, ShieldCheck, ArrowRight, Zap, Star, Download, FileCode, CheckCircle2 } from "lucide-react";
import { motion } from "motion/react";
import { CoreCategory } from "../types";

interface HeroSectionProps {
  onExploreClick: () => void;
  onSelectCategory: (cat: CoreCategory) => void;
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  onSearchSubmit: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  onExploreClick,
  onSelectCategory,
  searchQuery,
  setSearchQuery,
  onSearchSubmit,
}) => {
  return (
    <section className="relative overflow-hidden pt-10 pb-16 md:pt-16 md:pb-20 border-b border-[#202C44]/50 bg-gradient-to-b from-[#000000] via-[#000000] to-[#111317]">
      {/* Subtle Navy Background Accent Grid */}
      <div className="absolute inset-0 bg-[radial-gradient(#202C44_1px,transparent_1px)] [background-size:24px_24px] opacity-30 pointer-events-none" />
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Top Badges */}
        <div className="flex flex-wrap items-center gap-3 mb-6">
          <div className="inline-flex items-center gap-2 bg-[#202C44] border border-[#202C44] px-3 py-1 rounded-full text-xs font-medium text-white">
            <span className="w-2 h-2 rounded-full bg-[#D3CCB0] animate-pulse" />
            <span>India's Mobile-First Marketplace</span>
          </div>

          <div className="inline-flex items-center gap-1.5 bg-[#111317] border border-[#202C44] px-3 py-1 rounded-full text-xs font-medium text-[#7B8A90]">
            <Zap className="w-3.5 h-3.5 text-[#D3CCB0]" />
            <span>UPI Native Checkout (₹)</span>
          </div>

          <div className="inline-flex items-center gap-1.5 bg-[#111317] border border-[#202C44] px-3 py-1 rounded-full text-xs font-medium text-[#7B8A90]">
            <ShieldCheck className="w-3.5 h-3.5 text-[#D3CCB0]" />
            <span>100% Quality Reviewed</span>
          </div>
        </div>

        {/* 2-Column Grid: Left Content & Right Floating Asset Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          
          {/* Left Column (7 cols): Main Headline & Search */}
          <div className="lg:col-span-7 space-y-6">
            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-heading font-extrabold text-white tracking-[-0.02em] leading-[1.12]">
              India's Digital Asset Marketplace for <span className="text-[#D3CCB0] underline decoration-[#202C44] underline-offset-8">Creators & Developers</span>
            </h1>

            <p className="text-base sm:text-lg text-[#7B8A90] font-normal max-w-2xl leading-relaxed">
              Buy & sell production-ready Figma UI kits, Flutter app source code, AI notebooks, 3D Blender models, cinematic LUTs, and Notion systems. Pay directly in Rupee (₹) with instant UPI downloads.
            </p>

            {/* Search Box */}
            <div className="pt-2">
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  onSearchSubmit();
                }}
                className="relative flex items-center"
              >
                <div className="relative w-full">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#7B8A90]" />
                  <input
                    type="text"
                    placeholder="Search Flutter app, Llama-3 notebooks, Fintech UI kit, LUTs, Blender..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full bg-[#111317] text-white text-sm pl-12 pr-32 py-4 rounded-xl border border-[#202C44] focus:outline-none focus:border-[#D3CCB0]/80 placeholder-[#7B8A90] shadow-2xl transition-all"
                  />
                  <button
                    type="submit"
                    className="absolute right-2 top-1/2 -translate-y-1/2 bg-[#D3CCB0] hover:bg-[#c4bb9a] text-[#000000] font-bold text-xs px-5 py-2.5 rounded-lg transition-all flex items-center gap-1.5 active:scale-95 shadow hover:scale-[1.02]"
                  >
                    <span>Explore</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </form>

              {/* Quick Keyword Pills */}
              <div className="flex flex-wrap items-center gap-2 mt-3 text-xs text-[#7B8A90]">
                <span className="font-medium text-white">Popular:</span>
                <button
                  onClick={() => {
                    setSearchQuery("Figma UI Kit");
                    onSearchSubmit();
                  }}
                  className="hover:text-[#D3CCB0] transition-colors hover:underline"
                >
                  Figma UI Kit
                </button>
                <span>•</span>
                <button
                  onClick={() => {
                    setSearchQuery("Flutter");
                    onSearchSubmit();
                  }}
                  className="hover:text-[#D3CCB0] transition-colors hover:underline"
                >
                  Flutter Templates
                </button>
                <span>•</span>
                <button
                  onClick={() => {
                    setSearchQuery("Notebook");
                    onSearchSubmit();
                  }}
                  className="hover:text-[#D3CCB0] transition-colors hover:underline"
                >
                  AI Notebooks
                </button>
                <span>•</span>
                <button
                  onClick={() => {
                    setSearchQuery("LUTs");
                    onSearchSubmit();
                  }}
                  className="hover:text-[#D3CCB0] transition-colors hover:underline"
                >
                  Goa LUTs
                </button>
                <span>•</span>
                <button
                  onClick={() => {
                    setSearchQuery("Notion");
                    onSearchSubmit();
                  }}
                  className="hover:text-[#D3CCB0] transition-colors hover:underline"
                >
                  Notion Agency OS
                </button>
              </div>
            </div>
          </div>

          {/* Right Column (5 cols): Visual Signature - Floating Angled Staggered Asset Preview Cards */}
          <div className="lg:col-span-5 relative min-h-[380px] sm:min-h-[420px] flex items-center justify-center pt-6 lg:pt-0">
            
            {/* Soft Ambient Background Glow */}
            <div className="absolute w-72 h-72 rounded-full bg-[#202C44]/40 blur-3xl pointer-events-none" />

            {/* Staggered Stacked Preview Cards */}
            <div className="relative w-full max-w-md mx-auto">
              
              {/* Card 1: Top / Back - Fintech Figma Kit */}
              <motion.div
                initial={{ opacity: 0, y: 40, rotate: -8 }}
                animate={{ opacity: 1, y: 0, rotate: -5 }}
                transition={{ duration: 0.6, delay: 0.1 }}
                whileHover={{ rotate: 0, scale: 1.03, zIndex: 40 }}
                className="absolute -top-10 -left-2 sm:-left-6 w-64 sm:w-72 bg-[#111317] border border-[#202C44] rounded-2xl p-3 shadow-[0_20px_50px_rgba(32,44,68,0.6)] backdrop-blur-md cursor-pointer transition-all"
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="bg-[#202C44] text-[#D3CCB0] text-[10px] font-mono font-bold px-2 py-0.5 rounded border border-[#202C44] flex items-center gap-1">
                    <FileCode className="w-3 h-3 text-[#D3CCB0]" />
                    .fig
                  </span>
                  <span className="text-[10px] font-bold text-[#D3CCB0] font-mono">₹1,499</span>
                </div>
                <div className="h-28 rounded-xl overflow-hidden mb-2 bg-[#202C44]">
                  <img
                    src="https://images.unsplash.com/photo-1616469829941-c7200edec809?w=500&auto=format&fit=crop&q=80"
                    alt="Figma Fintech UI Kit"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex items-center justify-between text-xs">
                  <h4 className="font-heading font-bold text-white text-xs truncate">UPI Fintech UI Kit</h4>
                  <div className="flex items-center gap-1 text-[10px] text-[#D3CCB0]">
                    <Star className="w-3 h-3 fill-current" />
                    <span>4.9</span>
                  </div>
                </div>
              </motion.div>

              {/* Card 2: Middle - Flutter App Code */}
              <motion.div
                initial={{ opacity: 0, y: 40, rotate: 6 }}
                animate={{ opacity: 1, y: 0, rotate: 3 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                whileHover={{ rotate: 0, scale: 1.03, zIndex: 40 }}
                className="absolute top-12 -right-2 sm:-right-4 w-64 sm:w-72 bg-[#111317] border border-[#202C44] rounded-2xl p-3 shadow-[0_20px_50px_rgba(32,44,68,0.6)] backdrop-blur-md cursor-pointer transition-all z-20"
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="bg-[#202C44] text-[#D3CCB0] text-[10px] font-mono font-bold px-2 py-0.5 rounded border border-[#202C44] flex items-center gap-1">
                    <FileCode className="w-3 h-3 text-[#D3CCB0]" />
                    .dart
                  </span>
                  <span className="text-[10px] font-bold text-[#D3CCB0] font-mono">₹2,499</span>
                </div>
                <div className="h-28 rounded-xl overflow-hidden mb-2 bg-[#202C44]">
                  <img
                    src="https://images.unsplash.com/photo-1551650975-87deedd944c3?w=500&auto=format&fit=crop&q=80"
                    alt="Flutter Mobile App Source"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex items-center justify-between text-xs">
                  <h4 className="font-heading font-bold text-white text-xs truncate">Flutter QuickCommerce App</h4>
                  <div className="flex items-center gap-1 text-[10px] text-[#D3CCB0]">
                    <Star className="w-3 h-3 fill-current" />
                    <span>4.8</span>
                  </div>
                </div>
              </motion.div>

              {/* Card 3: Front / Bottom - Llama-3 Notebook */}
              <motion.div
                initial={{ opacity: 0, y: 40, rotate: -4 }}
                animate={{ opacity: 1, y: 0, rotate: -2 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                whileHover={{ rotate: 0, scale: 1.03, zIndex: 40 }}
                className="relative mt-36 sm:mt-40 mx-auto w-68 sm:w-76 bg-[#111317] border border-[#202C44] rounded-2xl p-3.5 shadow-[0_25px_60px_rgba(0,0,0,0.8)] backdrop-blur-md cursor-pointer transition-all z-30"
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-1.5">
                    <span className="bg-[#202C44] text-[#D3CCB0] text-[10px] font-mono font-bold px-2 py-0.5 rounded border border-[#202C44]">
                      .ipynb
                    </span>
                    <span className="text-[9px] text-emerald-400 font-mono flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3" /> Quality Verified
                    </span>
                  </div>
                  <span className="text-xs font-bold text-[#D3CCB0] font-mono">₹1,899</span>
                </div>

                <div className="h-32 rounded-xl overflow-hidden mb-2 bg-[#202C44] relative">
                  <img
                    src="https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=500&auto=format&fit=crop&q=80"
                    alt="Llama-3 Notebook"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#111317] via-transparent to-transparent" />
                  <span className="absolute bottom-2 left-2 text-[10px] font-mono text-[#D3CCB0] bg-[#111317]/90 px-2 py-0.5 rounded border border-[#202C44]">
                    AI / ML Model Notebook
                  </span>
                </div>

                <div className="flex items-center justify-between text-xs pt-1">
                  <div>
                    <h4 className="font-heading font-bold text-white text-xs">Llama-3 8B Fine-Tuning Guide</h4>
                    <p className="text-[10px] text-[#7B8A90] font-mono mt-0.5">Includes PyTorch scripts & Lora weights</p>
                  </div>
                  <div className="flex items-center gap-1 text-xs text-[#D3CCB0] font-bold">
                    <Star className="w-3.5 h-3.5 fill-current" />
                    <span>5.0</span>
                  </div>
                </div>
              </motion.div>

              {/* Accent Floating Pill Badge */}
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 0.4 }}
                className="absolute -bottom-6 -right-2 bg-[#202C44] border border-[#D3CCB0]/40 text-[#D3CCB0] px-3.5 py-1.5 rounded-full text-[11px] font-mono font-bold shadow-xl flex items-center gap-2 z-40"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Instant Raw Downloads</span>
              </motion.div>

            </div>

          </div>

        </div>

        {/* Slim Horizontal Secondary Stats Strip Below Hero */}
        <div className="mt-12 py-3.5 px-6 bg-[#111317]/80 border border-[#202C44] rounded-2xl flex flex-wrap items-center justify-around gap-4 text-xs font-mono text-[#7B8A90] shadow-xl">
          <div className="flex items-center gap-2">
            <span className="font-heading font-extrabold text-white text-sm sm:text-base">239</span>
            <span>Specialized Sectors</span>
          </div>

          <span className="text-[#202C44] hidden sm:inline">•</span>

          <div className="flex items-center gap-2">
            <span className="font-heading font-extrabold text-[#D3CCB0] text-sm sm:text-base">100+</span>
            <span>Real File Formats</span>
          </div>

          <span className="text-[#202C44] hidden sm:inline">•</span>

          <div className="flex items-center gap-2">
            <span className="font-heading font-extrabold text-white text-sm sm:text-base">90%</span>
            <span>Seller Net Split</span>
          </div>

          <span className="text-[#202C44] hidden sm:inline">•</span>

          <div className="flex items-center gap-2">
            <span className="font-heading font-extrabold text-[#D3CCB0] text-sm sm:text-base">₹0</span>
            <span>Foreign Exchange Fees</span>
          </div>
        </div>

      </div>
    </section>
  );
};


import React from "react";
import { Search, Sparkles, ShieldCheck, ArrowRight, Zap, CheckCircle2, FileCode, Layers } from "lucide-react";
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
    <section className="relative overflow-hidden pt-12 pb-16 md:pt-20 md:pb-24 border-b border-[#202C44]/50 bg-gradient-to-b from-[#000000] via-[#000000] to-[#111317]">
      {/* Subtle Navy Background Accent Grid (No Cream Glows) */}
      <div className="absolute inset-0 bg-[radial-gradient(#202C44_1px,transparent_1px)] [background-size:24px_24px] opacity-30 pointer-events-none" />
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Top Pills */}
        <div className="flex flex-wrap items-center justify-center gap-3 mb-6">
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
            <span>100% Manually Quality Reviewed</span>
          </div>
        </div>

        {/* Main Headline */}
        <div className="text-center max-w-4xl mx-auto space-y-6">
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-heading font-extrabold text-white tracking-tight leading-[1.15]">
            India's Digital Asset Marketplace for <span className="text-[#D3CCB0] underline decoration-[#202C44] underline-offset-8">Creators & Developers</span>
          </h1>

          <p className="text-base sm:text-lg text-[#7B8A90] font-normal max-w-2xl mx-auto leading-relaxed">
            Buy & sell production-ready Figma UI kits, Flutter templates, AI notebooks, 3D Blender models, cinematic LUTs, and Notion systems. Pay directly in Rupee (₹) with instant UPI downloads — no USD conversion fees.
          </p>

          {/* Search Box */}
          <div className="max-w-2xl mx-auto pt-2">
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
                  className="absolute right-2 top-1/2 -translate-y-1/2 bg-[#D3CCB0] hover:bg-[#c4bb9a] text-[#000000] font-semibold text-xs px-5 py-2.5 rounded-lg transition-all flex items-center gap-1.5 active:scale-95 shadow"
                >
                  <span>Explore</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </form>

            {/* Quick Keyword Pills */}
            <div className="flex flex-wrap items-center justify-center gap-2 mt-3 text-xs text-[#7B8A90]">
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

        {/* Core Stats Bar */}
        <div className="mt-14 pt-8 border-t border-[#202C44]/60 grid grid-cols-2 md:grid-cols-4 gap-6 text-center max-w-5xl mx-auto">
          <div className="bg-[#202C44]/30 border border-[#202C44] rounded-xl p-4">
            <div className="text-2xl sm:text-3xl font-heading font-extrabold text-white">239</div>
            <div className="text-xs text-[#7B8A90] font-medium mt-1">Specialized Categories</div>
          </div>

          <div className="bg-[#202C44]/30 border border-[#202C44] rounded-xl p-4">
            <div className="text-2xl sm:text-3xl font-heading font-extrabold text-[#D3CCB0]">100+</div>
            <div className="text-xs text-[#7B8A90] font-medium mt-1">Real File Formats</div>
          </div>

          <div className="bg-[#202C44]/30 border border-[#202C44] rounded-xl p-4">
            <div className="text-2xl sm:text-3xl font-heading font-extrabold text-white">90%</div>
            <div className="text-xs text-[#7B8A90] font-medium mt-1">Seller Revenue Share</div>
          </div>

          <div className="bg-[#202C44]/30 border border-[#202C44] rounded-xl p-4">
            <div className="text-2xl sm:text-3xl font-heading font-extrabold text-[#D3CCB0]">₹0</div>
            <div className="text-xs text-[#7B8A90] font-medium mt-1">Foreign Exchange Fees</div>
          </div>
        </div>

      </div>
    </section>
  );
};

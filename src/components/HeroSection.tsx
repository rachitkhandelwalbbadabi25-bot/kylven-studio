import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowRight, Star, FileCode, CheckCircle2, Sparkles, Layers } from "lucide-react";
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
  const navigate = useNavigate();

  return (
    <section className="relative overflow-hidden pt-8 pb-14 md:pt-12 md:pb-18 bg-[#000000]" id="homepage-hero">
      {/* Background Subtle Grid Pattern */}
      <div className="absolute inset-0 bg-[radial-gradient(#202C44_1px,transparent_1px)] [background-size:28px_28px] opacity-25 pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Navy Container Panel */}
        <div className="relative bg-[#111317] border border-[#202C44] rounded-3xl p-6 sm:p-10 lg:p-12 shadow-2xl overflow-hidden">
          
          {/* Ambient Lighting Accents */}
          <div className="absolute -top-32 -left-32 w-96 h-96 rounded-full bg-[#202C44]/40 blur-3xl pointer-events-none" />
          <div className="absolute -bottom-32 -right-32 w-96 h-96 rounded-full bg-[#202C44]/30 blur-3xl pointer-events-none" />

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center relative z-10">
            
            {/* Left Content (7 columns) */}
            <div className="lg:col-span-7 space-y-6">
              
              {/* Pill Tag */}
              <div className="inline-flex items-center gap-2 bg-[#202C44] border border-[#202C44] px-3.5 py-1.5 rounded-full text-xs font-mono font-semibold text-[#D3CCB0]">
                <Sparkles className="w-3.5 h-3.5 text-[#D3CCB0]" />
                <span>INDIA’S VERIFIED DIGITAL COMMERCE</span>
              </div>

              {/* Exact Required Headline */}
              <h1 className="text-3xl sm:text-5xl lg:text-5xl font-heading font-extrabold text-white tracking-tight leading-[1.15]">
                Digital Assets Built by{" "}
                <span className="text-[#D3CCB0]">India’s Best Creators</span>.
              </h1>

              {/* Exact Required Subheading */}
              <p className="text-sm sm:text-base text-[#7B8A90] font-normal max-w-xl leading-relaxed">
                Buy and sell production-ready UI kits, codebases, 3D models, presets, and AI workflows. Instant downloads with transparent UPI checkout.
              </p>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-3 pt-2">
                <Link
                  to="/browse"
                  id="hero-explore-btn"
                  className="bg-[#D3CCB0] hover:bg-[#c4bb9a] text-[#000000] text-sm font-heading font-bold px-6 py-3.5 rounded-xl transition-all shadow active:scale-95 flex items-center gap-2"
                >
                  <span>Explore Marketplace</span>
                  <ArrowRight className="w-4 h-4 text-[#000000]" />
                </Link>

                <Link
                  to="/pricing"
                  id="hero-creator-btn"
                  className="bg-[#202C44] hover:bg-[#202C44]/80 text-white text-sm font-heading font-semibold px-6 py-3.5 rounded-xl border border-[#202C44] hover:border-[#D3CCB0]/60 transition-all flex items-center gap-2"
                >
                  <span>Become a Creator</span>
                </Link>
              </div>

              {/* Quick Filter Badges */}
              <div className="pt-2 flex flex-wrap items-center gap-2 text-xs text-[#7B8A90]">
                <span className="font-mono text-[#D3CCB0] text-[11px] font-bold">Trending Sectors:</span>
                <button
                  type="button"
                  onClick={() => navigate("/browse?category=UI%2FUX%20%26%20Design")}
                  className="px-2.5 py-1 rounded-lg bg-[#202C44]/60 hover:bg-[#202C44] text-[#7B8A90] hover:text-white transition-colors"
                >
                  UI Kits
                </button>
                <button
                  type="button"
                  onClick={() => navigate("/browse?category=Software%20%26%20Development")}
                  className="px-2.5 py-1 rounded-lg bg-[#202C44]/60 hover:bg-[#202C44] text-[#7B8A90] hover:text-white transition-colors"
                >
                  Source Code
                </button>
                <button
                  type="button"
                  onClick={() => navigate("/browse?category=AI%2FML%20%26%20Data%20Science")}
                  className="px-2.5 py-1 rounded-lg bg-[#202C44]/60 hover:bg-[#202C44] text-[#7B8A90] hover:text-white transition-colors"
                >
                  AI Workflows
                </button>
                <button
                  type="button"
                  onClick={() => navigate("/browse?category=3D%20%26%20CAD")}
                  className="px-2.5 py-1 rounded-lg bg-[#202C44]/60 hover:bg-[#202C44] text-[#7B8A90] hover:text-white transition-colors"
                >
                  3D Assets
                </button>
              </div>
            </div>

            {/* Right Column (5 columns): Floating Real Asset Preview Block */}
            <div className="lg:col-span-5 relative min-h-[380px] flex items-center justify-center">
              
              {/* Stack of realistic preview cards */}
              <div className="relative w-full max-w-sm mx-auto space-y-3">
                
                {/* Asset 1: Neo Bharat Cyberpunk UI Kit */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4 }}
                  onClick={() => navigate("/listing/neo-bharat-cyberpunk-ui-kit")}
                  className="bg-[#000000]/90 border border-[#202C44] hover:border-[#D3CCB0]/70 p-3.5 rounded-2xl shadow-xl backdrop-blur-md transition-all cursor-pointer group"
                >
                  <div className="flex items-center gap-3">
                    <img
                      src="https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=200&auto=format&fit=crop&q=80"
                      alt="Neo Bharat Cyberpunk UI Kit"
                      className="w-14 h-14 rounded-xl object-cover border border-[#202C44] shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-mono text-[#D3CCB0] bg-[#202C44] px-1.5 py-0.5 rounded font-bold">
                          .fig
                        </span>
                        <span className="text-xs font-mono font-bold text-[#D3CCB0]">₹1,499</span>
                      </div>
                      <h4 className="text-xs font-heading font-bold text-white truncate mt-1 group-hover:text-[#D3CCB0] transition-colors">
                        Neo Bharat Cyberpunk UI Kit
                      </h4>
                      <div className="flex items-center gap-2 mt-1">
                        <img
                          src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=80&q=80"
                          alt="Aarav Sharma"
                          className="w-3.5 h-3.5 rounded-full object-cover"
                        />
                        <span className="text-[10px] text-[#7B8A90] truncate">Aarav Sharma</span>
                        <div className="flex items-center gap-0.5 text-[10px] text-[#D3CCB0] ml-auto">
                          <Star className="w-2.5 h-2.5 fill-current" />
                          <span>4.9</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>

                {/* Asset 2: ML Fine-Tuning Notebook */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.15 }}
                  onClick={() => navigate("/listing/ml-finetuning-notebook")}
                  className="bg-[#000000]/90 border border-[#202C44] hover:border-[#D3CCB0]/70 p-3.5 rounded-2xl shadow-xl backdrop-blur-md transition-all cursor-pointer group"
                >
                  <div className="flex items-center gap-3">
                    <img
                      src="https://images.unsplash.com/photo-1555949963-aa79dcee981c?w=200&auto=format&fit=crop&q=80"
                      alt="ML Fine-Tuning Notebook"
                      className="w-14 h-14 rounded-xl object-cover border border-[#202C44] shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-mono text-[#D3CCB0] bg-[#202C44] px-1.5 py-0.5 rounded font-bold">
                          .ipynb
                        </span>
                        <span className="text-xs font-mono font-bold text-[#D3CCB0]">₹3,499</span>
                      </div>
                      <h4 className="text-xs font-heading font-bold text-white truncate mt-1 group-hover:text-[#D3CCB0] transition-colors">
                        ML Fine-Tuning Notebook (Llama-3)
                      </h4>
                      <div className="flex items-center gap-2 mt-1">
                        <img
                          src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=80&q=80"
                          alt="Vikram Patel"
                          className="w-3.5 h-3.5 rounded-full object-cover"
                        />
                        <span className="text-[10px] text-[#7B8A90] truncate">Vikram Patel</span>
                        <div className="flex items-center gap-0.5 text-[10px] text-[#D3CCB0] ml-auto">
                          <Star className="w-2.5 h-2.5 fill-current" />
                          <span>5.0</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>

                {/* Asset 3: Cinematic India LUT Pack */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.3 }}
                  onClick={() => navigate("/listing/cinematic-india-lut-pack")}
                  className="bg-[#000000]/90 border border-[#202C44] hover:border-[#D3CCB0]/70 p-3.5 rounded-2xl shadow-xl backdrop-blur-md transition-all cursor-pointer group"
                >
                  <div className="flex items-center gap-3">
                    <img
                      src="https://images.unsplash.com/photo-1533105079780-92b9be482077?w=200&auto=format&fit=crop&q=80"
                      alt="Cinematic India LUT Pack"
                      className="w-14 h-14 rounded-xl object-cover border border-[#202C44] shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-mono text-[#D3CCB0] bg-[#202C44] px-1.5 py-0.5 rounded font-bold">
                          .cube
                        </span>
                        <span className="text-xs font-mono font-bold text-emerald-400">FREE</span>
                      </div>
                      <h4 className="text-xs font-heading font-bold text-white truncate mt-1 group-hover:text-[#D3CCB0] transition-colors">
                        Cinematic India LUT Pack
                      </h4>
                      <div className="flex items-center gap-2 mt-1">
                        <img
                          src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=80&q=80"
                          alt="Ananya Rao"
                          className="w-3.5 h-3.5 rounded-full object-cover"
                        />
                        <span className="text-[10px] text-[#7B8A90] truncate">Ananya Rao</span>
                        <div className="flex items-center gap-0.5 text-[10px] text-[#D3CCB0] ml-auto">
                          <Star className="w-2.5 h-2.5 fill-current" />
                          <span>4.9</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>

              </div>

            </div>

          </div>

        </div>

      </div>
    </section>
  );
};

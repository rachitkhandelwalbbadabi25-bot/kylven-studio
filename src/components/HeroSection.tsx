import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowRight, Star, FileCode, CheckCircle2, Sparkles, ShieldCheck, Zap, Layers, IndianRupee, Users } from "lucide-react";
import { motion } from "motion/react";
import { CoreCategory, AssetListing } from "../types";

interface HeroSectionProps {
  onExploreClick: () => void;
  onSelectCategory: (cat: CoreCategory) => void;
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  onSearchSubmit: () => void;
  featuredListings?: AssetListing[];
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  onExploreClick,
  onSelectCategory,
  searchQuery,
  setSearchQuery,
  onSearchSubmit,
  featuredListings = [],
}) => {
  const navigate = useNavigate();

  return (
    <section className="relative overflow-hidden pt-6 pb-14 md:pt-10 md:pb-20 bg-[#000000]" id="homepage-hero">
      {/* Background Subtle Grid Pattern */}
      <div className="absolute inset-0 bg-[radial-gradient(#202C44_1px,transparent_1px)] [background-size:32px_32px] opacity-30 pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Main Split Hero Container */}
        <div className="relative bg-[#111317] border border-[#202C44] rounded-3xl p-6 sm:p-10 lg:p-12 shadow-2xl overflow-hidden">
          
          {/* Ambient Lighting Accents */}
          <div className="absolute -top-40 -left-40 w-[30rem] h-[30rem] rounded-full bg-[#202C44]/50 blur-[100px] pointer-events-none" />
          <div className="absolute -bottom-40 -right-40 w-[30rem] h-[30rem] rounded-full bg-[#202C44]/40 blur-[100px] pointer-events-none" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-72 h-72 rounded-full bg-[#D3CCB0]/5 blur-[120px] pointer-events-none" />

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center relative z-10">
            
            {/* Left Content (7 columns) */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="lg:col-span-7 space-y-6"
            >
              
              {/* Pill Tag */}
              <div className="inline-flex items-center gap-2 bg-[#202C44] border border-[#202C44] px-3.5 py-1.5 rounded-full text-xs font-mono font-semibold text-[#D3CCB0]">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span>INDIA’S VERIFIED DIGITAL COMMERCE</span>
              </div>

              {/* Exact Requested Headline */}
              <h1 className="text-3xl sm:text-5xl lg:text-[3.25rem] font-heading font-extrabold text-white tracking-tight leading-[1.12]">
                The Engine for{" "}
                <span className="text-[#D3CCB0]">India’s Digital Creator Economy</span>.
              </h1>

              {/* Exact Requested Subheadline */}
              <p className="text-sm sm:text-base text-[#7B8A90] font-normal max-w-xl leading-relaxed">
                The first marketplace where Indian developers, designers, and AI engineers buy and sell production-ready assets in Rupees. No foreign fees, no friction.
              </p>

              {/* Primary CTAs */}
              <div className="flex flex-wrap items-center gap-3 pt-2">
                <Link
                  to="/browse"
                  id="hero-explore-btn"
                  className="bg-[#D3CCB0] hover:bg-[#c4bb9a] text-[#000000] text-sm font-heading font-bold px-7 py-3.5 rounded-xl transition-all shadow-lg hover:shadow-[#D3CCB0]/10 active:scale-95 flex items-center gap-2"
                >
                  <span>Explore Marketplace</span>
                  <ArrowRight className="w-4 h-4 text-[#000000]" />
                </Link>

                <Link
                  to="/sell/new"
                  id="hero-start-selling-btn"
                  className="bg-[#202C44]/80 hover:bg-[#202C44] text-white text-sm font-heading font-semibold px-7 py-3.5 rounded-xl border border-[#202C44] hover:border-[#D3CCB0]/60 transition-all flex items-center gap-2"
                >
                  <span>Start Selling</span>
                </Link>
              </div>

              {/* Social Proof Line */}
              <div className="pt-3 flex flex-col sm:flex-row sm:items-center gap-3 text-xs text-[#7B8A90] border-t border-[#202C44]/70">
                <div className="flex items-center gap-3">
                  {/* Avatar Stack */}
                  <div className="flex -space-x-2 overflow-hidden">
                    <img
                      src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=80&q=80"
                      alt="Creator"
                      className="inline-block h-7 w-7 rounded-full ring-2 ring-[#111317] object-cover"
                    />
                    <img
                      src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=80&q=80"
                      alt="Creator"
                      className="inline-block h-7 w-7 rounded-full ring-2 ring-[#111317] object-cover"
                    />
                    <img
                      src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=80&q=80"
                      alt="Creator"
                      className="inline-block h-7 w-7 rounded-full ring-2 ring-[#111317] object-cover"
                    />
                    <img
                      src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=80&q=80"
                      alt="Creator"
                      className="inline-block h-7 w-7 rounded-full ring-2 ring-[#111317] object-cover"
                    />
                  </div>

                  <div className="flex items-center gap-1 text-[#D3CCB0]">
                    <div className="flex">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="w-3 h-3 fill-[#D3CCB0] text-[#D3CCB0]" />
                      ))}
                    </div>
                    <span className="font-bold text-white text-xs ml-1">4.9/5</span>
                  </div>
                </div>

                <div className="text-xs text-[#7B8A90] font-medium">
                  Join <strong className="text-white font-semibold">5,000+ Indian creators</strong> already building on Kreate Studio.
                </div>
              </div>

              {/* Quick Filter Tags */}
              <div className="flex flex-wrap items-center gap-2 text-xs text-[#7B8A90] pt-1">
                <span className="font-mono text-[#D3CCB0] text-[11px] font-bold">Trending:</span>
                <button
                  type="button"
                  onClick={() => navigate("/browse?category=UI%2FUX%20%26%20Design")}
                  className="px-2.5 py-1 rounded-lg bg-[#202C44]/60 hover:bg-[#202C44] text-[#7B8A90] hover:text-white transition-colors"
                >
                  Figma Kits
                </button>
                <button
                  type="button"
                  onClick={() => navigate("/browse?category=Software%20%26%20Development")}
                  className="px-2.5 py-1 rounded-lg bg-[#202C44]/60 hover:bg-[#202C44] text-[#7B8A90] hover:text-white transition-colors"
                >
                  Flutter Apps
                </button>
                <button
                  type="button"
                  onClick={() => navigate("/browse?category=AI%2FML%20%26%20Data%20Science")}
                  className="px-2.5 py-1 rounded-lg bg-[#202C44]/60 hover:bg-[#202C44] text-[#7B8A90] hover:text-white transition-colors"
                >
                  AI Notebooks
                </button>
                <button
                  type="button"
                  onClick={() => navigate("/browse?category=3D%20%26%20CAD")}
                  className="px-2.5 py-1 rounded-lg bg-[#202C44]/60 hover:bg-[#202C44] text-[#7B8A90] hover:text-white transition-colors"
                >
                  3D Blender
                </button>
              </div>

            </motion.div>

            {/* Right Column (5 columns): Floating Real Asset Preview Block */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="lg:col-span-5 relative flex flex-col justify-center"
            >
              {/* Card Container with subtle header */}
              <div className="bg-[#000000]/60 border border-[#202C44] rounded-2xl p-4 backdrop-blur-md">
                <div className="flex items-center justify-between pb-3 mb-3 border-b border-[#202C44] text-xs">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-400" />
                    <span className="font-heading font-bold text-white">Live Verified Listings</span>
                  </div>
                  <span className="text-[11px] font-mono text-[#D3CCB0] bg-[#202C44] px-2 py-0.5 rounded">
                    UPI Instant Pay
                  </span>
                </div>

                {/* Stack of realistic preview cards */}
                <div className="space-y-2.5">
                  {featuredListings && featuredListings.length > 0 ? (
                    featuredListings.slice(0, 3).map((item) => {
                      const displayPrice = item.isFree || item.price === 0 ? "Free" : `₹${item.price.toLocaleString("en-IN")}`;
                      const image = item.previewUrl || (item.previewUrls && item.previewUrls[0]) || item.thumbnailUrl;
                      const fileBadge = item.fileExtension ? `.${item.fileExtension}` : item.fileType;
                      const creatorTitle = item.sellerName || item.creator?.name || "Verified Creator";

                      return (
                        <div
                          key={item.id}
                          onClick={() => navigate(`/listing/${item.slug || item.id}`)}
                          className="bg-[#111317] border border-[#202C44] hover:border-[#D3CCB0]/70 p-3 rounded-xl shadow-lg transition-all cursor-pointer group"
                        >
                          <div className="flex items-center gap-3">
                            {image ? (
                              <img
                                src={image}
                                alt={item.title}
                                className="w-12 h-12 rounded-lg object-cover border border-[#202C44] shrink-0"
                              />
                            ) : (
                              <div className="w-12 h-12 rounded-lg bg-[#202C44] flex items-center justify-center text-[#D3CCB0] text-xs font-mono font-bold shrink-0">
                                {fileBadge}
                              </div>
                            )}
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center justify-between">
                                <span className="text-[10px] font-mono text-[#D3CCB0] bg-[#202C44] px-1.5 py-0.5 rounded font-bold uppercase">
                                  {fileBadge}
                                </span>
                                <span className="text-xs font-mono font-bold text-[#D3CCB0]">{displayPrice}</span>
                              </div>
                              <h4 className="text-xs font-heading font-bold text-white truncate mt-1 group-hover:text-[#D3CCB0] transition-colors">
                                {item.title}
                              </h4>
                              <div className="flex items-center gap-2 mt-0.5">
                                <span className="text-[10px] text-[#7B8A90] truncate">{creatorTitle}</span>
                                <span className="text-[10px] text-[#D3CCB0] ml-auto font-mono">
                                  {item.subcategory || item.category}
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })
                  ) : (
                    <>
                      {/* Fallback Asset 1 */}
                      <div
                        onClick={() => navigate("/browse")}
                        className="bg-[#111317] border border-[#202C44] hover:border-[#D3CCB0]/70 p-3 rounded-xl shadow-lg transition-all cursor-pointer group"
                      >
                        <div className="flex items-center gap-3">
                          <img
                            src="https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=200&auto=format&fit=crop&q=80"
                            alt="Explore UI Assets"
                            className="w-12 h-12 rounded-lg object-cover border border-[#202C44] shrink-0"
                          />
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between">
                              <span className="text-[10px] font-mono text-[#D3CCB0] bg-[#202C44] px-1.5 py-0.5 rounded font-bold">
                                .fig
                              </span>
                              <span className="text-xs font-mono font-bold text-[#D3CCB0]">Verified</span>
                            </div>
                            <h4 className="text-xs font-heading font-bold text-white truncate mt-1 group-hover:text-[#D3CCB0] transition-colors">
                              Explore Production UI Kits
                            </h4>
                            <div className="flex items-center gap-2 mt-0.5">
                              <span className="text-[10px] text-[#7B8A90] truncate">Kelvyn Studio</span>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Fallback Asset 2 */}
                      <div
                        onClick={() => navigate("/browse")}
                        className="bg-[#111317] border border-[#202C44] hover:border-[#D3CCB0]/70 p-3 rounded-xl shadow-lg transition-all cursor-pointer group"
                      >
                        <div className="flex items-center gap-3">
                          <img
                            src="https://images.unsplash.com/photo-1555949963-aa79dcee981c?w=200&auto=format&fit=crop&q=80"
                            alt="Explore ML Notebooks"
                            className="w-12 h-12 rounded-lg object-cover border border-[#202C44] shrink-0"
                          />
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between">
                              <span className="text-[10px] font-mono text-[#D3CCB0] bg-[#202C44] px-1.5 py-0.5 rounded font-bold">
                                .ipynb
                              </span>
                              <span className="text-xs font-mono font-bold text-[#D3CCB0]">Verified</span>
                            </div>
                            <h4 className="text-xs font-heading font-bold text-white truncate mt-1 group-hover:text-[#D3CCB0] transition-colors">
                              Machine Learning & AI Tools
                            </h4>
                            <div className="flex items-center gap-2 mt-0.5">
                              <span className="text-[10px] text-[#7B8A90] truncate">Kelvyn Studio</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </>
                  )}
                </div>

                {/* Footer Micro Bar */}
                <div className="mt-3 pt-3 border-t border-[#202C44] flex items-center justify-between text-[11px] text-[#7B8A90]">
                  <span className="flex items-center gap-1.5 text-emerald-400">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Malware Scanned</span>
                  </span>
                  <span className="text-[#D3CCB0] font-medium">90% Net Seller Split</span>
                </div>
              </div>
            </motion.div>

          </div>

        </div>

      </div>
    </section>
  );
};

import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { AssetListing, CoreCategory, UserProfile } from "../types";
import { HeroSection } from "../components/HeroSection";
import { DualPathSection } from "../components/DualPathSection";
import { HowItWorks } from "../components/HowItWorks";
import { FeatureHighlights } from "../components/FeatureHighlights";
import { CategoryShowcase } from "../components/CategoryShowcase";
import { FileFormatsBreadth } from "../components/FileFormatsBreadth";
import { ListingCard } from "../components/ListingCard";
import { BottomCTA } from "../components/BottomCTA";
import { motion } from "motion/react";
import {
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Zap,
  Percent,
  CheckCircle2,
  FileCode,
  Download,
  IndianRupee,
} from "lucide-react";

interface HomePageProps {
  listings: AssetListing[];
  isAuthenticated?: boolean;
  userProfile?: UserProfile;
  savedIds?: string[];
  onToggleSave?: (id: string) => void;
  onBuyNowDirect?: (listing: AssetListing) => void;
}

type TabFilter = "all" | "free" | "paid" | "design" | "dev" | "3d" | "video";

export const HomePage: React.FC<HomePageProps> = ({
  listings,
  isAuthenticated = false,
  userProfile,
  savedIds = [],
  onToggleSave,
  onBuyNowDirect,
}) => {
  const navigate = useNavigate();
  const [heroSearch, setHeroSearch] = useState("");
  const [activeTab, setActiveTab] = useState<TabFilter>("all");

  const handleSearchSubmit = () => {
    if (heroSearch.trim()) {
      navigate(`/browse?q=${encodeURIComponent(heroSearch.trim())}`);
    } else {
      navigate("/browse");
    }
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleSelectCategory = (cat: CoreCategory) => {
    navigate(`/browse?category=${encodeURIComponent(cat)}`);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleSelectFormat = (formatExt: string) => {
    navigate(`/browse?format=${encodeURIComponent(formatExt)}`);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Filter listings for the Trending Marketplace section
  const filteredTrendingListings = listings.filter((item) => {
    if (activeTab === "free") return item.priceInINR === 0;
    if (activeTab === "paid") return item.priceInINR > 0;
    if (activeTab === "design") return item.category === "UI/UX & Design";
    if (activeTab === "dev") return item.category === "Software & Development" || item.category === "AI/ML & Data Science";
    if (activeTab === "3d") return item.category === "3D & CAD";
    if (activeTab === "video") return item.category === "Video/Motion & Audio";
    return true; // 'all'
  });

  return (
    <div className="space-y-0" id="public-homepage-root">
      
      {/* 1. Enhanced Hero Section (The Hook) */}
      <HeroSection
        onExploreClick={() => navigate("/browse")}
        onSelectCategory={handleSelectCategory}
        searchQuery={heroSearch}
        setSearchQuery={setHeroSearch}
        onSearchSubmit={handleSearchSubmit}
      />

      {/* 2. Clean 4-Column Trust Metrics Strip */}
      <section className="bg-[#111317] border-y border-[#202C44] py-8" id="trust-metrics-strip">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            
            {/* Metric 1 */}
            <div className="flex items-start gap-3.5 p-3 rounded-2xl bg-[#000000]/40 border border-[#202C44]/60">
              <div className="w-10 h-10 rounded-xl bg-[#202C44] flex items-center justify-center text-[#D3CCB0] shrink-0 border border-[#202C44]">
                <FileCode className="w-5 h-5" />
              </div>
              <div className="space-y-0.5">
                <h4 className="font-heading font-bold text-white text-sm">100+ File Formats</h4>
                <p className="text-xs text-[#7B8A90] font-mono leading-relaxed">
                  .fig, .blend, .ipynb, .lut, .dart, .zip
                </p>
              </div>
            </div>

            {/* Metric 2 */}
            <div className="flex items-start gap-3.5 p-3 rounded-2xl bg-[#000000]/40 border border-[#202C44]/60">
              <div className="w-10 h-10 rounded-xl bg-[#202C44] flex items-center justify-center text-[#D3CCB0] shrink-0 border border-[#202C44]">
                <Percent className="w-5 h-5" />
              </div>
              <div className="space-y-0.5">
                <h4 className="font-heading font-bold text-white text-sm">90% Creator Earnings</h4>
                <p className="text-xs text-[#7B8A90] leading-relaxed">
                  Direct weekly UPI bank settlement.
                </p>
              </div>
            </div>

            {/* Metric 3 */}
            <div className="flex items-start gap-3.5 p-3 rounded-2xl bg-[#000000]/40 border border-[#202C44]/60">
              <div className="w-10 h-10 rounded-xl bg-[#202C44] flex items-center justify-center text-emerald-400 shrink-0 border border-[#202C44]">
                <IndianRupee className="w-5 h-5" />
              </div>
              <div className="space-y-0.5">
                <h4 className="font-heading font-bold text-white text-sm">₹0 Fee on Free Assets</h4>
                <p className="text-xs text-[#7B8A90] leading-relaxed">
                  Free means 100% free with zero checkout fees.
                </p>
              </div>
            </div>

            {/* Metric 4 */}
            <div className="flex items-start gap-3.5 p-3 rounded-2xl bg-[#000000]/40 border border-[#202C44]/60">
              <div className="w-10 h-10 rounded-xl bg-[#202C44] flex items-center justify-center text-[#D3CCB0] shrink-0 border border-[#202C44]">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div className="space-y-0.5">
                <h4 className="font-heading font-bold text-white text-sm">Verified Virus-Free</h4>
                <p className="text-xs text-[#7B8A90] leading-relaxed">
                  ClamAV & syntax automated inspection.
                </p>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 3. The "What You Can Do" Section (Dual Paths: For Buyers & For Sellers) */}
      <DualPathSection />

      {/* 4. "How it Works" (The 1-2-3 Process) */}
      <HowItWorks />

      {/* 5. Feature Highlights (Why We’re Different) */}
      <FeatureHighlights />

      {/* 6. Category Showcase (Visual Discovery with 6 Large Category Tiles & Trending Tags) */}
      <CategoryShowcase onSelectCategory={handleSelectCategory} />

      {/* 7. Trending Marketplace Section with Quick Filter Tabs */}
      <section className="py-20 bg-[#000000] border-b border-[#202C44]" id="trending-marketplace-section">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
          
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div className="space-y-2">
              <div className="inline-flex items-center gap-2 text-[#D3CCB0] text-xs font-mono uppercase tracking-wider">
                <Sparkles className="w-3.5 h-3.5" />
                <span>CURATED DISCOVERIES</span>
              </div>
              <h2 className="text-3xl sm:text-4xl font-heading font-extrabold text-white tracking-tight">
                Trending This Week
              </h2>
              <p className="text-sm text-[#7B8A90] max-w-xl">
                Hand-tested digital tools built by India's top creators, engineers, and 3D artists.
              </p>
            </div>

            {/* Quick Filter Tabs */}
            <div className="flex flex-wrap items-center gap-1.5 bg-[#111317] p-1.5 rounded-2xl border border-[#202C44]">
              {[
                { key: "all", label: "All Assets" },
                { key: "free", label: "Free (₹0)" },
                { key: "paid", label: "Premium" },
                { key: "design", label: "Design" },
                { key: "dev", label: "Dev & Code" },
                { key: "3d", label: "3D & CAD" },
                { key: "video", label: "Video & LUTs" },
              ].map((tab) => (
                <button
                  key={tab.key}
                  type="button"
                  onClick={() => setActiveTab(tab.key as TabFilter)}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-medium transition-all ${
                    activeTab === tab.key
                      ? "bg-[#D3CCB0] text-[#000000] font-bold shadow"
                      : "text-[#7B8A90] hover:text-white hover:bg-[#202C44]/50"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {/* Grid of Listing Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {filteredTrendingListings.slice(0, 8).map((item) => (
              <ListingCard
                key={item.id}
                listing={item}
                onSelectListing={(asset) => {
                  navigate(`/listing/${asset.slug || asset.id}`);
                  window.scrollTo({ top: 0, behavior: "smooth" });
                }}
                onBuyNowDirect={onBuyNowDirect}
                isSaved={savedIds.includes(item.id)}
                onToggleSave={onToggleSave}
              />
            ))}
          </div>

          {/* Direct Link to Browse All Assets */}
          <div className="text-center pt-8 border-t border-[#202C44]/50">
            <Link
              to="/browse"
              id="view-all-assets-btn"
              className="inline-flex items-center gap-2 bg-[#111317] hover:bg-[#202C44] text-[#D3CCB0] hover:text-white font-heading font-bold text-xs px-8 py-4 rounded-xl border border-[#202C44] hover:border-[#D3CCB0]/40 transition-all shadow active:scale-95"
            >
              <span>View all {listings.length} assets in Catalog</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

        </div>
      </section>

      {/* 8. Breadth of File Formats (100+ Raw Formats Supported) */}
      <FileFormatsBreadth onSelectFormat={handleSelectFormat} />

      {/* 9. Final "Call to Adventure" (Bottom CTA) */}
      <BottomCTA />

    </div>
  );
};

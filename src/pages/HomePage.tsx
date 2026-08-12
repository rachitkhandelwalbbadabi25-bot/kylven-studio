import React from "react";
import { useNavigate } from "react-router-dom";
import { AssetListing, CoreCategory, UserProfile } from "../types";
import { HeroSection } from "../components/HeroSection";
import { CategoryShowcase } from "../components/CategoryShowcase";
import { FileFormatsBreadth } from "../components/FileFormatsBreadth";
import { HowItWorks } from "../components/HowItWorks";
import { ListingCard } from "../components/ListingCard";
import { Sparkles, ArrowRight, Store, ShoppingBag, PlusCircle, Repeat } from "lucide-react";

interface HomePageProps {
  userProfile: UserProfile;
  isAuthenticated: boolean;
  listings: AssetListing[];
  savedIds: string[];
  onToggleSave: (id: string) => void;
  onBuyNowDirect: (listing: AssetListing) => void;
  onOpenOnboarding: () => void;
  onOpenAuthModal: (mode: "signin" | "signup") => void;
  onSwitchRole: (role: "buyer" | "seller") => void;
}

export const HomePage: React.FC<HomePageProps> = ({
  userProfile,
  isAuthenticated,
  listings,
  savedIds,
  onToggleSave,
  onBuyNowDirect,
  onOpenOnboarding,
  onOpenAuthModal,
  onSwitchRole,
}) => {
  const navigate = useNavigate();
  const [heroSearch, setHeroSearch] = React.useState("");

  const handleSelectCategory = (cat: CoreCategory) => {
    navigate(`/browse?category=${encodeURIComponent(cat)}`);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleSelectFormat = (formatExt: string) => {
    navigate(`/browse?format=${encodeURIComponent(formatExt)}`);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleSearchSubmit = () => {
    if (heroSearch.trim()) {
      navigate(`/browse?q=${encodeURIComponent(heroSearch.trim())}`);
    } else {
      navigate("/browse");
    }
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const featuredListings = listings.filter((l) => l.featured).slice(0, 4);
  const isSeller = userProfile.role === "seller";

  return (
    <div className="space-y-0">
      
      {/* Role Action Banner for Authenticated Users Only */}
      {isAuthenticated ? (
        <div className="bg-[#111317] border-b border-[#202C44] py-3.5 px-4">
          <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-3">
              <img
                src={userProfile.avatar}
                alt={userProfile.name}
                className="w-8 h-8 rounded-xl object-cover border border-[#202C44]"
              />
              <div>
                <div className="text-white font-bold flex items-center gap-1.5">
                  <span>Welcome back, {userProfile.name}!</span>
                  <span className="text-[10px] bg-[#202C44] text-[#D3CCB0] px-2 py-0.5 rounded font-mono border border-[#202C44] capitalize">
                    {isSeller ? "Seller Studio" : "Buyer Mode"}
                  </span>
                </div>
                <p className="text-[11px] text-[#7B8A90]">
                  {isSeller
                    ? "Manage your active listings, track 90% revenue, or upload new source code."
                    : "Discover, bookmark, and buy verified digital assets with instant UPI delivery."}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              {isSeller ? (
                <button
                  onClick={() => navigate("/seller")}
                  className="bg-[#D3CCB0] text-[#000000] font-bold px-3.5 py-1.5 rounded-lg flex items-center gap-1.5 shadow"
                >
                  <PlusCircle className="w-3.5 h-3.5" />
                  <span>Go to Seller Studio</span>
                </button>
              ) : (
                <button
                  onClick={() => navigate("/purchases")}
                  className="bg-[#202C44] hover:bg-[#202C44]/80 text-[#D3CCB0] font-bold px-3.5 py-1.5 rounded-lg border border-[#202C44] flex items-center gap-1.5"
                >
                  <ShoppingBag className="w-3.5 h-3.5" />
                  <span>View My Downloads</span>
                </button>
              )}

              <button
                onClick={() => onSwitchRole(isSeller ? "buyer" : "seller")}
                className="text-[#7B8A90] hover:text-white underline text-[11px] font-mono flex items-center gap-1 px-2"
              >
                <Repeat className="w-3 h-3" />
                <span>Switch to {isSeller ? "Buyer" : "Seller"}</span>
              </button>
            </div>
          </div>
        </div>
      ) : null}

      {/* Hero Section */}
      <HeroSection
        onExploreClick={() => navigate("/browse")}
        onSelectCategory={handleSelectCategory}
        searchQuery={heroSearch}
        setSearchQuery={setHeroSearch}
        onSearchSubmit={handleSearchSubmit}
      />

      {/* Category Showcase (6 Core Sectors) */}
      <CategoryShowcase onSelectCategory={handleSelectCategory} />

      {/* Featured Listings Grid */}
      <section className="py-16 bg-[#111317] border-b border-[#202C44]/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
            <div>
              <div className="inline-flex items-center gap-2 text-[#D3CCB0] text-xs font-mono uppercase tracking-wider mb-2">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Curated Assets</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-heading font-bold text-white tracking-tight">
                Top Trending Indian Creator Assets
              </h2>
            </div>

            <button
              onClick={() => {
                navigate("/browse");
                window.scrollTo({ top: 0, behavior: "smooth" });
              }}
              className="text-xs font-bold text-[#D3CCB0] hover:underline flex items-center gap-1"
            >
              <span>View All {listings.length} Listings</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredListings.map((item) => (
              <ListingCard
                key={item.id}
                listing={item}
                onSelectListing={(asset) => {
                  navigate(`/asset/${asset.id}`);
                  window.scrollTo({ top: 0, behavior: "smooth" });
                }}
                onBuyNowDirect={onBuyNowDirect}
                isSaved={savedIds.includes(item.id)}
                onToggleSave={onToggleSave}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Breadth of 239 Categories & 100+ File Formats */}
      <FileFormatsBreadth onSelectFormat={handleSelectFormat} />

      {/* How It Works (Buyers vs Sellers) */}
      <HowItWorks />
    </div>
  );
};

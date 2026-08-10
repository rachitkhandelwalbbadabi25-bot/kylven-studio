import React, { useMemo } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { AssetListing, CoreCategory } from "../types";
import { CATEGORIES_LIST, FILE_FORMATS_CATALOG } from "../data/mockData";
import { ListingCard } from "../components/ListingCard";
import { Search, ArrowUpDown, X, RotateCcw } from "lucide-react";

interface BrowsePageProps {
  listings: AssetListing[];
  savedIds: string[];
  onToggleSave: (id: string) => void;
  onBuyNowDirect: (listing: AssetListing) => void;
}

export const BrowsePage: React.FC<BrowsePageProps> = ({
  listings,
  savedIds,
  onToggleSave,
  onBuyNowDirect,
}) => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  // Read URL query params
  const selectedCategory = (searchParams.get("category") as CoreCategory | "All") || "All";
  const searchQuery = searchParams.get("q") || "";
  const selectedFormat = searchParams.get("format") || "";
  const sortBy = (searchParams.get("sort") as "popular" | "newest" | "price-asc" | "price-desc") || "popular";
  const maxPriceParam = searchParams.get("maxPrice");
  const maxPrice = maxPriceParam ? parseInt(maxPriceParam, 10) : 5000;

  // Helper to update specific params while preserving others
  const updateParams = (updates: Record<string, string | null>) => {
    const newParams = new URLSearchParams(searchParams);
    Object.entries(updates).forEach(([key, val]) => {
      if (val === null || val === "" || val === "All") {
        newParams.delete(key);
      } else {
        newParams.set(key, val);
      }
    });
    setSearchParams(newParams);
  };

  // Filtered and Sorted Listings
  const filteredListings = useMemo(() => {
    return listings
      .filter((item) => {
        // Category filter
        if (selectedCategory !== "All" && item.category !== selectedCategory) {
          return false;
        }

        // Format filter
        if (selectedFormat && !item.fileFormatTags.includes(selectedFormat)) {
          return false;
        }

        // Price filter
        if (item.priceInINR > maxPrice) {
          return false;
        }

        // Search query
        if (searchQuery.trim() !== "") {
          const q = searchQuery.toLowerCase();
          const matchesTitle = item.title.toLowerCase().includes(q);
          const matchesDesc = item.description.toLowerCase().includes(q);
          const matchesSeller = item.seller.name.toLowerCase().includes(q);
          const matchesSub = item.subcategory.toLowerCase().includes(q);
          const matchesFormat = item.fileFormatTags.some((f) => f.toLowerCase().includes(q));

          return matchesTitle || matchesDesc || matchesSeller || matchesSub || matchesFormat;
        }

        return true;
      })
      .sort((a, b) => {
        if (sortBy === "popular") return b.salesCount - a.salesCount;
        if (sortBy === "newest") return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        if (sortBy === "price-asc") return a.priceInINR - b.priceInINR;
        if (sortBy === "price-desc") return b.priceInINR - a.priceInINR;
        return 0;
      });
  }, [listings, selectedCategory, searchQuery, selectedFormat, sortBy, maxPrice]);

  const handleResetFilters = () => {
    setSearchParams({});
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Page Title & Stats */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-[#202C44] pb-6">
        <div>
          <div className="flex items-center gap-2">
            <span className="bg-[#202C44] text-[#D3CCB0] text-xs font-mono font-bold px-2.5 py-0.5 rounded border border-[#202C44]">
              Marketplace Feed
            </span>
            <span className="text-xs text-[#7B8A90]">/ Direct UPI Access</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-heading font-extrabold text-white tracking-tight mt-1">
            Browse Digital Creator Assets
          </h1>
          <p className="text-xs sm:text-sm text-[#7B8A90] mt-0.5">
            Showing {filteredListings.length} verified digital items ready for instant download.
          </p>
        </div>

        {/* Sort dropdown */}
        <div className="flex items-center gap-2">
          <ArrowUpDown className="w-4 h-4 text-[#7B8A90]" />
          <span className="text-xs text-[#7B8A90] font-medium hidden sm:inline">Sort by:</span>
          <select
            value={sortBy}
            onChange={(e) => updateParams({ sort: e.target.value === "popular" ? null : e.target.value })}
            className="bg-[#111317] text-white text-xs p-2.5 rounded-xl border border-[#202C44] focus:outline-none focus:border-[#D3CCB0] font-medium"
          >
            <option value="popular">Most Popular / Highest Sales</option>
            <option value="newest">Newest Releases</option>
            <option value="price-asc">Price: Low to High</option>
            <option value="price-desc">Price: High to Low</option>
          </select>
        </div>
      </div>

      {/* Category Pills Bar */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        <button
          onClick={() => updateParams({ category: null })}
          className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all border ${
            selectedCategory === "All"
              ? "bg-[#D3CCB0] text-[#000000] border-[#D3CCB0] shadow"
              : "bg-[#202C44] text-[#7B8A90] hover:text-white border-[#202C44]"
          }`}
        >
          All Sectors ({listings.length})
        </button>

        {CATEGORIES_LIST.map((cat) => (
          <button
            key={cat.name}
            onClick={() => updateParams({ category: cat.name })}
            className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all border ${
              selectedCategory === cat.name
                ? "bg-[#D3CCB0] text-[#000000] border-[#D3CCB0] shadow"
                : "bg-[#202C44] text-[#7B8A90] hover:text-white border-[#202C44]"
            }`}
          >
            {cat.name}
          </button>
        ))}
      </div>

      {/* Filter Toolbar (Formats & Search Active Badges) */}
      <div className="bg-[#111317] border border-[#202C44] rounded-2xl p-4 space-y-3">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          
          {/* Format extension chips */}
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="text-xs text-[#7B8A90] font-mono mr-1">File Extensions:</span>
            {FILE_FORMATS_CATALOG.slice(0, 10).map((fmt) => (
              <button
                key={fmt.ext}
                onClick={() =>
                  updateParams({ format: selectedFormat === fmt.ext ? null : fmt.ext })
                }
                className={`text-[10px] font-mono px-2.5 py-1 rounded-md border transition-all ${
                  selectedFormat === fmt.ext
                    ? "bg-[#D3CCB0] text-[#000000] border-[#D3CCB0] font-bold"
                    : "bg-[#202C44] text-[#7B8A90] hover:text-white border-[#202C44]"
                }`}
              >
                {fmt.ext}
              </button>
            ))}
          </div>

          {/* Price Range Slider */}
          <div className="flex items-center gap-3 text-xs text-[#7B8A90] shrink-0">
            <span>Max Price:</span>
            <input
              type="range"
              min={500}
              max={5000}
              step={100}
              value={maxPrice}
              onChange={(e) => updateParams({ maxPrice: e.target.value === "5000" ? null : e.target.value })}
              className="accent-[#D3CCB0] cursor-pointer"
            />
            <span className="font-mono text-white font-bold">₹{maxPrice.toLocaleString("en-IN")}</span>
          </div>
        </div>

        {/* Active Filters Bar if any */}
        {(selectedCategory !== "All" || selectedFormat !== "" || searchQuery !== "" || maxPrice < 5000) && (
          <div className="pt-2 border-t border-[#202C44] flex flex-wrap items-center gap-2 text-xs">
            <span className="text-[#7B8A90]">Active Filters:</span>

            {selectedCategory !== "All" && (
              <span className="bg-[#202C44] text-[#D3CCB0] px-2.5 py-0.5 rounded-full flex items-center gap-1 border border-[#202C44]">
                Category: {selectedCategory}
                <X className="w-3 h-3 cursor-pointer hover:text-white" onClick={() => updateParams({ category: null })} />
              </span>
            )}

            {selectedFormat && (
              <span className="bg-[#202C44] text-[#D3CCB0] font-mono px-2.5 py-0.5 rounded-full flex items-center gap-1 border border-[#202C44]">
                Format: {selectedFormat}
                <X className="w-3 h-3 cursor-pointer hover:text-white" onClick={() => updateParams({ format: null })} />
              </span>
            )}

            {searchQuery && (
              <span className="bg-[#202C44] text-white px-2.5 py-0.5 rounded-full flex items-center gap-1 border border-[#202C44]">
                Query: "{searchQuery}"
                <X className="w-3 h-3 cursor-pointer hover:text-white" onClick={() => updateParams({ q: null })} />
              </span>
            )}

            {maxPrice < 5000 && (
              <span className="bg-[#202C44] text-[#D3CCB0] px-2.5 py-0.5 rounded-full flex items-center gap-1 border border-[#202C44]">
                Max ₹{maxPrice}
                <X className="w-3 h-3 cursor-pointer hover:text-white" onClick={() => updateParams({ maxPrice: null })} />
              </span>
            )}

            <button
              onClick={handleResetFilters}
              className="text-[#D3CCB0] hover:underline flex items-center gap-1 text-xs ml-auto"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Reset All</span>
            </button>
          </div>
        )}
      </div>

      {/* Grid of Listing Cards */}
      {filteredListings.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredListings.map((item) => (
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
      ) : (
        /* Empty State */
        <div className="bg-[#111317] border border-[#202C44] rounded-2xl p-12 text-center space-y-4 max-w-md mx-auto my-12">
          <div className="w-12 h-12 rounded-2xl bg-[#202C44] text-[#D3CCB0] flex items-center justify-center mx-auto">
            <Search className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-base font-heading font-bold text-white">No Assets Found</h3>
            <p className="text-xs text-[#7B8A90] mt-1">
              Try adjusting your category filters, search terms, or price range.
            </p>
          </div>
          <button
            onClick={handleResetFilters}
            className="bg-[#D3CCB0] text-[#000000] text-xs font-bold px-4 py-2 rounded-xl shadow"
          >
            Clear All Filters
          </button>
        </div>
      )}
    </div>
  );
};

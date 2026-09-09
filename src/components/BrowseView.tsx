import React, { useState, useMemo } from "react";
import { AssetListing, CoreCategory, FilterOptions } from "../types";
import { CATEGORIES_LIST, FILE_FORMATS_CATALOG } from "../data/mockData";
import { ListingCard } from "./ListingCard";
import { Search, SlidersHorizontal, ArrowUpDown, X, RotateCcw } from "lucide-react";

interface BrowseViewProps {
  listings: AssetListing[];
  onSelectListing: (listing: AssetListing) => void;
  onBuyNowDirect: (listing: AssetListing) => void;
  savedIds: string[];
  onToggleSave: (id: string) => void;
  initialCategory?: CoreCategory | "All";
  initialSearchQuery?: string;
  initialFormat?: string;
}

export const BrowseView: React.FC<BrowseViewProps> = ({
  listings,
  onSelectListing,
  onBuyNowDirect,
  savedIds,
  onToggleSave,
  initialCategory = "All",
  initialSearchQuery = "",
  initialFormat = "",
}) => {
  const [selectedCategory, setSelectedCategory] = useState<CoreCategory | "All">(initialCategory);
  const [searchQuery, setSearchQuery] = useState<string>(initialSearchQuery);
  const [selectedFormat, setSelectedFormat] = useState<string>(initialFormat);
  const [sortBy, setSortBy] = useState<"popular" | "newest" | "price-asc" | "price-desc">("popular");
  const [maxPrice, setMaxPrice] = useState<number>(5000);

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
          const matchesSeller = (item.creator?.name || item.seller?.name || "").toLowerCase().includes(q);
          const matchesSub = item.subcategory.toLowerCase().includes(q);
          const matchesFormat = item.fileFormatTags.some((f) => f.toLowerCase().includes(q));

          return matchesTitle || matchesDesc || matchesSeller || matchesSub || matchesFormat;
        }

        return true;
      })
      .sort((a, b) => {
        if (sortBy === "popular") return b.salesCount - a.salesCount;
        if (sortBy === "newest") {
          const parseTime = (val: any): number => {
            if (typeof val === "number" && !isNaN(val)) return val;
            if (typeof val === "string") {
              const t = new Date(val).getTime();
              return isNaN(t) ? 0 : t;
            }
            if (val && typeof val === "object") return Date.now();
            return 0;
          };
          return parseTime(b.createdAt) - parseTime(a.createdAt);
        }
        if (sortBy === "price-asc") return a.priceInINR - b.priceInINR;
        if (sortBy === "price-desc") return b.priceInINR - a.priceInINR;
        return 0;
      });
  }, [listings, selectedCategory, searchQuery, selectedFormat, sortBy, maxPrice]);

  const handleResetFilters = () => {
    setSelectedCategory("All");
    setSearchQuery("");
    setSelectedFormat("");
    setMaxPrice(5000);
    setSortBy("popular");
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
            onChange={(e) => setSortBy(e.target.value as any)}
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
          onClick={() => setSelectedCategory("All")}
          className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all border ${
            selectedCategory === "All"
              ? "bg-[#D3CCB0] text-[#000000] border-[#D3CCB0] shadow"
              : "bg-[#202C44] text-[#7B8A90] hover:text-white border-[#202C44]"
          }`}
        >
          All Sectors ({listings.length})
        </button>

        {CATEGORIES_LIST.map((cat) => {
          const displayLabel = cat.id === 7 ? "Other (Planners, Presets, eBooks)" : cat.name;
          return (
            <button
              key={cat.name}
              onClick={() => setSelectedCategory(cat.name)}
              className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all border ${
                selectedCategory === cat.name
                  ? "bg-[#D3CCB0] text-[#000000] border-[#D3CCB0] shadow"
                  : "bg-[#202C44] text-[#7B8A90] hover:text-white border-[#202C44]"
              }`}
            >
              <span className="font-mono opacity-60 mr-1">{cat.id}.</span>
              {displayLabel}
            </button>
          );
        })}
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
                  setSelectedFormat(selectedFormat === fmt.ext ? "" : fmt.ext)
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
              onChange={(e) => setMaxPrice(Number(e.target.value))}
              className="accent-[#D3CCB0] cursor-pointer"
            />
            <span className="font-mono text-white font-bold">₹{maxPrice.toLocaleString("en-IN")}</span>
          </div>

        </div>

        {/* Active Filters Bar if any */}
        {(selectedCategory !== "All" || selectedFormat !== "" || searchQuery !== "") && (
          <div className="pt-2 border-t border-[#202C44] flex flex-wrap items-center gap-2 text-xs">
            <span className="text-[#7B8A90]">Active Filters:</span>

            {selectedCategory !== "All" && (
              <span className="bg-[#202C44] text-[#D3CCB0] px-2.5 py-0.5 rounded-full flex items-center gap-1 border border-[#202C44]">
                Category: {selectedCategory}
                <X className="w-3 h-3 cursor-pointer" onClick={() => setSelectedCategory("All")} />
              </span>
            )}

            {selectedFormat && (
              <span className="bg-[#202C44] text-[#D3CCB0] font-mono px-2.5 py-0.5 rounded-full flex items-center gap-1 border border-[#202C44]">
                Format: {selectedFormat}
                <X className="w-3 h-3 cursor-pointer" onClick={() => setSelectedFormat("")} />
              </span>
            )}

            {searchQuery && (
              <span className="bg-[#202C44] text-white px-2.5 py-0.5 rounded-full flex items-center gap-1 border border-[#202C44]">
                Query: "{searchQuery}"
                <X className="w-3 h-3 cursor-pointer" onClick={() => setSearchQuery("")} />
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
              onSelectListing={onSelectListing}
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

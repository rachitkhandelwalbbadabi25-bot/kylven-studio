import React, { useMemo, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { AssetListing, CoreCategory } from "../types";
import { CATEGORIES_LIST, FILE_FORMATS_CATALOG } from "../data/mockData";
import { ListingCard } from "../components/ListingCard";
import {
  Search,
  ArrowUpDown,
  X,
  RotateCcw,
  Filter,
  Layers,
  FileCode,
  IndianRupee,
  SlidersHorizontal,
  Star
} from "lucide-react";

interface BrowsePageProps {
  listings: AssetListing[];
  savedIds?: string[];
  onToggleSave?: (id: string) => void;
  onBuyNowDirect?: (listing: AssetListing) => void;
}

export const BrowsePage: React.FC<BrowsePageProps> = ({
  listings,
  savedIds = [],
  onToggleSave,
  onBuyNowDirect,
}) => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);

  // Read URL query params
  const selectedCategory = (searchParams.get("category") as CoreCategory | "All") || "All";
  const searchQuery = searchParams.get("q") || "";
  const selectedFormat = searchParams.get("format") || "";
  const priceType = searchParams.get("priceType") || "all"; // 'all' | 'free' | 'paid'
  const sortBy = (searchParams.get("sort") as "popular" | "newest" | "price-asc" | "price-desc" | "rating") || "popular";
  const maxPriceParam = searchParams.get("maxPrice");
  const maxPrice = maxPriceParam ? parseInt(maxPriceParam, 10) : 5000;

  // Helper to update specific params while preserving others
  const updateParams = (updates: Record<string, string | null>) => {
    const newParams = new URLSearchParams(searchParams);
    Object.entries(updates).forEach(([key, val]) => {
      if (val === null || val === "" || val === "All" || (key === "priceType" && val === "all") || (key === "maxPrice" && val === "5000")) {
        newParams.delete(key);
      } else {
        newParams.set(key, val);
      }
    });
    setSearchParams(newParams);
  };

  const handleResetFilters = () => {
    setSearchParams({});
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
        if (
          selectedFormat &&
          !item.fileFormatTags.includes(selectedFormat) &&
          item.fileType !== selectedFormat &&
          !item.fileFormatTags.some((f) => f.toLowerCase() === selectedFormat.toLowerCase())
        ) {
          return false;
        }

        // Price Type filter (Free vs Paid)
        if (priceType === "free" && item.priceInINR !== 0) {
          return false;
        }
        if (priceType === "paid" && item.priceInINR === 0) {
          return false;
        }

        // Price Max Range Slider filter
        if (item.priceInINR > maxPrice) {
          return false;
        }

        // Search query filter (matches title, creator, category, file type, tags, description)
        if (searchQuery.trim() !== "") {
          const q = searchQuery.toLowerCase();
          const matchesTitle = item.title.toLowerCase().includes(q);
          const matchesDesc = (item.shortDescription || item.description || "").toLowerCase().includes(q);
          const matchesCreator = (item.creator?.name || item.seller?.name || "").toLowerCase().includes(q);
          const matchesSub = item.subcategory?.toLowerCase().includes(q);
          const matchesCategory = item.category?.toLowerCase().includes(q);
          const matchesFileType = item.fileType?.toLowerCase().includes(q);
          const matchesFormat = item.fileFormatTags?.some((f) => f.toLowerCase().includes(q));
          const matchesTags = item.tags?.some((t) => t.toLowerCase().includes(q));

          return (
            matchesTitle ||
            matchesDesc ||
            matchesCreator ||
            matchesSub ||
            matchesCategory ||
            matchesFileType ||
            matchesFormat ||
            matchesTags
          );
        }

        return true;
      })
      .sort((a, b) => {
        if (sortBy === "popular") return b.salesCount - a.salesCount;
        if (sortBy === "newest") return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        if (sortBy === "price-asc") return a.priceInINR - b.priceInINR;
        if (sortBy === "price-desc") return b.priceInINR - a.priceInINR;
        if (sortBy === "rating") return b.rating - a.rating;
        return 0;
      });
  }, [listings, selectedCategory, searchQuery, selectedFormat, priceType, sortBy, maxPrice]);

  const hasActiveFilters =
    selectedCategory !== "All" ||
    selectedFormat !== "" ||
    priceType !== "all" ||
    searchQuery !== "" ||
    maxPrice < 5000;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8" id="marketplace-browse-page">
      
      {/* Top Header & Search Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#202C44] pb-6">
        <div>
          <div className="flex items-center gap-2">
            <span className="bg-[#202C44] text-[#D3CCB0] text-xs font-mono font-bold px-2.5 py-0.5 rounded border border-[#202C44]">
              Verified Catalog
            </span>
            <span className="text-xs text-[#7B8A90]">/ Instant Downloads</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-heading font-extrabold text-white tracking-tight mt-1">
            Browse Digital Assets
          </h1>
          <p className="text-xs sm:text-sm text-[#7B8A90] mt-0.5">
            {searchQuery ? (
              <span>
                Showing {filteredListings.length} {filteredListings.length === 1 ? "result" : "results"} for{" "}
                <strong className="text-white">"{searchQuery}"</strong>
              </span>
            ) : (
              <span>Showing {filteredListings.length} verified assets ready for production use</span>
            )}
          </p>
        </div>

        {/* Mobile Filter Toggle & Desktop Sort */}
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setIsMobileFilterOpen(!isMobileFilterOpen)}
            className="md:hidden flex items-center gap-2 bg-[#111317] border border-[#202C44] text-[#D3CCB0] text-xs font-bold px-3.5 py-2.5 rounded-xl"
          >
            <Filter className="w-4 h-4" />
            <span>Filters ({hasActiveFilters ? "Active" : "All"})</span>
          </button>

          {/* Sort dropdown */}
          <div className="flex items-center gap-2 bg-[#111317] border border-[#202C44] px-3 py-1.5 rounded-xl">
            <ArrowUpDown className="w-4 h-4 text-[#7B8A90]" />
            <span className="text-xs text-[#7B8A90] font-medium hidden sm:inline">Sort:</span>
            <select
              id="browse-sort-select"
              value={sortBy}
              onChange={(e) => updateParams({ sort: e.target.value === "popular" ? null : e.target.value })}
              className="bg-transparent text-white text-xs py-1 pr-2 focus:outline-none cursor-pointer font-medium"
            >
              <option value="popular" className="bg-[#111317]">Trending / Popular</option>
              <option value="newest" className="bg-[#111317]">Newest Releases</option>
              <option value="rating" className="bg-[#111317]">Highest Rated</option>
              <option value="price-asc" className="bg-[#111317]">Price: Low to High</option>
              <option value="price-desc" className="bg-[#111317]">Price: High to Low</option>
            </select>
          </div>
        </div>
      </div>

      {/* Two-Column Marketplace Layout */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
        
        {/* Left Column: Filter Sidebar (4 cols on md, 3 cols on lg) */}
        <aside
          id="browse-filter-sidebar"
          className={`md:col-span-4 lg:col-span-3 space-y-6 ${
            isMobileFilterOpen ? "block" : "hidden md:block"
          }`}
        >
          <div className="bg-[#111317] border border-[#202C44] rounded-2xl p-5 space-y-6 sticky top-24 shadow-xl">
            
            <div className="flex items-center justify-between border-b border-[#202C44] pb-3">
              <div className="flex items-center gap-2 text-white font-heading font-bold text-sm">
                <SlidersHorizontal className="w-4 h-4 text-[#D3CCB0]" />
                <span>Filters</span>
              </div>
              {hasActiveFilters && (
                <button
                  onClick={handleResetFilters}
                  className="text-[11px] font-mono text-[#D3CCB0] hover:underline flex items-center gap-1"
                >
                  <RotateCcw className="w-3 h-3" />
                  <span>Reset</span>
                </button>
              )}
            </div>

            {/* 1. Category Filter */}
            <div className="space-y-2">
              <label className="text-xs font-mono uppercase tracking-wider text-[#7B8A90] font-semibold flex items-center gap-1.5">
                <Layers className="w-3.5 h-3.5 text-[#D3CCB0]" />
                <span>Category</span>
              </label>
              <div className="space-y-1">
                <button
                  type="button"
                  onClick={() => updateParams({ category: null })}
                  className={`w-full text-left px-3 py-1.5 rounded-lg text-xs font-medium transition-colors flex items-center justify-between ${
                    selectedCategory === "All"
                      ? "bg-[#D3CCB0] text-[#000000] font-bold"
                      : "text-[#7B8A90] hover:text-white hover:bg-[#202C44]/50"
                  }`}
                >
                  <span>All Categories</span>
                  <span className="text-[10px] font-mono opacity-80">{listings.length}</span>
                </button>

                {CATEGORIES_LIST.map((cat) => {
                  const count = listings.filter((l) => l.category === cat.name).length;
                  return (
                    <button
                      key={cat.name}
                      type="button"
                      onClick={() => updateParams({ category: cat.name })}
                      className={`w-full text-left px-3 py-1.5 rounded-lg text-xs font-medium transition-colors flex items-center justify-between ${
                        selectedCategory === cat.name
                          ? "bg-[#D3CCB0] text-[#000000] font-bold"
                          : "text-[#7B8A90] hover:text-white hover:bg-[#202C44]/50"
                      }`}
                    >
                      <span className="truncate">{cat.name}</span>
                      <span className="text-[10px] font-mono opacity-80 shrink-0 ml-1">{count}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* 2. Price Filter (All / Free / Paid) */}
            <div className="space-y-3 pt-4 border-t border-[#202C44]">
              <label className="text-xs font-mono uppercase tracking-wider text-[#7B8A90] font-semibold flex items-center gap-1.5">
                <IndianRupee className="w-3.5 h-3.5 text-[#D3CCB0]" />
                <span>Pricing Model</span>
              </label>
              
              <div className="grid grid-cols-3 gap-1 bg-[#000000] p-1 rounded-xl border border-[#202C44]">
                {[
                  { key: "all", label: "All" },
                  { key: "free", label: "Free (₹0)" },
                  { key: "paid", label: "Paid" },
                ].map((item) => (
                  <button
                    key={item.key}
                    type="button"
                    onClick={() => updateParams({ priceType: item.key === "all" ? null : item.key })}
                    className={`py-1.5 text-[11px] font-semibold rounded-lg transition-all ${
                      priceType === item.key
                        ? "bg-[#D3CCB0] text-[#000000] shadow"
                        : "text-[#7B8A90] hover:text-white"
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>

              {/* Price Range Slider */}
              {priceType !== "free" && (
                <div className="space-y-2 pt-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-[#7B8A90]">Max Price:</span>
                    <span className="font-mono text-[#D3CCB0] font-bold">₹{maxPrice.toLocaleString("en-IN")}</span>
                  </div>
                  <input
                    type="range"
                    min={300}
                    max={5000}
                    step={100}
                    value={maxPrice}
                    onChange={(e) => updateParams({ maxPrice: e.target.value === "5000" ? null : e.target.value })}
                    className="w-full accent-[#D3CCB0] cursor-pointer"
                  />
                  <div className="flex items-center justify-between text-[10px] text-[#7B8A90] font-mono">
                    <span>₹300</span>
                    <span>₹5,000+</span>
                  </div>
                </div>
              )}
            </div>

            {/* 3. File Formats Checkboxes / Pills */}
            <div className="space-y-2.5 pt-4 border-t border-[#202C44]">
              <label className="text-xs font-mono uppercase tracking-wider text-[#7B8A90] font-semibold flex items-center gap-1.5">
                <FileCode className="w-3.5 h-3.5 text-[#D3CCB0]" />
                <span>File Format</span>
              </label>
              
              <div className="flex flex-wrap gap-1.5 max-h-48 overflow-y-auto pr-1">
                {FILE_FORMATS_CATALOG.slice(0, 12).map((fmt) => (
                  <button
                    key={fmt.ext}
                    type="button"
                    onClick={() =>
                      updateParams({ format: selectedFormat === fmt.ext ? null : fmt.ext })
                    }
                    className={`text-[11px] font-mono px-2.5 py-1 rounded-lg border transition-all ${
                      selectedFormat === fmt.ext
                        ? "bg-[#D3CCB0] text-[#000000] border-[#D3CCB0] font-bold"
                        : "bg-[#202C44]/50 text-[#7B8A90] hover:text-white border-[#202C44]"
                    }`}
                  >
                    {fmt.ext}
                  </button>
                ))}
              </div>
            </div>

            {/* Mobile close filters button */}
            <button
              type="button"
              onClick={() => setIsMobileFilterOpen(false)}
              className="md:hidden w-full bg-[#202C44] text-[#D3CCB0] text-xs font-bold py-2 rounded-xl"
            >
              Apply Filters ({filteredListings.length} items)
            </button>

          </div>
        </aside>

        {/* Right Column: Listing Results & Active Badges (8 cols on md, 9 cols on lg) */}
        <main className="md:col-span-8 lg:col-span-9 space-y-6">
          
          {/* Active Filter Badges Bar */}
          {hasActiveFilters && (
            <div className="flex flex-wrap items-center gap-2 bg-[#111317] border border-[#202C44] p-3 rounded-2xl text-xs">
              <span className="text-[#7B8A90] font-medium text-xs mr-1">Active filters:</span>

              {selectedCategory !== "All" && (
                <span className="bg-[#202C44] text-[#D3CCB0] px-2.5 py-1 rounded-lg flex items-center gap-1.5 border border-[#202C44]">
                  <span>Category: {selectedCategory}</span>
                  <X
                    className="w-3.5 h-3.5 cursor-pointer hover:text-white"
                    onClick={() => updateParams({ category: null })}
                  />
                </span>
              )}

              {selectedFormat && (
                <span className="bg-[#202C44] text-[#D3CCB0] font-mono px-2.5 py-1 rounded-lg flex items-center gap-1.5 border border-[#202C44]">
                  <span>Format: {selectedFormat}</span>
                  <X
                    className="w-3.5 h-3.5 cursor-pointer hover:text-white"
                    onClick={() => updateParams({ format: null })}
                  />
                </span>
              )}

              {priceType !== "all" && (
                <span className="bg-[#202C44] text-[#D3CCB0] px-2.5 py-1 rounded-lg flex items-center gap-1.5 border border-[#202C44]">
                  <span>Price: {priceType === "free" ? "Free Only" : "Paid Only"}</span>
                  <X
                    className="w-3.5 h-3.5 cursor-pointer hover:text-white"
                    onClick={() => updateParams({ priceType: null })}
                  />
                </span>
              )}

              {searchQuery && (
                <span className="bg-[#202C44] text-white px-2.5 py-1 rounded-lg flex items-center gap-1.5 border border-[#202C44]">
                  <span>Search: "{searchQuery}"</span>
                  <X
                    className="w-3.5 h-3.5 cursor-pointer hover:text-white"
                    onClick={() => updateParams({ q: null })}
                  />
                </span>
              )}

              {maxPrice < 5000 && (
                <span className="bg-[#202C44] text-[#D3CCB0] px-2.5 py-1 rounded-lg flex items-center gap-1.5 border border-[#202C44]">
                  <span>Max: ₹{maxPrice}</span>
                  <X
                    className="w-3.5 h-3.5 cursor-pointer hover:text-white"
                    onClick={() => updateParams({ maxPrice: null })}
                  />
                </span>
              )}

              <button
                onClick={handleResetFilters}
                className="text-[#D3CCB0] hover:underline flex items-center gap-1 text-xs ml-auto font-mono"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Reset All</span>
              </button>
            </div>
          )}

          {/* Results Grid (2-3 columns on desktop) */}
          {filteredListings.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6" id="browse-results-grid">
              {filteredListings.map((item) => (
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
          ) : (
            /* Premium Empty State with Category Recommendations */
            <div className="bg-[#111317] border border-[#202C44] rounded-3xl p-10 sm:p-14 text-center space-y-6 max-w-lg mx-auto my-6 shadow-2xl">
              <div className="w-16 h-16 rounded-2xl bg-[#202C44] text-[#D3CCB0] flex items-center justify-center mx-auto border border-[#202C44] shadow-lg">
                <Search className="w-8 h-8" />
              </div>
              
              <div className="space-y-2">
                <h3 className="text-xl font-heading font-bold text-white">No Matching Assets Found</h3>
                <p className="text-xs sm:text-sm text-[#7B8A90] max-w-sm mx-auto leading-relaxed">
                  We couldn't find any listings matching your search or filters. Try exploring one of our most popular categories:
                </p>
              </div>

              {/* Suggested Categories Grid */}
              <div className="flex flex-wrap items-center justify-center gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setSearchParams({ category: "UI/UX & Design" })}
                  className="px-3 py-1.5 rounded-xl bg-[#202C44]/80 hover:bg-[#202C44] text-xs text-[#D3CCB0] hover:text-white border border-[#202C44] transition-colors"
                >
                  UI/UX & Figma
                </button>
                <button
                  type="button"
                  onClick={() => setSearchParams({ category: "Software & Development" })}
                  className="px-3 py-1.5 rounded-xl bg-[#202C44]/80 hover:bg-[#202C44] text-xs text-[#D3CCB0] hover:text-white border border-[#202C44] transition-colors"
                >
                  Flutter & React
                </button>
                <button
                  type="button"
                  onClick={() => setSearchParams({ category: "AI/ML & Data Science" })}
                  className="px-3 py-1.5 rounded-xl bg-[#202C44]/80 hover:bg-[#202C44] text-xs text-[#D3CCB0] hover:text-white border border-[#202C44] transition-colors"
                >
                  AI Notebooks
                </button>
                <button
                  type="button"
                  onClick={() => setSearchParams({ category: "3D & CAD" })}
                  className="px-3 py-1.5 rounded-xl bg-[#202C44]/80 hover:bg-[#202C44] text-xs text-[#D3CCB0] hover:text-white border border-[#202C44] transition-colors"
                >
                  3D Blender Assets
                </button>
              </div>

              <div className="pt-4 border-t border-[#202C44]/60">
                <button
                  onClick={handleResetFilters}
                  className="bg-[#D3CCB0] hover:bg-[#c4bb9a] text-[#000000] text-xs font-heading font-bold px-6 py-3 rounded-xl transition-all shadow active:scale-95"
                >
                  Reset All Filters & View All
                </button>
              </div>
            </div>
          )}

        </main>

      </div>

    </div>
  );
};

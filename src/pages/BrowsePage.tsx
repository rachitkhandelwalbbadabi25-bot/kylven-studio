import React, { useMemo, useState, useEffect } from "react";
import { useSearchParams, useNavigate, Link } from "react-router-dom";
import { AssetListing, CoreCategory } from "../types";
import { CATEGORIES_LIST, FILE_FORMATS_CATALOG } from "../data/mockData";
import { normalizeCategoryName } from "../services/firebaseService";
import { ListingCard } from "../components/ListingCard";
import {
  Search,
  ArrowUpDown,
  X,
  RotateCcw,
  SlidersHorizontal,
  ChevronDown,
  ChevronRight,
  Sparkles,
  Layers,
  Code2,
  Cpu,
  Palette,
  Box,
  Video,
  Briefcase,
  Check,
  IndianRupee,
  FileCode,
  Home,
  CheckCircle2
} from "lucide-react";

interface BrowsePageProps {
  listings: AssetListing[];
  savedIds?: string[];
  onToggleSave?: (id: string) => void;
  onBuyNowDirect?: (listing: AssetListing) => void;
}

const CATEGORY_ICON_MAP: Record<string, React.ElementType> = {
  "Software & Development": Code2,
  "AI / ML & Data Science": Cpu,
  "UI/UX & Design": Palette,
  "3D & CAD": Box,
  "Video / Motion & Audio": Video,
  "Productivity & Business": Briefcase,
};

export const BrowsePage: React.FC<BrowsePageProps> = ({
  listings,
  savedIds = [],
  onToggleSave,
  onBuyNowDirect,
}) => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  // Mobile Drawer states (Flipkart / Amazon style)
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);
  const [isMobileSortOpen, setIsMobileSortOpen] = useState(false);
  const [desktopSortOpen, setDesktopSortOpen] = useState(false);

  // Read URL query params
  const selectedCategory = (searchParams.get("category") as CoreCategory | "All") || "All";
  const searchQuery = searchParams.get("q") || "";
  const selectedFormat = searchParams.get("format") || "";
  const priceType = searchParams.get("priceType") || "all"; // 'all' | 'free' | 'paid'
  const sortBy = (searchParams.get("sort") as "popular" | "newest" | "price-asc" | "price-desc") || "popular";
  const minPriceParam = searchParams.get("minPrice");
  const maxPriceParam = searchParams.get("maxPrice");
  const minPrice = minPriceParam ? parseInt(minPriceParam, 10) : 0;
  const maxPrice = maxPriceParam ? parseInt(maxPriceParam, 10) : 5000;

  // Local state for Min / Max input boxes for smooth typing
  const [localMinPrice, setLocalMinPrice] = useState<string>(minPrice > 0 ? minPrice.toString() : "");
  const [localMaxPrice, setLocalMaxPrice] = useState<string>(maxPrice < 5000 ? maxPrice.toString() : "");

  // Sync local price inputs with URL query params
  useEffect(() => {
    setLocalMinPrice(minPrice > 0 ? minPrice.toString() : "");
    setLocalMaxPrice(maxPrice < 5000 ? maxPrice.toString() : "");
  }, [minPrice, maxPrice]);

  // Lock body scroll when mobile drawer is open
  useEffect(() => {
    if (isMobileFilterOpen || isMobileSortOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isMobileFilterOpen, isMobileSortOpen]);

  // Helper to update specific params while preserving others
  const updateParams = (updates: Record<string, string | null>) => {
    const newParams = new URLSearchParams(searchParams);
    Object.entries(updates).forEach(([key, val]) => {
      if (
        val === null ||
        val === "" ||
        val === "All" ||
        (key === "priceType" && val === "all") ||
        (key === "minPrice" && (val === "0" || val === "")) ||
        (key === "maxPrice" && (val === "5000" || val === "")) ||
        (key === "sort" && val === "popular")
      ) {
        newParams.delete(key);
      } else {
        newParams.set(key, val);
      }
    });
    setSearchParams(newParams);
  };

  const handleResetFilters = () => {
    setSearchParams({});
    setLocalMinPrice("");
    setLocalMaxPrice("");
    setIsMobileFilterOpen(false);
  };

  const handleApplyPriceInputs = () => {
    const parsedMin = parseInt(localMinPrice, 10);
    const parsedMax = parseInt(localMaxPrice, 10);
    updateParams({
      minPrice: !isNaN(parsedMin) && parsedMin > 0 ? parsedMin.toString() : null,
      maxPrice: !isNaN(parsedMax) && parsedMax < 5000 ? parsedMax.toString() : null,
    });
  };

  // Filtered and Sorted Listings
  const filteredListings = useMemo(() => {
    return listings
      .filter((item) => {
        // Exclude soft-deleted listings
        if (item.deleted === true) {
          return false;
        }

        // Category filter (using robust category normalization)
        if (selectedCategory !== "All") {
          const normSelected = normalizeCategoryName(selectedCategory);
          const normItem = normalizeCategoryName(item.category);
          if (normSelected !== normItem && item.category !== selectedCategory) {
            return false;
          }
        }

        // Format filter
        if (
          selectedFormat &&
          !item.fileFormatTags?.includes(selectedFormat) &&
          item.fileType !== selectedFormat &&
          !item.fileFormatTags?.some((f) => f.toLowerCase() === selectedFormat.toLowerCase())
        ) {
          return false;
        }

        const itemPrice = typeof item.price === "number" && !isNaN(item.price) ? item.price : 0;
        const isFree = Boolean(item.isFree || itemPrice === 0);

        // Price Type filter (Free vs Paid)
        if (priceType === "free" && !isFree) {
          return false;
        }
        if (priceType === "paid" && isFree) {
          return false;
        }

        // Price Min & Max Filter
        if (itemPrice < minPrice) {
          return false;
        }
        if (itemPrice > maxPrice) {
          return false;
        }

        // Search query filter
        if (searchQuery.trim() !== "") {
          const q = searchQuery.toLowerCase();
          const matchesTitle = item.title.toLowerCase().includes(q);
          const matchesDesc = (item.shortDescription || item.description || "").toLowerCase().includes(q);
          const matchesCreator = (item.creator?.name || item.seller?.name || item.sellerName || "").toLowerCase().includes(q);
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
        if (sortBy === "popular") return (b.salesCount || 0) - (a.salesCount || 0);
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
        const priceA = typeof a.price === "number" && !isNaN(a.price) ? a.price : 0;
        const priceB = typeof b.price === "number" && !isNaN(b.price) ? b.price : 0;
        if (sortBy === "price-asc") return priceA - priceB;
        if (sortBy === "price-desc") return priceB - priceA;
        return 0;
      });
  }, [listings, selectedCategory, searchQuery, selectedFormat, priceType, sortBy, minPrice, maxPrice]);

  // Active filters count
  const activeFiltersCount =
    (selectedCategory !== "All" ? 1 : 0) +
    (selectedFormat !== "" ? 1 : 0) +
    (priceType !== "all" ? 1 : 0) +
    (searchQuery !== "" ? 1 : 0) +
    (minPrice > 0 ? 1 : 0) +
    (maxPrice < 5000 ? 1 : 0);

  const hasActiveFilters = activeFiltersCount > 0;

  const sortOptions = [
    { key: "popular", label: "Popularity / Trending" },
    { key: "newest", label: "Newest Releases" },
    { key: "price-asc", label: "Price: Low to High" },
    { key: "price-desc", label: "Price: High to Low" },
  ];

  const currentSortLabel = sortOptions.find((s) => s.key === sortBy)?.label || "Popularity / Trending";

  // Reusable Sidebar Content (Used in Desktop Left Sidebar & Mobile Drawer)
  const renderFilterSidebar = (prefix: string) => (
    <div className="space-y-6" id={`${prefix}-filter-sidebar-container`}>
      
      {/* 1. Header: Bold "Filters" title with "Clear All" link */}
      <div className="flex items-center justify-between pb-3 border-b border-[#202C44]">
        <div className="flex items-center gap-2">
          <SlidersHorizontal className="w-4 h-4 text-[#D3CCB0]" />
          <h2 className="font-heading font-extrabold text-white text-base tracking-tight">
            Filters
          </h2>
          {activeFiltersCount > 0 && (
            <span className="text-[10px] font-mono font-bold bg-[#D3CCB0] text-black px-1.5 py-0.2 rounded-full">
              {activeFiltersCount}
            </span>
          )}
        </div>
        {hasActiveFilters && (
          <button
            type="button"
            onClick={handleResetFilters}
            id={`${prefix}-sidebar-clear-all-btn`}
            className="text-xs font-mono font-semibold text-[#D3CCB0] hover:text-white hover:underline transition-colors flex items-center gap-1"
          >
            <RotateCcw className="w-3 h-3" />
            <span>Clear All</span>
          </button>
        )}
      </div>

      {/* 2. Category Section (Vertical list with item counts) */}
      <div className="space-y-3 pb-5 border-b border-[#202C44]">
        <h3 className="text-xs font-mono uppercase tracking-wider text-[#D3CCB0] font-bold">
          Categories
        </h3>
        <div className="space-y-1">
          {/* All Assets Option */}
          <button
            type="button"
            onClick={() => updateParams({ category: null })}
            className={`w-full text-left px-3 py-2 rounded-xl text-xs flex items-center justify-between transition-colors ${
              selectedCategory === "All"
                ? "bg-[#D3CCB0] text-[#000000] font-bold shadow-sm"
                : "text-[#7B8A90] hover:text-white hover:bg-[#202C44]/50"
            }`}
          >
            <div className="flex items-center gap-2">
              <Layers className="w-3.5 h-3.5 shrink-0" />
              <span>All Categories</span>
            </div>
            <span
              className={`text-[10px] font-mono px-1.5 py-0.2 rounded-md ${
                selectedCategory === "All"
                  ? "bg-[#000000]/20 text-[#000000] font-bold"
                  : "bg-[#202C44] text-[#7B8A90]"
              }`}
            >
              {listings.filter((l) => l.deleted !== true).length}
            </span>
          </button>

          {/* Individual Categories */}
          {CATEGORIES_LIST.map((cat) => {
            const count = listings.filter((l) => l.deleted !== true && l.category === cat.name).length;
            const IconComp = CATEGORY_ICON_MAP[cat.name] || Sparkles;
            const isSelected = selectedCategory === cat.name;

            return (
              <button
                key={`${prefix}-cat-${cat.id || cat.name}`}
                type="button"
                onClick={() => updateParams({ category: isSelected ? null : cat.name })}
                className={`w-full text-left px-3 py-2 rounded-xl text-xs flex items-center justify-between transition-colors ${
                  isSelected
                    ? "bg-[#D3CCB0] text-[#000000] font-bold shadow-sm"
                    : "text-[#7B8A90] hover:text-white hover:bg-[#202C44]/50"
                }`}
              >
                <div className="flex items-center gap-2 truncate pr-1">
                  <IconComp className="w-3.5 h-3.5 shrink-0" />
                  <span className="truncate">{cat.name}</span>
                </div>
                <span
                  className={`text-[10px] font-mono px-1.5 py-0.2 rounded-md shrink-0 ${
                    isSelected
                      ? "bg-[#000000]/20 text-[#000000] font-bold"
                      : "bg-[#202C44] text-[#7B8A90]"
                  }`}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 3. Price Section: Slider + Min/Max Boxes (Flipkart / Amazon Style) */}
      <div className="space-y-3.5 pb-5 border-b border-[#202C44]">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-mono uppercase tracking-wider text-[#D3CCB0] font-bold">
            Price Range
          </h3>
          {(minPrice > 0 || maxPrice < 5000) && (
            <button
              type="button"
              onClick={() => {
                setLocalMinPrice("");
                setLocalMaxPrice("");
                updateParams({ minPrice: null, maxPrice: null });
              }}
              className="text-[10px] font-mono text-[#D3CCB0] hover:underline"
            >
              Reset
            </button>
          )}
        </div>

        {/* Range Slider */}
        <div className="space-y-2">
          <input
            type="range"
            min={0}
            max={5000}
            step={100}
            value={maxPrice}
            onChange={(e) => {
              const val = e.target.value;
              setLocalMaxPrice(val === "5000" ? "" : val);
              updateParams({ maxPrice: val === "5000" ? null : val });
            }}
            className="w-full accent-[#D3CCB0] cursor-pointer"
          />
          <div className="flex items-center justify-between text-[10px] text-[#7B8A90] font-mono">
            <span>₹0</span>
            <span>₹2,500</span>
            <span>₹5,000+</span>
          </div>
        </div>

        {/* Min & Max Input Boxes */}
        <div className="grid grid-cols-2 gap-2.5 items-center">
          <div>
            <label className="block text-[10px] font-mono text-[#7B8A90] mb-1">
              Min (₹)
            </label>
            <div className="relative">
              <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-[11px] text-[#7B8A90] font-mono">
                ₹
              </span>
              <input
                type="number"
                min={0}
                max={5000}
                step={50}
                placeholder="0"
                value={localMinPrice}
                onChange={(e) => setLocalMinPrice(e.target.value)}
                onBlur={handleApplyPriceInputs}
                onKeyDown={(e) => e.key === "Enter" && handleApplyPriceInputs()}
                className="w-full bg-[#000000] text-white text-xs pl-6 pr-2 py-1.5 rounded-lg border border-[#202C44] focus:outline-none focus:border-[#D3CCB0] font-mono"
              />
            </div>
          </div>

          <div>
            <label className="block text-[10px] font-mono text-[#7B8A90] mb-1">
              Max (₹)
            </label>
            <div className="relative">
              <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-[11px] text-[#7B8A90] font-mono">
                ₹
              </span>
              <input
                type="number"
                min={0}
                max={5000}
                step={50}
                placeholder="5000"
                value={localMaxPrice}
                onChange={(e) => setLocalMaxPrice(e.target.value)}
                onBlur={handleApplyPriceInputs}
                onKeyDown={(e) => e.key === "Enter" && handleApplyPriceInputs()}
                className="w-full bg-[#000000] text-white text-xs pl-6 pr-2 py-1.5 rounded-lg border border-[#202C44] focus:outline-none focus:border-[#D3CCB0] font-mono"
              />
            </div>
          </div>
        </div>

        {/* Quick Price Preset Chips */}
        <div className="flex flex-wrap gap-1.5 pt-1">
          {[
            { label: "Under ₹500", min: null, max: "500" },
            { label: "₹500 - ₹1.5k", min: "500", max: "1500" },
            { label: "₹1.5k - ₹3k", min: "1500", max: "3000" },
            { label: "Over ₹3,000", min: "3000", max: null },
          ].map((preset) => {
            const isCurrent =
              (preset.min ? minPrice.toString() === preset.min : minPrice === 0) &&
              (preset.max ? maxPrice.toString() === preset.max : maxPrice === 5000);

            return (
              <button
                key={`${prefix}-preset-${preset.label}`}
                type="button"
                onClick={() => {
                  updateParams({
                    minPrice: preset.min,
                    maxPrice: preset.max,
                  });
                }}
                className={`text-[10px] font-mono px-2 py-1 rounded-lg border transition-colors ${
                  isCurrent
                    ? "bg-[#D3CCB0] text-[#000000] border-[#D3CCB0] font-bold"
                    : "bg-[#000000]/60 text-[#7B8A90] hover:text-white border-[#202C44]"
                }`}
              >
                {preset.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* 4. Pricing Model (Free vs Commercial/Paid) */}
      <div className="space-y-3 pb-5 border-b border-[#202C44]">
        <h3 className="text-xs font-mono uppercase tracking-wider text-[#D3CCB0] font-bold">
          Pricing Model
        </h3>
        <div className="space-y-1.5">
          {[
            { key: "all", label: "All Items", desc: "Free and paid assets" },
            { key: "free", label: "Free Downloads (₹0)", desc: "100% free assets" },
            { key: "paid", label: "Commercial / Paid", desc: "Commercial licenses" },
          ].map((item) => (
            <label
              key={`${prefix}-price-model-${item.key}`}
              className={`flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs cursor-pointer transition-colors ${
                priceType === item.key
                  ? "bg-[#202C44] text-[#D3CCB0] font-bold border border-[#D3CCB0]/40"
                  : "text-[#7B8A90] hover:text-white hover:bg-[#202C44]/40"
              }`}
            >
              <input
                type="radio"
                name={`${prefix}-priceModel`}
                checked={priceType === item.key}
                onChange={() => updateParams({ priceType: item.key === "all" ? null : item.key })}
                className="accent-[#D3CCB0] cursor-pointer"
              />
              <div className="flex-1">
                <span className="block text-white font-medium">{item.label}</span>
                <span className="block text-[10px] text-[#7B8A90]">{item.desc}</span>
              </div>
            </label>
          ))}
        </div>
      </div>

      {/* 5. Format Section: Checkboxes for file types (.fig, .dart, .zip, etc.) */}
      <div className="space-y-3 pb-2">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-mono uppercase tracking-wider text-[#D3CCB0] font-bold">
            File Format
          </h3>
          {selectedFormat && (
            <button
              type="button"
              onClick={() => updateParams({ format: null })}
              className="text-[10px] font-mono text-[#D3CCB0] hover:underline"
            >
              Clear
            </button>
          )}
        </div>
        <div className="space-y-1 max-h-56 overflow-y-auto pr-1">
          {FILE_FORMATS_CATALOG.slice(0, 10).map((fmt) => {
            const isChecked = selectedFormat.toLowerCase() === fmt.ext.toLowerCase();
            const count = listings.filter(
              (l) =>
                l.deleted !== true &&
                (l.fileFormatTags?.some((f) => f.toLowerCase() === fmt.ext.toLowerCase()) ||
                 l.fileType?.toLowerCase() === fmt.ext.toLowerCase())
            ).length;

            return (
              <label
                key={`${prefix}-fmt-${fmt.ext}`}
                className={`flex items-center justify-between px-3 py-1.5 rounded-xl text-xs cursor-pointer transition-colors ${
                  isChecked
                    ? "bg-[#202C44] text-[#D3CCB0] font-bold border border-[#D3CCB0]/40"
                    : "text-[#7B8A90] hover:text-white hover:bg-[#202C44]/40"
                }`}
              >
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={isChecked}
                    onChange={() => updateParams({ format: isChecked ? null : fmt.ext })}
                    className="accent-[#D3CCB0] rounded cursor-pointer"
                  />
                  <span className="font-mono text-white text-xs">{fmt.ext}</span>
                  <span className="text-[10px] text-[#7B8A90] truncate">{fmt.label}</span>
                </div>
                {count > 0 && (
                  <span className="text-[10px] font-mono text-[#7B8A90]">({count})</span>
                )}
              </label>
            );
          })}
        </div>
      </div>

    </div>
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6" id="marketplace-browse-page">
      
      {/* =========================================================================
          MOBILE FLIPKART/AMAZON STYLE 50/50 DUAL ACTION BAR (Visible on < lg)
          ========================================================================= */}
      <div className="lg:hidden sticky top-[64px] z-30 bg-[#111317]/95 backdrop-blur-md border border-[#202C44] rounded-2xl p-1.5 shadow-xl grid grid-cols-2 gap-1.5">
        {/* Sort Button (Opens Sort Bottom Sheet) */}
        <button
          type="button"
          onClick={() => setIsMobileSortOpen(true)}
          id="mobile-sort-trigger-btn"
          className="flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl bg-[#000000]/60 border border-[#202C44] text-xs font-semibold text-white active:scale-98 transition-all"
        >
          <ArrowUpDown className="w-3.5 h-3.5 text-[#D3CCB0]" />
          <span className="truncate">Sort: {sortOptions.find((s) => s.key === sortBy)?.label.split(" ")[0] || "Popular"}</span>
        </button>

        {/* Filter Button (Opens Full-Screen Filter Drawer) */}
        <button
          type="button"
          onClick={() => setIsMobileFilterOpen(true)}
          id="mobile-filter-trigger-btn"
          className={`flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl text-xs font-semibold active:scale-98 transition-all border ${
            hasActiveFilters
              ? "bg-[#D3CCB0] text-[#000000] border-[#D3CCB0] font-bold shadow-md"
              : "bg-[#000000]/60 text-white border-[#202C44]"
          }`}
        >
          <SlidersHorizontal className="w-3.5 h-3.5" />
          <span>Filters {activeFiltersCount > 0 ? `(${activeFiltersCount})` : ""}</span>
        </button>
      </div>

      {/* =========================================================================
          MAIN 2-COLUMN E-COMMERCE LAYOUT (FLIPKART / AMAZON STYLE)
          ========================================================================= */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* =======================================================================
            1. THE "PRO SHOP" FILTER SIDEBAR (LEFT COLUMN - 3 or 4 cols)
            ======================================================================= */}
        <aside
          id="pro-shop-filter-sidebar"
          className="hidden lg:block lg:col-span-3 xl:col-span-3 bg-[#111317] border border-[#202C44] rounded-2xl p-5 shadow-xl sticky top-[80px] max-h-[calc(100vh-100px)] overflow-y-auto"
        >
          {renderFilterSidebar("desktop")}
        </aside>

        {/* =======================================================================
            2. RIGHT COLUMN: CLEAN TOP BAR + ACTIVE FILTER PILLS + ASSETS GRID (9 cols)
            ======================================================================= */}
        <div className="lg:col-span-9 xl:col-span-9 space-y-4">
          
          {/* =====================================================================
              CLEAN TOP BAR (BREADCRUMBS, RESULT COUNT & SORT BY DROPDOWN)
              ===================================================================== */}
          <div
            id="marketplace-clean-top-bar"
            className="bg-[#111317] border border-[#202C44] rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-sm"
          >
            {/* Left Side: Breadcrumbs + Results Counter */}
            <div className="space-y-1">
              <nav className="flex items-center gap-1.5 text-xs text-[#7B8A90] font-medium" aria-label="Breadcrumb">
                <Link to="/" className="hover:text-white flex items-center gap-1 transition-colors">
                  <Home className="w-3.5 h-3.5" />
                  <span>Home</span>
                </Link>
                <ChevronRight className="w-3 h-3 text-[#202C44]" />
                <Link to="/browse" className="hover:text-white transition-colors">
                  Explore
                </Link>
                {selectedCategory !== "All" && (
                  <>
                    <ChevronRight className="w-3 h-3 text-[#202C44]" />
                    <span className="text-[#D3CCB0] font-semibold truncate max-w-[160px]">
                      {selectedCategory}
                    </span>
                  </>
                )}
              </nav>

              {/* Result Counter (e.g. "Showing 1-12 of 24 results") */}
              <p className="text-xs text-[#7B8A90]" id="results-count-text">
                Showing <strong className="text-white font-mono">{filteredListings.length > 0 ? 1 : 0}–{filteredListings.length}</strong> of{" "}
                <strong className="text-white font-mono">{listings.filter((l) => l.deleted !== true).length}</strong> results
                {searchQuery && <span> for <strong className="text-white">"{searchQuery}"</strong></span>}
              </p>
            </div>

            {/* Right Side: Clean "Sort By" Dropdown */}
            <div className="relative shrink-0">
              <div className="flex items-center gap-2">
                <span className="text-xs text-[#7B8A90] font-medium hidden sm:inline">Sort By:</span>
                <button
                  type="button"
                  id="clean-sort-dropdown-trigger"
                  onClick={() => setDesktopSortOpen(!desktopSortOpen)}
                  className="bg-[#000000] text-white text-xs font-semibold px-3.5 py-2 rounded-xl border border-[#202C44] hover:border-[#D3CCB0]/60 flex items-center gap-2 transition-colors shadow-sm"
                >
                  <ArrowUpDown className="w-3.5 h-3.5 text-[#D3CCB0]" />
                  <span>{currentSortLabel}</span>
                  <ChevronDown className={`w-3.5 h-3.5 text-[#7B8A90] transition-transform ${desktopSortOpen ? "rotate-180 text-[#D3CCB0]" : ""}`} />
                </button>
              </div>

              {/* Desktop Sort Popover */}
              {desktopSortOpen && (
                <div
                  id="clean-sort-dropdown-menu"
                  className="absolute right-0 top-full mt-2 w-56 bg-[#111317] border border-[#202C44] rounded-2xl p-2 shadow-2xl z-40 space-y-1 animate-in fade-in"
                >
                  <div className="px-2.5 py-1 text-[10px] font-mono uppercase tracking-wider text-[#7B8A90]">
                    Sort Listings
                  </div>
                  {sortOptions.map((opt) => (
                    <button
                      key={`desktop-sort-${opt.key}`}
                      type="button"
                      onClick={() => {
                        updateParams({ sort: opt.key === "popular" ? null : opt.key });
                        setDesktopSortOpen(false);
                      }}
                      className={`w-full text-left px-3 py-2 rounded-xl text-xs flex items-center justify-between transition-colors ${
                        sortBy === opt.key
                          ? "bg-[#D3CCB0] text-[#000000] font-bold"
                          : "text-[#7B8A90] hover:text-white hover:bg-[#202C44]/60"
                      }`}
                    >
                      <span>{opt.label}</span>
                      {sortBy === opt.key && <Check className="w-3.5 h-3.5 text-[#000000]" />}
                    </button>
                  ))}
                </div>
              )}
            </div>

          </div>

          {/* =====================================================================
              ACTIVE FILTER PILLS BAR (Below Top Bar with One-Click Removal)
              ===================================================================== */}
          {hasActiveFilters && (
            <div
              id="active-filter-pills-bar"
              className="flex flex-wrap items-center gap-2 bg-[#111317]/80 border border-[#202C44] p-3 rounded-2xl text-xs shadow-sm"
            >
              <span className="text-[#7B8A90] font-medium text-xs mr-1">Active filters:</span>

              {/* Category Pill */}
              {selectedCategory !== "All" && (
                <span className="bg-[#202C44] text-[#D3CCB0] px-2.5 py-1 rounded-lg flex items-center gap-1.5 border border-[#202C44] font-medium">
                  <span>Category: {selectedCategory}</span>
                  <button
                    type="button"
                    title="Remove category filter"
                    onClick={() => updateParams({ category: null })}
                    className="hover:text-white"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </span>
              )}

              {/* Format Pill */}
              {selectedFormat && (
                <span className="bg-[#202C44] text-[#D3CCB0] font-mono px-2.5 py-1 rounded-lg flex items-center gap-1.5 border border-[#202C44]">
                  <span>Format: {selectedFormat}</span>
                  <button
                    type="button"
                    title="Remove format filter"
                    onClick={() => updateParams({ format: null })}
                    className="hover:text-white"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </span>
              )}

              {/* Price Type Pill */}
              {priceType !== "all" && (
                <span className="bg-[#202C44] text-[#D3CCB0] px-2.5 py-1 rounded-lg flex items-center gap-1.5 border border-[#202C44] font-medium">
                  <span>Price: {priceType === "free" ? "Free Only (₹0)" : "Commercial / Paid"}</span>
                  <button
                    type="button"
                    title="Remove price model filter"
                    onClick={() => updateParams({ priceType: null })}
                    className="hover:text-white"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </span>
              )}

              {/* Min/Max Price Pill */}
              {(minPrice > 0 || maxPrice < 5000) && (
                <span className="bg-[#202C44] text-[#D3CCB0] font-mono px-2.5 py-1 rounded-lg flex items-center gap-1.5 border border-[#202C44]">
                  <span>Price: ₹{minPrice.toLocaleString("en-IN")} – ₹{maxPrice.toLocaleString("en-IN")}</span>
                  <button
                    type="button"
                    title="Remove price range filter"
                    onClick={() => {
                      setLocalMinPrice("");
                      setLocalMaxPrice("");
                      updateParams({ minPrice: null, maxPrice: null });
                    }}
                    className="hover:text-white"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </span>
              )}

              {/* Search Query Pill */}
              {searchQuery && (
                <span className="bg-[#202C44] text-white px-2.5 py-1 rounded-lg flex items-center gap-1.5 border border-[#202C44]">
                  <span>Search: "{searchQuery}"</span>
                  <button
                    type="button"
                    title="Remove search query"
                    onClick={() => updateParams({ q: null })}
                    className="hover:text-white"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </span>
              )}

              {/* Clear All Link */}
              <button
                type="button"
                onClick={handleResetFilters}
                className="text-[#D3CCB0] hover:underline flex items-center gap-1 text-xs ml-auto font-mono font-medium"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Clear All</span>
              </button>
            </div>
          )}

          {/* =====================================================================
              PRODUCT LISTINGS GRID (3-column on desktop, responsive)
              ===================================================================== */}
          <main className="space-y-6 pt-1">
            {filteredListings.length > 0 ? (
              <div
                className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6"
                id="browse-results-grid"
              >
                {filteredListings.map((item, index) => {
                  const itemKey = item.id ? `listing-${item.id}` : `listing-${item.slug || 'item'}-${index}`;
                  return (
                    <ListingCard
                      key={itemKey}
                      listing={item}
                      onSelectListing={(asset) => {
                        navigate(`/listing/${asset.slug || asset.id}`);
                        window.scrollTo({ top: 0, behavior: "smooth" });
                      }}
                      onBuyNowDirect={onBuyNowDirect}
                      isSaved={item.id ? savedIds.includes(item.id) : false}
                      onToggleSave={onToggleSave}
                    />
                  );
                })}
              </div>
            ) : (
              /* Flipkart/Amazon Style Empty State with Category Recommendations */
              <div className="bg-[#111317] border border-[#202C44] rounded-3xl p-10 sm:p-14 text-center space-y-6 max-w-lg mx-auto my-6 shadow-2xl">
                <div className="w-16 h-16 rounded-2xl bg-[#202C44] text-[#D3CCB0] flex items-center justify-center mx-auto border border-[#202C44] shadow-lg">
                  <Search className="w-8 h-8" />
                </div>
                
                <div className="space-y-2">
                  <h3 className="text-xl font-heading font-bold text-white">No Matching Assets Found</h3>
                  <p className="text-xs sm:text-sm text-[#7B8A90] max-w-sm mx-auto leading-relaxed">
                    We couldn't find any listings matching your current filter criteria. Try adjusting your filters or browse popular categories:
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
                    onClick={() => setSearchParams({ category: "AI / ML & Data Science" })}
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

      {/* =========================================================================
          MOBILE FULL-SCREEN FILTER DRAWER (Flipkart/Amazon Style)
          ========================================================================= */}
      {isMobileFilterOpen && (
        <div className="fixed inset-0 z-50 flex flex-col bg-[#000000] animate-in slide-in-from-bottom duration-200">
          {/* Drawer Header */}
          <div className="flex items-center justify-between p-4 bg-[#111317] border-b border-[#202C44]">
            <div className="flex items-center gap-2">
              <SlidersHorizontal className="w-4 h-4 text-[#D3CCB0]" />
              <h3 className="font-heading font-extrabold text-white text-base">
                Filters {activeFiltersCount > 0 ? `(${activeFiltersCount})` : ""}
              </h3>
            </div>
            <button
              type="button"
              onClick={() => setIsMobileFilterOpen(false)}
              className="p-1.5 rounded-xl bg-[#202C44] text-white hover:text-[#D3CCB0]"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Drawer Body */}
          <div className="flex-1 overflow-y-auto p-4 space-y-6">
            {renderFilterSidebar("mobile")}
          </div>

          {/* Drawer Bottom Action Bar */}
          <div className="p-4 bg-[#111317] border-t border-[#202C44] flex items-center gap-3">
            <button
              type="button"
              onClick={handleResetFilters}
              className="flex-1 py-3 px-4 rounded-xl border border-[#202C44] bg-[#000000] text-white text-xs font-heading font-bold hover:bg-[#202C44]"
            >
              Clear All
            </button>
            <button
              type="button"
              onClick={() => setIsMobileFilterOpen(false)}
              className="flex-1 py-3 px-4 rounded-xl bg-[#D3CCB0] hover:bg-[#c4bb9a] text-black text-xs font-heading font-extrabold shadow-lg"
            >
              Apply Filters ({filteredListings.length})
            </button>
          </div>
        </div>
      )}

      {/* =========================================================================
          MOBILE SORT BOTTOM SHEET (Flipkart/Amazon Style)
          ========================================================================= */}
      {isMobileSortOpen && (
        <div className="fixed inset-0 z-50 flex flex-col justify-end bg-black/80 backdrop-blur-sm animate-in fade-in">
          <div
            className="bg-[#111317] border-t border-[#202C44] rounded-t-3xl p-5 space-y-4 max-h-[80vh] overflow-y-auto animate-in slide-in-from-bottom duration-200"
          >
            <div className="flex items-center justify-between pb-2 border-b border-[#202C44]">
              <div className="flex items-center gap-2">
                <ArrowUpDown className="w-4 h-4 text-[#D3CCB0]" />
                <h3 className="font-heading font-extrabold text-white text-base">
                  Sort By
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setIsMobileSortOpen(false)}
                className="p-1 rounded-lg bg-[#202C44] text-[#7B8A90] hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-1">
              {sortOptions.map((opt) => (
                <button
                  key={`mobile-sort-${opt.key}`}
                  type="button"
                  onClick={() => {
                    updateParams({ sort: opt.key === "popular" ? null : opt.key });
                    setIsMobileSortOpen(false);
                  }}
                  className={`w-full text-left px-4 py-3 rounded-xl text-xs flex items-center justify-between transition-colors ${
                    sortBy === opt.key
                      ? "bg-[#D3CCB0] text-[#000000] font-bold"
                      : "text-white hover:bg-[#202C44]"
                  }`}
                >
                  <span className="text-sm font-medium">{opt.label}</span>
                  {sortBy === opt.key && <CheckCircle2 className="w-4 h-4 text-[#000000]" />}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

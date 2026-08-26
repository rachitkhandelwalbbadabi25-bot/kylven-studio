import React, { useState, useRef, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import {
  Search,
  ChevronDown,
  Menu,
  X,
  LogIn,
  Layers,
  FileCode,
  TrendingUp,
  ShoppingBag,
  Heart,
  LayoutDashboard,
  PlusCircle,
  LogOut,
  User,
  CheckCircle2,
  Settings,
  ShieldCheck,
  Award,
  Repeat,
  Store,
  Compass,
  Zap,
  SlidersHorizontal,
  ArrowRight
} from "lucide-react";
import { UserProfile, UserRole } from "../types";

interface NavbarProps {
  isAuthenticated?: boolean;
  userProfile?: UserProfile;
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  onSearchSubmit?: (q?: string) => void;
  onOpenAuthModal?: (mode?: "signin" | "signup") => void;
  onLogout?: () => void;
  onToggleRole?: (newRole?: UserRole) => void;
  savedCount?: number;
  purchasesCount?: number;
}

const AUTOCOMPLETE_POPULAR = [
  { label: "Figma Fintech UI Kit", type: "Popular Search", query: "Figma Fintech UI Kit" },
  { label: "Neo Bharat Cyberpunk", type: "Trending Kit", query: "Cyberpunk" },
  { label: "ML Fine-Tuning Notebook", type: "AI / ML", query: "Fine-Tuning" },
  { label: "Cinematic India LUT Pack", type: "Video", query: "LUT" },
  { label: "Blender Auto-Rickshaw Pack", type: "3D Asset", query: "Blender" },
  { label: "Notion Freelancer OS", type: "Productivity", query: "Notion" },
];

const AUTOCOMPLETE_CATEGORIES = [
  { name: "Software & Development", count: "48 assets", path: "/browse?category=Software%20%26%20Development" },
  { name: "AI / ML & Data Science", count: "36 assets", path: "/browse?category=AI%2FML%20%26%20Data%20Science" },
  { name: "UI/UX & Design", count: "64 assets", path: "/browse?category=UI%2FUX%20%26%20Design" },
  { name: "3D & CAD", count: "29 assets", path: "/browse?category=3D%20%26%20CAD" },
  { name: "Video & Motion", count: "38 assets", path: "/browse?category=Video%2FMotion%20%26%20Audio" },
  { name: "Productivity & Business", count: "24 assets", path: "/browse?category=Productivity%20%26%20Business" },
];

const AUTOCOMPLETE_FORMATS = [
  { ext: ".fig", label: "Figma Kit" },
  { ext: ".ipynb", label: "Jupyter Notebook" },
  { ext: ".dart", label: "Flutter App" },
  { ext: ".blend", label: "Blender 3D" },
  { ext: ".cube", label: "LUT Presets" },
  { ext: ".notion", label: "Notion Workspace" },
];

export const Navbar: React.FC<NavbarProps> = ({
  isAuthenticated = false,
  userProfile,
  searchQuery,
  setSearchQuery,
  onSearchSubmit,
  onLogout,
  onToggleRole,
  savedCount = 0,
  purchasesCount = 0,
}) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isAccountMenuOpen, setIsAccountMenuOpen] = useState(false);
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const searchContainerRef = useRef<HTMLDivElement>(null);
  const accountMenuRef = useRef<HTMLDivElement>(null);

  const isSellerMode = userProfile?.role === "seller";

  // Close search suggestions & account dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchContainerRef.current && !searchContainerRef.current.contains(event.target as Node)) {
        setIsSearchFocused(false);
      }
      if (accountMenuRef.current && !accountMenuRef.current.contains(event.target as Node)) {
        setIsAccountMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Close menus on route change
  useEffect(() => {
    setIsMobileMenuOpen(false);
    setIsAccountMenuOpen(false);
    setIsSearchFocused(false);
  }, [location.pathname]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSearchFocused(false);
    if (searchQuery.trim()) {
      navigate(`/browse?q=${encodeURIComponent(searchQuery.trim())}`);
    } else {
      navigate("/browse");
    }
  };

  const handleSelectSuggestion = (queryText: string) => {
    setSearchQuery(queryText);
    setIsSearchFocused(false);
    navigate(`/browse?q=${encodeURIComponent(queryText)}`);
  };

  const isActive = (path: string) => {
    if (path === "/browse") return location.pathname === "/browse";
    if (path === "/categories") return location.pathname === "/categories";
    if (path === "/dashboard") return location.pathname === "/dashboard";
    if (path === "/purchases") return location.pathname === "/purchases";
    if (path === "/saved") return location.pathname === "/saved";
    if (path === "/pricing") return location.pathname === "/pricing";
    if (path === "/how-it-works") return location.pathname === "/how-it-works";
    if (path === "/sell/new") return location.pathname === "/sell/new" || location.pathname === "/sell";
    return location.pathname === path;
  };

  const currentUsername = userProfile?.username || "buildwithansh";

  const handleToggleMode = () => {
    const nextRole: UserRole = isSellerMode ? "buyer" : "seller";
    if (onToggleRole) {
      onToggleRole(nextRole);
    }
    if (nextRole === "seller") {
      navigate("/dashboard");
    } else {
      navigate("/browse");
    }
  };

  return (
    <header
      className={`sticky top-0 z-50 backdrop-blur-md border-b transition-colors ${
        isSellerMode
          ? "bg-[#0b0d11]/95 border-emerald-950/80 shadow-[0_4px_20px_rgba(16,185,129,0.03)]"
          : "bg-[#000000]/95 border-[#202C44]"
      }`}
      id="public-header"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-3 sm:gap-6">
          
          {/* Left: Logo & Subtitle & Mode Badge (when logged in) */}
          <div className="flex items-center gap-3">
            <Link
              to="/"
              id="header-logo-link"
              className="flex items-center gap-3 shrink-0 group py-1"
              title="Kreate Studio — India’s Creative Marketplace"
            >
              <div className={`w-9 h-9 rounded-xl border flex items-center justify-center transition-all ${
                isSellerMode
                  ? "bg-emerald-950/80 border-emerald-800 group-hover:border-emerald-400"
                  : "bg-[#202C44] border-[#202C44] group-hover:border-[#D3CCB0]"
              }`}>
                <span className={`font-heading font-black text-lg ${isSellerMode ? "text-emerald-400" : "text-[#D3CCB0]"}`}>
                  K
                </span>
              </div>
              <div className="flex flex-col">
                <span className="font-heading font-bold text-base text-white tracking-tight leading-none group-hover:text-[#D3CCB0] transition-colors">
                  Kreate <span className={isSellerMode ? "text-emerald-400" : "text-[#D3CCB0]"}>Studio</span>
                </span>
                <span className="text-[10px] text-[#7B8A90] font-sans font-medium tracking-wide leading-tight mt-0.5">
                  India’s Creative Marketplace
                </span>
              </div>
            </Link>

            {/* Logged-In Mode Indicator Pill with Quick Switcher */}
            {isAuthenticated && (
              <button
                type="button"
                onClick={handleToggleMode}
                title={`Currently in ${isSellerMode ? "Seller" : "Buyer"} Mode. Click to switch to ${isSellerMode ? "Buyer" : "Seller"} Mode.`}
                id="header-role-switcher-badge"
                className={`hidden sm:inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-mono font-bold border transition-all active:scale-95 ${
                  isSellerMode
                    ? "bg-emerald-950/60 text-emerald-400 border-emerald-800 hover:border-emerald-400 hover:bg-emerald-900/60"
                    : "bg-[#202C44] text-[#D3CCB0] border-[#202C44] hover:border-[#D3CCB0] hover:bg-[#202C44]/80"
                }`}
              >
                {isSellerMode ? (
                  <>
                    <Store className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Seller Mode</span>
                  </>
                ) : (
                  <>
                    <ShoppingBag className="w-3.5 h-3.5 text-[#D3CCB0]" />
                    <span>Buyer Mode</span>
                  </>
                )}
                <Repeat className="w-3 h-3 ml-0.5 opacity-60 group-hover:opacity-100" />
              </button>
            )}
          </div>

          {/* =========================================================
              CENTER AREA:
              - If NOT logged in: Show Tour navigation (About, Features, How it Works, Pricing)
              - If logged in: Show Search Bar
             ========================================================= */}
          {!isAuthenticated ? (
            /* Logged-Out Tour Navigation Links */
            <nav className="hidden md:flex items-center gap-2 lg:gap-4" id="logged-out-nav">
              <Link
                to="/#about"
                id="tour-link-about"
                className="text-xs font-medium text-[#7B8A90] hover:text-white px-3 py-1.5 rounded-lg transition-colors hover:bg-[#202C44]/40"
              >
                About
              </Link>
              <Link
                to="/#features"
                id="tour-link-features"
                className="text-xs font-medium text-[#7B8A90] hover:text-white px-3 py-1.5 rounded-lg transition-colors hover:bg-[#202C44]/40"
              >
                Features
              </Link>
              <Link
                to="/how-it-works"
                id="tour-link-how-it-works"
                className={`text-xs font-medium px-3 py-1.5 rounded-lg transition-colors ${
                  isActive("/how-it-works")
                    ? "bg-[#202C44] text-[#D3CCB0] font-bold"
                    : "text-[#7B8A90] hover:text-white hover:bg-[#202C44]/40"
                }`}
              >
                How it Works
              </Link>
              <Link
                to="/pricing"
                id="tour-link-pricing"
                className={`text-xs font-medium px-3 py-1.5 rounded-lg transition-colors ${
                  isActive("/pricing")
                    ? "bg-[#202C44] text-[#D3CCB0] font-bold"
                    : "text-[#7B8A90] hover:text-white hover:bg-[#202C44]/40"
                }`}
              >
                Pricing
              </Link>
            </nav>
          ) : (
            /* Logged-In Search Bar with Autocomplete */
            <div className="hidden md:flex flex-1 max-w-md lg:max-w-lg relative" ref={searchContainerRef}>
              <form onSubmit={handleSearch} className="relative w-full" id="global-search-form">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#7B8A90]" />
                <input
                  id="global-search-input"
                  type="text"
                  placeholder="Search UI kits, templates, models…"
                  value={searchQuery}
                  onFocus={() => setIsSearchFocused(true)}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-[#111317] text-white text-xs pl-10 pr-20 py-2.5 rounded-xl border border-[#202C44] focus:outline-none focus:border-[#D3CCB0] placeholder-[#7B8A90] transition-all"
                />
                <button
                  type="submit"
                  id="global-search-submit"
                  className="absolute right-1.5 top-1/2 -translate-y-1/2 bg-[#202C44] hover:bg-[#D3CCB0] text-[#D3CCB0] hover:text-[#000000] text-[11px] font-mono font-bold px-3 py-1 rounded-lg transition-colors"
                >
                  Search
                </button>
              </form>

              {/* Autocomplete Dropdown */}
              {isSearchFocused && (
                <div
                  id="search-autocomplete-dropdown"
                  className="absolute top-full left-0 right-0 mt-2 bg-[#111317] border border-[#202C44] rounded-2xl shadow-2xl p-4 z-50 text-xs space-y-4 max-h-[380px] overflow-y-auto"
                >
                  <div>
                    <div className="flex items-center gap-1.5 text-[10px] font-mono uppercase tracking-wider text-[#7B8A90] mb-2 font-semibold">
                      <TrendingUp className="w-3.5 h-3.5 text-[#D3CCB0]" />
                      <span>Popular Searches</span>
                    </div>
                    <div className="grid grid-cols-2 gap-1.5">
                      {AUTOCOMPLETE_POPULAR.map((item) => (
                        <button
                          key={item.label}
                          type="button"
                          onClick={() => handleSelectSuggestion(item.query)}
                          className="text-left px-2.5 py-1.5 rounded-lg bg-[#202C44]/40 hover:bg-[#202C44] text-white text-[11px] flex items-center justify-between transition-colors"
                        >
                          <span className="truncate">{item.label}</span>
                          <span className="text-[9px] text-[#7B8A90] font-mono shrink-0 ml-1">{item.type}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center gap-1.5 text-[10px] font-mono uppercase tracking-wider text-[#7B8A90] mb-2 font-semibold">
                      <FileCode className="w-3.5 h-3.5 text-[#D3CCB0]" />
                      <span>Filter By File Type</span>
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {AUTOCOMPLETE_FORMATS.map((fmt) => (
                        <button
                          key={fmt.ext}
                          type="button"
                          onClick={() => {
                            setIsSearchFocused(false);
                            navigate(`/browse?format=${encodeURIComponent(fmt.ext)}`);
                          }}
                          className="px-2.5 py-1 rounded-md bg-[#202C44] hover:bg-[#D3CCB0] text-[#D3CCB0] hover:text-[#000000] text-[11px] font-mono font-bold transition-colors"
                        >
                          {fmt.ext} <span className="font-sans font-normal text-[10px] opacity-80">({fmt.label})</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center gap-1.5 text-[10px] font-mono uppercase tracking-wider text-[#7B8A90] mb-2 font-semibold">
                      <Layers className="w-3.5 h-3.5 text-[#D3CCB0]" />
                      <span>Browse Core Sectors</span>
                    </div>
                    <div className="grid grid-cols-2 gap-1">
                      {AUTOCOMPLETE_CATEGORIES.map((cat) => (
                        <button
                          key={cat.name}
                          type="button"
                          onClick={() => {
                            setIsSearchFocused(false);
                            navigate(cat.path);
                          }}
                          className="text-left px-2.5 py-1.5 rounded-lg hover:bg-[#202C44]/60 text-[#7B8A90] hover:text-white text-[11px] flex items-center justify-between transition-colors"
                        >
                          <span className="truncate">{cat.name}</span>
                          <span className="text-[9px] text-[#7B8A90] font-mono">{cat.count}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* =========================================================
              RIGHT AREA:
              - If NOT logged in: Two prominent buttons [Login] and [Get Started]
              - If logged in: Contextual role links + Account Menu
             ========================================================= */}
          <div className="flex items-center gap-3">
            {!isAuthenticated ? (
              <div className="flex items-center gap-2 sm:gap-3" id="logged-out-actions">
                <Link
                  to="/signin"
                  id="header-login-btn"
                  className="text-xs font-bold text-[#7B8A90] hover:text-white px-3.5 py-2 rounded-xl hover:bg-[#202C44]/50 transition-colors"
                >
                  Login
                </Link>

                <Link
                  to="/signup"
                  id="header-get-started-btn"
                  className="bg-[#D3CCB0] hover:bg-[#c4bb9a] text-[#000000] text-xs font-heading font-black px-4 sm:px-5 py-2 rounded-xl transition-all shadow-md active:scale-95 flex items-center gap-1.5"
                >
                  <span>Get Started</span>
                  <ArrowRight className="w-3.5 h-3.5 text-[#000000]" />
                </Link>
              </div>
            ) : (
              /* Differentiated Navigation Links when logged in */
              <div className="flex items-center gap-2 lg:gap-3">
                <nav className="hidden md:flex items-center gap-1" id="logged-in-nav">
                  {/* BUYER MODE LINKS: Clean, Buyer-Centric (Explore, Categories, My Library, Saved) */}
                  {!isSellerMode ? (
                    <>
                      <Link
                        to="/browse"
                        id="nav-link-browse"
                        className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                          isActive("/browse")
                            ? "bg-[#202C44] text-[#D3CCB0] font-bold"
                            : "text-[#7B8A90] hover:text-white hover:bg-[#202C44]/50"
                        }`}
                      >
                        Explore Assets
                      </Link>

                      <Link
                        to="/categories"
                        id="nav-link-categories"
                        className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                          isActive("/categories")
                            ? "bg-[#202C44] text-[#D3CCB0] font-bold"
                            : "text-[#7B8A90] hover:text-white hover:bg-[#202C44]/50"
                        }`}
                      >
                        Categories
                      </Link>

                      <Link
                        to="/purchases"
                        id="nav-link-purchases"
                        className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors flex items-center gap-1.5 ${
                          isActive("/purchases")
                            ? "bg-[#202C44] text-[#D3CCB0] font-bold"
                            : "text-[#7B8A90] hover:text-white hover:bg-[#202C44]/50"
                        }`}
                      >
                        <span>My Library</span>
                        {purchasesCount > 0 && (
                          <span className="bg-[#D3CCB0] text-[#000000] text-[10px] font-mono font-bold px-1.5 py-0.2 rounded-full">
                            {purchasesCount}
                          </span>
                        )}
                      </Link>

                      <Link
                        to="/saved"
                        id="nav-link-saved"
                        className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors flex items-center gap-1.5 ${
                          isActive("/saved")
                            ? "bg-[#202C44] text-[#D3CCB0] font-bold"
                            : "text-[#7B8A90] hover:text-white hover:bg-[#202C44]/50"
                        }`}
                      >
                        <Heart className={`w-3.5 h-3.5 ${savedCount > 0 ? "text-pink-400 fill-pink-400/20" : "text-[#7B8A90]"}`} />
                        <span>Saved</span>
                        {savedCount > 0 && (
                          <span className="text-[10px] font-mono text-[#D3CCB0] opacity-80">
                            ({savedCount})
                          </span>
                        )}
                      </Link>
                    </>
                  ) : (
                    /* SELLER / CREATOR MODE LINKS */
                    <>
                      <Link
                        to="/dashboard"
                        id="nav-link-dashboard"
                        className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors flex items-center gap-1.5 ${
                          isActive("/dashboard")
                            ? "bg-emerald-950/80 text-emerald-400 font-bold border border-emerald-800"
                            : "text-[#7B8A90] hover:text-white hover:bg-[#202C44]/50"
                        }`}
                      >
                        <LayoutDashboard className="w-3.5 h-3.5 text-emerald-400" />
                        <span>Creator Dashboard</span>
                      </Link>

                      <Link
                        to={`/profile/${currentUsername}`}
                        id="nav-link-my-listings"
                        className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                          location.pathname.startsWith("/profile")
                            ? "bg-[#202C44] text-white font-bold"
                            : "text-[#7B8A90] hover:text-white hover:bg-[#202C44]/50"
                        }`}
                      >
                        My Storefront
                      </Link>

                      <Link
                        to="/browse"
                        id="nav-link-browse-preview"
                        className="px-3 py-1.5 rounded-lg text-xs font-medium text-[#7B8A90] hover:text-white hover:bg-[#202C44]/50 transition-colors flex items-center gap-1"
                      >
                        <Compass className="w-3.5 h-3.5" />
                        <span>Marketplace</span>
                      </Link>
                    </>
                  )}
                </nav>

                {/* Seller-Only Action: "+ New Listing" (Hidden entirely in Buyer Mode) */}
                {isSellerMode && (
                  <Link
                    to="/sell/new"
                    id="header-sell-btn"
                    className="hidden sm:flex items-center gap-1.5 text-xs font-bold px-3 py-2 rounded-xl border bg-emerald-400 hover:bg-emerald-300 text-[#000000] border-emerald-400 shadow-md font-heading transition-all active:scale-95"
                  >
                    <PlusCircle className="w-3.5 h-3.5" />
                    <span>New Listing</span>
                  </Link>
                )}

                {/* Account Menu Dropdown with Visual Role Confirmation */}
                <div className="relative" ref={accountMenuRef}>
                  <button
                    id="account-menu-button"
                    onClick={() => setIsAccountMenuOpen(!isAccountMenuOpen)}
                    className="flex items-center gap-2 p-1.5 sm:px-2 sm:py-1.5 rounded-xl bg-[#111317] border border-[#202C44] hover:border-[#D3CCB0]/60 transition-all focus:outline-none"
                    aria-label="User account menu"
                  >
                    <div className={`w-7 h-7 rounded-lg font-mono font-bold text-xs flex items-center justify-center border ${
                      isSellerMode
                        ? "bg-emerald-950 text-emerald-400 border-emerald-800"
                        : "bg-[#202C44] text-[#D3CCB0] border-[#202C44]"
                    }`}>
                      {userProfile?.name?.slice(0, 2).toUpperCase() || "AB"}
                    </div>

                    <div className="hidden sm:flex flex-col text-left">
                      <span className="text-xs text-white font-medium max-w-[100px] truncate leading-tight">
                        {userProfile?.name || "Ansh Bhardwaj"}
                      </span>
                      {/* Subtle Visual Role Confirmation Label */}
                      <span className={`text-[10px] font-mono leading-none mt-0.5 flex items-center gap-1 ${
                        isSellerMode ? "text-emerald-400" : "text-[#D3CCB0]"
                      }`}>
                        {isSellerMode ? (
                          <>
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                            <span>Seller Studio</span>
                          </>
                        ) : (
                          <>
                            <span className="w-1.5 h-1.5 rounded-full bg-[#D3CCB0]" />
                            <span>Buyer Mode</span>
                          </>
                        )}
                      </span>
                    </div>

                    <ChevronDown className="w-3.5 h-3.5 text-[#7B8A90] ml-0.5" />
                  </button>

                  {/* Dropdown Menu */}
                  {isAccountMenuOpen && (
                    <div
                      id="account-menu-dropdown"
                      className="absolute right-0 mt-2 w-64 sm:w-72 bg-[#111317] border border-[#202C44] rounded-2xl shadow-2xl py-2 z-50 text-xs animate-in fade-in"
                    >
                      {/* User Header */}
                      <div className="px-4 py-2.5 border-b border-[#202C44]">
                        <div className="flex items-center justify-between">
                          <p className="text-white font-bold truncate">{userProfile?.name || "Ansh Bhardwaj"}</p>
                          <span className={`text-[10px] px-2 py-0.5 rounded-full font-mono font-bold ${
                            isSellerMode
                              ? "text-emerald-400 bg-emerald-950 border border-emerald-800"
                              : "text-[#D3CCB0] bg-[#202C44] border border-[#202C44]"
                          }`}>
                            {isSellerMode ? "Seller Mode" : "Buyer Mode"}
                          </span>
                        </div>
                        <p className="text-[11px] text-[#7B8A90] font-mono truncate mt-0.5">
                          {userProfile?.email || "rrachitkhandelwal8@gmail.com"}
                        </p>
                      </div>

                      {/* Primary Role Switcher CTA */}
                      <div className="p-2 bg-[#000000]/60 border-b border-[#202C44]">
                        {!isSellerMode ? (
                          /* Buyer's Clean Portal to Become a Seller */
                          <button
                            type="button"
                            id="menu-switch-to-seller"
                            onClick={() => {
                              setIsAccountMenuOpen(false);
                              handleToggleMode();
                            }}
                            className="w-full text-left p-2.5 rounded-xl bg-gradient-to-r from-[#202C44]/80 to-[#111317] hover:from-[#202C44] hover:to-[#202C44]/40 border border-[#202C44] hover:border-emerald-500/50 transition-all group"
                          >
                            <div className="flex items-center justify-between mb-1">
                              <div className="flex items-center gap-1.5 text-emerald-400 font-bold text-xs">
                                <Store className="w-3.5 h-3.5" />
                                <span>Switch to Seller Studio</span>
                              </div>
                              <span className="text-[9px] font-mono text-emerald-400 bg-emerald-950 px-1.5 py-0.5 rounded border border-emerald-900">
                                90% Split
                              </span>
                            </div>
                            <p className="text-[10px] text-[#7B8A90] group-hover:text-slate-300 leading-snug">
                              Monetize your code, UI kits & models with ₹0 listing fees and direct UPI payouts.
                            </p>
                          </button>
                        ) : (
                          /* Seller's Clean Portal to Return to Buyer Workspace */
                          <button
                            type="button"
                            id="menu-switch-to-buyer"
                            onClick={() => {
                              setIsAccountMenuOpen(false);
                              handleToggleMode();
                            }}
                            className="w-full text-left p-2.5 rounded-xl bg-[#202C44]/50 hover:bg-[#202C44] border border-[#202C44] hover:border-[#D3CCB0]/50 transition-all group"
                          >
                            <div className="flex items-center justify-between mb-1">
                              <div className="flex items-center gap-1.5 text-[#D3CCB0] font-bold text-xs">
                                <ShoppingBag className="w-3.5 h-3.5" />
                                <span>Switch to Buyer Workspace</span>
                              </div>
                              <span className="text-[9px] font-mono text-[#D3CCB0] bg-[#202C44] px-1.5 py-0.5 rounded">
                                Browse
                              </span>
                            </div>
                            <p className="text-[10px] text-[#7B8A90] group-hover:text-slate-300 leading-snug">
                              Discover verified design systems, dev starters, and 3D assets for your projects.
                            </p>
                          </button>
                        )}
                      </div>

                      {/* Context-Specific Menu Items */}
                      <div className="py-1">
                        {/* If in Seller Mode, show Creator tools */}
                        {isSellerMode && (
                          <>
                            <Link
                              to="/dashboard"
                              id="menu-link-dashboard"
                              className="flex items-center gap-2.5 px-4 py-2 text-[#7B8A90] hover:text-white hover:bg-[#202C44]/50 transition-colors"
                            >
                              <LayoutDashboard className="w-3.5 h-3.5 text-emerald-400" />
                              <span>Creator Dashboard</span>
                            </Link>

                            <Link
                              to={`/profile/${currentUsername}`}
                              id="menu-link-profile"
                              className="flex items-center gap-2.5 px-4 py-2 text-[#7B8A90] hover:text-white hover:bg-[#202C44]/50 transition-colors"
                            >
                              <User className="w-3.5 h-3.5 text-[#D3CCB0]" />
                              <span>My Public Storefront</span>
                            </Link>

                            <Link
                              to="/sell/new"
                              id="menu-link-sell"
                              className="flex items-center gap-2.5 px-4 py-2 text-[#7B8A90] hover:text-white hover:bg-[#202C44]/50 transition-colors"
                            >
                              <PlusCircle className="w-3.5 h-3.5 text-emerald-400" />
                              <span>Publish New Asset</span>
                            </Link>

                            <div className="my-1 border-t border-[#202C44]" />
                          </>
                        )}

                        {/* Buyer & Shared Menu Items: My Library & Saved Items */}
                        <Link
                          to="/purchases"
                          id="menu-link-purchases"
                          className="flex items-center justify-between px-4 py-2 text-[#7B8A90] hover:text-white hover:bg-[#202C44]/50 transition-colors"
                        >
                          <div className="flex items-center gap-2.5">
                            <ShoppingBag className="w-3.5 h-3.5 text-[#D3CCB0]" />
                            <span>My Library (Purchases)</span>
                          </div>
                          {purchasesCount > 0 && (
                            <span className="bg-[#202C44] text-[#D3CCB0] text-[10px] font-mono px-1.5 py-0.5 rounded">
                              {purchasesCount}
                            </span>
                          )}
                        </Link>

                        <Link
                          to="/saved"
                          id="menu-link-saved"
                          className="flex items-center justify-between px-4 py-2 text-[#7B8A90] hover:text-white hover:bg-[#202C44]/50 transition-colors"
                        >
                          <div className="flex items-center gap-2.5">
                            <Heart className="w-3.5 h-3.5 text-pink-400" />
                            <span>Saved Items</span>
                          </div>
                          {savedCount > 0 && (
                            <span className="bg-[#202C44] text-[#D3CCB0] text-[10px] font-mono px-1.5 py-0.5 rounded">
                              {savedCount}
                            </span>
                          )}
                        </Link>

                        <button
                          id="menu-link-settings"
                          onClick={() => {
                            setIsAccountMenuOpen(false);
                            setIsSettingsOpen(true);
                          }}
                          className="w-full text-left flex items-center gap-2.5 px-4 py-2 text-[#7B8A90] hover:text-white hover:bg-[#202C44]/50 transition-colors"
                        >
                          <Settings className="w-3.5 h-3.5 text-[#7B8A90]" />
                          <span>Settings</span>
                        </button>
                      </div>

                      {/* Sign Out */}
                      <div className="border-t border-[#202C44] pt-1">
                        <button
                          onClick={onLogout}
                          id="menu-link-logout"
                          className="w-full text-left flex items-center gap-2.5 px-4 py-2 text-rose-400 hover:bg-rose-500/10 transition-colors"
                        >
                          <LogOut className="w-3.5 h-3.5" />
                          <span>Sign Out</span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Mobile Menu Toggle */}
            <button
              id="mobile-menu-toggle-btn"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2 rounded-xl bg-[#111317] border border-[#202C44] text-[#7B8A90] hover:text-white"
              aria-label="Toggle navigation menu"
            >
              {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>

        </div>

        {/* Mobile Navigation Drawer */}
        {isMobileMenuOpen && (
          <div id="mobile-nav-drawer" className="md:hidden py-4 border-t border-[#202C44] space-y-3">
            {isAuthenticated ? (
              <>
                <form onSubmit={handleSearch} className="relative w-full">
                  <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#7B8A90]" />
                  <input
                    type="text"
                    placeholder="Search UI kits, templates, models…"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full bg-[#111317] text-white text-xs pl-10 pr-16 py-2.5 rounded-xl border border-[#202C44] focus:outline-none focus:border-[#D3CCB0]"
                  />
                  <button
                    type="submit"
                    className="absolute right-1.5 top-1/2 -translate-y-1/2 bg-[#202C44] text-[#D3CCB0] text-[11px] font-mono px-2.5 py-1 rounded-lg"
                  >
                    Go
                  </button>
                </form>

                {!isSellerMode ? (
                  /* Mobile Navigation for Buyer Mode */
                  <>
                    <div className="grid grid-cols-2 gap-2 pt-2 text-xs">
                      <Link
                        to="/browse"
                        className="p-2.5 bg-[#111317] rounded-xl border border-[#202C44] text-white font-medium text-center hover:border-[#D3CCB0] flex items-center justify-center gap-1.5"
                      >
                        <Compass className="w-3.5 h-3.5 text-[#D3CCB0]" />
                        <span>Explore Assets</span>
                      </Link>
                      <Link
                        to="/categories"
                        className="p-2.5 bg-[#111317] rounded-xl border border-[#202C44] text-white font-medium text-center hover:border-[#D3CCB0] flex items-center justify-center gap-1.5"
                      >
                        <Layers className="w-3.5 h-3.5 text-[#D3CCB0]" />
                        <span>Categories</span>
                      </Link>
                      <Link
                        to="/purchases"
                        className="p-2.5 bg-[#111317] rounded-xl border border-[#202C44] text-white font-medium text-center hover:border-[#D3CCB0] flex items-center justify-center gap-1.5"
                      >
                        <ShoppingBag className="w-3.5 h-3.5 text-[#D3CCB0]" />
                        <span>My Library ({purchasesCount})</span>
                      </Link>
                      <Link
                        to="/saved"
                        className="p-2.5 bg-[#111317] rounded-xl border border-[#202C44] text-white font-medium text-center hover:border-[#D3CCB0] flex items-center justify-center gap-1.5"
                      >
                        <Heart className="w-3.5 h-3.5 text-pink-400" />
                        <span>Saved ({savedCount})</span>
                      </Link>
                    </div>

                    <div className="pt-2 border-t border-[#202C44] space-y-1.5 text-xs">
                      <button
                        onClick={handleToggleMode}
                        className="w-full text-left p-2.5 rounded-xl bg-gradient-to-r from-[#202C44]/80 to-[#111317] border border-[#202C44] text-emerald-400 font-bold flex items-center justify-between"
                      >
                        <div className="flex items-center gap-2">
                          <Store className="w-4 h-4" />
                          <span>Switch to Seller Studio</span>
                        </div>
                        <span className="text-[10px] font-mono bg-emerald-950 px-2 py-0.5 rounded border border-emerald-800">
                          90% Split
                        </span>
                      </button>

                      <button
                        onClick={() => {
                          setIsMobileMenuOpen(false);
                          setIsSettingsOpen(true);
                        }}
                        className="w-full flex items-center gap-2 py-2 px-2 text-[#7B8A90] hover:text-white"
                      >
                        <Settings className="w-4 h-4 text-[#7B8A90]" />
                        <span>Settings</span>
                      </button>
                      <button
                        onClick={onLogout}
                        className="w-full flex items-center gap-2 py-2 px-2 text-rose-400 hover:bg-rose-500/10 rounded-lg"
                      >
                        <LogOut className="w-4 h-4" />
                        <span>Sign Out</span>
                      </button>
                    </div>
                  </>
                ) : (
                  /* Mobile Navigation for Seller Mode */
                  <>
                    <div className="grid grid-cols-2 gap-2 pt-2 text-xs">
                      <Link
                        to="/dashboard"
                        className="p-2.5 bg-[#111317] rounded-xl border border-emerald-800/80 text-emerald-400 font-medium text-center hover:border-emerald-400 flex items-center justify-center gap-1.5"
                      >
                        <LayoutDashboard className="w-3.5 h-3.5 text-emerald-400" />
                        <span>Dashboard</span>
                      </Link>
                      <Link
                        to="/sell/new"
                        className="p-2.5 bg-emerald-400 text-[#000000] rounded-xl font-bold text-center hover:bg-emerald-300 flex items-center justify-center gap-1.5"
                      >
                        <PlusCircle className="w-3.5 h-3.5" />
                        <span>New Listing</span>
                      </Link>
                      <Link
                        to={`/profile/${currentUsername}`}
                        className="p-2.5 bg-[#111317] rounded-xl border border-[#202C44] text-white font-medium text-center hover:border-[#D3CCB0] flex items-center justify-center gap-1.5"
                      >
                        <User className="w-3.5 h-3.5 text-[#D3CCB0]" />
                        <span>My Storefront</span>
                      </Link>
                      <Link
                        to="/browse"
                        className="p-2.5 bg-[#111317] rounded-xl border border-[#202C44] text-white font-medium text-center hover:border-[#D3CCB0] flex items-center justify-center gap-1.5"
                      >
                        <Compass className="w-3.5 h-3.5 text-[#7B8A90]" />
                        <span>Marketplace</span>
                      </Link>
                    </div>

                    <div className="pt-2 border-t border-[#202C44] space-y-1.5 text-xs">
                      <button
                        onClick={handleToggleMode}
                        className="w-full text-left p-2.5 rounded-xl bg-[#202C44]/50 border border-[#202C44] text-[#D3CCB0] font-bold flex items-center justify-between"
                      >
                        <div className="flex items-center gap-2">
                          <ShoppingBag className="w-4 h-4 text-[#D3CCB0]" />
                          <span>Switch to Buyer Workspace</span>
                        </div>
                        <Repeat className="w-3.5 h-3.5" />
                      </button>
                      <Link to="/purchases" className="flex items-center gap-2 py-2 px-2 text-[#7B8A90] hover:text-white">
                        <ShoppingBag className="w-4 h-4 text-[#D3CCB0]" />
                        <span>Purchases ({purchasesCount})</span>
                      </Link>
                      <Link to="/saved" className="flex items-center gap-2 py-2 px-2 text-[#7B8A90] hover:text-white">
                        <Heart className="w-4 h-4 text-pink-400" />
                        <span>Saved Items ({savedCount})</span>
                      </Link>
                      <button
                        onClick={() => {
                          setIsMobileMenuOpen(false);
                          setIsSettingsOpen(true);
                        }}
                        className="w-full flex items-center gap-2 py-2 px-2 text-[#7B8A90] hover:text-white"
                      >
                        <Settings className="w-4 h-4 text-[#7B8A90]" />
                        <span>Settings</span>
                      </button>
                      <button
                        onClick={onLogout}
                        className="w-full flex items-center gap-2 py-2 px-2 text-rose-400 hover:bg-rose-500/10 rounded-lg"
                      >
                        <LogOut className="w-4 h-4" />
                        <span>Sign Out</span>
                      </button>
                    </div>
                  </>
                )}
              </>
            ) : (
              <div className="space-y-2 text-xs">
                <Link to="/#about" className="block py-2 text-[#7B8A90] hover:text-white">About</Link>
                <Link to="/#features" className="block py-2 text-[#7B8A90] hover:text-white">Features</Link>
                <Link to="/how-it-works" className="block py-2 text-[#D3CCB0] font-bold">How it Works</Link>
                <Link to="/pricing" className="block py-2 text-[#7B8A90] hover:text-white">Pricing</Link>
                <div className="pt-2 border-t border-[#202C44] flex flex-col gap-2">
                  <Link to="/signup" className="w-full bg-[#D3CCB0] text-[#000000] text-center font-bold py-2.5 rounded-xl">
                    Get Started
                  </Link>
                  <Link to="/signin" className="w-full bg-[#202C44] text-white text-center font-bold py-2.5 rounded-xl">
                    Sign In
                  </Link>
                </div>
              </div>
            )}
          </div>
        )}

      </div>

      {/* Settings Modal */}
      {isSettingsOpen && (
        <div className="fixed inset-0 z-50 bg-[#000000]/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#111317] border border-[#202C44] rounded-3xl max-w-md w-full p-6 space-y-5 shadow-2xl">
            <div className="flex items-center justify-between border-b border-[#202C44] pb-4">
              <h3 className="text-base font-heading font-extrabold text-white flex items-center gap-2">
                <Settings className="w-4 h-4 text-[#D3CCB0]" />
                <span>Account & Store Settings</span>
              </h3>
              <button onClick={() => setIsSettingsOpen(false)} className="text-[#7B8A90] hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4 text-xs">
              <div className="bg-[#202C44]/40 border border-[#202C44] p-3.5 rounded-xl space-y-1">
                <span className="text-[10px] text-[#7B8A90] uppercase font-mono block">Active Workspace</span>
                <div className="flex items-center justify-between">
                  <span className="font-bold text-white">
                    {isSellerMode ? "Creator / Seller Studio" : "Buyer Marketplace"}
                  </span>
                  <button
                    onClick={handleToggleMode}
                    className="text-[10px] font-mono text-[#D3CCB0] bg-[#202C44] px-2 py-0.5 rounded border border-[#202C44] hover:border-[#D3CCB0]"
                  >
                    Switch to {isSellerMode ? "Buyer" : "Seller"}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-[#7B8A90] mb-1 font-mono uppercase text-[10px]">Registered Email</label>
                <input
                  type="text"
                  disabled
                  value={userProfile?.email || "rrachitkhandelwal8@gmail.com"}
                  className="w-full bg-[#000000] text-[#7B8A90] px-3 py-2 rounded-xl border border-[#202C44] font-mono text-xs cursor-not-allowed"
                />
              </div>

              <div>
                <label className="block text-[#7B8A90] mb-1 font-mono uppercase text-[10px]">Default Currency</label>
                <div className="w-full bg-[#000000] text-white px-3 py-2 rounded-xl border border-[#202C44] font-mono text-xs flex items-center justify-between">
                  <span>INR — Indian Rupee (₹)</span>
                  <span className="text-emerald-400">Default (UPI Native)</span>
                </div>
              </div>

              <div className="pt-3 border-t border-[#202C44] flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsSettingsOpen(false)}
                  className="bg-[#D3CCB0] text-[#000000] font-bold px-4 py-2 rounded-xl text-xs"
                >
                  Done
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

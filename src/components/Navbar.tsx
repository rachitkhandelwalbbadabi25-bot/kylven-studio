import React, { useState, useRef, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import {
  Search,
  Menu,
  X,
  Compass,
  Layers,
  ShoppingBag,
  Heart,
  LayoutDashboard,
  PlusCircle,
  LogOut,
  User,
  Store,
  TrendingUp,
  FileCode,
  ShieldCheck,
  ChevronRight,
  Sparkles,
  UploadCloud,
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
  onLogout,
  onToggleRole,
  savedCount = 0,
  purchasesCount = 0,
}) => {
  const navigate = useNavigate();
  const location = useLocation();

  // Navigation Drawer state
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [mobileSearchVisible, setMobileSearchVisible] = useState(false);

  const searchContainerRef = useRef<HTMLDivElement>(null);
  const isSellerMode = userProfile?.role === "seller";
  const currentUsername = userProfile?.username || "creator";

  // Close search suggestions on click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchContainerRef.current && !searchContainerRef.current.contains(event.target as Node)) {
        setIsSearchFocused(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Close drawer and search dropdown on route change
  useEffect(() => {
    setIsDrawerOpen(false);
    setIsSearchFocused(false);
    setMobileSearchVisible(false);
  }, [location.pathname]);

  // Lock body scroll when drawer is open
  useEffect(() => {
    if (isDrawerOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isDrawerOpen]);

  // Escape key handler for drawer
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setIsDrawerOpen(false);
        setIsSearchFocused(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSearchFocused(false);
    setMobileSearchVisible(false);
    if (searchQuery.trim()) {
      navigate(`/browse?q=${encodeURIComponent(searchQuery.trim())}`);
    } else {
      navigate("/browse");
    }
  };

  const handleSelectSuggestion = (queryText: string) => {
    setSearchQuery(queryText);
    setIsSearchFocused(false);
    setMobileSearchVisible(false);
    navigate(`/browse?q=${encodeURIComponent(queryText)}`);
  };

  const isActive = (path: string) => {
    if (path === "/") {
      return location.pathname === "/" && !isAuthenticated;
    }
    if (path === "/browse") return location.pathname === "/browse";
    if (path === "/categories") return location.pathname === "/categories";
    if (path === "/dashboard") return location.pathname === "/dashboard";
    if (path === "/purchases") return location.pathname === "/purchases";
    if (path === "/saved") return location.pathname === "/saved";
    if (path === "/sell/new") return location.pathname === "/sell/new" || location.pathname === "/sell";
    if (path.startsWith("/profile")) return location.pathname.startsWith("/profile");
    return location.pathname === path;
  };

  const handleToggleMode = () => {
    const nextRole: UserRole = isSellerMode ? "buyer" : "seller";
    if (onToggleRole) {
      onToggleRole(nextRole);
    }
    setIsDrawerOpen(false);
    if (nextRole === "seller") {
      navigate("/dashboard");
    } else {
      navigate("/browse");
    }
  };

  const closeDrawer = () => setIsDrawerOpen(false);

  return (
    <>
      {/* =========================================================
          1. THE MINIMALIST HEADER:
          - Left: 3-Line Hamburger Trigger + Kreate Studio Logo
          - Center: Global Search Bar
          - Right: User Profile / Sign In
         ========================================================= */}
      <header
        className={`sticky top-0 z-40 backdrop-blur-md border-b transition-colors ${
          isSellerMode
            ? "bg-[#0b0d11]/95 border-emerald-950/80 shadow-[0_4px_20px_rgba(16,185,129,0.03)]"
            : "bg-[#000000]/95 border-[#202C44]"
        }`}
        id="minimalist-header"
      >
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 gap-2.5 sm:gap-6">
            
            {/* Left: 3-Line Hamburger Trigger on the FAR LEFT + Brand Logo */}
            <div className="flex items-center gap-2 sm:gap-3 shrink-0">
              
              {/* The "3-Line" Hamburger Menu Trigger on Left Side */}
              <button
                type="button"
                id="hamburger-menu-trigger"
                onClick={() => setIsDrawerOpen(true)}
                className={`p-2 sm:p-2.5 rounded-xl border flex items-center justify-center transition-all cursor-pointer ${
                  isDrawerOpen
                    ? "bg-[#D3CCB0] text-[#000000] border-[#D3CCB0]"
                    : "bg-[#111317] text-white border-[#202C44] hover:border-[#D3CCB0] hover:bg-[#202C44]/80"
                }`}
                aria-label="Open Navigation Menu"
                title="Open Menu"
              >
                <Menu className="w-5 h-5 stroke-[2.2]" />
              </button>

              {/* Kreate Studio Logo & Brand Name */}
              <Link
                to="/"
                id="header-logo-link"
                className="flex items-center gap-2 sm:gap-2.5 shrink-0 group py-1"
                title="Kreate Studio — India’s Creative Marketplace"
              >
                <div
                  className={`w-9 h-9 rounded-xl border flex items-center justify-center transition-all ${
                    isSellerMode
                      ? "bg-emerald-950/80 border-emerald-800 group-hover:border-emerald-400"
                      : "bg-[#202C44] border-[#202C44] group-hover:border-[#D3CCB0]"
                  }`}
                >
                  <span
                    className={`font-heading font-black text-lg ${
                      isSellerMode ? "text-emerald-400" : "text-[#D3CCB0]"
                    }`}
                  >
                    K
                  </span>
                </div>
                <div className="flex flex-col">
                  <span className="font-heading font-bold text-base text-white tracking-tight leading-none group-hover:text-[#D3CCB0] transition-colors">
                    Kreate <span className={isSellerMode ? "text-emerald-400" : "text-[#D3CCB0]"}>Studio</span>
                  </span>
                  <span className="text-[10px] text-[#7B8A90] font-sans font-medium tracking-wide leading-tight mt-0.5 hidden md:inline">
                    India’s Creative Marketplace
                  </span>
                </div>
              </Link>
            </div>

            {/* Center: Global Search Bar with Autocomplete Suggestions */}
            <div
              className="flex-1 max-w-xs sm:max-w-md md:max-w-lg lg:max-w-xl relative hidden sm:block"
              ref={searchContainerRef}
            >
              <form onSubmit={handleSearch} className="relative w-full" id="global-search-form">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#7B8A90]" />
                <input
                  id="global-search-input"
                  type="text"
                  placeholder={
                    isSellerMode
                      ? "Search your assets, templates, codebases…"
                      : "Search UI kits, templates, 3D models…"
                  }
                  value={searchQuery}
                  onFocus={() => setIsSearchFocused(true)}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-[#111317] text-white text-xs pl-10 pr-20 py-2.5 rounded-xl border border-[#202C44] focus:outline-none focus:border-[#D3CCB0] placeholder-[#7B8A90] transition-all"
                />
                <button
                  type="submit"
                  id="global-search-submit"
                  className="absolute right-1.5 top-1/2 -translate-y-1/2 bg-[#202C44] hover:bg-[#D3CCB0] text-[#D3CCB0] hover:text-[#000000] text-[11px] font-mono font-bold px-3 py-1 rounded-lg transition-colors cursor-pointer"
                >
                  Search
                </button>
              </form>

              {/* Autocomplete Dropdown */}
              {isSearchFocused && (
                <div
                  id="search-autocomplete-dropdown"
                  className="absolute top-full left-0 right-0 mt-2 bg-[#111317] border border-[#202C44] rounded-2xl shadow-2xl p-4 z-50 text-xs space-y-4 max-h-[380px] overflow-y-auto animate-in fade-in"
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
                          className="text-left px-2.5 py-1.5 rounded-lg bg-[#202C44]/40 hover:bg-[#202C44] text-white text-[11px] flex items-center justify-between transition-colors cursor-pointer"
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
                          className="px-2.5 py-1 rounded-md bg-[#202C44] hover:bg-[#D3CCB0] text-[#D3CCB0] hover:text-[#000000] text-[11px] font-mono font-bold transition-colors cursor-pointer"
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
                          className="text-left px-2.5 py-1.5 rounded-lg hover:bg-[#202C44]/60 text-[#7B8A90] hover:text-white text-[11px] flex items-center justify-between transition-colors cursor-pointer"
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

            {/* Right: Quick User Account / Sign In */}
            <div className="flex items-center gap-2 sm:gap-3 shrink-0">
              
              {/* Mobile Search Toggle (Visible only on small screens) */}
              <button
                type="button"
                onClick={() => setMobileSearchVisible(!mobileSearchVisible)}
                className="sm:hidden p-2 rounded-xl bg-[#111317] border border-[#202C44] text-[#7B8A90] hover:text-white"
                aria-label="Search"
              >
                <Search className="w-4 h-4" />
              </button>

              {/* If Logged Out: Keep "Sign In" Button Visible in Header */}
              {!isAuthenticated ? (
                <div className="flex items-center gap-2" id="header-auth-actions">
                  <Link
                    to="/signin"
                    id="header-signin-button"
                    className="text-xs font-semibold text-[#D3CCB0] hover:text-white px-3 py-2 rounded-xl bg-[#202C44]/40 hover:bg-[#202C44] border border-[#202C44] transition-colors"
                  >
                    Sign In
                  </Link>

                  <Link
                    to="/signup"
                    id="header-signup-button"
                    className="hidden xs:inline-flex bg-[#D3CCB0] hover:bg-[#c4bb9a] text-[#000000] text-xs font-heading font-black px-3.5 sm:px-4 py-2 rounded-xl transition-all shadow-md active:scale-95 items-center gap-1"
                  >
                    <span>Get Started</span>
                  </Link>
                </div>
              ) : (
                /* If Logged In: Compact Profile Avatar Button */
                <Link
                  to={isSellerMode ? "/dashboard" : "/purchases"}
                  id="header-user-badge"
                  title={`Logged in as ${userProfile?.name || "User"} (${isSellerMode ? "Seller" : "Buyer"})`}
                  className="flex items-center gap-2 p-1 sm:px-2.5 sm:py-1 rounded-xl bg-[#111317] border border-[#202C44] hover:border-[#D3CCB0]/60 transition-all"
                >
                  <div
                    className={`w-7 h-7 rounded-lg font-mono font-bold text-xs flex items-center justify-center border ${
                      isSellerMode
                        ? "bg-emerald-950 text-emerald-400 border-emerald-800"
                        : "bg-[#202C44] text-[#D3CCB0] border-[#202C44]"
                    }`}
                  >
                    {userProfile?.name?.slice(0, 2).toUpperCase() || "US"}
                  </div>
                  <div className="hidden md:flex flex-col text-left">
                    <span className="text-xs text-white font-medium max-w-[90px] truncate leading-tight">
                      {userProfile?.name || "My Account"}
                    </span>
                    <span
                      className={`text-[9px] font-mono leading-none mt-0.5 flex items-center gap-1 ${
                        isSellerMode ? "text-emerald-400" : "text-[#D3CCB0]"
                      }`}
                    >
                      {isSellerMode ? "Seller Studio" : "Buyer Mode"}
                    </span>
                  </div>
                </Link>
              )}

            </div>
          </div>

          {/* Mobile Search Row (if toggled on mobile) */}
          {mobileSearchVisible && (
            <div className="sm:hidden py-2.5 pb-3 border-t border-[#202C44] animate-in fade-in">
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
                  className="absolute right-1.5 top-1/2 -translate-y-1/2 bg-[#D3CCB0] text-[#000000] text-[11px] font-mono font-bold px-2.5 py-1 rounded-lg"
                >
                  Go
                </button>
              </form>
            </div>
          )}
        </div>
      </header>

      {/* =========================================================
          2. THE HAMBURGER MENU (SLIDE-IN DRAWER ON LEFT SIDE)
          - Sliding in smoothly from LEFT
          - Tailored specifically for Seller Mode vs. Buyer Mode:
            * Seller Mode: Creator Dashboard, My Storefront, Marketplace, New Listing
            * Buyer Mode: Explore Assets, Marketplace, Categories, My Library, Saved
         ========================================================= */}
      {isDrawerOpen && (
        <div className="fixed inset-0 z-50 flex justify-start" id="hamburger-drawer-overlay">
          {/* Backdrop Overlay */}
          <div
            className="fixed inset-0 bg-[#000000]/80 backdrop-blur-sm transition-opacity animate-in fade-in duration-200 cursor-pointer"
            onClick={closeDrawer}
            aria-hidden="true"
          />

          {/* Side Drawer Panel on the LEFT */}
          <div
            id="hamburger-side-drawer"
            className="relative w-full max-w-xs sm:max-w-sm bg-[#111317] border-r border-[#202C44] h-full shadow-2xl z-50 flex flex-col justify-between overflow-y-auto animate-in slide-in-from-left duration-300 ease-out"
          >
            {/* Drawer Header */}
            <div className="p-4 sm:p-5 border-b border-[#202C44] flex items-center justify-between bg-[#111317] sticky top-0 z-10">
              <div className="flex items-center gap-2.5">
                <div
                  className={`w-8 h-8 rounded-lg border flex items-center justify-center ${
                    isSellerMode
                      ? "bg-emerald-950 border-emerald-800 text-emerald-400"
                      : "bg-[#202C44] border-[#202C44] text-[#D3CCB0]"
                  }`}
                >
                  <span className="font-heading font-black text-sm">K</span>
                </div>
                <div>
                  <h2 className="font-heading font-bold text-sm text-white leading-tight">
                    Kreate <span className={isSellerMode ? "text-emerald-400" : "text-[#D3CCB0]"}>Studio</span>
                  </h2>
                  <span className="text-[10px] text-[#7B8A90] font-mono">
                    {isSellerMode ? "Seller Studio Menu" : "Buyer Menu"}
                  </span>
                </div>
              </div>

              {/* Clear 'X' Close Button */}
              <button
                type="button"
                id="drawer-close-button"
                onClick={closeDrawer}
                className="p-2 rounded-xl bg-[#202C44]/50 border border-[#202C44] text-[#7B8A90] hover:text-white hover:border-[#D3CCB0] transition-all cursor-pointer"
                aria-label="Close menu"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Drawer Scrollable Body */}
            <div className="p-4 sm:p-5 space-y-5 flex-1 overflow-y-auto">
              
              {/* User Identity / Account Summary (if authenticated) */}
              {isAuthenticated && (
                <div className="p-3 rounded-2xl bg-[#000000]/60 border border-[#202C44] flex items-center justify-between">
                  <div className="flex items-center gap-2.5 truncate">
                    <div
                      className={`w-8 h-8 rounded-xl font-mono font-bold text-xs flex items-center justify-center border shrink-0 ${
                        isSellerMode
                          ? "bg-emerald-950 text-emerald-400 border-emerald-800"
                          : "bg-[#202C44] text-[#D3CCB0] border-[#202C44]"
                      }`}
                    >
                      {userProfile?.name?.slice(0, 2).toUpperCase() || "US"}
                    </div>
                    <div className="truncate">
                      <p className="text-xs font-bold text-white truncate">{userProfile?.name || "User"}</p>
                      <p className="text-[10px] text-[#7B8A90] font-mono truncate">{userProfile?.email}</p>
                    </div>
                  </div>
                  <span
                    className={`text-[9px] px-2 py-0.5 rounded-full font-mono font-bold shrink-0 ${
                      isSellerMode
                        ? "text-emerald-400 bg-emerald-950 border border-emerald-800"
                        : "text-[#D3CCB0] bg-[#202C44] border border-[#202C44]"
                    }`}
                  >
                    {isSellerMode ? "Seller" : "Buyer"}
                  </span>
                </div>
              )}

              {/* =========================================================
                  SELLER MODE NAVIGATION (4 Focused Features):
                  1. Creator Dashboard
                  2. My Storefront
                  3. Marketplace
                  4. New Listing
                 ========================================================= */}
              {isSellerMode ? (
                <div className="space-y-1.5" id="drawer-seller-links">
                  <span className="text-[10px] font-mono uppercase tracking-wider text-emerald-400 font-semibold px-1">
                    Seller Studio Tools
                  </span>
                  <div className="space-y-1">
                    
                    {/* 1. Creator Dashboard */}
                    <Link
                      to="/dashboard"
                      onClick={closeDrawer}
                      id="drawer-link-dashboard"
                      className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                        isActive("/dashboard")
                          ? "bg-emerald-400 text-[#000000] shadow-md font-bold"
                          : "text-slate-300 hover:text-white hover:bg-[#202C44]/60"
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <LayoutDashboard className={`w-4 h-4 ${isActive("/dashboard") ? "text-[#000000]" : "text-emerald-400"}`} />
                        <span>Creator Dashboard</span>
                      </div>
                      <ChevronRight className={`w-3.5 h-3.5 opacity-60 ${isActive("/dashboard") ? "text-[#000000]" : "text-[#7B8A90]"}`} />
                    </Link>

                    {/* 2. My Storefront */}
                    <Link
                      to={`/profile/${currentUsername}`}
                      onClick={closeDrawer}
                      id="drawer-link-storefront"
                      className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                        isActive(`/profile/${currentUsername}`)
                          ? "bg-[#D3CCB0] text-[#000000] shadow-md font-bold"
                          : "text-slate-300 hover:text-white hover:bg-[#202C44]/60"
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <Store className={`w-4 h-4 ${isActive(`/profile/${currentUsername}`) ? "text-[#000000]" : "text-[#D3CCB0]"}`} />
                        <span>My Storefront</span>
                      </div>
                      <ChevronRight className={`w-3.5 h-3.5 opacity-60 ${isActive(`/profile/${currentUsername}`) ? "text-[#000000]" : "text-[#7B8A90]"}`} />
                    </Link>

                    {/* 3. Marketplace */}
                    <Link
                      to="/browse"
                      onClick={closeDrawer}
                      id="drawer-link-marketplace"
                      className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                        isActive("/browse")
                          ? "bg-[#D3CCB0] text-[#000000] shadow-md font-bold"
                          : "text-slate-300 hover:text-white hover:bg-[#202C44]/60"
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <ShoppingBag className={`w-4 h-4 ${isActive("/browse") ? "text-[#000000]" : "text-[#D3CCB0]"}`} />
                        <span>Marketplace</span>
                      </div>
                      <ChevronRight className={`w-3.5 h-3.5 opacity-60 ${isActive("/browse") ? "text-[#000000]" : "text-[#7B8A90]"}`} />
                    </Link>

                    {/* 4. Upload Asset */}
                    <Link
                      to="/sell/new"
                      onClick={closeDrawer}
                      id="drawer-link-new-listing"
                      className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                        isActive("/sell/new")
                          ? "bg-emerald-400 text-[#000000] shadow-md font-bold"
                          : "text-slate-300 hover:text-white hover:bg-[#202C44]/60"
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <PlusCircle className={`w-4 h-4 ${isActive("/sell/new") ? "text-[#000000]" : "text-emerald-400"}`} />
                        <span>Upload Asset</span>
                      </div>
                      <span className={`text-[9px] font-mono font-bold px-2 py-0.5 rounded ${
                        isActive("/sell/new") ? "bg-[#000000] text-emerald-400" : "bg-emerald-950 text-emerald-400 border border-emerald-900"
                      }`}>
                        Publish
                      </span>
                    </Link>

                  </div>
                </div>
              ) : (
                /* =========================================================
                    BUYER MODE NAVIGATION (Focused Features):
                    1. Explore Assets
                    2. Marketplace
                    3. Categories
                    4. My Library
                    5. Saved Items
                   ========================================================= */
                <div className="space-y-1.5" id="drawer-buyer-links">
                  <span className="text-[10px] font-mono uppercase tracking-wider text-[#D3CCB0] font-semibold px-1">
                    Marketplace & Library
                  </span>
                  <div className="space-y-1">
                    
                    {/* 1. Explore Assets */}
                    <Link
                      to="/"
                      onClick={closeDrawer}
                      id="drawer-link-explore"
                      className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                        isActive("/")
                          ? "bg-[#D3CCB0] text-[#000000] shadow-md font-bold"
                          : "text-slate-300 hover:text-white hover:bg-[#202C44]/60"
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <Compass className={`w-4 h-4 ${isActive("/") ? "text-[#000000]" : "text-[#D3CCB0]"}`} />
                        <span>Explore Assets</span>
                      </div>
                      <ChevronRight className={`w-3.5 h-3.5 opacity-60 ${isActive("/") ? "text-[#000000]" : "text-[#7B8A90]"}`} />
                    </Link>

                    {/* 2. Marketplace */}
                    <Link
                      to="/browse"
                      onClick={closeDrawer}
                      id="drawer-link-marketplace-buyer"
                      className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                        isActive("/browse")
                          ? "bg-[#D3CCB0] text-[#000000] shadow-md font-bold"
                          : "text-slate-300 hover:text-white hover:bg-[#202C44]/60"
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <ShoppingBag className={`w-4 h-4 ${isActive("/browse") ? "text-[#000000]" : "text-[#D3CCB0]"}`} />
                        <span>Marketplace</span>
                      </div>
                      <ChevronRight className={`w-3.5 h-3.5 opacity-60 ${isActive("/browse") ? "text-[#000000]" : "text-[#7B8A90]"}`} />
                    </Link>

                    {/* 3. Categories */}
                    <Link
                      to="/categories"
                      onClick={closeDrawer}
                      id="drawer-link-categories"
                      className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                        isActive("/categories")
                          ? "bg-[#D3CCB0] text-[#000000] shadow-md font-bold"
                          : "text-slate-300 hover:text-white hover:bg-[#202C44]/60"
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <Layers className={`w-4 h-4 ${isActive("/categories") ? "text-[#000000]" : "text-[#D3CCB0]"}`} />
                        <span>Categories</span>
                      </div>
                      <ChevronRight className={`w-3.5 h-3.5 opacity-60 ${isActive("/categories") ? "text-[#000000]" : "text-[#7B8A90]"}`} />
                    </Link>

                    {/* 4. My Library (Purchases) */}
                    <Link
                      to="/purchases"
                      onClick={closeDrawer}
                      id="drawer-link-library"
                      className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                        isActive("/purchases")
                          ? "bg-[#D3CCB0] text-[#000000] shadow-md font-bold"
                          : "text-slate-300 hover:text-white hover:bg-[#202C44]/60"
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <ShoppingBag className={`w-4 h-4 ${isActive("/purchases") ? "text-[#000000]" : "text-[#D3CCB0]"}`} />
                        <span>My Library</span>
                      </div>
                      {purchasesCount > 0 ? (
                        <span
                          className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-full ${
                            isActive("/purchases") ? "bg-[#000000] text-[#D3CCB0]" : "bg-[#202C44] text-[#D3CCB0]"
                          }`}
                        >
                          {purchasesCount}
                        </span>
                      ) : (
                        <ChevronRight className={`w-3.5 h-3.5 opacity-60 ${isActive("/purchases") ? "text-[#000000]" : "text-[#7B8A90]"}`} />
                      )}
                    </Link>

                    {/* 5. Saved Items */}
                    <Link
                      to="/saved"
                      onClick={closeDrawer}
                      id="drawer-link-saved"
                      className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                        isActive("/saved")
                          ? "bg-[#D3CCB0] text-[#000000] shadow-md font-bold"
                          : "text-slate-300 hover:text-white hover:bg-[#202C44]/60"
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <Heart
                          className={`w-4 h-4 ${
                            isActive("/saved")
                              ? "text-[#000000] fill-[#000000]"
                              : savedCount > 0
                              ? "text-pink-400 fill-pink-400/20"
                              : "text-[#7B8A90]"
                          }`}
                        />
                        <span>Saved</span>
                      </div>
                      {savedCount > 0 ? (
                        <span
                          className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-full ${
                            isActive("/saved") ? "bg-[#000000] text-[#D3CCB0]" : "bg-[#202C44] text-[#D3CCB0]"
                          }`}
                        >
                          {savedCount}
                        </span>
                      ) : (
                        <ChevronRight className={`w-3.5 h-3.5 opacity-60 ${isActive("/saved") ? "text-[#000000]" : "text-[#7B8A90]"}`} />
                      )}
                    </Link>

                    {/* 6. Upload Asset / Start Selling Gateway */}
                    <Link
                      to="/upgrade-seller"
                      onClick={closeDrawer}
                      id="drawer-link-start-selling"
                      className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                        isActive("/upgrade-seller") || isActive("/sell/new")
                          ? "bg-[#D3CCB0] text-[#000000] shadow-md font-bold"
                          : "text-emerald-400 hover:text-emerald-300 hover:bg-emerald-950/40 bg-[#111317] border border-emerald-900/50"
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <UploadCloud className="w-4 h-4 text-emerald-400" />
                        <span className="font-bold text-white">Start Selling</span>
                      </div>
                      <span className="text-[9px] font-mono font-bold px-2 py-0.5 rounded bg-emerald-950 text-emerald-400 border border-emerald-900">
                        90% Split
                      </span>
                    </Link>

                  </div>
                </div>
              )}

              {/* Mode Switcher Button (One-Click Toggle) */}
              {isAuthenticated && (
                <div className="pt-2 border-t border-[#202C44]" id="drawer-role-switcher">
                  {!isSellerMode ? (
                    <button
                      type="button"
                      id="drawer-switch-to-seller"
                      onClick={handleToggleMode}
                      className="w-full text-left p-3 rounded-2xl bg-[#202C44]/40 hover:bg-[#202C44] border border-[#202C44] hover:border-emerald-500/60 transition-all group cursor-pointer"
                    >
                      <div className="flex items-center justify-between mb-1">
                        <div className="flex items-center gap-2 text-emerald-400 font-bold text-xs">
                          <Store className="w-4 h-4" />
                          <span>Switch to Seller Studio</span>
                        </div>
                        <span className="text-[9px] font-mono text-emerald-400 bg-emerald-950 px-1.5 py-0.5 rounded border border-emerald-900">
                          90% Split
                        </span>
                      </div>
                      <p className="text-[10.5px] text-[#7B8A90] leading-snug">
                        Sell digital assets and manage payouts.
                      </p>
                    </button>
                  ) : (
                    <button
                      type="button"
                      id="drawer-switch-to-buyer"
                      onClick={handleToggleMode}
                      className="w-full text-left p-3 rounded-2xl bg-[#202C44]/40 hover:bg-[#202C44] border border-[#202C44] hover:border-[#D3CCB0] transition-all group cursor-pointer"
                    >
                      <div className="flex items-center justify-between mb-1">
                        <div className="flex items-center gap-2 text-[#D3CCB0] font-bold text-xs">
                          <ShoppingBag className="w-4 h-4" />
                          <span>Switch to Buyer Mode</span>
                        </div>
                        <span className="text-[9px] font-mono text-[#D3CCB0] bg-[#202C44] px-1.5 py-0.5 rounded">
                          Browse
                        </span>
                      </div>
                      <p className="text-[10.5px] text-[#7B8A90] leading-snug">
                        Discover & purchase verified assets.
                      </p>
                    </button>
                  )}
                </div>
              )}

              {/* Logged-Out Prompt in Drawer */}
              {!isAuthenticated && (
                <div className="p-3.5 rounded-2xl bg-[#000000]/60 border border-[#202C44] space-y-2.5">
                  <div>
                    <h3 className="font-heading font-bold text-white text-xs">Join Kreate Studio</h3>
                    <p className="text-[10.5px] text-[#7B8A90] mt-0.5">
                      Buy assets or sell and keep 90% revenue.
                    </p>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <Link
                      to="/signin"
                      onClick={closeDrawer}
                      id="drawer-auth-signin"
                      className="w-full py-2 bg-[#202C44] text-[#D3CCB0] text-center text-xs font-bold rounded-xl hover:bg-[#202C44]/80 border border-[#202C44]"
                    >
                      Sign In
                    </Link>
                    <Link
                      to="/signup"
                      onClick={closeDrawer}
                      id="drawer-auth-signup"
                      className="w-full py-2 bg-[#D3CCB0] text-[#000000] text-center text-xs font-bold rounded-xl hover:bg-[#c4bb9a]"
                    >
                      Sign Up
                    </Link>
                  </div>
                </div>
              )}

            </div>

            {/* Drawer Footer: Logout & Security */}
            <div className="p-4 border-t border-[#202C44] bg-[#000000]/40 space-y-3">
              {/* Logout Action (if Authenticated) */}
              {isAuthenticated && (
                <button
                  type="button"
                  id="drawer-logout-button"
                  onClick={() => {
                    closeDrawer();
                    if (onLogout) onLogout();
                  }}
                  className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 font-semibold text-xs border border-rose-500/20 transition-all cursor-pointer"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Sign Out</span>
                </button>
              )}

              {/* Security Badge */}
              <div className="flex items-center justify-center gap-1.5 text-[10px] text-[#7B8A90]">
                <ShieldCheck className="w-3 h-3 text-emerald-400" />
                <span>256-bit encryption • Direct UPI Settlements</span>
              </div>
            </div>

          </div>
        </div>
      )}
    </>
  );
};

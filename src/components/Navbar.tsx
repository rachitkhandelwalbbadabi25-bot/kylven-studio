import React, { useState, useRef, useEffect, useMemo } from "react";
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
  ShieldCheck,
  ChevronRight,
  ChevronDown,
  Sparkles,
  UploadCloud,
  ArrowRight,
  CheckCircle2,
  Package,
  Mail,
  Settings
} from "lucide-react";
import { UserProfile, UserRole } from "../types";
import { MOCK_LISTINGS, CREATORS_DIRECTORY } from "../data/mockData";
import { BrandMark, BrandLogo } from "./BrandLogo";

interface NavbarProps {
  isAuthenticated?: boolean;
  userProfile?: UserProfile;
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  onSearchSubmit?: (q?: string) => void;
  onOpenAuthModal?: (mode?: "signin" | "signup") => void;
  onLogout?: () => void;
  savedCount?: number;
  purchasesCount?: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  isAuthenticated = false,
  userProfile,
  searchQuery,
  setSearchQuery,
  onLogout,
  savedCount = 0,
  purchasesCount = 0,
}) => {
  const navigate = useNavigate();
  const location = useLocation();

  // Navigation Drawer & Account Dropdown state
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [mobileSearchVisible, setMobileSearchVisible] = useState(false);
  const [accountDropdownOpen, setAccountDropdownOpen] = useState(false);

  const searchContainerRef = useRef<HTMLDivElement>(null);
  const accountDropdownRef = useRef<HTMLDivElement>(null);
  const isSellerMode = userProfile?.role === "seller";
  const currentUsername = userProfile?.username || "rachitkhandelwal20";
  const userEmail = userProfile?.email || "kavishkhandelwal9@gmail.com";
  const userInitial = userProfile?.name ? userProfile.name.trim().charAt(0).toUpperCase() : "R";

  // Close search suggestions & account dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchContainerRef.current && !searchContainerRef.current.contains(event.target as Node)) {
        setIsSearchFocused(false);
      }
      if (accountDropdownRef.current && !accountDropdownRef.current.contains(event.target as Node)) {
        setAccountDropdownOpen(false);
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
    setAccountDropdownOpen(false);
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

  // Matching creators & users
  const allCreators = useMemo(() => Object.values(CREATORS_DIRECTORY), []);

  const matchingUsers = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) {
      return allCreators.slice(0, 3);
    }
    return allCreators
      .filter(
        (c) =>
          c.name.toLowerCase().includes(q) ||
          c.username.toLowerCase().includes(q) ||
          (c.handle && c.handle.toLowerCase().includes(q)) ||
          (c.bio && c.bio.toLowerCase().includes(q)) ||
          (c.skills && c.skills.some((s) => s.toLowerCase().includes(q))) ||
          (c.location && c.location.toLowerCase().includes(q))
      )
      .slice(0, 4);
  }, [allCreators, searchQuery]);

  // Matching digital assets
  const matchingAssets = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) {
      return MOCK_LISTINGS.slice(0, 4);
    }
    return MOCK_LISTINGS
      .filter(
        (a) =>
          a.title.toLowerCase().includes(q) ||
          a.category.toLowerCase().includes(q) ||
          (a.subcategory && a.subcategory.toLowerCase().includes(q)) ||
          (a.tags && a.tags.some((t) => t.toLowerCase().includes(q))) ||
          (a.shortDescription && a.shortDescription.toLowerCase().includes(q)) ||
          (a.creator?.name && a.creator.name.toLowerCase().includes(q)) ||
          (a.seller?.name && a.seller.name.toLowerCase().includes(q))
      )
      .slice(0, 5);
  }, [searchQuery]);

  const handleSelectUser = (username: string) => {
    setIsSearchFocused(false);
    setMobileSearchVisible(false);
    navigate(`/profile/${username}`);
  };

  const handleSelectAsset = (assetId: string) => {
    setIsSearchFocused(false);
    setMobileSearchVisible(false);
    navigate(`/asset/${assetId}`);
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
                className="flex items-center gap-2.5 shrink-0 group py-1"
                title="Kreate Studio — India’s Creative Marketplace"
              >
                <BrandMark
                  size={36}
                  variant={isSellerMode ? "emerald" : "navy"}
                  className="rounded-xl border border-[#202C44] group-hover:border-[#D3CCB0] transition-all shadow-md group-hover:scale-105"
                />
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

            {/* Center: Global Search Bar with Users & Assets Autocomplete (Authenticated Only) */}
            {isAuthenticated ? (
              <div
                className="flex-1 max-w-xs sm:max-w-md md:max-w-lg lg:max-w-xl relative hidden sm:block"
                ref={searchContainerRef}
              >
                <form onSubmit={handleSearch} className="relative w-full" id="global-search-form">
                  <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#7B8A90]" />
                  <input
                    id="global-search-input"
                    type="text"
                    placeholder="Search users, sellers, assets, templates…"
                    value={searchQuery}
                    onFocus={() => setIsSearchFocused(true)}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full bg-[#111317] text-white text-xs pl-10 pr-20 py-2.5 rounded-xl border border-[#202C44] focus:outline-none focus:border-[#D3CCB0] placeholder-[#7B8A90] transition-all"
                  />
                  {searchQuery && (
                    <button
                      type="button"
                      onClick={() => setSearchQuery("")}
                      className="absolute right-16 top-1/2 -translate-y-1/2 text-[#7B8A90] hover:text-white p-1"
                      title="Clear search"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  )}
                  <button
                    type="submit"
                    id="global-search-submit"
                    className="absolute right-1.5 top-1/2 -translate-y-1/2 bg-[#202C44] hover:bg-[#D3CCB0] text-[#D3CCB0] hover:text-[#000000] text-[11px] font-mono font-bold px-3 py-1 rounded-lg transition-colors cursor-pointer"
                  >
                    Search
                  </button>
                </form>

                {/* Autocomplete Dropdown - Users & Assets */}
                {isSearchFocused && (
                  <div
                    id="search-autocomplete-dropdown"
                    className="absolute top-full left-0 right-0 mt-2 bg-[#111317] border border-[#202C44] rounded-2xl shadow-2xl p-3 sm:p-4 z-50 text-xs space-y-4 max-h-[420px] overflow-y-auto animate-in fade-in"
                  >
                    {/* 1. Users / Sellers Section */}
                    {matchingUsers.length > 0 && (
                      <div>
                        <div className="flex items-center justify-between text-[10px] font-mono uppercase tracking-wider text-[#7B8A90] mb-2 font-semibold px-1">
                          <div className="flex items-center gap-1.5">
                            <User className="w-3.5 h-3.5 text-[#D3CCB0]" />
                            <span>{searchQuery ? "Matching Users & Sellers" : "Featured Sellers"}</span>
                          </div>
                          <span className="text-[9px] text-[#7B8A90]">{matchingUsers.length} found</span>
                        </div>
                        <div className="space-y-1.5">
                          {matchingUsers.map((user) => (
                            <button
                              key={user.id || user.username}
                              type="button"
                              onClick={() => handleSelectUser(user.username)}
                              className="w-full text-left p-2 rounded-xl bg-[#202C44]/30 hover:bg-[#202C44] border border-[#202C44]/60 hover:border-[#D3CCB0]/40 transition-all flex items-center justify-between group cursor-pointer"
                            >
                              <div className="flex items-center gap-2.5 min-w-0">
                                <img
                                  src={user.avatar}
                                  alt={user.name}
                                  className="w-7 h-7 rounded-full object-cover border border-[#202C44] shrink-0"
                                />
                                <div className="min-w-0">
                                  <div className="flex items-center gap-1.5">
                                    <span className="text-white text-xs font-semibold truncate group-hover:text-[#D3CCB0] transition-colors">
                                      {user.name}
                                    </span>
                                    <span className="bg-emerald-950/80 text-emerald-400 border border-emerald-800/80 text-[9px] font-mono px-1.5 py-0.5 rounded-md shrink-0">
                                      {user.badge || "Seller"}
                                    </span>
                                  </div>
                                  <span className="text-[10px] text-[#7B8A90] font-mono block truncate">
                                    @{user.username} {user.location ? `• ${user.location}` : ""}
                                  </span>
                                </div>
                              </div>
                              <ChevronRight className="w-3.5 h-3.5 text-[#7B8A90] group-hover:text-[#D3CCB0] shrink-0" />
                            </button>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* 2. Digital Assets Section */}
                    {matchingAssets.length > 0 && (
                      <div>
                        <div className="flex items-center justify-between text-[10px] font-mono uppercase tracking-wider text-[#7B8A90] mb-2 font-semibold px-1">
                          <div className="flex items-center gap-1.5">
                            <Package className="w-3.5 h-3.5 text-[#D3CCB0]" />
                            <span>{searchQuery ? "Matching Assets" : "Popular Assets"}</span>
                          </div>
                          <span className="text-[9px] text-[#7B8A90]">{matchingAssets.length} found</span>
                        </div>
                        <div className="space-y-1.5">
                          {matchingAssets.map((asset) => (
                            <button
                              key={asset.id}
                              type="button"
                              onClick={() => handleSelectAsset(asset.id)}
                              className="w-full text-left p-2 rounded-xl bg-[#202C44]/30 hover:bg-[#202C44] border border-[#202C44]/60 hover:border-[#D3CCB0]/40 transition-all flex items-center justify-between group cursor-pointer"
                            >
                              <div className="flex items-center gap-2.5 min-w-0">
                                <img
                                  src={asset.thumbnailUrl}
                                  alt={asset.title}
                                  className="w-8 h-8 rounded-lg object-cover border border-[#202C44] shrink-0"
                                />
                                <div className="min-w-0">
                                  <span className="text-white text-xs font-semibold truncate block group-hover:text-[#D3CCB0] transition-colors">
                                    {asset.title}
                                  </span>
                                  <div className="flex items-center gap-2 mt-0.5">
                                    <span className="text-[10px] text-[#7B8A90] truncate">
                                      {asset.category}
                                    </span>
                                    <span className="text-[9px] font-mono font-bold text-[#D3CCB0] bg-[#000000]/60 px-1.5 py-0.5 rounded border border-[#202C44]">
                                      {asset.priceInINR === 0 ? "FREE" : `₹${asset.priceInINR}`}
                                    </span>
                                  </div>
                                </div>
                              </div>
                              <ChevronRight className="w-3.5 h-3.5 text-[#7B8A90] group-hover:text-[#D3CCB0] shrink-0" />
                            </button>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* No Matches State */}
                    {matchingUsers.length === 0 && matchingAssets.length === 0 && (
                      <div className="p-4 text-center space-y-2">
                        <p className="text-xs text-[#7B8A90]">
                          No users or assets found matching <strong className="text-white">"{searchQuery}"</strong>
                        </p>
                        <button
                          type="button"
                          onClick={() => {
                            setIsSearchFocused(false);
                            navigate("/browse");
                          }}
                          className="text-xs text-[#D3CCB0] hover:underline font-semibold"
                        >
                          Explore all marketplace assets →
                        </button>
                      </div>
                    )}

                    {/* Footer / Search All Action */}
                    {searchQuery.trim() && (
                      <div className="pt-2 border-t border-[#202C44]">
                        <button
                          type="button"
                          onClick={() => {
                            setIsSearchFocused(false);
                            navigate(`/browse?q=${encodeURIComponent(searchQuery.trim())}`);
                          }}
                          className="w-full py-2 px-3 bg-[#202C44]/50 hover:bg-[#D3CCB0] text-[#D3CCB0] hover:text-[#000000] font-bold text-xs rounded-xl transition-all flex items-center justify-center gap-1.5 active:scale-[0.99]"
                        >
                          <span>Search all assets for "{searchQuery}"</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            ) : (
              <div className="flex-1 max-w-xs sm:max-w-md md:max-w-lg hidden sm:flex items-center justify-center">
                {/* Clean spacer on public landing page */}
                <span className="text-[11px] font-mono text-[#7B8A90]/70 uppercase tracking-widest hidden md:inline">
                  India’s Creative & Digital Assets Hub
                </span>
              </div>
            )}

            {/* Right: Quick User Account / Sign In */}
            <div className="flex items-center gap-2 sm:gap-3 shrink-0">
              
              {/* Mobile Search Toggle (Visible only when authenticated on small screens) */}
              {isAuthenticated && (
                <button
                  type="button"
                  onClick={() => setMobileSearchVisible(!mobileSearchVisible)}
                  className="sm:hidden p-2 rounded-xl bg-[#111317] border border-[#202C44] text-[#7B8A90] hover:text-white"
                  aria-label="Search"
                >
                  <Search className="w-4 h-4" />
                </button>
              )}

              {/* In Seller Mode: Quick "Upload Asset" & Explore links in Header */}
              {isSellerMode && (
                <div className="hidden md:flex items-center gap-2">
                  <Link
                    to="/sell/new"
                    id="header-seller-upload-btn"
                    className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black border border-emerald-400 text-xs font-heading font-black transition-all shadow-md active:scale-95"
                    title="Upload New Asset"
                  >
                    <PlusCircle className="w-3.5 h-3.5" />
                    <span>Upload Asset</span>
                  </Link>
                  <Link
                    to="/browse"
                    id="header-seller-explore-link"
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#202C44]/40 hover:bg-[#202C44] text-[#D3CCB0] hover:text-white border border-[#202C44] text-xs font-semibold transition-all"
                    title="Explore Marketplace Assets"
                  >
                    <Compass className="w-3.5 h-3.5 text-[#D3CCB0]" />
                    <span>Explore</span>
                  </Link>
                </div>
              )}

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
                /* If Logged In: Account Identity Trigger & Dropdown Menu */
                <div className="relative" ref={accountDropdownRef}>
                  <button
                    type="button"
                    onClick={() => setAccountDropdownOpen((prev) => !prev)}
                    id="header-user-badge"
                    aria-expanded={accountDropdownOpen}
                    title={`Account: ${userProfile?.name || "User"}`}
                    className={`flex items-center gap-2 p-1 sm:px-2.5 sm:py-1 rounded-xl bg-[#111317] border transition-all group ${
                      accountDropdownOpen
                        ? "border-[#D3CCB0] bg-[#161922]"
                        : "border-[#202C44] hover:border-[#D3CCB0]/60"
                    }`}
                  >
                    <div
                      className={`w-7 h-7 rounded-lg font-mono font-bold text-xs flex items-center justify-center border transition-transform group-hover:scale-105 ${
                        isSellerMode
                          ? "bg-emerald-950 text-emerald-400 border-emerald-800"
                          : "bg-[#202C44] text-[#D3CCB0] border-[#202C44]"
                      }`}
                    >
                      {userInitial}
                    </div>
                    <div className="hidden md:flex flex-col text-left">
                      <span className="text-xs text-white font-medium max-w-[100px] truncate leading-tight group-hover:text-[#D3CCB0] transition-colors">
                        {userProfile?.name || "Rachit Khandelwal20"}
                      </span>
                      <span
                        className={`text-[9px] font-mono leading-none mt-0.5 flex items-center gap-1 ${
                          isSellerMode ? "text-emerald-400 font-semibold" : "text-[#D3CCB0]"
                        }`}
                      >
                        {isSellerMode ? "Seller Studio" : "Buyer"}
                      </span>
                    </div>
                    <ChevronDown
                      className={`w-3.5 h-3.5 text-[#7B8A90] group-hover:text-white transition-transform ${
                        accountDropdownOpen ? "rotate-180 text-[#D3CCB0]" : ""
                      }`}
                    />
                  </button>

                  {/* Desktop Account Dropdown Menu */}
                  {accountDropdownOpen && (
                    <div
                      id="account-dropdown-menu"
                      className="absolute right-0 top-full mt-2 w-72 bg-[#111317] border border-[#202C44] rounded-2xl shadow-2xl p-3 z-50 animate-in fade-in slide-in-from-top-2 space-y-3"
                    >
                      {/* Identity Card: Large Name -> Muted Username -> Clean Email */}
                      <div className="p-3 rounded-xl bg-[#000000]/70 border border-[#202C44] space-y-1.5">
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] font-mono uppercase tracking-wider text-[#D3CCB0] font-semibold">
                            Account Profile
                          </span>
                          <span
                            className={`text-[9px] px-2 py-0.5 rounded-md font-mono font-bold ${
                              isSellerMode
                                ? "text-emerald-400 bg-emerald-950 border border-emerald-800"
                                : "text-[#D3CCB0] bg-[#202C44] border border-[#202C44]"
                            }`}
                          >
                            {isSellerMode ? "Creator / Seller" : "Buyer"}
                          </span>
                        </div>

                        {/* Large Name */}
                        <p className="text-sm font-heading font-extrabold text-white tracking-tight truncate">
                          {userProfile?.name || "Rachit Khandelwal20"}
                        </p>

                        {/* Muted Username */}
                        <p className="text-xs text-[#7B8A90] font-mono">
                          @{currentUsername}
                        </p>

                        {/* Email Address directly below */}
                        <div className="flex items-center gap-1.5 text-xs text-[#7B8A90] font-mono pt-0.5 border-t border-[#202C44]/80">
                          <Mail className="w-3.5 h-3.5 text-[#7B8A90] shrink-0" />
                          <span className="text-[#A0AEC0] truncate select-all">{userEmail}</span>
                        </div>
                      </div>

                      {/* Dropdown Navigation Links */}
                      <div className="space-y-1">
                        <Link
                          to="/profile"
                          onClick={() => setAccountDropdownOpen(false)}
                          className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium text-white hover:bg-[#202C44]/80 hover:text-[#D3CCB0] transition-colors"
                        >
                          <User className="w-4 h-4 text-[#7B8A90]" />
                          <span>View {isSellerMode ? "Seller Profile" : "Buyer Profile"}</span>
                        </Link>

                        <Link
                          to="/dashboard"
                          onClick={() => setAccountDropdownOpen(false)}
                          className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium text-white hover:bg-[#202C44]/80 hover:text-[#D3CCB0] transition-colors"
                        >
                          <LayoutDashboard className="w-4 h-4 text-[#7B8A90]" />
                          <span>{isSellerMode ? "Seller Analytics Dashboard" : "Buyer Dashboard"}</span>
                        </Link>

                        <Link
                          to="/saved"
                          onClick={() => setAccountDropdownOpen(false)}
                          className="flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium text-white hover:bg-[#202C44]/80 hover:text-[#D3CCB0] transition-colors"
                        >
                          <div className="flex items-center gap-2.5">
                            <Heart className="w-4 h-4 text-[#7B8A90]" />
                            <span>Saved Items</span>
                          </div>
                          {savedCount > 0 && (
                            <span className="text-[10px] font-mono font-bold bg-[#D3CCB0] text-black px-1.5 py-0.2 rounded-full">
                              {savedCount}
                            </span>
                          )}
                        </Link>

                        {isSellerMode && (
                          <Link
                            to="/sell"
                            onClick={() => setAccountDropdownOpen(false)}
                            className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-[#D3CCB0] bg-[#202C44]/40 hover:bg-[#202C44] transition-colors"
                          >
                            <PlusCircle className="w-4 h-4 text-[#D3CCB0]" />
                            <span>Upload New Asset</span>
                          </Link>
                        )}
                      </div>

                      {/* Sign Out Button */}
                      {onLogout && (
                        <div className="pt-1 border-t border-[#202C44]">
                          <button
                            type="button"
                            onClick={() => {
                              setAccountDropdownOpen(false);
                              onLogout();
                            }}
                            className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-medium text-rose-400 hover:bg-rose-950/30 transition-colors"
                          >
                            <LogOut className="w-4 h-4" />
                            <span>Sign Out</span>
                          </button>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}

            </div>
          </div>

          {/* Mobile Search Row (if toggled on mobile) */}
          {mobileSearchVisible && (
            <div className="sm:hidden py-2.5 pb-3 border-t border-[#202C44] animate-in fade-in space-y-3">
              <form onSubmit={handleSearch} className="relative w-full">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#7B8A90]" />
                <input
                  type="text"
                  placeholder="Search users, sellers, assets…"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-[#111317] text-white text-xs pl-10 pr-20 py-2.5 rounded-xl border border-[#202C44] focus:outline-none focus:border-[#D3CCB0]"
                />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => setSearchQuery("")}
                    className="absolute right-14 top-1/2 -translate-y-1/2 text-[#7B8A90] hover:text-white p-1"
                    title="Clear search"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
                <button
                  type="submit"
                  className="absolute right-1.5 top-1/2 -translate-y-1/2 bg-[#D3CCB0] text-[#000000] text-[11px] font-mono font-bold px-2.5 py-1 rounded-lg"
                >
                  Go
                </button>
              </form>

              {/* Mobile Autocomplete Results */}
              <div className="bg-[#111317] border border-[#202C44] rounded-xl p-3 space-y-3 max-h-72 overflow-y-auto">
                {/* Users / Sellers */}
                {matchingUsers.length > 0 && (
                  <div className="space-y-1.5">
                    <div className="flex items-center gap-1.5 text-[10px] font-mono uppercase tracking-wider text-[#7B8A90] font-semibold">
                      <User className="w-3 h-3 text-[#D3CCB0]" />
                      <span>{searchQuery ? "Users & Sellers" : "Featured Sellers"}</span>
                    </div>
                    {matchingUsers.map((user) => (
                      <button
                        key={user.id || user.username}
                        type="button"
                        onClick={() => handleSelectUser(user.username)}
                        className="w-full text-left p-1.5 rounded-lg bg-[#202C44]/30 hover:bg-[#202C44] flex items-center justify-between"
                      >
                        <div className="flex items-center gap-2 min-w-0">
                          <img
                            src={user.avatar}
                            alt={user.name}
                            className="w-6 h-6 rounded-full object-cover shrink-0"
                          />
                          <span className="text-white text-xs truncate">{user.name}</span>
                          <span className="text-[9px] text-[#7B8A90] font-mono shrink-0">@{user.username}</span>
                        </div>
                        <ChevronRight className="w-3 h-3 text-[#7B8A90] shrink-0" />
                      </button>
                    ))}
                  </div>
                )}

                {/* Assets */}
                {matchingAssets.length > 0 && (
                  <div className="space-y-1.5">
                    <div className="flex items-center gap-1.5 text-[10px] font-mono uppercase tracking-wider text-[#7B8A90] font-semibold">
                      <Package className="w-3 h-3 text-[#D3CCB0]" />
                      <span>{searchQuery ? "Assets" : "Popular Assets"}</span>
                    </div>
                    {matchingAssets.map((asset) => (
                      <button
                        key={asset.id}
                        type="button"
                        onClick={() => handleSelectAsset(asset.id)}
                        className="w-full text-left p-1.5 rounded-lg bg-[#202C44]/30 hover:bg-[#202C44] flex items-center justify-between"
                      >
                        <div className="flex items-center gap-2 min-w-0">
                          <img
                            src={asset.thumbnailUrl}
                            alt={asset.title}
                            className="w-6 h-6 rounded-md object-cover shrink-0"
                          />
                          <span className="text-white text-xs truncate">{asset.title}</span>
                        </div>
                        <span className="text-[9px] font-mono font-bold text-[#D3CCB0] shrink-0 ml-1">
                          {asset.priceInINR === 0 ? "FREE" : `₹${asset.priceInINR}`}
                        </span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </header>

      {/* =========================================================
          2. THE HAMBURGER MENU (SLIDE-IN DRAWER ON LEFT SIDE)
          - Sliding in smoothly from LEFT
          - Tailored specifically for Seller Mode vs. Buyer Mode:
            * Seller Mode: Creator Dashboard, Profile, Upload Asset
            * Buyer Mode: Explore Assets, Categories, My Library, Saved Items
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
                <BrandMark
                  size={32}
                  variant={isSellerMode ? "emerald" : "navy"}
                  className="rounded-lg border border-[#202C44]"
                />
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
                <Link
                  to="/profile"
                  onClick={closeDrawer}
                  id="drawer-user-badge"
                  title="View your profile"
                  className="p-3.5 rounded-2xl bg-[#000000]/80 border border-[#202C44] hover:border-[#D3CCB0]/60 flex items-center justify-between transition-all group cursor-pointer space-y-1"
                >
                  <div className="flex items-start gap-3 truncate">
                    <div
                      className={`w-9 h-9 rounded-xl font-mono font-bold text-xs flex items-center justify-center border shrink-0 transition-transform group-hover:scale-105 mt-0.5 ${
                        isSellerMode
                          ? "bg-emerald-950 text-emerald-400 border-emerald-800"
                          : "bg-[#202C44] text-[#D3CCB0] border-[#202C44]"
                      }`}
                    >
                      {userInitial}
                    </div>
                    <div className="truncate text-left space-y-0.5">
                      {/* 1. Large Name */}
                      <p className="text-sm font-heading font-extrabold text-white group-hover:text-[#D3CCB0] transition-colors truncate">
                        {userProfile?.name || "Rachit Khandelwal20"}
                      </p>
                      {/* 2. Muted Username */}
                      <p className="text-xs text-[#7B8A90] font-mono truncate">
                        @{currentUsername}
                      </p>
                      {/* 3. Email Address directly below */}
                      <p className="text-[11px] text-[#A0AEC0] font-mono truncate flex items-center gap-1">
                        <Mail className="w-3 h-3 text-[#7B8A90] shrink-0" />
                        <span>{userEmail}</span>
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5 shrink-0 self-start mt-1">
                    <span
                      className={`text-[9px] px-2 py-0.5 rounded-full font-mono font-bold ${
                        isSellerMode
                          ? "text-emerald-400 bg-emerald-950 border border-emerald-800"
                          : "text-[#D3CCB0] bg-[#202C44] border border-[#202C44]"
                      }`}
                    >
                      {isSellerMode ? "Seller" : "Buyer"}
                    </span>
                    <ChevronRight className="w-3.5 h-3.5 text-[#7B8A90] group-hover:text-[#D3CCB0] transition-transform group-hover:translate-x-0.5" />
                  </div>
                </Link>
              )}

              {/* =========================================================
                  DRAWER LINKS:
                  1. Unauthenticated: Public Navigation Links
                  2. Authenticated Seller: Seller Studio Tools
                  3. Authenticated Buyer: Buyer Marketplace & Library
                 ========================================================= */}
              {!isAuthenticated ? (
                /* Public Visitor Navigation */
                <div className="space-y-1.5" id="drawer-public-links">
                  <span className="text-[10px] font-mono uppercase tracking-wider text-[#D3CCB0] font-semibold px-1">
                    Public Overview
                  </span>
                  <div className="space-y-1">
                    <Link
                      to="/"
                      onClick={closeDrawer}
                      id="drawer-link-home"
                      className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                        isActive("/")
                          ? "bg-[#D3CCB0] text-[#000000] shadow-md font-bold"
                          : "text-slate-300 hover:text-white hover:bg-[#202C44]/60"
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <Sparkles className={`w-4 h-4 ${isActive("/") ? "text-[#000000]" : "text-[#D3CCB0]"}`} />
                        <span>Platform Overview</span>
                      </div>
                      <ChevronRight className={`w-3.5 h-3.5 opacity-60 ${isActive("/") ? "text-[#000000]" : "text-[#7B8A90]"}`} />
                    </Link>

                    <Link
                      to="/how-it-works"
                      onClick={closeDrawer}
                      id="drawer-link-how-it-works"
                      className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                        isActive("/how-it-works")
                          ? "bg-[#D3CCB0] text-[#000000] shadow-md font-bold"
                          : "text-slate-300 hover:text-white hover:bg-[#202C44]/60"
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <Compass className={`w-4 h-4 ${isActive("/how-it-works") ? "text-[#000000]" : "text-[#D3CCB0]"}`} />
                        <span>How It Works</span>
                      </div>
                      <ChevronRight className={`w-3.5 h-3.5 opacity-60 ${isActive("/how-it-works") ? "text-[#000000]" : "text-[#7B8A90]"}`} />
                    </Link>

                    <Link
                      to="/pricing"
                      onClick={closeDrawer}
                      id="drawer-link-pricing"
                      className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                        isActive("/pricing")
                          ? "bg-[#D3CCB0] text-[#000000] shadow-md font-bold"
                          : "text-slate-300 hover:text-white hover:bg-[#202C44]/60"
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <Layers className={`w-4 h-4 ${isActive("/pricing") ? "text-[#000000]" : "text-[#D3CCB0]"}`} />
                        <span>Pricing & UPI Revenue Split</span>
                      </div>
                      <ChevronRight className={`w-3.5 h-3.5 opacity-60 ${isActive("/pricing") ? "text-[#000000]" : "text-[#7B8A90]"}`} />
                    </Link>
                  </div>
                </div>
              ) : isSellerMode ? (
                /* Authenticated Seller Studio Tools */
                <div className="space-y-1.5" id="drawer-seller-links">
                  <span className="text-[10px] font-mono uppercase tracking-wider text-emerald-400 font-semibold px-1">
                    Seller Studio Tools
                  </span>
                  <div className="space-y-1">
                    
                    {/* 1. Seller Dashboard */}
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
                        <span>Seller Dashboard</span>
                      </div>
                      <ChevronRight className={`w-3.5 h-3.5 opacity-60 ${isActive("/dashboard") ? "text-[#000000]" : "text-[#7B8A90]"}`} />
                    </Link>

                    {/* 2. Profile */}
                    <Link
                      to={`/profile/${currentUsername}`}
                      onClick={closeDrawer}
                      id="drawer-link-profile"
                      className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                        isActive(`/profile/${currentUsername}`)
                          ? "bg-[#D3CCB0] text-[#000000] shadow-md font-bold"
                          : "text-slate-300 hover:text-white hover:bg-[#202C44]/60"
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <User className={`w-4 h-4 ${isActive(`/profile/${currentUsername}`) ? "text-[#000000]" : "text-[#D3CCB0]"}`} />
                        <span>Profile</span>
                      </div>
                      <ChevronRight className={`w-3.5 h-3.5 opacity-60 ${isActive(`/profile/${currentUsername}`) ? "text-[#000000]" : "text-[#7B8A90]"}`} />
                    </Link>

                    {/* 3. Upload Asset */}
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
                      <ChevronRight className={`w-3.5 h-3.5 opacity-60 ${isActive("/sell/new") ? "text-[#000000]" : "text-[#7B8A90]"}`} />
                    </Link>

                    {/* 4. Explore Assets */}
                    <Link
                      to="/browse"
                      onClick={closeDrawer}
                      id="drawer-link-seller-explore"
                      className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                        isActive("/browse")
                          ? "bg-[#D3CCB0] text-[#000000] shadow-md font-bold"
                          : "text-slate-300 hover:text-white hover:bg-[#202C44]/60"
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <Compass className={`w-4 h-4 ${isActive("/browse") ? "text-[#000000]" : "text-[#D3CCB0]"}`} />
                        <span>Explore Assets</span>
                      </div>
                      <ChevronRight className={`w-3.5 h-3.5 opacity-60 ${isActive("/browse") ? "text-[#000000]" : "text-[#7B8A90]"}`} />
                    </Link>

                  </div>
                </div>
              ) : (
                /* Authenticated Buyer Mode Navigation */
                <div className="space-y-1.5" id="drawer-buyer-links">
                  <span className="text-[10px] font-mono uppercase tracking-wider text-[#D3CCB0] font-semibold px-1">
                    Discover & Library
                  </span>
                  <div className="space-y-1">
                    
                    {/* 1. Explore Assets */}
                    <Link
                      to="/browse"
                      onClick={closeDrawer}
                      id="drawer-link-explore"
                      className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                        isActive("/browse")
                          ? "bg-[#D3CCB0] text-[#000000] shadow-md font-bold"
                          : "text-slate-300 hover:text-white hover:bg-[#202C44]/60"
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <Compass className={`w-4 h-4 ${isActive("/browse") ? "text-[#000000]" : "text-[#D3CCB0]"}`} />
                        <span>Explore Assets</span>
                      </div>
                      <ChevronRight className={`w-3.5 h-3.5 opacity-60 ${isActive("/browse") ? "text-[#000000]" : "text-[#7B8A90]"}`} />
                    </Link>

                    {/* 2. Categories */}
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

                    {/* 3. My Library (Purchases) */}
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

                    {/* 4. Saved Items */}
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

                    {/* 5. Start Selling Gateway */}
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
                      <ChevronRight className={`w-3.5 h-3.5 opacity-60 ${isActive("/upgrade-seller") ? "text-[#000000]" : "text-[#7B8A90]"}`} />
                    </Link>

                  </div>
                </div>
              )}

              {/* Logged-Out Prompt in Drawer */}
              {!isAuthenticated && (
                <div className="p-3.5 rounded-2xl bg-[#000000]/60 border border-[#202C44] space-y-2.5">
                  <div>
                    <h3 className="font-heading font-bold text-white text-xs">Join Kreate Studio</h3>
                    <p className="text-[10.5px] text-[#7B8A90] mt-0.5">
                      Buy assets or sell and keep 87.5% revenue.
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
                    navigate("/?signedOut=true", { replace: true, state: { signedOut: true } });
                  }}
                  className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 font-semibold text-xs border border-rose-500/20 transition-all cursor-pointer active:scale-98"
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

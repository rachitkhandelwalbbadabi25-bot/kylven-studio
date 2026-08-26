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
  Repeat
} from "lucide-react";
import { UserProfile } from "../types";

interface NavbarProps {
  isAuthenticated?: boolean;
  userProfile?: UserProfile;
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  onSearchSubmit?: (q?: string) => void;
  onOpenAuthModal?: (mode?: "signin" | "signup") => void;
  onLogout?: () => void;
  onToggleRole?: () => void;
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
    if (path === "/pricing") return location.pathname === "/pricing";
    if (path === "/sell/new") return location.pathname === "/sell/new" || location.pathname === "/sell";
    return location.pathname === path;
  };

  const currentUsername = userProfile?.username || "buildwithansh";

  return (
    <header className="sticky top-0 z-50 bg-[#000000]/95 backdrop-blur-md border-b border-[#202C44]" id="public-header">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-3 sm:gap-6">
          
          {/* Logo & Subtitle */}
          <Link
            to="/"
            id="header-logo-link"
            className="flex items-center gap-3 shrink-0 group py-1"
            title="Kreate Studio — India’s Creative Marketplace"
          >
            <div className="w-9 h-9 rounded-xl bg-[#202C44] border border-[#202C44] flex items-center justify-center transition-all group-hover:border-[#D3CCB0]">
              <span className="font-heading font-extrabold text-lg text-[#D3CCB0]">K</span>
            </div>
            <div className="flex flex-col">
              <span className="font-heading font-bold text-base text-white tracking-tight leading-none group-hover:text-[#D3CCB0] transition-colors">
                Kreate <span className="text-[#D3CCB0]">Studio</span>
              </span>
              <span className="text-[10px] text-[#7B8A90] font-sans font-medium tracking-wide leading-tight mt-0.5">
                India’s Creative Marketplace
              </span>
            </div>
          </Link>

          {/* Global Search Field with Autocomplete Suggestions */}
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

          {/* Primary Navigation Links (Updated for Sellers) */}
          <nav className="hidden md:flex items-center gap-1 lg:gap-1.5">
            <Link
              to="/browse"
              id="nav-link-browse"
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                isActive("/browse")
                  ? "bg-[#202C44] text-[#D3CCB0] font-bold"
                  : "text-[#7B8A90] hover:text-white hover:bg-[#202C44]/50"
              }`}
            >
              Browse
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

            {/* Dashboard Link for Authenticated Sellers */}
            {isAuthenticated && (
              <Link
                to="/dashboard"
                id="nav-link-dashboard"
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors flex items-center gap-1.5 ${
                  isActive("/dashboard")
                    ? "bg-[#202C44] text-[#D3CCB0] font-bold"
                    : "text-[#7B8A90] hover:text-white hover:bg-[#202C44]/50"
                }`}
              >
                <LayoutDashboard className="w-3.5 h-3.5" />
                <span>Dashboard</span>
              </Link>
            )}

            {/* My Purchases */}
            {isAuthenticated && (
              <Link
                to="/purchases"
                id="nav-link-purchases"
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors flex items-center gap-1.5 ${
                  isActive("/purchases")
                    ? "bg-[#202C44] text-[#D3CCB0] font-bold"
                    : "text-[#7B8A90] hover:text-white hover:bg-[#202C44]/50"
                }`}
              >
                <span>My Purchases</span>
                {purchasesCount > 0 && (
                  <span className="bg-[#D3CCB0] text-[#000000] text-[10px] font-mono font-bold px-1.5 py-0.2 rounded-full">
                    {purchasesCount}
                  </span>
                )}
              </Link>
            )}

            {/* Sell Link directly takes user to /sell/new */}
            <Link
              to="/sell/new"
              id="nav-link-sell"
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                isActive("/sell/new")
                  ? "bg-[#202C44] text-[#D3CCB0] font-bold"
                  : "text-[#7B8A90] hover:text-white hover:bg-[#202C44]/50"
              }`}
            >
              Sell
            </Link>

            <Link
              to="/pricing"
              id="nav-link-pricing"
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                isActive("/pricing")
                  ? "bg-[#202C44] text-[#D3CCB0] font-bold"
                  : "text-[#7B8A90] hover:text-white hover:bg-[#202C44]/50"
              }`}
            >
              Pricing
            </Link>
          </nav>

          {/* Auth State & Account Dropdown */}
          <div className="flex items-center gap-2.5">
            {!isAuthenticated ? (
              <div className="flex items-center gap-2">
                <Link
                  to="/signin"
                  id="header-sign-in-btn"
                  className="bg-[#D3CCB0] hover:bg-[#c4bb9a] text-[#000000] text-xs font-bold px-4 py-2 rounded-xl transition-all shadow active:scale-95 flex items-center gap-1.5"
                >
                  <LogIn className="w-3.5 h-3.5 text-[#000000]" />
                  <span>Sign In</span>
                </Link>
              </div>
            ) : (
              <div className="flex items-center gap-2.5">
                
                {/* Upload Button */}
                <Link
                  to="/sell/new"
                  id="header-sell-btn"
                  className="hidden sm:flex items-center gap-1.5 bg-[#202C44] hover:bg-[#202C44]/80 text-[#D3CCB0] text-xs font-bold px-3 py-2 rounded-xl border border-[#202C44] transition-all active:scale-95"
                >
                  <PlusCircle className="w-3.5 h-3.5" />
                  <span>Sell Asset</span>
                </Link>

                {/* Account Menu Dropdown */}
                <div className="relative" ref={accountMenuRef}>
                  <button
                    id="account-menu-button"
                    onClick={() => setIsAccountMenuOpen(!isAccountMenuOpen)}
                    className="flex items-center gap-2 p-1.5 rounded-xl bg-[#111317] border border-[#202C44] hover:border-[#D3CCB0]/60 transition-all focus:outline-none"
                    aria-label="User account menu"
                  >
                    <div className="w-7 h-7 rounded-lg bg-[#202C44] text-[#D3CCB0] font-mono font-bold text-xs flex items-center justify-center border border-[#202C44]">
                      AB
                    </div>
                    <span className="hidden sm:block text-xs text-white font-medium max-w-[100px] truncate">
                      {userProfile?.name || "Ansh Bhardwaj"}
                    </span>
                    <ChevronDown className="w-3.5 h-3.5 text-[#7B8A90]" />
                  </button>

                  {/* Dropdown Menu */}
                  {isAccountMenuOpen && (
                    <div
                      id="account-menu-dropdown"
                      className="absolute right-0 mt-2 w-64 bg-[#111317] border border-[#202C44] rounded-2xl shadow-2xl py-2 z-50 text-xs animate-in fade-in"
                    >
                      <div className="px-4 py-2.5 border-b border-[#202C44]">
                        <div className="flex items-center justify-between">
                          <p className="text-white font-bold truncate">{userProfile?.name || "Ansh Bhardwaj"}</p>
                          <span className="text-[10px] text-[#D3CCB0] bg-[#202C44] px-1.5 py-0.5 rounded font-mono">
                            Seller
                          </span>
                        </div>
                        <p className="text-[11px] text-[#7B8A90] font-mono truncate">{userProfile?.email || "rrachitkhandelwal8@gmail.com"}</p>
                      </div>

                      <div className="py-1">
                        {/* 1. Profile Link */}
                        <Link
                          to={`/profile/${currentUsername}`}
                          id="menu-link-profile"
                          className="flex items-center gap-2.5 px-4 py-2 text-[#7B8A90] hover:text-white hover:bg-[#202C44]/50 transition-colors"
                        >
                          <User className="w-3.5 h-3.5 text-[#D3CCB0]" />
                          <span>Profile</span>
                        </Link>

                        {/* 2. Dashboard Link */}
                        <Link
                          to="/dashboard"
                          id="menu-link-dashboard"
                          className="flex items-center gap-2.5 px-4 py-2 text-[#7B8A90] hover:text-white hover:bg-[#202C44]/50 transition-colors"
                        >
                          <LayoutDashboard className="w-3.5 h-3.5 text-emerald-400" />
                          <span>Dashboard</span>
                        </Link>

                        {/* 3. Settings */}
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

                        <div className="my-1 border-t border-[#202C44]" />

                        {/* 4. Purchases */}
                        <Link
                          to="/purchases"
                          id="menu-link-purchases"
                          className="flex items-center justify-between px-4 py-2 text-[#7B8A90] hover:text-white hover:bg-[#202C44]/50 transition-colors"
                        >
                          <div className="flex items-center gap-2.5">
                            <ShoppingBag className="w-3.5 h-3.5 text-[#D3CCB0]" />
                            <span>Purchases</span>
                          </div>
                          {purchasesCount > 0 && (
                            <span className="bg-[#202C44] text-[#D3CCB0] text-[10px] font-mono px-1.5 py-0.5 rounded">
                              {purchasesCount}
                            </span>
                          )}
                        </Link>

                        {/* 5. Saved Items */}
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

            <div className="grid grid-cols-2 gap-2 pt-2 text-xs">
              <Link
                to="/browse"
                className="p-2.5 bg-[#111317] rounded-xl border border-[#202C44] text-white font-medium text-center hover:border-[#D3CCB0]"
              >
                Browse
              </Link>
              <Link
                to="/categories"
                className="p-2.5 bg-[#111317] rounded-xl border border-[#202C44] text-white font-medium text-center hover:border-[#D3CCB0]"
              >
                Categories
              </Link>
              <Link
                to="/dashboard"
                className="p-2.5 bg-[#111317] rounded-xl border border-[#202C44] text-[#D3CCB0] font-medium text-center hover:border-[#D3CCB0]"
              >
                Dashboard
              </Link>
              <Link
                to="/sell/new"
                className="p-2.5 bg-[#111317] rounded-xl border border-[#202C44] text-white font-medium text-center hover:border-[#D3CCB0]"
              >
                Sell Asset
              </Link>
            </div>

            {isAuthenticated && (
              <div className="pt-2 border-t border-[#202C44] space-y-1 text-xs">
                <Link to={`/profile/${currentUsername}`} className="flex items-center gap-2 py-2 text-[#7B8A90] hover:text-white">
                  <User className="w-4 h-4 text-[#D3CCB0]" />
                  <span>Profile</span>
                </Link>
                <Link to="/purchases" className="flex items-center gap-2 py-2 text-[#7B8A90] hover:text-white">
                  <ShoppingBag className="w-4 h-4 text-[#D3CCB0]" />
                  <span>Purchases ({purchasesCount})</span>
                </Link>
                <Link to="/saved" className="flex items-center gap-2 py-2 text-[#7B8A90] hover:text-white">
                  <Heart className="w-4 h-4 text-pink-400" />
                  <span>Saved Items ({savedCount})</span>
                </Link>
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
                <span className="text-[10px] text-[#7B8A90] uppercase font-mono block">Active Role Mode</span>
                <div className="flex items-center justify-between">
                  <span className="font-bold text-white">Creator & Buyer (Full Access)</span>
                  <span className="bg-emerald-950 text-emerald-400 font-mono text-[10px] px-2 py-0.5 rounded border border-emerald-800">
                    Active
                  </span>
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
                  <span className="text-emerald-400">Default</span>
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

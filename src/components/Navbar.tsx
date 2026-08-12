import React, { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { UserRole, UserProfile } from "../types";
import { Search, Heart, PlusCircle, Menu, X, ShoppingBag, Store, User, Repeat, LogIn, LogOut, ShieldCheck } from "lucide-react";

interface NavbarProps {
  userProfile: UserProfile;
  isAuthenticated: boolean;
  savedCount: number;
  purchasesCount: number;
  onSwitchRole: (newRole: UserRole) => void;
  onOpenOnboarding: () => void;
  onOpenAuthModal: (mode: "signin" | "signup") => void;
  onSignOut: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  userProfile,
  isAuthenticated,
  savedCount,
  purchasesCount,
  onSwitchRole,
  onOpenOnboarding,
  onOpenAuthModal,
  onSignOut,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchInput, setSearchInput] = useState("");
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchInput.trim()) {
      navigate(`/browse?q=${encodeURIComponent(searchInput.trim())}`);
    } else {
      navigate("/browse");
    }
  };

  const isActive = (path: string) => {
    if (path === "/" && location.pathname === "/") return true;
    if (path !== "/" && location.pathname.startsWith(path)) return true;
    return false;
  };

  const isSeller = userProfile.role === "seller";

  return (
    <header className="sticky top-0 z-40 bg-[#000000]/90 backdrop-blur-md border-b border-[#202C44]/60 transition-all">
      
      {/* Top Banner Notice */}
      <div className="bg-[#111317] border-b border-[#202C44] text-[#7B8A90] text-xs py-1.5 px-4">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
          
          <div className="flex items-center gap-2 text-center sm:text-left">
            <span className="bg-[#202C44] text-[#D3CCB0] text-[10px] uppercase font-bold px-1.5 py-0.5 rounded tracking-wider border border-[#202C44]">
              UPI Native
            </span>
            <span>Direct ₹ GPay, PhonePe & BHIM payouts. 90% seller split guaranteed.</span>
          </div>

          {/* Role Status or Sign In Callout */}
          <div className="flex items-center gap-3 shrink-0">
            {isAuthenticated ? (
              <>
                <div className="flex items-center gap-1.5 text-white font-medium text-[11px] bg-[#202C44]/80 px-2.5 py-0.5 rounded-full border border-[#202C44]">
                  {isSeller ? (
                    <>
                      <Store className="w-3.5 h-3.5 text-[#D3CCB0]" />
                      <span>Mode: <strong className="text-[#D3CCB0]">Seller Studio</strong></span>
                    </>
                  ) : (
                    <>
                      <ShoppingBag className="w-3.5 h-3.5 text-[#D3CCB0]" />
                      <span>Mode: <strong className="text-[#D3CCB0]">Buyer Experience</strong></span>
                    </>
                  )}
                </div>

                <button
                  onClick={() => {
                    const nextRole: UserRole = isSeller ? "buyer" : "seller";
                    onSwitchRole(nextRole);
                    if (nextRole === "seller") {
                      navigate("/seller");
                    } else {
                      navigate("/browse");
                    }
                  }}
                  className="text-[#D3CCB0] hover:text-white text-[11px] font-mono font-bold flex items-center gap-1 transition-colors hover:underline"
                >
                  <Repeat className="w-3 h-3" />
                  <span>Switch to {isSeller ? "Buyer View" : "Seller Studio"}</span>
                </button>
              </>
            ) : (
              <div className="flex items-center gap-2 text-[11px]">
                <span className="text-[#7B8A90]">Guest Visitor</span>
                <button
                  onClick={() => onOpenAuthModal("signin")}
                  className="text-[#D3CCB0] hover:text-white font-bold transition-colors hover:underline"
                >
                  Sign in
                </button>
                <span className="text-[#202C44]">•</span>
                <button
                  onClick={() => onOpenAuthModal("signup")}
                  className="text-white hover:text-[#D3CCB0] font-bold transition-colors hover:underline"
                >
                  Create account
                </button>
              </div>
            )}
          </div>

        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">
          
          {/* Logo & Mobile Menu Toggle */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 text-[#7B8A90] hover:text-white rounded-lg focus:outline-none focus-visible:ring-2 focus-visible:ring-[#D3CCB0]"
              aria-label="Toggle mobile menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>

            <Link
              to="/"
              className="flex items-center gap-2.5 group text-left"
            >
              <div className="w-9 h-9 rounded-xl bg-[#202C44] border border-[#202C44]/80 flex items-center justify-center shadow-inner group-hover:border-[#D3CCB0]/40 transition-colors">
                <span className="font-heading font-extrabold text-lg text-[#D3CCB0]">K</span>
              </div>
              <div>
                <span className="font-heading font-bold text-lg text-white tracking-tight group-hover:text-[#D3CCB0] transition-colors flex items-center gap-1">
                  Kreate <span className="text-[#D3CCB0] font-normal text-xs uppercase tracking-widest bg-[#202C44] px-1.5 py-0.5 rounded border border-[#202C44]">Studio</span>
                </span>
                <span className="block text-[10px] text-[#7B8A90] -mt-1 font-mono">India's Digital Assets Marketplace</span>
              </div>
            </Link>
          </div>

          {/* Desktop Search Bar */}
          <form onSubmit={handleSearchSubmit} className="hidden md:flex flex-1 max-w-md relative">
            <div className="relative w-full">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#7B8A90]" />
              <input
                type="text"
                placeholder="Search Figma UI, Flutter code, AI notebooks, LUTs..."
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                className="w-full bg-[#111317] text-white text-xs pl-10 pr-24 py-2.5 rounded-lg border border-[#202C44] focus:outline-none focus:border-[#D3CCB0]/60 placeholder-[#7B8A90] transition-colors"
                aria-label="Search digital assets catalog"
              />
              <button
                type="submit"
                className="absolute right-1.5 top-1/2 -translate-y-1/2 bg-[#202C44] hover:bg-[#202C44]/80 text-[#D3CCB0] text-[11px] font-medium px-2.5 py-1 rounded border border-[#202C44] transition-colors"
              >
                Search
              </button>
            </div>
          </form>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-6 text-xs font-medium">
            <Link
              to="/"
              className={`transition-colors hover:text-[#D3CCB0] ${
                isActive("/") ? "text-[#D3CCB0] font-semibold" : "text-[#7B8A90]"
              }`}
            >
              Home
            </Link>

            <Link
              to="/browse"
              className={`transition-colors hover:text-[#D3CCB0] ${
                isActive("/browse") ? "text-[#D3CCB0] font-semibold" : "text-[#7B8A90]"
              }`}
            >
              Explore Assets
            </Link>

            {isAuthenticated ? (
              isSeller ? (
                <Link
                  to="/seller"
                  className={`transition-colors hover:text-[#D3CCB0] flex items-center gap-1.5 ${
                    isActive("/seller") ? "text-[#D3CCB0] font-semibold" : "text-[#7B8A90]"
                  }`}
                >
                  <span>Seller Studio</span>
                  <span className="bg-[#202C44] text-[#D3CCB0] text-[10px] px-1.5 py-0.2 rounded font-mono border border-[#202C44]">
                    90% Split
                  </span>
                </Link>
              ) : (
                <Link
                  to="/purchases"
                  className={`transition-colors hover:text-[#D3CCB0] flex items-center gap-1.5 ${
                    isActive("/purchases") ? "text-[#D3CCB0] font-semibold" : "text-[#7B8A90]"
                  }`}
                >
                  <span>My Library</span>
                  {purchasesCount > 0 && (
                    <span className="bg-[#202C44] text-[#D3CCB0] text-[10px] px-1.5 py-0.2 rounded font-mono border border-[#202C44]">
                      {purchasesCount}
                    </span>
                  )}
                </Link>
              )
            ) : null}
          </nav>

          {/* Right Action Controls */}
          <div className="flex items-center gap-3">
            
            {/* Wishlist Icon */}
            <button
              onClick={() => {
                if (!isAuthenticated) {
                  onOpenAuthModal("signin");
                } else {
                  navigate("/saved");
                }
              }}
              className="relative p-2 text-[#7B8A90] hover:text-[#D3CCB0] hover:bg-[#202C44]/40 rounded-lg transition-colors"
              title="Saved Items"
              aria-label="View saved items"
            >
              <Heart className="w-5 h-5" />
              {isAuthenticated && savedCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-[#D3CCB0] text-[#000000] text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                  {savedCount}
                </span>
              )}
            </button>

            {/* Public Auth Buttons OR Profile Avatar Dropdown */}
            {isAuthenticated ? (
              <div className="relative">
                <button
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                  className="flex items-center gap-2 p-1.5 rounded-xl bg-[#111317] border border-[#202C44] hover:border-[#D3CCB0]/50 transition-all text-left"
                  aria-label="User profile menu"
                >
                  <img
                    src={userProfile.avatar}
                    alt={userProfile.name}
                    className="w-7 h-7 rounded-lg object-cover border border-[#202C44]"
                  />
                  <div className="hidden xl:block pr-1">
                    <div className="text-[11px] font-bold text-white leading-none truncate max-w-[90px]">
                      {userProfile.name}
                    </div>
                    <div className="text-[9px] text-[#D3CCB0] font-mono capitalize">
                      {isSeller ? "Seller Studio" : "Buyer"}
                    </div>
                  </div>
                </button>

                {/* Profile Popup Menu */}
                {userDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-56 bg-[#111317] border border-[#202C44] rounded-2xl p-2 shadow-2xl z-50 space-y-1 text-xs">
                    <div className="px-3 py-2 border-b border-[#202C44]">
                      <div className="font-bold text-white truncate">{userProfile.name}</div>
                      <div className="text-[10px] text-[#7B8A90] truncate">{userProfile.email}</div>
                    </div>

                    <button
                      onClick={() => {
                        setUserDropdownOpen(false);
                        onOpenOnboarding();
                      }}
                      className="w-full text-left px-3 py-2 rounded-xl hover:bg-[#202C44] text-[#D3CCB0] flex items-center gap-2"
                    >
                      <User className="w-4 h-4" />
                      <span>Edit Profile & UPI VPA</span>
                    </button>

                    <button
                      onClick={() => {
                        setUserDropdownOpen(false);
                        onSwitchRole(isSeller ? "buyer" : "seller");
                        navigate(isSeller ? "/browse" : "/seller");
                      }}
                      className="w-full text-left px-3 py-2 rounded-xl hover:bg-[#202C44] text-white flex items-center gap-2"
                    >
                      <Repeat className="w-4 h-4 text-[#D3CCB0]" />
                      <span>Switch to {isSeller ? "Buyer View" : "Seller Studio"}</span>
                    </button>

                    <button
                      onClick={() => {
                        setUserDropdownOpen(false);
                        onSignOut();
                      }}
                      className="w-full text-left px-3 py-2 rounded-xl hover:bg-[#202C44] text-rose-400 flex items-center gap-2 border-t border-[#202C44] mt-1"
                    >
                      <LogOut className="w-4 h-4" />
                      <span>Sign Out</span>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => onOpenAuthModal("signin")}
                  className="bg-[#202C44] hover:bg-[#202C44]/80 text-[#D3CCB0] font-bold text-xs px-3.5 py-2 rounded-xl border border-[#202C44] transition-all flex items-center gap-1.5"
                >
                  <LogIn className="w-3.5 h-3.5" />
                  <span>Sign In</span>
                </button>

                <button
                  onClick={() => onOpenAuthModal("signup")}
                  className="bg-[#D3CCB0] hover:bg-[#c4bb9a] text-[#000000] font-bold text-xs px-3.5 py-2 rounded-xl transition-all shadow active:scale-95 hidden sm:inline-flex"
                >
                  Create Account
                </button>
              </div>
            )}

            {/* Main Primary Action Button tailored to role */}
            {isAuthenticated && isSeller ? (
              <Link
                to="/seller"
                className="bg-[#D3CCB0] hover:bg-[#c4bb9a] text-[#000000] font-bold text-xs px-3.5 py-2 rounded-xl transition-all flex items-center gap-1.5 shadow-sm active:scale-95"
              >
                <PlusCircle className="w-4 h-4" />
                <span className="hidden sm:inline">Upload Asset</span>
                <span className="sm:hidden">Upload</span>
              </Link>
            ) : (
              <Link
                to="/browse"
                className="bg-[#D3CCB0] hover:bg-[#c4bb9a] text-[#000000] font-bold text-xs px-3.5 py-2 rounded-xl transition-all flex items-center gap-1.5 shadow-sm active:scale-95"
              >
                <ShoppingBag className="w-4 h-4 text-[#000000]" />
                <span className="hidden sm:inline">Browse Marketplace</span>
                <span className="sm:hidden">Browse</span>
              </Link>
            )}

          </div>
        </div>

        {/* Mobile Search Input */}
        <div className="md:hidden pb-3">
          <form onSubmit={handleSearchSubmit} className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#7B8A90]" />
            <input
              type="text"
              placeholder="Search UI kits, Flutter, Notebooks, LUTs..."
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              className="w-full bg-[#111317] text-white text-xs pl-9 pr-3 py-2 rounded-lg border border-[#202C44] focus:outline-none focus:border-[#D3CCB0]/60 placeholder-[#7B8A90]"
              aria-label="Mobile search catalog"
            />
          </form>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-[#111317] border-b border-[#202C44] px-4 py-3 space-y-2 text-xs font-medium">
          <Link
            to="/"
            onClick={() => setMobileMenuOpen(false)}
            className="block w-full text-left py-2 px-3 rounded-lg hover:bg-[#202C44] text-white"
          >
            Home / Landing
          </Link>
          <Link
            to="/browse"
            onClick={() => setMobileMenuOpen(false)}
            className="block w-full text-left py-2 px-3 rounded-lg hover:bg-[#202C44] text-white"
          >
            Explore All Digital Assets
          </Link>

          {isAuthenticated ? (
            <>
              <Link
                to="/purchases"
                onClick={() => setMobileMenuOpen(false)}
                className="block w-full text-left py-2 px-3 rounded-lg hover:bg-[#202C44] text-white"
              >
                My Buyer Library & Invoices ({purchasesCount})
              </Link>
              <Link
                to="/seller"
                onClick={() => setMobileMenuOpen(false)}
                className="block w-full text-left py-2 px-3 rounded-lg hover:bg-[#202C44] text-[#D3CCB0]"
              >
                Seller Dashboard & Uploads (90% Split)
              </Link>
              <Link
                to="/saved"
                onClick={() => setMobileMenuOpen(false)}
                className="block w-full text-left py-2 px-3 rounded-lg hover:bg-[#202C44] text-white"
              >
                Saved Assets ({savedCount})
              </Link>
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onSignOut();
                }}
                className="block w-full text-left py-2 px-3 rounded-lg bg-rose-950/40 text-rose-300 font-bold border border-rose-900/50"
              >
                Sign Out ({userProfile.name})
              </button>
            </>
          ) : (
            <div className="pt-2 border-t border-[#202C44] space-y-2">
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenAuthModal("signin");
                }}
                className="block w-full text-center py-2.5 px-3 rounded-xl bg-[#202C44] text-[#D3CCB0] font-bold"
              >
                Sign In
              </button>
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenAuthModal("signup");
                }}
                className="block w-full text-center py-2.5 px-3 rounded-xl bg-[#D3CCB0] text-[#000000] font-bold"
              >
                Create Account
              </button>
            </div>
          )}
        </div>
      )}
    </header>
  );
};


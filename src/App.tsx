import React, { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route, useLocation, Navigate } from "react-router-dom";
import { AssetListing, UserProfile, UserPurchase } from "./types";
import { MOCK_LISTINGS } from "./data/mockData";
import { Navbar } from "./components/Navbar";
import { Footer } from "./components/Footer";
import { HomePage } from "./pages/HomePage";
import { BrowsePage } from "./pages/BrowsePage";
import { CategoriesPage } from "./pages/CategoriesPage";
import { ListingDetailPage } from "./pages/ListingDetailPage";
import { CheckoutPage } from "./pages/CheckoutPage";
import { PricingPage } from "./pages/PricingPage";
import { CreatorProfilePage } from "./pages/CreatorProfilePage";
import { SellNewAssetPage } from "./pages/SellNewAssetPage";
import { DashboardPage } from "./pages/DashboardPage";
import { PurchasesPage } from "./pages/PurchasesPage";
import { SavedPage } from "./pages/SavedPage";
import { AuthPage } from "./pages/AuthPage";

// Automatically scroll to top on route change
function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

const DEFAULT_PROFILE: UserProfile = {
  name: "Aarav Sharma",
  email: "aarav.sharma@kreate.studio",
  username: "aarav_ui",
  role: "both",
  avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80",
  bio: "Founding UI/UX Designer & Flutter Engineer on Kreate Studio.",
};

const INITIAL_PURCHASES: UserPurchase[] = [
  {
    orderId: "KRT-892104",
    listingId: "asset-1",
    title: "BharatUPI & Banking Mobile App UI Kit",
    thumbnailUrl: "https://images.unsplash.com/photo-1563986768609-322da13575f3?w=800&auto=format&fit=crop&q=80",
    category: "UI/UX & Design",
    fileType: ".fig",
    downloadUrl: "https://kreatestudio.in/downloads/bharat-upi-uikit.zip",
    licenseKey: "KREATE-COMM-2026-BHARAT-8921",
    purchaseDate: "2026-08-10",
    pricePaidINR: 1649,
    sellerNetINR: 1349,
    platformFeeINR: 150,
    paymentMethod: "UPI (GPAY)",
  },
];

export default function App() {
  // Global Listings State (persisted with initial seed)
  const [listings, setListings] = useState<AssetListing[]>(() => {
    try {
      const saved = localStorage.getItem("kreate_listings");
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error(e);
    }
    return MOCK_LISTINGS;
  });

  // Auth State
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    try {
      const saved = localStorage.getItem("kreate_is_authenticated");
      return saved === "true";
    } catch (e) {
      return false;
    }
  });

  // User Profile
  const [userProfile, setUserProfile] = useState<UserProfile>(() => {
    try {
      const saved = localStorage.getItem("kreate_user_profile");
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error(e);
    }
    return DEFAULT_PROFILE;
  });

  // User Purchases
  const [purchases, setPurchases] = useState<UserPurchase[]>(() => {
    try {
      const saved = localStorage.getItem("kreate_purchases");
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error(e);
    }
    return INITIAL_PURCHASES;
  });

  // Saved Wishlist IDs
  const [savedIds, setSavedIds] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem("kreate_saved_ids");
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error(e);
    }
    return ["asset-1", "asset-3"];
  });

  // Global Search in Navbar
  const [globalSearch, setGlobalSearch] = useState("");

  // Persist State Changes
  useEffect(() => {
    try {
      localStorage.setItem("kreate_listings", JSON.stringify(listings));
    } catch (e) {}
  }, [listings]);

  useEffect(() => {
    try {
      localStorage.setItem("kreate_saved_ids", JSON.stringify(savedIds));
    } catch (e) {}
  }, [savedIds]);

  useEffect(() => {
    try {
      localStorage.setItem("kreate_purchases", JSON.stringify(purchases));
    } catch (e) {}
  }, [purchases]);

  const handleSignInSuccess = (profile: UserProfile) => {
    setIsAuthenticated(true);
    setUserProfile(profile);
    try {
      localStorage.setItem("kreate_is_authenticated", "true");
      localStorage.setItem("kreate_user_profile", JSON.stringify(profile));
    } catch (e) {
      console.error(e);
    }
  };

  const handleSignOut = () => {
    setIsAuthenticated(false);
    try {
      localStorage.setItem("kreate_is_authenticated", "false");
    } catch (e) {
      console.error(e);
    }
  };

  const handleToggleSave = (id: string) => {
    setSavedIds((prev) =>
      prev.includes(id) ? prev.filter((itemId) => itemId !== id) : [...prev, id]
    );
  };

  const handleAddNewListing = (newListing: AssetListing) => {
    setListings((prev) => [newListing, ...prev]);
  };

  const handleCompletePurchase = (purchase: UserPurchase) => {
    setPurchases((prev) => [purchase, ...prev]);
    // increment sales count on listing
    setListings((prev) =>
      prev.map((l) => (l.id === purchase.listingId ? { ...l, salesCount: (l.salesCount || 0) + 1 } : l))
    );
  };

  return (
    <BrowserRouter>
      <ScrollToTop />
      <div className="min-h-screen bg-[#000000] text-white flex flex-col font-sans selection:bg-[#202C44] selection:text-[#D3CCB0]">
        
        {/* Strict Public / Authenticated Navigation Bar */}
        <Navbar
          isAuthenticated={isAuthenticated}
          userProfile={userProfile}
          searchQuery={globalSearch}
          setSearchQuery={setGlobalSearch}
          onSearchSubmit={(q) => {}}
          onOpenAuthModal={() => {}}
          onLogout={handleSignOut}
          savedCount={savedIds.length}
          purchasesCount={purchases.length}
        />

        {/* Canonical Multi-Page Routes */}
        <main className="flex-1">
          <Routes>
            {/* 1. Public Homepage */}
            <Route
              path="/"
              element={
                <HomePage
                  listings={listings}
                  isAuthenticated={isAuthenticated}
                  userProfile={userProfile}
                  savedIds={savedIds}
                  onToggleSave={handleToggleSave}
                  onBuyNowDirect={(listing) => {}}
                />
              }
            />

            {/* 2. Browse Marketplace Feed */}
            <Route
              path="/browse"
              element={
                <BrowsePage
                  listings={listings}
                  savedIds={savedIds}
                  onToggleSave={handleToggleSave}
                  onBuyNowDirect={(listing) => {}}
                />
              }
            />

            {/* 3. Category Directory */}
            <Route path="/categories" element={<CategoriesPage />} />

            {/* 4. Listing Detail Page (by slug or id) */}
            <Route
              path="/listing/:slug"
              element={
                <ListingDetailPage
                  listings={listings}
                  onBuyNowDirect={(listing) => {}}
                  savedIds={savedIds}
                  onToggleSave={handleToggleSave}
                />
              }
            />
            {/* Alias /asset/:id compatibility */}
            <Route
              path="/asset/:id"
              element={
                <ListingDetailPage
                  listings={listings}
                  onBuyNowDirect={(listing) => {}}
                  savedIds={savedIds}
                  onToggleSave={handleToggleSave}
                />
              }
            />

            {/* 5. Checkout & UPI Payment */}
            <Route
              path="/checkout/:listingId"
              element={
                <CheckoutPage
                  listings={listings}
                  onCompletePurchase={handleCompletePurchase}
                  buyerEmail={userProfile.email}
                />
              }
            />

            {/* 6. Pricing & Fee Calculator */}
            <Route path="/pricing" element={<PricingPage />} />

            {/* 7. Public Creator Profile */}
            <Route
              path="/profile/:username"
              element={
                <CreatorProfilePage
                  listings={listings}
                  savedIds={savedIds}
                  onToggleSave={handleToggleSave}
                  onBuyNowDirect={(listing) => {}}
                />
              }
            />

            {/* 8. Sell Asset / Publish Studio */}
            <Route
              path="/sell/new"
              element={
                <SellNewAssetPage
                  onAddListing={handleAddNewListing}
                  userProfile={userProfile}
                />
              }
            />
            <Route
              path="/sell"
              element={<Navigate to="/sell/new" replace />}
            />

            {/* 9. Seller Studio Dashboard */}
            <Route
              path="/dashboard"
              element={
                <DashboardPage
                  listings={listings}
                  userProfile={userProfile}
                />
              }
            />
            <Route
              path="/seller"
              element={<Navigate to="/dashboard" replace />}
            />

            {/* 10. Buyer Purchases Library */}
            <Route
              path="/purchases"
              element={<PurchasesPage purchases={purchases} />}
            />

            {/* 11. Saved Wishlist */}
            <Route
              path="/saved"
              element={
                <SavedPage
                  listings={listings}
                  savedIds={savedIds}
                  onToggleSave={handleToggleSave}
                  onBuyNowDirect={(listing) => {}}
                />
              }
            />

            {/* 12. Auth (Sign In & Sign Up) */}
            <Route
              path="/signin"
              element={
                <AuthPage
                  onLoginSuccess={handleSignInSuccess}
                  defaultMode="signin"
                />
              }
            />
            <Route
              path="/signup"
              element={
                <AuthPage
                  onLoginSuccess={handleSignInSuccess}
                  defaultMode="signup"
                />
              }
            />

            {/* Catch-all fallback */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>

        {/* Global Footer */}
        <Footer />
      </div>
    </BrowserRouter>
  );
}

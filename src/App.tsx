import React, { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route, useLocation, Navigate, useNavigate } from "react-router-dom";
import { AssetListing, UserProfile, UserPurchase, UserRole } from "./types";
import { MOCK_LISTINGS } from "./data/mockData";
import { Navbar } from "./components/Navbar";
import { Footer } from "./components/Footer";
import { HomePage } from "./pages/HomePage";
import { IntroLandingPage } from "./pages/IntroLandingPage";
import { OnboardingPage } from "./pages/OnboardingPage";
import { HowItWorksPage } from "./pages/HowItWorksPage";
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
  name: "Ansh Bhardwaj",
  email: "rrachitkhandelwal8@gmail.com",
  username: "buildwithansh",
  role: "seller",
  avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80",
  bio: "Full-stack developer and UI designer building production-grade digital assets, cyberpunk kits, and developer starters.",
  location: "Bengaluru, India",
  upiId: "ansh@okhdfcbank",
  hasCompletedOnboarding: true,
};

const INITIAL_PURCHASES: UserPurchase[] = [
  {
    orderId: "KRT-892104",
    listingId: "asset-1",
    title: "BharatPay — Fintech & UPI Payments Figma UI Kit",
    thumbnailUrl: "https://images.unsplash.com/photo-1563986768609-322da13575f3?w=800&auto=format&fit=crop&q=80",
    category: "UI/UX & Design",
    fileType: ".fig",
    downloadUrl: "https://kreatestudio.dev/downloads/bharatpay-fintech-kit.zip",
    licenseKey: "KREATE-COMM-2026-BHARAT-8921",
    purchaseDate: "2026-08-10",
    pricePaidINR: 561,
    sellerNetINR: 449,
    platformFeeINR: 62,
    paymentMethod: "UPI (GPay)",
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

  // Auth State (defaults to true for immediate testability)
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    try {
      const saved = localStorage.getItem("kreate_is_authenticated");
      return saved !== null ? saved === "true" : true;
    } catch (e) {
      return true;
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

  const handleToggleRole = (newRole?: UserRole) => {
    const targetRole = newRole || (userProfile.role === "seller" ? "buyer" : "seller");
    setUserProfile((prev) => {
      const next = { ...prev, role: targetRole };
      try {
        localStorage.setItem("kreate_user_profile", JSON.stringify(next));
      } catch (e) {}
      return next;
    });
  };

  const handleSelectRoleOnboarding = (role: UserRole) => {
    setUserProfile((prev) => {
      const next = { ...prev, role, hasCompletedOnboarding: true };
      try {
        localStorage.setItem("kreate_user_profile", JSON.stringify(next));
      } catch (e) {}
      return next;
    });
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

  const handleUpdateUserProfile = (updated: Partial<UserProfile>) => {
    setUserProfile((prev) => {
      const next = { ...prev, ...updated };
      try {
        localStorage.setItem("kreate_user_profile", JSON.stringify(next));
      } catch (e) {}
      return next;
    });
  };

  return (
    <BrowserRouter>
      <ScrollToTop />
      <div className="min-h-screen bg-[#000000] text-white flex flex-col font-sans selection:bg-[#202C44] selection:text-[#D3CCB0]">
        
        {/* Context-aware Navigation Bar */}
        <Navbar
          isAuthenticated={isAuthenticated}
          userProfile={userProfile}
          searchQuery={globalSearch}
          setSearchQuery={setGlobalSearch}
          onSearchSubmit={(q) => {}}
          onOpenAuthModal={() => {}}
          onLogout={handleSignOut}
          onToggleRole={handleToggleRole}
          savedCount={savedIds.length}
          purchasesCount={purchases.length}
        />

        {/* Canonical Multi-Page Routes */}
        <main className="flex-1">
          <Routes>
            {/* 1. Root Route:
                - If logged out: Intro Tour Landing Page (no listings or dashboards)
                - If logged in as Buyer: Marketplace Browse Feed
                - If logged in as Seller: Seller Dashboard */}
            <Route
              path="/"
              element={
                !isAuthenticated ? (
                  <IntroLandingPage onGetStarted={() => {}} />
                ) : userProfile.role === "seller" ? (
                  <DashboardPage
                    listings={listings}
                    userProfile={userProfile}
                    onToggleRole={handleToggleRole}
                  />
                ) : (
                  <BrowsePage
                    listings={listings}
                    savedIds={savedIds}
                    onToggleSave={handleToggleSave}
                    onBuyNowDirect={(listing) => {}}
                  />
                )
              }
            />

            {/* 2. Onboarding Workspace Classification */}
            <Route
              path="/onboarding"
              element={
                <OnboardingPage
                  userProfile={userProfile}
                  onSelectRole={handleSelectRoleOnboarding}
                />
              }
            />

            {/* 3. Feature Tour / How it Works */}
            <Route path="/how-it-works" element={<HowItWorksPage />} />

            {/* 4. Browse Marketplace Feed */}
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

            {/* 5. Category Directory */}
            <Route path="/categories" element={<CategoriesPage />} />

            {/* 6. Listing Detail Page (by slug or id) */}
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

            {/* 7. Checkout & UPI Payment */}
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

            {/* 8. Pricing & Fee Calculator */}
            <Route path="/pricing" element={<PricingPage />} />

            {/* 9. Public Creator Profile */}
            <Route
              path="/profile/:username"
              element={
                <CreatorProfilePage
                  listings={listings}
                  savedIds={savedIds}
                  onToggleSave={handleToggleSave}
                  onBuyNowDirect={(listing) => {}}
                  userProfile={userProfile}
                  onUpdateUserProfile={handleUpdateUserProfile}
                  purchases={purchases}
                />
              }
            />
            <Route
              path="/profile"
              element={
                <CreatorProfilePage
                  listings={listings}
                  savedIds={savedIds}
                  onToggleSave={handleToggleSave}
                  onBuyNowDirect={(listing) => {}}
                  userProfile={userProfile}
                  onUpdateUserProfile={handleUpdateUserProfile}
                  purchases={purchases}
                />
              }
            />

            {/* 10. Sell Asset / Publish Studio */}
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

            {/* 11. Seller Studio Dashboard */}
            <Route
              path="/dashboard"
              element={
                <DashboardPage
                  listings={listings}
                  userProfile={userProfile}
                  onToggleRole={handleToggleRole}
                />
              }
            />
            <Route
              path="/seller"
              element={<Navigate to="/dashboard" replace />}
            />

            {/* 12. Buyer Purchases Library */}
            <Route
              path="/purchases"
              element={<PurchasesPage purchases={purchases} />}
            />

            {/* 13. Saved Wishlist */}
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

            {/* 14. Auth (Sign In & Sign Up) */}
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

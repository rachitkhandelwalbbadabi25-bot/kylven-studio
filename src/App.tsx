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
import { UpgradeToSellerPage } from "./pages/UpgradeToSellerPage";
import { ProtectedRoute } from "./components/ProtectedRoute";

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

  const handleUpgradeToSeller = (upiId: string, redirectTo: string = "/sell/new") => {
    setUserProfile((prev) => {
      const next: UserProfile = {
        ...prev,
        role: "seller",
        upiId: upiId.trim(),
      };
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
          savedCount={savedIds.length}
          purchasesCount={purchases.length}
        />

        {/* Canonical Multi-Page Routes */}
        <main className="flex-1">
          <Routes>
            {/* 1. Public Marketing Landing Page (Root Route)
                - If logged out: Intro Tour Landing Page (General Overview)
                - If logged in as Seller: Redirected to /dashboard
                - If logged in as Buyer: Redirected to /browse */}
            <Route
              path="/"
              element={
                !isAuthenticated ? (
                  <IntroLandingPage onGetStarted={() => {}} />
                ) : userProfile.role === "seller" ? (
                  <Navigate to="/dashboard" replace />
                ) : (
                  <Navigate to="/browse" replace />
                )
              }
            />

            {/* 2. Public Information Pages (Accessible without login) */}
            <Route path="/how-it-works" element={<HowItWorksPage />} />
            <Route path="/pricing" element={<PricingPage />} />

            {/* 3. Authentication Routes */}
            <Route
              path="/signin"
              element={
                <AuthPage
                  onLoginSuccess={handleSignInSuccess}
                  defaultMode="signin"
                  isAuthenticated={isAuthenticated}
                  userProfile={userProfile}
                />
              }
            />
            <Route
              path="/signup"
              element={
                <AuthPage
                  onLoginSuccess={handleSignInSuccess}
                  defaultMode="signup"
                  isAuthenticated={isAuthenticated}
                  userProfile={userProfile}
                />
              }
            />
            <Route path="/login" element={<Navigate to="/signin" replace />} />
            <Route path="/register" element={<Navigate to="/signup" replace />} />

            {/* 4. Protected Private Marketplace Routes */}
            <Route
              path="/browse"
              element={
                <ProtectedRoute isAuthenticated={isAuthenticated}>
                  <BrowsePage
                    listings={listings}
                    savedIds={savedIds}
                    onToggleSave={handleToggleSave}
                    onBuyNowDirect={(listing) => {}}
                  />
                </ProtectedRoute>
              }
            />
            <Route
              path="/explore"
              element={<Navigate to="/browse" replace />}
            />

            <Route
              path="/categories"
              element={
                <ProtectedRoute isAuthenticated={isAuthenticated}>
                  <CategoriesPage />
                </ProtectedRoute>
              }
            />

            {/* 5. Protected Listing Detail Routes */}
            <Route
              path="/listing/:slug"
              element={
                <ProtectedRoute isAuthenticated={isAuthenticated}>
                  <ListingDetailPage
                    listings={listings}
                    onBuyNowDirect={(listing) => {}}
                    savedIds={savedIds}
                    onToggleSave={handleToggleSave}
                  />
                </ProtectedRoute>
              }
            />
            <Route
              path="/asset/:id"
              element={
                <ProtectedRoute isAuthenticated={isAuthenticated}>
                  <ListingDetailPage
                    listings={listings}
                    onBuyNowDirect={(listing) => {}}
                    savedIds={savedIds}
                    onToggleSave={handleToggleSave}
                  />
                </ProtectedRoute>
              }
            />

            {/* 6. Protected Checkout */}
            <Route
              path="/checkout/:listingId"
              element={
                <ProtectedRoute isAuthenticated={isAuthenticated}>
                  <CheckoutPage
                    listings={listings}
                    onCompletePurchase={handleCompletePurchase}
                    buyerEmail={userProfile.email}
                  />
                </ProtectedRoute>
              }
            />

            {/* 7. Protected Profile Views */}
            <Route
              path="/profile/:username"
              element={
                <ProtectedRoute isAuthenticated={isAuthenticated}>
                  <CreatorProfilePage
                    listings={listings}
                    savedIds={savedIds}
                    onToggleSave={handleToggleSave}
                    onBuyNowDirect={(listing) => {}}
                    userProfile={userProfile}
                    onUpdateUserProfile={handleUpdateUserProfile}
                    purchases={purchases}
                  />
                </ProtectedRoute>
              }
            />
            <Route
              path="/profile"
              element={
                <ProtectedRoute isAuthenticated={isAuthenticated}>
                  <CreatorProfilePage
                    listings={listings}
                    savedIds={savedIds}
                    onToggleSave={handleToggleSave}
                    onBuyNowDirect={(listing) => {}}
                    userProfile={userProfile}
                    onUpdateUserProfile={handleUpdateUserProfile}
                    purchases={purchases}
                  />
                </ProtectedRoute>
              }
            />

            {/* 8. Protected Onboarding */}
            <Route
              path="/onboarding"
              element={
                <ProtectedRoute isAuthenticated={isAuthenticated}>
                  <OnboardingPage
                    userProfile={userProfile}
                    onSelectRole={handleSelectRoleOnboarding}
                  />
                </ProtectedRoute>
              }
            />

            {/* 9. Protected Upgrade to Seller */}
            <Route
              path="/upgrade-seller"
              element={
                <ProtectedRoute isAuthenticated={isAuthenticated}>
                  <UpgradeToSellerPage
                    userProfile={userProfile}
                    onUpgradeToSeller={handleUpgradeToSeller}
                  />
                </ProtectedRoute>
              }
            />
            <Route path="/upgrade" element={<Navigate to="/upgrade-seller" replace />} />

            {/* 10. Protected Seller Creation & Studio */}
            <Route
              path="/sell/new"
              element={
                <ProtectedRoute isAuthenticated={isAuthenticated} requiredRole="seller" userProfile={userProfile}>
                  <SellNewAssetPage
                    onAddListing={handleAddNewListing}
                    userProfile={userProfile}
                  />
                </ProtectedRoute>
              }
            />
            <Route
              path="/upload"
              element={
                <ProtectedRoute isAuthenticated={isAuthenticated}>
                  {userProfile.role === "buyer" ? (
                    <UpgradeToSellerPage
                      userProfile={userProfile}
                      onUpgradeToSeller={handleUpgradeToSeller}
                    />
                  ) : (
                    <Navigate to="/sell/new" replace />
                  )}
                </ProtectedRoute>
              }
            />
            <Route
              path="/sell"
              element={
                <ProtectedRoute isAuthenticated={isAuthenticated}>
                  {userProfile.role === "buyer" ? (
                    <Navigate to="/upgrade-seller" replace />
                  ) : (
                    <Navigate to="/sell/new" replace />
                  )}
                </ProtectedRoute>
              }
            />

            {/* 11. Protected Seller Dashboard */}
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute isAuthenticated={isAuthenticated} requiredRole="seller" userProfile={userProfile}>
                  <DashboardPage
                    listings={listings}
                    userProfile={userProfile}
                  />
                </ProtectedRoute>
              }
            />
            <Route
              path="/seller"
              element={
                <ProtectedRoute isAuthenticated={isAuthenticated} requiredRole="seller" userProfile={userProfile}>
                  <DashboardPage
                    listings={listings}
                    userProfile={userProfile}
                  />
                </ProtectedRoute>
              }
            />

            {/* 12. Protected Buyer Library & Wishlist */}
            <Route
              path="/purchases"
              element={
                <ProtectedRoute isAuthenticated={isAuthenticated}>
                  <PurchasesPage purchases={purchases} />
                </ProtectedRoute>
              }
            />
            <Route
              path="/saved"
              element={
                <ProtectedRoute isAuthenticated={isAuthenticated}>
                  <SavedPage
                    listings={listings}
                    savedIds={savedIds}
                    onToggleSave={handleToggleSave}
                    onBuyNowDirect={(listing) => {}}
                  />
                </ProtectedRoute>
              }
            />

            {/* Fallback */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>

        {/* Global Footer */}
        <Footer />
      </div>
    </BrowserRouter>
  );
}

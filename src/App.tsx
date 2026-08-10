import React, { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { AssetListing, SellerStats, SalesRecord, UserProfile, UserRole } from "./types";
import { MOCK_LISTINGS, INITIAL_SELLER_STATS, MOCK_SALES_HISTORY } from "./data/mockData";
import { Navbar } from "./components/Navbar";
import { Footer } from "./components/Footer";
import { CheckoutModal } from "./components/CheckoutModal";
import { OnboardingModal } from "./components/OnboardingModal";
import { HomePage } from "./pages/HomePage";
import { BrowsePage } from "./pages/BrowsePage";
import { ListingDetailPage } from "./pages/ListingDetailPage";
import { SellerPage } from "./pages/SellerPage";
import { PurchasesPage } from "./pages/PurchasesPage";
import { SavedPage } from "./pages/SavedPage";

// Automatically scroll to top on route change
function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

const DEFAULT_PROFILE: UserProfile = {
  name: "Rachit K.",
  email: "rachit@kreate.in",
  upiId: "rachit@okaxis",
  role: "buyer",
  avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200",
  joinedDate: "August 2026",
  hasCompletedOnboarding: false,
};

export default function App() {
  const [listings, setListings] = useState<AssetListing[]>(MOCK_LISTINGS);
  const [sellerStats, setSellerStats] = useState<SellerStats>(INITIAL_SELLER_STATS);
  const [salesHistory, setSalesHistory] = useState<SalesRecord[]>(MOCK_SALES_HISTORY);
  const [savedIds, setSavedIds] = useState<string[]>(["asset-1", "asset-3"]);
  const [checkoutListing, setCheckoutListing] = useState<AssetListing | null>(null);

  // User Profile & Role State with LocalStorage
  const [userProfile, setUserProfile] = useState<UserProfile>(() => {
    try {
      const saved = localStorage.getItem("kreate_user_profile");
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error(e);
    }
    return DEFAULT_PROFILE;
  });

  const [isOnboardingOpen, setIsOnboardingOpen] = useState<boolean>(
    !userProfile.hasCompletedOnboarding
  );

  const handleSaveProfile = (updated: UserProfile) => {
    setUserProfile(updated);
    try {
      localStorage.setItem("kreate_user_profile", JSON.stringify(updated));
    } catch (e) {
      console.error(e);
    }
  };

  const handleSwitchRole = (newRole: UserRole) => {
    const updated = { ...userProfile, role: newRole };
    handleSaveProfile(updated);
  };

  const handleToggleSave = (id: string) => {
    setSavedIds((prev) =>
      prev.includes(id) ? prev.filter((itemId) => itemId !== id) : [...prev, id]
    );
  };

  const handleClearSaved = () => {
    setSavedIds([]);
  };

  const handleBuyNowDirect = (listing: AssetListing) => {
    setCheckoutListing(listing);
  };

  const handleAddNewListing = (newListing: AssetListing) => {
    setListings([newListing, ...listings]);
    setSellerStats((prev) => ({
      ...prev,
      activeListingsCount: prev.activeListingsCount + 1,
    }));
  };

  const handlePurchaseComplete = (purchasedAsset: AssetListing) => {
    const listed = purchasedAsset.priceInINR;
    const fee = Math.round(listed * 0.125);
    const totalPaid = listed + fee;
    const sellerNet = Math.round(listed * 0.9);

    const newSale: SalesRecord = {
      id: `sale-${Date.now()}`,
      orderId: `KS-ORD-${Math.floor(1000 + Math.random() * 9000)}`,
      assetTitle: purchasedAsset.title,
      buyerName: userProfile.name || "You (Verified Buyer)",
      buyerLocation: "Mumbai, MH",
      listedPriceINR: listed,
      platformFeeINR: fee,
      totalPaidINR: totalPaid,
      sellerEarningsINR: sellerNet,
      paymentMethod: "UPI (GPay)",
      date: "Just Now",
      status: "Completed",
    };

    setSalesHistory([newSale, ...salesHistory]);

    setSellerStats((prev) => ({
      ...prev,
      totalEarnedINR: prev.totalEarnedINR + sellerNet,
      totalSalesCount: prev.totalSalesCount + 1,
    }));

    setListings((prevListings) =>
      prevListings.map((a) =>
        a.id === purchasedAsset.id ? { ...a, salesCount: a.salesCount + 1 } : a
      )
    );
  };

  return (
    <BrowserRouter>
      <ScrollToTop />
      <div className="min-h-screen bg-[#000000] text-white flex flex-col font-sans selection:bg-[#202C44] selection:text-[#D3CCB0]">
        
        {/* Navigation Bar */}
        <Navbar
          userProfile={userProfile}
          savedCount={savedIds.length}
          purchasesCount={salesHistory.length}
          onSwitchRole={handleSwitchRole}
          onOpenOnboarding={() => setIsOnboardingOpen(true)}
        />

        {/* Multi-Page Routes */}
        <main className="flex-1">
          <Routes>
            <Route
              path="/"
              element={
                <HomePage
                  userProfile={userProfile}
                  listings={listings}
                  savedIds={savedIds}
                  onToggleSave={handleToggleSave}
                  onBuyNowDirect={handleBuyNowDirect}
                  onOpenOnboarding={() => setIsOnboardingOpen(true)}
                  onSwitchRole={handleSwitchRole}
                />
              }
            />
            <Route
              path="/browse"
              element={
                <BrowsePage
                  listings={listings}
                  savedIds={savedIds}
                  onToggleSave={handleToggleSave}
                  onBuyNowDirect={handleBuyNowDirect}
                />
              }
            />
            <Route
              path="/asset/:id"
              element={
                <ListingDetailPage
                  listings={listings}
                  savedIds={savedIds}
                  onToggleSave={handleToggleSave}
                  onBuyNow={handleBuyNowDirect}
                />
              }
            />
            <Route
              path="/seller"
              element={
                <SellerPage
                  stats={sellerStats}
                  salesHistory={salesHistory}
                  activeListings={listings}
                  onAddNewListing={handleAddNewListing}
                />
              }
            />
            <Route
              path="/purchases"
              element={
                <PurchasesPage
                  salesHistory={salesHistory}
                  allListings={listings}
                  userEmail={userProfile.email}
                />
              }
            />
            <Route
              path="/saved"
              element={
                <SavedPage
                  listings={listings}
                  savedIds={savedIds}
                  onToggleSave={handleToggleSave}
                  onClearSaved={handleClearSaved}
                  onBuyNowDirect={handleBuyNowDirect}
                />
              }
            />
          </Routes>
        </main>

        {/* Global Role Onboarding & Profile Modal */}
        <OnboardingModal
          isOpen={isOnboardingOpen}
          onClose={() => setIsOnboardingOpen(false)}
          currentUserProfile={userProfile}
          onSaveProfile={handleSaveProfile}
        />

        {/* Global UPI Checkout Modal */}
        {checkoutListing && (
          <CheckoutModal
            listing={checkoutListing}
            onClose={() => setCheckoutListing(null)}
            onPurchaseComplete={handlePurchaseComplete}
          />
        )}

        {/* Global Footer */}
        <Footer />
      </div>
    </BrowserRouter>
  );
}

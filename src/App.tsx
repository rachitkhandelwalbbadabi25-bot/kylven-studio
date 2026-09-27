import React, { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route, useLocation, Navigate, useNavigate } from "react-router-dom";
import { AssetListing, UserProfile, UserPurchase, UserRole } from "./types";
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
import { BuyerProfilePage } from "./pages/BuyerProfilePage";
import { ProtectedRoute } from "./components/ProtectedRoute";
import { 
  subscribeToAuthState, 
  subscribeToListingsFromFirebase,
  saveListingToFirebase, 
  subscribeToPublicProfile,
  savePublicProfileToFirebase,
  subscribeToUserBookmarks,
  addBookmarkToFirebase,
  removeBookmarkFromFirebase,
  subscribeToUserPurchases,
  fetchUserPurchasesFromFirebase,
  logoutUser 
} from "./services/firebaseService";

// Automatically scroll to top on route change
function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

const EMPTY_PROFILE: UserProfile = {
  name: "",
  email: "",
  username: "",
  role: "buyer",
  avatar: "",
  bio: "",
  location: "India",
  hasCompletedOnboarding: false,
};

export default function App() {
  // Global Listings State - Authoritative Firebase RTDB only
  const [listings, setListings] = useState<AssetListing[]>([]);
  const [isListingsLoading, setIsListingsLoading] = useState<boolean>(true);

  // Auth State
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

  // User Profile
  const [userProfile, setUserProfile] = useState<UserProfile>(EMPTY_PROFILE);

  // User Purchases - Authoritative Firebase RTDB only
  const [purchases, setPurchases] = useState<UserPurchase[]>([]);

  // Saved Wishlist IDs - Authoritative Firebase RTDB only
  const [savedIds, setSavedIds] = useState<string[]>([]);

  // Global Search in Navbar
  const [globalSearch, setGlobalSearch] = useState("");

  // Firebase Realtime Database: Subscribe to live authoritative approved listings & auth state
  useEffect(() => {
    let isMounted = true;
    setIsListingsLoading(true);

    const unsubscribeListings = subscribeToListingsFromFirebase(
      (approvedListings) => {
        if (isMounted) {
          // Strictly approved Firebase listings, excluding deleted
          setListings(approvedListings.filter((l) => l.deleted !== true));
          setIsListingsLoading(false);
        }
      },
      (err) => {
        console.warn("Failed to subscribe to listings from Firebase:", err);
        if (isMounted) {
          setIsListingsLoading(false);
        }
      }
    );

    let unsubscribeProfile: (() => void) | null = null;
    let unsubscribeBookmarks: (() => void) | null = null;
    let unsubscribePurchases: (() => void) | null = null;

    // Subscribe to Firebase Auth state
    const unsubscribeAuth = subscribeToAuthState((firebaseUser) => {
      // Clean up previous user subscriptions if user changes
      if (unsubscribeProfile) {
        unsubscribeProfile();
        unsubscribeProfile = null;
      }
      if (unsubscribeBookmarks) {
        unsubscribeBookmarks();
        unsubscribeBookmarks = null;
      }
      if (unsubscribePurchases) {
        unsubscribePurchases();
        unsubscribePurchases = null;
      }

      // Immediately clear sensitive user state to prevent any stale cross-account data leakage
      setPurchases([]);
      setSavedIds([]);

      if (firebaseUser) {
        setIsAuthenticated(true);
        const baseName = firebaseUser.displayName || firebaseUser.email?.split("@")[0] || "User";
        const baseUsername = (firebaseUser.displayName || firebaseUser.email?.split("@")[0] || "user")
          .toLowerCase()
          .replace(/[^a-z0-9_]/g, "");

        // Set initial auth attributes immediately
        setUserProfile((prev) => ({
          ...prev,
          uid: firebaseUser.uid,
          email: firebaseUser.email || "",
          name: firebaseUser.displayName || prev.name || baseName,
          username: prev.username || baseUsername,
          avatar: firebaseUser.photoURL || prev.avatar || "",
          hasCompletedOnboarding: true,
        }));

        // 1. REALTIME LISTENER: Live synchronization with /publicProfiles/{uid}
        unsubscribeProfile = subscribeToPublicProfile(
          firebaseUser.uid,
          (publicProf) => {
            if (isMounted) {
              setUserProfile((prev) => ({
                ...prev,
                uid: firebaseUser.uid,
                email: firebaseUser.email || prev.email || "",
                name: publicProf?.name || firebaseUser.displayName || prev.name || baseName,
                role: (publicProf?.role as any) || prev.role || "buyer",
                bio: publicProf?.bio !== undefined ? publicProf.bio : prev.bio || "",
                username: publicProf?.usernameId || prev.username || baseUsername,
                hasCompletedOnboarding: true,
              }));
            }
          },
          (err) => {
            console.warn("Live public profile sync notice:", err);
          }
        );

        // 2. REALTIME LISTENER: Live synchronization with /bookmarks/{uid}
        unsubscribeBookmarks = subscribeToUserBookmarks(
          firebaseUser.uid,
          (remoteSaved) => {
            if (isMounted) {
              setSavedIds(remoteSaved || []);
            }
          }
        );

        // 3. REALTIME LISTENER: Live synchronization with /purchases filtered by buyerId
        unsubscribePurchases = subscribeToUserPurchases(
          firebaseUser.uid,
          (remotePurchases) => {
            if (isMounted) {
              setPurchases(remotePurchases);
            }
          },
          (err) => {
            console.warn("Live purchases sync notice:", err);
          }
        );
      } else {
        setIsAuthenticated(false);
        setUserProfile(EMPTY_PROFILE);
        setSavedIds([]);
        setPurchases([]);
      }
    });

    return () => {
      isMounted = false;
      unsubscribeListings();
      unsubscribeAuth();
      if (unsubscribeProfile) unsubscribeProfile();
      if (unsubscribeBookmarks) unsubscribeBookmarks();
      if (unsubscribePurchases) unsubscribePurchases();
    };
  }, []);

  const handleSignInSuccess = (profile: UserProfile) => {
    setIsAuthenticated(true);
    setUserProfile((prev) => ({ ...prev, ...profile, hasCompletedOnboarding: true }));
  };

  const handleSignOut = () => {
    logoutUser().catch((err) => console.warn("Firebase logout error:", err));
    setIsAuthenticated(false);
    setUserProfile(EMPTY_PROFILE);
    setSavedIds([]);
    setPurchases([]);
  };

  const handleSelectRoleOnboarding = (role: UserRole) => {
    setUserProfile((prev) => ({ ...prev, role, hasCompletedOnboarding: true }));
  };

  const handleToggleSave = (id: string) => {
    setSavedIds((prev) => {
      const isSaved = prev.includes(id);
      if (isSaved) {
        removeBookmarkFromFirebase(id).catch((err) =>
          console.warn("Could not remove bookmark from Firebase:", err)
        );
        return prev.filter((itemId) => itemId !== id);
      } else {
        addBookmarkToFirebase(id).catch((err) =>
          console.warn("Could not save bookmark to Firebase:", err)
        );
        return [...prev, id];
      }
    });
  };

  const handleAddNewListing = (newListing: AssetListing) => {
    // New listing always has status: "pending"
    const pendingListing: AssetListing = {
      ...newListing,
      status: "pending",
    };
    setListings((prev) => [pendingListing, ...prev]);
    // Also sync to Firebase Realtime Database
    saveListingToFirebase(pendingListing)
      .then((res) => {
        if (!res.success && res.error) {
          console.warn("Could not sync listing to Firebase:", res.error);
        }
      })
      .catch((err) =>
        console.warn("Could not sync listing to Firebase:", err)
      );
  };

  const handleCompletePurchase = (_purchase: UserPurchase) => {
    // Authoritative purchases are synchronized exclusively via subscribeToUserPurchases
    // listener from the Firebase Realtime Database. We strictly do not inject simulated records into state.
  };

  const handleUpdateUserProfile = (updated: Partial<UserProfile>) => {
    setUserProfile((prev) => {
      const nextProfile = { ...prev, ...updated };
      if (nextProfile.uid) {
        savePublicProfileToFirebase(nextProfile.uid, {
          name: nextProfile.name,
          role: nextProfile.role,
          bio: nextProfile.bio || "",
          usernameId: nextProfile.username || nextProfile.uid,
        }).catch((err) => {
          console.warn("Could not sync public profile to Firebase:", err);
        });
      }
      return nextProfile;
    });
  };

  const handleUpgradeToSeller = (upiId: string, redirectTo: string = "/sell/new") => {
    setUserProfile((prev) => ({
      ...prev,
      role: "seller",
      upiId: upiId.trim(),
    }));
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
                  <CategoriesPage listings={listings} />
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
                    isListingsLoading={isListingsLoading}
                    onBuyNowDirect={(listing) => {}}
                    savedIds={savedIds}
                    onToggleSave={handleToggleSave}
                    isAuthenticated={isAuthenticated}
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
                    isListingsLoading={isListingsLoading}
                    onBuyNowDirect={(listing) => {}}
                    savedIds={savedIds}
                    onToggleSave={handleToggleSave}
                    isAuthenticated={isAuthenticated}
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
              path="/buyer-profile"
              element={
                <ProtectedRoute isAuthenticated={isAuthenticated}>
                  <BuyerProfilePage
                    userProfile={userProfile}
                    onUpdateUserProfile={handleUpdateUserProfile}
                    purchases={purchases}
                    savedIds={savedIds}
                    onToggleSave={handleToggleSave}
                    listings={listings}
                  />
                </ProtectedRoute>
              }
            />
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
                  {userProfile.role === "buyer" ? (
                    <BuyerProfilePage
                      userProfile={userProfile}
                      onUpdateUserProfile={handleUpdateUserProfile}
                      purchases={purchases}
                      savedIds={savedIds}
                      onToggleSave={handleToggleSave}
                      listings={listings}
                    />
                  ) : (
                    <CreatorProfilePage
                      listings={listings}
                      savedIds={savedIds}
                      onToggleSave={handleToggleSave}
                      onBuyNowDirect={(listing) => {}}
                      userProfile={userProfile}
                      onUpdateUserProfile={handleUpdateUserProfile}
                      purchases={purchases}
                    />
                  )}
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

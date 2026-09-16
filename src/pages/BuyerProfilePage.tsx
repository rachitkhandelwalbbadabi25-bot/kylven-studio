import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { UserProfile, UserPurchase, AssetListing, isUserAdmin } from "../types";
import { ListingCard } from "../components/ListingCard";
import {
  ShoppingBag,
  Pencil,
  Bookmark,
  Ban,
  ChevronRight,
  Download,
  Key,
  ExternalLink,
  ShieldCheck,
  CheckCircle2,
  X,
  Check,
  Sparkles,
  ArrowRight,
  Layers,
  Search,
  User,
  Mail,
  UserCheck
} from "lucide-react";

interface BuyerProfilePageProps {
  userProfile?: UserProfile | null;
  onUpdateUserProfile?: (updated: Partial<UserProfile>) => void;
  purchases?: UserPurchase[];
  savedIds?: string[];
  onToggleSave?: (id: string) => void;
  listings?: AssetListing[];
}

export const BuyerProfilePage: React.FC<BuyerProfilePageProps> = ({
  userProfile,
  onUpdateUserProfile,
  purchases = [],
  savedIds = [],
  onToggleSave = () => {},
  listings = [],
}) => {
  const navigate = useNavigate();

  // Active Tab: "saved" | "purchases"
  const [activeTab, setActiveTab] = useState<"saved" | "purchases">("saved");

  // Modals state
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isBlockedModalOpen, setIsBlockedModalOpen] = useState(false);
  const [isBioEditingInline, setIsBioEditingInline] = useState(false);

  // Profile Form States
  const [formName, setFormName] = useState(userProfile?.name || "User");
  const [formEmail, setFormEmail] = useState(userProfile?.email || "");
  const [formBio, setFormBio] = useState(userProfile?.bio || "");
  const [blockedUsers, setBlockedUsers] = useState<string[]>([]);
  const [newBlockedInput, setNewBlockedInput] = useState("");

  // Derived initials
  const getInitial = (nameStr: string) => {
    const trimmed = nameStr.trim();
    if (!trimmed) return "U";
    return trimmed.charAt(0).toUpperCase();
  };

  const initialLetter = getInitial(userProfile?.name || userProfile?.email || "User");

  const isAdminAccount = Boolean(userProfile && isUserAdmin(userProfile));

  // Calculate stats
  const listingsCount = 0; // Buyers don't have public selling listings
  const followersCount = 0;
  const followingCount = 0;
  const purchasesCount = purchases.length;
  const totalSpentINR = purchases.reduce((sum, item) => sum + (item.pricePaidINR || 0), 0);

  // Saved listings (excluding soft-deleted listings)
  const savedListings = listings.filter((item) => savedIds.includes(item.id) && item.deleted !== true);

  // Save profile updates
  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    if (onUpdateUserProfile) {
      onUpdateUserProfile({
        name: formName.trim(),
        email: formEmail.trim(),
        bio: formBio.trim(),
      });
    }
    setIsEditModalOpen(false);
  };

  const handleSaveBioInline = () => {
    if (onUpdateUserProfile) {
      onUpdateUserProfile({
        bio: formBio.trim(),
      });
    }
    setIsBioEditingInline(false);
  };

  const handleAddBlockedUser = (e: React.FormEvent) => {
    e.preventDefault();
    if (newBlockedInput.trim() && !blockedUsers.includes(newBlockedInput.trim())) {
      setBlockedUsers([...blockedUsers, newBlockedInput.trim()]);
      setNewBlockedInput("");
    }
  };

  const handleUnblockUser = (usernameToUnblock: string) => {
    setBlockedUsers(blockedUsers.filter((u) => u !== usernameToUnblock));
  };

  return (
    <div className="min-h-screen bg-[#000000] text-white pb-16 pt-4 sm:pt-8 px-4 sm:px-6 max-w-4xl mx-auto">
      
      {/* =========================================================
          1. BUYER PROFILE HEADER
          - Avatar: Large circular avatar with dark navy background + initial "R"
          - Identity: Full Name "Rachit Khandelwal20", Email "kavishkhandelwal9@gmail.com"
          - Badges & Actions: "Buyer" badge with shopping bag, cream "Edit Profile" button with pencil
         ========================================================= */}
      <section
        id="buyer-profile-header-card"
        className="bg-[#0B0D11] border border-[#202C44] rounded-2xl sm:rounded-3xl p-5 sm:p-7 shadow-xl relative overflow-hidden"
      >
        {/* Subtle decorative glow */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-[#202C44]/20 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20" />

        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5 relative z-10">
          
          {/* Avatar: Large circular avatar with dark navy background and initial */}
          <div
            id="buyer-avatar"
            className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-[#162032] border-2 border-[#202C44] flex items-center justify-center font-heading font-extrabold text-3xl sm:text-4xl text-white shadow-xl shrink-0 group transition-transform hover:scale-105"
            title={userProfile.name}
          >
            <span className="text-[#FFFFFF] tracking-tight">{initialLetter}</span>
          </div>

          {/* Identity & Badges / Actions */}
          <div className="flex-1 text-center sm:text-left space-y-2">
            
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                {/* Full Name: (Bold, high-contrast) */}
                <div className="flex items-center justify-center sm:justify-start gap-2 flex-wrap">
                  <h1
                    id="buyer-profile-name"
                    className="font-heading font-extrabold text-2xl sm:text-3xl text-white tracking-tight leading-tight"
                  >
                    {userProfile?.name || "Rachit Khandelwal20"}
                  </h1>
                  {isAdminAccount && (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-blue-500/10 border border-blue-500/30 text-blue-400 text-xs font-medium" title="Verified Admin">
                      <CheckCircle2 className="w-3.5 h-3.5 text-blue-400 fill-blue-500/20" />
                      <span>Verified</span>
                    </span>
                  )}
                </div>
                
                {/* Email: (Muted gray, directly below name) */}
                <p
                  id="buyer-profile-email"
                  className="text-xs sm:text-sm text-[#7B8A90] font-sans font-medium mt-0.5"
                >
                  {userProfile?.email || "kavishkhandelwal9@gmail.com"}
                </p>
              </div>

              {/* Action Buttons: Edit Profile */}
              <div className="flex items-center justify-center sm:justify-end gap-2.5 pt-1 sm:pt-0">
                <button
                  type="button"
                  id="edit-profile-btn"
                  onClick={() => {
                    setFormName(userProfile?.name || "Rachit Khandelwal20");
                    setFormEmail(userProfile?.email || "kavishkhandelwal9@gmail.com");
                    setFormBio(userProfile?.bio || "");
                    setIsEditModalOpen(true);
                  }}
                  className="px-4 py-2 rounded-xl bg-[#D3CCB0] hover:bg-[#c4bb9a] text-[#000000] font-heading font-bold text-xs sm:text-sm flex items-center gap-1.5 transition-all shadow-md active:scale-95 cursor-pointer"
                  title="Edit Profile Details"
                >
                  <Pencil className="w-3.5 h-3.5 stroke-[2.5]" />
                  <span>Edit Profile</span>
                </button>
              </div>
            </div>

            {/* Badges Row: Buyer Badge */}
            <div className="flex items-center justify-center sm:justify-start gap-2 pt-1">
              <span
                id="buyer-badge"
                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#162032] border border-[#202C44] text-[#D3CCB0] text-xs font-semibold"
              >
                <ShoppingBag className="w-3.5 h-3.5 text-[#D3CCB0]" />
                <span>Buyer</span>
              </span>
            </div>

          </div>

        </div>
      </section>

      {/* =========================================================
          2. ACTIVITY STATS ROW
          - Single, rounded dark-navy panel containing five key metrics:
            Listings: (0)
            Followers: (0)
            Following: (0)
            Purchases: (0)
            Spent: (₹0)
         ========================================================= */}
      <section
        id="activity-stats-row-panel"
        className="mt-4 bg-[#111622] border border-[#202C44] rounded-2xl p-4 sm:p-5 shadow-lg"
      >
        <div className="grid grid-cols-5 divide-x divide-[#202C44]/60 text-center">
          
          {/* 1. Listings */}
          <div className="px-1 sm:px-2 flex flex-col items-center justify-center">
            <span id="stat-listings-count" className="font-heading font-bold text-base sm:text-xl text-white">
              {listingsCount}
            </span>
            <span className="text-[10px] sm:text-xs text-[#7B8A90] uppercase font-mono tracking-wider mt-0.5">
              Listings
            </span>
          </div>

          {/* 2. Followers */}
          <div className="px-1 sm:px-2 flex flex-col items-center justify-center">
            <span id="stat-followers-count" className="font-heading font-bold text-base sm:text-xl text-white">
              {followersCount}
            </span>
            <span className="text-[10px] sm:text-xs text-[#7B8A90] uppercase font-mono tracking-wider mt-0.5">
              Followers
            </span>
          </div>

          {/* 3. Following */}
          <div className="px-1 sm:px-2 flex flex-col items-center justify-center">
            <span id="stat-following-count" className="font-heading font-bold text-base sm:text-xl text-white">
              {followingCount}
            </span>
            <span className="text-[10px] sm:text-xs text-[#7B8A90] uppercase font-mono tracking-wider mt-0.5">
              Following
            </span>
          </div>

          {/* 4. Purchases */}
          <div className="px-1 sm:px-2 flex flex-col items-center justify-center">
            <span id="stat-purchases-count" className="font-heading font-bold text-base sm:text-xl text-[#D3CCB0]">
              {purchasesCount}
            </span>
            <span className="text-[10px] sm:text-xs text-[#7B8A90] uppercase font-mono tracking-wider mt-0.5">
              Purchases
            </span>
          </div>

          {/* 5. Spent */}
          <div className="px-1 sm:px-2 flex flex-col items-center justify-center">
            <span id="stat-spent-amount" className="font-heading font-bold text-base sm:text-xl text-white">
              ₹{totalSpentINR.toLocaleString("en-IN")}
            </span>
            <span className="text-[10px] sm:text-xs text-[#7B8A90] uppercase font-mono tracking-wider mt-0.5">
              Spent
            </span>
          </div>

        </div>
      </section>

      {/* =========================================================
          3. PROFILE CONTENT & ACTIONS
          - Bio: Placeholder / editable text area: "Add a bio..."
          - Settings Link: "Blocked Accounts" row with block icon + chevron
         ========================================================= */}
      <section className="mt-4 space-y-3">
        
        {/* Bio Box */}
        <div
          id="buyer-bio-section"
          className="bg-[#0B0D11] border border-[#202C44] rounded-2xl p-4 sm:p-5 transition-colors"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-mono uppercase tracking-wider text-[#7B8A90]">
              About / Bio
            </span>
            {!isBioEditingInline && (
              <button
                type="button"
                onClick={() => {
                  setFormBio(userProfile.bio || "");
                  setIsBioEditingInline(true);
                }}
                className="text-[11px] font-sans font-medium text-[#D3CCB0] hover:underline flex items-center gap-1 cursor-pointer"
              >
                <Pencil className="w-3 h-3" />
                {userProfile.bio ? "Edit Bio" : "Add Bio"}
              </button>
            )}
          </div>

          {isBioEditingInline ? (
            <div className="space-y-2">
              <textarea
                value={formBio}
                onChange={(e) => setFormBio(e.target.value)}
                placeholder="Add a bio..."
                rows={3}
                className="w-full bg-[#111622] border border-[#202C44] rounded-xl p-3 text-sm text-white placeholder-[#7B8A90] focus:outline-none focus:border-[#D3CCB0] transition-colors"
                autoFocus
              />
              <div className="flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsBioEditingInline(false)}
                  className="px-3 py-1.5 rounded-lg text-xs font-medium text-[#7B8A90] hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleSaveBioInline}
                  className="px-3.5 py-1.5 rounded-lg bg-[#D3CCB0] text-black font-heading font-bold text-xs hover:bg-[#c4bb9a]"
                >
                  Save Bio
                </button>
              </div>
            </div>
          ) : (
            <p
              onClick={() => {
                setFormBio(userProfile.bio || "");
                setIsBioEditingInline(true);
              }}
              className={`text-sm leading-relaxed cursor-pointer transition-colors ${
                userProfile.bio
                  ? "text-gray-300 hover:text-white"
                  : "text-[#7B8A90] italic hover:text-[#D3CCB0]"
              }`}
              title="Click to edit bio"
            >
              {userProfile.bio || "Add a bio..."}
            </p>
          )}
        </div>

        {/* Settings Link: "Blocked Accounts" row */}
        <button
          type="button"
          id="blocked-accounts-row-btn"
          onClick={() => setIsBlockedModalOpen(true)}
          className="w-full bg-[#0B0D11] hover:bg-[#111622] border border-[#202C44] hover:border-[#2a3a5a] rounded-2xl p-4 flex items-center justify-between transition-all group text-left cursor-pointer"
        >
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-[#162032] border border-[#202C44] flex items-center justify-center text-[#7B8A90] group-hover:text-[#D3CCB0] transition-colors">
              <Ban className="w-4 h-4" />
            </div>
            <div>
              <span className="font-heading font-semibold text-sm text-white group-hover:text-[#D3CCB0] transition-colors">
                Blocked Accounts
              </span>
              <p className="text-[11px] text-[#7B8A90] font-sans">
                {blockedUsers.length > 0
                  ? `${blockedUsers.length} account${blockedUsers.length > 1 ? "s" : ""} blocked`
                  : "Manage blocked creators & users"}
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-1.5 text-[#7B8A90] group-hover:text-white">
            <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
          </div>
        </button>

      </section>

      {/* =========================================================
          TAB TOGGLE: "Saved" vs "Purchases"
          - Large, rounded toggle button group
          - Active tab (e.g. Saved) has cream background (#D3CCB0)
          - Inactive tab has dark background
         ========================================================= */}
      <section className="mt-6">
        <div
          id="profile-tabs-toggle-group"
          className="bg-[#0B0D11] border border-[#202C44] p-1.5 rounded-2xl grid grid-cols-2 gap-2 shadow-inner"
        >
          {/* Saved Tab */}
          <button
            type="button"
            id="tab-saved-btn"
            onClick={() => setActiveTab("saved")}
            className={`py-3 px-4 rounded-xl font-heading font-bold text-sm flex items-center justify-center gap-2 transition-all cursor-pointer ${
              activeTab === "saved"
                ? "bg-[#D3CCB0] text-[#000000] shadow-md"
                : "bg-transparent text-[#7B8A90] hover:text-white"
            }`}
          >
            <Bookmark className={`w-4 h-4 ${activeTab === "saved" ? "stroke-[2.5]" : ""}`} />
            <span>Saved ({savedIds.length})</span>
          </button>

          {/* Purchases Tab */}
          <button
            type="button"
            id="tab-purchases-btn"
            onClick={() => setActiveTab("purchases")}
            className={`py-3 px-4 rounded-xl font-heading font-bold text-sm flex items-center justify-center gap-2 transition-all cursor-pointer ${
              activeTab === "purchases"
                ? "bg-[#D3CCB0] text-[#000000] shadow-md"
                : "bg-transparent text-[#7B8A90] hover:text-white"
            }`}
          >
            <ShoppingBag className={`w-4 h-4 ${activeTab === "purchases" ? "stroke-[2.5]" : ""}`} />
            <span>Purchases ({purchases.length})</span>
          </button>
        </div>

        {/* Tab Contents */}
        <div className="mt-4">
          
          {/* TAB 1: SAVED */}
          {activeTab === "saved" && (
            <div id="saved-tab-content">
              {savedListings.length === 0 ? (
                /* Empty State: Bookmark icon + "No saved items yet" */
                <div
                  id="saved-empty-state"
                  className="bg-[#0B0D11] border border-[#202C44] rounded-2xl p-10 sm:p-14 text-center my-2 space-y-4"
                >
                  <div className="w-16 h-16 rounded-2xl bg-[#162032] border border-[#202C44] flex items-center justify-center text-[#D3CCB0] shadow-md mx-auto">
                    <Bookmark className="w-8 h-8 stroke-[1.8]" />
                  </div>
                  <div>
                    <h3 className="font-heading font-bold text-lg sm:text-xl text-white">
                      No saved items yet
                    </h3>
                    <p className="text-xs sm:text-sm text-[#7B8A90] max-w-xs sm:max-w-sm mx-auto mt-1.5 leading-relaxed">
                      Bookmark listings you like to find them here later.
                    </p>
                  </div>
                  <div className="pt-2">
                    <Link
                      to="/browse"
                      className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#202C44] hover:bg-[#D3CCB0] text-white hover:text-black font-heading font-bold text-xs sm:text-sm transition-colors shadow-sm"
                    >
                      <Search className="w-4 h-4" />
                      <span>Explore Marketplace</span>
                    </Link>
                  </div>
                </div>
              ) : (
                /* Saved Listings Grid */
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {savedListings.map((listing) => (
                    <ListingCard
                      key={listing.id}
                      listing={listing}
                      isSaved={true}
                      onToggleSave={onToggleSave}
                      onBuyNow={() => navigate(`/checkout/${listing.id}`)}
                    />
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 2: PURCHASES */}
          {activeTab === "purchases" && (
            <div id="purchases-tab-content">
              {purchases.length === 0 ? (
                /* Empty State: Purchases */
                <div
                  id="purchases-empty-state"
                  className="bg-[#0B0D11] border border-[#202C44] rounded-2xl p-10 sm:p-14 text-center my-2 space-y-4"
                >
                  <div className="w-16 h-16 rounded-2xl bg-[#162032] border border-[#202C44] flex items-center justify-center text-[#D3CCB0] shadow-md mx-auto">
                    <ShoppingBag className="w-8 h-8 stroke-[1.8]" />
                  </div>
                  <div>
                    <h3 className="font-heading font-bold text-lg sm:text-xl text-white">
                      No purchases yet
                    </h3>
                    <p className="text-xs sm:text-sm text-[#7B8A90] max-w-xs sm:max-w-sm mx-auto mt-1.5 leading-relaxed">
                      Digital assets and tools you purchase will appear here for instant download.
                    </p>
                  </div>
                  <div className="pt-2">
                    <Link
                      to="/browse"
                      className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#202C44] hover:bg-[#D3CCB0] text-white hover:text-black font-heading font-bold text-xs sm:text-sm transition-colors shadow-sm"
                    >
                      <Search className="w-4 h-4" />
                      <span>Browse Assets</span>
                    </Link>
                  </div>
                </div>
              ) : (
                /* Purchases List */
                <div className="space-y-3">
                  {purchases.map((purchase) => (
                    <div
                      key={purchase.orderId}
                      className="bg-[#0B0D11] border border-[#202C44] rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 transition-colors hover:border-[#2a3a5a]"
                    >
                      <div className="flex items-center gap-3.5">
                        <img
                          src={purchase.thumbnailUrl}
                          alt={purchase.title}
                          className="w-14 h-14 rounded-xl object-cover border border-[#202C44] shrink-0"
                        />
                        <div className="space-y-1">
                          <span className="text-[10px] font-mono uppercase bg-[#162032] text-[#D3CCB0] px-2 py-0.5 rounded-md">
                            {purchase.category}
                          </span>
                          <h4 className="font-heading font-bold text-sm text-white line-clamp-1">
                            {purchase.title}
                          </h4>
                          <div className="flex items-center gap-2 text-xs text-[#7B8A90] font-mono">
                            <span>Order: #{purchase.orderId}</span>
                            <span>•</span>
                            <span>{purchase.purchaseDate}</span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 w-full sm:w-auto justify-between sm:justify-end border-t sm:border-t-0 pt-3 sm:pt-0 border-[#202C44]/50">
                        <div className="text-left sm:text-right mr-3">
                          <span className="font-heading font-bold text-sm text-white">
                            ₹{purchase.pricePaidINR}
                          </span>
                          <span className="block text-[10px] text-[#7B8A90] font-mono">
                            {purchase.paymentMethod}
                          </span>
                        </div>

                        <a
                          href={purchase.downloadUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="px-4 py-2 rounded-xl bg-[#D3CCB0] hover:bg-[#c4bb9a] text-black font-heading font-bold text-xs flex items-center gap-1.5 transition-all shadow-sm"
                        >
                          <Download className="w-3.5 h-3.5" />
                          <span>Download</span>
                        </a>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

        </div>
      </section>

      {/* =========================================================
          MODAL 1: EDIT PROFILE MODAL
         ========================================================= */}
      {isEditModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
          <div className="bg-[#0E121A] border border-[#202C44] rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4">
            
            <div className="flex items-center justify-between border-b border-[#202C44] pb-3">
              <div className="flex items-center gap-2">
                <Pencil className="w-4 h-4 text-[#D3CCB0]" />
                <h3 className="font-heading font-bold text-base text-white">
                  Edit Buyer Profile
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setIsEditModalOpen(false)}
                className="p-1 rounded-lg text-[#7B8A90] hover:text-white hover:bg-[#202C44]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveProfile} className="space-y-4">
              
              {/* Full Name Input */}
              <div className="space-y-1">
                <label className="text-xs font-mono uppercase text-[#7B8A90]">
                  Full Name
                </label>
                <div className="relative">
                  <User className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#7B8A90]" />
                  <input
                    type="text"
                    required
                    value={formName}
                    onChange={(e) => setFormName(e.target.value)}
                    className="w-full bg-[#162032] border border-[#202C44] rounded-xl pl-9 pr-3 py-2 text-sm text-white focus:outline-none focus:border-[#D3CCB0]"
                  />
                </div>
              </div>

              {/* Email Input */}
              <div className="space-y-1">
                <label className="text-xs font-mono uppercase text-[#7B8A90]">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#7B8A90]" />
                  <input
                    type="email"
                    required
                    value={formEmail}
                    onChange={(e) => setFormEmail(e.target.value)}
                    className="w-full bg-[#162032] border border-[#202C44] rounded-xl pl-9 pr-3 py-2 text-sm text-white focus:outline-none focus:border-[#D3CCB0]"
                  />
                </div>
              </div>

              {/* Bio Input */}
              <div className="space-y-1">
                <div className="flex justify-between items-center">
                  <label className="text-xs font-mono uppercase text-[#7B8A90]">
                    Bio
                  </label>
                  <span className="text-[10px] text-[#7B8A90] font-mono">
                    {formBio.trim() ? formBio.trim().split(/\s+/).length : 0} words
                  </span>
                </div>
                <textarea
                  rows={3}
                  value={formBio}
                  onChange={(e) => setFormBio(e.target.value)}
                  placeholder="Add a bio..."
                  className="w-full bg-[#162032] border border-[#202C44] rounded-xl p-3 text-sm text-white placeholder-[#7B8A90] focus:outline-none focus:border-[#D3CCB0]"
                />
              </div>

              {/* Actions */}
              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsEditModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-medium text-[#7B8A90] hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-[#D3CCB0] text-black font-heading font-bold text-xs hover:bg-[#c4bb9a] shadow-md"
                >
                  Save Changes
                </button>
              </div>

            </form>

          </div>
        </div>
      )}

      {/* =========================================================
          MODAL 2: BLOCKED ACCOUNTS MODAL
         ========================================================= */}
      {isBlockedModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
          <div className="bg-[#0E121A] border border-[#202C44] rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4">
            
            <div className="flex items-center justify-between border-b border-[#202C44] pb-3">
              <div className="flex items-center gap-2">
                <Ban className="w-4 h-4 text-rose-400" />
                <h3 className="font-heading font-bold text-base text-white">
                  Blocked Accounts
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setIsBlockedModalOpen(false)}
                className="p-1 rounded-lg text-[#7B8A90] hover:text-white hover:bg-[#202C44]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-[#7B8A90] leading-relaxed">
              Blocked accounts cannot send you direct messages or interact with your profile comments.
            </p>

            {/* Add block user input */}
            <form onSubmit={handleAddBlockedUser} className="flex gap-2">
              <input
                type="text"
                placeholder="Username to block (e.g. @spammer)"
                value={newBlockedInput}
                onChange={(e) => setNewBlockedInput(e.target.value)}
                className="flex-1 bg-[#162032] border border-[#202C44] rounded-xl px-3 py-2 text-xs text-white placeholder-[#7B8A90] focus:outline-none focus:border-[#D3CCB0]"
              />
              <button
                type="submit"
                disabled={!newBlockedInput.trim()}
                className="px-3.5 py-2 rounded-xl bg-[#202C44] hover:bg-rose-900/60 text-white font-heading font-bold text-xs disabled:opacity-40 transition-colors"
              >
                Block
              </button>
            </form>

            {/* List */}
            <div className="max-h-48 overflow-y-auto space-y-2 pt-2">
              {blockedUsers.length === 0 ? (
                <div className="text-center py-6 text-xs text-[#7B8A90]">
                  No accounts are currently blocked.
                </div>
              ) : (
                blockedUsers.map((user) => (
                  <div
                    key={user}
                    className="flex items-center justify-between p-2.5 rounded-xl bg-[#162032] border border-[#202C44]"
                  >
                    <span className="text-xs font-mono text-white">@{user.replace("@", "")}</span>
                    <button
                      type="button"
                      onClick={() => handleUnblockUser(user)}
                      className="text-[11px] font-sans font-bold text-rose-400 hover:text-rose-300"
                    >
                      Unblock
                    </button>
                  </div>
                ))
              )}
            </div>

            <div className="pt-2 flex justify-end">
              <button
                type="button"
                onClick={() => setIsBlockedModalOpen(false)}
                className="px-4 py-2 rounded-xl bg-[#202C44] text-white text-xs font-heading font-bold hover:bg-[#2c3d5e]"
              >
                Done
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};

import React, { useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { AssetListing, CreatorProfile, UserProfile, UserPurchase } from "../types";
import { CREATOR_PROFILES_MOCK, CREATORS_DIRECTORY } from "../data/mockData";
import { ListingCard } from "../components/ListingCard";
import {
  ShieldCheck,
  CheckCircle2,
  MapPin,
  Clock,
  ShoppingBag,
  Share2,
  Edit3,
  Layers,
  LayoutDashboard,
  Heart,
  Sparkles,
  X,
  Plus,
  ArrowRight,
  TrendingUp,
  Award,
  Download,
  Mail
} from "lucide-react";

interface CreatorProfilePageProps {
  listings: AssetListing[];
  savedIds: string[];
  onToggleSave: (id: string) => void;
  onBuyNowDirect: (listing: AssetListing) => void;
  userProfile?: UserProfile;
  onUpdateUserProfile?: (updated: Partial<UserProfile>) => void;
  purchases?: UserPurchase[];
}

export const CreatorProfilePage: React.FC<CreatorProfilePageProps> = ({
  listings,
  savedIds,
  onToggleSave,
  onBuyNowDirect,
  userProfile,
  onUpdateUserProfile,
  purchases = [],
}) => {
  const { username } = useParams<{ username: string }>();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState<"listings" | "purchases" | "dashboard">("listings");
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  // Derive target username (default to buildwithansh or current user)
  const cleanUsername = (username || userProfile?.username || "buildwithansh").replace("@", "").toLowerCase();
  
  // Check if viewing own profile
  const isOwner =
    !username ||
    username === "me" ||
    cleanUsername === (userProfile?.username || "buildwithansh").toLowerCase() ||
    cleanUsername === "buildwithansh";

  // Match creator data from mock or state
  const mockMatch =
    CREATOR_PROFILES_MOCK[cleanUsername] ||
    CREATORS_DIRECTORY[cleanUsername] ||
    (cleanUsername === "buildwithansh" ? CREATOR_PROFILES_MOCK.buildwithansh : null);

  const [name, setName] = useState(
    isOwner ? (userProfile?.name || mockMatch?.name || "Ansh Bhardwaj") : (mockMatch?.name || "Ansh Bhardwaj")
  );
  const [bio, setBio] = useState(
    isOwner
      ? (userProfile?.bio || mockMatch?.bio || "Full-stack developer and UI designer building production-grade digital assets, cyberpunk kits, and developer starters.")
      : (mockMatch?.bio || "Digital asset creator on Kreate Studio.")
  );
  const [handle, setHandle] = useState(isOwner ? (userProfile?.username || cleanUsername) : cleanUsername);
  const [location, setLocation] = useState(mockMatch?.location || "Bengaluru, India");

  // Derive profile email address
  const profileEmail = isOwner
    ? (userProfile?.email || "ansh.bhardwaj@kreatestudio.dev")
    : (mockMatch?.email || `${cleanUsername}@kreatestudio.dev`);

  // Get Initials for Avatar
  const getInitials = (fullName: string) => {
    const parts = fullName.trim().split(" ");
    if (parts.length >= 2) {
      return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
    }
    return fullName.slice(0, 2).toUpperCase() || "AB";
  };

  const initials = isOwner && userProfile?.name ? getInitials(userProfile.name) : (mockMatch?.initials || getInitials(name));

  // Find listings by this creator (excluding soft-deleted listings)
  const creatorListings = listings.filter((l) => {
    if (l.deleted === true) return false;
    const cUser = l.creator?.username?.toLowerCase() || "";
    const sHandle = l.seller?.handle?.replace("@", "").toLowerCase() || "";
    const sName = l.seller?.name?.toLowerCase() || "";
    const cName = l.creator?.name?.toLowerCase() || "";

    if (cleanUsername === "buildwithansh" || cleanUsername === "ansh") {
      return (
        cUser === "buildwithansh" ||
        sHandle === "buildwithansh" ||
        sName.includes("ansh") ||
        l.isNew ||
        l.id === "asset-1" ||
        l.id === "asset-2"
      );
    }

    return (
      cUser === cleanUsername ||
      sHandle === cleanUsername ||
      sName.includes(cleanUsername) ||
      cName.includes(cleanUsername)
    );
  });

  // Calculate dynamic stats
  const listingsCount = creatorListings.length > 0 ? creatorListings.length : 12;
  const followersCount = "1.2k";
  const salesCount = creatorListings.reduce((sum, item) => sum + (item.salesCount || 0), 34);

  // Word limit helper for bio
  const MAX_BIO_WORDS = 150;
  const countWords = (text: string) => {
    const trimmed = text.trim();
    return trimmed ? trimmed.split(/\s+/).length : 0;
  };

  const handleBioChange = (newVal: string) => {
    const words = newVal.trim() ? newVal.trim().split(/\s+/) : [];
    if (words.length > MAX_BIO_WORDS) {
      // Limit to exactly 150 words
      const limited = words.slice(0, MAX_BIO_WORDS).join(" ");
      setBio(limited);
    } else {
      setBio(newVal);
    }
  };

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    const words = bio.trim() ? bio.trim().split(/\s+/) : [];
    const trimmedBio = words.slice(0, MAX_BIO_WORDS).join(" ");
    if (onUpdateUserProfile) {
      onUpdateUserProfile({
        name,
        bio: trimmedBio,
        username: handle.replace("@", ""),
      });
    }
    setBio(trimmedBio);
    setIsEditModalOpen(false);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8" id="seller-profile-page">
      
      {/* 1. Header Section: Profile Banner */}
      <div className="bg-[#111317] border border-[#202C44] rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xl relative overflow-hidden" id="seller-profile-header">
        
        {/* Background glow accent */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#202C44]/20 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20" />

        <div className="flex flex-col md:flex-row md:items-start justify-between gap-6 relative z-10">
          
          {/* Avatar & Identity details */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5 sm:gap-6">
            
            {/* Large Initials Avatar (e.g. "AB") */}
            <div className="relative shrink-0">
              <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl bg-[#202C44] border-2 border-[#202C44] flex items-center justify-center shadow-lg group hover:border-[#D3CCB0] transition-colors">
                <span className="font-heading font-extrabold text-2xl sm:text-3xl text-[#D3CCB0] tracking-wider font-mono">
                  {initials}
                </span>
              </div>
              <div className="absolute -bottom-1 -right-1 bg-emerald-500 w-4 h-4 rounded-full border-2 border-[#111317]" title="Active Creator" />
            </div>

            {/* Seller Name, Handle & Badge */}
            <div className="space-y-2">
              <div className="flex items-center gap-2.5 flex-wrap">
                <h1 className="text-2xl sm:text-3xl font-heading font-extrabold text-white tracking-tight" id="seller-name-heading">
                  {name}
                </h1>
                
                <span className="text-xs font-mono text-[#D3CCB0] bg-[#202C44] px-2.5 py-0.5 rounded-lg border border-[#202C44] font-medium" id="seller-handle-badge">
                  @{handle.replace("@", "")}
                </span>

                <span className="text-xs font-bold text-[#000000] bg-[#D3CCB0] px-2.5 py-0.5 rounded-lg flex items-center gap-1 shadow-sm font-sans" id="seller-role-badge">
                  <Award className="w-3.5 h-3.5 text-[#000000]" />
                  <span>Seller</span>
                </span>
              </div>

              {/* Enhanced Profile Information: Registered Email Address */}
              <div className="flex items-center gap-1.5 text-xs text-[#7B8A90] font-mono" id="seller-profile-email">
                <Mail className="w-3.5 h-3.5 text-[#7B8A90] shrink-0" />
                <span className="text-[#7B8A90] select-all">{profileEmail}</span>
                <span className="text-[10px] text-emerald-400 bg-emerald-950/60 border border-emerald-800/80 px-1.5 py-0.2 rounded font-sans font-medium">
                  Verified
                </span>
              </div>

              <p className="text-xs sm:text-sm text-[#7B8A90] max-w-2xl leading-relaxed">
                {bio}
              </p>

              <div className="flex flex-wrap items-center gap-4 text-xs text-[#7B8A90] pt-1 font-sans">
                <span className="flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-[#D3CCB0]" />
                  <span>{location}</span>
                </span>
                <span className="flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-[#D3CCB0]" />
                  <span>Avg Response: &lt; 1 hour</span>
                </span>
                <span className="flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  <span>100% Verified Commercial Assets</span>
                </span>
              </div>
            </div>
          </div>

          {/* Action: Edit Profile (visible to owner) or Follow/Share */}
          <div className="flex items-center gap-2.5 self-start md:self-auto shrink-0">
            {isOwner && (
              <button
                id="edit-profile-button"
                onClick={() => setIsEditModalOpen(true)}
                className="bg-[#202C44] hover:bg-[#202C44]/80 text-[#D3CCB0] text-xs font-bold px-4 py-2.5 rounded-xl border border-[#202C44] flex items-center gap-1.5 transition-all active:scale-95 shadow"
              >
                <Edit3 className="w-3.5 h-3.5" />
                <span>Edit Profile</span>
              </button>
            )}

            <button
              onClick={() => {
                if (navigator.clipboard) {
                  navigator.clipboard.writeText(window.location.href);
                  alert("Seller profile link copied to clipboard!");
                }
              }}
              className="bg-[#111317] hover:bg-[#202C44] text-[#7B8A90] hover:text-white p-2.5 rounded-xl border border-[#202C44] transition-colors"
              title="Share profile"
              aria-label="Share profile"
            >
              <Share2 className="w-4 h-4" />
            </button>
          </div>

        </div>

        {/* 2. Stats Row: Listings, Followers, Sales */}
        <div className="grid grid-cols-3 gap-3 sm:gap-4 pt-4 border-t border-[#202C44]" id="seller-stats-row">
          
          <div className="bg-[#202C44]/40 border border-[#202C44] p-3.5 sm:p-4 rounded-2xl text-center">
            <span className="text-[10px] sm:text-xs text-[#7B8A90] uppercase font-mono tracking-wider block">
              Listings
            </span>
            <span className="text-xl sm:text-2xl font-heading font-extrabold text-white font-mono mt-0.5 block" id="stat-listings-count">
              {listingsCount}
            </span>
          </div>

          <div className="bg-[#202C44]/40 border border-[#202C44] p-3.5 sm:p-4 rounded-2xl text-center">
            <span className="text-[10px] sm:text-xs text-[#7B8A90] uppercase font-mono tracking-wider block">
              Followers
            </span>
            <span className="text-xl sm:text-2xl font-heading font-extrabold text-[#D3CCB0] font-mono mt-0.5 block" id="stat-followers-count">
              {followersCount}
            </span>
          </div>

          <div className="bg-[#202C44]/40 border border-[#202C44] p-3.5 sm:p-4 rounded-2xl text-center">
            <span className="text-[10px] sm:text-xs text-[#7B8A90] uppercase font-mono tracking-wider block">
              Sales
            </span>
            <span className="text-xl sm:text-2xl font-heading font-extrabold text-emerald-400 font-mono mt-0.5 block" id="stat-sales-count">
              {salesCount}
            </span>
          </div>

        </div>

      </div>

      {/* 3. Interactive Tabs: "My Listings", "Purchases", and "Dashboard" */}
      <div className="flex items-center justify-between border-b border-[#202C44] pb-4">
        <div className="flex items-center gap-2 sm:gap-3" id="seller-tabs-container">
          
          <button
            id="tab-my-listings"
            onClick={() => setActiveTab("listings")}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
              activeTab === "listings"
                ? "bg-[#D3CCB0] text-[#000000] shadow"
                : "bg-[#111317] text-[#7B8A90] hover:text-white border border-[#202C44]"
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>My Listings ({creatorListings.length})</span>
          </button>

          <button
            id="tab-purchases"
            onClick={() => setActiveTab("purchases")}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
              activeTab === "purchases"
                ? "bg-[#D3CCB0] text-[#000000] shadow"
                : "bg-[#111317] text-[#7B8A90] hover:text-white border border-[#202C44]"
            }`}
          >
            <ShoppingBag className="w-3.5 h-3.5" />
            <span>Purchases ({purchases.length})</span>
          </button>

          <button
            id="tab-dashboard"
            onClick={() => {
              setActiveTab("dashboard");
            }}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
              activeTab === "dashboard"
                ? "bg-[#D3CCB0] text-[#000000] shadow"
                : "bg-[#111317] text-[#7B8A90] hover:text-white border border-[#202C44]"
            }`}
          >
            <LayoutDashboard className="w-3.5 h-3.5" />
            <span>Dashboard</span>
          </button>
        </div>

        {activeTab === "listings" && isOwner && (
          <Link
            to="/sell/new"
            className="hidden sm:flex items-center gap-1.5 text-xs font-bold text-[#D3CCB0] hover:underline"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Upload Asset</span>
          </Link>
        )}
      </div>

      {/* Tab Content 1: My Listings Grid */}
      {activeTab === "listings" && (
        <div className="space-y-6" id="tab-content-listings">
          {creatorListings.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {creatorListings.map((item) => (
                <ListingCard
                  key={item.id}
                  listing={item}
                  onSelectListing={(asset) => {
                    navigate(`/listing/${asset.slug || asset.id}`);
                    window.scrollTo({ top: 0, behavior: "smooth" });
                  }}
                  onBuyNowDirect={onBuyNowDirect}
                  isSaved={savedIds.includes(item.id)}
                  onToggleSave={onToggleSave}
                />
              ))}
            </div>
          ) : (
            <div className="bg-[#111317] border border-[#202C44] rounded-2xl p-12 text-center space-y-4">
              <Layers className="w-10 h-10 text-[#7B8A90] mx-auto opacity-50" />
              <div className="space-y-1">
                <h3 className="text-base font-bold text-white">No Active Listings Found</h3>
                <p className="text-xs text-[#7B8A90]">
                  Get started by publishing your first digital asset or UI kit.
                </p>
              </div>
              <Link
                to="/sell/new"
                className="inline-flex items-center gap-2 bg-[#D3CCB0] text-[#000000] text-xs font-bold px-4 py-2.5 rounded-xl shadow"
              >
                <span>Upload Asset</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          )}
        </div>
      )}

      {/* Tab Content 2: Purchases Tab */}
      {activeTab === "purchases" && (
        <div className="space-y-6" id="tab-content-purchases">
          {purchases.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {purchases.map((purchase) => (
                <div
                  key={purchase.orderId}
                  className="bg-[#111317] border border-[#202C44] rounded-2xl p-5 space-y-4 hover:border-[#D3CCB0]/60 transition-all"
                >
                  <div className="flex items-center gap-3">
                    <img
                      src={purchase.thumbnailUrl}
                      alt={purchase.title}
                      className="w-14 h-14 rounded-xl object-cover border border-[#202C44]"
                    />
                    <div className="space-y-0.5 min-w-0">
                      <span className="text-[10px] font-mono text-[#D3CCB0] bg-[#202C44] px-1.5 py-0.5 rounded">
                        {purchase.fileType}
                      </span>
                      <h4 className="text-xs font-bold text-white truncate">{purchase.title}</h4>
                      <p className="text-[10px] text-[#7B8A90] font-mono">{purchase.orderId}</p>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-[#202C44] flex items-center justify-between text-xs">
                    <span className="text-white font-mono font-bold">₹{purchase.pricePaidINR}</span>
                    <a
                      href={purchase.downloadUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="bg-[#202C44] hover:bg-[#D3CCB0] text-[#D3CCB0] hover:text-[#000000] text-xs font-bold px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1"
                    >
                      <Download className="w-3 h-3" />
                      <span>Download</span>
                    </a>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-[#111317] border border-[#202C44] rounded-2xl p-12 text-center space-y-3">
              <ShoppingBag className="w-10 h-10 text-[#7B8A90] mx-auto opacity-50" />
              <p className="text-xs text-[#7B8A90]">No purchases yet under this account.</p>
              <Link to="/browse" className="inline-block bg-[#D3CCB0] text-[#000000] text-xs font-bold px-4 py-2 rounded-xl">
                Explore Marketplace
              </Link>
            </div>
          )}
        </div>
      )}

      {/* Tab Content 3: Dashboard Preview / Quick Stats */}
      {activeTab === "dashboard" && (
        <div className="bg-[#111317] border border-[#202C44] rounded-3xl p-6 sm:p-8 space-y-6" id="tab-content-dashboard">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#202C44] pb-5">
            <div>
              <h3 className="text-lg font-heading font-extrabold text-white">
                Seller Dashboard Overview
              </h3>
              <p className="text-xs text-[#7B8A90] mt-0.5">
                Quick snapshot of earnings, active listings, and payouts.
              </p>
            </div>
            <Link
              to="/dashboard"
              className="bg-[#D3CCB0] hover:bg-[#c4bb9a] text-[#000000] text-xs font-bold px-4 py-2.5 rounded-xl transition-all shadow flex items-center gap-1.5 self-start sm:self-auto"
            >
              <span>Open Full Dashboard</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-[#202C44]/40 border border-[#202C44] p-4 rounded-2xl">
              <span className="text-[11px] text-[#7B8A90] font-mono block">Estimated Earnings</span>
              <span className="text-2xl font-bold font-mono text-emerald-400 mt-1 block">₹12,450</span>
              <span className="text-[10px] text-[#7B8A90]">87.5% net seller share</span>
            </div>
            <div className="bg-[#202C44]/40 border border-[#202C44] p-4 rounded-2xl">
              <span className="text-[11px] text-[#7B8A90] font-mono block">Pending Payout</span>
              <span className="text-2xl font-bold font-mono text-white mt-1 block">₹1,800</span>
              <span className="text-[10px] text-emerald-400">Settles next Monday via UPI</span>
            </div>
            <div className="bg-[#202C44]/40 border border-[#202C44] p-4 rounded-2xl">
              <span className="text-[11px] text-[#7B8A90] font-mono block">Active Assets</span>
              <span className="text-2xl font-bold font-mono text-[#D3CCB0] mt-1 block">{creatorListings.length || 12}</span>
              <span className="text-[10px] text-[#7B8A90]">Live in marketplace</span>
            </div>
          </div>
        </div>
      )}

      {/* Edit Profile Modal */}
      {isEditModalOpen && (
        <div className="fixed inset-0 z-50 bg-[#000000]/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#111317] border border-[#202C44] rounded-3xl max-w-lg w-full p-6 sm:p-8 space-y-6 shadow-2xl relative">
            <div className="flex items-center justify-between border-b border-[#202C44] pb-4">
              <h3 className="text-lg font-heading font-extrabold text-white">
                Edit Seller Profile
              </h3>
              <button
                onClick={() => setIsEditModalOpen(false)}
                className="text-[#7B8A90] hover:text-white p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveProfile} className="space-y-4 text-xs">
              <div>
                <label className="block text-[#7B8A90] mb-1 font-medium">Full Name</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-[#000000] text-white px-3.5 py-2.5 rounded-xl border border-[#202C44] focus:outline-none focus:border-[#D3CCB0]"
                />
              </div>

              <div>
                <label className="block text-[#7B8A90] mb-1 font-medium">Username Handle</label>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#7B8A90] font-mono">@</span>
                  <input
                    type="text"
                    required
                    value={handle.replace("@", "")}
                    onChange={(e) => setHandle(e.target.value)}
                    className="w-full bg-[#000000] text-white pl-8 pr-3.5 py-2.5 rounded-xl border border-[#202C44] focus:outline-none focus:border-[#D3CCB0] font-mono"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-[#7B8A90] font-medium">Bio (Max 150 words)</label>
                  <span
                    className={`text-[11px] font-mono ${
                      countWords(bio) >= MAX_BIO_WORDS ? "text-amber-400 font-bold" : "text-[#7B8A90]"
                    }`}
                  >
                    {countWords(bio)} / {MAX_BIO_WORDS} words
                  </span>
                </div>
                <textarea
                  rows={4}
                  value={bio}
                  onChange={(e) => handleBioChange(e.target.value)}
                  placeholder="Describe your expertise, skills, and the digital assets you build (up to 150 words)..."
                  className="w-full bg-[#000000] text-white px-3.5 py-2.5 rounded-xl border border-[#202C44] focus:outline-none focus:border-[#D3CCB0] text-xs leading-relaxed"
                />
                {countWords(bio) >= MAX_BIO_WORDS && (
                  <p className="text-[10px] text-amber-400 mt-1 font-mono">
                    Limit of 150 words reached.
                  </p>
                )}
              </div>

              <div>
                <label className="block text-[#7B8A90] mb-1 font-medium">Location</label>
                <input
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="Bengaluru, India"
                  className="w-full bg-[#000000] text-white px-3.5 py-2.5 rounded-xl border border-[#202C44] focus:outline-none focus:border-[#D3CCB0]"
                />
              </div>

              <div>
                <label className="block text-[#7B8A90] mb-1 font-medium">Registered Account Email</label>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#7B8A90]">
                    <Mail className="w-3.5 h-3.5" />
                  </span>
                  <input
                    type="email"
                    disabled
                    value={profileEmail}
                    className="w-full bg-[#000000]/60 text-[#7B8A90] pl-9 pr-3.5 py-2.5 rounded-xl border border-[#202C44] font-mono cursor-not-allowed text-xs"
                  />
                </div>
                <p className="text-[10px] text-[#7B8A90] mt-1 font-mono">
                  Registered account email used for order deliveries and seller payout settlements.
                </p>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#202C44]">
                <button
                  type="button"
                  onClick={() => setIsEditModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-[#7B8A90] hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-[#D3CCB0] hover:bg-[#c4bb9a] text-[#000000] font-bold px-5 py-2.5 rounded-xl shadow transition-all"
                >
                  Save Profile
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};

import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { AssetListing, UserProfile, UserPurchase, PublicProfile } from "../types";
import { ListingCard } from "../components/ListingCard";
import {
  fetchPublicProfileByUsernameId,
  savePublicProfileToFirebase,
} from "../services/firebaseService";
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
  Sparkles,
  X,
  Plus,
  ArrowRight,
  Award,
  Download,
  Mail,
  UserX,
  Loader2,
} from "lucide-react";

interface CreatorProfilePageProps {
  listings: AssetListing[];
  savedIds: string[];
  onToggleSave: (id: string) => void;
  onBuyNowDirect: (listing: AssetListing) => void;
  userProfile?: UserProfile | null;
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

  // Derive target username/handle
  const cleanUsername = (username || userProfile?.username || "").replace("@", "").trim().toLowerCase();

  // Check if viewing own profile
  const isOwner = Boolean(
    !username ||
    username === "me" ||
    (userProfile?.username && cleanUsername === userProfile.username.toLowerCase()) ||
    (userProfile?.uid && cleanUsername === userProfile.uid.toLowerCase())
  );

  // Authoritative public profile state (from Firebase /publicProfiles)
  const [profileData, setProfileData] = useState<PublicProfile | null>(null);
  const [resolvedUid, setResolvedUid] = useState<string | null>(null);
  const [isLoadingProfile, setIsLoadingProfile] = useState<boolean>(!isOwner);
  const [notFound, setNotFound] = useState<boolean>(false);

  // Edit profile form state
  const [editName, setEditName] = useState("");
  const [editBio, setEditBio] = useState("");
  const [editUsernameId, setEditUsernameId] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);

  // Load public profile from Firebase /publicProfiles/{uid}
  useEffect(() => {
    let isMounted = true;

    if (isOwner && userProfile) {
      setProfileData({
        name: userProfile.name,
        role: userProfile.role,
        bio: userProfile.bio || "",
        usernameId: userProfile.username || userProfile.uid || "",
      });
      setResolvedUid(userProfile.uid);
      setEditName(userProfile.name);
      setEditBio(userProfile.bio || "");
      setEditUsernameId(userProfile.username || "");
      setIsLoadingProfile(false);
      setNotFound(false);
      return;
    }

    if (!cleanUsername) {
      setIsLoadingProfile(false);
      setNotFound(true);
      return;
    }

    setIsLoadingProfile(true);
    setNotFound(false);

    fetchPublicProfileByUsernameId(cleanUsername)
      .then((res) => {
        if (!isMounted) return;
        if (res && res.profile) {
          setProfileData(res.profile);
          setResolvedUid(res.uid);
          setEditName(res.profile.name || "");
          setEditBio(res.profile.bio || "");
          setEditUsernameId(res.profile.usernameId || "");
          setNotFound(false);
        } else {
          setProfileData(null);
          setResolvedUid(null);
          setNotFound(true);
        }
      })
      .catch((err) => {
        if (!isMounted) return;
        console.warn("Error fetching creator profile:", err);
        setProfileData(null);
        setNotFound(true);
      })
      .finally(() => {
        if (isMounted) setIsLoadingProfile(false);
      });

    return () => {
      isMounted = false;
    };
  }, [cleanUsername, isOwner, userProfile]);

  // Derive profile display attributes strictly from allowed fields: name, role, bio, usernameId
  const displayName = profileData?.name || (isOwner && userProfile?.name) || "Creator";
  const displayRole = profileData?.role || (isOwner && userProfile?.role) || "creator";
  const displayBio = profileData?.bio || (isOwner && userProfile?.bio) || "Digital asset creator on Kreate Studio.";
  const displayUsernameId = profileData?.usernameId || cleanUsername || "creator";

  // Initials for avatar
  const getInitials = (text: string) => {
    const parts = text.trim().split(" ");
    if (parts.length >= 2) {
      return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
    }
    return text.slice(0, 2).toUpperCase() || "CR";
  };
  const initials = getInitials(displayName);

  // Filter listings strictly belonging to this creator from the authoritative Firebase listings
  const creatorListings = listings.filter((l) => {
    if (l.deleted === true) return false;
    if (resolvedUid && l.sellerId === resolvedUid) return true;
    if (profileData?.name && l.sellerName?.toLowerCase() === profileData.name.toLowerCase()) return true;
    if (profileData?.usernameId && l.creator?.username?.toLowerCase() === profileData.usernameId.toLowerCase()) return true;
    if (isOwner && userProfile) {
      return (
        (userProfile.uid && l.sellerId === userProfile.uid) ||
        (userProfile.username && l.creator?.username?.toLowerCase() === userProfile.username.toLowerCase()) ||
        (userProfile.name && l.sellerName?.toLowerCase() === userProfile.name.toLowerCase())
      );
    }
    return false;
  });

  const MAX_BIO_WORDS = 150;
  const countWords = (text: string) => {
    const trimmed = text.trim();
    return trimmed ? trimmed.split(/\s+/).length : 0;
  };

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userProfile?.uid) return;

    setIsSaving(true);
    setSaveError(null);

    const words = editBio.trim() ? editBio.trim().split(/\s+/) : [];
    const trimmedBio = words.slice(0, MAX_BIO_WORDS).join(" ");

    const updatedPublicProfile: PublicProfile = {
      name: editName.trim(),
      role: displayRole,
      bio: trimmedBio,
      usernameId: editUsernameId.trim().toLowerCase().replace(/[^a-z0-9_]/g, ""),
    };

    const res = await savePublicProfileToFirebase(userProfile.uid, updatedPublicProfile);

    setIsSaving(false);
    if (res.success) {
      setProfileData(updatedPublicProfile);
      if (onUpdateUserProfile) {
        onUpdateUserProfile({
          name: updatedPublicProfile.name,
          bio: updatedPublicProfile.bio,
          username: updatedPublicProfile.usernameId,
        });
      }
      setIsEditModalOpen(false);
    } else {
      setSaveError(res.error || "Failed to save profile. Please try again.");
    }
  };

  // Loading state
  if (isLoadingProfile) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 text-center space-y-4">
        <Loader2 className="w-8 h-8 text-[#D3CCB0] animate-spin mx-auto" />
        <p className="text-xs text-[#7B8A90] font-mono">Loading creator profile from Firebase...</p>
      </div>
    );
  }

  // Not Found State (strictly do not substitute fake profiles!)
  if (notFound && !isOwner) {
    return (
      <div className="max-w-xl mx-auto px-4 py-24 text-center space-y-6">
        <div className="w-16 h-16 rounded-2xl bg-[#202C44] text-[#D3CCB0] flex items-center justify-center mx-auto border border-[#202C44]">
          <UserX className="w-8 h-8" />
        </div>
        <div className="space-y-2">
          <h1 className="text-2xl font-heading font-extrabold text-white">Creator Profile Not Found</h1>
          <p className="text-xs sm:text-sm text-[#7B8A90] leading-relaxed">
            No public profile exists for <span className="font-mono text-[#D3CCB0]">@{cleanUsername}</span> in Firebase Realtime Database (/publicProfiles).
          </p>
        </div>
        <div className="pt-2">
          <Link
            to="/browse"
            className="inline-flex items-center gap-2 bg-[#D3CCB0] hover:bg-[#c4bb9a] text-[#000000] text-xs font-bold px-5 py-2.5 rounded-xl transition-all shadow"
          >
            <span>Explore Creator Assets</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8" id="seller-profile-page">
      {/* 1. Profile Header Banner */}
      <div className="bg-[#111317] border border-[#202C44] rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xl relative overflow-hidden" id="seller-profile-header">
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#202C44]/20 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20" />

        <div className="flex flex-col md:flex-row md:items-start justify-between gap-6 relative z-10">
          {/* Avatar & Identity details */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5 sm:gap-6">
            <div className="relative shrink-0">
              <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl bg-[#202C44] border-2 border-[#202C44] flex items-center justify-center shadow-lg group hover:border-[#D3CCB0] transition-colors">
                <span className="font-heading font-extrabold text-2xl sm:text-3xl text-[#D3CCB0] tracking-wider font-mono">
                  {initials}
                </span>
              </div>
              <div className="absolute -bottom-1 -right-1 bg-emerald-500 w-4 h-4 rounded-full border-2 border-[#111317]" title="Active Member" />
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2.5 flex-wrap">
                <h1 className="text-2xl sm:text-3xl font-heading font-extrabold text-white tracking-tight" id="seller-name-heading">
                  {displayName}
                </h1>

                <span className="text-xs font-mono text-[#D3CCB0] bg-[#202C44] px-2.5 py-0.5 rounded-lg border border-[#202C44] font-medium" id="seller-handle-badge">
                  @{displayUsernameId}
                </span>

                <span className="text-xs font-bold text-[#000000] bg-[#D3CCB0] px-2.5 py-0.5 rounded-lg flex items-center gap-1 shadow-sm font-sans" id="seller-role-badge">
                  <Award className="w-3.5 h-3.5 text-[#000000]" />
                  <span className="capitalize">{displayRole}</span>
                </span>
              </div>

              {/* Bio strictly from Firebase /publicProfiles/uid */}
              <p className="text-xs sm:text-sm text-[#7B8A90] max-w-2xl leading-relaxed">
                {displayBio}
              </p>

              <div className="flex flex-wrap items-center gap-4 text-xs text-[#7B8A90] pt-1 font-sans">
                <span className="flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Verified Creator Account</span>
                </span>
              </div>
            </div>
          </div>

          {/* Action buttons */}
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
                }
              }}
              className="bg-[#111317] hover:bg-[#202C44] text-[#7B8A90] hover:text-white p-2.5 rounded-xl border border-[#202C44] transition-colors"
              title="Share profile link"
              aria-label="Share profile"
            >
              <Share2 className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* 2. Stats Row: Authoritative counts */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4 pt-4 border-t border-[#202C44]" id="seller-stats-row">
          <div className="bg-[#202C44]/40 border border-[#202C44] p-3.5 sm:p-4 rounded-2xl text-center">
            <span className="text-[10px] sm:text-xs text-[#7B8A90] uppercase font-mono tracking-wider block">
              Live Listings
            </span>
            <span className="text-xl sm:text-2xl font-heading font-extrabold text-white font-mono mt-0.5 block" id="stat-listings-count">
              {creatorListings.length}
            </span>
          </div>

          <div className="bg-[#202C44]/40 border border-[#202C44] p-3.5 sm:p-4 rounded-2xl text-center">
            <span className="text-[10px] sm:text-xs text-[#7B8A90] uppercase font-mono tracking-wider block">
              Profile Status
            </span>
            <span className="text-xl sm:text-2xl font-heading font-extrabold text-emerald-400 font-mono mt-0.5 block" id="stat-status">
              Active
            </span>
          </div>

          <div className="col-span-2 sm:col-span-1 bg-[#202C44]/40 border border-[#202C44] p-3.5 sm:p-4 rounded-2xl text-center">
            <span className="text-[10px] sm:text-xs text-[#7B8A90] uppercase font-mono tracking-wider block">
              Role
            </span>
            <span className="text-xl sm:text-2xl font-heading font-extrabold text-[#D3CCB0] font-mono mt-0.5 block capitalize" id="stat-role">
              {displayRole}
            </span>
          </div>
        </div>
      </div>

      {/* 3. Interactive Tabs */}
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
            <span>Listings ({creatorListings.length})</span>
          </button>

          {isOwner && (
            <>
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
                <span>My Purchases ({purchases.length})</span>
              </button>

              <button
                id="tab-dashboard"
                onClick={() => setActiveTab("dashboard")}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                  activeTab === "dashboard"
                    ? "bg-[#D3CCB0] text-[#000000] shadow"
                    : "bg-[#111317] text-[#7B8A90] hover:text-white border border-[#202C44]"
                }`}
              >
                <LayoutDashboard className="w-3.5 h-3.5" />
                <span>Seller Dashboard</span>
              </button>
            </>
          )}
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

      {/* Tab Content 1: Creator Listings */}
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
                <h3 className="text-base font-bold text-white">No Approved Listings</h3>
                <p className="text-xs text-[#7B8A90]">
                  This creator does not currently have approved listings in the Firebase catalogue.
                </p>
              </div>
              {isOwner && (
                <Link
                  to="/sell/new"
                  className="inline-flex items-center gap-2 bg-[#D3CCB0] text-[#000000] text-xs font-bold px-4 py-2.5 rounded-xl shadow"
                >
                  <span>Upload Asset</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              )}
            </div>
          )}
        </div>
      )}

      {/* Tab Content 2: Purchases */}
      {activeTab === "purchases" && isOwner && (
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
              <p className="text-xs text-[#7B8A90]">No purchases found in your account.</p>
              <Link to="/browse" className="inline-block bg-[#D3CCB0] text-[#000000] text-xs font-bold px-4 py-2 rounded-xl">
                Explore Marketplace
              </Link>
            </div>
          )}
        </div>
      )}

      {/* Tab Content 3: Dashboard Link */}
      {activeTab === "dashboard" && isOwner && (
        <div className="bg-[#111317] border border-[#202C44] rounded-3xl p-6 sm:p-8 space-y-6" id="tab-content-dashboard">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#202C44] pb-5">
            <div>
              <h3 className="text-lg font-heading font-extrabold text-white">
                Seller Dashboard
              </h3>
              <p className="text-xs text-[#7B8A90] mt-0.5">
                Track your active listings and payouts.
              </p>
            </div>
            <Link
              to="/dashboard"
              className="bg-[#D3CCB0] hover:bg-[#c4bb9a] text-[#000000] text-xs font-bold px-4 py-2.5 rounded-xl transition-all shadow flex items-center gap-1.5 self-start sm:self-auto"
            >
              <span>Open Seller Dashboard</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="bg-[#202C44]/40 border border-[#202C44] p-4 rounded-2xl">
              <span className="text-[11px] text-[#7B8A90] font-mono block">Active Catalogue Listings</span>
              <span className="text-2xl font-bold font-mono text-[#D3CCB0] mt-1 block">{creatorListings.length}</span>
              <span className="text-[10px] text-[#7B8A90]">Approved listings live on marketplace</span>
            </div>
            <div className="bg-[#202C44]/40 border border-[#202C44] p-4 rounded-2xl">
              <span className="text-[11px] text-[#7B8A90] font-mono block">Seller Net Split</span>
              <span className="text-2xl font-bold font-mono text-emerald-400 mt-1 block">87.5%</span>
              <span className="text-[10px] text-[#7B8A90]">Industry-leading direct payout rate</span>
            </div>
          </div>
        </div>
      )}

      {/* Edit Profile Modal (saves directly to /publicProfiles/{uid}) */}
      {isEditModalOpen && isOwner && (
        <div className="fixed inset-0 z-50 bg-[#000000]/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#111317] border border-[#202C44] rounded-3xl max-w-lg w-full p-6 sm:p-8 space-y-6 shadow-2xl relative">
            <div className="flex items-center justify-between border-b border-[#202C44] pb-4">
              <h3 className="text-lg font-heading font-extrabold text-white">
                Edit Public Profile
              </h3>
              <button
                onClick={() => setIsEditModalOpen(false)}
                className="text-[#7B8A90] hover:text-white p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {saveError && (
              <div className="p-3 bg-red-950/40 border border-red-800/80 rounded-xl text-xs text-red-300">
                {saveError}
              </div>
            )}

            <form onSubmit={handleSaveProfile} className="space-y-4 text-xs">
              <div>
                <label className="block text-[#7B8A90] mb-1 font-medium">Display Name</label>
                <input
                  type="text"
                  required
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  className="w-full bg-[#000000] text-white px-3.5 py-2.5 rounded-xl border border-[#202C44] focus:outline-none focus:border-[#D3CCB0]"
                />
              </div>

              <div>
                <label className="block text-[#7B8A90] mb-1 font-medium">Username Handle (usernameId)</label>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#7B8A90] font-mono">@</span>
                  <input
                    type="text"
                    required
                    value={editUsernameId.replace("@", "")}
                    onChange={(e) => setEditUsernameId(e.target.value)}
                    className="w-full bg-[#000000] text-white pl-8 pr-3.5 py-2.5 rounded-xl border border-[#202C44] focus:outline-none focus:border-[#D3CCB0] font-mono"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-[#7B8A90] font-medium">Bio (Max 150 words)</label>
                  <span
                    className={`text-[11px] font-mono ${
                      countWords(editBio) >= MAX_BIO_WORDS ? "text-amber-400 font-bold" : "text-[#7B8A90]"
                    }`}
                  >
                    {countWords(editBio)} / {MAX_BIO_WORDS} words
                  </span>
                </div>
                <textarea
                  rows={4}
                  value={editBio}
                  onChange={(e) => setEditBio(e.target.value)}
                  placeholder="Describe your creative work and assets..."
                  className="w-full bg-[#000000] text-white px-3.5 py-2.5 rounded-xl border border-[#202C44] focus:outline-none focus:border-[#D3CCB0] text-xs leading-relaxed"
                />
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
                  disabled={isSaving}
                  className="bg-[#D3CCB0] hover:bg-[#c4bb9a] text-[#000000] font-bold px-5 py-2.5 rounded-xl shadow transition-all disabled:opacity-50"
                >
                  {isSaving ? "Saving to Firebase..." : "Save Public Profile"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

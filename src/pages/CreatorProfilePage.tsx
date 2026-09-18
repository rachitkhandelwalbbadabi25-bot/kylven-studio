import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { AssetListing, UserProfile, UserPurchase, PublicProfile, isUserAdmin } from "../types";
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
  Heart,
  Ban,
  ChevronRight,
  Pencil,
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

  const [activeTab, setActiveTab] = useState<"listings" | "purchases" | "dashboard" | "saved">("listings");
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

  // Inline bio editing state
  const [isBioEditingInline, setIsBioEditingInline] = useState(false);
  const [inlineBioText, setInlineBioText] = useState("");
  const [isSavingInlineBio, setIsSavingInlineBio] = useState(false);

  // Blocked accounts modal state
  const [isBlockedModalOpen, setIsBlockedModalOpen] = useState(false);
  const [newBlockedInput, setNewBlockedInput] = useState("");
  const [blockedUsers, setBlockedUsers] = useState<string[]>(() => {
    try {
      const stored = localStorage.getItem("kreate_blocked_users");
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  const handleBlockUser = (usernameToBlock: string) => {
    const clean = usernameToBlock.trim().replace(/^@/, "").toLowerCase();
    if (!clean || blockedUsers.includes(clean)) return;
    const updated = [...blockedUsers, clean];
    setBlockedUsers(updated);
    localStorage.setItem("kreate_blocked_users", JSON.stringify(updated));
  };

  const handleUnblockUser = (usernameToUnblock: string) => {
    const updated = blockedUsers.filter((u) => u !== usernameToUnblock);
    setBlockedUsers(updated);
    localStorage.setItem("kreate_blocked_users", JSON.stringify(updated));
  };

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

  // Initials for avatar: single letter (e.g. 'R' for 'Rachit Khandelwal')
  const initials = (displayName.trim().charAt(0) || "C").toUpperCase();

  const isBuyer = Boolean(isOwner && (userProfile?.role === "buyer" || displayRole === "buyer"));

  const isAdminAccount = Boolean(
    (isOwner && userProfile && isUserAdmin(userProfile)) ||
    profileData?.isAdmin ||
    resolvedUid === "admin-user" ||
    cleanUsername === "admin"
  );

  // Sync default tab if viewing as buyer
  useEffect(() => {
    if (isBuyer) {
      setActiveTab("saved");
    }
  }, [isBuyer]);

  // Saved listings for buyer profile
  const savedListings = listings.filter((item) => !item.deleted && savedIds.includes(item.id));

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

  // 5-metric Seller Profile statistics (Listings, Followers, Following, Purchases, Spent)
  const listingsCount = isBuyer ? savedListings.length : creatorListings.length;
  const followersCount = (userProfile as any)?.followersCount ?? (profileData as any)?.followersCount ?? 0;
  const followingCount = (userProfile as any)?.followingCount ?? (profileData as any)?.followingCount ?? 0;
  const purchasesCount = purchases.length;
  const totalSpentINR = purchases.reduce((acc, p) => acc + (p.pricePaidINR || 0), 0);

  const MAX_BIO_WORDS = 150;
  const countWords = (text: string) => {
    const trimmed = text.trim();
    return trimmed ? trimmed.split(/\s+/).length : 0;
  };

  const handleSaveBioInline = async () => {
    if (!userProfile?.uid) return;
    setIsSavingInlineBio(true);

    const words = inlineBioText.trim() ? inlineBioText.trim().split(/\s+/) : [];
    const trimmedBio = words.slice(0, MAX_BIO_WORDS).join(" ");

    const updatedPublicProfile: PublicProfile = {
      name: profileData?.name || userProfile.name || "User",
      role: profileData?.role || displayRole,
      bio: trimmedBio,
      usernameId: profileData?.usernameId || userProfile.username || userProfile.uid,
    };

    const res = await savePublicProfileToFirebase(userProfile.uid, updatedPublicProfile);
    setIsSavingInlineBio(false);

    if (res.success) {
      setProfileData(updatedPublicProfile);
      setEditBio(trimmedBio);
      if (onUpdateUserProfile) {
        onUpdateUserProfile({ bio: trimmedBio });
      }
      setIsBioEditingInline(false);
    } else {
      alert("Failed to update bio: " + (res.error || "Permission denied"));
    }
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

                {isAdminAccount && (
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-blue-500/10 border border-blue-500/30 text-blue-400 text-xs font-medium" title="Verified Admin">
                    <CheckCircle2 className="w-3.5 h-3.5 text-blue-400 fill-blue-500/20" />
                    <span>Verified</span>
                  </span>
                )}

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

        {/* 2. Stats Row: Authoritative 5-metric layout (Listings, Followers, Following, Purchases, Spent) */}
        <div className="pt-4 border-t border-[#202C44]" id="seller-stats-row">
          <div className="bg-[#202C44]/40 border border-[#202C44] rounded-2xl p-4 sm:p-5">
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
          </div>
        </div>
      </div>

      {/* 2. About / Bio & Blocked Accounts Sections */}
      <section className="space-y-3" id="seller-bio-blocked-section">
        {/* Bio Box */}
        <div
          id="seller-bio-section"
          className="bg-[#0B0D11] border border-[#202C44] rounded-2xl p-4 sm:p-5 transition-colors"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-mono uppercase tracking-wider text-[#7B8A90]">
              About / Bio
            </span>
            {isOwner && !isBioEditingInline && (
              <button
                type="button"
                onClick={() => {
                  setInlineBioText(displayBio || "");
                  setIsBioEditingInline(true);
                }}
                className="text-[11px] font-sans font-medium text-[#D3CCB0] hover:underline flex items-center gap-1 cursor-pointer"
              >
                <Pencil className="w-3 h-3" />
                {displayBio ? "Edit Bio" : "Add Bio"}
              </button>
            )}
          </div>

          {isBioEditingInline ? (
            <div className="space-y-2">
              <textarea
                value={inlineBioText}
                onChange={(e) => setInlineBioText(e.target.value)}
                placeholder="Add a bio..."
                rows={3}
                className="w-full bg-[#111622] border border-[#202C44] rounded-xl p-3 text-sm text-white placeholder-[#7B8A90] focus:outline-none focus:border-[#D3CCB0] transition-colors"
                autoFocus
              />
              <div className="flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsBioEditingInline(false)}
                  disabled={isSavingInlineBio}
                  className="px-3 py-1.5 rounded-lg text-xs text-[#7B8A90] hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleSaveBioInline}
                  disabled={isSavingInlineBio}
                  className="px-4 py-1.5 rounded-lg bg-[#D3CCB0] text-black font-heading font-bold text-xs hover:bg-[#c4bb9a] disabled:opacity-50"
                >
                  {isSavingInlineBio ? "Saving..." : "Save Bio"}
                </button>
              </div>
            </div>
          ) : (
            <p className="text-sm text-white/90 font-sans leading-relaxed">
              {displayBio || (
                <span className="text-[#7B8A90] italic">
                  {isOwner ? "Add a bio to let buyers and creators know about your work." : "No bio provided."}
                </span>
              )}
            </p>
          )}
        </div>

        {/* Settings Link: "Blocked Accounts" row */}
        {isOwner && (
          <button
            type="button"
            id="seller-blocked-accounts-row-btn"
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
        )}
      </section>

      {/* 3. Interactive Tabs */}
      <div className="flex items-center justify-between border-b border-[#202C44] pb-4">
        <div className="flex items-center gap-2 sm:gap-3" id="seller-tabs-container">
          {isBuyer ? (
            <>
              <button
                id="tab-saved"
                onClick={() => setActiveTab("saved")}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                  activeTab === "saved"
                    ? "bg-[#D3CCB0] text-[#000000] shadow"
                    : "bg-[#111317] text-[#7B8A90] hover:text-white border border-[#202C44]"
                }`}
              >
                <Heart className="w-3.5 h-3.5" />
                <span>Saved ({savedListings.length})</span>
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
            </>
          ) : (
            <>
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
                <span>{isOwner ? "My Listings" : "Listings"} ({creatorListings.length})</span>
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
                    <span>Purchases ({purchases.length})</span>
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
                    <span>Dashboard</span>
                  </button>
                </>
              )}
            </>
          )}
        </div>

        {activeTab === "listings" && isOwner && !isBuyer && (
          <Link
            to="/sell/new"
            className="hidden sm:flex items-center gap-1.5 text-xs font-bold text-[#D3CCB0] hover:underline"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Upload Asset</span>
          </Link>
        )}
      </div>

      {/* Tab Content: Saved Listings for Buyer */}
      {activeTab === "saved" && isBuyer && (
        <div className="space-y-6" id="tab-content-saved">
          {savedListings.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {savedListings.map((item) => (
                <ListingCard
                  key={item.id}
                  listing={item}
                  onSelectListing={(asset) => {
                    navigate(`/listing/${asset.slug || asset.id}`);
                    window.scrollTo({ top: 0, behavior: "smooth" });
                  }}
                  onBuyNowDirect={onBuyNowDirect}
                  isSaved={true}
                  onToggleSave={onToggleSave}
                />
              ))}
            </div>
          ) : (
            <div className="bg-[#111317] border border-[#202C44] rounded-2xl p-12 text-center space-y-4">
              <Heart className="w-10 h-10 text-[#7B8A90] mx-auto opacity-50" />
              <div className="space-y-1">
                <h3 className="text-base font-bold text-white">No Saved Assets</h3>
                <p className="text-xs text-[#7B8A90]">
                  You haven't bookmarked any assets yet. Explore the marketplace to save favorites.
                </p>
              </div>
              <Link
                to="/browse"
                className="inline-block bg-[#D3CCB0] text-[#000000] text-xs font-bold px-4 py-2 rounded-xl"
              >
                Browse Marketplace
              </Link>
            </div>
          )}
        </div>
      )}

      {/* Tab Content 1: Creator Listings */}
      {activeTab === "listings" && !isBuyer && (
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

      {/* Tab Content 3: Dashboard Link (Sellers only) */}
      {activeTab === "dashboard" && isOwner && !isBuyer && (
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
              <span className="text-2xl font-bold font-mono text-emerald-400 mt-1 block">90%</span>
              <span className="text-[10px] text-[#7B8A90]">Sellers keep 90% of listed price</span>
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
      {/* Blocked Accounts Modal */}
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
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleBlockUser(newBlockedInput);
                setNewBlockedInput("");
              }}
              className="flex gap-2"
            >
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
                className="px-3.5 py-2 rounded-xl bg-[#202C44] hover:bg-rose-900/60 text-white font-heading font-bold text-xs disabled:opacity-40 transition-colors cursor-pointer"
              >
                Block
              </button>
            </form>

            {/* List */}
            <div className="max-h-60 overflow-y-auto space-y-2 pr-1 divide-y divide-[#202C44]/40">
              {blockedUsers.length === 0 ? (
                <div className="text-center py-6 text-xs text-[#7B8A90]">
                  No blocked accounts yet.
                </div>
              ) : (
                blockedUsers.map((u) => (
                  <div key={u} className="flex items-center justify-between pt-2">
                    <div className="flex items-center gap-2">
                      <UserX className="w-4 h-4 text-[#7B8A90]" />
                      <span className="text-xs font-mono text-white">@{u}</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleUnblockUser(u)}
                      className="text-[11px] font-sans text-rose-400 hover:text-rose-300 hover:underline cursor-pointer"
                    >
                      Unblock
                    </button>
                  </div>
                ))
              )}
            </div>

            <div className="pt-2 border-t border-[#202C44] flex justify-end">
              <button
                type="button"
                onClick={() => setIsBlockedModalOpen(false)}
                className="px-4 py-2 rounded-xl bg-[#162032] hover:bg-[#202C44] text-xs font-bold text-white transition-colors cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signInWithPopup, 
  signOut, 
  onAuthStateChanged,
  User 
} from "firebase/auth";
import { ref, get, set, update, query, orderByChild, equalTo, remove, serverTimestamp, onValue } from "firebase/database";
import { ref as storageRef, uploadBytes, getDownloadURL } from "firebase/storage";
import { auth, database, storage, googleAuthProvider } from "../lib/firebase";
import { AssetListing, FirebaseListing, CreatorProfile, UserProfile, UserPurchase, FirebasePurchase, PublicProfile, CoreCategory } from "../types";

/**
 * Normalizes raw category strings from Firebase / Kelvyn Studio app
 * into one of the standard CoreCategories recognized by the website catalog.
 */
export function normalizeCategoryName(rawCategory?: string): CoreCategory {
  if (!rawCategory) return "Software & Development";
  const lower = rawCategory.toLowerCase();
  if (
    lower.includes("design") ||
    /\b(ui|ux)\b/i.test(rawCategory) ||
    lower.includes("icon") ||
    lower.includes("figma")
  ) {
    return "UI/UX & Design";
  }
  // Word-boundary token matching for AI / ML so "html", "email", etc. do not trigger false positives
  if (
    lower.includes("machine learning") ||
    lower.includes("data science") ||
    lower.includes("python data") ||
    lower.includes("predictor") ||
    lower.includes("churn") ||
    /\b(ai|ml)\b/i.test(rawCategory)
  ) {
    return "AI/ML & Data Science";
  }
  if (
    /\b(3d|cad)\b/i.test(rawCategory) ||
    lower.includes("blender") ||
    lower.includes("environmental")
  ) {
    return "3D & CAD";
  }
  if (
    lower.includes("audio") ||
    lower.includes("video") ||
    lower.includes("pro tools") ||
    lower.includes("motion") ||
    lower.includes("music")
  ) {
    return "Video/Motion & Audio";
  }
  if (
    lower.includes("notion") ||
    lower.includes("legal") ||
    lower.includes("contract") ||
    lower.includes("productivity") ||
    lower.includes("business") ||
    lower.includes("crm") ||
    lower.includes("placement")
  ) {
    return "Productivity & Business";
  }
  if (
    lower.includes("dev") ||
    lower.includes("html") ||
    lower.includes("css") ||
    lower.includes("template") ||
    lower.includes("website") ||
    lower.includes("code") ||
    lower.includes("chrome") ||
    lower.includes("backend") ||
    lower.includes("script") ||
    lower.includes("flutter") ||
    lower.includes("lead") ||
    lower.includes("voice") ||
    lower.includes("rag")
  ) {
    return "Software & Development";
  }
  return "Other (Digital Planners, Embroidery Files, Lightroom Presets, eBooks/Guides)";
}

// ==========================================
// AUTHENTICATION SERVICES
// ==========================================

/**
 * Translates Firebase Authentication error codes into actionable user messages.
 * Handles unauthorized-domain, popup blocks, credential issues, and cancellations.
 */
export function getAuthErrorMessage(err: any): string {
  if (!err) return "An unexpected error occurred. Please try again.";
  const code = err.code || "";
  const currentHost = typeof window !== "undefined" && window.location.hostname ? window.location.hostname : "kreate-mauve.vercel.app";

  switch (code) {
    case "auth/unauthorized-domain":
      return `Domain '${currentHost}' is not authorized for Firebase Authentication. Go to Firebase Console (project: kreate-studio-d95f0) → Authentication → Settings → Authorized domains and ensure '${currentHost}' and 'kreate-mauve.vercel.app' are added.`;
    case "auth/popup-closed-by-user":
      return "Google sign-in was cancelled (the popup was closed before completing authentication).";
    case "auth/popup-blocked":
      return "The Google sign-in popup was blocked by your browser. Please allow popups for this site and try again.";
    case "auth/invalid-credential":
    case "auth/wrong-password":
      return "Invalid email or password. Please verify your credentials and try again.";
    case "auth/user-not-found":
      return "No account exists with this email address. Please sign up.";
    case "auth/email-already-in-use":
      return "An account with this email address already exists. Please sign in instead.";
    case "auth/weak-password":
      return "Password should be at least 6 characters.";
    case "auth/operation-not-allowed":
      return "Google sign-in is currently disabled. Please enable Google under Firebase Console → Authentication → Sign-in method.";
    case "auth/network-request-failed":
      return "Network connection issue. Please check your internet connection and try again.";
    case "auth/cancelled-popup-request":
      return "Only one sign-in window can be open at a time. Please try again.";
    default:
      return err.message || `Authentication error (${code || "unknown"}). Please try again.`;
  }
}

export async function loginWithEmail(email: string, password: string): Promise<User> {
  const credential = await signInWithEmailAndPassword(auth, email, password);
  return credential.user;
}

export async function registerWithEmail(
  email: string, 
  password: string, 
  profileData: Partial<UserProfile>
): Promise<{ user: User; profile: UserProfile }> {
  const credential = await createUserWithEmailAndPassword(auth, email, password);
  const user = credential.user;

  const profile: UserProfile = {
    name: profileData.name || email.split("@")[0],
    email: user.email || email,
    username: profileData.username || email.split("@")[0].toLowerCase().replace(/[^a-z0-9]/g, "_"),
    role: profileData.role || "buyer",
    avatar: profileData.avatar || "",
    bio: profileData.bio || "",
    upiId: profileData.upiId,
    location: profileData.location || "India",
    hasCompletedOnboarding: true,
  };

  // Canonical profile creation: write to /users/{user.uid} so that the backend trigger
  // creates and populates /publicProfiles/{user.uid} with name, role, bio, usernameId
  try {
    const userRef = ref(database, `users/${user.uid}`);
    await set(userRef, {
      name: profile.name,
      email: profile.email,
      usernameId: profile.username,
      role: profile.role,
      bio: profile.bio || "",
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
  } catch (err: any) {
    console.warn("Could not initialize /users record during registration:", err.message);
  }

  return { user, profile };
}

export async function loginWithGoogle(): Promise<{ user: User; isNewUser?: boolean }> {
  const result = await signInWithPopup(auth, googleAuthProvider);
  return { user: result.user };
}

export async function logoutUser(): Promise<void> {
  await signOut(auth);
}

export function subscribeToAuthState(callback: (user: User | null) => void): () => void {
  return onAuthStateChanged(auth, callback);
}

// ==========================================
// REALTIME DATABASE: LISTINGS
// ==========================================

/**
 * Prepares an authoritative FirebaseListing payload for writing to /listings/{listingId}.
 * Strictly writes only fields in the live database schema:
 * title, sellerName, sellerId, price, isFree, category, fileType, fileExtension,
 * createdAt, description, status, previewUrl, previewUrls, and optional fileUrl/fileName/fileSizeBytes.
 * 
 * NEVER writes priceInINR, rating, reviewCount, salesCount, or UI presentation objects.
 */
export function prepareFirebaseListing(
  listing: Partial<AssetListing>,
  fallbackId?: string
): { id: string; firebaseData: FirebaseListing } {
  const validId = listing.id || fallbackId || `asset-${Date.now()}`;
  const currentUid = auth.currentUser?.uid || listing.sellerId || "";
  
  // Safe price: only the authoritative 'price' field
  const rawPrice = typeof listing.price === "number" && !isNaN(listing.price)
    ? Math.max(0, Math.round(listing.price))
    : 0;

  const isFree = listing.isFree !== undefined ? Boolean(listing.isFree) : rawPrice === 0;
  const fileExt = listing.fileExtension || listing.fileType?.replace(/^\./, "") || "zip";
  const sellerName = listing.sellerName || listing.creator?.name || listing.seller?.name || "Verified Creator";
  const desc = listing.description || listing.fullDescription || listing.shortDescription || "";
  
  const primaryPreview = listing.previewUrl || listing.thumbnailUrl || (listing.previewUrls && listing.previewUrls[0]) || (listing.previewImages && listing.previewImages[0]) || "";
  const allPreviews = listing.previewUrls && listing.previewUrls.length > 0
    ? listing.previewUrls
    : (listing.previewImages && listing.previewImages.length > 0
      ? listing.previewImages
      : (primaryPreview ? [primaryPreview] : []));

  // Authoritative live schema payload
  const firebaseData: FirebaseListing = {
    title: (listing.title || "Untitled Asset").trim(),
    sellerName: sellerName.trim(),
    sellerId: currentUid,
    price: rawPrice,
    isFree,
    category: String(listing.category || "Other"),
    fileType: listing.fileType?.startsWith(".") ? listing.fileType : `.${fileExt}`,
    fileExtension: fileExt,
    createdAt: listing.createdAt || serverTimestamp(),
    description: desc.trim(),
    status: "pending", // Authoritative: New client listings are ALWAYS pending
    previewUrl: primaryPreview,
    previewUrls: allPreviews,
  };

  // Optional live schema fields (if present on input)
  if (listing.fileUrl) {
    firebaseData.fileUrl = listing.fileUrl;
  }
  if (listing.fileSizeBytes) {
    firebaseData.fileSizeBytes = listing.fileSizeBytes;
  }

  return { id: validId, firebaseData };
}

/**
 * Maps an authoritative FirebaseListing fetched from /listings into an AssetListing
 * for safe UI consumption without fabricating metrics or exposing private file URLs.
 */
export function mapFirebaseListingToAssetListing(
  id: string,
  raw: Partial<FirebaseListing>
): AssetListing {
  const price = typeof raw.price === "number" && !isNaN(raw.price) ? Math.max(0, raw.price) : 0;
  const isFree = Boolean(raw.isFree || price === 0);
  const preview = raw.previewUrl || (Array.isArray(raw.previewUrls) && raw.previewUrls[0]) || "";
  const previewList = Array.isArray(raw.previewUrls) && raw.previewUrls.length > 0
    ? raw.previewUrls
    : (preview ? [preview] : []);
  const sellerName = raw.sellerName || "Verified Creator";
  const desc = raw.description || "";
  const fileType = raw.fileType || (raw.fileExtension ? `.${raw.fileExtension}` : ".zip");
  const fileExt = raw.fileExtension || fileType.replace(/^\./, "") || "zip";

  // Format file size nicely if provided
  let formattedSize = "Instant Download";
  if (typeof raw.fileSizeBytes === "number" && raw.fileSizeBytes > 0) {
    if (raw.fileSizeBytes >= 1024 * 1024) {
      formattedSize = `${(raw.fileSizeBytes / (1024 * 1024)).toFixed(1)} MB`;
    } else if (raw.fileSizeBytes >= 1024) {
      formattedSize = `${Math.round(raw.fileSizeBytes / 1024)} KB`;
    } else {
      formattedSize = `${raw.fileSizeBytes} B`;
    }
  }

  // Derive standardized core category and keep exact category as subcategory
  const normalizedCat = normalizeCategoryName(raw.category);
  const rawCat = raw.category || "General";

  const creatorObj: CreatorProfile = {
    id: raw.sellerId || "creator",
    name: sellerName,
    username: sellerName.toLowerCase().replace(/[^a-z0-9]/g, ""),
    handle: `@${sellerName.toLowerCase().replace(/[^a-z0-9]/g, "")}`,
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80",
    verified: false,
    verifiedSeller: false,
    totalSales: 0,
    rating: 0,
    responseTime: "< 2 hours",
    joinedDate: "2026",
    location: "India",
    bio: "",
    skills: [],
  };

  const fileFormatTags = [
    fileExt.toUpperCase(),
    fileType.startsWith(".") ? fileType : `.${fileExt}`
  ].filter((v, idx, arr) => arr.indexOf(v) === idx && v !== ".");

  return {
    id,
    title: raw.title || "Untitled Asset",
    sellerName,
    sellerId: raw.sellerId || "",
    price,
    isFree,
    category: normalizedCat,
    subcategory: rawCat,
    fileType,
    fileExtension: fileExt,
    fileSizeBytes: raw.fileSizeBytes !== undefined ? String(raw.fileSizeBytes) : undefined,
    createdAt: raw.createdAt || 0,
    description: desc,
    shortDescription: desc.length > 140 ? `${desc.slice(0, 140)}...` : desc,
    fullDescription: desc,
    status: raw.status || "approved",
    previewUrl: preview,
    previewUrls: previewList,
    thumbnailUrl: preview,
    previewImages: previewList,
    fileFormatTags,
    creator: creatorObj,
    seller: creatorObj,
    softwareCompatibility: ["Cross-Platform", "Standard Viewers"],
    licenseType: "Commercial License",
    deliveryType: formattedSize,
    deleted: raw.deleted,
    deletedAt: raw.deletedAt,
    detailedFeatures: [
      "Original verified digital files",
      "Standard Commercial License included",
      `Instant delivery (${formattedSize})`,
    ],
  };
}

/**
 * Sanitizes a client listing before state update, ensuring safe price and clean structure.
 * Does NOT add priceInINR or fabricate fake metrics.
 */
export function sanitizePublicListing(listing: AssetListing, fallbackId?: string): AssetListing {
  const validId = listing.id || fallbackId || `asset-${Date.now()}`;
  const safePrice = typeof listing.price === "number" && !isNaN(listing.price)
    ? Math.max(0, listing.price)
    : 0;

  const isFree = listing.isFree !== undefined ? Boolean(listing.isFree) : safePrice === 0;
  const sellerName = listing.sellerName || listing.creator?.name || listing.seller?.name || "Verified Creator";

  return {
    ...listing,
    id: validId,
    price: safePrice,
    isFree,
    sellerName,
    status: "pending",
  };
}

/**
 * Public listings are readable ONLY when queried exactly using:
 * orderByChild('status').equalTo('approved')
 * Any bare "get all listings" operation is strictly replaced with this query.
 * Excludes soft-deleted listings with: deleted !== true
 */
export async function fetchListingsFromFirebase(): Promise<{ data: AssetListing[] | null; error?: string }> {
  try {
    const approvedListingsQuery = query(
      ref(database, "listings"),
      orderByChild("status"),
      equalTo("approved")
    );
    const snapshot = await get(approvedListingsQuery);
    if (snapshot.exists()) {
      const val = snapshot.val();
      const list: AssetListing[] = [];
      if (Array.isArray(val)) {
        val.forEach((item, idx) => {
          if (item && item.deleted !== true) {
            list.push(mapFirebaseListingToAssetListing(item.id || `asset-${idx}`, item));
          }
        });
      } else if (typeof val === "object" && val !== null) {
        Object.entries(val).forEach(([dbKey, item]: [string, any]) => {
          if (item && item.deleted !== true) {
            list.push(mapFirebaseListingToAssetListing(item.id || dbKey, item));
          }
        });
      }
      return { data: list };
    }
    return { data: null };
  } catch (err: any) {
    console.warn("Failed to fetch listings with query orderByChild('status').equalTo('approved'):", err.message);
    return { data: null, error: err.message };
  }
}

/**
 * Sets up a live Realtime Database listener on approved listings.
 * Emits updated list whenever listings change in the database.
 */
export function subscribeToListingsFromFirebase(
  onData: (listings: AssetListing[]) => void,
  onError?: (err: any) => void
): () => void {
  try {
    const approvedListingsQuery = query(
      ref(database, "listings"),
      orderByChild("status"),
      equalTo("approved")
    );
    const unsubscribe = onValue(
      approvedListingsQuery,
      (snapshot) => {
        if (snapshot.exists()) {
          const val = snapshot.val();
          const list: AssetListing[] = [];
          if (Array.isArray(val)) {
            val.forEach((item, idx) => {
              if (item && item.deleted !== true) {
                list.push(mapFirebaseListingToAssetListing(item.id || `asset-${idx}`, item));
              }
            });
          } else if (typeof val === "object" && val !== null) {
            Object.entries(val).forEach(([dbKey, item]: [string, any]) => {
              if (item && item.deleted !== true) {
                list.push(mapFirebaseListingToAssetListing(item.id || dbKey, item));
              }
            });
          }
          onData(list);
        } else {
          onData([]);
        }
      },
      (err) => {
        console.warn("Realtime listings subscription error:", err.message);
        if (onError) onError(err);
      }
    );
    return unsubscribe;
  } catch (err: any) {
    console.warn("Exception in subscribeToListingsFromFirebase:", err.message);
    if (onError) onError(err);
    return () => {};
  }
}

/**
 * Fetches a single listing directly by its Firebase database ID.
 */
export async function fetchListingByIdFromFirebase(id: string): Promise<AssetListing | null> {
  if (!id || typeof id !== "string") return null;
  const cleanId = id.trim();
  if (!cleanId) return null;

  try {
    const snapshot = await get(ref(database, `listings/${cleanId}`));
    if (snapshot.exists()) {
      const raw = snapshot.val();
      if (raw && raw.status === "approved" && raw.deleted !== true) {
        return mapFirebaseListingToAssetListing(cleanId, raw);
      }
    }
    return null;
  } catch (err: any) {
    console.warn(`Direct fetch for listing ${cleanId} failed:`, err.message);
    return null;
  }
}

/**
 * Saves a new or modified listing.
 * Strictly writes authoritative FirebaseListing shape with 'price', no 'priceInINR',
 * no fake metrics (rating, reviewCount, salesCount), and status: "pending".
 */
export async function saveListingToFirebase(listing: Partial<AssetListing>): Promise<{ success: boolean; error?: string }> {
  try {
    const currentUid = auth.currentUser?.uid;
    if (!currentUid) {
      const msg = "Authentication required: Please sign in to publish or update listings.";
      console.warn(msg);
      return { success: false, error: msg };
    }

    const { id, firebaseData } = prepareFirebaseListing(listing);

    if (firebaseData.sellerId !== currentUid) {
      const msg = "Permission denied: You can only publish or modify listings where sellerId matches your account UID.";
      console.warn(msg);
      return { success: false, error: msg };
    }

    const listingRef = ref(database, `listings/${id}`);
    await set(listingRef, firebaseData);
    return { success: true };
  } catch (err: any) {
    let friendlyError = err.message;
    if (err.message?.includes("PERMISSION_DENIED")) {
      friendlyError = "Permission denied: Security rules prevented writing this listing. Ensure you are signed in as the listing owner and protected marketplace metrics are not modified.";
    }
    console.error("Failed to save listing to Firebase Realtime Database:", friendlyError);
    return { success: false, error: friendlyError };
  }
}

// ==========================================
// ==========================================
// REALTIME DATABASE: PUBLIC PROFILES
// ==========================================

/**
 * Reads public profile from the authoritative source: /publicProfiles/{uid}
 * This node is intentionally public and contains:
 * - name
 * - role
 * - bio
 * - usernameId
 *
 * Does NOT read from /users/{uid} or assume /users exists.
 */
export async function fetchPublicProfileFromFirebase(uid: string): Promise<PublicProfile | null> {
  if (!uid) return null;
  try {
    const profileRef = ref(database, `publicProfiles/${uid.trim()}`);
    const snapshot = await get(profileRef);
    if (snapshot.exists()) {
      return snapshot.val() as PublicProfile;
    }
    return null;
  } catch (err: any) {
    console.warn("Failed to fetch public profile from /publicProfiles:", err.message);
    return null;
  }
}

/**
 * Sets up a realtime Database listener on /publicProfiles/{uid}.
 * Fires whenever profile changes in Firebase (e.g. from the mobile app).
 */
export function subscribeToPublicProfile(
  uid: string,
  onData: (profile: PublicProfile | null) => void,
  onError?: (err: any) => void
): () => void {
  if (!uid) {
    onData(null);
    return () => {};
  }
  const cleanUid = uid.trim();
  try {
    const profileRef = ref(database, `publicProfiles/${cleanUid}`);
    const unsubscribe = onValue(
      profileRef,
      (snapshot) => {
        if (snapshot.exists()) {
          onData(snapshot.val() as PublicProfile);
        } else {
          onData(null);
        }
      },
      (err) => {
        console.warn(`Realtime public profile subscription error for ${cleanUid}:`, err.message);
        if (onError) onError(err);
      }
    );
    return unsubscribe;
  } catch (err: any) {
    console.warn(`Exception subscribing to public profile for ${cleanUid}:`, err.message);
    if (onError) onError(err);
    return () => {};
  }
}

/**
 * Reads all public profiles from the authoritative /publicProfiles node.
 * Used for creator directory search and discovery.
 */
export async function fetchAllPublicProfilesFromFirebase(): Promise<Record<string, PublicProfile>> {
  try {
    const profilesRef = ref(database, "publicProfiles");
    const snapshot = await get(profilesRef);
    if (snapshot.exists()) {
      return snapshot.val() as Record<string, PublicProfile>;
    }
    return {};
  } catch (err: any) {
    console.warn("Failed to fetch all public profiles:", err.message);
    return {};
  }
}

/**
 * Resolves a public profile by usernameId or UID from /publicProfiles
 */
export async function fetchPublicProfileByUsernameId(identifier: string): Promise<{ uid: string; profile: PublicProfile } | null> {
  try {
    const clean = identifier.replace("@", "").trim().toLowerCase();
    if (!clean) return null;

    // Direct UID check first
    const directRef = ref(database, `publicProfiles/${clean}`);
    const directSnap = await get(directRef);
    if (directSnap.exists()) {
      return { uid: clean, profile: directSnap.val() as PublicProfile };
    }

    // Search /publicProfiles for matching usernameId or sanitized name
    const profilesRef = ref(database, "publicProfiles");
    const snapshot = await get(profilesRef);
    if (snapshot.exists()) {
      const val = snapshot.val() as Record<string, PublicProfile>;
      for (const [uid, prof] of Object.entries(val)) {
        if (!prof) continue;
        const uId = (prof.usernameId || "").toLowerCase();
        const pName = (prof.name || "").toLowerCase().replace(/[^a-z0-9]/g, "");
        if (uId === clean || uid.toLowerCase() === clean || pName === clean) {
          return { uid, profile: prof };
        }
      }
    }
    return null;
  } catch (err: any) {
    console.warn("Failed to resolve public profile:", err.message);
    return null;
  }
}

/**
 * Updates an authenticated user's profile through the authoritative canonical mechanism:
 * Writes to /users/{uid}, which is authorized for the authenticated user by Firebase security rules.
 * The backend synchronization service in Kreate Studio automatically detects updates to /users/{uid}
 * and replicates canonical fields (name, role, bio, usernameId) into /publicProfiles/{uid}.
 * 
 * Direct client-side writes to /publicProfiles/{uid} are restricted by Firebase security rules.
 */
export async function savePublicProfileToFirebase(
  uid: string,
  profile: Partial<PublicProfile>
): Promise<{ success: boolean; error?: string }> {
  try {
    const currentUid = auth.currentUser?.uid;
    const targetUid = uid || currentUid;

    if (!targetUid) {
      return { success: false, error: "Authentication required to update profile." };
    }

    if (currentUid && targetUid !== currentUid) {
      console.warn("Target UID mismatch with active user; using active currentUid:", currentUid);
    }

    const effectiveUid = currentUid || targetUid;
    // Canonical path: /users/{uid}
    const userRef = ref(database, `users/${effectiveUid}`);

    const payload: Record<string, any> = {
      updatedAt: serverTimestamp(),
    };
    if (profile.name !== undefined && profile.name.trim() !== "") {
      payload.name = profile.name.trim();
    }
    if (profile.role !== undefined && profile.role.trim() !== "") {
      payload.role = profile.role.trim();
    }
    if (profile.bio !== undefined) {
      payload.bio = profile.bio.trim();
    }
    if (profile.usernameId !== undefined && profile.usernameId.trim() !== "") {
      payload.usernameId = profile.usernameId.trim().toLowerCase().replace(/[^a-z0-9_]/g, "");
    }

    if (Object.keys(payload).length <= 1) {
      return { success: true };
    }

    await update(userRef, payload);
    return { success: true };
  } catch (err: any) {
    const msg = err.message || "";
    console.error("Failed to save profile via canonical /users path:", msg);
    return { success: false, error: msg };
  }
}

// ==========================================
// REALTIME DATABASE: BOOKMARKS
// ==========================================

/**
 * Reads an authenticated user's bookmarks from authoritative top-level node:
 * /bookmarks/{uid}
 * The value at each listing ID is always: true
 */
export async function fetchUserBookmarksFromFirebase(uid: string): Promise<string[]> {
  try {
    const currentUid = auth.currentUser?.uid;
    if (!currentUid || currentUid !== uid) {
      return [];
    }
    const bookmarksRef = ref(database, `bookmarks/${currentUid}`);
    const snapshot = await get(bookmarksRef);
    if (snapshot.exists()) {
      const val = snapshot.val();
      if (typeof val === "object" && val !== null) {
        return Object.keys(val).filter((key) => val[key] === true);
      }
    }
    return [];
  } catch (err: any) {
    console.warn("Failed to fetch bookmarks from /bookmarks:", err.message);
    return [];
  }
}

/**
 * Sets up a realtime Database listener on /bookmarks/{uid}.
 * Emits updated listing IDs whenever bookmarks change in the app or website.
 */
export function subscribeToUserBookmarks(
  uid: string,
  onData: (listingIds: string[]) => void,
  onError?: (err: any) => void
): () => void {
  const currentUid = auth.currentUser?.uid;
  if (!currentUid || currentUid !== uid) {
    onData([]);
    return () => {};
  }
  try {
    const bookmarksRef = ref(database, `bookmarks/${currentUid}`);
    const unsubscribe = onValue(
      bookmarksRef,
      (snapshot) => {
        if (snapshot.exists()) {
          const val = snapshot.val();
          if (typeof val === "object" && val !== null) {
            const ids = Object.keys(val).filter((key) => val[key] === true);
            onData(ids);
            return;
          }
        }
        onData([]);
      },
      (err) => {
        console.warn("Realtime bookmarks subscription error:", err.message);
        if (onError) onError(err);
      }
    );
    return unsubscribe;
  } catch (err: any) {
    console.warn("Exception subscribing to bookmarks:", err.message);
    if (onError) onError(err);
    return () => {};
  }
}

/**
 * Saves a bookmark at /bookmarks/{uid}/{listingId} with boolean value true.
 * Requires authenticated user's UID.
 */
export async function addBookmarkToFirebase(listingId: string): Promise<boolean> {
  try {
    const currentUid = auth.currentUser?.uid;
    if (!currentUid) {
      console.warn("Authentication required to save bookmark.");
      return false;
    }
    const bookmarkRef = ref(database, `bookmarks/${currentUid}/${listingId}`);
    await set(bookmarkRef, true);
    return true;
  } catch (err: any) {
    console.warn("Failed to save bookmark to /bookmarks:", err.message);
    return false;
  }
}

/**
 * Removes a bookmark by deleting /bookmarks/{uid}/{listingId}.
 * Requires authenticated user's UID.
 */
export async function removeBookmarkFromFirebase(listingId: string): Promise<boolean> {
  try {
    const currentUid = auth.currentUser?.uid;
    if (!currentUid) {
      console.warn("Authentication required to remove bookmark.");
      return false;
    }
    const bookmarkRef = ref(database, `bookmarks/${currentUid}/${listingId}`);
    await remove(bookmarkRef);
    return true;
  } catch (err: any) {
    console.warn("Failed to remove bookmark from /bookmarks:", err.message);
    return false;
  }
}

// ==========================================
// REALTIME DATABASE: FOLLOWERS & FOLLOWING
// ==========================================

/**
 * Backend Audit Specification for Followers / Following:
 * The shared Kreate Studio Firebase Realtime Database schema (/publicProfiles, /users, etc.)
 * does NOT store follower or following relationships, and no top-level /followers, /following,
 * or /userFollowers paths exist in the backend.
 * 
 * In accordance with strict data integrity rules, the client returns null ("—")
 * and does NOT fabricate counts or store a separate un-synchronized social graph.
 */
export function getFollowerRelationshipStatus(): {
  isSupported: boolean;
  message: string;
} {
  return {
    isSupported: false,
    message: "Follower and following relationship data is currently not exposed by the shared Firebase backend.",
  };
}

// ==========================================
// REALTIME DATABASE: PURCHASES
// ==========================================

/**
 * Maps an authoritative Firebase Realtime Database purchase record (/purchases/{purchaseId})
 * into the frontend UserPurchase model for UI presentation and download handling.
 */
export function mapFirebasePurchaseToUserPurchase(
  purchaseKey: string,
  raw: any
): UserPurchase {
  // Safely parse amount whether stored as number, numeric string, or legacy field
  let parsedAmount = 0;
  const candidateAmount = raw.amountPaid !== undefined ? raw.amountPaid : raw.pricePaidINR;
  if (typeof candidateAmount === "number") {
    parsedAmount = isNaN(candidateAmount) ? 0 : candidateAmount;
  } else if (typeof candidateAmount === "string") {
    const p = parseFloat(candidateAmount);
    parsedAmount = isNaN(p) ? 0 : p;
  }

  const purchaseTimestamp = typeof raw.purchasedAt === "number"
    ? raw.purchasedAt
    : typeof raw.purchasedAt === "string"
      ? parseFloat(raw.purchasedAt) || Date.now()
      : (raw.createdAt || Date.now());

  const dateStr = raw.purchaseDate || new Date(purchaseTimestamp).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
  const fileExt = raw.fileExtension
    ? (raw.fileExtension.startsWith(".") ? raw.fileExtension : `.${raw.fileExtension}`)
    : (raw.fileType || ".zip");

  const orderId = raw.orderId || (raw.razorpayPaymentId && raw.razorpayPaymentId !== "FREE"
    ? raw.razorpayPaymentId
    : `ORD-${purchaseKey.replace(/[^a-zA-Z0-9]/g, "").slice(-6).toUpperCase()}`);

  const licenseKey = raw.licenseKey || `KREATE-${purchaseKey.replace(/[^a-zA-Z0-9]/g, "").slice(-4).toUpperCase()}-${(raw.listingId || "ASSET").replace(/[^a-zA-Z0-9]/g, "").slice(-4).toUpperCase()}`;

  return {
    orderId,
    purchaseId: purchaseKey,
    buyerId: raw.buyerId || "",
    sellerId: raw.sellerId || "",
    listingId: raw.listingId || "",
    title: raw.listingTitle || raw.title || "Digital Asset",
    thumbnailUrl: raw.previewUrl || raw.thumbnailUrl || "",
    category: raw.category || "Digital Assets",
    fileType: fileExt,
    downloadUrl: raw.fileUrl || raw.downloadUrl || "",
    licenseKey,
    purchaseDate: dateStr,
    pricePaidINR: parsedAmount,
    amountPaid: parsedAmount,
    sellerNetINR: Math.round(parsedAmount * 0.9),
    platformFeeINR: Math.round(parsedAmount * 0.1),
    paymentMethod: raw.razorpayPaymentId === "FREE" ? "Free Download" : (raw.paymentMethod || "UPI / Razorpay"),
  };
}

/**
 * Subscribes to the authenticated user's purchase records in realtime from /purchases
 * strictly filtered by buyerId === uid.
 * 
 * Secure authoritative architecture:
 * - Scoped strictly to the authenticated buyer UID (never queries other users' purchases)
 * - Explicitly filters snapshot entries by buyerId === effectiveUid to prevent cross-user leakage
 * - Returns cleanup unsubscribe function for onValue
 * - Maps authoritative FirebasePurchase fields (listingTitle, previewUrl, fileUrl, amountPaid, etc.)
 *   into UserPurchase items for UI presentation
 */
export function subscribeToUserPurchases(
  uid: string,
  onPurchasesChanged: (purchases: UserPurchase[]) => void,
  onError?: (error: Error) => void
): () => void {
  const currentUid = auth.currentUser?.uid;
  const effectiveUid = (uid || currentUid || "").trim();

  if (!effectiveUid) {
    onPurchasesChanged([]);
    return () => {};
  }

  // Prevent querying another user's purchases
  if (currentUid && effectiveUid !== currentUid) {
    console.warn("Security safeguard: Cannot subscribe to purchases for another UID.");
    onPurchasesChanged([]);
    return () => {};
  }

  const purchasesQuery = query(
    ref(database, "purchases"),
    orderByChild("buyerId"),
    equalTo(effectiveUid)
  );

  return onValue(
    purchasesQuery,
    (snapshot) => {
      if (snapshot.exists()) {
        const val = snapshot.val();
        if (typeof val === "object" && val !== null) {
          const rawEntries = Object.entries(val);
          const authedUid = (auth.currentUser?.uid || effectiveUid).trim();

          // Runtime audit logging for development
          if (process.env.NODE_ENV !== "production" || (import.meta as any).env?.DEV) {
            console.log("[Purchases Runtime Audit] auth.currentUser.uid:", authedUid);
            console.log("[Purchases Runtime Audit] records returned from Firebase:", rawEntries.length);
          }

          const verifiedList: UserPurchase[] = [];

          for (const [key, rawItem] of rawEntries) {
            const item = rawItem as any;
            if (!item) continue;

            const recordBuyerId = (item.buyerId || "").trim();

            if (process.env.NODE_ENV !== "production" || (import.meta as any).env?.DEV) {
              console.log("[Purchases Runtime Audit] Purchase record:", {
                purchaseId: key,
                buyerId: item.buyerId,
                sellerId: item.sellerId,
                listingId: item.listingId,
                listingTitle: item.listingTitle || item.title,
                amountPaid: item.amountPaid,
                purchasedAt: item.purchasedAt,
              });
            }

            // Strictly verify: EVERY returned record MUST satisfy purchase.buyerId === auth.currentUser.uid
            if (recordBuyerId === authedUid) {
              verifiedList.push(mapFirebasePurchaseToUserPurchase(key, item));
            } else {
              console.warn(`[Purchases Sync] Discarded non-matching record ${key}: buyerId (${recordBuyerId}) !== auth.currentUser (${authedUid})`);
            }
          }

          // Sort newest purchase first
          verifiedList.sort((a, b) => {
            const timeA = (val[a.purchaseId || ""]?.purchasedAt) || 0;
            const timeB = (val[b.purchaseId || ""]?.purchasedAt) || 0;
            return timeB - timeA;
          });

          onPurchasesChanged(verifiedList);
          return;
        }
      }
      onPurchasesChanged([]);
    },
    (err) => {
      let friendlyError = err.message;
      if (err.message?.includes("PERMISSION_DENIED")) {
        friendlyError = "Purchase history requires authenticated access on /purchases.";
      }
      console.warn("Realtime purchases sync notice:", friendlyError);
      if (onError) onError(err);
      onPurchasesChanged([]);
    }
  );
}

/**
 * Reads purchase records from the authoritative top-level node: /purchases
 * Filtered by buyerId matching the authenticated UID.
 * Maps authoritative Firebase schema into UserPurchase[] models.
 */
export async function fetchUserPurchasesFromFirebase(uid: string): Promise<{ data: UserPurchase[] | null; error?: string }> {
  try {
    const currentUid = auth.currentUser?.uid;
    const effectiveUid = (uid || currentUid || "").trim();

    if (!effectiveUid) {
      return { data: null, error: "Unauthorized: You can only query purchase records for your authenticated account." };
    }

    if (currentUid && effectiveUid !== currentUid) {
      return { data: null, error: "Unauthorized: Cannot query purchases for another user account." };
    }

    // Query top-level /purchases by buyerId
    const purchasesQuery = query(
      ref(database, "purchases"),
      orderByChild("buyerId"),
      equalTo(effectiveUid)
    );
    const snapshot = await get(purchasesQuery);
    if (snapshot.exists()) {
      const val = snapshot.val();
      if (typeof val === "object" && val !== null) {
        const authedUid = (auth.currentUser?.uid || effectiveUid).trim();
        const verifiedList: UserPurchase[] = Object.entries(val)
          .filter(([_, item]: [string, any]) => item && (item.buyerId || "").trim() === authedUid)
          .map(([key, item]) =>
            mapFirebasePurchaseToUserPurchase(key, item)
          );
        verifiedList.sort((a, b) => {
          const timeA = (val[a.purchaseId || ""]?.purchasedAt) || 0;
          const timeB = (val[b.purchaseId || ""]?.purchasedAt) || 0;
          return timeB - timeA;
        });
        return { data: verifiedList };
      }
    }
    return { data: [] };
  } catch (err: any) {
    let friendlyError = err.message;
    if (err.message?.includes("PERMISSION_DENIED")) {
      friendlyError = "Purchase history requires authenticated server access or indexing on /purchases.";
    }
    console.warn("Failed to fetch purchases from /purchases:", friendlyError);
    return { data: null, error: friendlyError };
  }
}

// PRODUCTION NOTE ON PURCHASES:
// Client-side direct writes to top-level /purchases are intentionally NOT provided.
// Writing verified orders, financial balances, and buyer deliverable entitlements
// must execute via a trusted backend service (e.g., payment webhook with Firebase Admin SDK).

// ==========================================
// STORAGE: AUTHORITATIVE PATHS & UPLOADS
// ==========================================

/**
 * Sanitizes a file name for safe storage path composition.
 */
function sanitizeFileName(fileName: string): string {
  return fileName.replace(/[^a-zA-Z0-9._-]/g, "_");
}

/**
 * Authoritative preview image path: previews/{listingId}/{imageName}
 */
export function buildPreviewStoragePath(listingId: string, fileName: string): string {
  return `previews/${listingId}/${sanitizeFileName(fileName)}`;
}

/**
 * Authoritative deliverable file path: files/{listingId}
 */
export function buildDeliverableStoragePath(listingId: string): string {
  return `files/${listingId}`;
}

/**
 * Uploads a preview image (publicly readable, max 10MB) to previews/{listingId}/{imageName}.
 */
export async function uploadPreviewImage(
  listingId: string,
  file: File
): Promise<{ downloadUrl?: string; error?: string }> {
  try {
    const uid = auth.currentUser?.uid;
    if (!uid) return { error: "Authentication required: Please sign in to upload preview images." };

    if (!file.type.startsWith("image/")) {
      return { error: "Invalid file type: Previews must be image files (PNG, JPEG, WebP, etc.)." };
    }

    if (file.size > 10 * 1024 * 1024) {
      return { error: "File too large: Preview images cannot exceed 10MB." };
    }

    const path = buildPreviewStoragePath(listingId, file.name);
    const sRef = storageRef(storage, path);
    await uploadBytes(sRef, file, { contentType: file.type });
    const downloadUrl = await getDownloadURL(sRef);
    return { downloadUrl };
  } catch (err: any) {
    let msg = err.message;
    if (err.message?.includes("unauthorized") || err.message?.includes("permission")) {
      msg = "Upload permission denied: Ensure you are authenticated and file matches size/type rules.";
    }
    console.warn("Preview upload failed:", msg);
    return { error: msg };
  }
}

/**
 * Uploads a seller deliverable file to files/{listingId}.
 */
export async function uploadDeliverableAsset(
  listingId: string,
  file: File
): Promise<{ success: boolean; storagePath?: string; error?: string }> {
  try {
    const uid = auth.currentUser?.uid;
    if (!uid) return { success: false, error: "Authentication required: Please sign in to upload deliverable files." };

    if (file.size > 250 * 1024 * 1024) {
      return { success: false, error: "File too large: Deliverable file cannot exceed 250MB." };
    }

    const path = buildDeliverableStoragePath(listingId);
    const sRef = storageRef(storage, path);
    await uploadBytes(sRef, file, { contentType: file.type || "application/zip" });
    return { success: true, storagePath: path };
  } catch (err: any) {
    let msg = err.message;
    if (err.message?.includes("unauthorized") || err.message?.includes("permission")) {
      msg = "Upload permission denied: Ensure you are authenticated and deliverable is under 250MB.";
    }
    console.warn("Deliverable upload failed:", msg);
    return { success: false, error: msg };
  }
}

export async function uploadFileToStorage(
  file: File | Blob, 
  storagePath: string
): Promise<{ downloadUrl?: string; error?: string }> {
  try {
    const sRef = storageRef(storage, storagePath);
    await uploadBytes(sRef, file);
    const downloadUrl = await getDownloadURL(sRef);
    return { downloadUrl };
  } catch (err: any) {
    console.warn("Failed to upload file to Firebase Storage:", err.message);
    return { error: err.message };
  }
}

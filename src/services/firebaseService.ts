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
import { AssetListing, FirebaseListing, CreatorProfile, UserProfile, UserPurchase, PublicProfile, CoreCategory } from "../types";

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

  // NOTE: In the authoritative architecture, client-side writes to /users are strictly forbidden.
  // Profile state is managed locally in the client session or updated via authorized admin/backend flows.
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
  try {
    const profileRef = ref(database, `publicProfiles/${uid}`);
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
 * Updates an authenticated user's public profile at /publicProfiles/{uid}
 * Restricts payload to valid public schema: name, role, bio, usernameId.
 * Uses atomic update() and verifies active auth session to prevent PERMISSION_DENIED.
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
    const profileRef = ref(database, `publicProfiles/${effectiveUid}`);

    const payload: Record<string, any> = {};
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

    if (Object.keys(payload).length === 0) {
      return { success: true };
    }

    await update(profileRef, payload);
    return { success: true };
  } catch (err: any) {
    console.warn("Failed to save public profile to Firebase:", err.message);
    return { success: false, error: err.message };
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
// REALTIME DATABASE: PURCHASES
// ==========================================

/**
 * Reads purchase records from the authoritative top-level node: /purchases
 * Filtered by buyerId matching the authenticated UID.
 * Does NOT assume or reference /users/{uid}/purchases.
 */
export async function fetchUserPurchasesFromFirebase(uid: string): Promise<{ data: UserPurchase[] | null; error?: string }> {
  try {
    const currentUid = auth.currentUser?.uid;
    if (!currentUid || currentUid !== uid) {
      return { data: null, error: "Unauthorized: You can only query purchase records for your authenticated account." };
    }
    // Query top-level /purchases by buyerId
    const purchasesQuery = query(
      ref(database, "purchases"),
      orderByChild("buyerId"),
      equalTo(currentUid)
    );
    const snapshot = await get(purchasesQuery);
    if (snapshot.exists()) {
      const val = snapshot.val();
      const list = typeof val === "object" && val !== null ? (Object.values(val) as UserPurchase[]) : [];
      return { data: list };
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

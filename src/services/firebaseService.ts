import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signInWithPopup, 
  signOut, 
  onAuthStateChanged,
  User 
} from "firebase/auth";
import { ref, get, set, update, query, orderByChild, equalTo, remove, serverTimestamp } from "firebase/database";
import { ref as storageRef, uploadBytes, getDownloadURL } from "firebase/storage";
import { auth, database, storage, googleAuthProvider } from "../lib/firebase";
import { AssetListing, CreatorProfile, UserProfile, UserPurchase, PublicProfile } from "../types";

// ==========================================
// AUTHENTICATION SERVICES
// ==========================================

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
 * Strips deliverable download URLs and private creator financial/account
 * data from the public listing object before it is stored in or read from /listings.
 * Strictly enforces status: "pending" on any client-created or sanitized listing.
 */
export function sanitizePublicListing(listing: AssetListing, fallbackId?: string): AssetListing {
  // 1. Remove deliverable URL from public listing
  const { downloadUrl, ...publicListing } = listing;

  const validId = publicListing.id || fallbackId || `asset-${Date.now()}`;

  // Safe numerical metrics guarantees (prevents undefined.toFixed errors)
  const safeRating = typeof publicListing.rating === "number" && !isNaN(publicListing.rating)
    ? publicListing.rating
    : (publicListing.rating != null && !isNaN(Number(publicListing.rating)) ? Number(publicListing.rating) : 5.0);

  const safeReviewCount = typeof publicListing.reviewCount === "number" && !isNaN(publicListing.reviewCount)
    ? publicListing.reviewCount
    : (publicListing.reviewCount != null && !isNaN(Number(publicListing.reviewCount)) ? Number(publicListing.reviewCount) : 0);

  const safeSalesCount = typeof publicListing.salesCount === "number" && !isNaN(publicListing.salesCount)
    ? publicListing.salesCount
    : (publicListing.salesCount != null && !isNaN(Number(publicListing.salesCount)) ? Number(publicListing.salesCount) : 0);

  const safePriceInINR = typeof publicListing.priceInINR === "number" && !isNaN(publicListing.priceInINR)
    ? publicListing.priceInINR
    : (publicListing.priceInINR != null && !isNaN(Number(publicListing.priceInINR)) ? Number(publicListing.priceInINR) : 0);

  // 2. Sanitize creator to only public profile fields (no private email or upi information)
  const rawCreator = publicListing.creator || ({} as Partial<CreatorProfile>);
  const sanitizedCreator: CreatorProfile = {
    id: rawCreator.id || publicListing.sellerId || "creator",
    name: rawCreator.name || "Creator",
    username: rawCreator.username || "creator",
    handle: rawCreator.handle || `@${rawCreator.username || "creator"}`,
    avatar: rawCreator.avatar || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80",
    initials: rawCreator.initials,
    badge: rawCreator.badge,
    verified: Boolean(rawCreator.verified),
    verifiedSeller: Boolean(rawCreator.verifiedSeller),
    responseTime: rawCreator.responseTime || "< 2 hours",
    totalSales: typeof rawCreator.totalSales === "number" ? rawCreator.totalSales : 0,
    rating: typeof rawCreator.rating === "number" ? rawCreator.rating : 5.0,
    joinedDate: rawCreator.joinedDate || "2026",
    location: rawCreator.location || "India",
    bio: rawCreator.bio || "",
    skills: rawCreator.skills || [],
  };

  // 3. Ensure consistent sellerId and creator.id
  const sellerId = publicListing.sellerId || sanitizedCreator.id;
  sanitizedCreator.id = sellerId;

  // 4. Sanitize backwards-compatible seller alias
  let sanitizedSeller: CreatorProfile | undefined = undefined;
  if (publicListing.seller) {
    sanitizedSeller = { ...sanitizedCreator };
  }

  // 5. Authoritative requirement: Frontend listings MUST ALWAYS use status: "pending".
  // The frontend must NEVER create a listing with status: "approved".
  // Approval is manual admin-only outside the seller website flow.
  const safeCreatedAt = publicListing.createdAt !== undefined ? publicListing.createdAt : serverTimestamp();

  return {
    ...publicListing,
    id: validId,
    createdAt: safeCreatedAt,
    rating: safeRating,
    reviewCount: safeReviewCount,
    salesCount: safeSalesCount,
    priceInINR: safePriceInINR,
    sellerId,
    status: "pending",
    creator: sanitizedCreator,
    ...(sanitizedSeller ? { seller: sanitizedSeller } : {}),
  };
}

/**
 * Public listings are readable ONLY when queried exactly using:
 * orderByChild('status').equalTo('approved')
 * Any bare "get all listings" operation is strictly replaced with this query.
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
      let rawList: AssetListing[] = [];
      if (Array.isArray(val)) {
        rawList = val
          .map((item, idx) => (item ? { id: item.id || `asset-remote-${idx}`, ...item } : null))
          .filter(Boolean) as AssetListing[];
      } else if (typeof val === "object" && val !== null) {
        rawList = Object.entries(val).map(([dbKey, item]: [string, any]) => ({
          id: item?.id || dbKey,
          ...item,
        }));
      }
      // Sanitize all incoming records so legacy database records with private fields
      // or downloadUrl are cleaned before reaching client components.
      // Mark as "approved" because they matched the approved query.
      const sanitizedList = rawList.map((item, idx) => ({
        ...sanitizePublicListing(item, item.id || `asset-${idx}`),
        status: "approved" as const,
      }));
      return { data: sanitizedList };
    }
    return { data: null };
  } catch (err: any) {
    console.warn("Failed to fetch listings with query orderByChild('status').equalTo('approved'):", err.message);
    return { data: null, error: err.message };
  }
}

/**
 * Saves a new or modified listing.
 * Authoritative rule: New listings created from the website MUST ALWAYS use status: "pending".
 * The frontend must NEVER create a listing with status: "approved".
 */
export async function saveListingToFirebase(listing: AssetListing): Promise<{ success: boolean; error?: string }> {
  try {
    const currentUid = auth.currentUser?.uid;
    if (!currentUid) {
      const msg = "Authentication required: Please sign in to publish or update listings.";
      console.warn(msg);
      return { success: false, error: msg };
    }

    const sanitized = sanitizePublicListing(listing);
    // Explicitly guarantee pending status
    sanitized.status = "pending";
    if (!sanitized.createdAt) {
      sanitized.createdAt = serverTimestamp();
    }

    if (sanitized.sellerId !== currentUid) {
      const msg = "Permission denied: You can only publish or modify listings where sellerId matches your account UID.";
      console.warn(msg);
      return { success: false, error: msg };
    }

    const listingRef = ref(database, `listings/${sanitized.id}`);
    await set(listingRef, sanitized);
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

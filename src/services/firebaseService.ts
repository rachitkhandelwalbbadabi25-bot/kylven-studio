import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signInWithPopup, 
  signOut, 
  onAuthStateChanged,
  User 
} from "firebase/auth";
import { ref, get, set, update, onValue, off } from "firebase/database";
import { ref as storageRef, uploadBytes, getDownloadURL } from "firebase/storage";
import { auth, database, storage, googleAuthProvider } from "../lib/firebase";
import { AssetListing, CreatorProfile, UserProfile, UserPurchase } from "../types";

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

  // Persist user profile to Realtime Database
  try {
    const userDbRef = ref(database, `users/${user.uid}`);
    await set(userDbRef, profile);
  } catch (err) {
    console.warn("Could not write profile to Firebase RTDB (check Security Rules):", err);
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
 * Strips deliverable download URLs and private creator financial/account
 * data from the public listing object before it is stored in or read from /listings.
 */
export function sanitizePublicListing(listing: AssetListing): AssetListing {
  // 1. Remove deliverable URL from public listing
  const { downloadUrl, ...publicListing } = listing;

  // 2. Sanitize creator to only public profile fields
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
    rating: typeof rawCreator.rating === "number" ? rawCreator.rating : 0,
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

  return {
    ...publicListing,
    sellerId,
    creator: sanitizedCreator,
    ...(sanitizedSeller ? { seller: sanitizedSeller } : {}),
  };
}

export async function fetchListingsFromFirebase(): Promise<{ data: AssetListing[] | null; error?: string }> {
  try {
    const listingsRef = ref(database, "listings");
    const snapshot = await get(listingsRef);
    if (snapshot.exists()) {
      const val = snapshot.val();
      let rawList: AssetListing[] = [];
      if (Array.isArray(val)) {
        rawList = val.filter(Boolean);
      } else if (typeof val === "object" && val !== null) {
        rawList = Object.values(val);
      }
      // Sanitize all incoming records so legacy database records with private fields
      // or downloadUrl are cleaned before reaching client components
      const sanitizedList = rawList.map(sanitizePublicListing);
      return { data: sanitizedList };
    }
    return { data: null };
  } catch (err: any) {
    console.warn("Failed to fetch listings from Firebase Realtime Database:", err.message);
    return { data: null, error: err.message };
  }
}

export async function saveListingToFirebase(listing: AssetListing): Promise<{ success: boolean; error?: string }> {
  try {
    const currentUid = auth.currentUser?.uid;
    if (!currentUid) {
      const msg = "Authentication required: Please sign in to publish or update listings.";
      console.warn(msg);
      return { success: false, error: msg };
    }

    const sanitized = sanitizePublicListing(listing);
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
// REALTIME DATABASE: USER PROFILE & PURCHASES
// ==========================================

export async function fetchUserProfileFromFirebase(uid: string): Promise<UserProfile | null> {
  try {
    if (!auth.currentUser || auth.currentUser.uid !== uid) {
      console.warn("User profile read denied: Authenticated UID must match the requested profile.");
      return null;
    }
    const userRef = ref(database, `users/${uid}`);
    const snapshot = await get(userRef);
    if (snapshot.exists()) {
      return snapshot.val() as UserProfile;
    }
    return null;
  } catch (err: any) {
    console.warn("Failed to fetch user profile from Firebase:", err.message);
    return null;
  }
}

export async function saveUserProfileToFirebase(uid: string, profile: Partial<UserProfile>): Promise<boolean> {
  try {
    if (!auth.currentUser || auth.currentUser.uid !== uid) {
      console.warn("User profile update denied: Authenticated UID must match the target profile.");
      return false;
    }
    const userRef = ref(database, `users/${uid}`);
    await update(userRef, profile);
    return true;
  } catch (err: any) {
    console.warn("Failed to update user profile in Firebase:", err.message);
    return false;
  }
}

/**
 * Reads an authenticated user's private purchase records from /users/{uid}/purchases.
 * Allowed by security rules because auth.uid === $uid.
 */
export async function fetchUserPurchasesFromFirebase(uid: string): Promise<{ data: UserPurchase[] | null; error?: string }> {
  try {
    if (!auth.currentUser || auth.currentUser.uid !== uid) {
      return { data: null, error: "Unauthorized: You can only view your own purchase records." };
    }
    const purchasesRef = ref(database, `users/${uid}/purchases`);
    const snapshot = await get(purchasesRef);
    if (snapshot.exists()) {
      const val = snapshot.val();
      const list = typeof val === "object" && val !== null ? (Object.values(val) as UserPurchase[]) : [];
      return { data: list };
    }
    return { data: [] };
  } catch (err: any) {
    let friendlyError = err.message;
    if (err.message?.includes("PERMISSION_DENIED")) {
      friendlyError = "Permission denied: Unable to access purchase history for this user.";
    }
    console.warn("Failed to fetch purchases from Firebase:", friendlyError);
    return { data: null, error: friendlyError };
  }
}

// PRODUCTION NOTE ON PURCHASES:
// Client-side writes to /users/{uid}/purchases are intentionally NOT provided.
// Security rules enforce `.write = false` on /users/{uid}/purchases because purchase creation,
// financial accounting, and delivery issuance must execute via trusted backend webhooks
// (e.g. Razorpay/Stripe webhook -> Firebase Admin SDK).

// ==========================================
// STORAGE: VALIDATED UPLOADS & PATH HELPERS
// ==========================================

/**
 * Sanitizes a file name for safe storage path composition.
 */
function sanitizeFileName(fileName: string): string {
  return fileName.replace(/[^a-zA-Z0-9._-]/g, "_");
}

/**
 * Builds preview image path: /previews/{userId}/{listingId}/{fileName}
 * Requires authenticated user.
 */
export function buildPreviewStoragePath(listingId: string, fileName: string): string {
  const uid = auth.currentUser?.uid;
  if (!uid) throw new Error("Authentication required to construct preview storage path.");
  return `previews/${uid}/${listingId}/${sanitizeFileName(fileName)}`;
}

/**
 * Builds user avatar path: /avatars/{userId}/{fileName}
 * Requires authenticated user.
 */
export function buildAvatarStoragePath(fileName: string): string {
  const uid = auth.currentUser?.uid;
  if (!uid) throw new Error("Authentication required to construct avatar storage path.");
  return `avatars/${uid}/${sanitizeFileName(fileName)}`;
}

/**
 * Builds deliverable asset archive path: /assets/{userId}/{listingId}/{fileName}
 * Requires authenticated user.
 * 
 * IMPORTANT ARCHITECTURAL LIMITATION:
 * While this enforces that userId matches the authenticated UID, Firebase Storage rules
 * cannot query Realtime Database to verify that auth.uid actually owns the given listingId.
 * Full listing-to-deliverable verification requires server-side validation.
 */
export function buildAssetDeliverableStoragePath(listingId: string, fileName: string): string {
  const uid = auth.currentUser?.uid;
  if (!uid) throw new Error("Authentication required to construct deliverable storage path.");
  return `assets/${uid}/${listingId}/${sanitizeFileName(fileName)}`;
}

/**
 * Uploads a preview image (publicly readable, max 10MB).
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
      msg = "Upload permission denied: Ensure you are signed in and file matches size/type rules.";
    }
    console.warn("Preview upload failed:", msg);
    return { error: msg };
  }
}

/**
 * Uploads a creator avatar (publicly readable, max 5MB).
 */
export async function uploadAvatarImage(
  file: File
): Promise<{ downloadUrl?: string; error?: string }> {
  try {
    const uid = auth.currentUser?.uid;
    if (!uid) return { error: "Authentication required: Please sign in to upload an avatar." };

    if (!file.type.startsWith("image/")) {
      return { error: "Invalid file type: Avatars must be image files." };
    }

    if (file.size > 5 * 1024 * 1024) {
      return { error: "File too large: Avatar images cannot exceed 5MB." };
    }

    const path = buildAvatarStoragePath(file.name);
    const sRef = storageRef(storage, path);
    await uploadBytes(sRef, file, { contentType: file.type });
    const downloadUrl = await getDownloadURL(sRef);
    return { downloadUrl };
  } catch (err: any) {
    let msg = err.message;
    if (err.message?.includes("unauthorized") || err.message?.includes("permission")) {
      msg = "Upload permission denied: Ensure you are signed in and avatar is under 5MB.";
    }
    console.warn("Avatar upload failed:", msg);
    return { error: msg };
  }
}

/**
 * Uploads a seller deliverable archive (private, max 250MB).
 * Note: Does NOT attempt getDownloadURL because /assets/{userId}/... has read: false for clients.
 */
export async function uploadDeliverableAsset(
  listingId: string,
  file: File
): Promise<{ success: boolean; storagePath?: string; error?: string }> {
  try {
    const uid = auth.currentUser?.uid;
    if (!uid) return { success: false, error: "Authentication required: Please sign in to upload asset packages." };

    if (file.size > 250 * 1024 * 1024) {
      return { success: false, error: "File too large: Asset deliverable cannot exceed 250MB." };
    }

    const path = buildAssetDeliverableStoragePath(listingId, file.name);
    const sRef = storageRef(storage, path);
    await uploadBytes(sRef, file, { contentType: file.type || "application/zip" });
    // In secure production rules, client reads to /assets/ are denied.
    // Download access is provided solely through server-side signed URLs upon purchase verification.
    return { success: true, storagePath: path };
  } catch (err: any) {
    let msg = err.message;
    if (err.message?.includes("unauthorized") || err.message?.includes("permission")) {
      msg = "Upload permission denied: Ensure you are signed in and deliverable is under 250MB.";
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

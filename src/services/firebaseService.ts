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
import { AssetListing, UserProfile, UserPurchase } from "../types";

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

export async function fetchListingsFromFirebase(): Promise<{ data: AssetListing[] | null; error?: string }> {
  try {
    const listingsRef = ref(database, "listings");
    const snapshot = await get(listingsRef);
    if (snapshot.exists()) {
      const val = snapshot.val();
      if (Array.isArray(val)) {
        return { data: val.filter(Boolean) };
      }
      if (typeof val === "object" && val !== null) {
        return { data: Object.values(val) };
      }
    }
    return { data: null };
  } catch (err: any) {
    console.warn("Failed to fetch listings from Firebase Realtime Database:", err.message);
    return { data: null, error: err.message };
  }
}

export async function saveListingToFirebase(listing: AssetListing): Promise<{ success: boolean; error?: string }> {
  try {
    const listingRef = ref(database, `listings/${listing.id}`);
    await set(listingRef, listing);
    return { success: true };
  } catch (err: any) {
    console.warn("Failed to save listing to Firebase Realtime Database:", err.message);
    return { success: false, error: err.message };
  }
}

// ==========================================
// REALTIME DATABASE: USER PROFILE
// ==========================================

export async function fetchUserProfileFromFirebase(uid: string): Promise<UserProfile | null> {
  try {
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
    const userRef = ref(database, `users/${uid}`);
    await update(userRef, profile);
    return true;
  } catch (err: any) {
    console.warn("Failed to update user profile in Firebase:", err.message);
    return false;
  }
}

// ==========================================
// STORAGE: FILE UPLOAD
// ==========================================

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

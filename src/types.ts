export type CoreCategory =
  | "Software & Development"
  | "AI, ML & Data Science"
  | "AI/ML & Data Science"
  | "UI/UX & Design"
  | "3D & CAD"
  | "Video, Motion & Audio"
  | "Video/Motion & Audio"
  | "Productivity & Business"
  | "Other (Digital Planners, Embroidery Files, Lightroom Presets, eBooks/Guides)"
  | "Other";

export interface CreatorProfile {
  id: string;
  name: string;
  username: string; // e.g. "aarav_ui"
  handle?: string; // e.g. "@aarav_ui"
  avatar: string;
  initials?: string;
  badge?: string; // e.g. "Top Seller", "Verified Studio", "AI Specialist"
  verified?: boolean;
  verifiedSeller?: boolean;
  responseTime: string; // e.g. "< 1 hour"
  totalSales: number;
  rating: number;
  joinedDate: string;
  location: string;
  bio?: string;
  email?: string;
  upiVpa?: string;
  skills?: string[];
}

// Alias for backwards compatibility
export type SellerInfo = CreatorProfile;

export interface ReviewItem {
  id: string;
  userName: string;
  userAvatar: string;
  rating: number;
  date: string;
  comment: string;
  verifiedPurchase: boolean;
}

export type ReviewStatus = "Verified & Approved" | "In Review" | "Community Certified" | string;
export type ListingStatus = "approved" | "pending" | "rejected" | string;
export type LicenseType = "Standard Commercial License" | "Extended Commercial License" | "MIT Open License" | "Commercial License" | "Personal Use Only" | "Extended Enterprise" | string;
export type DeliveryType = "Instant ZIP Download" | "Direct Cloud Access" | "GitHub Repository Access" | string;

export interface AssetListing {
  id: string;
  sellerId?: string; // Authenticated owner UID for Firebase security rules
  title: string;
  slug: string;
  status?: ListingStatus; // Live Firebase schema: 'approved' | 'pending'
  creator: CreatorProfile;
  seller?: CreatorProfile; // backward compatibility
  category: CoreCategory;
  subcategory: string;
  tags: string[];
  fileType: string; // e.g. ".fig", ".dart", ".ipynb", ".blend", ".notion"
  fileFormatTags: string[]; // e.g. ['.fig', '.zip', '.svg']
  fileSizeBytes: string; // e.g. "84 MB"
  previewImages: string[];
  thumbnailUrl: string;
  shortDescription: string;
  fullDescription: string;
  description?: string; // backward compatibility
  priceInINR: number; // Listed base price in INR
  rating: number;
  reviewCount: number;
  salesCount: number;
  reviewStatus: ReviewStatus;
  softwareCompatibility: string[];
  compatibleWith?: string[]; // backward compatibility
  licenseType: LicenseType;
  deliveryType: DeliveryType;
  createdAt: string | number | object;
  updatedAt?: string;
  featured?: boolean;
  isNew?: boolean;
  detailedFeatures: string[];
  reviewList?: ReviewItem[];
  downloadUrl?: string; // Legacy/backward compatibility. Public listings must NOT expose deliverable URLs.
}

export interface PricingBreakdown {
  listedPriceINR: number;
  platformFeeINR: number; // 12.5% platform + payment fee
  buyerTotalINR: number; // listedPriceINR + platformFeeINR
  sellerNetINR: number; // 87.5% payout to seller
  sellerSplitPercent: number; // 87.5%
  platformFeePercent: number; // 12.5%
}

/**
 * Single source of truth for pricing across the entire Kreate Studio marketplace.
 * - Platform + payment fee: 12.5% (paid for UPI gateways, CDN bandwidth, malware scans, lifetime updates)
 * - Seller net payout: 87.5% of listed price guaranteed
 */
export function calculatePricing(priceInINR: number): PricingBreakdown {
  const listedPriceINR = Math.max(0, Math.round(Number(priceInINR) || 0));
  const platformFeeINR = Math.round(listedPriceINR * 0.125);
  const buyerTotalINR = listedPriceINR + platformFeeINR;
  const sellerNetINR = Math.round(listedPriceINR * 0.875);

  return {
    listedPriceINR,
    platformFeeINR,
    buyerTotalINR,
    sellerNetINR,
    sellerSplitPercent: 87.5,
    platformFeePercent: 12.5,
  };
}

export interface UserPurchase {
  orderId: string;
  purchaseId?: string; // Top-level /purchases/{purchaseId} key
  buyerId?: string;
  sellerId?: string;
  listingId: string;
  title: string;
  thumbnailUrl: string;
  category: string;
  fileType: string;
  downloadUrl: string;
  licenseKey: string;
  purchaseDate: string;
  pricePaidINR: number;
  amountPaid?: number;
  sellerNetINR: number;
  platformFeeINR: number;
  paymentMethod: string;
}

/**
 * Authoritative Public Profile schema stored at /publicProfiles/{uid}
 * Intentionally public fields only.
 */
export interface PublicProfile {
  name: string;
  role: string;
  bio: string;
  usernameId: string;
}

export interface SalesRecord {
  id: string;
  orderId: string;
  assetId?: string;
  assetTitle: string;
  buyerName: string;
  buyerEmail?: string;
  buyerLocation: string;
  listedPriceINR: number;
  platformFeeINR: number;
  totalPaidINR: number;
  sellerEarningsINR: number;
  paymentMethod: "UPI (GPay)" | "UPI (PhonePe)" | "UPI (Paytm)" | "BHIM UPI" | "Credit Card" | "NetBanking" | string;
  date: string;
  status: "Completed" | "Pending Review" | "Payout Processing" | string;
}

export interface SellerStats {
  totalEarnedINR: number;
  pendingPayoutINR: number;
  totalSalesCount: number;
  activeListingsCount: number;
  averageRating: number;
}

export type UserRole = "buyer" | "seller" | "both" | "creator";

export interface UserProfile {
  name: string;
  username?: string;
  email: string;
  upiId?: string;
  role: UserRole;
  avatar?: string;
  bio?: string;
  location?: string;
  joinedDate?: string;
  hasCompletedOnboarding?: boolean;
}

export interface FilterOptions {
  category: CoreCategory | "All";
  searchQuery: string;
  fileFormat: string;
  tag: string;
  minPrice: number;
  maxPrice: number;
  sortBy: "popular" | "newest" | "price-asc" | "price-desc";
}

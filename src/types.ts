export type CoreCategory =
  | "Software & Development"
  | "AI/ML & Data Science"
  | "UI/UX & Design"
  | "3D & CAD"
  | "Video/Motion & Audio"
  | "Productivity & Business";

export interface SellerInfo {
  id: string;
  name: string;
  handle: string;
  avatar: string;
  badge: string; // e.g. "Pro Creator", "Top Seller", "Verified Studio"
  verified: boolean;
  responseTime: string; // e.g. "< 2 hours"
  totalSales: number;
  rating: number;
  joinedDate: string;
  location: string;
}

export interface ReviewItem {
  id: string;
  userName: string;
  userAvatar: string;
  rating: number;
  date: string;
  comment: string;
  verifiedPurchase: boolean;
}

export interface AssetListing {
  id: string;
  title: string;
  category: CoreCategory;
  subcategory: string;
  description: string;
  detailedFeatures: string[];
  priceInINR: number; // Listed price
  rating: number;
  reviewCount: number;
  salesCount: number;
  fileFormatTags: string[]; // e.g. ['.fig', '.zip', '.svg']
  fileSizeBytes: string; // e.g. "124 MB"
  previewImages: string[];
  thumbnailUrl: string;
  seller: SellerInfo;
  featured?: boolean;
  isNew?: boolean;
  reviewList: ReviewItem[];
  createdAt: string;
  licenseType: "Commercial License" | "Personal Use Only";
  compatibleWith: string[]; // e.g. ["Figma", "VS Code", "Jupyter", "Flutter 3.x"]
  downloadUrl?: string;
}

export interface SalesRecord {
  id: string;
  orderId: string;
  assetTitle: string;
  buyerName: string;
  buyerLocation: string;
  listedPriceINR: number;
  platformFeeINR: number; // 12.5% paid by buyer
  totalPaidINR: number; // listedPrice + 12.5%
  sellerEarningsINR: number; // 90% of listed price
  paymentMethod: "UPI (GPay)" | "UPI (PhonePe)" | "UPI (Paytm)" | "Credit Card" | "NetBanking";
  date: string;
  status: "Completed" | "Pending Review" | "Payout Processing";
}

export interface SellerStats {
  totalEarnedINR: number;
  pendingPayoutINR: number;
  totalSalesCount: number;
  activeListingsCount: number;
  averageRating: number;
}

export type UserRole = "buyer" | "seller";

export interface UserProfile {
  name: string;
  email: string;
  upiId: string;
  role: UserRole;
  avatar: string;
  joinedDate: string;
  hasCompletedOnboarding: boolean;
}

export type PageView =
  | "home"
  | "browse"
  | "listing-detail"
  | "seller-dashboard"
  | "purchases"
  | "saved";

export interface FilterOptions {
  category: CoreCategory | "All";
  searchQuery: string;
  fileFormat: string;
  minPrice: number;
  maxPrice: number;
  sortBy: "popular" | "newest" | "price-asc" | "price-desc";
}

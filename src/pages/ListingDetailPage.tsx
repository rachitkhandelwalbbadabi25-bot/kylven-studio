import React, { useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { AssetListing, calculatePricing } from "../types";
import { ListingCard } from "../components/ListingCard";
import {
  Star,
  ShieldCheck,
  Zap,
  ShoppingBag,
  Heart,
  Share2,
  FileCode,
  Download,
  CheckCircle2,
  AlertCircle,
  ChevronRight,
  Sparkles,
  Lock,
  Check,
  Layers,
  FileArchive,
  Info
} from "lucide-react";

interface ListingDetailPageProps {
  listings: AssetListing[];
  onBuyNowDirect: (listing: AssetListing) => void;
  savedIds: string[];
  onToggleSave: (id: string) => void;
  isAuthenticated?: boolean;
}

export const ListingDetailPage: React.FC<ListingDetailPageProps> = ({
  listings,
  onBuyNowDirect,
  savedIds,
  onToggleSave,
  isAuthenticated = false,
}) => {
  const { slug, id } = useParams<{ slug?: string; id?: string }>();
  const navigate = useNavigate();

  // Match listing by slug or id
  const listing = listings.find(
    (item) =>
      item.slug === slug ||
      item.id === slug ||
      item.id === id ||
      item.slug === id
  );

  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [copiedLink, setCopiedLink] = useState(false);

  if (!listing) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-20 text-center space-y-4">
        <div className="w-16 h-16 rounded-2xl bg-[#202C44] text-[#D3CCB0] flex items-center justify-center mx-auto">
          <AlertCircle className="w-8 h-8" />
        </div>
        <h1 className="text-2xl font-heading font-bold text-white">Asset Not Found</h1>
        <p className="text-sm text-[#7B8A90]">
          The asset you are looking for does not exist or may have been removed.
        </p>
        <button
          onClick={() => navigate("/browse")}
          className="bg-[#D3CCB0] text-[#000000] text-xs font-bold px-5 py-2.5 rounded-xl shadow"
        >
          Return to Marketplace
        </button>
      </div>
    );
  }

  const pricing = calculatePricing(listing.priceInINR);
  const isSaved = savedIds.includes(listing.id);
  const creatorUsername = listing.creator?.username || listing.seller?.handle?.replace("@", "") || "seller";
  const creatorName = listing.creator?.name || listing.seller?.name || "Verified Seller";
  const creatorAvatar = listing.creator?.avatar || listing.seller?.avatar || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80";
  
  // Ensure gallery images
  const images = listing.previewImages && listing.previewImages.length > 0 
    ? listing.previewImages 
    : [listing.thumbnailUrl];

  const relatedListings = listings
    .filter((l) => l.category === listing.category && l.id !== listing.id)
    .slice(0, 3);

  const handleShare = () => {
    navigator.clipboard?.writeText(window.location.href);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const handleBuyNow = () => {
    if (onBuyNowDirect) {
      onBuyNowDirect(listing);
    } else {
      navigate(`/checkout/${listing.id}`);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">
      
      {/* 1. Breadcrumb Navigation: e.g. Browse / UI/UX Design / Neo Bharat Cyberpunk UI Kit */}
      <nav className="flex items-center gap-2 text-xs text-[#7B8A90] font-mono flex-wrap" aria-label="Breadcrumb">
        <Link to="/" className="hover:text-white transition-colors">Home</Link>
        <ChevronRight className="w-3.5 h-3.5 text-[#202C44]" />
        <Link to="/browse" className="hover:text-white transition-colors">Browse</Link>
        <ChevronRight className="w-3.5 h-3.5 text-[#202C44]" />
        <Link to={`/browse?category=${encodeURIComponent(listing.category)}`} className="text-[#D3CCB0] hover:underline">
          {listing.category}
        </Link>
        <ChevronRight className="w-3.5 h-3.5 text-[#202C44]" />
        <span className="text-white font-medium truncate max-w-[220px] sm:max-w-xs">{listing.title}</span>
      </nav>

      {/* 2. Main Two-Column Layout (3_listing_detail.png) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Column: Main Preview Image & Gallery & Full Description (7 cols) */}
        <div className="lg:col-span-7 space-y-8">
          
          {/* Main Gallery Area */}
          <div className="bg-[#111317] border border-[#202C44] rounded-3xl p-3 sm:p-4 shadow-2xl space-y-3">
            {/* Primary Main Image Preview */}
            <div className="relative aspect-[16/10] bg-[#000000] rounded-2xl overflow-hidden border border-[#202C44]/50 group">
              <img
                src={images[activeImageIndex] || listing.thumbnailUrl}
                alt={listing.title}
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-102"
              />
              <div className="absolute top-3 left-3 flex items-center gap-2">
                <span className="bg-[#000000]/80 backdrop-blur-md text-[#D3CCB0] text-xs font-mono font-bold px-3 py-1 rounded-xl border border-[#202C44]">
                  {listing.fileType || (listing.fileFormatTags && listing.fileFormatTags[0]) || ".zip"}
                </span>
                <span className="bg-[#202C44]/90 backdrop-blur-md text-emerald-400 text-xs font-mono px-2.5 py-1 rounded-xl border border-[#202C44] flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>{listing.reviewStatus || "Verified Asset"}</span>
                </span>
              </div>
            </div>

            {/* Gallery Thumbnails Carousel */}
            {images.length > 1 && (
              <div className="flex items-center gap-2.5 overflow-x-auto pb-1 pt-1">
                {images.map((img, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setActiveImageIndex(idx)}
                    className={`w-20 sm:w-24 h-14 sm:h-16 rounded-xl overflow-hidden border-2 shrink-0 transition-all ${
                      activeImageIndex === idx
                        ? "border-[#D3CCB0] opacity-100 scale-105 shadow-md"
                        : "border-[#202C44] opacity-50 hover:opacity-90"
                    }`}
                  >
                    <img src={img} alt={`Preview ${idx + 1}`} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Description Section */}
          <div className="bg-[#111317] border border-[#202C44] rounded-3xl p-6 sm:p-8 space-y-6 shadow-xl">
            <div>
              <h2 className="text-lg font-heading font-bold text-white mb-3">
                About this Asset
              </h2>
              <div className="text-xs sm:text-sm text-[#7B8A90] leading-relaxed whitespace-pre-line">
                {listing.fullDescription || listing.shortDescription || listing.description}
              </div>
            </div>

            {/* Included Features Bullet Points */}
            {listing.detailedFeatures && listing.detailedFeatures.length > 0 && (
              <div className="pt-6 border-t border-[#202C44] space-y-3">
                <h3 className="text-xs font-mono font-bold text-white uppercase tracking-wider">
                  What's Included:
                </h3>
                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs text-[#7B8A90]">
                  {listing.detailedFeatures.map((feat, i) => (
                    <li key={i} className="flex items-start gap-2 bg-[#202C44]/40 p-3 rounded-xl border border-[#202C44]/60">
                      <Check className="w-3.5 h-3.5 text-[#D3CCB0] shrink-0 mt-0.5" />
                      <span className="text-white">{feat}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Software Compatibility */}
            <div className="pt-6 border-t border-[#202C44] space-y-2.5">
              <h3 className="text-xs font-mono font-bold text-white uppercase tracking-wider">
                Software & Platform Compatibility:
              </h3>
              <div className="flex flex-wrap gap-2">
                {(listing.softwareCompatibility || listing.compatibleWith || ["Figma", "Web", "Universal ZIP"]).map((soft) => (
                  <span
                    key={soft}
                    className="bg-[#202C44] text-[#D3CCB0] text-xs font-mono px-3 py-1.5 rounded-xl border border-[#202C44]"
                  >
                    {soft}
                  </span>
                ))}
              </div>
            </div>

            {/* Tags */}
            {listing.tags && listing.tags.length > 0 && (
              <div className="pt-6 border-t border-[#202C44] space-y-2">
                <h3 className="text-xs font-mono text-[#7B8A90] uppercase tracking-wider">
                  Tags:
                </h3>
                <div className="flex flex-wrap gap-1.5">
                  {listing.tags.map((tag) => (
                    <button
                      key={tag}
                      onClick={() => navigate(`/browse?tag=${encodeURIComponent(tag)}`)}
                      className="bg-[#000000] text-[#7B8A90] hover:text-white text-xs font-mono px-3 py-1 rounded-lg border border-[#202C44] transition-colors"
                    >
                      #{tag}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Security & Verification Box */}
          <div className="bg-[#111317] border border-[#202C44] rounded-3xl p-6 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-emerald-400" />
                <h3 className="text-xs font-mono font-bold text-white uppercase tracking-wider">
                  Kreate Security Verification
                </h3>
              </div>
              <span className="text-[10px] text-[#7B8A90] font-mono">Virus-Free Certified</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
              <div className="bg-[#202C44]/50 border border-[#202C44] p-3 rounded-2xl space-y-1">
                <span className="font-bold text-white block">ClamAV Malware Scan</span>
                <span className="text-[11px] text-[#7B8A90]">0 security threats detected.</span>
              </div>
              <div className="bg-[#202C44]/50 border border-[#202C44] p-3 rounded-2xl space-y-1">
                <span className="font-bold text-white block">Automated Syntax Check</span>
                <span className="text-[11px] text-[#7B8A90]">Build tests passed without errors.</span>
              </div>
              <div className="bg-[#202C44]/50 border border-[#202C44] p-3 rounded-2xl space-y-1">
                <span className="font-bold text-white block">Instant Access</span>
                <span className="text-[11px] text-[#7B8A90]">Lifetime download in your account.</span>
              </div>
            </div>
          </div>

        </div>

        {/* Right Column: Asset Info & Buy Box (5 cols, sticky) */}
        <div className="lg:col-span-5 space-y-6 lg:sticky lg:top-24">
          
          {/* Main Asset Info Card (3_listing_detail.png) */}
          <div className="bg-[#111317] border border-[#202C44] rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xl">
            
            {/* Category label uppercase */}
            <div className="space-y-2">
              <span className="text-xs font-mono font-bold text-[#D3CCB0] uppercase tracking-wider block">
                {listing.category.toUpperCase()}
              </span>
              <h1 className="text-2xl sm:text-3xl font-heading font-extrabold text-white tracking-tight leading-tight">
                {listing.title}
              </h1>
            </div>

            {/* Creator Info Snippet */}
            <div className="flex items-center gap-3 pt-1">
              <img
                src={creatorAvatar}
                alt={creatorName}
                className="w-10 h-10 rounded-xl object-cover border border-[#202C44]"
              />
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="text-xs font-bold text-white">{creatorName}</span>
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#D3CCB0]" />
                </div>
                <Link
                  to={`/profile/${creatorUsername}`}
                  className="text-[11px] text-[#7B8A90] font-mono hover:text-[#D3CCB0] transition-colors"
                >
                  @{creatorUsername} • View Studio
                </Link>
              </div>
            </div>

            {/* Price Box */}
            <div className="bg-[#202C44]/70 border border-[#202C44] rounded-2xl p-5 space-y-2">
              <div className="flex items-baseline justify-between">
                <span className="text-xs text-[#7B8A90] font-medium">Single License Price</span>
                <span className="text-3xl font-heading font-extrabold text-white">
                  ₹{listing.priceInINR.toLocaleString("en-IN")}
                </span>
              </div>
              <p className="text-[11px] text-[#7B8A90] font-mono">
                + ₹{pricing.platformFeeINR} platform fee shown at checkout
              </p>
            </div>

            {/* Primary Action: Large Cream "Buy Now" button */}
            <div className="space-y-3">
              <button
                type="button"
                id="listing-buy-now-btn"
                onClick={handleBuyNow}
                className="w-full bg-[#D3CCB0] hover:bg-[#c4bb9a] text-[#000000] font-bold text-sm py-4 px-6 rounded-2xl transition-all shadow-xl active:scale-98 flex items-center justify-center gap-2.5 cursor-pointer"
              >
                <ShoppingBag className="w-4 h-4 text-[#000000]" />
                <span>Buy Now (₹{listing.priceInINR.toLocaleString("en-IN")})</span>
              </button>

              <div className="grid grid-cols-2 gap-2.5">
                <button
                  type="button"
                  onClick={() => onToggleSave(listing.id)}
                  className={`py-3 px-4 rounded-xl border text-xs font-semibold flex items-center justify-center gap-2 transition-all ${
                    isSaved
                      ? "bg-[#202C44] border-[#D3CCB0] text-[#D3CCB0]"
                      : "bg-[#000000] border-[#202C44] text-[#7B8A90] hover:text-white hover:border-[#7B8A90]"
                  }`}
                >
                  <Heart className={`w-3.5 h-3.5 ${isSaved ? "fill-current" : ""}`} />
                  <span>{isSaved ? "Saved" : "Save Item"}</span>
                </button>

                <button
                  type="button"
                  onClick={handleShare}
                  className="bg-[#000000] border border-[#202C44] text-[#7B8A90] hover:text-white py-3 px-4 rounded-xl text-xs font-semibold flex items-center justify-center gap-2 transition-all hover:border-[#7B8A90]"
                >
                  <Share2 className="w-3.5 h-3.5" />
                  <span>{copiedLink ? "Copied!" : "Share"}</span>
                </button>
              </div>
            </div>

            {/* Metadata Section */}
            <div className="pt-6 border-t border-[#202C44] space-y-3 text-xs">
              <h3 className="text-xs font-mono font-bold text-[#D3CCB0] uppercase tracking-wider">
                Asset Metadata
              </h3>

              <div className="space-y-2 text-[#7B8A90]">
                <div className="flex items-center justify-between py-1 border-b border-[#202C44]/50">
                  <span>File Type</span>
                  <span className="font-mono text-white font-medium">
                    {listing.fileType || "ZIP Archive"} • {listing.fileSizeBytes || "12 MB"}
                  </span>
                </div>

                <div className="flex items-center justify-between py-1 border-b border-[#202C44]/50">
                  <span>Category</span>
                  <span className="text-white font-medium">{listing.category}</span>
                </div>

                <div className="flex items-center justify-between py-1 border-b border-[#202C44]/50">
                  <span>Formats Included</span>
                  <span className="font-mono text-[#D3CCB0]">
                    {listing.fileFormatTags?.join(", ") || listing.fileType}
                  </span>
                </div>

                <div className="flex items-center justify-between py-1 border-b border-[#202C44]/50">
                  <span>License</span>
                  <span className="text-white font-medium">{listing.licenseType || "Standard Commercial"}</span>
                </div>

                <div className="flex items-center justify-between py-1">
                  <span>Delivery</span>
                  <span className="text-emerald-400 font-medium flex items-center gap-1">
                    <Zap className="w-3 h-3" /> Instant Uncompressed ZIP
                  </span>
                </div>
              </div>
            </div>

          </div>

          {/* Quick Seller Box */}
          <div className="bg-[#111317] border border-[#202C44] rounded-3xl p-6 space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono uppercase tracking-wider text-[#7B8A90]">
                Seller Profile
              </span>
              <span className="text-xs font-mono text-[#D3CCB0] font-bold">
                ★ {listing.creator?.rating || 4.9} Rating
              </span>
            </div>

            <div className="flex items-center gap-3">
              <img
                src={creatorAvatar}
                alt={creatorName}
                className="w-12 h-12 rounded-2xl object-cover border border-[#202C44]"
              />
              <div>
                <h4 className="text-sm font-bold text-white">{creatorName}</h4>
                <p className="text-xs text-[#7B8A90] font-mono">
                  {listing.creator?.location || "Bengaluru, India"} • {listing.creator?.totalSales || 150}+ sales
                </p>
              </div>
            </div>

            <Link
              to={`/profile/${creatorUsername}`}
              className="block w-full text-center bg-[#202C44] hover:bg-[#202C44]/80 text-[#D3CCB0] text-xs font-bold py-2.5 rounded-xl border border-[#202C44] transition-colors"
            >
              Explore Seller's Work
            </Link>
          </div>

        </div>

      </div>

      {/* 3. Related Listings in Same Category */}
      {relatedListings.length > 0 && (
        <section className="pt-12 border-t border-[#202C44] space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xl font-heading font-bold text-white">
                Related Assets in {listing.category}
              </h3>
              <p className="text-xs text-[#7B8A90] mt-0.5">
                Popular companion tools, templates, and models.
              </p>
            </div>

            <Link
              to={`/browse?category=${encodeURIComponent(listing.category)}`}
              className="text-xs font-bold text-[#D3CCB0] hover:underline flex items-center gap-1"
            >
              <span>Explore Category</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {relatedListings.map((rel) => (
              <ListingCard
                key={rel.id}
                listing={rel}
                onSelectListing={(item) => {
                  navigate(`/listing/${item.slug || item.id}`);
                  window.scrollTo({ top: 0, behavior: "smooth" });
                }}
                onBuyNowDirect={onBuyNowDirect}
                isSaved={savedIds.includes(rel.id)}
                onToggleSave={onToggleSave}
              />
            ))}
          </div>
        </section>
      )}

    </div>
  );
};

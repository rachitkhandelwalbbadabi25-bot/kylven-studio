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
  ExternalLink,
  ChevronRight,
  Layers,
  Sparkles,
  Lock,
  IndianRupee,
  Check
} from "lucide-react";

interface ListingDetailPageProps {
  listings: AssetListing[];
  onBuyNowDirect: (listing: AssetListing) => void;
  savedIds: string[];
  onToggleSave: (id: string) => void;
}

export const ListingDetailPage: React.FC<ListingDetailPageProps> = ({
  listings,
  onBuyNowDirect,
  savedIds,
  onToggleSave,
}) => {
  const { slug, id } = useParams<{ slug?: string; id?: string }>();
  const navigate = useNavigate();

  // Find listing by slug or id
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
        <h1 className="text-2xl font-heading font-bold text-white">Listing Not Found</h1>
        <p className="text-sm text-[#7B8A90]">
          The asset you are looking for does not exist or may have been updated.
        </p>
        <button
          onClick={() => navigate("/browse")}
          className="bg-[#D3CCB0] text-[#000000] text-xs font-bold px-5 py-2.5 rounded-xl shadow"
        >
          Return to Browse
        </button>
      </div>
    );
  }

  const pricing = calculatePricing(listing.priceInINR);
  const isSaved = savedIds.includes(listing.id);
  const creatorUsername = listing.creator?.username || listing.seller?.handle?.replace("@", "") || "creator";
  const creatorName = listing.creator?.name || listing.seller?.name || "Verified Creator";
  const creatorAvatar = listing.creator?.avatar || listing.seller?.avatar || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80";
  const images = listing.previewImages && listing.previewImages.length > 0 ? listing.previewImages : [listing.thumbnailUrl];

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
      
      {/* Breadcrumbs */}
      <nav className="flex items-center gap-2 text-xs text-[#7B8A90] font-mono flex-wrap">
        <Link to="/" className="hover:text-white transition-colors">Home</Link>
        <ChevronRight className="w-3.5 h-3.5" />
        <Link to="/browse" className="hover:text-white transition-colors">Browse</Link>
        <ChevronRight className="w-3.5 h-3.5" />
        <Link to={`/browse?category=${encodeURIComponent(listing.category)}`} className="hover:text-white transition-colors">
          {listing.category}
        </Link>
        <ChevronRight className="w-3.5 h-3.5" />
        <span className="text-white truncate max-w-[200px] sm:max-w-xs">{listing.title}</span>
      </nav>

      {/* Main Grid: 7 cols Left (Media & Details), 5 cols Right (Buy Box & Creator) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Column: Visual Previews & Content */}
        <div className="lg:col-span-7 space-y-8">
          
          {/* Main Gallery Stage */}
          <div className="bg-[#111317] border border-[#202C44] rounded-2xl overflow-hidden shadow-2xl space-y-3 p-3">
            <div className="relative aspect-[16/10] bg-[#202C44]/50 rounded-xl overflow-hidden">
              <img
                src={images[activeImageIndex] || listing.thumbnailUrl}
                alt={listing.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute top-3 left-3 flex items-center gap-2">
                <span className="bg-[#111317]/90 text-[#D3CCB0] text-xs font-mono font-bold px-2.5 py-1 rounded-lg border border-[#202C44]">
                  {listing.fileType || (listing.fileFormatTags && listing.fileFormatTags[0]) || ".zip"}
                </span>
                <span className="bg-[#202C44]/90 text-emerald-400 text-xs font-mono px-2.5 py-1 rounded-lg border border-[#202C44] flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" /> {listing.reviewStatus}
                </span>
              </div>
            </div>

            {/* Thumbnail Selectors */}
            {images.length > 1 && (
              <div className="flex items-center gap-2 overflow-x-auto pb-1">
                {images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveImageIndex(idx)}
                    className={`w-20 h-14 rounded-lg overflow-hidden border-2 shrink-0 transition-all ${
                      activeImageIndex === idx
                        ? "border-[#D3CCB0] opacity-100 scale-105"
                        : "border-[#202C44] opacity-60 hover:opacity-100"
                    }`}
                  >
                    <img src={img} alt={`Preview ${idx + 1}`} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Security & Integrity Verification Box */}
          <div className="bg-[#111317] border border-[#202C44] rounded-2xl p-5 space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-mono font-bold text-[#D3CCB0] uppercase tracking-wider flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>Marketplace Security & Quality Guarantee</span>
              </h3>
              <span className="text-[10px] text-[#7B8A90] font-mono">Audited Aug 2026</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
              <div className="bg-[#202C44]/60 border border-[#202C44] p-3 rounded-xl space-y-1">
                <div className="font-bold text-white flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  <span>ClamAV Malware Scan</span>
                </div>
                <p className="text-[11px] text-[#7B8A90]">
                  0 virus threats detected. Clean archive verified.
                </p>
              </div>

              <div className="bg-[#202C44]/60 border border-[#202C44] p-3 rounded-xl space-y-1">
                <div className="font-bold text-white flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Build & Syntax Test</span>
                </div>
                <p className="text-[11px] text-[#7B8A90]">
                  Tested on latest host environments with 0 runtime errors.
                </p>
              </div>

              <div className="bg-[#202C44]/60 border border-[#202C44] p-3 rounded-xl space-y-1">
                <div className="font-bold text-white flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#D3CCB0]" />
                  <span>7-Day Replacement</span>
                </div>
                <p className="text-[11px] text-[#7B8A90]">
                  Full replacement support if files fail to load or uncompress.
                </p>
              </div>
            </div>
          </div>

          {/* Description & Detailed Features */}
          <div className="bg-[#111317] border border-[#202C44] rounded-2xl p-6 space-y-6">
            <div>
              <h3 className="text-base font-heading font-bold text-white mb-3">
                Asset Overview
              </h3>
              <div className="text-xs sm:text-sm text-[#7B8A90] leading-relaxed whitespace-pre-line">
                {listing.fullDescription || listing.shortDescription || listing.description}
              </div>
            </div>

            {/* Detailed Feature List */}
            {listing.detailedFeatures && listing.detailedFeatures.length > 0 && (
              <div className="pt-4 border-t border-[#202C44] space-y-3">
                <h4 className="text-xs font-mono font-bold text-white uppercase tracking-wider">
                  Included Features & Specifications:
                </h4>
                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs text-[#7B8A90]">
                  {listing.detailedFeatures.map((feat, i) => (
                    <li key={i} className="flex items-start gap-2 bg-[#202C44]/40 p-2.5 rounded-xl border border-[#202C44]/60">
                      <Check className="w-3.5 h-3.5 text-[#D3CCB0] shrink-0 mt-0.5" />
                      <span className="text-white">{feat}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Software Compatibility Tags */}
            <div className="pt-4 border-t border-[#202C44] space-y-2">
              <h4 className="text-xs font-mono font-bold text-white uppercase tracking-wider">
                Software Compatibility:
              </h4>
              <div className="flex flex-wrap gap-2">
                {(listing.softwareCompatibility || listing.compatibleWith || []).map((soft) => (
                  <span
                    key={soft}
                    className="bg-[#202C44] text-[#D3CCB0] text-xs font-mono px-3 py-1 rounded-lg border border-[#202C44]"
                  >
                    {soft}
                  </span>
                ))}
              </div>
            </div>

            {/* Tags */}
            {listing.tags && listing.tags.length > 0 && (
              <div className="pt-4 border-t border-[#202C44] space-y-2">
                <h4 className="text-xs font-mono text-[#7B8A90] uppercase tracking-wider">
                  Tags:
                </h4>
                <div className="flex flex-wrap gap-1.5">
                  {listing.tags.map((tag) => (
                    <button
                      key={tag}
                      onClick={() => navigate(`/browse?tag=${encodeURIComponent(tag)}`)}
                      className="bg-[#000000] text-[#7B8A90] hover:text-white text-xs font-mono px-2.5 py-1 rounded-md border border-[#202C44] transition-colors"
                    >
                      #{tag}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Customer Reviews Section */}
          <div className="bg-[#111317] border border-[#202C44] rounded-2xl p-6 space-y-6">
            <div className="flex items-center justify-between border-b border-[#202C44] pb-4">
              <div>
                <h3 className="text-base font-heading font-bold text-white">
                  Verified Buyer Reviews
                </h3>
                <p className="text-xs text-[#7B8A90] mt-0.5">
                  {listing.reviewCount} customer ratings • Average {listing.rating.toFixed(1)} / 5.0
                </p>
              </div>

              <div className="flex items-center gap-1 bg-[#202C44] text-[#D3CCB0] px-3 py-1 rounded-xl border border-[#202C44] text-xs font-bold font-mono">
                <Star className="w-3.5 h-3.5 fill-current" />
                <span>{listing.rating.toFixed(1)}</span>
              </div>
            </div>

            {listing.reviewList && listing.reviewList.length > 0 ? (
              <div className="space-y-4">
                {listing.reviewList.map((rev) => (
                  <div key={rev.id} className="bg-[#202C44]/40 border border-[#202C44] p-4 rounded-xl space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2.5">
                        <img
                          src={rev.userAvatar}
                          alt={rev.userName}
                          className="w-7 h-7 rounded-full object-cover border border-[#202C44]"
                        />
                        <div>
                          <div className="text-xs font-bold text-white flex items-center gap-1.5">
                            <span>{rev.userName}</span>
                            {rev.verifiedPurchase && (
                              <span className="text-[10px] text-emerald-400 font-mono bg-emerald-950/60 px-1.5 py-0.2 rounded border border-emerald-800">
                                Verified Purchase
                              </span>
                            )}
                          </div>
                          <span className="text-[10px] text-[#7B8A90] font-mono">{rev.date}</span>
                        </div>
                      </div>

                      <div className="flex items-center text-[#D3CCB0] text-xs">
                        {Array.from({ length: rev.rating }).map((_, i) => (
                          <Star key={i} className="w-3 h-3 fill-current" />
                        ))}
                      </div>
                    </div>

                    <p className="text-xs text-[#7B8A90] leading-relaxed">
                      "{rev.comment}"
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-6 text-xs text-[#7B8A90]">
                No reviews yet. Be the first verified buyer to rate this asset!
              </div>
            )}
          </div>

        </div>

        {/* Right Column: Pricing Box & Creator Info (Sticky) */}
        <div className="lg:col-span-5 space-y-6 lg:sticky lg:top-24">
          
          {/* Main Checkout Action Card */}
          <div className="bg-[#111317] border border-[#202C44] rounded-2xl p-6 space-y-6 shadow-2xl">
            
            {/* Header info */}
            <div>
              <div className="flex items-center justify-between text-[11px] text-[#7B8A90] font-mono mb-2 uppercase">
                <span>{listing.category}</span>
                <span className="text-emerald-400 font-semibold">{listing.salesCount} purchases</span>
              </div>
              <h1 className="text-xl sm:text-2xl font-heading font-extrabold text-white leading-tight">
                {listing.title}
              </h1>
            </div>

            {/* Price Box with transparent single-source-of-truth breakdown */}
            <div className="bg-[#202C44]/80 border border-[#202C44] rounded-xl p-4 space-y-2.5">
              <div className="flex items-baseline justify-between">
                <span className="text-xs text-[#7B8A90] font-medium">Listed Asset Price</span>
                <span className="text-2xl font-heading font-extrabold text-white">
                  ₹{pricing.listedPriceINR.toLocaleString("en-IN")}
                </span>
              </div>

              <div className="flex items-center justify-between text-xs text-[#7B8A90] pt-2 border-t border-[#202C44]">
                <span>Platform Processing Fee (10%)</span>
                <span className="font-mono text-[#D3CCB0]">₹{pricing.platformFeeINR.toLocaleString("en-IN")}</span>
              </div>

              <div className="flex items-center justify-between text-sm font-bold pt-2 border-t border-[#202C44]">
                <span className="text-white">Total Amount (UPI)</span>
                <span className="font-heading font-extrabold text-[#D3CCB0] text-lg">
                  ₹{pricing.buyerTotalINR.toLocaleString("en-IN")}
                </span>
              </div>
            </div>

            {/* Buy Now & Save Actions */}
            <div className="space-y-3">
              <button
                type="button"
                onClick={handleBuyNow}
                className="w-full bg-[#D3CCB0] hover:bg-[#c4bb9a] text-[#000000] font-bold text-sm py-3.5 px-4 rounded-xl transition-all shadow-lg active:scale-98 flex items-center justify-center gap-2"
              >
                <ShoppingBag className="w-4 h-4 text-[#000000]" />
                <span>Buy Now with Instant UPI (₹{pricing.buyerTotalINR.toLocaleString("en-IN")})</span>
              </button>

              <div className="grid grid-cols-2 gap-2.5">
                <button
                  type="button"
                  onClick={() => onToggleSave(listing.id)}
                  className={`p-2.5 rounded-xl border text-xs font-semibold flex items-center justify-center gap-1.5 transition-all ${
                    isSaved
                      ? "bg-[#202C44] border-[#D3CCB0] text-[#D3CCB0]"
                      : "bg-[#000000] border-[#202C44] text-[#7B8A90] hover:text-white"
                  }`}
                >
                  <Heart className={`w-3.5 h-3.5 ${isSaved ? "fill-current" : ""}`} />
                  <span>{isSaved ? "Saved in Wishlist" : "Save Item"}</span>
                </button>

                <button
                  type="button"
                  onClick={handleShare}
                  className="bg-[#000000] border border-[#202C44] text-[#7B8A90] hover:text-white p-2.5 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-all"
                >
                  <Share2 className="w-3.5 h-3.5" />
                  <span>{copiedLink ? "Link Copied!" : "Share Asset"}</span>
                </button>
              </div>
            </div>

            {/* Quick Specs List */}
            <div className="pt-4 border-t border-[#202C44] space-y-2.5 text-xs text-[#7B8A90]">
              <div className="flex items-center justify-between">
                <span>License Type</span>
                <span className="text-white font-medium">{listing.licenseType}</span>
              </div>
              <div className="flex items-center justify-between">
                <span>File Formats</span>
                <span className="font-mono text-[#D3CCB0]">{listing.fileFormatTags.join(", ")}</span>
              </div>
              <div className="flex items-center justify-between">
                <span>File Size</span>
                <span className="font-mono text-white">{listing.fileSizeBytes}</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Delivery</span>
                <span className="text-emerald-400 font-medium flex items-center gap-1">
                  <Zap className="w-3 h-3" /> {listing.deliveryType}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span>Last Updated</span>
                <span className="font-mono text-white">{listing.updatedAt || listing.createdAt}</span>
              </div>
            </div>

          </div>

          {/* Creator Profile Card */}
          <div className="bg-[#111317] border border-[#202C44] rounded-2xl p-5 space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono uppercase tracking-wider text-[#7B8A90]">
                Verified Asset Creator
              </span>
              <span className="text-[10px] font-mono text-emerald-400 flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3" /> 90% Net Seller
              </span>
            </div>

            <div className="flex items-center gap-3">
              <img
                src={creatorAvatar}
                alt={creatorName}
                className="w-12 h-12 rounded-xl object-cover border border-[#202C44]"
              />
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5">
                  <h4 className="text-sm font-bold text-white truncate">{creatorName}</h4>
                  <span className="text-[10px] bg-[#202C44] text-[#D3CCB0] font-mono px-1.5 py-0.2 rounded border border-[#202C44]">
                    @{creatorUsername}
                  </span>
                </div>
                <p className="text-[11px] text-[#7B8A90] font-mono mt-0.5">
                  {listing.creator?.location || "India"} • Response {listing.creator?.responseTime || "< 2h"}
                </p>
              </div>
            </div>

            {listing.creator?.bio && (
              <p className="text-xs text-[#7B8A90] leading-relaxed">
                {listing.creator.bio}
              </p>
            )}

            <div className="grid grid-cols-2 gap-2 pt-2 border-t border-[#202C44] text-center text-xs">
              <div className="bg-[#000000] p-2 rounded-xl border border-[#202C44]">
                <span className="text-[10px] text-[#7B8A90] block">Total Sales</span>
                <span className="font-mono font-bold text-white">{listing.creator?.totalSales || 300}+</span>
              </div>
              <div className="bg-[#000000] p-2 rounded-xl border border-[#202C44]">
                <span className="text-[10px] text-[#7B8A90] block">Rating</span>
                <span className="font-mono font-bold text-[#D3CCB0]">★ {listing.creator?.rating || 4.9}</span>
              </div>
            </div>

            <Link
              to={`/profile/${creatorUsername}`}
              className="block w-full text-center bg-[#202C44] hover:bg-[#202C44]/80 text-[#D3CCB0] text-xs font-semibold py-2 rounded-xl border border-[#202C44] transition-colors"
            >
              View Creator Portfolio
            </Link>
          </div>

        </div>

      </div>

      {/* Related Listings in Same Category */}
      {relatedListings.length > 0 && (
        <section className="pt-12 border-t border-[#202C44] space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xl font-heading font-bold text-white">
                More in {listing.category}
              </h3>
              <p className="text-xs text-[#7B8A90] mt-0.5">
                Handpicked related digital tools and templates.
              </p>
            </div>

            <Link
              to={`/browse?category=${encodeURIComponent(listing.category)}`}
              className="text-xs font-bold text-[#D3CCB0] hover:underline flex items-center gap-1"
            >
              <span>Explore All</span>
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

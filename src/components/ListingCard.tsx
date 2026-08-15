import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { AssetListing, calculatePricing } from "../types";
import { Star, Heart, ArrowRight, ShieldCheck, Download, Sparkles, CheckCircle2 } from "lucide-react";

interface ListingCardProps {
  listing: AssetListing;
  onSelectListing?: (listing: AssetListing) => void;
  onBuyNowDirect?: (listing: AssetListing) => void;
  isSaved?: boolean;
  onToggleSave?: (id: string) => void;
  showDemoBadge?: boolean;
}

export const ListingCard: React.FC<ListingCardProps> = ({
  listing,
  onSelectListing,
  onBuyNowDirect,
  isSaved = false,
  onToggleSave,
  showDemoBadge = false,
}) => {
  const navigate = useNavigate();
  const pricing = calculatePricing(listing.priceInINR);
  const detailUrl = `/listing/${listing.slug || listing.id}`;
  const creatorUsername = listing.creator?.username || listing.seller?.handle?.replace("@", "") || "creator";
  const creatorName = listing.creator?.name || listing.seller?.name || "Verified Creator";
  const creatorAvatar = listing.creator?.avatar || listing.seller?.avatar || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80";

  const handleCardClick = () => {
    if (onSelectListing) {
      onSelectListing(listing);
    } else {
      navigate(detailUrl);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handleBuyClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onBuyNowDirect) {
      onBuyNowDirect(listing);
    } else {
      navigate(`/checkout/${listing.id}`);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handleSaveClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onToggleSave) {
      onToggleSave(listing.id);
    }
  };

  const handleCreatorClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigate(`/profile/${creatorUsername}`);
  };

  return (
    <div
      onClick={handleCardClick}
      className="group relative bg-[#111317] border border-[#202C44] hover:border-[#D3CCB0]/60 rounded-2xl overflow-hidden transition-all duration-200 hover:-translate-y-1 hover:shadow-[0_12px_32px_rgba(0,0,0,0.6)] flex flex-col cursor-pointer"
    >
      {/* Thumbnail Container */}
      <div className="relative aspect-[16/10] bg-[#202C44]/40 overflow-hidden">
        <img
          src={listing.thumbnailUrl || (listing.previewImages && listing.previewImages[0])}
          alt={listing.title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#111317] via-transparent to-transparent opacity-80" />

        {/* Top Floating Badges */}
        <div className="absolute top-2.5 left-2.5 flex flex-wrap items-center gap-1.5 z-10">
          <span className="bg-[#111317]/90 backdrop-blur-md text-[#D3CCB0] text-[10px] font-mono font-bold px-2 py-0.5 rounded-md border border-[#202C44]">
            {listing.fileType || (listing.fileFormatTags && listing.fileFormatTags[0]) || ".zip"}
          </span>

          {listing.priceInINR === 0 && (
            <span className="bg-emerald-500/20 text-emerald-300 text-[9px] font-mono font-bold px-2 py-0.5 rounded border border-emerald-500/40">
              FREE
            </span>
          )}

          {listing.isNew && (
            <span className="bg-[#202C44] text-[#D3CCB0] text-[9px] font-mono font-bold px-1.5 py-0.5 rounded border border-[#202C44]">
              NEW
            </span>
          )}

          {listing.featured && (
            <span className="bg-[#202C44] text-white text-[9px] font-mono font-bold px-1.5 py-0.5 rounded border border-[#202C44] flex items-center gap-0.5">
              <Sparkles className="w-2.5 h-2.5 text-[#D3CCB0]" /> Featured
            </span>
          )}
        </div>

        {/* Wishlist Bookmark Button */}
        <button
          type="button"
          onClick={handleSaveClick}
          className={`absolute top-2.5 right-2.5 p-1.5 rounded-lg backdrop-blur-md transition-colors z-10 ${
            isSaved
              ? "bg-[#D3CCB0] text-[#000000]"
              : "bg-[#111317]/80 text-[#7B8A90] hover:text-white hover:bg-[#202C44]"
          }`}
          aria-label={isSaved ? "Remove from saved items" : "Save item"}
          title={isSaved ? "Saved to wishlist" : "Add to wishlist"}
        >
          <Heart className={`w-3.5 h-3.5 ${isSaved ? "fill-current" : ""}`} />
        </button>

        {/* Bottom Thumbnail Overlay info */}
        <div className="absolute bottom-2 left-2.5 right-2.5 flex items-center justify-between text-[11px]">
          <span className="text-[#7B8A90] font-mono text-[10px] bg-[#111317]/80 px-1.5 py-0.5 rounded border border-[#202C44]/50">
            {listing.fileSizeBytes || "Instant"}
          </span>
          <div className="flex items-center gap-1 bg-[#111317]/90 px-2 py-0.5 rounded border border-[#202C44] text-[#D3CCB0] font-bold text-[10px]">
            <Star className="w-3 h-3 fill-current" />
            <span>{listing.rating.toFixed(1)}</span>
            <span className="text-[#7B8A90] font-normal font-mono">({listing.reviewCount})</span>
          </div>
        </div>
      </div>

      {/* Card Body */}
      <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
        <div className="space-y-1.5">
          <div className="flex items-center justify-between text-[10px] text-[#7B8A90] font-mono uppercase tracking-wider">
            <span>{listing.category}</span>
            <span className="text-emerald-400 font-medium lowercase flex items-center gap-1">
              <CheckCircle2 className="w-2.5 h-2.5" /> verified
            </span>
          </div>

          <h3 className="font-heading font-bold text-white text-sm leading-snug line-clamp-2 group-hover:text-[#D3CCB0] transition-colors">
            {listing.title}
          </h3>

          <p className="text-xs text-[#7B8A90] line-clamp-2 leading-relaxed">
            {listing.shortDescription || listing.description}
          </p>
        </div>

        {/* Creator Info Snippet */}
        <div
          onClick={handleCreatorClick}
          className="flex items-center gap-2 pt-1 border-t border-[#202C44]/40 hover:opacity-90 transition-opacity"
        >
          <img
            src={creatorAvatar}
            alt={creatorName}
            className="w-5 h-5 rounded-full object-cover border border-[#202C44]"
          />
          <span className="text-[11px] text-[#7B8A90] truncate max-w-[130px] hover:text-white transition-colors">
            {creatorName}
          </span>
          <span className="text-[10px] text-[#202C44]">•</span>
          <span className="text-[10px] text-[#7B8A90] font-mono">
            {listing.salesCount} sold
          </span>
        </div>

        {/* Price & View Action Footer */}
        <div className="pt-2 border-t border-[#202C44] flex items-center justify-between gap-2">
          <div>
            <div className="flex items-baseline gap-1.5">
              {listing.priceInINR === 0 ? (
                <span className="text-sm font-heading font-extrabold text-emerald-400">
                  FREE
                </span>
              ) : (
                <span className="text-sm font-heading font-extrabold text-[#D3CCB0]">
                  ₹{listing.priceInINR.toLocaleString("en-IN")}
                </span>
              )}
            </div>
            <div className="text-[9px] text-[#7B8A90] font-mono">
              {listing.priceInINR === 0 ? "Instant zero-cost download" : "Buyer fees shown at checkout"}
            </div>
          </div>

          <button
            type="button"
            onClick={handleCardClick}
            className="bg-[#202C44] hover:bg-[#D3CCB0] text-[#D3CCB0] hover:text-[#000000] text-xs font-bold px-3 py-1.5 rounded-lg border border-[#202C44] hover:border-[#D3CCB0] transition-all flex items-center gap-1 active:scale-95 shadow group/btn"
            title={`View details for ${listing.title}`}
          >
            <span>View Asset</span>
            <ArrowRight className="w-3 h-3 group-hover/btn:translate-x-0.5 transition-transform" />
          </button>
        </div>
      </div>
    </div>
  );
};

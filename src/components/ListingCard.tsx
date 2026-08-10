import React from "react";
import { AssetListing } from "../types";
import { Star, Download, Heart, ShieldCheck, FileCode, ShoppingBag } from "lucide-react";

interface ListingCardProps {
  listing: AssetListing;
  onSelectListing: (listing: AssetListing) => void;
  onBuyNowDirect: (listing: AssetListing) => void;
  isSaved: boolean;
  onToggleSave: (listingId: string) => void;
}

export const ListingCard: React.FC<ListingCardProps> = ({
  listing,
  onSelectListing,
  onBuyNowDirect,
  isSaved,
  onToggleSave,
}) => {
  const primaryFormat = listing.fileFormatTags[0] || ".zip";

  return (
    <div className="group bg-[#202C44] hover:bg-[#202C44]/90 border border-[#202C44] hover:border-[#D3CCB0]/40 border-l-2 border-l-transparent hover:border-l-[#D3CCB0] rounded-2xl overflow-hidden transition-all duration-200 flex flex-col justify-between shadow-lg">
      
      {/* Top Image Preview */}
      <div className="relative aspect-[16/10] overflow-hidden bg-[#111317]">
        <img
          src={listing.thumbnailUrl}
          alt={listing.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          loading="lazy"
        />

        {/* Dark overlay gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#202C44] via-transparent to-black/30 pointer-events-none" />

        {/* Top Single Pill Extension Badge */}
        <div className="absolute top-3 left-3 flex items-center gap-1.5 z-10">
          <span className="bg-[#111317]/95 backdrop-blur-md text-[#D3CCB0] text-[10px] font-mono font-bold px-2.5 py-1 rounded-full border border-[#202C44] flex items-center gap-1 shadow-sm">
            <FileCode className="w-3 h-3 text-[#D3CCB0]" />
            <span>{primaryFormat}</span>
          </span>
          {listing.isNew && (
            <span className="bg-[#D3CCB0] text-[#000000] text-[10px] font-bold uppercase px-2 py-0.5 rounded shadow-sm">
              NEW
            </span>
          )}
        </div>

        {/* Wishlist Button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onToggleSave(listing.id);
          }}
          className={`absolute top-3 right-3 p-2 rounded-full backdrop-blur-md border transition-all z-10 ${
            isSaved
              ? "bg-[#D3CCB0] text-[#000000] border-[#D3CCB0]"
              : "bg-[#111317]/80 text-[#7B8A90] hover:text-white border-[#202C44]"
          }`}
          title={isSaved ? "Saved" : "Save asset"}
        >
          <Heart className="w-3.5 h-3.5 fill-current" />
        </button>

        {/* Category Pill Over Image Bottom */}
        <div className="absolute bottom-2 left-3 right-3 flex items-center justify-between text-[11px] text-[#7B8A90] font-medium z-10">
          <span className="bg-[#111317]/90 px-2.5 py-0.5 rounded text-[10px] text-[#7B8A90] border border-[#202C44]">
            {listing.category}
          </span>
          <span className="text-[10px] text-[#7B8A90] flex items-center gap-1">
            <Download className="w-3 h-3 text-[#D3CCB0]" />
            {listing.salesCount} sold
          </span>
        </div>
      </div>

      {/* Body Content */}
      <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
        
        <div>
          {/* Seller Line */}
          <div className="flex items-center gap-2 mb-1.5">
            <img
              src={listing.seller.avatar}
              alt={listing.seller.name}
              className="w-4 h-4 rounded-full object-cover border border-[#202C44]"
            />
            <span className="text-[11px] text-[#7B8A90] hover:text-white hover:underline cursor-pointer font-medium truncate">
              {listing.seller.name}
            </span>
            {listing.seller.verified && (
              <ShieldCheck className="w-3.5 h-3.5 text-[#D3CCB0] fill-[#D3CCB0]" title="Verified Creator" />
            )}
          </div>

          {/* Title */}
          <h3
            onClick={() => onSelectListing(listing)}
            className="text-sm font-heading font-bold text-white group-hover:text-[#D3CCB0] transition-colors line-clamp-2 leading-snug cursor-pointer"
          >
            {listing.title}
          </h3>

          {/* Detailed features preview */}
          <p className="text-[11px] text-[#7B8A90] font-normal line-clamp-2 mt-1 leading-relaxed">
            {listing.description}
          </p>
        </div>

        {/* Footer Rating & Price */}
        <div className="pt-3 border-t border-[#111317] flex items-center justify-between gap-2">
          
          {/* Rating */}
          <div className="flex items-center gap-1">
            <Star className="w-3.5 h-3.5 text-[#D3CCB0] fill-[#D3CCB0]" />
            <span className="text-xs font-bold text-white">{listing.rating.toFixed(1)}</span>
            <span className="text-[10px] text-[#7B8A90]">({listing.reviewCount})</span>
          </div>

          {/* Price & Action */}
          <div className="flex items-center gap-2">
            <div className="text-right">
              <div className="text-sm font-heading font-bold text-[#D3CCB0]">
                ₹{listing.priceInINR.toLocaleString("en-IN")}
              </div>
              <span className="text-[9px] text-[#7B8A90] block -mt-0.5">+12.5% UPI fee</span>
            </div>

            <button
              onClick={() => onBuyNowDirect(listing)}
              className="bg-[#D3CCB0] hover:bg-[#c4bb9a] text-[#000000] text-xs font-bold px-3 py-1.5 rounded-lg transition-all duration-150 flex items-center gap-1.5 active:scale-95 hover:scale-[1.02] shadow"
              title="Buy now with UPI"
            >
              <ShoppingBag className="w-3.5 h-3.5 text-[#000000]" />
              <span>Buy Now</span>
            </button>
          </div>

        </div>

      </div>
    </div>
  );
};


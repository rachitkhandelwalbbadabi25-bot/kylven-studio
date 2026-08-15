import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { AssetListing } from "../types";
import { ListingCard } from "../components/ListingCard";
import { Heart, ArrowRight, Sparkles } from "lucide-react";

interface SavedPageProps {
  listings: AssetListing[];
  savedIds: string[];
  onToggleSave: (id: string) => void;
  onBuyNowDirect: (listing: AssetListing) => void;
}

export const SavedPage: React.FC<SavedPageProps> = ({
  listings,
  savedIds,
  onToggleSave,
  onBuyNowDirect,
}) => {
  const navigate = useNavigate();

  const savedListings = listings.filter((item) => savedIds.includes(item.id));

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      {/* Header */}
      <div className="border-b border-[#202C44] pb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="bg-[#202C44] text-[#D3CCB0] text-xs font-mono font-bold px-2.5 py-0.5 rounded border border-[#202C44]">
              Saved Wishlist
            </span>
            <span className="text-xs text-[#7B8A90] font-mono">{savedListings.length} Assets Bookmarked</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-heading font-extrabold text-white tracking-tight mt-1">
            Your Bookmarked Assets
          </h1>
          <p className="text-xs sm:text-sm text-[#7B8A90] mt-0.5">
            Quick access to digital assets, templates, and UI kits you've saved for later.
          </p>
        </div>

        <Link
          to="/browse"
          className="text-xs font-bold text-[#D3CCB0] hover:underline flex items-center gap-1"
        >
          <span>Explore More</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      {/* Grid of Saved Assets */}
      {savedListings.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {savedListings.map((item) => (
            <ListingCard
              key={item.id}
              listing={item}
              onSelectListing={(asset) => {
                navigate(`/listing/${asset.slug || asset.id}`);
                window.scrollTo({ top: 0, behavior: "smooth" });
              }}
              onBuyNowDirect={onBuyNowDirect}
              isSaved={true}
              onToggleSave={onToggleSave}
            />
          ))}
        </div>
      ) : (
        /* Empty State */
        <div className="bg-[#111317] border border-[#202C44] rounded-2xl p-12 text-center space-y-4 max-w-md mx-auto my-8">
          <div className="w-14 h-14 rounded-2xl bg-[#202C44] text-pink-400 flex items-center justify-center mx-auto">
            <Heart className="w-7 h-7" />
          </div>
          <div>
            <h2 className="text-base font-heading font-bold text-white">Your Wishlist is Empty</h2>
            <p className="text-xs text-[#7B8A90] mt-1">
              Click the heart icon on any asset card while browsing to save it to your wishlist.
            </p>
          </div>
          <Link
            to="/browse"
            className="inline-block bg-[#D3CCB0] text-[#000000] text-xs font-bold px-5 py-2.5 rounded-xl shadow"
          >
            Browse Marketplace
          </Link>
        </div>
      )}

    </div>
  );
};

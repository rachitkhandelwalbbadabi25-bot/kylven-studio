import React from "react";
import { useNavigate } from "react-router-dom";
import { AssetListing } from "../types";
import { ListingCard } from "../components/ListingCard";
import { Heart } from "lucide-react";

interface SavedPageProps {
  listings: AssetListing[];
  savedIds: string[];
  onToggleSave: (id: string) => void;
  onClearSaved: () => void;
  onBuyNowDirect: (listing: AssetListing) => void;
}

export const SavedPage: React.FC<SavedPageProps> = ({
  listings,
  savedIds,
  onToggleSave,
  onClearSaved,
  onBuyNowDirect,
}) => {
  const navigate = useNavigate();
  const savedListings = listings.filter((item) => savedIds.includes(item.id));

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-6">
      <div className="border-b border-[#202C44] pb-4 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-heading font-extrabold text-white">
            Your Saved Digital Assets ({savedIds.length})
          </h1>
          <p className="text-xs text-[#7B8A90] mt-0.5">
            Assets bookmarked for future project purchases.
          </p>
        </div>

        {savedIds.length > 0 && (
          <button
            onClick={onClearSaved}
            className="text-xs text-[#7B8A90] hover:text-white transition-colors"
          >
            Clear Wishlist
          </button>
        )}
      </div>

      {savedListings.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {savedListings.map((item) => (
            <ListingCard
              key={item.id}
              listing={item}
              onSelectListing={(asset) => {
                navigate(`/asset/${asset.id}`);
                window.scrollTo({ top: 0, behavior: "smooth" });
              }}
              onBuyNowDirect={onBuyNowDirect}
              isSaved={true}
              onToggleSave={onToggleSave}
            />
          ))}
        </div>
      ) : (
        <div className="bg-[#111317] border border-[#202C44] rounded-2xl p-12 text-center space-y-4 max-w-md mx-auto my-12">
          <Heart className="w-10 h-10 text-[#7B8A90] mx-auto" />
          <h3 className="text-base font-heading font-bold text-white">No Saved Assets Yet</h3>
          <p className="text-xs text-[#7B8A90]">
            Click the heart icon on any UI kit, Flutter template, or LUT to save it here.
          </p>
          <button
            onClick={() => navigate("/browse")}
            className="bg-[#D3CCB0] text-[#000000] text-xs font-bold px-4 py-2 rounded-xl shadow"
          >
            Explore Marketplace
          </button>
        </div>
      )}
    </div>
  );
};

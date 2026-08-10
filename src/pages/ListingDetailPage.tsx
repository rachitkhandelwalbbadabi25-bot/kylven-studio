import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { AssetListing } from "../types";
import { ListingDetailView } from "../components/ListingDetailView";
import { ArrowLeft, Search } from "lucide-react";

interface ListingDetailPageProps {
  listings: AssetListing[];
  savedIds: string[];
  onToggleSave: (id: string) => void;
  onBuyNow: (listing: AssetListing) => void;
}

export const ListingDetailPage: React.FC<ListingDetailPageProps> = ({
  listings,
  savedIds,
  onToggleSave,
  onBuyNow,
}) => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const listing = listings.find((item) => item.id === id);

  if (!listing) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 text-center space-y-4">
        <div className="w-16 h-16 bg-[#202C44] text-[#D3CCB0] rounded-2xl flex items-center justify-center mx-auto">
          <Search className="w-8 h-8" />
        </div>
        <h2 className="text-xl font-heading font-bold text-white">Asset Not Found</h2>
        <p className="text-xs text-[#7B8A90] max-w-sm mx-auto">
          The requested digital asset could not be located or may have been updated.
        </p>
        <button
          onClick={() => navigate("/browse")}
          className="inline-flex items-center gap-2 bg-[#D3CCB0] text-[#000000] text-xs font-bold px-4 py-2 rounded-xl"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Marketplace</span>
        </button>
      </div>
    );
  }

  return (
    <ListingDetailView
      listing={listing}
      onBack={() => navigate(-1)}
      onBuyNow={onBuyNow}
      isSaved={savedIds.includes(listing.id)}
      onToggleSave={onToggleSave}
    />
  );
};

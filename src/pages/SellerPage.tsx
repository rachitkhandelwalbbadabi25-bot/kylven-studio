import React from "react";
import { useNavigate } from "react-router-dom";
import { AssetListing, SalesRecord, SellerStats } from "../types";
import { SellerDashboardView } from "../components/SellerDashboardView";

interface SellerPageProps {
  stats: SellerStats;
  salesHistory: SalesRecord[];
  activeListings: AssetListing[];
  onAddNewListing: (newListing: AssetListing) => void;
}

export const SellerPage: React.FC<SellerPageProps> = ({
  stats,
  salesHistory,
  activeListings,
  onAddNewListing,
}) => {
  const navigate = useNavigate();

  return (
    <SellerDashboardView
      stats={stats}
      salesHistory={salesHistory}
      activeListings={activeListings}
      onAddNewListing={onAddNewListing}
      onGoToBrowse={() => navigate("/browse")}
    />
  );
};

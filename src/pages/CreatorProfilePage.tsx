import React from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { AssetListing, CreatorProfile } from "../types";
import { CREATOR_PROFILES_MOCK } from "../data/mockData";
import { ListingCard } from "../components/ListingCard";
import {
  Star,
  ShieldCheck,
  CheckCircle2,
  MapPin,
  Clock,
  ShoppingBag,
  Share2,
  Globe,
  ExternalLink,
  Layers
} from "lucide-react";

interface CreatorProfilePageProps {
  listings: AssetListing[];
  savedIds: string[];
  onToggleSave: (id: string) => void;
  onBuyNowDirect: (listing: AssetListing) => void;
}

export const CreatorProfilePage: React.FC<CreatorProfilePageProps> = ({
  listings,
  savedIds,
  onToggleSave,
  onBuyNowDirect,
}) => {
  const { username } = useParams<{ username: string }>();
  const navigate = useNavigate();

  // Find creator in mock or build from username
  const cleanUsername = (username || "aarav_ui").replace("@", "");
  const creator: CreatorProfile =
    CREATOR_PROFILES_MOCK[cleanUsername] || {
      id: "creator_custom",
      name: cleanUsername.split("_").map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join(" "),
      username: cleanUsername,
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80",
      bio: "Verified digital asset creator on Kreate Studio. Crafting production-grade components & tools for Indian tech builders.",
      location: "Bengaluru, India",
      skills: ["Design", "Code", "Components"],
      rating: 4.9,
      totalSales: 450,
      responseTime: "< 2 hours",
      joinedDate: "January 2024",
      verifiedSeller: true,
    };

  // Find listings by this creator
  const creatorListings = listings.filter(
    (l) =>
      (l.creator?.username && l.creator.username.toLowerCase() === cleanUsername.toLowerCase()) ||
      (l.seller?.handle && l.seller.handle.replace("@", "").toLowerCase() === cleanUsername.toLowerCase()) ||
      l.seller?.name.toLowerCase().includes(cleanUsername.toLowerCase())
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      
      {/* Creator Header Banner */}
      <div className="bg-[#111317] border border-[#202C44] rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xl relative overflow-hidden">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          
          <div className="flex items-center gap-5">
            <img
              src={creator.avatar}
              alt={creator.name}
              className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl object-cover border-2 border-[#202C44]"
            />
            <div className="space-y-1.5">
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="text-xl sm:text-2xl font-heading font-extrabold text-white">
                  {creator.name}
                </h1>
                <span className="text-xs font-mono text-[#D3CCB0] bg-[#202C44] px-2 py-0.5 rounded border border-[#202C44]">
                  @{creator.username}
                </span>
                {creator.verifiedSeller && (
                  <span className="text-xs text-emerald-400 font-mono flex items-center gap-1 bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-800">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Verified Creator
                  </span>
                )}
              </div>

              <p className="text-xs text-[#7B8A90] max-w-xl leading-relaxed">
                {creator.bio}
              </p>

              <div className="flex flex-wrap items-center gap-4 text-xs text-[#7B8A90] pt-1">
                <span className="flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-[#D3CCB0]" />
                  <span>{creator.location}</span>
                </span>
                <span className="flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-[#D3CCB0]" />
                  <span>Avg Response: {creator.responseTime}</span>
                </span>
                <span className="flex items-center gap-1">
                  <span>Member since {creator.joinedDate}</span>
                </span>
              </div>
            </div>
          </div>

          {/* Stats Badges */}
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <div className="flex-1 sm:flex-initial bg-[#202C44]/60 border border-[#202C44] px-4 py-3 rounded-2xl text-center">
              <span className="text-[10px] text-[#7B8A90] uppercase font-mono block">Rating</span>
              <span className="text-base font-bold text-[#D3CCB0] font-heading flex items-center justify-center gap-1">
                <Star className="w-4 h-4 fill-current" /> {creator.rating.toFixed(1)}
              </span>
            </div>

            <div className="flex-1 sm:flex-initial bg-[#202C44]/60 border border-[#202C44] px-4 py-3 rounded-2xl text-center">
              <span className="text-[10px] text-[#7B8A90] uppercase font-mono block">Total Sales</span>
              <span className="text-base font-bold text-white font-mono">{creator.totalSales}+</span>
            </div>

            <div className="flex-1 sm:flex-initial bg-[#202C44]/60 border border-[#202C44] px-4 py-3 rounded-2xl text-center">
              <span className="text-[10px] text-[#7B8A90] uppercase font-mono block">Published</span>
              <span className="text-base font-bold text-white font-mono">{creatorListings.length}</span>
            </div>
          </div>

        </div>

        {/* Skills & Tools */}
        {creator.skills && creator.skills.length > 0 && (
          <div className="pt-4 border-t border-[#202C44] flex items-center gap-2 flex-wrap text-xs">
            <span className="text-[#7B8A90] font-mono">Specializations:</span>
            {creator.skills.map((skill) => (
              <span
                key={skill}
                className="bg-[#202C44] text-white text-[11px] px-2.5 py-0.5 rounded-lg border border-[#202C44]"
              >
                {skill}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Published Listings by this creator */}
      <div className="space-y-6">
        <div className="flex items-center justify-between border-b border-[#202C44] pb-4">
          <div>
            <h2 className="text-xl font-heading font-bold text-white">
              Published Assets ({creatorListings.length})
            </h2>
            <p className="text-xs text-[#7B8A90] mt-0.5">
              Original digital assets with verified commercial licenses.
            </p>
          </div>
        </div>

        {creatorListings.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {creatorListings.map((item) => (
              <ListingCard
                key={item.id}
                listing={item}
                onSelectListing={(asset) => {
                  navigate(`/listing/${asset.slug || asset.id}`);
                  window.scrollTo({ top: 0, behavior: "smooth" });
                }}
                onBuyNowDirect={onBuyNowDirect}
                isSaved={savedIds.includes(item.id)}
                onToggleSave={onToggleSave}
              />
            ))}
          </div>
        ) : (
          <div className="bg-[#111317] border border-[#202C44] rounded-2xl p-12 text-center text-xs text-[#7B8A90]">
            No public listings currently listed under this creator.
          </div>
        )}
      </div>

    </div>
  );
};

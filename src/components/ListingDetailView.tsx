import React, { useState } from "react";
import { AssetListing } from "../types";
import {
  Star,
  ShieldCheck,
  Download,
  Share2,
  Heart,
  CheckCircle2,
  ArrowLeft,
  FileCode,
  HardDrive,
  Clock,
  Sparkles,
  Lock,
  UserCheck,
  MessageSquare
} from "lucide-react";

interface ListingDetailViewProps {
  listing: AssetListing;
  onBack: () => void;
  onBuyNow: (listing: AssetListing) => void;
  isSaved: boolean;
  onToggleSave: (id: string) => void;
}

export const ListingDetailView: React.FC<ListingDetailViewProps> = ({
  listing,
  onBack,
  onBuyNow,
  isSaved,
  onToggleSave,
}) => {
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [activeTab, setActiveTab] = useState<"overview" | "features" | "reviews">("overview");

  // Fee calculation matching prompt rules:
  // Listed Price: ₹1,000
  // Buyer pays: Listed Price + 12.5% platform/payment fee (₹1,125)
  // Seller receives: 90% of listed price (₹900)
  const listedPrice = listing.priceInINR;
  const platformFee = Math.round(listedPrice * 0.125);
  const totalBuyerPayable = listedPrice + platformFee;
  const sellerNetEarnings = Math.round(listedPrice * 0.9);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Top Back Navigation Bar */}
      <div className="flex items-center justify-between border-b border-[#202C44] pb-4">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-xs text-[#7B8A90] hover:text-[#D3CCB0] transition-colors font-medium bg-[#111317] border border-[#202C44] px-3 py-1.5 rounded-lg"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Browse</span>
        </button>

        <div className="flex items-center gap-2">
          <button
            onClick={() => onToggleSave(listing.id)}
            className={`flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg border transition-colors ${
              isSaved
                ? "bg-[#D3CCB0] text-[#000000] border-[#D3CCB0] font-bold"
                : "bg-[#111317] text-[#7B8A90] hover:text-white border-[#202C44]"
            }`}
          >
            <Heart className="w-3.5 h-3.5 fill-current" />
            <span>{isSaved ? "Saved in Wishlist" : "Save Asset"}</span>
          </button>

          <button
            onClick={() => {
              if (navigator.clipboard) {
                navigator.clipboard.writeText(window.location.href);
                alert("Listing URL copied to clipboard!");
              }
            }}
            className="p-2 bg-[#111317] text-[#7B8A90] hover:text-white border border-[#202C44] rounded-lg transition-colors"
            title="Share"
          >
            <Share2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Main Grid: Left Gallery + Details, Right Sticky Checkout Card */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Column (8 cols): Media Gallery & Specs */}
        <div className="lg:col-span-8 space-y-8">
          
          {/* Title Header */}
          <div className="space-y-3">
            <div className="flex flex-wrap items-center gap-2">
              <span className="bg-[#202C44] text-[#D3CCB0] text-xs font-mono px-2.5 py-0.5 rounded border border-[#202C44]">
                {listing.category}
              </span>
              <span className="text-xs text-[#7B8A90]">/ {listing.subcategory}</span>
              <span className="ml-auto bg-[#111317] text-[#7B8A90] text-xs px-2.5 py-0.5 rounded border border-[#202C44] font-mono">
                {listing.licenseType}
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-heading font-extrabold text-white tracking-tight leading-snug">
              {listing.title}
            </h1>

            {/* Rating & Sales */}
            <div className="flex flex-wrap items-center gap-4 text-xs text-[#7B8A90]">
              <div className="flex items-center gap-1 bg-[#111317] px-2.5 py-1 rounded-md border border-[#202C44]">
                <Star className="w-4 h-4 text-[#D3CCB0] fill-[#D3CCB0]" />
                <span className="font-bold text-white text-sm">{listing.rating.toFixed(1)}</span>
                <span>({listing.reviewCount} verified reviews)</span>
              </div>

              <div className="flex items-center gap-1.5">
                <Download className="w-4 h-4 text-[#D3CCB0]" />
                <span className="text-white font-medium">{listing.salesCount}</span> downloads
              </div>

              <div className="flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-[#D3CCB0]" />
                <span>Manually Quality Verified</span>
              </div>
            </div>
          </div>

          {/* Main Gallery Preview */}
          <div className="space-y-3">
            <div className="aspect-[16/10] bg-[#111317] border border-[#202C44] rounded-2xl overflow-hidden relative">
              <img
                src={listing.previewImages[selectedImageIndex] || listing.thumbnailUrl}
                alt={listing.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute bottom-3 right-3 bg-[#000000]/80 backdrop-blur-md text-[#D3CCB0] text-xs font-mono px-3 py-1 rounded-lg border border-[#202C44]">
                Preview {selectedImageIndex + 1} of {listing.previewImages.length || 1}
              </div>
            </div>

            {/* Thumbnails list */}
            {listing.previewImages.length > 1 && (
              <div className="flex gap-3 overflow-x-auto pb-2">
                {listing.previewImages.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedImageIndex(idx)}
                    className={`w-20 h-14 rounded-xl overflow-hidden border-2 transition-all shrink-0 bg-[#111317] ${
                      selectedImageIndex === idx ? "border-[#D3CCB0]" : "border-[#202C44] opacity-60 hover:opacity-100"
                    }`}
                  >
                    <img src={img} alt={`Thumb ${idx}`} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Navigation Tabs */}
          <div className="border-b border-[#202C44] flex gap-6 text-sm font-heading font-semibold">
            <button
              onClick={() => setActiveTab("overview")}
              className={`pb-3 transition-colors relative ${
                activeTab === "overview" ? "text-[#D3CCB0]" : "text-[#7B8A90] hover:text-white"
              }`}
            >
              Overview
              {activeTab === "overview" && (
                <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#D3CCB0]" />
              )}
            </button>

            <button
              onClick={() => setActiveTab("features")}
              className={`pb-3 transition-colors relative ${
                activeTab === "features" ? "text-[#D3CCB0]" : "text-[#7B8A90] hover:text-white"
              }`}
            >
              What's Included
              {activeTab === "features" && (
                <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#D3CCB0]" />
              )}
            </button>

            <button
              onClick={() => setActiveTab("reviews")}
              className={`pb-3 transition-colors relative ${
                activeTab === "reviews" ? "text-[#D3CCB0]" : "text-[#7B8A90] hover:text-white"
              }`}
            >
              Reviews ({listing.reviewList.length})
              {activeTab === "reviews" && (
                <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#D3CCB0]" />
              )}
            </button>
          </div>

          {/* Tab 1: Overview */}
          {activeTab === "overview" && (
            <div className="space-y-6 text-sm text-[#7B8A90] leading-relaxed">
              <p className="text-white text-base leading-relaxed">
                {listing.description}
              </p>

              {/* Spec sheet boxes */}
              <div className="bg-[#202C44] border border-[#202C44] rounded-2xl p-5 grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div>
                  <span className="text-[10px] text-[#7B8A90] uppercase font-mono block">Formats Included</span>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {listing.fileFormatTags.map((tag) => (
                      <span key={tag} className="text-xs font-mono font-bold text-[#D3CCB0]">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>

                <div>
                  <span className="text-[10px] text-[#7B8A90] uppercase font-mono block">File Size</span>
                  <span className="text-xs font-bold text-white block mt-1">{listing.fileSizeBytes}</span>
                </div>

                <div>
                  <span className="text-[10px] text-[#7B8A90] uppercase font-mono block">Compatibility</span>
                  <span className="text-xs text-white block mt-1 truncate">{listing.compatibleWith.join(", ")}</span>
                </div>

                <div>
                  <span className="text-[10px] text-[#7B8A90] uppercase font-mono block">License</span>
                  <span className="text-xs text-white block mt-1">{listing.licenseType}</span>
                </div>
              </div>

              {/* Compatibility badges */}
              <div className="space-y-2">
                <h4 className="text-white font-semibold font-heading text-xs uppercase tracking-wider">
                  Supported Software & Workflows
                </h4>
                <div className="flex flex-wrap gap-2">
                  {listing.compatibleWith.map((sw) => (
                    <span
                      key={sw}
                      className="bg-[#111317] border border-[#202C44] text-[#7B8A90] text-xs px-3 py-1 rounded-lg"
                    >
                      ✓ {sw}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Tab 2: Features Included */}
          {activeTab === "features" && (
            <div className="space-y-4">
              <h3 className="text-base font-heading font-bold text-white">
                Detailed Package Contents
              </h3>
              <ul className="space-y-3">
                {listing.detailedFeatures.map((feat, idx) => (
                  <li key={idx} className="flex items-start gap-3 bg-[#202C44]/50 border border-[#202C44] p-3.5 rounded-xl text-xs text-white">
                    <CheckCircle2 className="w-4 h-4 text-[#D3CCB0] shrink-0 mt-0.5" />
                    <span>{feat}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Tab 3: Reviews */}
          {activeTab === "reviews" && (
            <div className="space-y-6">
              {listing.reviewList.length > 0 ? (
                <div className="space-y-4">
                  {listing.reviewList.map((rev) => (
                    <div key={rev.id} className="bg-[#202C44] border border-[#202C44] rounded-2xl p-4 space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <img src={rev.userAvatar} alt={rev.userName} className="w-6 h-6 rounded-full object-cover" />
                          <span className="text-xs font-bold text-white">{rev.userName}</span>
                          {rev.verifiedPurchase && (
                            <span className="bg-[#111317] text-[#D3CCB0] text-[10px] font-mono px-2 py-0.5 rounded border border-[#202C44]">
                              Verified Buyer
                            </span>
                          )}
                        </div>
                        <span className="text-[11px] text-[#7B8A90]">{rev.date}</span>
                      </div>

                      <div className="flex items-center gap-1">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Star
                            key={i}
                            className={`w-3 h-3 ${
                              i < rev.rating ? "text-[#D3CCB0] fill-[#D3CCB0]" : "text-[#7B8A90]"
                            }`}
                          />
                        ))}
                      </div>

                      <p className="text-xs text-[#7B8A90] leading-relaxed">{rev.comment}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="bg-[#111317] border border-[#202C44] rounded-2xl p-8 text-center text-xs text-[#7B8A90]">
                  No reviews yet for this listing. Be the first to purchase and review!
                </div>
              )}
            </div>
          )}

          {/* Seller Card */}
          <div className="bg-[#202C44] border border-[#202C44] rounded-2xl p-6 space-y-4">
            <h4 className="text-xs uppercase font-mono text-[#7B8A90] tracking-wider">
              Creator / Seller Profile
            </h4>

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <img
                  src={listing.seller.avatar}
                  alt={listing.seller.name}
                  className="w-12 h-12 rounded-xl object-cover border border-[#202C44]"
                />
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-heading font-bold text-white text-base">{listing.seller.name}</h3>
                    {listing.seller.verified && (
                      <ShieldCheck className="w-4 h-4 text-[#D3CCB0]" title="Verified Creator" />
                    )}
                  </div>
                  <span className="text-xs text-[#7B8A90] font-mono">{listing.seller.handle}</span>
                </div>
              </div>

              <div className="flex flex-wrap gap-3 text-xs">
                <div className="bg-[#111317] border border-[#202C44] px-3 py-1.5 rounded-lg text-center">
                  <span className="text-[#D3CCB0] font-bold block">{listing.seller.totalSales}</span>
                  <span className="text-[10px] text-[#7B8A90]">Total Sales</span>
                </div>

                <div className="bg-[#111317] border border-[#202C44] px-3 py-1.5 rounded-lg text-center">
                  <span className="text-white font-bold block">{listing.seller.rating}★</span>
                  <span className="text-[10px] text-[#7B8A90]">Rating</span>
                </div>

                <div className="bg-[#111317] border border-[#202C44] px-3 py-1.5 rounded-lg text-center">
                  <span className="text-white font-bold block">{listing.seller.responseTime}</span>
                  <span className="text-[10px] text-[#7B8A90]">Response</span>
                </div>
              </div>
            </div>
          </div>

        </div>

        {/* Right Sticky Pricing & UPI Checkout Card (4 cols) */}
        <div className="lg:col-span-4 lg:sticky lg:top-24 space-y-4">
          
          <div className="bg-[#202C44] border border-[#202C44] rounded-2xl p-6 space-y-6 shadow-2xl">
            
            {/* Header Tag */}
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono uppercase text-[#7B8A90]">Instant Download</span>
              <span className="bg-[#111317] text-[#D3CCB0] text-[10px] font-bold px-2.5 py-0.5 rounded border border-[#202C44]">
                UPI Native Checkout
              </span>
            </div>

            {/* Main Price & Fee Breakdown */}
            <div className="bg-[#111317] border border-[#202C44] rounded-xl p-4 space-y-3">
              <div className="flex items-center justify-between text-xs text-[#7B8A90]">
                <span>Listed Creator Price</span>
                <span className="font-mono text-white font-semibold">
                  ₹{listedPrice.toLocaleString("en-IN")}
                </span>
              </div>

              <div className="flex items-center justify-between text-xs text-[#7B8A90]">
                <span className="flex items-center gap-1">
                  <span>Platform & Processing Fee</span>
                  <span className="text-[10px] bg-[#202C44] px-1 rounded text-[#D3CCB0]">12.5%</span>
                </span>
                <span className="font-mono text-[#7B8A90]">
                  + ₹{platformFee.toLocaleString("en-IN")}
                </span>
              </div>

              <div className="pt-2 border-t border-[#202C44] flex items-baseline justify-between">
                <div>
                  <span className="text-xs font-semibold text-white block">Total Buyer Price</span>
                  <span className="text-[10px] text-[#7B8A90]">Includes instant download link</span>
                </div>
                <div className="text-right">
                  <span className="text-2xl font-heading font-extrabold text-[#D3CCB0]">
                    ₹{totalBuyerPayable.toLocaleString("en-IN")}
                  </span>
                </div>
              </div>
            </div>

            {/* Seller Split Transparency Callout */}
            <div className="bg-[#111317]/60 border border-[#202C44] rounded-xl p-3 text-[11px] text-[#7B8A90] space-y-1">
              <div className="flex items-center justify-between font-medium text-white">
                <span>Seller Revenue Split</span>
                <span className="text-[#D3CCB0] font-mono font-bold">90% Guaranteed</span>
              </div>
              <p className="text-[10px] text-[#7B8A90] leading-tight">
                Seller receives ₹{sellerNetEarnings.toLocaleString("en-IN")} directly into Indian bank account. Zero hidden cuts.
              </p>
            </div>

            {/* Buy CTA */}
            <button
              onClick={() => onBuyNow(listing)}
              className="w-full bg-[#D3CCB0] hover:bg-[#c4bb9a] text-[#000000] font-heading font-extrabold text-sm py-3.5 px-4 rounded-xl transition-all shadow-lg active:scale-95 flex items-center justify-center gap-2"
            >
              <span>Buy Now for ₹{totalBuyerPayable.toLocaleString("en-IN")}</span>
            </button>

            {/* Supported Payment Logos */}
            <div className="space-y-2 pt-2 border-t border-[#111317]">
              <span className="text-[10px] font-mono text-[#7B8A90] uppercase block text-center">
                Supported Fast UPI Methods
              </span>
              <div className="flex items-center justify-center gap-2 text-[10px] text-[#D3CCB0] font-mono">
                <span className="bg-[#111317] px-2 py-1 rounded border border-[#202C44]">GPay</span>
                <span className="bg-[#111317] px-2 py-1 rounded border border-[#202C44]">PhonePe</span>
                <span className="bg-[#111317] px-2 py-1 rounded border border-[#202C44]">Paytm</span>
                <span className="bg-[#111317] px-2 py-1 rounded border border-[#202C44]">Cards</span>
              </div>
            </div>

            {/* Trust Bullet List */}
            <div className="space-y-2 text-xs text-[#7B8A90]">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#D3CCB0]" />
                <span>Instant file access & download key</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#D3CCB0]" />
                <span>Commercial use license included</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#D3CCB0]" />
                <span>256-bit SSL encrypted transactions</span>
              </div>
            </div>

          </div>

        </div>

      </div>

    </div>
  );
};

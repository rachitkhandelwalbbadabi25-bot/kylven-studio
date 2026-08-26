import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { AssetListing, CoreCategory, CreatorProfile, calculatePricing, UserProfile } from "../types";
import { CATEGORIES_LIST } from "../data/mockData";
import {
  Upload,
  Plus,
  IndianRupee,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  ShieldCheck,
  Zap,
  ArrowRight,
  FileCode,
  Image as ImageIcon,
  Trash2,
  Eye,
  Star,
  Layers,
  Award
} from "lucide-react";

interface SellNewAssetPageProps {
  onAddListing: (newListing: AssetListing) => void;
  userProfile: UserProfile;
}

const SAMPLE_PRESET_IMAGES = [
  "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=800&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1559526324-4b87b5e36e44?w=800&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=800&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&auto=format&fit=crop&q=80",
];

export const SellNewAssetPage: React.FC<SellNewAssetPageProps> = ({
  onAddListing,
  userProfile,
}) => {
  const navigate = useNavigate();

  // Form State
  const [title, setTitle] = useState("Neo Bharat Cyberpunk UI Kit");
  const [category, setCategory] = useState<CoreCategory>("UI/UX & Design");
  const [subcategory, setSubcategory] = useState("Figma UI Kits");
  const [priceInINR, setPriceInINR] = useState<number>(499);
  const [description, setDescription] = useState(
    "Futuristic neon-infused mobile and web UI component kit inspired by modern Indian cyberpunk aesthetics. Includes over 120+ customizable components, glow tokens, and dark layouts."
  );
  const [images, setImages] = useState<string[]>([
    "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=800&auto=format&fit=crop&q=80",
  ]);
  const [fileType, setFileType] = useState(".fig");
  const [fileSizeBytes, setFileSizeBytes] = useState("92 MB");
  const [newImageUrl, setNewImageUrl] = useState("");
  const [showAddImageInput, setShowAddImageInput] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [publishedSlug, setPublishedSlug] = useState<string | null>(null);

  // 90% Net Payout Calculation
  const pricing = calculatePricing(priceInINR || 0);

  const selectedCategoryObj = CATEGORIES_LIST.find((c) => c.name === category);

  const handleCategoryChange = (newCat: CoreCategory) => {
    setCategory(newCat);
    const catObj = CATEGORIES_LIST.find((c) => c.name === newCat);
    if (catObj && catObj.subcategories.length > 0) {
      setSubcategory(catObj.subcategories[0]);
    }
  };

  const handleAddImage = (url: string) => {
    if (url.trim()) {
      setImages((prev) => [...prev, url.trim()]);
      setNewImageUrl("");
      setShowAddImageInput(false);
    }
  };

  const handleRemoveImage = (indexToRemove: number) => {
    setImages((prev) => prev.filter((_, idx) => idx !== indexToRemove));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !description.trim() || priceInINR < 0) {
      alert("Please fill in all required fields before publishing.");
      return;
    }

    setIsSubmitting(true);

    const slug =
      title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, "") || `asset-${Date.now()}`;

    const creatorObj: CreatorProfile = {
      id: "creator_ansh",
      name: userProfile.name || "Ansh Bhardwaj",
      username: userProfile.username || "buildwithansh",
      handle: `@${userProfile.username || "buildwithansh"}`,
      avatar: userProfile.avatar || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80",
      initials: "AB",
      badge: "Seller",
      bio: userProfile.bio || "Full-stack developer and UI designer building production-grade digital assets.",
      location: "Bengaluru, India",
      rating: 5.0,
      totalSales: 0,
      responseTime: "< 1 hour",
      joinedDate: "2026",
      verified: true,
      verifiedSeller: true,
    };

    const primaryThumbnail = images[0] || SAMPLE_PRESET_IMAGES[0];

    const newListing: AssetListing = {
      id: `asset_${Date.now()}`,
      slug,
      title: title.trim(),
      category,
      subcategory,
      priceInINR: Number(priceInINR),
      rating: 5.0,
      reviewCount: 0,
      salesCount: 0,
      seller: creatorObj,
      creator: creatorObj,
      thumbnailUrl: primaryThumbnail,
      previewImages: images.length > 0 ? images : [primaryThumbnail],
      description: description.trim(),
      shortDescription: description.trim().slice(0, 140) + "...",
      fullDescription: description.trim(),
      fileType,
      fileSizeBytes,
      fileFormatTags: [fileType, ".zip"],
      tags: [category.toLowerCase().split(" ")[0], subcategory.toLowerCase().replace(/[^a-z0-9]/g, ""), "verified"],
      detailedFeatures: [
        "Complete production-ready source files",
        "Clean architecture pattern & full commercial rights",
        "Lifetime updates with verified malware security check",
        "Detailed setup documentation & integration guide"
      ],
      softwareCompatibility: ["Cross-Platform", "Figma 2026", "VS Code"],
      licenseType: "Commercial License",
      deliveryType: "Instant ZIP Download",
      reviewStatus: "Verified & Approved",
      downloadUrl: "https://kreatestudio.dev/downloads/asset-package.zip",
      featured: false,
      isNew: true,
      createdAt: new Date().toISOString().split("T")[0],
    };

    setTimeout(() => {
      onAddListing(newListing);
      setIsSubmitting(false);
      setPublishedSlug(newListing.slug);
    }, 600);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8" id="sell-new-asset-page">
      
      {/* 1. Page Title & Subtitle */}
      <div className="border-b border-[#202C44] pb-6" id="upload-header">
        <h1 className="text-2xl sm:text-3xl font-heading font-extrabold text-white tracking-tight" id="upload-page-title">
          List a New Asset
        </h1>
        <p className="text-xs sm:text-sm text-[#7B8A90] mt-1" id="upload-page-subtitle">
          Fill in the details below — every listing is reviewed before going live.
        </p>
      </div>

      {/* Success Notification Banner */}
      {publishedSlug && (
        <div className="bg-emerald-950/60 border border-emerald-800 rounded-3xl p-6 sm:p-8 space-y-4 shadow-2xl animate-in fade-in">
          <div className="flex items-center gap-3">
            <CheckCircle2 className="w-8 h-8 text-emerald-400 shrink-0" />
            <div>
              <h3 className="text-lg font-heading font-extrabold text-white">Listing Published Successfully!</h3>
              <p className="text-xs text-emerald-300">
                Your asset is now live in the marketplace, visible on your profile and dashboard.
              </p>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-3 pt-2">
            <button
              onClick={() => navigate(`/listing/${publishedSlug}`)}
              className="bg-[#D3CCB0] text-[#000000] text-xs font-bold px-5 py-2.5 rounded-xl shadow active:scale-95"
            >
              View Marketplace Listing →
            </button>
            <button
              onClick={() => navigate(`/profile/${userProfile.username || "buildwithansh"}`)}
              className="bg-[#202C44] text-[#D3CCB0] text-xs font-bold px-5 py-2.5 rounded-xl border border-[#202C44]"
            >
              Go to Profile
            </button>
            <button
              onClick={() => {
                setPublishedSlug(null);
                setTitle("");
                setDescription("");
              }}
              className="text-xs text-[#7B8A90] hover:text-white px-3 py-2"
            >
              Publish Another Asset
            </button>
          </div>
        </div>
      )}

      {/* 2-Column Split: Form (Left) and Live Preview (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Column: Form Fields (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          <form onSubmit={handleSubmit} className="space-y-6" id="upload-asset-form">
            
            {/* Asset Title */}
            <div className="bg-[#111317] border border-[#202C44] rounded-2xl p-6 space-y-2">
              <label className="block text-xs font-medium text-white" htmlFor="field-title">
                Title *
              </label>
              <input
                id="field-title"
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Neo Bharat Cyberpunk UI Kit"
                className="w-full bg-[#000000] text-white text-xs px-4 py-3 rounded-xl border border-[#202C44] focus:outline-none focus:border-[#D3CCB0] transition-colors"
              />
            </div>

            {/* Category Selection & Subcategory */}
            <div className="bg-[#111317] border border-[#202C44] rounded-2xl p-6 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-white mb-1.5" htmlFor="field-category">
                    Category *
                  </label>
                  <select
                    id="field-category"
                    value={category}
                    onChange={(e) => handleCategoryChange(e.target.value as CoreCategory)}
                    className="w-full bg-[#000000] text-white text-xs px-3.5 py-3 rounded-xl border border-[#202C44] focus:outline-none focus:border-[#D3CCB0]"
                  >
                    {CATEGORIES_LIST.map((c) => (
                      <option key={c.name} value={c.name}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-[#7B8A90] mb-1.5" htmlFor="field-subcategory">
                    Subcategory
                  </label>
                  <select
                    id="field-subcategory"
                    value={subcategory}
                    onChange={(e) => setSubcategory(e.target.value)}
                    className="w-full bg-[#000000] text-white text-xs px-3.5 py-3 rounded-xl border border-[#202C44] focus:outline-none focus:border-[#D3CCB0]"
                  >
                    {selectedCategoryObj?.subcategories.map((sub) => (
                      <option key={sub} value={sub}>
                        {sub}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 pt-2 border-t border-[#202C44]">
                <div>
                  <label className="block text-[11px] text-[#7B8A90] mb-1 font-mono">Primary File Type</label>
                  <input
                    type="text"
                    value={fileType}
                    onChange={(e) => setFileType(e.target.value)}
                    placeholder=".fig"
                    className="w-full bg-[#000000] text-white text-xs px-3 py-2 rounded-xl border border-[#202C44] font-mono"
                  />
                </div>
                <div>
                  <label className="block text-[11px] text-[#7B8A90] mb-1 font-mono">Package Size</label>
                  <input
                    type="text"
                    value={fileSizeBytes}
                    onChange={(e) => setFileSizeBytes(e.target.value)}
                    placeholder="92 MB"
                    className="w-full bg-[#000000] text-white text-xs px-3 py-2 rounded-xl border border-[#202C44] font-mono"
                  />
                </div>
              </div>
            </div>

            {/* Price in INR (₹) */}
            <div className="bg-[#111317] border border-[#202C44] rounded-2xl p-6 space-y-2">
              <label className="block text-xs font-medium text-white" htmlFor="field-price">
                Price in INR (₹) *
              </label>
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-sm font-bold text-[#D3CCB0]">
                  ₹
                </span>
                <input
                  id="field-price"
                  type="number"
                  required
                  min={0}
                  step={50}
                  value={priceInINR}
                  onChange={(e) => setPriceInINR(Number(e.target.value) || 0)}
                  placeholder="499"
                  className="w-full bg-[#000000] text-white text-sm font-mono font-bold pl-8 pr-4 py-3 rounded-xl border border-[#202C44] focus:outline-none focus:border-[#D3CCB0]"
                />
              </div>
            </div>

            {/* Description text area */}
            <div className="bg-[#111317] border border-[#202C44] rounded-2xl p-6 space-y-2">
              <label className="block text-xs font-medium text-white" htmlFor="field-description">
                Description *
              </label>
              <textarea
                id="field-description"
                rows={4}
                required
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe your digital asset, what's included, framework compatibility, and key features..."
                className="w-full bg-[#000000] text-white text-xs px-4 py-3 rounded-xl border border-[#202C44] focus:outline-none focus:border-[#D3CCB0] leading-relaxed"
              />
            </div>

            {/* Preview Images upload area with a grid for multiple images and a "+" button */}
            <div className="bg-[#111317] border border-[#202C44] rounded-2xl p-6 space-y-4" id="preview-images-section">
              <div className="flex items-center justify-between">
                <div>
                  <label className="block text-xs font-medium text-white">
                    Preview Images ({images.length})
                  </label>
                  <p className="text-[11px] text-[#7B8A90]">
                    Upload screenshots or visual mockups showing your digital asset.
                  </p>
                </div>
              </div>

              {/* Images Grid with "+" Button */}
              <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
                {images.map((imgUrl, index) => (
                  <div
                    key={index}
                    className="group relative aspect-video rounded-xl overflow-hidden border border-[#202C44] bg-[#000000]"
                  >
                    <img
                      src={imgUrl}
                      alt={`Preview ${index + 1}`}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                    />
                    <button
                      type="button"
                      onClick={() => handleRemoveImage(index)}
                      className="absolute top-1 right-1 bg-[#000000]/80 hover:bg-rose-600 text-white p-1 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity"
                      title="Remove image"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                    {index === 0 && (
                      <span className="absolute bottom-1 left-1 bg-[#000000]/80 text-[#D3CCB0] text-[9px] font-mono px-1.5 py-0.5 rounded">
                        Cover
                      </span>
                    )}
                  </div>
                ))}

                {/* The "+" Button to Add Image */}
                <button
                  type="button"
                  id="add-preview-image-button"
                  onClick={() => setShowAddImageInput(!showAddImageInput)}
                  className="aspect-video rounded-xl border-2 border-dashed border-[#202C44] hover:border-[#D3CCB0] bg-[#202C44]/20 hover:bg-[#202C44]/40 flex flex-col items-center justify-center gap-1 transition-all text-[#7B8A90] hover:text-[#D3CCB0]"
                >
                  <Plus className="w-5 h-5" />
                  <span className="text-[10px] font-mono font-medium">Add Image</span>
                </button>
              </div>

              {/* Popover / Input to insert image URL or preset */}
              {showAddImageInput && (
                <div className="bg-[#202C44]/40 border border-[#202C44] p-4 rounded-xl space-y-3">
                  <div className="flex items-center gap-2">
                    <input
                      type="url"
                      placeholder="Paste image URL (https://...)"
                      value={newImageUrl}
                      onChange={(e) => setNewImageUrl(e.target.value)}
                      className="flex-1 bg-[#000000] text-white text-xs px-3 py-2 rounded-xl border border-[#202C44] focus:outline-none focus:border-[#D3CCB0]"
                    />
                    <button
                      type="button"
                      onClick={() => handleAddImage(newImageUrl)}
                      className="bg-[#D3CCB0] text-[#000000] text-xs font-bold px-3 py-2 rounded-xl shadow"
                    >
                      Add
                    </button>
                  </div>

                  {/* Preset quick pickers */}
                  <div className="space-y-1.5 pt-1">
                    <span className="text-[10px] text-[#7B8A90] font-mono block">Or pick a curated sample image:</span>
                    <div className="flex flex-wrap gap-2">
                      {SAMPLE_PRESET_IMAGES.map((preset, i) => (
                        <button
                          key={i}
                          type="button"
                          onClick={() => handleAddImage(preset)}
                          className="w-10 h-7 rounded-lg overflow-hidden border border-[#202C44] hover:border-[#D3CCB0] transition-colors"
                        >
                          <img src={preset} alt="preset" className="w-full h-full object-cover" />
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Earnings Preview (Bottom of Form): Dark box showing "You'll receive ₹[90% of price]" and "90% of listed price" label */}
            <div className="bg-[#111317] border border-[#202C44] rounded-2xl p-6 space-y-3 shadow-lg" id="earnings-preview-box">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono uppercase tracking-wider text-[#7B8A90]">
                  Earnings Preview
                </span>
                <span className="text-[10px] font-mono text-[#D3CCB0] bg-[#202C44] px-2 py-0.5 rounded">
                  90% Payout Rule
                </span>
              </div>

              <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2 pt-1 border-t border-[#202C44]">
                <div>
                  <div className="text-2xl sm:text-3xl font-heading font-extrabold text-emerald-400 font-mono tracking-tight" id="earnings-receive-amount">
                    You'll receive ₹{pricing.sellerNetINR.toLocaleString("en-IN")}
                  </div>
                  <div className="text-xs text-[#7B8A90] mt-0.5" id="earnings-percentage-label">
                    90% of listed price
                  </div>
                </div>

                <div className="text-right text-[11px] text-[#7B8A90] font-mono">
                  <div>Platform fee: ₹{pricing.platformFeeINR} (12.5%)</div>
                  <div className="text-white">Buyer pays: ₹{pricing.buyerTotalINR}</div>
                </div>
              </div>
            </div>

            {/* Primary Action: Large Cream "Publish Listing" Button */}
            <div className="pt-2">
              <button
                type="submit"
                id="publish-listing-btn"
                disabled={isSubmitting}
                className="w-full bg-[#D3CCB0] hover:bg-[#c4bb9a] text-[#000000] font-heading font-extrabold text-sm sm:text-base py-4 rounded-2xl shadow-xl transition-all active:scale-98 disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {isSubmitting ? (
                  <span>Publishing Listing...</span>
                ) : (
                  <>
                    <span>Publish Listing</span>
                    <ArrowRight className="w-5 h-5 text-[#000000]" />
                  </>
                )}
              </button>
            </div>

          </form>
        </div>

        {/* Right Column: Sticky Live Preview (5 cols) */}
        <div className="lg:col-span-5 lg:sticky lg:top-24 space-y-4" id="live-preview-container">
          
          <div className="flex items-center justify-between px-1">
            <div className="flex items-center gap-2 text-xs font-bold text-white uppercase tracking-wider font-mono">
              <Eye className="w-4 h-4 text-[#D3CCB0]" />
              <span>Live Marketplace Preview</span>
            </div>
            <span className="text-[10px] text-emerald-400 font-mono flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              Real-time update
            </span>
          </div>

          {/* Marketplace Card Preview Component */}
          <div className="bg-[#111317] border border-[#202C44] rounded-3xl overflow-hidden shadow-2xl space-y-0 transition-all group hover:border-[#D3CCB0]/50">
            
            {/* Card Image Banner */}
            <div className="aspect-video w-full relative bg-[#000000] overflow-hidden">
              <img
                src={images[0] || SAMPLE_PRESET_IMAGES[0]}
                alt={title || "Asset Preview"}
                className="w-full h-full object-cover"
              />
              
              {/* Category Badge */}
              <div className="absolute top-3 left-3 flex items-center gap-1.5">
                <span className="bg-[#000000]/80 backdrop-blur-md text-[#D3CCB0] text-[10px] font-mono font-bold px-2 py-0.5 rounded-md border border-[#202C44]">
                  {fileType}
                </span>
                <span className="bg-[#202C44]/90 backdrop-blur-md text-white text-[10px] font-medium px-2 py-0.5 rounded-md border border-[#202C44]">
                  {category}
                </span>
              </div>

              <div className="absolute top-3 right-3">
                <span className="bg-emerald-950/80 backdrop-blur-md text-emerald-400 text-[10px] font-mono font-bold px-2 py-0.5 rounded-md border border-emerald-800 flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" />
                  Verified
                </span>
              </div>
            </div>

            {/* Card Content Details */}
            <div className="p-5 space-y-3">
              
              {/* Creator row */}
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-md bg-[#202C44] text-[#D3CCB0] text-[10px] font-mono font-bold flex items-center justify-center border border-[#202C44]">
                  AB
                </div>
                <span className="text-xs text-[#7B8A90] font-medium">
                  {userProfile.name || "Ansh Bhardwaj"}
                </span>
                <span className="text-[10px] text-[#7B8A90] font-mono">
                  (@{userProfile.username || "buildwithansh"})
                </span>
              </div>

              {/* Title */}
              <h3 className="text-base font-heading font-bold text-white line-clamp-1 group-hover:text-[#D3CCB0] transition-colors">
                {title || "Untitled Asset Listing"}
              </h3>

              {/* Description Snippet */}
              <p className="text-xs text-[#7B8A90] line-clamp-2 leading-relaxed">
                {description || "Add a description to preview how your listing copy appears to prospective buyers."}
              </p>

              {/* Footer row: Price & Buy Button */}
              <div className="pt-3 border-t border-[#202C44] flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-[#7B8A90] uppercase font-mono block">Price</span>
                  <span className="text-base font-bold font-mono text-white">
                    {priceInINR === 0 ? "FREE" : `₹${priceInINR.toLocaleString("en-IN")}`}
                  </span>
                </div>

                <div className="bg-[#D3CCB0] text-[#000000] text-xs font-bold px-4 py-2 rounded-xl flex items-center gap-1 shadow">
                  <span>Buy Now</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </div>
              </div>

            </div>

          </div>

          {/* Guarantee Checklist */}
          <div className="bg-[#111317]/60 border border-[#202C44] rounded-2xl p-4 space-y-2 text-xs text-[#7B8A90]">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
              <span>Instant digital fulfillment via uncompressed ZIP</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
              <span>Commercial license key issued to buyer</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
              <span>Automated 90% payout direct to your UPI</span>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
};

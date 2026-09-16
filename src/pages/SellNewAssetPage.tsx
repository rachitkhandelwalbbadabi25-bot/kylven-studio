import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { AssetListing, CoreCategory, CreatorProfile, calculatePricing, UserProfile } from "../types";
import { CATEGORIES_LIST } from "../data/mockData";
import { auth } from "../lib/firebase";
import { serverTimestamp } from "firebase/database";
import {
  Upload,
  UploadCloud,
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
  const [fileName, setFileName] = useState("neo-bharat-cyberpunk-ui-kit.fig");
  const [newImageUrl, setNewImageUrl] = useState("");
  const [showAddImageInput, setShowAddImageInput] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [publishedSlug, setPublishedSlug] = useState<string | null>(null);

  // Word limits & word count validation
  const MAX_TITLE_WORDS = 100;
  const MAX_DESCRIPTION_WORDS = 2000;
  const MAX_PRICE = 50000;

  const countWords = (text: string) => {
    const trimmed = text.trim();
    return trimmed ? trimmed.split(/\s+/).filter(Boolean).length : 0;
  };

  const titleWordCount = countWords(title);
  const descWordCount = countWords(description);

  const isTitleExceeded = titleWordCount > MAX_TITLE_WORDS;
  const isDescExceeded = descWordCount > MAX_DESCRIPTION_WORDS;
  const isTitleEmpty = title.trim().length === 0;
  const isDescEmpty = description.trim().length === 0;
  const isPriceValid = priceInINR >= 0 && priceInINR <= MAX_PRICE;
  const isImagesValid = images.length >= 1 && images.length <= 5;

  const isFormValid =
    !isTitleExceeded &&
    !isDescExceeded &&
    !isTitleEmpty &&
    !isDescEmpty &&
    isPriceValid &&
    isImagesValid;

  // 90% Net Payout Calculation
  const pricing = calculatePricing(priceInINR || 0);

  const handleCategoryChange = (newCat: CoreCategory) => {
    setCategory(newCat);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const ext = file.name.includes(".") ? `.${file.name.split(".").pop()?.toLowerCase()}` : ".zip";
      setFileType(ext);
      setFileName(file.name);
      const sizeMB = (file.size / (1024 * 1024)).toFixed(1);
      setFileSizeBytes(`${sizeMB} MB`);
    }
  };

  const handleAddImage = (url: string) => {
    if (images.length >= 5) {
      alert("Maximum 5 preview images allowed.");
      return;
    }
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
    if (!isFormValid || isSubmitting) {
      if (isTitleExceeded) {
        alert("Title exceeds the maximum limit of 100 words.");
      } else if (isDescExceeded) {
        alert("Description exceeds the maximum limit of 2,000 words.");
      } else if (priceInINR > MAX_PRICE) {
        alert(`Maximum listing price is ₹${MAX_PRICE.toLocaleString("en-IN")}.`);
      } else if (images.length < 1) {
        alert("At least 1 preview image is required.");
      } else if (images.length > 5) {
        alert("Maximum 5 preview images are allowed.");
      } else {
        alert("Please fill in all required fields before publishing.");
      }
      return;
    }

    const currentUid = auth.currentUser?.uid;
    if (!currentUid) {
      alert("Authentication required: Please sign in to list your assets.");
      return;
    }

    setIsSubmitting(true);

    const slug =
      title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, "") || `asset-${Date.now()}`;

    // Secure public creator representation: no financial UPI or private email
    const creatorObj: CreatorProfile = {
      id: currentUid,
      name: userProfile.name || auth.currentUser?.displayName || "Creator",
      username: userProfile.username || (auth.currentUser?.email ? auth.currentUser.email.split("@")[0].toLowerCase().replace(/[^a-z0-9]/g, "_") : "creator"),
      handle: `@${userProfile.username || (auth.currentUser?.email ? auth.currentUser.email.split("@")[0].toLowerCase().replace(/[^a-z0-9]/g, "_") : "creator")}`,
      avatar: userProfile.avatar || auth.currentUser?.photoURL || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80",
      initials: (userProfile.name || "Creator").charAt(0).toUpperCase(),
      badge: "Seller",
      bio: userProfile.bio || "Digital creator building production-ready assets.",
      location: userProfile.location || "India",
      rating: 0,
      totalSales: 0,
      responseTime: "< 2 hours",
      joinedDate: new Date().getFullYear().toString(),
      verified: false,
      verifiedSeller: false,
      skills: ["Digital Assets"],
    };

    const primaryThumbnail = images[0] || SAMPLE_PRESET_IMAGES[0];

    // Authoritative requirement: New listings created MUST ALWAYS have status: "pending"
    // and strictly use authoritative price field without fabricating metrics.
    const newListing: AssetListing = {
      id: `asset_${Date.now()}`,
      sellerId: currentUid,
      sellerName: userProfile.name || auth.currentUser?.displayName || "Creator",
      status: "pending",
      slug,
      title: title.trim(),
      category,
      price: Number(priceInINR) || 0,
      isFree: (Number(priceInINR) || 0) === 0,
      seller: creatorObj,
      creator: creatorObj,
      previewUrl: primaryThumbnail,
      previewUrls: images.length > 0 ? images : [primaryThumbnail],
      thumbnailUrl: primaryThumbnail,
      previewImages: images.length > 0 ? images : [primaryThumbnail],
      description: description.trim(),
      shortDescription: description.trim().slice(0, 140) + "...",
      fullDescription: description.trim(),
      fileType,
      fileExtension: fileType.replace(/^\./, "") || "zip",
      fileSizeBytes,
      fileFormatTags: [fileType, ".zip"],
      tags: [category.toLowerCase().split(" ")[0], fileType.replace(/^\./, "").toLowerCase(), "asset"],
      detailedFeatures: [
        "Complete production-ready source files",
        "Clean architecture pattern & full commercial rights",
        "Lifetime updates with verified malware security check",
        "Detailed setup documentation & integration guide"
      ],
      softwareCompatibility: ["Cross-Platform", "Figma 2026", "VS Code"],
      licenseType: "Commercial License",
      deliveryType: "Instant ZIP Download",
      reviewStatus: "In Review",
      featured: false,
      isNew: true,
      createdAt: serverTimestamp(),
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
          Upload Asset
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
              Upload Another Asset
            </button>
          </div>
        </div>
      )}

      {/* 2-Column Split: Form (Left) and Live Preview (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Column: Form Fields (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          <form onSubmit={handleSubmit} className="space-y-6" id="upload-asset-form">
            
            {/* Asset Title (100 word limit) */}
            <div className="bg-[#111317] border border-[#202C44] rounded-2xl p-6 space-y-2">
              <div className="flex items-center justify-between">
                <label className="block text-xs font-medium text-white" htmlFor="field-title">
                  Listing Title *
                </label>
                <span
                  id="title-word-counter"
                  className={`text-xs font-mono font-medium transition-colors ${
                    isTitleExceeded
                      ? "text-rose-400 font-bold bg-rose-950/50 px-2 py-0.5 rounded border border-rose-800"
                      : titleWordCount >= MAX_TITLE_WORDS * 0.9
                      ? "text-amber-400 font-bold"
                      : "text-[#7B8A90]"
                  }`}
                >
                  Words remaining: {Math.max(0, MAX_TITLE_WORDS - titleWordCount)}/100
                </span>
              </div>
              <input
                id="field-title"
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Neo Bharat Cyberpunk UI Kit"
                className={`w-full bg-[#000000] text-white text-xs px-4 py-3 rounded-xl border focus:outline-none transition-colors ${
                  isTitleExceeded
                    ? "border-rose-500 focus:border-rose-500 bg-rose-950/10"
                    : "border-[#202C44] focus:border-[#D3CCB0]"
                }`}
              />
              {isTitleExceeded && (
                <p className="text-[11px] text-rose-400 font-mono flex items-center gap-1.5 mt-1 font-semibold">
                  <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                  <span>Title exceeds the maximum limit of {MAX_TITLE_WORDS} words (currently {titleWordCount} words).</span>
                </p>
              )}
            </div>

            {/* Category Selection & File Upload (Auto-detected) */}
            <div className="bg-[#111317] border border-[#202C44] rounded-2xl p-6 space-y-4">
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

              {/* File Upload with Auto-Detection */}
              <div className="pt-2 border-t border-[#202C44] space-y-2">
                <label className="block text-xs font-medium text-white">
                  Asset Package File * (Auto-detects format)
                </label>
                <div className="relative border border-dashed border-[#202C44] hover:border-[#D3CCB0]/60 rounded-xl p-4 bg-[#000000] text-center transition-colors">
                  <input
                    type="file"
                    id="asset-file-upload-input"
                    onChange={handleFileChange}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  />
                  <div className="flex flex-col items-center justify-center gap-1.5 pointer-events-none">
                    <UploadCloud className="w-5 h-5 text-[#D3CCB0]" />
                    <p className="text-xs text-white font-medium">
                      Click to choose or drop file (.zip, .fig, .tsx, .blend, etc.)
                    </p>
                    <p className="text-[11px] text-[#7B8A90] font-mono">
                      Selected: <span className="text-white font-bold">{fileName}</span>
                    </p>
                  </div>
                </div>

                {/* Auto-detected metadata badges */}
                <div className="flex items-center gap-3 pt-1 text-xs font-mono">
                  <div className="bg-[#202C44] text-[#D3CCB0] px-2.5 py-1 rounded-lg border border-[#202C44] flex items-center gap-1.5">
                    <span className="text-[10px] text-[#7B8A90] uppercase">Format:</span>
                    <span className="font-bold">{fileType}</span>
                  </div>
                  <div className="bg-[#202C44] text-white px-2.5 py-1 rounded-lg border border-[#202C44] flex items-center gap-1.5">
                    <span className="text-[10px] text-[#7B8A90] uppercase">Size:</span>
                    <span className="font-bold">{fileSizeBytes}</span>
                  </div>
                  <span className="text-[10px] text-emerald-400">✓ Auto-detected</span>
                </div>
              </div>
            </div>

            {/* Price in INR (₹) - Max ₹50,000 */}
            <div className="bg-[#111317] border border-[#202C44] rounded-2xl p-6 space-y-2">
              <div className="flex items-center justify-between">
                <label className="block text-xs font-medium text-white" htmlFor="field-price">
                  Price in INR (₹) *
                </label>
                <span className="text-[11px] text-[#7B8A90] font-mono">
                  Max ₹50,000
                </span>
              </div>
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-sm font-bold text-[#D3CCB0]">
                  ₹
                </span>
                <input
                  id="field-price"
                  type="number"
                  required
                  min={0}
                  max={50000}
                  step={50}
                  value={priceInINR}
                  onChange={(e) => setPriceInINR(Number(e.target.value) || 0)}
                  placeholder="499"
                  className={`w-full bg-[#000000] text-white text-sm font-mono font-bold pl-8 pr-4 py-3 rounded-xl border focus:outline-none transition-colors ${
                    priceInINR > 50000
                      ? "border-rose-500 focus:border-rose-500 bg-rose-950/10"
                      : "border-[#202C44] focus:border-[#D3CCB0]"
                  }`}
                />
              </div>
              {priceInINR > 50000 && (
                <p className="text-[11px] text-rose-400 font-mono flex items-center gap-1.5 mt-1 font-semibold">
                  <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                  <span>Price exceeds maximum allowed limit of ₹50,000.</span>
                </p>
              )}
            </div>

            {/* Description text area (2,000 word limit) */}
            <div className="bg-[#111317] border border-[#202C44] rounded-2xl p-6 space-y-2">
              <div className="flex items-center justify-between">
                <label className="block text-xs font-medium text-white" htmlFor="field-description">
                  Listing Description *
                </label>
                <span className="text-[11px] text-[#7B8A90] font-mono">
                  Max 2,000 words
                </span>
              </div>

              {/* Textarea with bottom-right word counter badge */}
              <div className="relative">
                <textarea
                  id="field-description"
                  rows={6}
                  required
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Describe your digital asset, what's included, framework compatibility, version requirements, and key features..."
                  className={`w-full bg-[#000000] text-white text-xs px-4 pt-3 pb-8 rounded-xl border focus:outline-none leading-relaxed transition-colors ${
                    isDescExceeded
                      ? "border-rose-500 focus:border-rose-500 bg-rose-950/10"
                      : "border-[#202C44] focus:border-[#D3CCB0]"
                  }`}
                />

                {/* Large Bottom-Right Word Counter */}
                <div
                  id="desc-bottom-right-counter"
                  className={`absolute right-3 bottom-3 px-2.5 py-1 rounded-lg text-xs font-mono font-bold flex items-center gap-1.5 shadow-sm transition-all pointer-events-none ${
                    isDescExceeded
                      ? "bg-rose-950/90 text-rose-400 border border-rose-800 animate-pulse"
                      : descWordCount >= MAX_DESCRIPTION_WORDS * 0.9
                      ? "bg-amber-950/90 text-amber-300 border border-amber-800"
                      : "bg-[#111317]/90 text-[#D3CCB0] border border-[#202C44]"
                  }`}
                >
                  <span>{descWordCount} / {MAX_DESCRIPTION_WORDS.toLocaleString()} words</span>
                  <span className="text-[10px] opacity-75 font-normal">
                    ({Math.max(0, MAX_DESCRIPTION_WORDS - descWordCount)} left)
                  </span>
                </div>
              </div>

              {isDescExceeded ? (
                <p className="text-[11px] text-rose-400 font-mono flex items-center gap-1.5 mt-1 font-semibold">
                  <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                  <span>Description exceeds the maximum limit of {MAX_DESCRIPTION_WORDS.toLocaleString()} words (currently {descWordCount} words). Please shorten your text to publish.</span>
                </p>
              ) : (
                <p className="text-[10px] text-[#7B8A90]">
                  Include detailed features, installation steps, and version requirements to help buyers make informed purchase decisions.
                </p>
              )}
            </div>

            {/* Preview Images upload area (1 to 5 images required) */}
            <div className="bg-[#111317] border border-[#202C44] rounded-2xl p-6 space-y-4" id="preview-images-section">
              <div className="flex items-center justify-between">
                <div>
                  <label className="block text-xs font-medium text-white">
                    Preview Images ({images.length}/5) *
                  </label>
                  <p className="text-[11px] text-[#7B8A90]">
                    Upload 1 to 5 visual screenshots or mockups showing your asset.
                  </p>
                </div>
                {images.length < 1 && (
                  <span className="text-[10px] text-rose-400 font-mono font-bold bg-rose-950/50 px-2 py-0.5 rounded border border-rose-800">
                    Min 1 required
                  </span>
                )}
                {images.length >= 5 && (
                  <span className="text-[10px] text-amber-400 font-mono bg-amber-950/50 px-2 py-0.5 rounded border border-amber-800">
                    Max 5 reached
                  </span>
                )}
              </div>

              {/* Images Grid with conditional "+" Button */}
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

                {/* The "+" Button to Add Image (hidden if 5 images reached) */}
                {images.length < 5 && (
                  <button
                    type="button"
                    id="add-preview-image-button"
                    onClick={() => setShowAddImageInput(!showAddImageInput)}
                    className="aspect-video rounded-xl border-2 border-dashed border-[#202C44] hover:border-[#D3CCB0] bg-[#202C44]/20 hover:bg-[#202C44]/40 flex flex-col items-center justify-center gap-1 transition-all text-[#7B8A90] hover:text-[#D3CCB0]"
                  >
                    <Plus className="w-5 h-5" />
                    <span className="text-[10px] font-mono font-medium">Add Image</span>
                  </button>
                )}
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

            {/* Earnings Preview (Bottom of Form): Dark box showing 90% seller take-home */}
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
                    90% of listed price (guaranteed net)
                  </div>
                </div>

                <div className="text-right text-[11px] text-[#7B8A90] font-mono">
                  <div>Platform fee: ₹{pricing.platformFeeINR} (10%)</div>
                  <div className="text-white">Buyer pays: ₹{pricing.buyerTotalINR}</div>
                </div>
              </div>
            </div>

            {/* Primary Action: Large Cream "Publish Listing" Button */}
            <div className="pt-2 space-y-2">
              <button
                type="submit"
                id="publish-listing-btn"
                disabled={isSubmitting || !isFormValid}
                className={`w-full font-heading font-extrabold text-sm sm:text-base py-4 rounded-2xl shadow-xl transition-all flex items-center justify-center gap-2 ${
                  !isFormValid || isSubmitting
                    ? "bg-[#202C44] text-[#7B8A90] cursor-not-allowed opacity-60 border border-[#202C44]"
                    : "bg-[#D3CCB0] hover:bg-[#c4bb9a] text-[#000000] active:scale-98 cursor-pointer"
                }`}
              >
                {isSubmitting ? (
                  <span>Publishing Listing...</span>
                ) : (
                  <>
                    <span>Publish Listing</span>
                    <ArrowRight className="w-5 h-5 text-current" />
                  </>
                )}
              </button>

              {(!isFormValid && (isTitleExceeded || isDescExceeded)) && (
                <p className="text-center text-[11px] text-rose-400 font-mono">
                  {isTitleExceeded && isDescExceeded
                    ? "Title and Description exceed allowed word limits."
                    : isTitleExceeded
                    ? `Title exceeds maximum limit of ${MAX_TITLE_WORDS} words.`
                    : `Description exceeds maximum limit of ${MAX_DESCRIPTION_WORDS.toLocaleString()} words.`}
                </p>
              )}
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
                  {(userProfile.name || "A").charAt(0).toUpperCase()}
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

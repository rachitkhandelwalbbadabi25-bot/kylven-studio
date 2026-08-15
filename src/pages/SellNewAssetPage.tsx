import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { AssetListing, CoreCategory, CreatorProfile, calculatePricing, UserProfile } from "../types";
import { CATEGORIES_LIST, FILE_FORMATS_CATALOG } from "../data/mockData";
import {
  Upload,
  PlusCircle,
  IndianRupee,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  ShieldCheck,
  Zap,
  ArrowRight,
  FileCode
} from "lucide-react";

interface SellNewAssetPageProps {
  onAddListing: (newListing: AssetListing) => void;
  userProfile: UserProfile;
}

export const SellNewAssetPage: React.FC<SellNewAssetPageProps> = ({
  onAddListing,
  userProfile,
}) => {
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [category, setCategory] = useState<CoreCategory>("Software & Development");
  const [subcategory, setSubcategory] = useState("Flutter Templates");
  const [priceInINR, setPriceInINR] = useState<number>(1499);
  const [shortDescription, setShortDescription] = useState("");
  const [fullDescription, setFullDescription] = useState("");
  const [fileType, setFileType] = useState(".zip");
  const [fileFormatTags, setFileFormatTags] = useState<string[]>([".dart", ".flutter", ".zip"]);
  const [fileSizeBytes, setFileSizeBytes] = useState("45 MB");
  const [thumbnailUrl, setThumbnailUrl] = useState("https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&auto=format&fit=crop&q=80");
  const [licenseType, setLicenseType] = useState<"Standard Commercial License" | "Extended Commercial License" | "MIT Open License">("Standard Commercial License");
  const [featureInputs, setFeatureInputs] = useState<string>("Complete source code\nClean architecture pattern\nDocumentation & setup guide\nInstant lifetime updates");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [createdListingSlug, setCreatedListingSlug] = useState<string | null>(null);

  const pricing = calculatePricing(priceInINR || 0);

  // Update subcategory options based on selected category
  const selectedCategoryObj = CATEGORIES_LIST.find((c) => c.name === category);

  const handleCategoryChange = (newCat: CoreCategory) => {
    setCategory(newCat);
    const catObj = CATEGORIES_LIST.find((c) => c.name === newCat);
    if (catObj && catObj.subcategories.length > 0) {
      setSubcategory(catObj.subcategories[0]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !shortDescription.trim() || priceInINR <= 0) {
      alert("Please fill in all required asset fields.");
      return;
    }

    setIsSubmitting(true);

    const slug = title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "") || `asset-${Date.now()}`;

    const creatorObj: CreatorProfile = {
      id: "creator_current",
      name: userProfile.name || "Aarav Sharma",
      username: userProfile.username || "aarav_ui",
      handle: `@${userProfile.username || "aarav_ui"}`,
      avatar: userProfile.avatar || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80",
      bio: userProfile.bio || "Digital creator on Kreate Studio",
      location: "India",
      rating: 5.0,
      totalSales: 0,
      responseTime: "< 1 hour",
      joinedDate: "2026",
      verified: true,
      verifiedSeller: true,
    };

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
      thumbnailUrl,
      previewImages: [
        thumbnailUrl,
        "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&auto=format&fit=crop&q=80"
      ],
      description: shortDescription.trim(),
      shortDescription: shortDescription.trim(),
      fullDescription: fullDescription.trim() || shortDescription.trim(),
      fileType,
      fileSizeBytes,
      fileFormatTags,
      tags: [category.toLowerCase().split(" ")[0], subcategory.toLowerCase().replace(/[^a-z0-9]/g, ""), "new"],
      detailedFeatures: featureInputs.split("\n").filter((f) => f.trim().length > 0),
      softwareCompatibility: ["Latest SDK", "Cross-Platform", "Standard Editors"],
      licenseType,
      deliveryType: "Instant ZIP Download",
      reviewStatus: "Verified & Approved",
      downloadUrl: "https://kreatestudio.in/downloads/asset-package.zip",
      featured: false,
      isNew: true,
      createdAt: new Date().toISOString().split("T")[0],
    };

    setTimeout(() => {
      onAddListing(newListing);
      setIsSubmitting(false);
      setCreatedListingSlug(newListing.slug);
    }, 800);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      {/* Header */}
      <div className="border-b border-[#202C44] pb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 bg-[#202C44] text-[#D3CCB0] text-xs font-mono font-bold px-3 py-1 rounded-full border border-[#202C44] mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            <span>90% Creator Revenue Split</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-heading font-extrabold text-white tracking-tight">
            Publish New Digital Asset
          </h1>
          <p className="text-xs text-[#7B8A90] mt-1">
            Upload your source package, set your price in INR, and reach Indian developers & creators instantly.
          </p>
        </div>

        <div className="bg-[#111317] border border-[#202C44] px-4 py-2.5 rounded-2xl text-xs text-right">
          <span className="text-[10px] text-[#7B8A90] uppercase font-mono block">Listing Cost</span>
          <span className="font-heading font-extrabold text-emerald-400">₹0 (Free Forever)</span>
        </div>
      </div>

      {/* Success Notification Banner */}
      {createdListingSlug && (
        <div className="bg-emerald-950/40 border border-emerald-800/80 rounded-2xl p-6 space-y-3">
          <div className="flex items-center gap-3">
            <CheckCircle2 className="w-6 h-6 text-emerald-400 shrink-0" />
            <div>
              <h3 className="text-sm font-bold text-white">Asset Published Successfully!</h3>
              <p className="text-xs text-emerald-300">
                Your listing is live on the marketplace and ready for UPI purchases.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3 pt-2">
            <button
              onClick={() => navigate(`/listing/${createdListingSlug}`)}
              className="bg-[#D3CCB0] text-[#000000] text-xs font-bold px-4 py-2 rounded-xl"
            >
              View Live Listing →
            </button>
            <button
              onClick={() => {
                setCreatedListingSlug(null);
                setTitle("");
                setShortDescription("");
              }}
              className="text-xs text-[#7B8A90] hover:text-white"
            >
              Publish Another Asset
            </button>
          </div>
        </div>
      )}

      {/* Main Upload & Listing Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        
        {/* Step 1: General Details */}
        <div className="bg-[#111317] border border-[#202C44] rounded-2xl p-6 space-y-4">
          <h3 className="text-sm font-heading font-bold text-white flex items-center gap-2">
            <FileCode className="w-4 h-4 text-[#D3CCB0]" />
            <span>1. Asset Details & Sector</span>
          </h3>

          <div className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-white mb-1">
                Asset Title *
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Next.js 14 AI SaaS Starter Kit with Razorpay"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full bg-[#000000] text-white text-xs px-4 py-3 rounded-xl border border-[#202C44] focus:outline-none focus:border-[#D3CCB0]"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-[#7B8A90] mb-1">
                  Core Category Sector *
                </label>
                <select
                  value={category}
                  onChange={(e) => handleCategoryChange(e.target.value as CoreCategory)}
                  className="w-full bg-[#000000] text-white text-xs px-3 py-2.5 rounded-xl border border-[#202C44] focus:outline-none focus:border-[#D3CCB0]"
                >
                  {CATEGORIES_LIST.map((c) => (
                    <option key={c.name} value={c.name}>{c.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-[#7B8A90] mb-1">
                  Subcategory
                </label>
                <select
                  value={subcategory}
                  onChange={(e) => setSubcategory(e.target.value)}
                  className="w-full bg-[#000000] text-white text-xs px-3 py-2.5 rounded-xl border border-[#202C44] focus:outline-none focus:border-[#D3CCB0]"
                >
                  {selectedCategoryObj?.subcategories.map((sub) => (
                    <option key={sub} value={sub}>{sub}</option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-[#7B8A90] mb-1">
                Short Description (1-2 sentences) *
              </label>
              <input
                type="text"
                required
                placeholder="Clean, production-ready codebase with documentation and full commercial rights."
                value={shortDescription}
                onChange={(e) => setShortDescription(e.target.value)}
                className="w-full bg-[#000000] text-white text-xs px-4 py-2.5 rounded-xl border border-[#202C44] focus:outline-none focus:border-[#D3CCB0]"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-[#7B8A90] mb-1">
                Detailed Specifications & Features (one per line)
              </label>
              <textarea
                rows={3}
                value={featureInputs}
                onChange={(e) => setFeatureInputs(e.target.value)}
                className="w-full bg-[#000000] text-white text-xs px-4 py-2.5 rounded-xl border border-[#202C44] focus:outline-none focus:border-[#D3CCB0] font-mono"
              />
            </div>
          </div>
        </div>

        {/* Step 2: Files & Media */}
        <div className="bg-[#111317] border border-[#202C44] rounded-2xl p-6 space-y-4">
          <h3 className="text-sm font-heading font-bold text-white flex items-center gap-2">
            <Upload className="w-4 h-4 text-[#D3CCB0]" />
            <span>2. Files & Preview Visuals</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs text-[#7B8A90] mb-1">Primary File Type</label>
              <input
                type="text"
                value={fileType}
                onChange={(e) => setFileType(e.target.value)}
                placeholder=".zip"
                className="w-full bg-[#000000] text-white text-xs px-3 py-2.5 rounded-xl border border-[#202C44] font-mono"
              />
            </div>

            <div>
              <label className="block text-xs text-[#7B8A90] mb-1">Package Size</label>
              <input
                type="text"
                value={fileSizeBytes}
                onChange={(e) => setFileSizeBytes(e.target.value)}
                placeholder="45 MB"
                className="w-full bg-[#000000] text-white text-xs px-3 py-2.5 rounded-xl border border-[#202C44] font-mono"
              />
            </div>

            <div>
              <label className="block text-xs text-[#7B8A90] mb-1">License Scope</label>
              <select
                value={licenseType}
                onChange={(e) => setLicenseType(e.target.value as any)}
                className="w-full bg-[#000000] text-white text-xs px-3 py-2.5 rounded-xl border border-[#202C44]"
              >
                <option value="Standard Commercial License">Standard Commercial</option>
                <option value="Extended Commercial License">Extended Commercial</option>
                <option value="MIT Open License">MIT Open License</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs text-[#7B8A90] mb-1">Preview Image URL</label>
            <input
              type="url"
              value={thumbnailUrl}
              onChange={(e) => setThumbnailUrl(e.target.value)}
              placeholder="https://..."
              className="w-full bg-[#000000] text-white text-xs px-3 py-2.5 rounded-xl border border-[#202C44]"
            />
          </div>
        </div>

        {/* Step 3: Pricing & Revenue Split Box */}
        <div className="bg-[#111317] border border-[#202C44] rounded-2xl p-6 space-y-4">
          <h3 className="text-sm font-heading font-bold text-white flex items-center gap-2">
            <IndianRupee className="w-4 h-4 text-[#D3CCB0]" />
            <span>3. Pricing & 90% Net Earnings Preview</span>
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
            <div>
              <label className="block text-xs text-[#7B8A90] mb-1">
                Your Desired List Price (₹ INR) *
              </label>
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-sm font-bold text-[#D3CCB0]">₹</span>
                <input
                  type="number"
                  required
                  min={100}
                  max={50000}
                  step={50}
                  value={priceInINR}
                  onChange={(e) => setPriceInINR(Number(e.target.value) || 0)}
                  className="w-full bg-[#000000] text-white text-base font-mono font-bold pl-8 pr-4 py-3 rounded-xl border border-[#202C44] focus:outline-none focus:border-[#D3CCB0]"
                />
              </div>
              <p className="text-[11px] text-[#7B8A90] mt-1">
                Recommendation: Top UI kits & codebases sell best between ₹999 – ₹2,999.
              </p>
            </div>

            {/* Live Pricing Breakdown */}
            <div className="bg-[#202C44]/80 border border-[#202C44] p-4 rounded-xl space-y-2 text-xs">
              <div className="flex items-center justify-between text-emerald-400 font-bold">
                <span>You Earn (90% Net):</span>
                <span className="font-mono text-sm">₹{pricing.sellerNetINR.toLocaleString("en-IN")}</span>
              </div>
              <div className="flex items-center justify-between text-[#7B8A90]">
                <span>Platform Fee (10%):</span>
                <span className="font-mono text-[#D3CCB0]">₹{pricing.platformFeeINR.toLocaleString("en-IN")}</span>
              </div>
              <div className="pt-2 border-t border-[#202C44] flex items-center justify-between text-white font-bold">
                <span>Buyer Total at Checkout:</span>
                <span className="font-mono">₹{pricing.buyerTotalINR.toLocaleString("en-IN")}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Submit Action */}
        <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#202C44]">
          <button
            type="button"
            onClick={() => navigate("/dashboard")}
            className="px-4 py-2.5 rounded-xl text-xs text-[#7B8A90] hover:text-white"
          >
            Cancel
          </button>

          <button
            type="submit"
            disabled={isSubmitting}
            className="bg-[#D3CCB0] hover:bg-[#c4bb9a] text-[#000000] font-bold text-xs px-6 py-3 rounded-xl transition-all shadow-lg active:scale-98 disabled:opacity-50 flex items-center gap-2"
          >
            {isSubmitting ? (
              <span>Verifying & Publishing...</span>
            ) : (
              <>
                <span>Publish Asset to Marketplace</span>
                <ArrowRight className="w-4 h-4 text-[#000000]" />
              </>
            )}
          </button>
        </div>

      </form>

    </div>
  );
};

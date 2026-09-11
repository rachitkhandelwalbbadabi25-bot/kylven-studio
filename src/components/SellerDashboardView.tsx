import React, { useState, useRef } from "react";
import { AssetListing, CoreCategory, CreatorProfile, SalesRecord, SellerStats } from "../types";
import { CATEGORIES_LIST, FILE_FORMATS_CATALOG } from "../data/mockData";
import { auth } from "../lib/firebase";
import { serverTimestamp } from "firebase/database";
import {
  PlusCircle,
  TrendingUp,
  Clock,
  CheckCircle2,
  Upload,
  ShieldCheck,
  FileCode,
  Image as ImageIcon,
  Layers,
  X,
  FileText,
  FileCheck,
  Sparkles,
  Paperclip
} from "lucide-react";

interface SellerDashboardViewProps {
  stats: SellerStats;
  salesHistory: SalesRecord[];
  activeListings: AssetListing[];
  onAddNewListing: (newListing: AssetListing) => void;
  onGoToBrowse: () => void;
}

export const SellerDashboardView: React.FC<SellerDashboardViewProps> = ({
  stats,
  salesHistory,
  activeListings,
  onAddNewListing,
  onGoToBrowse,
}) => {
  const [showUploadModal, setShowUploadModal] = useState(false);

  // File Upload Input Refs
  const assetFileInputRef = useRef<HTMLInputElement | null>(null);
  const thumbnailInputRef = useRef<HTMLInputElement | null>(null);

  // Upload Form State
  const [uploadStep, setUploadStep] = useState<1 | 2 | 3 | 4>(1);
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState<CoreCategory>("UI/UX & Design");
  const [subcategory, setSubcategory] = useState("Figma UI Kits");
  const [description, setDescription] = useState("");
  const [priceInINR, setPriceInINR] = useState<number>(999);
  const [fileFormats, setFileFormats] = useState<string[]>([".fig", ".zip"]);
  const [thumbnailUrl, setThumbnailUrl] = useState(
    "https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?auto=format&fit=crop&w=1000&q=80"
  );
  const [isSubmittedSuccess, setIsSubmittedSuccess] = useState(false);

  // File Attachment State
  const [attachedFile, setAttachedFile] = useState<{
    name: string;
    size: string;
    ext: string;
    isPdf: boolean;
  } | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  // Process File Selection (PDF, ZIP, FIG, etc.)
  const processSelectedFile = (file: File) => {
    const name = file.name;
    const ext = "." + (name.split(".").pop() || "zip").toLowerCase();
    const isPdf = ext === ".pdf";

    let formattedSize = "";
    if (file.size >= 1024 * 1024) {
      formattedSize = (file.size / (1024 * 1024)).toFixed(1) + " MB";
    } else {
      formattedSize = Math.max(1, Math.round(file.size / 1024)) + " KB";
    }

    setAttachedFile({
      name,
      size: formattedSize,
      ext,
      isPdf,
    });

    // Automatically add extension tag (e.g. .pdf) to file formats list
    setFileFormats((prev) => {
      if (!prev.includes(ext)) {
        return [...prev, ext];
      }
      return prev;
    });

    // Auto-fill title if blank
    if (!title.trim()) {
      const cleanName = name.replace(/\.[^/.]+$/, "").replace(/[-_]/g, " ");
      setTitle(cleanName.charAt(0).toUpperCase() + cleanName.slice(1));
    }
  };

  const handleAssetFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      processSelectedFile(e.target.files[0]);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processSelectedFile(e.dataTransfer.files[0]);
    }
  };

  const handleThumbnailFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const imgFile = e.target.files[0];
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setThumbnailUrl(event.target.result as string);
        }
      };
      reader.readAsDataURL(imgFile);
    }
  };

  const toggleFormatTag = (tag: string) => {
    setFileFormats((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  // Auto fee calculations
  const platformFee = Math.round((priceInINR || 0) * 0.125);
  const totalBuyerPayable = (priceInINR || 0) + platformFee;
  const sellerNetEarnings = Math.round((priceInINR || 0) * 0.875);

  const handleCreateListing = (e: React.FormEvent) => {
    e.preventDefault();

    const currentUid = auth.currentUser?.uid;
    if (!currentUid) {
      alert("Authentication required: Please sign in to create listings.");
      return;
    }

    const creatorObj: CreatorProfile = {
      id: currentUid,
      name: auth.currentUser?.displayName || "Creator",
      username: auth.currentUser?.email ? auth.currentUser.email.split("@")[0].toLowerCase().replace(/[^a-z0-9]/g, "_") : "seller",
      handle: `@${auth.currentUser?.email ? auth.currentUser.email.split("@")[0].toLowerCase().replace(/[^a-z0-9]/g, "_") : "seller"}`,
      avatar: auth.currentUser?.photoURL || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80",
      badge: "Seller",
      verified: false,
      verifiedSeller: false,
      responseTime: "< 2 hours",
      totalSales: 0,
      rating: 0,
      joinedDate: new Date().getFullYear().toString(),
      location: "India"
    };

    // Public listing: deliverable downloadUrl is omitted, metrics default to unreviewed
    // Authoritative requirement: New listings created MUST ALWAYS have status: "pending".
    const createdAsset: AssetListing = {
      id: `asset-new-${Date.now()}`,
      sellerId: currentUid,
      sellerName: auth.currentUser?.displayName || "Creator",
      status: "pending",
      slug: (title || "new-asset").toLowerCase().replace(/[^a-z0-9]+/g, "-"),
      title: title || (attachedFile ? attachedFile.name : "New Custom Seller Asset"),
      category,
      subcategory,
      tags: [category.toLowerCase().split(" ")[0], "new"],
      fileType: attachedFile ? attachedFile.ext : ".zip",
      fileExtension: (attachedFile ? attachedFile.ext : "zip").replace(/^\./, ""),
      shortDescription: description || "Verified seller digital asset ready for instant download.",
      fullDescription: description || "Verified seller digital asset ready for instant download.",
      description: description || "Verified seller digital asset ready for instant download.",
      detailedFeatures: [
        `Includes raw ${attachedFile ? attachedFile.ext.toUpperCase() : "source"} package`,
        "Includes full commercial & team license",
        "Virus scanned & quality verified by Kreate Studio"
      ],
      price: priceInINR || 999,
      isFree: (priceInINR || 999) === 0,
      fileFormatTags: fileFormats.length > 0 ? fileFormats : [attachedFile ? attachedFile.ext : ".zip"],
      fileSizeBytes: attachedFile ? attachedFile.size : "45 MB",
      thumbnailUrl,
      previewUrl: thumbnailUrl,
      previewUrls: [thumbnailUrl],
      previewImages: [thumbnailUrl],
      seller: creatorObj,
      creator: creatorObj,
      reviewStatus: "In Review",
      softwareCompatibility: ["Figma", "VS Code", "PDF Viewers", "All Standard Tools"],
      deliveryType: "Instant ZIP Download",
      featured: false,
      isNew: true,
      reviewList: [],
      createdAt: serverTimestamp(),
      licenseType: "Commercial License",
      compatibleWith: ["Figma", "VS Code", "PDF Viewers", "All Standard Tools"],
    };

    onAddNewListing(createdAsset);
    setIsSubmittedSuccess(true);
  };

  const handleResetUpload = () => {
    setShowUploadModal(false);
    setIsSubmittedSuccess(false);
    setUploadStep(1);
    setTitle("");
    setDescription("");
    setPriceInINR(999);
    setAttachedFile(null);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">
      
      {/* Dashboard Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#202C44] pb-6">
        <div>
          <div className="flex items-center gap-2">
            <span className="bg-[#202C44] text-[#D3CCB0] text-xs font-mono font-bold px-2.5 py-0.5 rounded border border-[#202C44]">
              Seller Portal
            </span>
            <span className="text-xs text-[#7B8A90]">/ Indian Bank Payouts Active</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-heading font-extrabold text-white tracking-tight mt-1">
            Seller Dashboard
          </h1>
          <p className="text-xs sm:text-sm text-[#7B8A90] mt-0.5">
            Manage listings, track UPI earnings, and upload new digital seller assets.
          </p>
        </div>

        <button
          onClick={() => setShowUploadModal(true)}
          className="bg-[#D3CCB0] hover:bg-[#c4bb9a] text-[#000000] font-heading font-extrabold text-xs px-5 py-3 rounded-xl transition-all shadow-lg flex items-center gap-2 active:scale-95 cursor-pointer"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Upload New Asset Listing</span>
        </button>
      </div>

      {/* Stats Cards Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        
        {/* Total Earned */}
        <div className="bg-[#202C44] border border-[#202C44] rounded-2xl p-5 space-y-2">
          <div className="flex items-center justify-between text-xs text-[#7B8A90]">
            <span>Total Earned (87.5% Net)</span>
            <TrendingUp className="w-4 h-4 text-[#D3CCB0]" />
          </div>
          <div className="text-2xl sm:text-3xl font-heading font-extrabold text-[#D3CCB0]">
            ₹{stats.totalEarnedINR.toLocaleString("en-IN")}
          </div>
          <div className="text-[10px] text-[#7B8A90] flex items-center gap-1 pt-1 border-t border-[#111317]">
            <CheckCircle2 className="w-3 h-3 text-[#D3CCB0]" />
            <span>Direct Bank / UPI Settlement</span>
          </div>
        </div>

        {/* Pending Payout */}
        <div className="bg-[#202C44] border border-[#202C44] rounded-2xl p-5 space-y-2">
          <div className="flex items-center justify-between text-xs text-[#7B8A90]">
            <span>Pending Payout</span>
            <Clock className="w-4 h-4 text-[#D3CCB0]" />
          </div>
          <div className="text-2xl sm:text-3xl font-heading font-extrabold text-white">
            ₹{stats.pendingPayoutINR.toLocaleString("en-IN")}
          </div>
          <div className="text-[10px] text-[#7B8A90] flex items-center gap-1 pt-1 border-t border-[#111317]">
            <span>Settles every Monday</span>
          </div>
        </div>

        {/* Total Sales Count */}
        <div className="bg-[#202C44] border border-[#202C44] rounded-2xl p-5 space-y-2">
          <div className="flex items-center justify-between text-xs text-[#7B8A90]">
            <span>Total Orders Sold</span>
            <Layers className="w-4 h-4 text-[#D3CCB0]" />
          </div>
          <div className="text-2xl sm:text-3xl font-heading font-extrabold text-white">
            {stats.totalSalesCount}
          </div>
          <div className="text-[10px] text-[#7B8A90] flex items-center gap-1 pt-1 border-t border-[#111317]">
            <span>Average Rating: {stats.averageRating}★</span>
          </div>
        </div>

        {/* Active Listings */}
        <div className="bg-[#202C44] border border-[#202C44] rounded-2xl p-5 space-y-2">
          <div className="flex items-center justify-between text-xs text-[#7B8A90]">
            <span>Active Listings</span>
            <FileCode className="w-4 h-4 text-[#D3CCB0]" />
          </div>
          <div className="text-2xl sm:text-3xl font-heading font-extrabold text-[#D3CCB0]">
            {activeListings.length}
          </div>
          <div className="text-[10px] text-[#7B8A90] flex items-center gap-1 pt-1 border-t border-[#111317]">
            <span>All listings 100% manually reviewed</span>
          </div>
        </div>

      </div>

      {/* Revenue Split Policy Banner */}
      <div className="bg-[#111317] border border-[#202C44] rounded-2xl p-6 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="bg-[#202C44] text-[#D3CCB0] text-[10px] font-mono uppercase font-bold px-2 py-0.5 rounded">
              Seller Promise
            </span>
            <h3 className="text-sm font-heading font-bold text-white">
              Sellers Keep 87.5% Guaranteed Net Split
            </h3>
          </div>
          <p className="text-xs text-[#7B8A90] leading-relaxed max-w-2xl">
            When you list an item at ₹1,000, the buyer pays ₹1,125 (includes 12.5% platform & payment fee). You receive ₹875 directly into your Indian bank account with zero extra deductions.
          </p>
        </div>

        <div className="bg-[#202C44] border border-[#202C44] p-3 rounded-xl text-center shrink-0">
          <span className="text-[10px] text-[#7B8A90] uppercase font-mono block">Your Take-Home</span>
          <span className="text-lg font-heading font-extrabold text-[#D3CCB0]">87.5% Net</span>
        </div>
      </div>

      {/* Sales History Table */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-heading font-bold text-white">
            Recent Sales & Earnings History
          </h2>
          <span className="text-xs text-[#7B8A90] font-mono">Real-time UPI Log</span>
        </div>

        <div className="bg-[#202C44] border border-[#202C44] rounded-2xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#111317] text-[#7B8A90] uppercase font-mono text-[10px] border-b border-[#202C44]">
                <tr>
                  <th className="p-4">Order Ref</th>
                  <th className="p-4">Digital Asset</th>
                  <th className="p-4">Buyer Location</th>
                  <th className="p-4">Listed Price</th>
                  <th className="p-4">Fee (12.5%)</th>
                  <th className="p-4">Seller Net (87.5%)</th>
                  <th className="p-4">Payment</th>
                  <th className="p-4">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#111317] text-white">
                {salesHistory.map((sale) => (
                  <tr key={sale.id} className="hover:bg-[#111317]/50 transition-colors">
                    <td className="p-4 font-mono font-bold text-[#D3CCB0]">{sale.orderId}</td>
                    <td className="p-4 font-medium max-w-xs truncate">{sale.assetTitle}</td>
                    <td className="p-4 text-[#7B8A90]">{sale.buyerLocation}</td>
                    <td className="p-4 font-mono">₹{sale.listedPriceINR.toLocaleString("en-IN")}</td>
                    <td className="p-4 font-mono text-[#7B8A90]">₹{sale.platformFeeINR}</td>
                    <td className="p-4 font-mono font-bold text-[#D3CCB0]">
                      ₹{sale.sellerEarningsINR.toLocaleString("en-IN")}
                    </td>
                    <td className="p-4">
                      <span className="bg-[#111317] text-[#7B8A90] text-[10px] px-2 py-0.5 rounded border border-[#202C44]">
                        {sale.paymentMethod}
                      </span>
                    </td>
                    <td className="p-4">
                      <span className="inline-flex items-center gap-1 text-[10px] font-mono text-[#D3CCB0] bg-[#111317] px-2 py-0.5 rounded border border-[#202C44]">
                        <CheckCircle2 className="w-3 h-3 text-[#D3CCB0]" />
                        {sale.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Active Listings Grid */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-heading font-bold text-white">
            Your Live Marketplace Listings ({activeListings.length})
          </h2>
          <button
            onClick={onGoToBrowse}
            className="text-xs text-[#D3CCB0] hover:underline"
          >
            View Live Feed →
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {activeListings.map((item) => (
            <div
              key={item.id}
              className="bg-[#202C44] border border-[#202C44] rounded-2xl p-4 space-y-3 flex flex-col justify-between"
            >
              <div className="flex gap-3">
                <img
                  src={item.thumbnailUrl}
                  alt={item.title}
                  className="w-16 h-16 rounded-xl object-cover border border-[#202C44] bg-[#111317]"
                />
                <div className="flex-1 min-w-0">
                  <span className="text-[10px] text-[#D3CCB0] font-mono bg-[#111317] px-2 py-0.5 rounded border border-[#202C44]">
                    {item.category}
                  </span>
                  <h3 className="text-xs font-heading font-bold text-white truncate mt-1">
                    {item.title}
                  </h3>
                  <div className="text-[11px] text-[#7B8A90] mt-0.5">
                    Listed: <span className="text-white font-mono font-bold">{(item.price ?? 0) === 0 || item.isFree ? "FREE" : `₹${item.price?.toLocaleString("en-IN")}`}</span>
                  </div>
                </div>
              </div>

              <div className="pt-2 border-t border-[#111317] flex items-center justify-between text-[11px] text-[#7B8A90]">
                <span>{item.salesCount ? `${item.salesCount} Downloads` : "New Listing"}</span>
                <span className="text-[#D3CCB0] font-mono">{item.status === "approved" ? "Active" : "Pending Review"}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Upload New Asset Modal */}
      {showUploadModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#000000]/80 backdrop-blur-md p-4 overflow-y-auto">
          <div className="bg-[#202C44] border border-[#202C44] w-full max-w-xl rounded-2xl overflow-hidden shadow-2xl relative my-8">
            
            {/* Modal Header */}
            <div className="p-5 border-b border-[#111317] flex items-center justify-between">
              <div>
                <span className="text-[10px] font-mono text-[#D3CCB0] uppercase block">
                  Step {uploadStep} of 4 • New Listing
                </span>
                <h3 className="text-lg font-heading font-bold text-white">
                  Upload Digital Creator Asset
                </h3>
              </div>

              <button
                onClick={handleResetUpload}
                className="p-1.5 text-[#7B8A90] hover:text-white rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {!isSubmittedSuccess ? (
              <form onSubmit={handleCreateListing} className="p-6 space-y-6">
                
                {/* Step 1: Category, Subcategory & File Formats */}
                {uploadStep === 1 && (
                  <div className="space-y-4">
                    <h4 className="text-xs font-heading font-bold text-white">
                      1. Choose Core Sector Category & File Formats
                    </h4>

                    <div className="space-y-2">
                      <label className="text-[11px] text-[#7B8A90]">Primary Category</label>
                      <select
                        value={category}
                        onChange={(e) => setCategory(e.target.value as CoreCategory)}
                        className="w-full bg-[#111317] text-white text-xs p-3 rounded-xl border border-[#202C44] focus:outline-none focus:border-[#D3CCB0]"
                      >
                        {CATEGORIES_LIST.map((c) => (
                          <option key={c.name} value={c.name}>
                            {c.name} ({c.count} assets)
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="space-y-2">
                      <label className="text-[11px] text-[#7B8A90]">Subcategory Tag</label>
                      <input
                        type="text"
                        value={subcategory}
                        onChange={(e) => setSubcategory(e.target.value)}
                        placeholder="e.g. PDF E-Books & Guides, Flutter Mobile Apps, Figma UI Kits"
                        className="w-full bg-[#111317] text-white text-xs p-3 rounded-xl border border-[#202C44] focus:outline-none focus:border-[#D3CCB0]"
                      />
                    </div>

                    {/* File Formats Selector */}
                    <div className="space-y-2">
                      <label className="text-[11px] text-[#7B8A90]">
                        Supported File Extension Tags (Click to select)
                      </label>
                      <div className="flex flex-wrap gap-1.5">
                        {FILE_FORMATS_CATALOG.map((f) => {
                          const isSelected = fileFormats.includes(f.ext);
                          return (
                            <button
                              key={f.ext}
                              type="button"
                              onClick={() => toggleFormatTag(f.ext)}
                              className={`text-[11px] font-mono px-2.5 py-1 rounded-lg border transition-all ${
                                isSelected
                                  ? "bg-[#D3CCB0] text-[#000000] border-[#D3CCB0] font-bold"
                                  : "bg-[#111317] text-[#7B8A90] border-[#202C44] hover:text-white"
                              }`}
                            >
                              {f.ext}
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => setUploadStep(2)}
                      className="w-full bg-[#D3CCB0] text-[#000000] font-bold text-xs py-3 rounded-xl transition-all"
                    >
                      Continue to Asset Details →
                    </button>
                  </div>
                )}

                {/* Step 2: Listing Title & Description */}
                {uploadStep === 2 && (
                  <div className="space-y-4">
                    <h4 className="text-xs font-heading font-bold text-white">
                      2. Asset Details & Description
                    </h4>

                    <div className="space-y-2">
                      <label className="text-[11px] text-[#7B8A90]">Listing Title</label>
                      <input
                        type="text"
                        required
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        placeholder="e.g. Complete System Design & DSA Interview Guide (PDF)"
                        className="w-full bg-[#111317] text-white text-xs p-3 rounded-xl border border-[#202C44] focus:outline-none focus:border-[#D3CCB0]"
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="text-[11px] text-[#7B8A90]">Description</label>
                      <textarea
                        rows={3}
                        required
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        placeholder="Explain what is included in your PDF / source file, page count, table of contents, usage license..."
                        className="w-full bg-[#111317] text-white text-xs p-3 rounded-xl border border-[#202C44] focus:outline-none focus:border-[#D3CCB0]"
                      />
                    </div>

                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() => setUploadStep(1)}
                        className="w-1/3 bg-[#111317] text-[#7B8A90] font-bold text-xs py-3 rounded-xl"
                      >
                        ← Back
                      </button>
                      <button
                        type="button"
                        onClick={() => setUploadStep(3)}
                        className="w-2/3 bg-[#D3CCB0] text-[#000000] font-bold text-xs py-3 rounded-xl"
                      >
                        Continue to Pricing →
                      </button>
                    </div>
                  </div>
                )}

                {/* Step 3: Pricing Calculator */}
                {uploadStep === 3 && (
                  <div className="space-y-4">
                    <h4 className="text-xs font-heading font-bold text-white">
                      3. Pricing & Earnings Calculator (₹)
                    </h4>

                    <div className="space-y-2">
                      <label className="text-[11px] text-[#7B8A90]">Listed Price in Indian Rupee (₹)</label>
                      <input
                        type="number"
                        min={100}
                        step={50}
                        required
                        value={priceInINR}
                        onChange={(e) => setPriceInINR(Number(e.target.value))}
                        className="w-full bg-[#111317] text-white text-sm font-mono font-bold p-3 rounded-xl border border-[#202C44] focus:outline-none focus:border-[#D3CCB0]"
                      />
                    </div>

                    {/* Breakdown Box */}
                    <div className="bg-[#111317] border border-[#202C44] p-4 rounded-xl space-y-2 text-xs">
                      <div className="flex justify-between text-[#7B8A90]">
                        <span>Buyer Pays (+12.5% platform fee)</span>
                        <span className="font-mono text-white font-bold">
                          ₹{totalBuyerPayable.toLocaleString("en-IN")}
                        </span>
                      </div>

                      <div className="flex justify-between text-[#7B8A90]">
                        <span>Your Net Take-Home Earnings (87.5%)</span>
                        <span className="font-mono text-[#D3CCB0] font-bold">
                          ₹{sellerNetEarnings.toLocaleString("en-IN")}
                        </span>
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() => setUploadStep(2)}
                        className="w-1/3 bg-[#111317] text-[#7B8A90] font-bold text-xs py-3 rounded-xl"
                      >
                        ← Back
                      </button>
                      <button
                        type="button"
                        onClick={() => setUploadStep(4)}
                        className="w-2/3 bg-[#D3CCB0] text-[#000000] font-bold text-xs py-3 rounded-xl"
                      >
                        Continue to File Upload →
                      </button>
                    </div>
                  </div>
                )}

                {/* Step 4: Files Upload & Submit */}
                {uploadStep === 4 && (
                  <div className="space-y-5">
                    <h4 className="text-xs font-heading font-bold text-white">
                      4. Upload Main PDF / Asset Archive & Thumbnail
                    </h4>

                    {/* Hidden Native File Inputs */}
                    <input
                      ref={assetFileInputRef}
                      type="file"
                      accept=".pdf,.zip,.fig,.dart,.ipynb,.blend,.cube,.notion,.tsx,.prpr,.aep,.xlsx,.psd,.fbx,.py,.canva,.doc,.docx"
                      onChange={handleAssetFileChange}
                      className="hidden"
                    />

                    <input
                      ref={thumbnailInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleThumbnailFileChange}
                      className="hidden"
                    />

                    {/* Main File Dropzone */}
                    {!attachedFile ? (
                      <div
                        onDragOver={handleDragOver}
                        onDragLeave={handleDragLeave}
                        onDrop={handleDrop}
                        onClick={() => assetFileInputRef.current?.click()}
                        className={`border-2 border-dashed p-6 rounded-2xl text-center space-y-3 cursor-pointer transition-all ${
                          isDragging
                            ? "border-[#D3CCB0] bg-[#202C44]/80 scale-[1.01]"
                            : "border-[#202C44] hover:border-[#D3CCB0] bg-[#111317]"
                        }`}
                      >
                        <div className="w-12 h-12 rounded-2xl bg-[#202C44] text-[#D3CCB0] flex items-center justify-center mx-auto shadow-inner">
                          <Upload className="w-6 h-6" />
                        </div>

                        <div>
                          <p className="text-xs text-white font-bold">
                            Click to select or drag & drop your PDF document / asset file
                          </p>
                          <p className="text-[11px] text-[#7B8A90] mt-1">
                            Supports <strong className="text-[#D3CCB0]">PDF (.pdf)</strong>, ZIP (.zip), Figma (.fig), Flutter (.dart), Notebooks (.ipynb), Blender (.blend)
                          </p>
                        </div>

                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            assetFileInputRef.current?.click();
                          }}
                          className="bg-[#202C44] hover:bg-[#202C44]/80 text-[#D3CCB0] text-xs font-bold px-4 py-2 rounded-xl border border-[#202C44] inline-flex items-center gap-1.5"
                        >
                          <Paperclip className="w-3.5 h-3.5" />
                          <span>Browse Device Files</span>
                        </button>
                      </div>
                    ) : (
                      /* Attached File Card */
                      <div className="bg-[#111317] border border-[#202C44] rounded-2xl p-4 space-y-3">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3 min-w-0">
                            <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-xs shrink-0 ${
                              attachedFile.isPdf ? "bg-rose-950/80 text-rose-400 border border-rose-800" : "bg-[#202C44] text-[#D3CCB0] border border-[#202C44]"
                            }`}>
                              {attachedFile.isPdf ? (
                                <FileText className="w-5 h-5 text-rose-400" />
                              ) : (
                                <FileCheck className="w-5 h-5 text-[#D3CCB0]" />
                              )}
                            </div>

                            <div className="min-w-0">
                              <div className="flex items-center gap-2">
                                <span className={`text-[10px] font-mono font-bold px-1.5 py-0.2 rounded uppercase ${
                                  attachedFile.isPdf ? "bg-rose-900/60 text-rose-300" : "bg-[#202C44] text-[#D3CCB0]"
                                }`}>
                                  {attachedFile.ext}
                                </span>
                                <span className="text-[10px] text-emerald-400 font-mono flex items-center gap-1">
                                  <CheckCircle2 className="w-3 h-3" /> Ready
                                </span>
                              </div>
                              <h5 className="text-xs font-bold text-white truncate mt-0.5">
                                {attachedFile.name}
                              </h5>
                              <p className="text-[10px] text-[#7B8A90] font-mono">Size: {attachedFile.size}</p>
                            </div>
                          </div>

                          <button
                            type="button"
                            onClick={() => assetFileInputRef.current?.click()}
                            className="text-xs text-[#D3CCB0] hover:underline shrink-0 font-medium"
                          >
                            Change File
                          </button>
                        </div>
                      </div>
                    )}

                    {/* Thumbnail / Cover Image Selector */}
                    <div className="space-y-2 pt-2 border-t border-[#111317]">
                      <div className="flex items-center justify-between text-[11px]">
                        <label className="text-[#7B8A90]">Preview Cover / Thumbnail Image</label>
                        <button
                          type="button"
                          onClick={() => thumbnailInputRef.current?.click()}
                          className="text-[#D3CCB0] hover:underline flex items-center gap-1 font-mono text-[10px]"
                        >
                          <ImageIcon className="w-3 h-3" />
                          <span>Upload Image from Device</span>
                        </button>
                      </div>

                      <div className="flex items-center gap-3">
                        <img
                          src={thumbnailUrl}
                          alt="Thumbnail preview"
                          className="w-12 h-12 rounded-xl object-cover border border-[#202C44] bg-[#111317] shrink-0"
                        />
                        <input
                          type="url"
                          value={thumbnailUrl}
                          onChange={(e) => setThumbnailUrl(e.target.value)}
                          placeholder="Or paste image URL (https://...)"
                          className="flex-1 bg-[#111317] text-white text-xs p-3 rounded-xl border border-[#202C44] focus:outline-none focus:border-[#D3CCB0]"
                        />
                      </div>
                    </div>

                    <div className="flex gap-2 pt-2">
                      <button
                        type="button"
                        onClick={() => setUploadStep(3)}
                        className="w-1/3 bg-[#111317] text-[#7B8A90] font-bold text-xs py-3 rounded-xl"
                      >
                        ← Back
                      </button>
                      <button
                        type="submit"
                        className="w-2/3 bg-[#D3CCB0] hover:bg-[#c4bb9a] text-[#000000] font-extrabold text-xs py-3 rounded-xl shadow-lg active:scale-95 flex items-center justify-center gap-1.5"
                      >
                        <Sparkles className="w-4 h-4" />
                        <span>Submit Asset for Review</span>
                      </button>
                    </div>
                  </div>
                )}

              </form>
            ) : (
              /* Success confirmation state */
              <div className="p-8 text-center space-y-6">
                <div className="w-16 h-16 rounded-2xl bg-[#111317] text-[#D3CCB0] border border-[#202C44] flex items-center justify-center mx-auto shadow-xl">
                  <ShieldCheck className="w-8 h-8" />
                </div>

                <div>
                  <h4 className="text-xl font-heading font-extrabold text-white">
                    Listing Sent for Manual Quality Review!
                  </h4>
                  <p className="text-xs text-[#7B8A90] mt-1 leading-relaxed max-w-md mx-auto">
                    Your asset has been received. Our review team verifies file structure and license terms within 24 hours. Your item is now live in your demo feed!
                  </p>
                </div>

                <div className="bg-[#111317] border border-[#202C44] rounded-xl p-4 text-xs text-left space-y-1">
                  <div className="text-white font-bold">{title || "New Custom Digital Asset"}</div>
                  <div className="text-[#7B8A90]">Category: {category}</div>
                  <div className="text-[#D3CCB0] font-mono font-bold">
                    Price: ₹{priceInINR} (Your net 87.5%: ₹{sellerNetEarnings})
                  </div>
                </div>

                <button
                  onClick={handleResetUpload}
                  className="bg-[#D3CCB0] text-[#000000] font-bold text-xs px-6 py-3 rounded-xl shadow"
                >
                  Return to Seller Dashboard
                </button>
              </div>
            )}

          </div>
        </div>
      )}

    </div>
  );
};

import React, { useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { AssetListing, calculatePricing, UserPurchase } from "../types";
import {
  ShieldCheck,
  Zap,
  Download,
  CheckCircle2,
  Lock,
  ArrowRight,
  Sparkles,
  Copy,
  AlertCircle,
  FileArchive,
  QrCode,
  Smartphone
} from "lucide-react";

interface CheckoutPageProps {
  listings: AssetListing[];
  onCompletePurchase: (purchase: UserPurchase) => void;
  buyerEmail?: string;
}

export const CheckoutPage: React.FC<CheckoutPageProps> = ({
  listings,
  onCompletePurchase,
  buyerEmail: initialBuyerEmail = "developer@kreatestudio.in",
}) => {
  const { listingId } = useParams<{ listingId: string }>();
  const navigate = useNavigate();

  const listing = listings.find((l) => l.id === listingId || l.slug === listingId);

  const [paymentMethod, setPaymentMethod] = useState<"gpay" | "phonepe" | "paytm" | "upi_id">("gpay");
  const [upiId, setUpiId] = useState("");
  const [buyerEmail, setBuyerEmail] = useState(initialBuyerEmail);
  const [isProcessing, setIsProcessing] = useState(false);
  const [purchaseSuccess, setPurchaseSuccess] = useState<UserPurchase | null>(null);
  const [copiedKey, setCopiedKey] = useState(false);

  if (!listing) {
    return (
      <div className="max-w-xl mx-auto px-4 py-20 text-center space-y-4">
        <AlertCircle className="w-12 h-12 text-[#D3CCB0] mx-auto" />
        <h1 className="text-xl font-heading font-bold text-white">Asset Not Found</h1>
        <p className="text-xs text-[#7B8A90]">The item you are attempting to checkout was not found.</p>
        <button
          onClick={() => navigate("/browse")}
          className="bg-[#D3CCB0] text-[#000000] text-xs font-bold px-4 py-2 rounded-xl"
        >
          Browse Marketplace
        </button>
      </div>
    );
  }

  const pricing = calculatePricing(listing.priceInINR);

  const handlePayNow = (e: React.FormEvent) => {
    e.preventDefault();
    if (!buyerEmail.includes("@")) {
      alert("Please enter a valid email for file delivery and invoice.");
      return;
    }

    setIsProcessing(true);

    setTimeout(() => {
      const orderId = `KRT-${Math.floor(100000 + Math.random() * 900000)}`;
      const licenseKey = `KREATE-COMM-2026-${Math.random().toString(36).substring(2, 6).toUpperCase()}-${Math.random().toString(36).substring(2, 6).toUpperCase()}`;

      const newPurchase: UserPurchase = {
        orderId,
        listingId: listing.id,
        title: listing.title,
        thumbnailUrl: listing.thumbnailUrl,
        category: listing.category,
        fileType: listing.fileType,
        downloadUrl: listing.downloadUrl || "https://kreatestudio.in/downloads/asset-package.zip",
        licenseKey,
        purchaseDate: new Date().toISOString().split("T")[0],
        pricePaidINR: pricing.buyerTotalINR,
        sellerNetINR: pricing.sellerNetINR,
        platformFeeINR: pricing.platformFeeINR,
        paymentMethod: paymentMethod.toUpperCase(),
      };

      onCompletePurchase(newPurchase);
      setPurchaseSuccess(newPurchase);
      setIsProcessing(false);
    }, 1500);
  };

  const handleCopyLicense = () => {
    if (purchaseSuccess) {
      navigator.clipboard?.writeText(purchaseSuccess.licenseKey);
      setCopiedKey(true);
      setTimeout(() => setCopiedKey(false), 2000);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      
      {/* SUCCESS STATE */}
      {purchaseSuccess ? (
        <div className="bg-[#111317] border border-[#202C44] rounded-3xl p-8 sm:p-10 space-y-8 shadow-2xl">
          <div className="text-center space-y-3">
            <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto border border-emerald-500/30">
              <CheckCircle2 className="w-9 h-9" />
            </div>
            <span className="text-xs font-mono text-emerald-400 font-bold uppercase tracking-wider">
              Payment Successful • Instant Access Unlocked
            </span>
            <h1 className="text-2xl sm:text-3xl font-heading font-extrabold text-white">
              Thank You for Your Order!
            </h1>
            <p className="text-xs text-[#7B8A90] max-w-md mx-auto">
              Your uncompressed archive and commercial license certificate have been generated. A copy has been dispatched to <span className="text-white font-mono">{buyerEmail}</span>.
            </p>
          </div>

          {/* Order Details Card */}
          <div className="bg-[#202C44]/80 border border-[#202C44] rounded-2xl p-6 space-y-5">
            <div className="flex items-center justify-between border-b border-[#202C44] pb-4">
              <div>
                <span className="text-[10px] text-[#7B8A90] font-mono uppercase">Order Reference</span>
                <p className="text-sm font-mono font-bold text-[#D3CCB0]">{purchaseSuccess.orderId}</p>
              </div>
              <div className="text-right">
                <span className="text-[10px] text-[#7B8A90] font-mono uppercase">Total Paid</span>
                <p className="text-sm font-mono font-bold text-white">₹{purchaseSuccess.pricePaidINR.toLocaleString("en-IN")}</p>
              </div>
            </div>

            {/* Asset Info */}
            <div className="flex items-center gap-4">
              <img
                src={purchaseSuccess.thumbnailUrl}
                alt={purchaseSuccess.title}
                className="w-16 h-16 rounded-xl object-cover border border-[#202C44]"
              />
              <div>
                <h3 className="text-sm font-bold text-white">{purchaseSuccess.title}</h3>
                <p className="text-xs text-[#7B8A90] font-mono mt-0.5">{purchaseSuccess.category} • {purchaseSuccess.fileType}</p>
              </div>
            </div>

            {/* License Key Box */}
            <div className="bg-[#111317] border border-[#202C44] rounded-xl p-4 space-y-1.5">
              <div className="flex items-center justify-between text-xs">
                <span className="text-[#7B8A90] font-mono font-bold">Commercial License Key:</span>
                <button
                  type="button"
                  onClick={handleCopyLicense}
                  className="text-xs text-[#D3CCB0] hover:underline flex items-center gap-1 font-mono"
                >
                  <Copy className="w-3.5 h-3.5" />
                  <span>{copiedKey ? "Copied!" : "Copy Key"}</span>
                </button>
              </div>
              <p className="font-mono text-xs font-bold text-white bg-[#000000] p-2.5 rounded-lg border border-[#202C44] select-all">
                {purchaseSuccess.licenseKey}
              </p>
            </div>

            {/* Download CTA */}
            <div className="pt-2">
              <a
                href={purchaseSuccess.downloadUrl}
                download
                className="w-full bg-[#D3CCB0] hover:bg-[#c4bb9a] text-[#000000] font-bold text-sm py-4 rounded-xl transition-all shadow-lg flex items-center justify-center gap-2 active:scale-98"
              >
                <Download className="w-5 h-5 text-[#000000]" />
                <span>Download Asset Package (.zip uncompressed)</span>
              </a>
            </div>
          </div>

          {/* Action Links */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 text-xs">
            <Link
              to="/purchases"
              className="text-[#D3CCB0] font-bold hover:underline"
            >
              View in My Purchases →
            </Link>
            <span className="text-[#202C44] hidden sm:inline">•</span>
            <Link
              to="/browse"
              className="text-[#7B8A90] hover:text-white"
            >
              Continue Exploring Marketplace
            </Link>
          </div>
        </div>
      ) : (
        /* CHECKOUT FORM */
        <div className="space-y-8">
          
          {/* Header */}
          <div className="border-b border-[#202C44] pb-6">
            <div className="flex items-center gap-2 text-xs font-mono text-[#D3CCB0] mb-2">
              <Lock className="w-3.5 h-3.5" />
              <span>256-bit Encrypted UPI Checkout</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-heading font-extrabold text-white tracking-tight">
              Complete Your Digital Purchase
            </h1>
            <p className="text-xs text-[#7B8A90] mt-1">
              Direct Indian Rupee (₹) payment with instant automated file unlock.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* Left: Payment Method & Contact (7 cols) */}
            <form onSubmit={handlePayNow} className="lg:col-span-7 space-y-6">
              
              {/* Buyer Email Input */}
              <div className="bg-[#111317] border border-[#202C44] rounded-2xl p-6 space-y-4">
                <h3 className="text-sm font-heading font-bold text-white flex items-center gap-2">
                  <Zap className="w-4 h-4 text-[#D3CCB0]" />
                  <span>1. Delivery Contact</span>
                </h3>

                <div>
                  <label className="block text-xs text-[#7B8A90] mb-1.5 font-medium">
                    Email for File Delivery & Commercial License Invoice
                  </label>
                  <input
                    type="email"
                    required
                    value={buyerEmail}
                    onChange={(e) => setBuyerEmail(e.target.value)}
                    placeholder="yourname@gmail.com"
                    className="w-full bg-[#000000] text-white text-xs px-4 py-3 rounded-xl border border-[#202C44] focus:outline-none focus:border-[#D3CCB0]"
                  />
                  <p className="text-[11px] text-[#7B8A90] mt-1">
                    Download link and commercial invoice will be sent immediately.
                  </p>
                </div>
              </div>

              {/* UPI Payment Selector */}
              <div className="bg-[#111317] border border-[#202C44] rounded-2xl p-6 space-y-4">
                <h3 className="text-sm font-heading font-bold text-white flex items-center gap-2">
                  <Smartphone className="w-4 h-4 text-[#D3CCB0]" />
                  <span>2. Select UPI Payment App</span>
                </h3>

                <div className="grid grid-cols-2 gap-3">
                  {[
                    { id: "gpay", label: "Google Pay", desc: "Instant UPI Intent" },
                    { id: "phonepe", label: "PhonePe", desc: "Direct App Push" },
                    { id: "paytm", label: "Paytm UPI", desc: "Wallet & UPI" },
                    { id: "upi_id", label: "Custom UPI ID", desc: "Any VPA / BHIM" },
                  ].map((method) => (
                    <button
                      key={method.id}
                      type="button"
                      onClick={() => setPaymentMethod(method.id as any)}
                      className={`p-3.5 rounded-xl border text-left transition-all ${
                        paymentMethod === method.id
                          ? "bg-[#202C44] border-[#D3CCB0] text-white shadow"
                          : "bg-[#000000] border-[#202C44] text-[#7B8A90] hover:text-white"
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-bold text-xs">{method.label}</span>
                        {paymentMethod === method.id && (
                          <CheckCircle2 className="w-3.5 h-3.5 text-[#D3CCB0]" />
                        )}
                      </div>
                      <span className="text-[10px] text-[#7B8A90] block">{method.desc}</span>
                    </button>
                  ))}
                </div>

                {paymentMethod === "upi_id" && (
                  <div className="pt-2">
                    <label className="block text-xs text-[#7B8A90] mb-1">
                      Enter your UPI ID / Virtual Payment Address (VPA)
                    </label>
                    <input
                      type="text"
                      value={upiId}
                      onChange={(e) => setUpiId(e.target.value)}
                      placeholder="username@okhdfcbank / yourname@upi"
                      className="w-full bg-[#000000] text-white text-xs px-4 py-2.5 rounded-xl border border-[#202C44] focus:outline-none focus:border-[#D3CCB0]"
                    />
                  </div>
                )}
              </div>

              {/* Submit CTA */}
              <button
                type="submit"
                disabled={isProcessing}
                className="w-full bg-[#D3CCB0] hover:bg-[#c4bb9a] text-[#000000] font-bold text-sm py-4 rounded-xl transition-all shadow-xl active:scale-98 disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {isProcessing ? (
                  <>
                    <div className="w-4 h-4 border-2 border-[#000000] border-t-transparent rounded-full animate-spin" />
                    <span>Confirming with UPI Gateway...</span>
                  </>
                ) : (
                  <>
                    <span>Pay ₹{pricing.buyerTotalINR.toLocaleString("en-IN")} & Unlock Files</span>
                    <ArrowRight className="w-4 h-4 text-[#000000]" />
                  </>
                )}
              </button>

              <p className="text-[11px] text-[#7B8A90] text-center">
                🔒 Protected by NPCI UPI Security protocols • Instant file download delivery
              </p>
            </form>

            {/* Right: Order Summary Breakdown (5 cols) */}
            <div className="lg:col-span-5 space-y-5">
              <div className="bg-[#111317] border border-[#202C44] rounded-2xl p-6 space-y-5 shadow-xl">
                <h3 className="text-xs font-mono font-bold text-[#D3CCB0] uppercase tracking-wider">
                  Order Summary
                </h3>

                {/* Selected Item */}
                <div className="flex items-center gap-3.5 pb-4 border-b border-[#202C44]">
                  <img
                    src={listing.thumbnailUrl}
                    alt={listing.title}
                    className="w-14 h-14 rounded-xl object-cover border border-[#202C44]"
                  />
                  <div className="flex-1 min-w-0">
                    <h4 className="text-xs font-bold text-white truncate">{listing.title}</h4>
                    <p className="text-[11px] text-[#7B8A90] font-mono mt-0.5">{listing.category}</p>
                    <span className="text-[10px] text-[#D3CCB0] font-mono bg-[#202C44] px-1.5 py-0.2 rounded mt-1 inline-block">
                      {listing.fileType}
                    </span>
                  </div>
                </div>

                {/* Canonical Pricing Table */}
                <div className="space-y-2.5 text-xs">
                  <div className="flex items-center justify-between text-[#7B8A90]">
                    <span>Creator Listed Price</span>
                    <span className="font-mono text-white">₹{pricing.listedPriceINR.toLocaleString("en-IN")}</span>
                  </div>

                  <div className="flex items-center justify-between text-[#7B8A90]">
                    <span className="flex items-center gap-1">
                      <span>Platform Fee (10%)</span>
                      <span className="text-[10px] text-[#7B8A90] font-mono">(hosting & verification)</span>
                    </span>
                    <span className="font-mono text-[#D3CCB0]">₹{pricing.platformFeeINR.toLocaleString("en-IN")}</span>
                  </div>

                  <div className="pt-3 border-t border-[#202C44] flex items-center justify-between text-sm font-bold text-white">
                    <span>Total Amount (₹)</span>
                    <span className="text-lg font-extrabold text-[#D3CCB0] font-heading">
                      ₹{pricing.buyerTotalINR.toLocaleString("en-IN")}
                    </span>
                  </div>
                </div>

                {/* Guarantee Features */}
                <div className="pt-4 border-t border-[#202C44] space-y-2 text-[11px] text-[#7B8A90]">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                    <span>Instant uncompressed .zip download</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                    <span>Commercial use license certificate included</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                    <span>Unlimited future re-downloads from library</span>
                  </div>
                </div>

              </div>
            </div>

          </div>

        </div>
      )}

    </div>
  );
};

import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { AssetListing, calculatePricing, UserPurchase } from "../types";
import { auth } from "../lib/firebase";
import {
  ShieldCheck,
  Lock,
  Download,
  CheckCircle2,
  AlertCircle,
  Copy,
  ArrowRight,
  Sparkles,
  Smartphone,
  CreditCard,
  Zap,
  Check
} from "lucide-react";

interface CheckoutPageProps {
  listings: AssetListing[];
  onCompletePurchase: (purchase: UserPurchase) => void;
  buyerEmail?: string;
  isAuthenticated?: boolean;
}

export const CheckoutPage: React.FC<CheckoutPageProps> = ({
  listings,
  onCompletePurchase,
  buyerEmail: initialBuyerEmail = "developer@kreatestudio.in",
  isAuthenticated = false,
}) => {
  const { listingId } = useParams<{ listingId: string }>();
  const navigate = useNavigate();

  const listing = listings.find((l) => (l.id === listingId || l.slug === listingId) && l.deleted !== true);

  const [paymentMethod, setPaymentMethod] = useState<"upi" | "gpay" | "phonepe" | "card">("upi");
  const [buyerEmail, setBuyerEmail] = useState(initialBuyerEmail);
  const [upiId, setUpiId] = useState("");
  const [cardNumber, setCardNumber] = useState("");
  const [cardExpiry, setCardExpiry] = useState("");
  const [cardCvv, setCardCvv] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [purchaseSuccess, setPurchaseSuccess] = useState<UserPurchase | null>(null);
  const [copiedKey, setCopiedKey] = useState(false);

  // If initial email changes (e.g. user logs in)
  useEffect(() => {
    if (initialBuyerEmail && initialBuyerEmail !== "developer@kreatestudio.in") {
      setBuyerEmail(initialBuyerEmail);
    }
  }, [initialBuyerEmail]);

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

  // Calculate pricing using 10% platform fee
  const itemPrice = typeof listing.price === "number" && !isNaN(listing.price) ? Math.max(0, listing.price) : 0;
  const pricing = calculatePricing(itemPrice);
  const creatorName = listing.creator?.name || listing.seller?.name || "Verified Seller";

  const handlePay = (e: React.FormEvent) => {
    e.preventDefault();
    if (!buyerEmail.includes("@")) {
      alert("Please enter a valid email address for file delivery.");
      return;
    }

    setIsProcessing(true);

    setTimeout(() => {
      const orderId = `KRT-${Math.floor(100000 + Math.random() * 900000)}`;
      const licenseKey = `KREATE-COMM-2026-${Math.random().toString(36).substring(2, 6).toUpperCase()}-${Math.random().toString(36).substring(2, 6).toUpperCase()}`;

      // PRODUCTION ARCHITECTURE SPECIFICATION:
      // In production, the client does NOT generate the deliverable URL or directly write purchases.
      // The authoritative production payment pipeline requires:
      //   1. Browser initiates payment with Razorpay / Stripe
      //   2. Payment Gateway calls Server Webhook
      //   3. Server verifies payment signature
      //   4. Server uses Firebase Admin SDK to write trusted record to /purchases/{purchaseId}
      //   5. Authenticated buyer requests download -> server verifies purchase -> generates short-lived signed URL
      // This simulated flow operates locally in client state for UI demonstration
      // without performing unauthorized direct client-side Firebase writes.
      const secureDeliverableUrl = `https://kreatestudio.dev/deliveries/${listing.id}.zip`;

      const newPurchase: UserPurchase = {
        purchaseId: orderId,
        orderId,
        buyerId: auth.currentUser?.uid || "buyer",
        sellerId: listing.sellerId || listing.creator?.id || "seller",
        listingId: listing.id,
        title: listing.title,
        thumbnailUrl: listing.thumbnailUrl,
        category: listing.category,
        fileType: listing.fileType,
        downloadUrl: secureDeliverableUrl,
        licenseKey,
        purchaseDate: new Date().toLocaleDateString("en-GB", {
          day: "numeric",
          month: "short",
          year: "numeric",
        }),
        pricePaidINR: pricing.buyerTotalINR,
        amountPaid: pricing.buyerTotalINR,
        sellerNetINR: pricing.sellerNetINR,
        platformFeeINR: pricing.platformFeeINR,
        paymentMethod: paymentMethod.toUpperCase(),
      };

      onCompletePurchase(newPurchase);
      setPurchaseSuccess(newPurchase);
      setIsProcessing(false);
    }, 1200);
  };

  const handleCopyLicense = () => {
    if (purchaseSuccess) {
      navigator.clipboard?.writeText(purchaseSuccess.licenseKey);
      setCopiedKey(true);
      setTimeout(() => setCopiedKey(false), 2000);
    }
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] flex flex-col justify-center py-10 px-4 sm:px-6 lg:px-8">
      
      {/* 1. SUCCESS CONFIRMATION STATE */}
      {purchaseSuccess ? (
        <div className="max-w-xl w-full mx-auto bg-[#111317] border border-[#202C44] rounded-3xl p-6 sm:p-10 space-y-6 shadow-2xl animate-fade-in">
          <div className="text-center space-y-3">
            <div className="w-16 h-16 rounded-2xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto border border-emerald-500/30">
              <CheckCircle2 className="w-9 h-9" />
            </div>
            <span className="text-xs font-mono text-emerald-400 font-bold uppercase tracking-wider block">
              Payment Completed • Order {purchaseSuccess.orderId}
            </span>
            <h1 className="text-2xl sm:text-3xl font-heading font-extrabold text-white">
              Purchase Successful!
            </h1>
            <p className="text-xs text-[#7B8A90] max-w-sm mx-auto">
              Your uncompressed archive is ready. A receipt and commercial license certificate have been sent to <span className="text-white font-mono">{buyerEmail}</span>.
            </p>
          </div>

          {/* Purchased Summary Box */}
          <div className="bg-[#202C44]/70 border border-[#202C44] rounded-2xl p-5 space-y-4">
            <div className="flex items-center gap-3.5">
              <img
                src={purchaseSuccess.thumbnailUrl}
                alt={purchaseSuccess.title}
                className="w-14 h-14 rounded-xl object-cover border border-[#202C44]"
              />
              <div className="flex-1 min-w-0">
                <h3 className="text-xs sm:text-sm font-bold text-white truncate">{purchaseSuccess.title}</h3>
                <p className="text-[11px] text-[#7B8A90] font-mono mt-0.5">
                  {purchaseSuccess.category} • {purchaseSuccess.fileType}
                </p>
                <p className="text-xs font-mono font-bold text-[#D3CCB0] mt-1">
                  Paid ₹{purchaseSuccess.pricePaidINR.toLocaleString("en-IN")} via {purchaseSuccess.paymentMethod}
                </p>
              </div>
            </div>

            {/* License Key Box */}
            <div className="bg-[#111317] border border-[#202C44] rounded-xl p-3.5 space-y-1.5">
              <div className="flex items-center justify-between text-[11px]">
                <span className="text-[#7B8A90] font-mono">Commercial License Key</span>
                <button
                  type="button"
                  onClick={handleCopyLicense}
                  className="text-[#D3CCB0] hover:underline flex items-center gap-1 font-mono font-bold"
                >
                  <Copy className="w-3 h-3" />
                  <span>{copiedKey ? "Copied!" : "Copy"}</span>
                </button>
              </div>
              <p className="font-mono text-xs font-bold text-white bg-[#000000] p-2 rounded-lg border border-[#202C44] select-all truncate">
                {purchaseSuccess.licenseKey}
              </p>
            </div>

            {/* Direct Download Trigger */}
            <a
              href={purchaseSuccess.downloadUrl}
              download
              className="w-full bg-[#D3CCB0] hover:bg-[#c4bb9a] text-[#000000] font-bold text-sm py-3.5 rounded-xl transition-all shadow flex items-center justify-center gap-2 active:scale-98"
            >
              <Download className="w-4 h-4 text-[#000000]" />
              <span>Download File Archive (.zip)</span>
            </a>
          </div>

          <div className="flex items-center justify-between pt-2 text-xs">
            <Link
              to="/purchases"
              className="text-[#D3CCB0] font-bold hover:underline flex items-center gap-1"
            >
              <span>Go to My Purchases</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
            <Link
              to="/browse"
              className="text-[#7B8A90] hover:text-white"
            >
              Browse more assets
            </Link>
          </div>
        </div>
      ) : (
        /* 2. RECREATED 4_checkout.png CARD */
        <div className="max-w-xl w-full mx-auto bg-[#111317] border border-[#202C44] rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xl">
          
          {/* Header: Centered checkout card titled "Secure Checkout" */}
          <div className="text-center space-y-1 pb-2 border-b border-[#202C44]">
            <div className="inline-flex items-center gap-1.5 text-xs font-mono font-bold text-[#D3CCB0] bg-[#202C44] px-3 py-1 rounded-full border border-[#202C44] mb-1">
              <Lock className="w-3 h-3" />
              <span>Encrypted Transaction</span>
            </div>
            <h1 className="text-2xl font-heading font-extrabold text-white">
              Secure Checkout
            </h1>
            <p className="text-xs text-[#7B8A90]">
              Instant access and license generation upon payment.
            </p>
          </div>

          {/* Auth Status Notification if logged out */}
          {!isAuthenticated && (
            <div className="bg-[#202C44]/60 border border-[#202C44] rounded-2xl p-3.5 flex items-center justify-between gap-3 text-xs">
              <div className="flex items-center gap-2 text-[#7B8A90]">
                <Sparkles className="w-4 h-4 text-[#D3CCB0] shrink-0" />
                <span>Checking out as guest? You can link your account anytime.</span>
              </div>
              <Link
                to={`/signin?redirect=/checkout/${listing.id}`}
                className="text-xs font-bold text-[#D3CCB0] hover:underline shrink-0"
              >
                Sign In
              </Link>
            </div>
          )}

          {/* 1. Order Summary Section */}
          <div className="space-y-3">
            <span className="text-xs font-mono font-bold text-[#7B8A90] uppercase tracking-wider block">
              Order Summary
            </span>
            <div className="flex items-center gap-4 bg-[#000000] border border-[#202C44] p-4 rounded-2xl">
              <img
                src={listing.thumbnailUrl}
                alt={listing.title}
                className="w-16 h-16 rounded-xl object-cover border border-[#202C44]"
              />
              <div className="flex-1 min-w-0">
                <h3 className="text-sm font-bold text-white truncate">{listing.title}</h3>
                <p className="text-xs text-[#7B8A90] mt-0.5">by {creatorName}</p>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-[10px] font-mono text-[#D3CCB0] bg-[#202C44] px-2 py-0.5 rounded border border-[#202C44]">
                    {listing.fileType || "ZIP Archive"}
                  </span>
                  <span className="text-[10px] text-[#7B8A90] font-mono">
                    {listing.fileSizeBytes || "12 MB"}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* 2. Price Breakdown (Item Price, Platform fee 10%, Total) */}
          <div className="space-y-3">
            <span className="text-xs font-mono font-bold text-[#7B8A90] uppercase tracking-wider block">
              Price Breakdown
            </span>
            <div className="bg-[#202C44]/40 border border-[#202C44] p-4 rounded-2xl space-y-2.5 text-xs">
              <div className="flex items-center justify-between text-[#7B8A90]">
                <span>Item price</span>
                <span className="font-mono text-white">₹{pricing.listedPriceINR.toLocaleString("en-IN")}</span>
              </div>

              <div className="flex items-center justify-between text-[#7B8A90]">
                <span>Platform + payment fee (10%)</span>
                <span className="font-mono text-[#D3CCB0]">₹{pricing.platformFeeINR.toLocaleString("en-IN")}</span>
              </div>

              <div className="pt-2.5 border-t border-[#202C44] flex items-center justify-between text-base font-bold">
                <span className="text-white">Total</span>
                <span className="text-2xl font-heading font-extrabold text-[#D3CCB0]">
                  ₹{pricing.buyerTotalINR.toLocaleString("en-IN")}
                </span>
              </div>
            </div>
          </div>

          {/* 3. Delivery Email Address */}
          <form onSubmit={handlePay} className="space-y-6">
            <div className="space-y-1.5">
              <label className="block text-xs font-medium text-[#7B8A90]">
                Email Address for Delivery & License Key
              </label>
              <input
                type="email"
                required
                value={buyerEmail}
                onChange={(e) => setBuyerEmail(e.target.value)}
                placeholder="developer@gmail.com"
                className="w-full bg-[#000000] text-white text-xs px-4 py-3 rounded-xl border border-[#202C44] focus:outline-none focus:border-[#D3CCB0]"
              />
            </div>

            {/* 4. Payment Method Selection: Buttons for UPI, GPay, PhonePe, and Card */}
            <div className="space-y-2.5">
              <label className="block text-xs font-medium text-[#7B8A90]">
                Payment Method Selection
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                {[
                  { id: "upi", label: "UPI", icon: Smartphone },
                  { id: "gpay", label: "GPay", icon: Zap },
                  { id: "phonepe", label: "PhonePe", icon: Smartphone },
                  { id: "card", label: "Card", icon: CreditCard },
                ].map((item) => {
                  const Icon = item.icon;
                  const isActive = paymentMethod === item.id;
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => setPaymentMethod(item.id as any)}
                      className={`p-3 rounded-xl border text-center transition-all flex flex-col items-center justify-center gap-1.5 ${
                        isActive
                          ? "bg-[#202C44] border-[#D3CCB0] text-white shadow-md"
                          : "bg-[#000000] border-[#202C44] text-[#7B8A90] hover:text-white hover:border-[#7B8A90]"
                      }`}
                    >
                      <Icon className={`w-4 h-4 ${isActive ? "text-[#D3CCB0]" : "text-[#7B8A90]"}`} />
                      <span className="font-bold text-xs">{item.label}</span>
                    </button>
                  );
                })}
              </div>

              {/* UPI Custom ID option */}
              {paymentMethod === "upi" && (
                <div className="pt-2">
                  <input
                    type="text"
                    value={upiId}
                    onChange={(e) => setUpiId(e.target.value)}
                    placeholder="Enter UPI VPA (e.g. name@okhdfcbank / name@upi)"
                    className="w-full bg-[#000000] text-white text-xs px-4 py-2.5 rounded-xl border border-[#202C44] focus:outline-none focus:border-[#D3CCB0]"
                  />
                </div>
              )}

              {/* Card inputs option */}
              {paymentMethod === "card" && (
                <div className="pt-2 space-y-2 bg-[#000000] p-3.5 rounded-2xl border border-[#202C44]">
                  <input
                    type="text"
                    value={cardNumber}
                    onChange={(e) => setCardNumber(e.target.value)}
                    placeholder="Card Number (XXXX XXXX XXXX XXXX)"
                    maxLength={19}
                    className="w-full bg-[#111317] text-white text-xs px-3 py-2 rounded-lg border border-[#202C44] focus:outline-none focus:border-[#D3CCB0]"
                  />
                  <div className="grid grid-cols-2 gap-2">
                    <input
                      type="text"
                      value={cardExpiry}
                      onChange={(e) => setCardExpiry(e.target.value)}
                      placeholder="MM / YY"
                      maxLength={5}
                      className="bg-[#111317] text-white text-xs px-3 py-2 rounded-lg border border-[#202C44] focus:outline-none focus:border-[#D3CCB0]"
                    />
                    <input
                      type="password"
                      value={cardCvv}
                      onChange={(e) => setCardCvv(e.target.value)}
                      placeholder="CVV"
                      maxLength={4}
                      className="bg-[#111317] text-white text-xs px-3 py-2 rounded-lg border border-[#202C44] focus:outline-none focus:border-[#D3CCB0]"
                    />
                  </div>
                </div>
              )}
            </div>

            {/* 5. Primary Action: Large Cream "Pay ₹[Total] Securely" button */}
            <button
              type="submit"
              disabled={isProcessing}
              className="w-full bg-[#D3CCB0] hover:bg-[#c4bb9a] text-[#000000] font-bold text-sm py-4 px-6 rounded-2xl transition-all shadow-xl active:scale-98 disabled:opacity-50 flex items-center justify-center gap-2 cursor-pointer"
            >
              {isProcessing ? (
                <>
                  <div className="w-4 h-4 border-2 border-[#000000] border-t-transparent rounded-full animate-spin" />
                  <span>Processing Payment...</span>
                </>
              ) : (
                <>
                  <Lock className="w-4 h-4 text-[#000000]" />
                  <span>Pay ₹{pricing.buyerTotalINR.toLocaleString("en-IN")} Securely</span>
                </>
              )}
            </button>
          </form>

          {/* 6. Trust Signal: "Secured by Razorpay" */}
          <div className="pt-4 border-t border-[#202C44] flex flex-col sm:flex-row items-center justify-between gap-2 text-[11px] text-[#7B8A90]">
            <div className="flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Secured by Razorpay</span>
            </div>
            <span className="font-mono text-[10px]">256-bit SSL • Instant Download</span>
          </div>

        </div>
      )}

    </div>
  );
};

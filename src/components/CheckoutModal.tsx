import React, { useState } from "react";
import { AssetListing } from "../types";
import { X, Check, ShieldCheck, Download, QrCode, ArrowRight, CheckCircle2, Copy, ExternalLink, RefreshCw } from "lucide-react";

interface CheckoutModalProps {
  listing: AssetListing;
  onClose: () => void;
  onPurchaseComplete: (listing: AssetListing) => void;
}

export const CheckoutModal: React.FC<CheckoutModalProps> = ({
  listing,
  onClose,
  onPurchaseComplete,
}) => {
  const [paymentMethod, setPaymentMethod] = useState<"gpay" | "phonepe" | "upi_id" | "card">("gpay");
  const [upiIdInput, setUpiIdInput] = useState("creator@okaxis");
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [copiedKey, setCopiedKey] = useState(false);

  const listedPrice = listing.priceInINR;
  const platformFee = Math.round(listedPrice * 0.125);
  const totalBuyerPayable = listedPrice + platformFee;
  const sellerNetEarnings = Math.round(listedPrice * 0.9);

  const mockOrderId = `KS-ORD-${Math.floor(1000 + Math.random() * 9000)}`;
  const mockLicenseKey = `KS-LIC-2026-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;

  const handlePay = (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);

    setTimeout(() => {
      setIsProcessing(false);
      setIsSuccess(true);
      onPurchaseComplete(listing);
    }, 1500);
  };

  const handleCopyLicense = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(mockLicenseKey);
      setCopiedKey(true);
      setTimeout(() => setCopiedKey(false), 2000);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#000000]/80 backdrop-blur-md p-4 overflow-y-auto">
      <div className="bg-[#202C44] border border-[#202C44] w-full max-w-lg rounded-2xl overflow-hidden shadow-2xl relative my-8">
        
        {/* Header */}
        <div className="p-5 border-b border-[#111317] flex items-center justify-between">
          <div>
            <span className="text-[10px] font-mono text-[#D3CCB0] uppercase tracking-widest block">
              Instant UPI Gateway
            </span>
            <h3 className="text-lg font-heading font-bold text-white">
              {isSuccess ? "Purchase Successful!" : "Complete Checkout"}
            </h3>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-[#7B8A90] hover:text-white rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        {!isSuccess ? (
          <form onSubmit={handlePay} className="p-6 space-y-6">
            
            {/* Listing Summary */}
            <div className="bg-[#111317] border border-[#202C44] p-4 rounded-xl flex items-center gap-3">
              <img
                src={listing.thumbnailUrl}
                alt={listing.title}
                className="w-14 h-14 rounded-lg object-cover border border-[#202C44]"
              />
              <div className="flex-1 min-w-0">
                <h4 className="text-xs font-heading font-bold text-white truncate">
                  {listing.title}
                </h4>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-[10px] text-[#7B8A90] bg-[#202C44] px-2 py-0.5 rounded font-mono">
                    {listing.category}
                  </span>
                  <span className="text-[10px] text-[#7B8A90]">
                    By {listing.seller?.name || listing.creator?.name || "Verified Creator"}
                  </span>
                </div>
              </div>
            </div>

            {/* Pricing Breakdown Card */}
            <div className="bg-[#111317]/80 border border-[#202C44] rounded-xl p-4 space-y-2.5 text-xs text-[#7B8A90]">
              <div className="flex justify-between">
                <span>Listed Price</span>
                <span className="font-mono text-white">₹{listedPrice.toLocaleString("en-IN")}</span>
              </div>

              <div className="flex justify-between">
                <span className="flex items-center gap-1">
                  <span>Platform & Processing Fee</span>
                  <span className="text-[10px] bg-[#202C44] px-1 rounded text-[#D3CCB0]">12.5%</span>
                </span>
                <span className="font-mono text-[#7B8A90]">+ ₹{platformFee.toLocaleString("en-IN")}</span>
              </div>

              <div className="pt-2 border-t border-[#202C44] flex justify-between items-baseline text-white">
                <span className="font-bold text-sm">Total Payable</span>
                <span className="text-xl font-heading font-bold text-[#D3CCB0]">
                  ₹{totalBuyerPayable.toLocaleString("en-IN")}
                </span>
              </div>

              <div className="text-[10px] text-[#7B8A90] pt-1">
                Note: Creator receives ₹{sellerNetEarnings.toLocaleString("en-IN")} (90% guaranteed net split).
              </div>
            </div>

            {/* Payment Method Selector */}
            <div className="space-y-3">
              <label className="text-xs font-heading font-bold text-white block">
                Select UPI Payment Gateway
              </label>

              <div className="grid grid-cols-2 gap-2.5">
                <button
                  type="button"
                  onClick={() => setPaymentMethod("gpay")}
                  className={`p-3 rounded-xl border text-left transition-all ${
                    paymentMethod === "gpay"
                      ? "bg-[#202C44] border-[#D3CCB0] text-white"
                      : "bg-[#111317] border-[#202C44] text-[#7B8A90] hover:text-white"
                  }`}
                >
                  <span className="text-xs font-bold text-[#D3CCB0] block font-mono">Google Pay</span>
                  <span className="text-[10px] block opacity-80">Instant UPI Tap</span>
                </button>

                <button
                  type="button"
                  onClick={() => setPaymentMethod("phonepe")}
                  className={`p-3 rounded-xl border text-left transition-all ${
                    paymentMethod === "phonepe"
                      ? "bg-[#202C44] border-[#D3CCB0] text-white"
                      : "bg-[#111317] border-[#202C44] text-[#7B8A90] hover:text-white"
                  }`}
                >
                  <span className="text-xs font-bold text-[#D3CCB0] block font-mono">PhonePe / BHIM</span>
                  <span className="text-[10px] block opacity-80">Instant QR / App</span>
                </button>

                <button
                  type="button"
                  onClick={() => setPaymentMethod("upi_id")}
                  className={`p-3 rounded-xl border text-left transition-all ${
                    paymentMethod === "upi_id"
                      ? "bg-[#202C44] border-[#D3CCB0] text-white"
                      : "bg-[#111317] border-[#202C44] text-[#7B8A90] hover:text-white"
                  }`}
                >
                  <span className="text-xs font-bold text-white block font-mono">Custom UPI ID</span>
                  <span className="text-[10px] block opacity-80">Enter @upi handle</span>
                </button>

                <button
                  type="button"
                  onClick={() => setPaymentMethod("card")}
                  className={`p-3 rounded-xl border text-left transition-all ${
                    paymentMethod === "card"
                      ? "bg-[#202C44] border-[#D3CCB0] text-white"
                      : "bg-[#111317] border-[#202C44] text-[#7B8A90] hover:text-white"
                  }`}
                >
                  <span className="text-xs font-bold text-white block font-mono">Debit / Credit Card</span>
                  <span className="text-[10px] block opacity-80">Visa, Mastercard, RuPay</span>
                </button>
              </div>

              {/* UPI ID Input field if selected */}
              {paymentMethod === "upi_id" && (
                <div className="pt-2">
                  <label className="text-[11px] text-[#7B8A90] block mb-1">Your Virtual Payment Address (VPA)</label>
                  <input
                    type="text"
                    value={upiIdInput}
                    onChange={(e) => setUpiIdInput(e.target.value)}
                    placeholder="e.g. name@okaxis or mobile@ybl"
                    className="w-full bg-[#111317] text-white text-xs px-3 py-2 rounded-lg border border-[#202C44] focus:outline-none focus:border-[#D3CCB0]"
                  />
                </div>
              )}
            </div>

            {/* Pay Button */}
            <button
              type="submit"
              disabled={isProcessing}
              className="w-full bg-[#D3CCB0] hover:bg-[#c4bb9a] text-[#000000] font-heading font-extrabold text-sm py-3.5 px-4 rounded-xl transition-all flex items-center justify-center gap-2 active:scale-95 shadow-lg disabled:opacity-50"
            >
              {isProcessing ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin text-[#000000]" />
                  <span>Verifying UPI Transaction...</span>
                </>
              ) : (
                <>
                  <span>Pay ₹{totalBuyerPayable.toLocaleString("en-IN")} via UPI</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>

            <div className="text-center text-[10px] text-[#7B8A90] flex items-center justify-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-[#D3CCB0]" />
              <span>256-Bit Encrypted UPI Gateway • Zero FX Conversion Fees</span>
            </div>

          </form>
        ) : (
          /* SUCCESS STATE */
          <div className="p-6 space-y-6 text-center">
            
            <div className="w-16 h-16 rounded-2xl bg-[#111317] border border-[#202C44] text-[#D3CCB0] flex items-center justify-center mx-auto shadow-xl">
              <CheckCircle2 className="w-8 h-8" />
            </div>

            <div>
              <h4 className="text-xl font-heading font-extrabold text-white">
                Payment Received!
              </h4>
              <p className="text-xs text-[#7B8A90] mt-1">
                Your payment of ₹{totalBuyerPayable.toLocaleString("en-IN")} has been verified.
              </p>
            </div>

            {/* Order Details Receipt Box */}
            <div className="bg-[#111317] border border-[#202C44] rounded-xl p-4 text-left space-y-2 text-xs">
              <div className="flex justify-between text-[#7B8A90]">
                <span>Order Reference</span>
                <span className="font-mono text-white font-bold">{mockOrderId}</span>
              </div>

              <div className="flex justify-between text-[#7B8A90]">
                <span>Item</span>
                <span className="text-white font-semibold truncate max-w-[200px]">{listing.title}</span>
              </div>

              <div className="flex justify-between text-[#7B8A90]">
                <span>Seller Split Status</span>
                <span className="text-[#D3CCB0] font-mono">₹{sellerNetEarnings} Allocated to {listing.seller.name}</span>
              </div>

              <div className="pt-2 border-t border-[#202C44] flex items-center justify-between">
                <span className="text-[#7B8A90]">Commercial License Key</span>
                <button
                  onClick={handleCopyLicense}
                  className="flex items-center gap-1 font-mono text-[#D3CCB0] hover:underline"
                >
                  <span>{mockLicenseKey}</span>
                  <Copy className="w-3 h-3" />
                </button>
              </div>
              {copiedKey && (
                <span className="text-[10px] text-[#D3CCB0] block text-right font-mono">
                  Copied to clipboard!
                </span>
              )}
            </div>

            {/* Download Button: In production, served via authenticated server-generated signed URL */}
            <a
              href={`https://kreatestudio.dev/deliveries/${listing.id}.zip`}
              download
              target="_blank"
              rel="noopener noreferrer"
              className="w-full bg-[#D3CCB0] hover:bg-[#c4bb9a] text-[#000000] font-heading font-extrabold text-sm py-3.5 px-4 rounded-xl transition-all flex items-center justify-center gap-2 active:scale-95 shadow-lg block"
            >
              <Download className="w-4 h-4" />
              <span>Download Raw Files (.zip)</span>
            </a>

            <button
              onClick={onClose}
              className="text-xs text-[#7B8A90] hover:text-white transition-colors underline block mx-auto"
            >
              Close and return to marketplace
            </button>

          </div>
        )}

      </div>
    </div>
  );
};

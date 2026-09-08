import React, { useState } from "react";
import { UserRole, UserProfile } from "../types";
import { ShoppingBag, Store, Sparkles, ShieldCheck, ArrowRight, Check, User, Mail, Smartphone, X } from "lucide-react";

interface OnboardingModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUserProfile: UserProfile;
  onSaveProfile: (profile: UserProfile) => void;
}

export const OnboardingModal: React.FC<OnboardingModalProps> = ({
  isOpen,
  onClose,
  currentUserProfile,
  onSaveProfile,
}) => {
  const [selectedRole, setSelectedRole] = useState<UserRole>(currentUserProfile.role || "buyer");
  const [name, setName] = useState(currentUserProfile.name || "Rachit K.");
  const [email, setEmail] = useState(currentUserProfile.email || "creator@kreate.in");
  const [upiId, setUpiId] = useState(currentUserProfile.upiId || "rachit@okaxis");
  const [avatar, setAvatar] = useState(
    currentUserProfile.avatar || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200"
  );
  const [step, setStep] = useState<1 | 2>(1);

  if (!isOpen) return null;

  const AVATAR_OPTIONS = [
    "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200",
    "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200",
    "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=200",
    "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=200",
  ];

  const handleComplete = (e: React.FormEvent) => {
    e.preventDefault();
    const updatedProfile: UserProfile = {
      name: name.trim() || "Creator User",
      email: email.trim() || "user@kreate.in",
      upiId: upiId.trim() || "user@upi",
      role: selectedRole,
      avatar,
      joinedDate: currentUserProfile.joinedDate || "August 2026",
      hasCompletedOnboarding: true,
    };

    onSaveProfile(updatedProfile);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
      <div className="bg-[#111317] border border-[#202C44] rounded-3xl max-w-xl w-full p-6 sm:p-8 shadow-2xl relative overflow-hidden text-white space-y-6">
        
        {/* Subtle Background Glow */}
        <div className="absolute -top-24 -right-24 w-60 h-60 bg-[#D3CCB0]/10 rounded-full blur-3xl pointer-events-none" />

        {/* Close Button if already onboarded */}
        {currentUserProfile.hasCompletedOnboarding && (
          <button
            onClick={onClose}
            className="absolute top-5 right-5 p-2 text-[#7B8A90] hover:text-white rounded-full bg-[#202C44]/50 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        )}

        {/* Modal Header */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center gap-1.5 bg-[#202C44] text-[#D3CCB0] text-xs font-mono font-bold px-3 py-1 rounded-full border border-[#202C44]">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Welcome to Kreate Studio</span>
          </div>

          <h2 className="text-2xl sm:text-3xl font-heading font-extrabold tracking-tight text-white">
            How do you want to start?
          </h2>

          <p className="text-xs sm:text-sm text-[#7B8A90] max-w-md mx-auto">
            Choose your primary workflow. You can switch between Buyer & Seller modes at any time.
          </p>
        </div>

        {/* STEP 1: SELECT ROLE */}
        {step === 1 && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              
              {/* Option A: BUYER */}
              <button
                type="button"
                onClick={() => setSelectedRole("buyer")}
                className={`relative text-left p-5 rounded-2xl border transition-all flex flex-col justify-between space-y-4 group ${
                  selectedRole === "buyer"
                    ? "bg-[#202C44]/90 border-[#D3CCB0] shadow-lg shadow-[#D3CCB0]/5 ring-1 ring-[#D3CCB0]"
                    : "bg-[#000000]/60 border-[#202C44] hover:border-[#7B8A90]"
                }`}
              >
                {selectedRole === "buyer" && (
                  <div className="absolute top-3 right-3 bg-[#D3CCB0] text-[#000000] p-1 rounded-full">
                    <Check className="w-3.5 h-3.5 stroke-[3]" />
                  </div>
                )}

                <div className="space-y-3">
                  <div className="w-10 h-10 rounded-xl bg-[#000000] border border-[#202C44] flex items-center justify-center text-[#D3CCB0]">
                    <ShoppingBag className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-heading font-bold text-base text-white group-hover:text-[#D3CCB0] transition-colors">
                      Start as Buyer
                    </h3>
                    <p className="text-xs text-[#7B8A90] mt-1 leading-relaxed">
                      Discover & buy verified UI kits, source code, 3D models, & AI templates with instant UPI access.
                    </p>
                  </div>
                </div>

                <div className="pt-2 border-t border-[#202C44]/80 flex items-center justify-between text-[11px] font-mono text-[#D3CCB0]">
                  <span>Instant UPI Downloads</span>
                  <ShieldCheck className="w-4 h-4 text-[#D3CCB0]" />
                </div>
              </button>

              {/* Option B: SELLER */}
              <button
                type="button"
                onClick={() => setSelectedRole("seller")}
                className={`relative text-left p-5 rounded-2xl border transition-all flex flex-col justify-between space-y-4 group ${
                  selectedRole === "seller"
                    ? "bg-[#202C44]/90 border-[#D3CCB0] shadow-lg shadow-[#D3CCB0]/5 ring-1 ring-[#D3CCB0]"
                    : "bg-[#000000]/60 border-[#202C44] hover:border-[#7B8A90]"
                }`}
              >
                {selectedRole === "seller" && (
                  <div className="absolute top-3 right-3 bg-[#D3CCB0] text-[#000000] p-1 rounded-full">
                    <Check className="w-3.5 h-3.5 stroke-[3]" />
                  </div>
                )}

                <div className="space-y-3">
                  <div className="w-10 h-10 rounded-xl bg-[#000000] border border-[#202C44] flex items-center justify-center text-[#D3CCB0]">
                    <Store className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-heading font-bold text-base text-white group-hover:text-[#D3CCB0] transition-colors">
                      Start as Seller
                    </h3>
                    <p className="text-xs text-[#7B8A90] mt-1 leading-relaxed">
                      Publish your digital creations & keep 90% net revenue deposited straight into your Indian bank/UPI.
                    </p>
                  </div>
                </div>

                <div className="pt-2 border-t border-[#202C44]/80 flex items-center justify-between text-[11px] font-mono text-[#D3CCB0]">
                  <span>90% Revenue Payout</span>
                  <Sparkles className="w-4 h-4 text-[#D3CCB0]" />
                </div>
              </button>

            </div>

            <button
              type="button"
              onClick={() => setStep(2)}
              className="w-full bg-[#D3CCB0] hover:bg-[#c4bb9a] text-[#000000] font-heading font-bold text-sm py-3.5 rounded-2xl transition-all flex items-center justify-center gap-2 shadow-lg shadow-[#D3CCB0]/10"
            >
              <span>Continue with {selectedRole === "seller" ? "Seller Mode" : "Buyer Mode"}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* STEP 2: PROFILE DETAILS */}
        {step === 2 && (
          <form onSubmit={handleComplete} className="space-y-5">
            
            <div className="flex items-center justify-between border-b border-[#202C44] pb-3 text-xs text-[#7B8A90]">
              <span>Setting up your {selectedRole === "seller" ? "Seller Studio" : "Buyer Account"}</span>
              <button
                type="button"
                onClick={() => setStep(1)}
                className="text-[#D3CCB0] hover:underline"
              >
                ← Change Role
              </button>
            </div>

            {/* Avatar Selector */}
            <div>
              <label className="block text-xs font-mono text-[#7B8A90] mb-2">Choose Avatar:</label>
              <div className="flex items-center gap-3">
                {AVATAR_OPTIONS.map((imgUrl, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setAvatar(imgUrl)}
                    className={`w-12 h-12 rounded-2xl overflow-hidden border-2 transition-all ${
                      avatar === imgUrl ? "border-[#D3CCB0] scale-105 shadow-md" : "border-[#202C44] opacity-60 hover:opacity-100"
                    }`}
                  >
                    <img src={imgUrl} alt="Avatar" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            </div>

            {/* Full Name */}
            <div>
              <label className="block text-xs font-mono text-[#7B8A90] mb-1">
                {selectedRole === "seller" ? "Creator / Studio Name" : "Your Full Name"}
              </label>
              <div className="relative">
                <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#7B8A90]" />
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Rachit K. / Pixel Craft Studio"
                  className="w-full bg-[#000000] text-white text-xs pl-10 pr-3 py-3 rounded-xl border border-[#202C44] focus:outline-none focus:border-[#D3CCB0]"
                />
              </div>
            </div>

            {/* Email Address */}
            <div>
              <label className="block text-xs font-mono text-[#7B8A90] mb-1">
                Email Address (For Invoices & Instant Download Links)
              </label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#7B8A90]" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="e.g. creator@domain.com"
                  className="w-full bg-[#000000] text-white text-xs pl-10 pr-3 py-3 rounded-xl border border-[#202C44] focus:outline-none focus:border-[#D3CCB0]"
                />
              </div>
            </div>

            {/* UPI ID */}
            <div>
              <label className="block text-xs font-mono text-[#7B8A90] mb-1">
                {selectedRole === "seller" ? "UPI VPA ID (For Receiving 90% Earnings Payouts)" : "UPI ID (Optional - For Fast 1-Click Pay)"}
              </label>
              <div className="relative">
                <Smartphone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#7B8A90]" />
                <input
                  type="text"
                  required={selectedRole === "seller"}
                  value={upiId}
                  onChange={(e) => setUpiId(e.target.value)}
                  placeholder="e.g. username@okaxis or mobile@upi"
                  className="w-full bg-[#000000] text-white text-xs pl-10 pr-3 py-3 rounded-xl border border-[#202C44] focus:outline-none focus:border-[#D3CCB0]"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-[#D3CCB0] hover:bg-[#c4bb9a] text-[#000000] font-heading font-bold text-sm py-3.5 rounded-2xl transition-all shadow-lg shadow-[#D3CCB0]/10 flex items-center justify-center gap-2 mt-2"
            >
              <Sparkles className="w-4 h-4" />
              <span>Launch {selectedRole === "seller" ? "Seller Studio" : "Marketplace Experience"}</span>
            </button>
          </form>
        )}

      </div>
    </div>
  );
};

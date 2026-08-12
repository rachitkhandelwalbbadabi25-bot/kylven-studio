import React, { useState } from "react";
import { UserProfile } from "../types";
import { X, Lock, ShieldCheck, Mail, User, CheckCircle2, ArrowRight, Sparkles } from "lucide-react";

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSignInSuccess: (profile: UserProfile) => void;
  initialMode?: "signin" | "signup";
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  onSignInSuccess,
  initialMode = "signin",
}) => {
  const [mode, setMode] = useState<"signin" | "signup">(initialMode);
  const [email, setEmail] = useState("rachit@kreate.in");
  const [name, setName] = useState("Rachit Khandelwal");
  const [upiId, setUpiId] = useState("rachit@okaxis");

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const profile: UserProfile = {
      name: name || "Rachit Khandelwal",
      email: email || "rachit@kreate.in",
      upiId: upiId || "rachit@okaxis",
      role: "buyer",
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200",
      joinedDate: "August 2026",
      hasCompletedOnboarding: true,
    };
    onSignInSuccess(profile);
    onClose();
  };

  const handleDemoLogin = () => {
    const demoProfile: UserProfile = {
      name: "Rachit Khandelwal",
      email: "rachit@kreate.in",
      upiId: "rachit@okaxis",
      role: "buyer",
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200",
      joinedDate: "August 2026",
      hasCompletedOnboarding: true,
    };
    onSignInSuccess(demoProfile);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-md bg-[#111317] border border-[#202C44] rounded-2xl p-6 sm:p-8 shadow-2xl space-y-6">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-[#7B8A90] hover:text-white p-2 rounded-lg hover:bg-[#202C44]/50 transition-colors"
          aria-label="Close authentication modal"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-[#202C44] text-[#D3CCB0] flex items-center justify-center mx-auto border border-[#202C44]">
            <Sparkles className="w-6 h-6" />
          </div>
          <h3 className="text-xl font-heading font-extrabold text-white">
            {mode === "signin" ? "Sign in to Kreate Studio" : "Create Creator Account"}
          </h3>
          <p className="text-xs text-[#7B8A90] max-w-xs mx-auto">
            {mode === "signin"
              ? "Access your purchased digital assets, saved items, and seller earnings."
              : "Join India's premier digital asset marketplace for developers & designers."}
          </p>
        </div>

        {/* 1-Click Demo Login Banner */}
        <div className="bg-[#202C44]/40 border border-[#202C44] rounded-xl p-3.5 space-y-2 text-center">
          <div className="flex items-center justify-center gap-1.5 text-xs text-[#D3CCB0] font-medium">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>Instant Demo Session Available</span>
          </div>
          <button
            type="button"
            onClick={handleDemoLogin}
            className="w-full bg-[#202C44] hover:bg-[#202C44]/80 text-[#D3CCB0] hover:text-white font-bold text-xs py-2.5 rounded-lg border border-[#202C44] transition-all flex items-center justify-center gap-2"
          >
            <span>Sign in as Rachit K. (Demo Creator)</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="relative flex items-center justify-center">
          <div className="border-t border-[#202C44] w-full" />
          <span className="bg-[#111317] px-3 text-[10px] text-[#7B8A90] font-mono uppercase tracking-wider absolute">
            Or continue with email
          </span>
        </div>

        {/* Auth Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {mode === "signup" && (
            <div className="space-y-1">
              <label className="text-[11px] font-medium text-[#7B8A90]">Full Name</label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#7B8A90]" />
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Rachit Khandelwal"
                  className="w-full bg-[#000000] text-white text-xs pl-9 pr-3 py-2.5 rounded-xl border border-[#202C44] focus:outline-none focus:border-[#D3CCB0]"
                />
              </div>
            </div>
          )}

          <div className="space-y-1">
            <label className="text-[11px] font-medium text-[#7B8A90]">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#7B8A90]" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your.email@example.in"
                className="w-full bg-[#000000] text-white text-xs pl-9 pr-3 py-2.5 rounded-xl border border-[#202C44] focus:outline-none focus:border-[#D3CCB0]"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-[11px] font-medium text-[#7B8A90]">UPI VPA ID (For Instant Payouts)</label>
            <input
              type="text"
              value={upiId}
              onChange={(e) => setUpiId(e.target.value)}
              placeholder="e.g. name@okaxis or name@upi"
              className="w-full bg-[#000000] text-white text-xs px-3 py-2.5 rounded-xl border border-[#202C44] focus:outline-none focus:border-[#D3CCB0]"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-[#D3CCB0] hover:bg-[#c4bb9a] text-[#000000] font-bold text-xs py-3 rounded-xl transition-all shadow-lg active:scale-95"
          >
            {mode === "signin" ? "Sign In to Account" : "Register Creator Profile"}
          </button>
        </form>

        {/* Toggle Mode Footer */}
        <div className="text-center pt-2 border-t border-[#202C44]/50">
          <button
            type="button"
            onClick={() => setMode(mode === "signin" ? "signup" : "signin")}
            className="text-xs text-[#7B8A90] hover:text-[#D3CCB0] transition-colors"
          >
            {mode === "signin"
              ? "Don't have an account? Register here"
              : "Already have an account? Sign in"}
          </button>
        </div>

      </div>
    </div>
  );
};

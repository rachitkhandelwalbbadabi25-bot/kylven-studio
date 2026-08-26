import React, { useState } from "react";
import { useNavigate, useLocation, Link, useSearchParams } from "react-router-dom";
import { UserProfile } from "../types";
import {
  ShieldCheck,
  CheckCircle2,
  Lock,
  Sparkles,
  ArrowRight,
  Layers,
  Percent,
  Check
} from "lucide-react";

interface AuthPageProps {
  onLoginSuccess: (profile: UserProfile) => void;
  defaultMode?: "signin" | "signup";
}

export const AuthPage: React.FC<AuthPageProps> = ({
  onLoginSuccess,
  defaultMode = "signup",
}) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const redirectUrl = searchParams.get("redirect") || "";

  const isSignUpInitial =
    location.pathname === "/signup" ||
    defaultMode === "signup" ||
    (location.pathname !== "/signin" && defaultMode !== "signin");

  const [isSignUp, setIsSignUp] = useState(isSignUpInitial);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<"buyer" | "seller">("buyer");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");

    if (!email.trim() || !email.includes("@")) {
      setErrorMessage("Please enter a valid email address.");
      return;
    }
    if (password.length < 6) {
      setErrorMessage("Password must be at least 6 characters.");
      return;
    }
    if (isSignUp && !name.trim()) {
      setErrorMessage("Please enter your full name.");
      return;
    }

    setIsSubmitting(true);

    const displayName = isSignUp && name.trim() ? name.trim() : email.split("@")[0];
    const cleanUsername = displayName.toLowerCase().replace(/[^a-z0-9]/g, "_");

    const newProfile: UserProfile = {
      name: displayName,
      email: email.trim(),
      username: cleanUsername,
      role: role === "seller" ? "seller" : "buyer",
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80",
      bio: role === "seller" ? "Digital creator on Kreate Studio." : "Digital asset buyer on Kreate Studio.",
    };

    setTimeout(() => {
      onLoginSuccess(newProfile);
      setIsSubmitting(false);

      if (redirectUrl) {
        navigate(redirectUrl);
      } else if (role === "seller") {
        navigate("/dashboard");
      } else {
        navigate("/browse");
      }
    }, 600);
  };

  const handleQuickDemoLogin = (demoRole: "buyer" | "seller") => {
    const demoProfile: UserProfile = {
      name: demoRole === "seller" ? "Aarav Sharma" : "Rachit Khandelwal",
      email: demoRole === "seller" ? "aarav.sharma@kreate.studio" : "rachit@gmail.com",
      username: demoRole === "seller" ? "aarav_ui" : "rachit_k",
      role: demoRole,
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80",
      bio: demoRole === "seller" ? "Founding UI/UX Designer & Flutter Engineer at Kreate Studio." : "Verified Digital Asset Buyer.",
    };

    onLoginSuccess(demoProfile);
    if (redirectUrl) {
      navigate(redirectUrl);
    } else if (demoRole === "seller") {
      navigate("/dashboard");
    } else {
      navigate("/purchases");
    }
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] flex flex-col justify-center py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl w-full mx-auto grid grid-cols-1 lg:grid-cols-12 rounded-3xl border border-[#202C44] overflow-hidden shadow-2xl bg-[#000000]">
        
        {/* Left Side: Muted Navy Trust Panel (5 cols) */}
        <div className="lg:col-span-5 bg-[#202C44] p-8 sm:p-10 flex flex-col justify-between space-y-8 relative overflow-hidden border-b lg:border-b-0 lg:border-r border-[#202C44]">
          {/* Subtle background glow */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-[#D3CCB0]/5 rounded-full blur-3xl pointer-events-none" />

          {/* Logo & Headline */}
          <div className="space-y-6 relative z-10">
            <Link to="/" className="inline-flex items-center gap-3 group">
              <div className="w-10 h-10 rounded-xl bg-[#111317] border border-[#202C44] flex items-center justify-center transition-all group-hover:border-[#D3CCB0]">
                <span className="font-heading font-extrabold text-xl text-[#D3CCB0]">K</span>
              </div>
              <div className="flex flex-col">
                <span className="font-heading font-bold text-lg text-white leading-none">
                  Kreate <span className="text-[#D3CCB0]">Studio</span>
                </span>
                <span className="text-[10px] text-[#7B8A90] font-mono mt-0.5">
                  India’s Creative Marketplace
                </span>
              </div>
            </Link>

            <div className="space-y-2 pt-2">
              <h2 className="text-2xl sm:text-3xl font-heading font-extrabold text-white tracking-tight leading-tight">
                Join India’s creator economy.
              </h2>
              <p className="text-xs sm:text-sm text-[#7B8A90] leading-relaxed">
                Buy and sell production-ready UI kits, codebases, 3D models, presets, and AI workflows with transparent Indian Rupee checkout.
              </p>
            </div>
          </div>

          {/* Three Trust Points */}
          <div className="space-y-4 relative z-10 py-2">
            <div className="flex items-start gap-3 bg-[#111317]/60 border border-[#202C44] p-3.5 rounded-2xl">
              <div className="w-8 h-8 rounded-xl bg-[#202C44] text-[#D3CCB0] flex items-center justify-center shrink-0 border border-[#202C44]">
                <Percent className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-white">Keep 90% of Sales</h4>
                <p className="text-[11px] text-[#7B8A90] leading-snug mt-0.5">
                  Direct UPI settlement. Creators take home 90% on every single transaction.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3 bg-[#111317]/60 border border-[#202C44] p-3.5 rounded-2xl">
              <div className="w-8 h-8 rounded-xl bg-[#202C44] text-[#D3CCB0] flex items-center justify-center shrink-0 border border-[#202C44]">
                <Layers className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-white">239 Asset Categories</h4>
                <p className="text-[11px] text-[#7B8A90] leading-snug mt-0.5">
                  From Figma design kits to Flutter apps, Jupyter AI notebooks, and Blender 3D packs.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3 bg-[#111317]/60 border border-[#202C44] p-3.5 rounded-2xl">
              <div className="w-8 h-8 rounded-xl bg-[#202C44] text-emerald-400 flex items-center justify-center shrink-0 border border-[#202C44]">
                <ShieldCheck className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-white">Manually Reviewed</h4>
                <p className="text-[11px] text-[#7B8A90] leading-snug mt-0.5">
                  Every asset is virus-scanned, syntax-checked, and uncompressed before delivery.
                </p>
              </div>
            </div>
          </div>

          {/* Quick Demo Login Helpers */}
          <div className="pt-4 border-t border-[#202C44]/80 space-y-2 relative z-10">
            <div className="flex items-center gap-1.5 text-[11px] font-mono text-[#D3CCB0] font-bold">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Instant 1-Click Demo Login</span>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => handleQuickDemoLogin("buyer")}
                className="bg-[#111317] hover:bg-[#111317]/80 text-[#D3CCB0] hover:text-white text-[11px] font-medium py-2 px-3 rounded-xl border border-[#202C44] transition-colors text-center truncate"
              >
                Login as Buyer
              </button>
              <button
                type="button"
                onClick={() => handleQuickDemoLogin("seller")}
                className="bg-[#111317] hover:bg-[#111317]/80 text-[#D3CCB0] hover:text-white text-[11px] font-medium py-2 px-3 rounded-xl border border-[#202C44] transition-colors text-center truncate"
              >
                Login as Creator
              </button>
            </div>
          </div>

        </div>

        {/* Right Side: Form (7 cols) */}
        <div className="lg:col-span-7 bg-[#111317] p-8 sm:p-12 flex flex-col justify-center space-y-6">
          
          <div>
            <h1 className="text-2xl sm:text-3xl font-heading font-extrabold text-white tracking-tight">
              {isSignUp ? "Create your account" : "Welcome back"}
            </h1>
            <p className="text-xs sm:text-sm text-[#7B8A90] mt-1">
              {isSignUp
                ? "Enter your details below to start downloading and publishing."
                : "Sign in to access your purchases, licenses, and seller studio."}
            </p>
          </div>

          {errorMessage && (
            <div className="bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs px-4 py-2.5 rounded-xl">
              {errorMessage}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            
            {/* Role Selector: Buy Assets / Sell Assets */}
            {isSignUp && (
              <div className="space-y-1.5">
                <label className="block text-xs font-medium text-[#7B8A90]">
                  I want to:
                </label>
                <div className="grid grid-cols-2 gap-2 bg-[#000000] p-1.5 rounded-2xl border border-[#202C44]">
                  <button
                    type="button"
                    onClick={() => setRole("buyer")}
                    className={`py-2.5 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                      role === "buyer"
                        ? "bg-[#D3CCB0] text-[#000000] shadow"
                        : "text-[#7B8A90] hover:text-white hover:bg-[#202C44]/40"
                    }`}
                  >
                    <span>Buy Assets</span>
                    {role === "buyer" && <Check className="w-3.5 h-3.5 text-[#000000]" />}
                  </button>

                  <button
                    type="button"
                    onClick={() => setRole("seller")}
                    className={`py-2.5 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                      role === "seller"
                        ? "bg-[#D3CCB0] text-[#000000] shadow"
                        : "text-[#7B8A90] hover:text-white hover:bg-[#202C44]/40"
                    }`}
                  >
                    <span>Sell Assets (90% Split)</span>
                    {role === "seller" && <Check className="w-3.5 h-3.5 text-[#000000]" />}
                  </button>
                </div>
              </div>
            )}

            {/* Full Name field (Sign Up only) */}
            {isSignUp && (
              <div className="space-y-1.5">
                <label className="block text-xs font-medium text-[#7B8A90]">
                  Full Name
                </label>
                <input
                  type="text"
                  required={isSignUp}
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Rachit Khandelwal"
                  className="w-full bg-[#000000] text-white text-xs px-4 py-3 rounded-xl border border-[#202C44] focus:outline-none focus:border-[#D3CCB0] transition-colors placeholder-[#7B8A90]"
                />
              </div>
            )}

            {/* Email Address */}
            <div className="space-y-1.5">
              <label className="block text-xs font-medium text-[#7B8A90]">
                Email Address
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="developer@gmail.com"
                className="w-full bg-[#000000] text-white text-xs px-4 py-3 rounded-xl border border-[#202C44] focus:outline-none focus:border-[#D3CCB0] transition-colors placeholder-[#7B8A90]"
              />
            </div>

            {/* Password */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="block text-xs font-medium text-[#7B8A90]">
                  Password
                </label>
                {!isSignUp && (
                  <span className="text-[11px] text-[#D3CCB0] cursor-pointer hover:underline">
                    Forgot password?
                  </span>
                )}
              </div>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-[#000000] text-white text-xs px-4 py-3 rounded-xl border border-[#202C44] focus:outline-none focus:border-[#D3CCB0] transition-colors placeholder-[#7B8A90]"
              />
            </div>

            {/* Submit Action */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-[#D3CCB0] hover:bg-[#c4bb9a] text-[#000000] font-bold text-xs sm:text-sm py-3.5 px-4 rounded-xl transition-all shadow-lg active:scale-98 disabled:opacity-50 flex items-center justify-center gap-2 mt-4"
            >
              {isSubmitting ? (
                <>
                  <div className="w-4 h-4 border-2 border-[#000000] border-t-transparent rounded-full animate-spin" />
                  <span>Processing...</span>
                </>
              ) : (
                <>
                  <span>{isSignUp ? "Create Account" : "Sign In to Account"}</span>
                  <ArrowRight className="w-4 h-4 text-[#000000]" />
                </>
              )}
            </button>
          </form>

          {/* Toggle between Sign Up and Sign In */}
          <div className="pt-2 text-center text-xs text-[#7B8A90]">
            {isSignUp ? (
              <p>
                Already have an account?{" "}
                <button
                  type="button"
                  onClick={() => {
                    setIsSignUp(false);
                    setErrorMessage("");
                  }}
                  className="text-[#D3CCB0] font-bold hover:underline ml-1"
                >
                  Sign In
                </button>
              </p>
            ) : (
              <p>
                Don’t have an account yet?{" "}
                <button
                  type="button"
                  onClick={() => {
                    setIsSignUp(true);
                    setErrorMessage("");
                  }}
                  className="text-[#D3CCB0] font-bold hover:underline ml-1"
                >
                  Create Account
                </button>
              </p>
            )}
          </div>

          <div className="pt-4 border-t border-[#202C44] flex items-center justify-center gap-2 text-[11px] text-[#7B8A90]">
            <Lock className="w-3.5 h-3.5" />
            <span>256-bit encryption • Direct instant access</span>
          </div>

        </div>

      </div>
    </div>
  );
};

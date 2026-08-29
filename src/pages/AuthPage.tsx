import React, { useState, useEffect } from "react";
import { useNavigate, useLocation, Link, useSearchParams } from "react-router-dom";
import { UserProfile } from "../types";
import {
  User,
  Mail,
  Lock,
  Eye,
  EyeOff,
  Check,
  AlertTriangle,
  ArrowRight,
  ShieldCheck,
  ShoppingBag,
  Store,
  AtSign,
} from "lucide-react";

interface AuthPageProps {
  onLoginSuccess: (profile: UserProfile) => void;
  defaultMode?: "signin" | "signup";
  isAuthenticated?: boolean;
  userProfile?: UserProfile;
}

export const AuthPage: React.FC<AuthPageProps> = ({
  onLoginSuccess,
  defaultMode = "signup",
  isAuthenticated = false,
  userProfile,
}) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const redirectUrl = searchParams.get("redirect") || "";
  const roleParam = searchParams.get("role");

  // If already authenticated, automatically forward to appropriate workspace
  useEffect(() => {
    if (isAuthenticated) {
      if (redirectUrl) {
        navigate(redirectUrl, { replace: true });
      } else if (userProfile?.role === "seller") {
        navigate("/dashboard", { replace: true });
      } else {
        navigate("/browse", { replace: true });
      }
    }
  }, [isAuthenticated, userProfile, redirectUrl, navigate]);

  // Determine mode from pathname or defaultMode prop
  const isSignUpInitial =
    location.pathname === "/signup" ||
    defaultMode === "signup" ||
    (location.pathname !== "/signin" && defaultMode !== "signin");

  const [isSignUp, setIsSignUp] = useState(isSignUpInitial);

  // Sync mode with route changes
  useEffect(() => {
    if (location.pathname === "/signin") {
      setIsSignUp(false);
    } else if (location.pathname === "/signup") {
      setIsSignUp(true);
    }
  }, [location.pathname]);

  // Form Fields
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Role Selection (starts as null so neither Buyer nor Seller is pre-selected by default)
  const [role, setRole] = useState<"buyer" | "seller" | null>(
    roleParam === "seller" ? "seller" : roleParam === "buyer" ? "buyer" : null
  );

  // Seller-Specific Fields
  const [upiId, setUpiId] = useState("");
  const [agreedSellerPolicy, setAgreedSellerPolicy] = useState(false);

  // State Management
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    if (roleParam === "seller") {
      setRole("seller");
    } else if (roleParam === "buyer") {
      setRole("buyer");
    }
  }, [roleParam]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");

    // General Validations
    if (!email.trim() || !email.includes("@")) {
      setErrorMessage("Please enter a valid email address.");
      return;
    }
    if (password.length < 6) {
      setErrorMessage("Password must be at least 6 characters.");
      return;
    }

    // Sign Up Specific Validations
    if (isSignUp) {
      if (!name.trim()) {
        setErrorMessage("Please enter your full name.");
        return;
      }
      if (password !== confirmPassword) {
        setErrorMessage("Passwords do not match. Please verify your confirm password.");
        return;
      }

      // Mandatory Role Selection on Sign Up
      if (!role) {
        setErrorMessage("Please select whether you want to register as a Buyer or a Seller.");
        return;
      }

      // Seller Specific Validations
      if (role === "seller") {
        if (!upiId.trim()) {
          setErrorMessage("Please enter your UPI ID for direct payout settlements.");
          return;
        }
        if (!upiId.includes("@")) {
          setErrorMessage("Please enter a valid UPI ID format (e.g. yourname@okhdfcbank or 9876543210@paytm).");
          return;
        }
        if (!agreedSellerPolicy) {
          setErrorMessage("Please agree to the Seller Policy to create a verified seller account.");
          return;
        }
      }
    }

    setIsSubmitting(true);

    // If signing in, check if there is an existing profile in localStorage or match role
    let chosenRole: "buyer" | "seller" = role || "buyer";
    if (!isSignUp) {
      try {
        const saved = localStorage.getItem("kreate_user_profile");
        if (saved) {
          const parsed = JSON.parse(saved);
          if (parsed.role === "seller" || parsed.role === "buyer") {
            chosenRole = parsed.role;
          }
        }
      } catch (err) {
        console.error(err);
      }
    }

    const displayName = isSignUp && name.trim() ? name.trim() : email.split("@")[0];
    const cleanUsername = displayName.toLowerCase().replace(/[^a-z0-9]/g, "_");

    const newProfile: UserProfile = {
      name: displayName,
      email: email.trim(),
      username: cleanUsername,
      role: chosenRole,
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80",
      bio:
        chosenRole === "seller"
          ? "Verified Seller on Kreate Studio. 87.5% direct UPI revenue split."
          : "Verified Digital Asset Buyer on Kreate Studio.",
      upiId: chosenRole === "seller" ? (upiId.trim() || "creator@okhdfcbank") : undefined,
      hasCompletedOnboarding: true,
    };

    setTimeout(() => {
      onLoginSuccess(newProfile);
      setIsSubmitting(false);

      if (redirectUrl) {
        navigate(redirectUrl);
      } else if (chosenRole === "seller") {
        navigate("/dashboard");
      } else {
        navigate("/explore");
      }
    }, 450);
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center py-4 px-3 sm:px-6 bg-[#000000]">
      
      {/* Clean Screen-Fitting Create Account / Sign In Container */}
      <div className="w-full max-w-md bg-[#111317] border border-[#202C44] rounded-2xl p-5 sm:p-6 shadow-2xl space-y-4 animate-in fade-in duration-200">
        
        {/* Brand Logo & Header */}
        <div className="text-center space-y-1.5">
          <Link to="/" className="inline-flex items-center gap-2 group mb-0.5">
            <div className="w-8 h-8 rounded-lg bg-[#202C44] border border-[#202C44] flex items-center justify-center transition-all group-hover:border-[#D3CCB0]">
              <span className="font-heading font-extrabold text-base text-[#D3CCB0]">K</span>
            </div>
            <span className="font-heading font-bold text-base text-white">
              Kreate <span className="text-[#D3CCB0]">Studio</span>
            </span>
          </Link>

          <div>
            <h1 className="text-xl sm:text-2xl font-heading font-extrabold text-white tracking-tight">
              {isSignUp ? "Create account" : "Welcome back"}
            </h1>
            <p className="text-xs text-[#7B8A90] mt-0.5">
              {isSignUp
                ? "Join Kreate Studio and start creating."
                : "Log in to your Kreate Studio account."}
            </p>
          </div>
        </div>

        {/* Form Error Banner */}
        {errorMessage && (
          <div
            id="auth-error-banner"
            className="bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs px-3 py-2 rounded-xl flex items-center gap-2 animate-in fade-in"
          >
            <AlertTriangle className="w-3.5 h-3.5 shrink-0 text-rose-400" />
            <span className="text-[11px] leading-tight">{errorMessage}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-3" id="auth-form">
          
          {/* Full Name field (Sign Up only) */}
          {isSignUp && (
            <div className="space-y-1">
              <label className="block text-[11px] font-medium text-[#7B8A90]">
                Full name
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[#7B8A90]">
                  <User className="w-3.5 h-3.5" />
                </div>
                <input
                  type="text"
                  required={isSignUp}
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Rachit Khandelwal"
                  id="input-full-name"
                  className="w-full bg-[#000000] text-white text-xs pl-9 pr-3 py-2.5 rounded-xl border border-[#202C44] focus:outline-none focus:border-[#D3CCB0] transition-colors placeholder-[#7B8A90]"
                />
              </div>
            </div>
          )}

          {/* Email Address */}
          <div className="space-y-1">
            <label className="block text-[11px] font-medium text-[#7B8A90]">
              Email address
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[#7B8A90]">
                <Mail className="w-3.5 h-3.5" />
              </div>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="developer@gmail.com"
                id="input-email"
                className="w-full bg-[#000000] text-white text-xs pl-9 pr-3 py-2.5 rounded-xl border border-[#202C44] focus:outline-none focus:border-[#D3CCB0] transition-colors placeholder-[#7B8A90]"
              />
            </div>
          </div>

          {/* Password & Confirm Password (Grid on Sign Up to save vertical screen space) */}
          {isSignUp ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {/* Password */}
              <div className="space-y-1">
                <label className="block text-[11px] font-medium text-[#7B8A90]">
                  Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[#7B8A90]">
                    <Lock className="w-3.5 h-3.5" />
                  </div>
                  <input
                    type={showPassword ? "text" : "password"}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    id="input-password"
                    className="w-full bg-[#000000] text-white text-xs pl-9 pr-8 py-2.5 rounded-xl border border-[#202C44] focus:outline-none focus:border-[#D3CCB0] transition-colors placeholder-[#7B8A90]"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-2.5 flex items-center text-[#7B8A90] hover:text-white transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>

              {/* Confirm Password */}
              <div className="space-y-1">
                <label className="block text-[11px] font-medium text-[#7B8A90]">
                  Confirm password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[#7B8A90]">
                    <Lock className="w-3.5 h-3.5" />
                  </div>
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    required={isSignUp}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="••••••••"
                    id="input-confirm-password"
                    className="w-full bg-[#000000] text-white text-xs pl-9 pr-8 py-2.5 rounded-xl border border-[#202C44] focus:outline-none focus:border-[#D3CCB0] transition-colors placeholder-[#7B8A90]"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute inset-y-0 right-0 pr-2.5 flex items-center text-[#7B8A90] hover:text-white transition-colors"
                  >
                    {showConfirmPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>
            </div>
          ) : (
            /* Sign In Single Password Field */
            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <label className="block text-[11px] font-medium text-[#7B8A90]">
                  Password
                </label>
                <span className="text-[11px] text-[#D3CCB0] cursor-pointer hover:underline">
                  Forgot password?
                </span>
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[#7B8A90]">
                  <Lock className="w-3.5 h-3.5" />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  id="input-password"
                  className="w-full bg-[#000000] text-white text-xs pl-9 pr-8 py-2.5 rounded-xl border border-[#202C44] focus:outline-none focus:border-[#D3CCB0] transition-colors placeholder-[#7B8A90]"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-2.5 flex items-center text-[#7B8A90] hover:text-white transition-colors"
                >
                  {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                </button>
              </div>
            </div>
          )}

          {/* Dynamic Role Selection ("I want to join as") - Unselected by default */}
          {isSignUp && (
            <div className="space-y-2 pt-1 border-t border-[#202C44]" id="role-selection-section">
              <div className="flex items-center justify-between">
                <label className="block text-[11px] font-semibold text-[#7B8A90]">
                  I want to join as <span className="text-rose-400">*</span>
                </label>
                {role === null && (
                  <span className="text-[10px] text-[#D3CCB0] font-mono">
                    Select Buyer or Seller
                  </span>
                )}
              </div>

              {/* Two Selectable Cards for Buyer and Seller */}
              <div className="grid grid-cols-2 gap-2">
                
                {/* Buyer Card */}
                <button
                  type="button"
                  id="role-card-buyer"
                  onClick={() => {
                    setRole("buyer");
                    setErrorMessage("");
                  }}
                  className={`p-2.5 rounded-xl border text-left transition-all relative flex flex-col justify-between cursor-pointer ${
                    role === "buyer"
                      ? "bg-[#D3CCB0] text-[#000000] border-[#D3CCB0] shadow-sm ring-1 ring-[#D3CCB0]"
                      : "bg-[#000000] text-[#7B8A90] border-[#202C44] hover:border-[#D3CCB0]/60 hover:text-white"
                  }`}
                >
                  <div className="flex items-center justify-between w-full mb-1">
                    <div className="flex items-center gap-1.5 font-bold text-xs">
                      <ShoppingBag className={`w-3.5 h-3.5 ${role === "buyer" ? "text-[#000000]" : "text-[#D3CCB0]"}`} />
                      <span className={role === "buyer" ? "text-[#000000]" : "text-white"}>Buyer</span>
                    </div>
                    <div
                      className={`w-3.5 h-3.5 rounded-full flex items-center justify-center transition-all ${
                        role === "buyer"
                          ? "bg-[#000000] text-[#D3CCB0]"
                          : "border border-[#202C44] bg-[#111317]"
                      }`}
                    >
                      {role === "buyer" && <Check className="w-2 h-2 stroke-[3]" />}
                    </div>
                  </div>
                  <p className={`text-[10px] leading-tight line-clamp-1 ${role === "buyer" ? "text-[#000000]/80" : "text-[#7B8A90]"}`}>
                    Buy UI kits, code & 3D
                  </p>
                </button>

                {/* Seller Card */}
                <button
                  type="button"
                  id="role-card-seller"
                  onClick={() => {
                    setRole("seller");
                    setErrorMessage("");
                  }}
                  className={`p-2.5 rounded-xl border text-left transition-all relative flex flex-col justify-between cursor-pointer ${
                    role === "seller"
                      ? "bg-[#D3CCB0] text-[#000000] border-[#D3CCB0] shadow-sm ring-1 ring-[#D3CCB0]"
                      : "bg-[#000000] text-[#7B8A90] border-[#202C44] hover:border-emerald-500/60 hover:text-white"
                  }`}
                >
                  <div className="flex items-center justify-between w-full mb-1">
                    <div className="flex items-center gap-1.5 font-bold text-xs">
                      <Store className={`w-3.5 h-3.5 ${role === "seller" ? "text-[#000000]" : "text-emerald-400"}`} />
                      <span className={role === "seller" ? "text-[#000000]" : "text-white"}>Seller</span>
                    </div>
                    <div
                      className={`w-3.5 h-3.5 rounded-full flex items-center justify-center transition-all ${
                        role === "seller"
                          ? "bg-[#000000] text-[#D3CCB0]"
                          : "border border-[#202C44] bg-[#111317]"
                      }`}
                    >
                      {role === "seller" && <Check className="w-2 h-2 stroke-[3]" />}
                    </div>
                  </div>
                  <p className={`text-[10px] leading-tight line-clamp-1 ${role === "seller" ? "text-[#000000]/80" : "text-[#7B8A90]"}`}>
                    Sell & keep 87.5% revenue
                  </p>
                </button>

              </div>

              {/* Role Specific Dark-Blue Confirmation / Tip Box */}
              {role === "buyer" && (
                <div
                  id="buyer-tip-box"
                  className="bg-[#202C44] text-[#D3CCB0] border border-[#202C44]/80 p-2.5 rounded-xl text-[11px] flex items-start gap-2 transition-all animate-in fade-in"
                >
                  <span className="text-xs shrink-0">💡</span>
                  <p className="text-[10.5px] leading-tight text-slate-200">
                    As a Buyer, your account is configured to explore and purchase verified digital assets. If you later wish to sell, you can register your UPI via the formal Upgrade to Seller gateway.
                  </p>
                </div>
              )}
              {role === "seller" && (
                <div
                  id="seller-tip-box"
                  className="bg-emerald-950/40 text-emerald-300 border border-emerald-800/80 p-2.5 rounded-xl text-[11px] flex items-start gap-2 transition-all animate-in fade-in"
                >
                  <span className="text-xs shrink-0">⚡</span>
                  <p className="text-[10.5px] leading-tight text-emerald-200">
                    As a Seller, your workspace will be locked to the Seller Portal dashboard with 87.5% direct UPI revenue settlements.
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Seller-Specific Section: UPI ID, Amber Warning, & Policy Checkbox */}
          {isSignUp && role === "seller" && (
            <div className="space-y-2.5 pt-1.5 border-t border-[#202C44] animate-in fade-in" id="seller-details-section">
              
              {/* UPI ID Field */}
              <div className="space-y-1">
                <label className="block text-[11px] font-semibold text-[#D3CCB0] flex items-center gap-1.5">
                  <AtSign className="w-3 h-3" />
                  <span>Your UPI ID</span>
                </label>
                <input
                  type="text"
                  required={isSignUp && role === "seller"}
                  value={upiId}
                  onChange={(e) => setUpiId(e.target.value)}
                  placeholder="yourname@upi or 9876543210@gp..."
                  id="input-seller-upi"
                  className="w-full bg-[#000000] text-white text-xs px-3 py-2 rounded-xl border border-emerald-800/80 focus:outline-none focus:border-emerald-400 transition-colors placeholder-[#7B8A90]"
                />
              </div>

              {/* Amber Warning Box */}
              <div
                id="seller-upi-warning"
                className="bg-amber-500/10 border border-amber-500/30 text-amber-300 p-2 rounded-xl text-[10.5px] flex items-start gap-2"
              >
                <span className="text-xs shrink-0">⚠️</span>
                <p className="leading-tight text-amber-200/90">
                  Please ensure your UPI ID is correct. Incorrect UPI ID will result in failed payments.
                </p>
              </div>

              {/* Mandatory Seller Policy Checkbox */}
              <div className="flex items-center gap-2 pt-0.5">
                <input
                  type="checkbox"
                  id="seller-policy-checkbox"
                  checked={agreedSellerPolicy}
                  onChange={(e) => setAgreedSellerPolicy(e.target.checked)}
                  className="w-3.5 h-3.5 rounded border-[#202C44] bg-[#000000] text-[#D3CCB0] focus:ring-[#D3CCB0] cursor-pointer accent-[#D3CCB0]"
                />
                <label
                  htmlFor="seller-policy-checkbox"
                  className="text-[11px] text-white cursor-pointer select-none"
                >
                  I agree to the <span className="text-[#D3CCB0] underline font-medium">Seller Policy</span>.
                </label>
              </div>

            </div>
          )}

          {/* Primary Action Button */}
          <button
            type="submit"
            disabled={isSubmitting}
            id="auth-submit-button"
            className="w-full bg-[#D3CCB0] hover:bg-[#c4bb9a] text-[#000000] font-bold text-xs sm:text-sm py-2.5 sm:py-3 px-4 rounded-xl transition-all shadow-lg active:scale-98 disabled:opacity-50 flex items-center justify-center gap-2 mt-2 cursor-pointer"
          >
            {isSubmitting ? (
              <>
                <div className="w-3.5 h-3.5 border-2 border-[#000000] border-t-transparent rounded-full animate-spin" />
                <span>Processing...</span>
              </>
            ) : (
              <>
                <span>{isSignUp ? "Sign Up" : "Log In"}</span>
                <ArrowRight className="w-3.5 h-3.5 text-[#000000]" />
              </>
            )}
          </button>
        </form>

        {/* Toggle between Sign Up and Log In */}
        <div className="text-center text-xs text-[#7B8A90]">
          {isSignUp ? (
            <p className="text-[11px]">
              Already have an account?{" "}
              <button
                type="button"
                id="switch-to-login"
                onClick={() => {
                  setIsSignUp(false);
                  setErrorMessage("");
                  navigate("/signin");
                }}
                className="text-[#D3CCB0] font-bold hover:underline ml-0.5 cursor-pointer"
              >
                Log In
              </button>
            </p>
          ) : (
            <p className="text-[11px]">
              Don't have an account?{" "}
              <button
                type="button"
                id="switch-to-signup"
                onClick={() => {
                  setIsSignUp(true);
                  setErrorMessage("");
                  navigate("/signup");
                }}
                className="text-[#D3CCB0] font-bold hover:underline ml-0.5 cursor-pointer"
              >
                Sign Up
              </button>
            </p>
          )}
        </div>

        <div className="flex items-center justify-center gap-1.5 text-[10px] text-[#7B8A90]">
          <ShieldCheck className="w-3 h-3 text-emerald-400" />
          <span>256-bit encryption • Direct instant access</span>
        </div>

      </div>
    </div>
  );
};

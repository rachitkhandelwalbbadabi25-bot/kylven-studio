import React, { useState } from "react";
import { UserProfile } from "../types";
import {
  loginWithEmail,
  registerWithEmail,
  loginWithGoogle,
} from "../services/firebaseService";
import { X, Lock, Mail, User, ArrowRight, Sparkles, AlertCircle, Loader2 } from "lucide-react";

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSignInSuccess?: (profile: UserProfile) => void;
  initialMode?: "signin" | "signup";
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  onSignInSuccess,
  initialMode = "signin",
}) => {
  const [mode, setMode] = useState<"signin" | "signup">(initialMode);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [role, setRole] = useState<"buyer" | "seller">("buyer");
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setIsLoading(true);

    try {
      if (mode === "signup") {
        const { profile } = await registerWithEmail(email.trim(), password, {
          name: name.trim() || email.split("@")[0],
          role,
        });
        if (onSignInSuccess) onSignInSuccess(profile);
        onClose();
      } else {
        const user = await loginWithEmail(email.trim(), password);
        const profile: UserProfile = {
          uid: user.uid,
          name: user.displayName || user.email?.split("@")[0] || "User",
          email: user.email || "",
          username: (user.displayName || user.email?.split("@")[0] || "user").toLowerCase().replace(/[^a-z0-9_]/g, ""),
          role: "buyer",
          hasCompletedOnboarding: true,
        };
        if (onSignInSuccess) onSignInSuccess(profile);
        onClose();
      }
    } catch (err: any) {
      console.warn("Auth error:", err);
      let message = err.message || "Authentication failed. Please check your credentials.";
      if (err.code === "auth/invalid-credential" || err.code === "auth/wrong-password") {
        message = "Invalid email or password. Please try again.";
      } else if (err.code === "auth/user-not-found") {
        message = "No account found with this email. Please sign up.";
      } else if (err.code === "auth/email-already-in-use") {
        message = "An account already exists with this email address. Please sign in.";
      } else if (err.code === "auth/weak-password") {
        message = "Password should be at least 6 characters.";
      }
      setErrorMsg(message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setErrorMsg(null);
    setIsLoading(true);
    try {
      const { user } = await loginWithGoogle();
      const profile: UserProfile = {
        uid: user.uid,
        name: user.displayName || user.email?.split("@")[0] || "User",
        email: user.email || "",
        username: (user.displayName || user.email?.split("@")[0] || "user").toLowerCase().replace(/[^a-z0-9_]/g, ""),
        role: "buyer",
        avatar: user.photoURL || undefined,
        hasCompletedOnboarding: true,
      };
      if (onSignInSuccess) onSignInSuccess(profile);
      onClose();
    } catch (err: any) {
      console.warn("Google sign-in error:", err);
      if (err.code !== "auth/popup-closed-by-user") {
        setErrorMsg(err.message || "Failed to sign in with Google.");
      }
    } finally {
      setIsLoading(false);
    }
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
            {mode === "signin" ? "Sign in to Kreate Studio" : "Create Account"}
          </h3>
          <p className="text-xs text-[#7B8A90] max-w-xs mx-auto">
            {mode === "signin"
              ? "Access your purchased digital assets, bookmarks, and seller portal."
              : "Join the digital asset marketplace for developers & designers."}
          </p>
        </div>

        {errorMsg && (
          <div className="p-3 bg-red-950/40 border border-red-800/80 rounded-xl text-xs text-red-300 flex items-start gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 text-red-400 mt-0.5" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Google Sign-in */}
        <button
          type="button"
          onClick={handleGoogleSignIn}
          disabled={isLoading}
          className="w-full bg-[#1c2230] hover:bg-[#202C44] text-white font-medium text-xs py-2.5 px-4 rounded-xl border border-[#202C44] transition-all flex items-center justify-center gap-3 disabled:opacity-50"
        >
          <svg className="w-4 h-4" viewBox="0 0 24 24">
            <path
              fill="#4285F4"
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            />
            <path
              fill="#34A853"
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            />
            <path
              fill="#FBBC05"
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
            />
            <path
              fill="#EA4335"
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
            />
          </svg>
          <span>Continue with Google</span>
        </button>

        <div className="relative flex items-center justify-center">
          <div className="border-t border-[#202C44] w-full" />
          <span className="bg-[#111317] px-3 text-[10px] text-[#7B8A90] font-mono uppercase tracking-wider absolute">
            Or with email
          </span>
        </div>

        {/* Email Form */}
        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          {mode === "signup" && (
            <>
              <div className="space-y-1">
                <label className="text-[11px] font-medium text-[#7B8A90]">Full Name</label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#7B8A90]" />
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Ansh Bhardwaj"
                    className="w-full bg-[#000000] text-white text-xs pl-9 pr-3 py-2.5 rounded-xl border border-[#202C44] focus:outline-none focus:border-[#D3CCB0]"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-medium text-[#7B8A90]">Account Role</label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setRole("buyer")}
                    className={`py-2 px-3 rounded-xl border text-center transition-all ${
                      role === "buyer"
                        ? "bg-[#202C44] border-[#D3CCB0] text-[#D3CCB0] font-bold"
                        : "bg-[#000000] border-[#202C44] text-[#7B8A90]"
                    }`}
                  >
                    Buyer
                  </button>
                  <button
                    type="button"
                    onClick={() => setRole("seller")}
                    className={`py-2 px-3 rounded-xl border text-center transition-all ${
                      role === "seller"
                        ? "bg-[#202C44] border-[#D3CCB0] text-[#D3CCB0] font-bold"
                        : "bg-[#000000] border-[#202C44] text-[#7B8A90]"
                    }`}
                  >
                    Creator / Seller
                  </button>
                </div>
              </div>
            </>
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
                placeholder="you@domain.com"
                className="w-full bg-[#000000] text-white text-xs pl-9 pr-3 py-2.5 rounded-xl border border-[#202C44] focus:outline-none focus:border-[#D3CCB0]"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-[11px] font-medium text-[#7B8A90]">Password</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#7B8A90]" />
              <input
                type="password"
                required
                minLength={6}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-[#000000] text-white text-xs pl-9 pr-3 py-2.5 rounded-xl border border-[#202C44] focus:outline-none focus:border-[#D3CCB0]"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-[#D3CCB0] hover:bg-[#c4bb9a] text-[#000000] font-bold text-xs py-3 rounded-xl shadow transition-all flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {isLoading ? (
              <Loader2 className="w-4 h-4 animate-spin text-[#000000]" />
            ) : (
              <>
                <span>{mode === "signin" ? "Sign In" : "Create Account"}</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        <div className="text-center text-xs text-[#7B8A90]">
          {mode === "signin" ? (
            <span>
              Don’t have an account?{" "}
              <button
                type="button"
                onClick={() => {
                  setMode("signup");
                  setErrorMsg(null);
                }}
                className="text-[#D3CCB0] font-bold hover:underline"
              >
                Sign up
              </button>
            </span>
          ) : (
            <span>
              Already have an account?{" "}
              <button
                type="button"
                onClick={() => {
                  setMode("signin");
                  setErrorMsg(null);
                }}
                className="text-[#D3CCB0] font-bold hover:underline"
              >
                Sign in
              </button>
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

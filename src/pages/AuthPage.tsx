import React, { useState } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { UserProfile } from "../types";
import {
  LogIn,
  UserPlus,
  ShieldCheck,
  Zap,
  CheckCircle2,
  Lock,
  Sparkles,
  ArrowRight
} from "lucide-react";

interface AuthPageProps {
  onLoginSuccess: (profile: UserProfile) => void;
  defaultMode?: "signin" | "signup";
}

export const AuthPage: React.FC<AuthPageProps> = ({
  onLoginSuccess,
  defaultMode = "signin",
}) => {
  const navigate = useNavigate();
  const location = useLocation();

  const isSignUpPath = location.pathname === "/signup" || defaultMode === "signup";
  const [isSignUp, setIsSignUp] = useState(isSignUpPath);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<"creator" | "buyer" | "both">("both");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.includes("@")) {
      alert("Please enter a valid email address.");
      return;
    }

    setIsSubmitting(true);

    const cleanUsername = (name ? name.toLowerCase().replace(/[^a-z0-9]/g, "_") : email.split("@")[0]);

    const newProfile: UserProfile = {
      name: name.trim() || "Aarav Sharma",
      email: email.trim(),
      username: cleanUsername,
      role: role,
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80",
      bio: "Indian tech builder & creative digital assets publisher.",
    };

    setTimeout(() => {
      onLoginSuccess(newProfile);
      setIsSubmitting(false);
      navigate("/dashboard");
    }, 600);
  };

  const handleQuickDemoLogin = () => {
    const demoProfile: UserProfile = {
      name: "Aarav Sharma",
      email: "aarav.sharma@kreate.studio",
      username: "aarav_ui",
      role: "both",
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80",
      bio: "Founding UI/UX Designer & Flutter Engineer at Kreate Studio.",
    };

    onLoginSuccess(demoProfile);
    navigate("/dashboard");
  };

  return (
    <div className="max-w-md mx-auto px-4 py-12 space-y-6">
      
      {/* Brand Header */}
      <div className="text-center space-y-2">
        <Link to="/" className="inline-flex items-center gap-2.5 mb-2">
          <div className="w-10 h-10 rounded-xl bg-[#202C44] border border-[#202C44] flex items-center justify-center">
            <span className="font-heading font-extrabold text-xl text-[#D3CCB0]">K</span>
          </div>
          <span className="font-heading font-bold text-xl text-white">
            Kreate <span className="text-[#D3CCB0]">Studio</span>
          </span>
        </Link>

        <h1 className="text-2xl font-heading font-extrabold text-white">
          {isSignUp ? "Create Your Creator Account" : "Sign In to Kreate Studio"}
        </h1>
        <p className="text-xs text-[#7B8A90]">
          {isSignUp
            ? "Join India’s premier digital assets marketplace and monetize your craft."
            : "Access your purchases, lifetime download licenses, and seller studio."}
        </p>
      </div>

      {/* Mode Switcher Tabs */}
      <div className="flex bg-[#111317] p-1 rounded-xl border border-[#202C44]">
        <button
          type="button"
          onClick={() => setIsSignUp(false)}
          className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${
            !isSignUp
              ? "bg-[#202C44] text-[#D3CCB0] shadow border border-[#202C44]"
              : "text-[#7B8A90] hover:text-white"
          }`}
        >
          Sign In
        </button>
        <button
          type="button"
          onClick={() => setIsSignUp(true)}
          className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${
            isSignUp
              ? "bg-[#202C44] text-[#D3CCB0] shadow border border-[#202C44]"
              : "text-[#7B8A90] hover:text-white"
          }`}
        >
          Create Account
        </button>
      </div>

      {/* Quick Demo Access Callout */}
      <div className="bg-[#202C44]/80 border border-[#202C44] rounded-2xl p-4 space-y-2 text-center">
        <div className="flex items-center justify-center gap-1.5 text-xs text-[#D3CCB0] font-bold">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Quick Demo Access</span>
        </div>
        <p className="text-[11px] text-[#7B8A90]">
          Instantly test the authenticated seller dashboard, upload studio, and order history.
        </p>
        <button
          type="button"
          onClick={handleQuickDemoLogin}
          className="w-full bg-[#111317] hover:bg-[#111317]/80 text-[#D3CCB0] font-bold text-xs py-2 rounded-xl border border-[#202C44] transition-colors mt-1"
        >
          Instant Demo Sign In (Aarav Sharma)
        </button>
      </div>

      {/* Main Auth Form */}
      <form onSubmit={handleSubmit} className="bg-[#111317] border border-[#202C44] rounded-3xl p-6 sm:p-8 space-y-4 shadow-2xl">
        
        {isSignUp && (
          <div>
            <label className="block text-xs text-[#7B8A90] mb-1 font-medium">Full Name</label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Aarav Sharma"
              className="w-full bg-[#000000] text-white text-xs px-4 py-2.5 rounded-xl border border-[#202C44] focus:outline-none focus:border-[#D3CCB0]"
            />
          </div>
        )}

        <div>
          <label className="block text-xs text-[#7B8A90] mb-1 font-medium">Email Address</label>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="developer@gmail.com"
            className="w-full bg-[#000000] text-white text-xs px-4 py-2.5 rounded-xl border border-[#202C44] focus:outline-none focus:border-[#D3CCB0]"
          />
        </div>

        <div>
          <label className="block text-xs text-[#7B8A90] mb-1 font-medium">Password</label>
          <input
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            className="w-full bg-[#000000] text-white text-xs px-4 py-2.5 rounded-xl border border-[#202C44] focus:outline-none focus:border-[#D3CCB0]"
          />
        </div>

        {isSignUp && (
          <div>
            <label className="block text-xs text-[#7B8A90] mb-1 font-medium">I want to:</label>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value as any)}
              className="w-full bg-[#000000] text-white text-xs px-3 py-2.5 rounded-xl border border-[#202C44] focus:outline-none focus:border-[#D3CCB0]"
            >
              <option value="both">Both Buy & Sell Assets</option>
              <option value="creator">Sell Digital Assets (90% Split)</option>
              <option value="buyer">Buy & Download Assets</option>
            </select>
          </div>
        )}

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-[#D3CCB0] hover:bg-[#c4bb9a] text-[#000000] font-bold text-xs py-3.5 rounded-xl transition-all shadow-lg active:scale-98 disabled:opacity-50 flex items-center justify-center gap-2 mt-2"
        >
          {isSubmitting ? (
            <span>Authenticating...</span>
          ) : (
            <>
              <span>{isSignUp ? "Create Free Account" : "Sign In"}</span>
              <ArrowRight className="w-4 h-4 text-[#000000]" />
            </>
          )}
        </button>

        <p className="text-[11px] text-[#7B8A90] text-center pt-2">
          🔒 Secure 256-bit authentication • Zero spam guaranteed
        </p>

      </form>

    </div>
  );
};

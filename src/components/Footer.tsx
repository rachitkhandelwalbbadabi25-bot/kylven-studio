import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { CoreCategory } from "../types";
import { ShieldCheck, Zap, Smartphone, ArrowUpRight, CheckCircle2, IndianRupee } from "lucide-react";

export const Footer: React.FC = () => {
  const navigate = useNavigate();

  const handleSelectCategory = (cat: CoreCategory) => {
    navigate(`/browse?category=${encodeURIComponent(cat)}`);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className="bg-[#111317] border-t border-[#202C44] text-[#7B8A90] text-xs pt-12 pb-8 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Marketplace Value Bar */}
        <div className="bg-[#202C44]/80 border border-[#202C44] rounded-2xl p-6 mb-12 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-lg bg-[#000000] border border-[#202C44] flex items-center justify-center text-[#D3CCB0] shrink-0">
              <Zap className="w-4 h-4" />
            </div>
            <div>
              <h4 className="text-white font-semibold text-sm mb-1 font-heading">UPI-Native Checkout</h4>
              <p className="text-[#7B8A90] text-xs leading-relaxed">
                Direct Indian Rupee (₹) payments via GPay, PhonePe, Paytm, BHIM & UPI ID. Zero FX markup or USD conversions.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-lg bg-[#000000] border border-[#202C44] flex items-center justify-center text-[#D3CCB0] shrink-0">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <div>
              <h4 className="text-white font-semibold text-sm mb-1 font-heading">100% Quality & Security Scanned</h4>
              <p className="text-[#7B8A90] text-xs leading-relaxed">
                Every listing is verified for file integrity, license validity, and source code compilation prior to approval.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-lg bg-[#000000] border border-[#202C44] flex items-center justify-center text-[#D3CCB0] shrink-0">
              <CheckCircle2 className="w-4 h-4" />
            </div>
            <div>
              <h4 className="text-white font-semibold text-sm mb-1 font-heading">90% Creator Revenue Split</h4>
              <p className="text-[#7B8A90] text-xs leading-relaxed">
                Sellers keep 90% net earnings paid directly into Indian bank accounts. 10% platform fee covered by buyer.
              </p>
            </div>
          </div>
        </div>

        {/* Main Grid Columns */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-8 pb-12 border-b border-[#202C44]/60">
          
          {/* Brand Info */}
          <div className="md:col-span-2 space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-[#202C44] border border-[#202C44] flex items-center justify-center">
                <span className="font-heading font-extrabold text-base text-[#D3CCB0]">K</span>
              </div>
              <span className="font-heading font-bold text-base text-white tracking-tight">
                Kreate <span className="text-[#D3CCB0]">Studio</span>
              </span>
            </div>

            <p className="text-[#7B8A90] text-xs leading-relaxed max-w-sm">
              Kreate Studio — India’s Creative Assets Marketplace. Built for Indian designers, developers, AI engineers, and content creators to buy and sell premium digital products seamlessly.
            </p>

            <div className="flex flex-wrap items-center gap-2 pt-2">
              <span className="text-[11px] text-white font-medium">Supported Payments:</span>
              <span className="bg-[#000000] px-2 py-1 rounded text-[10px] border border-[#202C44] text-[#D3CCB0] font-mono">GPay</span>
              <span className="bg-[#000000] px-2 py-1 rounded text-[10px] border border-[#202C44] text-[#D3CCB0] font-mono">PhonePe</span>
              <span className="bg-[#000000] px-2 py-1 rounded text-[10px] border border-[#202C44] text-[#D3CCB0] font-mono">Paytm</span>
              <span className="bg-[#000000] px-2 py-1 rounded text-[10px] border border-[#202C44] text-[#D3CCB0] font-mono">BHIM UPI</span>
            </div>
          </div>

          {/* Core Categories */}
          <div>
            <h5 className="text-white font-semibold text-xs uppercase tracking-wider mb-3 font-heading">
              Categories
            </h5>
            <ul className="space-y-2">
              <li>
                <button onClick={() => handleSelectCategory("Software & Development")} className="hover:text-[#D3CCB0] transition-colors">
                  Software & Development
                </button>
              </li>
              <li>
                <button onClick={() => handleSelectCategory("AI/ML & Data Science")} className="hover:text-[#D3CCB0] transition-colors">
                  AI/ML & Data Science
                </button>
              </li>
              <li>
                <button onClick={() => handleSelectCategory("UI/UX & Design")} className="hover:text-[#D3CCB0] transition-colors">
                  UI/UX & Design
                </button>
              </li>
              <li>
                <button onClick={() => handleSelectCategory("3D & CAD")} className="hover:text-[#D3CCB0] transition-colors">
                  3D & CAD Models
                </button>
              </li>
              <li>
                <button onClick={() => handleSelectCategory("Video/Motion & Audio")} className="hover:text-[#D3CCB0] transition-colors">
                  Video LUTs & Motion
                </button>
              </li>
              <li>
                <button onClick={() => handleSelectCategory("Productivity & Business")} className="hover:text-[#D3CCB0] transition-colors">
                  Productivity & Notion
                </button>
              </li>
            </ul>
          </div>

          {/* For Creators */}
          <div>
            <h5 className="text-white font-semibold text-xs uppercase tracking-wider mb-3 font-heading">
              For Creators
            </h5>
            <ul className="space-y-2">
              <li>
                <Link to="/sell/new" className="hover:text-[#D3CCB0] transition-colors flex items-center gap-1">
                  <span>Sell Digital Assets</span>
                  <ArrowUpRight className="w-3 h-3 text-[#D3CCB0]" />
                </Link>
              </li>
              <li>
                <Link to="/dashboard" className="hover:text-[#D3CCB0] transition-colors">
                  Creator Dashboard
                </Link>
              </li>
              <li>
                <Link to="/pricing" className="hover:text-[#D3CCB0] transition-colors">
                  Fee Breakdown (90% Net)
                </Link>
              </li>
              <li>
                <span className="text-[#7B8A90]">₹0 Listing Fee</span>
              </li>
              <li>
                <span className="text-[#7B8A90]">Weekly UPI Payouts</span>
              </li>
            </ul>
          </div>

          {/* Platform Status */}
          <div>
            <h5 className="text-white font-semibold text-xs uppercase tracking-wider mb-3 font-heading">
              Platform
            </h5>
            <div className="space-y-3">
              {/* Subtle Mobile App coming soon */}
              <div className="bg-[#000000] border border-[#202C44] p-3 rounded-xl">
                <div className="flex items-center gap-2 mb-1">
                  <Smartphone className="w-4 h-4 text-[#D3CCB0]" />
                  <span className="text-white font-medium text-xs">Mobile App</span>
                </div>
                <p className="text-[11px] text-[#7B8A90] leading-snug">
                  Native Android & iOS companion apps coming soon.
                </p>
              </div>

              <div className="text-[11px] text-[#7B8A90] space-y-1">
                <p>⚡ 239 Asset Subcategories</p>
                <p>📁 100+ File Formats Supported</p>
                <p>🔒 256-bit Encrypted Downloads</p>
              </div>
            </div>
          </div>

        </div>

        {/* Bottom copyright line */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px]">
          <p>© {new Date().getFullYear()} Kreate Studio. All rights reserved. Made for Indian creators & developers.</p>
          <div className="flex items-center gap-6">
            <Link to="/browse" className="hover:text-white transition-colors">Browse</Link>
            <Link to="/categories" className="hover:text-white transition-colors">Categories</Link>
            <Link to="/pricing" className="hover:text-white transition-colors">Pricing</Link>
            <Link to="/signin" className="hover:text-white transition-colors">Sign In</Link>
          </div>
        </div>

      </div>
    </footer>
  );
};

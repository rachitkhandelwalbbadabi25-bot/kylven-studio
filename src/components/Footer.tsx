import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { CoreCategory } from "../types";
import { ShieldCheck, Zap, Smartphone, ArrowUpRight, CheckCircle2, IndianRupee, Heart } from "lucide-react";
import { BrandMark } from "./BrandLogo";

export const Footer: React.FC = () => {
  const navigate = useNavigate();

  const handleSelectCategory = (cat: CoreCategory) => {
    navigate(`/browse?category=${encodeURIComponent(cat)}`);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className="bg-[#111317] border-t border-[#202C44] text-[#7B8A90] text-xs pt-16 pb-10" id="site-footer">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Marketplace Value Trust Strip */}
        <div className="bg-[#202C44]/40 border border-[#202C44] rounded-2xl p-6 mb-14 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="flex items-start gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-[#000000] border border-[#202C44] flex items-center justify-center text-[#D3CCB0] shrink-0">
              <Zap className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-white font-bold text-sm mb-1 font-heading">UPI-Native Checkout</h4>
              <p className="text-[#7B8A90] text-xs leading-relaxed">
                Direct Indian Rupee (₹) payments via GPay, PhonePe, Paytm, BHIM & UPI ID. Zero FX markup or USD conversions.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-[#000000] border border-[#202C44] flex items-center justify-center text-[#D3CCB0] shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-white font-bold text-sm mb-1 font-heading">100% Quality & Malware Verified</h4>
              <p className="text-[#7B8A90] text-xs leading-relaxed">
                Every listing is manually inspected for file integrity, code syntax validity, and commercial licensing.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-[#000000] border border-[#202C44] flex items-center justify-center text-emerald-400 shrink-0">
              <IndianRupee className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-white font-bold text-sm mb-1 font-heading">87.5% Seller Revenue Split</h4>
              <p className="text-[#7B8A90] text-xs leading-relaxed">
                Sellers keep 87.5% net earnings paid directly into Indian bank accounts or UPI VPAs every Monday.
              </p>
            </div>
          </div>
        </div>

        {/* Main Grid Columns */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 pb-14 border-b border-[#202C44]/70">
          
          {/* Brand Info & Mission (4 cols) */}
          <div className="md:col-span-4 space-y-4">
            <div className="flex items-center gap-2.5">
              <BrandMark
                size={34}
                variant="navy"
                className="rounded-xl border border-[#202C44]"
              />
              <span className="font-heading font-bold text-lg text-white tracking-tight">
                Kreate <span className="text-[#D3CCB0]">Studio</span>
              </span>
            </div>

            <p className="text-[#7B8A90] text-xs leading-relaxed max-w-sm">
              The premier digital asset commerce platform for India’s creator economy. Connecting Indian software engineers, UI/UX designers, and ML researchers with verified production tools.
            </p>

            <div className="space-y-2 pt-2">
              <div className="text-[11px] text-white font-medium">Supported Payment Rails:</div>
              <div className="flex flex-wrap items-center gap-1.5">
                <span className="bg-[#000000] px-2.5 py-1 rounded-md text-[11px] border border-[#202C44] text-[#D3CCB0] font-mono font-bold">Google Pay</span>
                <span className="bg-[#000000] px-2.5 py-1 rounded-md text-[11px] border border-[#202C44] text-[#D3CCB0] font-mono font-bold">PhonePe</span>
                <span className="bg-[#000000] px-2.5 py-1 rounded-md text-[11px] border border-[#202C44] text-[#D3CCB0] font-mono font-bold">Paytm</span>
                <span className="bg-[#000000] px-2.5 py-1 rounded-md text-[11px] border border-[#202C44] text-[#D3CCB0] font-mono font-bold">BHIM UPI</span>
              </div>
            </div>
          </div>

          {/* Core Categories (2 cols) */}
          <div className="md:col-span-2 space-y-3">
            <h5 className="text-white font-semibold text-xs uppercase tracking-wider font-heading">
              Categories
            </h5>
            <ul className="space-y-2">
              <li>
                <button onClick={() => handleSelectCategory("Software & Development")} className="hover:text-[#D3CCB0] transition-colors text-left">
                  Software & Dev
                </button>
              </li>
              <li>
                <button onClick={() => handleSelectCategory("UI/UX & Design")} className="hover:text-[#D3CCB0] transition-colors text-left">
                  UI/UX & Figma
                </button>
              </li>
              <li>
                <button onClick={() => handleSelectCategory("AI/ML & Data Science")} className="hover:text-[#D3CCB0] transition-colors text-left">
                  AI/ML & Notebooks
                </button>
              </li>
              <li>
                <button onClick={() => handleSelectCategory("3D & CAD")} className="hover:text-[#D3CCB0] transition-colors text-left">
                  3D & Blender
                </button>
              </li>
              <li>
                <button onClick={() => handleSelectCategory("Video/Motion & Audio")} className="hover:text-[#D3CCB0] transition-colors text-left">
                  Video LUTs & Audio
                </button>
              </li>
              <li>
                <button onClick={() => handleSelectCategory("Productivity & Business")} className="hover:text-[#D3CCB0] transition-colors text-left">
                  Notion & Business
                </button>
              </li>
            </ul>
          </div>

          {/* Sellers & Selling (2 cols) */}
          <div className="md:col-span-2 space-y-3">
            <h5 className="text-white font-semibold text-xs uppercase tracking-wider font-heading">
              For Sellers
            </h5>
            <ul className="space-y-2">
              <li>
                <Link to="/sell/new" className="hover:text-[#D3CCB0] transition-colors inline-flex items-center gap-1">
                  <span>Start Selling</span>
                  <ArrowUpRight className="w-3 h-3 text-[#D3CCB0]" />
                </Link>
              </li>
              <li>
                <Link to="/dashboard" className="hover:text-[#D3CCB0] transition-colors">
                  Seller Dashboard
                </Link>
              </li>
              <li>
                <Link to="/pricing" className="hover:text-[#D3CCB0] transition-colors">
                  87.5% Revenue Split
                </Link>
              </li>
              <li>
                <Link to="/pricing" className="hover:text-[#D3CCB0] transition-colors">
                  UPI Payout Schedule
                </Link>
              </li>
              <li>
                <span className="text-[#D3CCB0] font-mono text-[11px]">₹0 Listing Fees</span>
              </li>
            </ul>
          </div>

          {/* Company & Editorial (2 cols) */}
          <div className="md:col-span-2 space-y-3">
            <h5 className="text-white font-semibold text-xs uppercase tracking-wider font-heading">
              Company
            </h5>
            <ul className="space-y-2">
              <li>
                <Link to="/pricing" className="hover:text-[#D3CCB0] transition-colors">
                  About Kreate Studio
                </Link>
              </li>
              <li>
                <div className="inline-flex items-center gap-1.5">
                  <span className="hover:text-[#D3CCB0] cursor-pointer">Careers</span>
                  <span className="bg-emerald-950 text-emerald-400 text-[9px] font-mono font-bold px-1.5 py-0.2 rounded border border-emerald-800/60">
                    HIRING
                  </span>
                </div>
              </li>
              <li>
                <Link to="/browse" className="hover:text-[#D3CCB0] transition-colors">
                  Seller Stories & Blog
                </Link>
              </li>
              <li>
                <Link to="/categories" className="hover:text-[#D3CCB0] transition-colors">
                  Directory & Formats
                </Link>
              </li>
              <li>
                <Link to="/dashboard" className="hover:text-[#D3CCB0] transition-colors">
                  Seller Guidelines
                </Link>
              </li>
            </ul>
          </div>

          {/* Help & Legal (2 cols) */}
          <div className="md:col-span-2 space-y-3">
            <h5 className="text-white font-semibold text-xs uppercase tracking-wider font-heading">
              Help & Legal
            </h5>
            <ul className="space-y-2">
              <li>
                <Link to="/pricing" className="hover:text-[#D3CCB0] transition-colors">
                  Help Center & FAQs
                </Link>
              </li>
              <li>
                <Link to="/pricing" className="hover:text-[#D3CCB0] transition-colors">
                  UPI Settlement Policy
                </Link>
              </li>
              <li>
                <Link to="/pricing" className="hover:text-[#D3CCB0] transition-colors">
                  Commercial Licensing
                </Link>
              </li>
              <li>
                <Link to="/pricing" className="hover:text-[#D3CCB0] transition-colors">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link to="/pricing" className="hover:text-[#D3CCB0] transition-colors">
                  Privacy Policy
                </Link>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom copyright line */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px]">
          <div className="flex items-center gap-2">
            <span>© {new Date().getFullYear()} Kreate Studio Technologies Pvt. Ltd.</span>
            <span>•</span>
            <span className="text-[#D3CCB0]">Built with pride for Indian sellers</span>
          </div>
          
          <div className="flex items-center gap-6">
            <Link to="/browse" className="hover:text-white transition-colors">Marketplace</Link>
            <Link to="/categories" className="hover:text-white transition-colors">Categories</Link>
            <Link to="/pricing" className="hover:text-white transition-colors">Pricing</Link>
            <Link to="/sell/new" className="hover:text-white transition-colors">Become a Seller</Link>
          </div>
        </div>

      </div>
    </footer>
  );
};

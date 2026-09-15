import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { CATEGORIES_LIST, FILE_FORMATS_CATALOG } from "../data/mockData";
import { CoreCategory, AssetListing } from "../types";
import {
  Code2,
  BrainCircuit,
  Palette,
  Box,
  Video,
  Briefcase,
  Layers,
  ArrowRight,
  Sparkles,
  ShieldCheck,
  Tag,
  Download
} from "lucide-react";

interface CategoriesPageProps {
  listings?: AssetListing[];
}

export const CategoriesPage: React.FC<CategoriesPageProps> = ({ listings = [] }) => {
  const navigate = useNavigate();

  const getCategoryIcon = (iconName: string) => {
    switch (iconName) {
      case "Code2":
        return <Code2 className="w-6 h-6 text-[#D3CCB0]" />;
      case "BrainCircuit":
        return <BrainCircuit className="w-6 h-6 text-[#D3CCB0]" />;
      case "Palette":
        return <Palette className="w-6 h-6 text-[#D3CCB0]" />;
      case "Box":
        return <Box className="w-6 h-6 text-[#D3CCB0]" />;
      case "Video":
        return <Video className="w-6 h-6 text-[#D3CCB0]" />;
      case "Briefcase":
        return <Briefcase className="w-6 h-6 text-[#D3CCB0]" />;
      default:
        return <Layers className="w-6 h-6 text-[#D3CCB0]" />;
    }
  };

  const handleSelectCategory = (cat: CoreCategory) => {
    navigate(`/browse?category=${encodeURIComponent(cat)}`);
  };

  const handleSelectTag = (tag: string) => {
    navigate(`/browse?tag=${encodeURIComponent(tag)}`);
  };

  const handleSelectFormat = (ext: string) => {
    navigate(`/browse?format=${encodeURIComponent(ext)}`);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12">
      
      {/* Header */}
      <div className="border-b border-[#202C44] pb-8">
        <div className="inline-flex items-center gap-2 bg-[#202C44] text-[#D3CCB0] text-xs font-mono font-bold px-3 py-1 rounded-full border border-[#202C44] mb-3">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Category Directory</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-heading font-extrabold text-white tracking-tight">
          Categories
        </h1>
        <p className="text-sm text-[#7B8A90] mt-2 max-w-2xl leading-relaxed">
          Comprehensive catalog of verified creator assets spanning developer codebases, machine learning pipelines, UI kits, 3D meshes, cinematic LUTs, productivity dashboards, and creative tools.
        </p>
      </div>

      {/* Categories Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {CATEGORIES_LIST.map((cat) => {
          const liveCount = listings.filter(
            (l) =>
              l.deleted !== true &&
              (l.category?.toLowerCase() === cat.name.toLowerCase() ||
                l.category?.toLowerCase().includes(cat.name.toLowerCase().split(" ")[0]))
          ).length;

          return (
            <div
              key={cat.name}
              className="bg-[#111317] border border-[#202C44] hover:border-[#D3CCB0]/50 rounded-2xl p-6 transition-all duration-200 flex flex-col justify-between shadow-lg group"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-[#202C44] border border-[#202C44] flex items-center justify-center group-hover:scale-105 transition-transform">
                      {getCategoryIcon(cat.iconName)}
                    </div>
                    <span className="text-xs font-mono font-bold text-[#D3CCB0] bg-[#202C44] px-2.5 py-0.5 rounded-lg border border-[#202C44]">
                      Group #{cat.id}
                    </span>
                  </div>
                  <span className="text-xs font-mono text-[#D3CCB0] bg-[#202C44] px-2.5 py-1 rounded-full border border-[#202C44]">
                    {liveCount} {liveCount === 1 ? "listing" : "listings"}
                  </span>
                </div>

              <h2 className="text-lg font-heading font-bold text-white mb-2 group-hover:text-[#D3CCB0] transition-colors">
                {cat.id}. {cat.name}
              </h2>

              <p className="text-xs text-[#7B8A90] leading-relaxed mb-4">
                {cat.description}
              </p>

              {/* Subcategories list */}
              <div className="space-y-1.5 mb-4">
                <span className="text-[10px] text-[#7B8A90] uppercase tracking-wider font-mono block font-semibold">
                  Subcategories:
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {cat.subcategories.map((sub) => (
                    <button
                      key={sub}
                      onClick={() => navigate(`/browse?category=${encodeURIComponent(cat.name)}&q=${encodeURIComponent(sub)}`)}
                      className="text-[11px] bg-[#202C44] hover:bg-[#202C44]/80 text-[#D3CCB0] px-2.5 py-1 rounded-lg border border-[#202C44] transition-colors"
                    >
                      {sub}
                    </button>
                  ))}
                </div>
              </div>

              {/* Popular tags */}
              {cat.popularTags && (
                <div className="space-y-1 mb-4">
                  <span className="text-[10px] text-[#7B8A90] uppercase tracking-wider font-mono block">
                    Popular Tags:
                  </span>
                  <div className="flex flex-wrap gap-1">
                    {cat.popularTags.map((t) => (
                      <button
                        key={t}
                        onClick={() => handleSelectTag(t)}
                        className="text-[10px] text-[#7B8A90] hover:text-white font-mono"
                      >
                        #{t}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <button
              onClick={() => handleSelectCategory(cat.name)}
              className="mt-4 pt-3 border-t border-[#202C44] flex items-center justify-between text-xs font-bold text-white group-hover:text-[#D3CCB0] transition-colors"
            >
              <span>Browse {cat.name}</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        );})}
      </div>

      {/* File Formats Supported Section */}
      <div className="bg-[#111317] border border-[#202C44] rounded-2xl p-8 space-y-6">
        <div>
          <h3 className="text-lg font-heading font-bold text-white">
            Supported Digital File Formats
          </h3>
          <p className="text-xs text-[#7B8A90] mt-1">
            Click any format to explore available downloadable packages.
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
          {FILE_FORMATS_CATALOG.map((fmt) => (
            <button
              key={fmt.ext}
              onClick={() => handleSelectFormat(fmt.ext)}
              className="bg-[#202C44] hover:bg-[#202C44]/80 border border-[#202C44] hover:border-[#D3CCB0] p-3 rounded-xl text-left transition-all group"
            >
              <span className="font-mono text-xs font-bold text-[#D3CCB0] block">
                {fmt.ext}
              </span>
              <span className="text-[11px] text-white block mt-0.5 truncate">
                {fmt.label}
              </span>
              <span className="text-[9px] text-[#7B8A90] block truncate">
                {fmt.category}
              </span>
            </button>
          ))}
        </div>
      </div>

    </div>
  );
};

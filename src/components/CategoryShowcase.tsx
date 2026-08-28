import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { CATEGORIES_LIST } from "../data/mockData";
import { CoreCategory } from "../types";
import {
  Code2,
  BrainCircuit,
  Palette,
  Box,
  Video,
  Briefcase,
  Sparkles,
  ArrowRight,
  Layers,
  Flame,
  CheckCircle2,
  FolderTree,
  ChevronRight,
} from "lucide-react";
import { motion } from "motion/react";

interface CategoryShowcaseProps {
  onSelectCategory: (cat: CoreCategory) => void;
}

export const CategoryShowcase: React.FC<CategoryShowcaseProps> = ({ onSelectCategory }) => {
  const navigate = useNavigate();
  const [selectedGroup, setSelectedGroup] = useState<number | null>(null);

  const getCategoryIcon = (iconName: string, id: number) => {
    switch (iconName) {
      case "Code2":
        return <Code2 className="w-5 h-5 text-[#D3CCB0]" />;
      case "BrainCircuit":
        return <BrainCircuit className="w-5 h-5 text-[#D3CCB0]" />;
      case "Palette":
        return <Palette className="w-5 h-5 text-[#D3CCB0]" />;
      case "Box":
        return <Box className="w-5 h-5 text-[#D3CCB0]" />;
      case "Video":
        return <Video className="w-5 h-5 text-[#D3CCB0]" />;
      case "Briefcase":
        return <Briefcase className="w-5 h-5 text-[#D3CCB0]" />;
      case "Sparkles":
      default:
        return <Sparkles className="w-5 h-5 text-[#D3CCB0]" />;
    }
  };

  const getTrendingTag = (id: number) => {
    switch (id) {
      case 1:
        return { label: "High Demand", isHot: true };
      case 2:
        return { label: "Top Growth", isHot: true };
      case 3:
        return { label: "Trending", isHot: true };
      case 4:
        return { label: "3D Ready", isHot: false };
      case 5:
        return { label: "Creative", isHot: true };
      case 6:
        return { label: "Essential", isHot: false };
      case 7:
        return { label: "Creator Kits", isHot: true };
      default:
        return { label: "Verified", isHot: false };
    }
  };

  return (
    <section className="py-16 md:py-20 bg-[#111317] border-b border-[#202C44]" id="category-showcase-section">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        
        {/* Section Header with exact requested text */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-2.5">
            <div className="inline-flex items-center gap-2 bg-[#202C44] border border-[#202C44] px-3.5 py-1 rounded-full text-xs font-mono font-bold text-[#D3CCB0]">
              <FolderTree className="w-3.5 h-3.5" />
              <span>MARKETPLACE TAXONOMY</span>
            </div>
            
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-heading font-extrabold text-white tracking-tight" id="category-section-heading">
              Categories
            </h2>
            
            <p className="text-xs sm:text-sm text-[#7B8A90] font-normal max-w-2xl leading-relaxed">
              Explore India's largest verified creator catalog across 7 structured domains spanning developer codebases, AI weights, design assets, and creative toolkits.
            </p>
          </div>

          <Link
            to="/categories"
            id="view-full-directory-link"
            className="bg-[#000000] hover:bg-[#202C44] border border-[#202C44] text-[#D3CCB0] hover:text-white px-5 py-2.5 rounded-2xl text-xs font-bold transition-all flex items-center gap-2 self-start md:self-auto shadow-lg"
          >
            <span>Full 239+ Directory</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* Structured 7-Group Index List Box (matching the user's reference image styling) */}
        <div className="bg-[#000000]/60 border border-[#202C44] rounded-3xl p-5 sm:p-7 shadow-2xl backdrop-blur-sm" id="seven-groups-index-box">
          <div className="text-xs font-mono text-[#7B8A90] mb-3 flex items-center justify-between">
            <span className="font-semibold uppercase tracking-wider text-[#D3CCB0] flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
              7 Major Category Groups
            </span>
            <span className="text-[11px] text-[#7B8A90]">Click any group to filter</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 font-mono text-xs text-slate-200">
            {CATEGORIES_LIST.map((cat, index) => {
              const isSelected = selectedGroup === cat.id;
              return (
                <button
                  key={cat.id || index}
                  type="button"
                  onClick={() => {
                    setSelectedGroup(isSelected ? null : cat.id);
                    onSelectCategory(cat.name);
                  }}
                  className={`text-left p-3 rounded-xl transition-all border flex items-start justify-between group cursor-pointer ${
                    isSelected
                      ? "bg-[#202C44] border-[#D3CCB0] text-white font-bold shadow-md"
                      : "bg-[#111317]/80 hover:bg-[#202C44]/70 border-[#202C44] text-slate-300 hover:text-white"
                  }`}
                >
                  <div className="space-y-1 pr-2">
                    <div className="flex items-center gap-2 font-mono">
                      <span className="text-[#D3CCB0] font-bold">{cat.id}.</span>
                      <span className="font-sans font-semibold text-xs leading-snug line-clamp-1 group-hover:text-[#D3CCB0] transition-colors">
                        {cat.name.replace("Other (Digital Planners, Embroidery Files, Lightroom Presets, eBooks/Guides)", "Other")}
                      </span>
                    </div>
                    {cat.id === 7 && (
                      <p className="text-[10px] text-[#7B8A90] font-sans pl-4 line-clamp-1">
                        Planners, Embroidery, Presets, eBooks
                      </p>
                    )}
                  </div>
                  <span className="text-[10px] font-mono text-[#D3CCB0] bg-[#000000] px-2 py-0.5 rounded border border-[#202C44] shrink-0 mt-0.5">
                    {cat.count}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* 7 Interactive Visual Category Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5" id="category-cards-grid">
          {CATEGORIES_LIST.map((cat, idx) => {
            const tag = getTrendingTag(cat.id);
            const isSpecialGroup = cat.id === 7;
            return (
              <motion.div
                key={cat.name}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.35, delay: idx * 0.05 }}
                onClick={() => onSelectCategory(cat.name)}
                className={`group relative bg-[#000000]/70 hover:bg-[#000000] border border-[#202C44] hover:border-[#D3CCB0]/60 rounded-3xl p-5 sm:p-6 cursor-pointer transition-all duration-300 flex flex-col justify-between shadow-xl hover:shadow-2xl hover:shadow-[#202C44]/40 ${
                  isSpecialGroup ? "md:col-span-2 lg:col-span-3 xl:col-span-2 bg-[#181C24]/90 border-[#202C44]" : ""
                }`}
              >
                <div className="space-y-4">
                  {/* Top Bar: Group Number + Icon + Tag + Count */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-11 h-11 rounded-2xl bg-[#111317] border border-[#202C44] group-hover:border-[#D3CCB0]/40 flex items-center justify-center group-hover:scale-105 transition-all shadow">
                        {getCategoryIcon(cat.iconName, cat.id)}
                      </div>
                      <span className="text-xs font-mono font-bold text-[#D3CCB0] bg-[#202C44]/80 px-2 py-0.5 rounded-lg border border-[#202C44]">
                        Group #{cat.id}
                      </span>
                    </div>

                    <div className="flex items-center gap-1.5">
                      <span className="inline-flex items-center gap-1 text-[10px] font-mono font-bold bg-[#202C44] text-[#D3CCB0] px-2 py-0.5 rounded-md border border-[#202C44]">
                        {tag.isHot && <Flame className="w-2.5 h-2.5 text-amber-400 fill-amber-400" />}
                        <span>{tag.label}</span>
                      </span>

                      <span className="text-[11px] font-mono font-bold text-white bg-[#111317] px-2 py-0.5 rounded-md border border-[#202C44]">
                        {cat.count} files
                      </span>
                    </div>
                  </div>

                  {/* Title & Description */}
                  <div>
                    <h3 className="text-base sm:text-lg font-heading font-bold text-white group-hover:text-[#D3CCB0] transition-colors line-clamp-1">
                      {cat.name}
                    </h3>
                    <p className="text-xs text-[#7B8A90] leading-relaxed mt-1.5 line-clamp-2">
                      {cat.description}
                    </p>
                  </div>
                </div>

                {/* Subcategories & Link Footer */}
                <div className="space-y-3.5 mt-5">
                  {/* Subcategory Pills */}
                  <div className="flex flex-wrap gap-1.5">
                    {cat.subcategories.slice(0, isSpecialGroup ? 5 : 3).map((sub) => (
                      <span
                        key={sub}
                        className="text-[10px] bg-[#111317] text-[#7B8A90] group-hover:text-white px-2 py-0.5 rounded-md border border-[#202C44] transition-colors"
                      >
                        {sub}
                      </span>
                    ))}
                    {cat.subcategories.length > (isSpecialGroup ? 5 : 3) && (
                      <span className="text-[10px] text-[#D3CCB0] font-mono self-center px-1">
                        +{cat.subcategories.length - (isSpecialGroup ? 5 : 3)} more
                      </span>
                    )}
                  </div>

                  <div className="pt-3 border-t border-[#202C44]/80 flex items-center justify-between text-xs font-heading font-bold text-white group-hover:text-[#D3CCB0] transition-colors">
                    <span className="truncate max-w-[180px]">Explore {cat.name.split(" ")[0]}</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform shrink-0" />
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

      </div>
    </section>
  );
};


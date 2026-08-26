import React from "react";
import { CATEGORIES_LIST } from "../data/mockData";
import { CoreCategory } from "../types";
import { Code2, BrainCircuit, Palette, Box, Video, Briefcase, ArrowRight, Layers, Sparkles, Flame } from "lucide-react";
import { motion } from "motion/react";

interface CategoryShowcaseProps {
  onSelectCategory: (cat: CoreCategory) => void;
}

export const CategoryShowcase: React.FC<CategoryShowcaseProps> = ({ onSelectCategory }) => {
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

  const getTrendingTag = (catName: string) => {
    switch (catName) {
      case "UI/UX & Design":
        return { label: "Trending", isHot: true };
      case "Software & Development":
        return { label: "High Demand", isHot: true };
      case "AI/ML & Data Science":
        return { label: "Top Growth", isHot: true };
      case "3D & CAD":
        return { label: "Popular", isHot: false };
      case "Video/Motion & Audio":
        return { label: "Trending", isHot: true };
      default:
        return { label: "Essential", isHot: false };
    }
  };

  return (
    <section className="py-20 bg-[#111317] border-b border-[#202C44]" id="category-showcase-section">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-14">
          <div className="space-y-3">
            <div className="inline-flex items-center gap-2 bg-[#202C44] border border-[#202C44] px-3.5 py-1.5 rounded-full text-xs font-mono font-bold text-[#D3CCB0]">
              <Sparkles className="w-3.5 h-3.5" />
              <span>VISUAL DISCOVERY</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-heading font-extrabold text-white tracking-tight">
              Explore Categories
            </h2>
            <p className="text-sm sm:text-base text-[#7B8A90] font-normal max-w-xl leading-relaxed">
              Find production-tested source files, UI kits, algorithms, and 3D assets organized across top industry sectors.
            </p>
          </div>

          <div className="bg-[#000000] border border-[#202C44] px-5 py-2.5 rounded-2xl text-xs text-[#7B8A90] flex items-center gap-3 self-start md:self-auto shadow-lg">
            <div>
              <span className="font-bold text-white font-mono text-sm">239+</span> <span className="text-[#7B8A90]">Subcategories</span>
            </div>
            <span className="text-[#202C44]">|</span>
            <div>
              <span className="font-bold text-[#D3CCB0] font-mono text-sm">100+</span> <span className="text-[#7B8A90]">File Formats</span>
            </div>
          </div>
        </div>

        {/* 6 Large Category Tiles */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {CATEGORIES_LIST.map((cat, idx) => {
            const tag = getTrendingTag(cat.name);
            return (
              <motion.div
                key={cat.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: idx * 0.08 }}
                onClick={() => onSelectCategory(cat.name)}
                className="group relative bg-[#000000]/70 hover:bg-[#000000] border border-[#202C44] hover:border-[#D3CCB0]/60 rounded-3xl p-7 cursor-pointer transition-all duration-300 flex flex-col justify-between shadow-xl hover:shadow-2xl hover:shadow-[#202C44]/40"
              >
                <div>
                  {/* Top Bar: Icon + Count + Trending Pill */}
                  <div className="flex items-center justify-between mb-5">
                    <div className="w-14 h-14 rounded-2xl bg-[#111317] border border-[#202C44] group-hover:border-[#D3CCB0]/40 flex items-center justify-center group-hover:scale-105 transition-all shadow">
                      {getCategoryIcon(cat.iconName)}
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="inline-flex items-center gap-1 text-[11px] font-mono font-bold bg-[#202C44] text-[#D3CCB0] px-2.5 py-1 rounded-lg border border-[#202C44]">
                        {tag.isHot && <Flame className="w-3 h-3 text-amber-400 fill-amber-400" />}
                        <span>{tag.label}</span>
                      </span>

                      <span className="text-xs font-mono font-bold text-white bg-[#111317] px-2.5 py-1 rounded-lg border border-[#202C44]">
                        {cat.count} Listings
                      </span>
                    </div>
                  </div>

                  {/* Title & Description */}
                  <h3 className="text-xl font-heading font-bold text-white mb-2 group-hover:text-[#D3CCB0] transition-colors">
                    {cat.name}
                  </h3>

                  <p className="text-xs text-[#7B8A90] leading-relaxed mb-6">
                    {cat.description}
                  </p>
                </div>

                {/* Subcategories & Link Footer */}
                <div className="space-y-4">
                  {/* Subcategory Pills */}
                  <div className="flex flex-wrap gap-1.5">
                    {cat.subcategories.slice(0, 3).map((sub) => (
                      <span
                        key={sub}
                        className="text-[11px] bg-[#111317] text-[#7B8A90] group-hover:text-white px-2.5 py-1 rounded-lg border border-[#202C44] transition-colors"
                      >
                        {sub}
                      </span>
                    ))}
                    {cat.subcategories.length > 3 && (
                      <span className="text-[11px] text-[#D3CCB0] font-mono self-center px-1">
                        +{cat.subcategories.length - 3} more
                      </span>
                    )}
                  </div>

                  <div className="pt-4 border-t border-[#202C44]/80 flex items-center justify-between text-xs font-heading font-bold text-white group-hover:text-[#D3CCB0] transition-colors">
                    <span>Browse {cat.name}</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
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

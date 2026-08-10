import React from "react";
import { CATEGORIES_LIST } from "../data/mockData";
import { CoreCategory } from "../types";
import { Code2, BrainCircuit, Palette, Box, Video, Briefcase, ArrowRight, Layers } from "lucide-react";

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

  return (
    <section className="py-16 bg-[#000000] border-b border-[#202C44]/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10">
          <div>
            <div className="inline-flex items-center gap-2 text-[#D3CCB0] text-xs font-semibold uppercase tracking-wider mb-2 font-mono">
              <span className="w-1.5 h-1.5 rounded-full bg-[#D3CCB0]" />
              <span>Explore Ecosystem</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-heading font-bold text-white tracking-tight">
              6 Core Digital Asset Sectors
            </h2>
            <p className="text-xs sm:text-sm text-[#7B8A90] mt-1 max-w-xl">
              Powering Indian tech startups, indie creators, designers, and film editors with verified downloadable source files.
            </p>
          </div>

          <div className="bg-[#111317] border border-[#202C44] px-4 py-2 rounded-xl text-xs text-[#7B8A90] flex items-center gap-2">
            <span className="font-bold text-white">239</span> Subcategories
            <span className="text-[#202C44]">|</span>
            <span className="font-bold text-[#D3CCB0]">100+</span> File Formats
          </div>
        </div>

        {/* Core 6 Categories Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {CATEGORIES_LIST.map((cat) => (
            <div
              key={cat.name}
              onClick={() => onSelectCategory(cat.name)}
              className="group bg-[#202C44] hover:bg-[#202C44]/90 border border-[#202C44] hover:border-[#D3CCB0]/40 rounded-2xl p-6 cursor-pointer transition-all duration-200 flex flex-col justify-between shadow-lg"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 rounded-xl bg-[#111317] border border-[#202C44] flex items-center justify-center group-hover:scale-105 transition-transform">
                    {getCategoryIcon(cat.iconName)}
                  </div>
                  <span className="text-[11px] font-mono text-[#D3CCB0] bg-[#111317] px-2.5 py-1 rounded-full border border-[#202C44]">
                    {cat.count} listings
                  </span>
                </div>

                <h3 className="text-lg font-heading font-bold text-white mb-2 group-hover:text-[#D3CCB0] transition-colors">
                  {cat.name}
                </h3>

                <p className="text-xs text-[#7B8A90] leading-relaxed mb-4">
                  {cat.description}
                </p>
              </div>

              {/* Subcategory Pills */}
              <div>
                <div className="flex flex-wrap gap-1.5 mb-4">
                  {cat.subcategories.slice(0, 3).map((sub) => (
                    <span
                      key={sub}
                      className="text-[10px] bg-[#111317]/80 text-[#7B8A90] px-2 py-0.5 rounded border border-[#202C44]/80"
                    >
                      {sub}
                    </span>
                  ))}
                  {cat.subcategories.length > 3 && (
                    <span className="text-[10px] text-[#D3CCB0] px-1 font-mono">
                      +{cat.subcategories.length - 3} more
                    </span>
                  )}
                </div>

                <div className="pt-3 border-t border-[#111317]/80 flex items-center justify-between text-xs font-medium text-white group-hover:text-[#D3CCB0]">
                  <span>Explore {cat.name}</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};

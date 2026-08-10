import React from "react";
import { FILE_FORMATS_CATALOG } from "../data/mockData";
import { FileCode, FolderArchive, Sparkles, Check, Download, Layers } from "lucide-react";

interface FileFormatsBreadthProps {
  onSelectFormat: (formatExt: string) => void;
}

export const FileFormatsBreadth: React.FC<FileFormatsBreadthProps> = ({ onSelectFormat }) => {
  return (
    <section className="py-16 bg-[#111317] border-b border-[#202C44]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-10 space-y-3">
          <div className="inline-flex items-center gap-2 bg-[#202C44] border border-[#202C44] px-3 py-1 rounded-full text-xs font-mono text-[#D3CCB0]">
            <Layers className="w-3.5 h-3.5" />
            <span>Universal Asset Compatibility</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-heading font-bold text-white tracking-tight">
            100+ Real Source File Formats Supported
          </h2>
          <p className="text-xs sm:text-sm text-[#7B8A90] leading-relaxed">
            No proprietary lock-in. Get clean, uncompressed, original raw files with full commercial licenses instantly upon UPI checkout.
          </p>
        </div>

        {/* Format Chips Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 max-w-5xl mx-auto">
          {FILE_FORMATS_CATALOG.map((item) => (
            <button
              key={item.ext}
              onClick={() => onSelectFormat(item.ext)}
              className="bg-[#202C44] hover:bg-[#202C44]/80 border border-[#202C44] hover:border-[#D3CCB0]/40 p-3.5 rounded-xl text-left transition-all duration-200 group flex items-start justify-between"
            >
              <div>
                <span className="font-mono text-sm font-bold text-[#D3CCB0] block group-hover:underline">
                  {item.ext}
                </span>
                <span className="text-[11px] text-white font-medium block mt-0.5">
                  {item.label}
                </span>
                <span className="text-[10px] text-[#7B8A90] block mt-0.5">
                  {item.category}
                </span>
              </div>
              <Download className="w-3.5 h-3.5 text-[#7B8A90] group-hover:text-[#D3CCB0] transition-colors" />
            </button>
          ))}
        </div>

        {/* Feature Highlights */}
        <div className="mt-12 pt-8 border-t border-[#202C44]/60 grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-4xl mx-auto text-center">
          <div className="flex items-center justify-center gap-2 text-xs text-[#7B8A90]">
            <Check className="w-4 h-4 text-[#D3CCB0]" />
            <span>Zip Archiving with Zero Password Lock</span>
          </div>

          <div className="flex items-center justify-center gap-2 text-xs text-[#7B8A90]">
            <Check className="w-4 h-4 text-[#D3CCB0]" />
            <span>Virus & Malware Scanned Files</span>
          </div>

          <div className="flex items-center justify-center gap-2 text-xs text-[#7B8A90]">
            <Check className="w-4 h-4 text-[#D3CCB0]" />
            <span>Lifetime Re-download Access</span>
          </div>
        </div>

      </div>
    </section>
  );
};

import React from "react";

interface BrandLogoProps {
  size?: number | string;
  className?: string;
  showText?: boolean;
  textClassName?: string;
  isSellerMode?: boolean;
  withContainer?: boolean;
}

/**
 * Kreate Studio Official Logo Mark
 * Stylized "K" seamlessly integrated with a shopping / creator price tag emblem.
 */
export const BrandMark: React.FC<{
  size?: number | string;
  className?: string;
  variant?: "navy" | "cream" | "white" | "emerald" | "raw";
}> = ({ size = 32, className = "", variant = "navy" }) => {
  const numSize = typeof size === "number" ? size : parseInt(size, 10) || 32;

  return (
    <svg
      width={numSize}
      height={numSize}
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`shrink-0 ${className}`}
      aria-label="Kreate Studio Logo"
    >
      {/* Background Container for Navy Icon Variant */}
      {variant === "navy" && (
        <rect width="100" height="100" rx="22" fill="#1C283F" />
      )}
      {variant === "emerald" && (
        <rect width="100" height="100" rx="22" fill="#064E3B" />
      )}
      {variant === "cream" && (
        <rect width="100" height="100" rx="22" fill="#D3CCB0" />
      )}

      {/* Official Kreate "K + Tag" Emblem */}
      <g id="kreate-k-tag-glyph">
        {/* Main 'K' Glyph + Tag Body in White (or dynamic color) */}
        <path
          d="
            M39.2 34.8 
            C39.2 33.2 40.5 32 42.1 32 
            L48.2 32 
            C49.8 32 51.1 33.2 51.1 34.8 
            L51.1 43.1 
            L55.6 37.6 
            C56.9 36.0 58.7 34.8 60.8 34.8 
            L64.2 34.8 
            C65.5 34.8 66.5 35.8 66.4 37.1 
            C66.1 40.5 64.6 44.8 60.2 48.9 
            C59.3 49.7 59.3 51.0 60.1 51.8 
            L65.6 57.5 
            C67.4 59.4 68.4 61.9 68.4 64.5 
            L68.4 64.9 
            C68.4 66.2 67.4 67.2 66.1 67.2 
            L59.1 67.2 
            C57.4 67.2 55.7 66.4 54.6 65.1 
            L51.1 60.9 
            L51.1 64.5 
            C51.1 66.0 49.8 67.2 48.2 67.2 
            L42.1 67.2 
            C40.5 67.2 39.2 66.0 39.2 64.5 
            L39.2 56.6 
            L28.8 61.2 
            C27.4 61.8 25.8 61.1 25.2 59.7 
            L23.4 55.6 
            C22.8 54.2 23.5 52.6 24.9 52.0 
            L39.2 45.7 
            Z
          "
          fill={variant === "cream" ? "#1C283F" : "#FFFFFF"}
        />

        {/* Tag Punch-Hole Cutout on the K junction */}
        <path
          d="
            M39.2 43.2
            L43.8 45.3
            C46.3 46.4 47.5 49.3 46.4 51.8
            L43.4 58.4
            L39.2 56.5
            Z
          "
          fill={
            variant === "navy"
              ? "#1C283F"
              : variant === "emerald"
              ? "#064E3B"
              : variant === "cream"
              ? "#D3CCB0"
              : "#1C283F"
          }
        />

        {/* Crisp circular punch hole inside the tag header */}
        <circle
          cx="43.2"
          cy="50.6"
          r="2.2"
          fill={variant === "cream" ? "#1C283F" : "#FFFFFF"}
        />
      </g>
    </svg>
  );
};

export const BrandLogo: React.FC<BrandLogoProps> = ({
  size = 36,
  className = "",
  showText = true,
  textClassName = "",
  isSellerMode = false,
  withContainer = true,
}) => {
  return (
    <div className={`flex items-center gap-2.5 shrink-0 ${className}`}>
      <BrandMark
        size={size}
        variant={isSellerMode ? "emerald" : "navy"}
        className="rounded-xl shadow-md transition-transform group-hover:scale-105"
      />
      {showText && (
        <div className="flex flex-col text-left">
          <span
            className={`font-heading font-extrabold text-base text-white tracking-tight leading-none group-hover:text-[#D3CCB0] transition-colors ${textClassName}`}
          >
            Kreate{" "}
            <span className={isSellerMode ? "text-emerald-400" : "text-[#D3CCB0]"}>
              Studio
            </span>
          </span>
          <span className="text-[10px] text-[#7B8A90] font-sans font-medium tracking-wide leading-tight mt-0.5 hidden md:inline">
            India’s Creative Marketplace
          </span>
        </div>
      )}
    </div>
  );
};

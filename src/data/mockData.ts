import { AssetListing, CoreCategory, SalesRecord, SellerStats } from "../types";

export const CATEGORIES_LIST: {
  name: CoreCategory;
  count: number;
  description: string;
  subcategories: string[];
  iconName: string;
}[] = [
  {
    name: "Software & Development",
    count: 48,
    description: "Production-ready Flutter, React, Next.js templates, backend microservices, & APIs.",
    subcategories: ["Flutter Mobile Apps", "React / Next.js Starters", "Node.js Backends", "Python Scripts", "Full Stack Suites"],
    iconName: "Code2",
  },
  {
    name: "AI/ML & Data Science",
    count: 36,
    description: "Jupyter notebooks, Llama-3 fine-tuning scripts, RAG pipelines & vision datasets.",
    subcategories: ["Jupyter Notebooks", "RAG Pipelines", "LoRA Weights", "Data Scrapers", "Prompt Libraries"],
    iconName: "BrainCircuit",
  },
  {
    name: "UI/UX & Design",
    count: 64,
    description: "Design systems, Figma component libraries, mobile UI kits, & icon sets.",
    subcategories: ["Figma UI Kits", "Design Systems", "Mobile App UI", "Icon Sets", "Wireframe Kits"],
    iconName: "Palette",
  },
  {
    name: "3D & CAD",
    count: 29,
    description: "Blender assets, Low-poly game models, CAD schematics, & Substance materials.",
    subcategories: ["Blender Files (.blend)", "Low-Poly Models", "CAD Schematics", "Textures & Shader Packs", "Unreal Engine Assets"],
    iconName: "Box",
  },
  {
    name: "Video/Motion & Audio",
    count: 38,
    description: "Premiere Pro presets, Cinematic LUTs, After Effects templates, & royalty-free stems.",
    subcategories: ["Cinematic LUTs", "Premiere Presets", "After Effects Motion", "Sound FX & Audio Stems", "Thumbnail Templates"],
    iconName: "Video",
  },
  {
    name: "Productivity & Business",
    count: 24,
    description: "Notion OS dashboards, GST invoice macros, agency proposal decks, & workflow kits.",
    subcategories: ["Notion Templates", "Excel & GST Macros", "Pitch Decks", "Agency Contracts", "Automation Workflows"],
    iconName: "Briefcase",
  },
];

export const FILE_FORMATS_CATALOG = [
  { ext: ".pdf", label: "PDF Document / eBook", category: "Productivity & Business" },
  { ext: ".fig", label: "Figma File", category: "UI/UX & Design" },
  { ext: ".dart", label: "Flutter App Source", category: "Software & Development" },
  { ext: ".ipynb", label: "Jupyter Notebook", category: "AI/ML & Data Science" },
  { ext: ".blend", label: "Blender 3D Project", category: "3D & CAD" },
  { ext: ".cube", label: "3D LUT Presets", category: "Video/Motion & Audio" },
  { ext: ".notion", label: "Notion Workspace", category: "Productivity & Business" },
  { ext: ".tsx", label: "React / Next.js Source", category: "Software & Development" },
  { ext: ".prpr", label: "Premiere Pro Preset", category: "Video/Motion & Audio" },
  { ext: ".aep", label: "After Effects Project", category: "Video/Motion & Audio" },
  { ext: ".xlsx", label: "Excel Macro Workbook", category: "Productivity & Business" },
  { ext: ".psd", label: "Photoshop Document", category: "UI/UX & Design" },
  { ext: ".fbx", label: "3D FBX Asset", category: "3D & CAD" },
  { ext: ".py", label: "Python Source Code", category: "AI/ML & Data Science" },
  { ext: ".canva", label: "Canva Pro Template", category: "UI/UX & Design" },
  { ext: ".zip", label: "Compressed Asset Pack", category: "All" },
];

export const MOCK_LISTINGS: AssetListing[] = [
  {
    id: "asset-1",
    title: "BharatPay — Fintech & UPI Payments Figma UI Kit",
    category: "UI/UX & Design",
    subcategory: "Figma UI Kits",
    description: "Complete dark-mode UPI payment & fintech application design system built for Indian banking apps. Includes 140+ screens, autolayout v5, tokenized design components, transaction flows, and sound-box alerts UI.",
    detailedFeatures: [
      "140+ Mobile & Web Screens optimized for Indian users",
      "UPI QR Code scanner & fast payment PIN flow screens",
      "Complete auto-layout components with light and dark mode",
      "GST Invoice breakdown, rewards & transaction history UI",
      "Includes free lifetime updates & vector icons (.svg)"
    ],
    priceInINR: 1499,
    rating: 4.9,
    reviewCount: 42,
    salesCount: 184,
    fileFormatTags: [".fig", ".zip", ".svg"],
    fileSizeBytes: "84 MB",
    thumbnailUrl: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1000&q=80",
    previewImages: [
      "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1559526324-4b87b5e36e44?auto=format&fit=crop&w=1200&q=80"
    ],
    seller: {
      id: "sel-1",
      name: "Aarav Sharma",
      handle: "@aarav_ui",
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80",
      badge: "Top Seller",
      verified: true,
      responseTime: "< 1 hour",
      totalSales: 840,
      rating: 4.95,
      joinedDate: "Jan 2024",
      location: "Bengaluru, KA"
    },
    featured: true,
    isNew: false,
    createdAt: "2026-07-15",
    licenseType: "Commercial License",
    compatibleWith: ["Figma 2026", "Adobe XD", "Sketch"],
    downloadUrl: "https://kreatestudio.dev/downloads/bharatpay-uikit-v2.zip",
    reviewList: [
      {
        id: "rev-1",
        userName: "Rohan Varma",
        userAvatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=100&q=80",
        rating: 5,
        date: "2 days ago",
        comment: "Extremely detailed Figma kit! Saved us 3 weeks of work building our client's UPI merchant portal.",
        verifiedPurchase: true
      },
      {
        id: "rev-2",
        userName: "Neha Kulkarni",
        userAvatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=100&q=80",
        rating: 5,
        date: "1 week ago",
        comment: "Clean tokens and Auto Layout version 5 integration. Instant UPI checkout worked smoothly!",
        verifiedPurchase: true
      }
    ]
  },
  {
    id: "asset-2",
    title: "QuickServe — Flutter E-Commerce App Template with Razorpay",
    category: "Software & Development",
    subcategory: "Flutter Mobile Apps",
    description: "Production-ready Flutter 3.x cross-platform app template with full Razorpay/UPI gateway integration, OTP login, cart state management with Riverpod, and Supabase backend configuration.",
    detailedFeatures: [
      "100% Null Safety Flutter 3.22 code base",
      "Razorpay, GPay, and PhonePe native SDK hooks",
      "Riverpod 2.0 state management & clean architecture",
      "Multilingual ready (Hindi, English, Tamil, Telugu)",
      "Firebase Push Notifications & Order Status Tracking"
    ],
    priceInINR: 2999,
    rating: 4.8,
    reviewCount: 31,
    salesCount: 112,
    fileFormatTags: [".dart", ".zip", ".json"],
    fileSizeBytes: "142 MB",
    thumbnailUrl: "https://images.unsplash.com/photo-1551650975-87deedd944c3?auto=format&fit=crop&w=1000&q=80",
    previewImages: [
      "https://images.unsplash.com/photo-1551650975-87deedd944c3?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1526498460520-4c246339dccb?auto=format&fit=crop&w=1200&q=80"
    ],
    seller: {
      id: "sel-2",
      name: "Priya Sundaram",
      handle: "@priya_flutter",
      avatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=200&q=80",
      badge: "Verified Developer",
      verified: true,
      responseTime: "< 2 hours",
      totalSales: 430,
      rating: 4.88,
      joinedDate: "Mar 2024",
      location: "Chennai, TN"
    },
    featured: true,
    isNew: true,
    createdAt: "2026-08-01",
    licenseType: "Commercial License",
    compatibleWith: ["Flutter 3.x", "Dart 3", "Android Studio", "VS Code"],
    downloadUrl: "https://kreatestudio.dev/downloads/quickserve-flutter-v3.zip",
    reviewList: [
      {
        id: "rev-3",
        userName: "Siddharth Rao",
        userAvatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=100&q=80",
        rating: 5,
        date: "3 days ago",
        comment: "Compilation took zero effort on iOS and Android. Razorpay test keys worked right away.",
        verifiedPurchase: true
      }
    ]
  },
  {
    id: "asset-3",
    title: "Llama-3.3 70B Fine-Tuning & RAG Pipeline Notebooks",
    category: "AI/ML & Data Science",
    subcategory: "Jupyter Notebooks",
    description: "Battle-tested QLoRA fine-tuning Jupyter notebooks for Llama 3 models on custom Indian language corpora, paired with a full LangChain RAG pipeline and Qdrant vector database setup.",
    detailedFeatures: [
      "Ready-to-run Google Colab Pro / Kaggle GPU notebooks",
      "QLoRA 4-bit quantization setup with Unsloth optimization",
      "RAG document parser for Indian Legal & Financial PDFs",
      "Evaluation suite with ROUGE, BLEU & Semantic similarity",
      "FastAPI inference server wrapper script included (.py)"
    ],
    priceInINR: 3499,
    rating: 5.0,
    reviewCount: 19,
    salesCount: 78,
    fileFormatTags: [".ipynb", ".py", ".zip"],
    fileSizeBytes: "28 MB",
    thumbnailUrl: "https://images.unsplash.com/photo-1620712943543-bcc4688e7485?auto=format&fit=crop&w=1000&q=80",
    previewImages: [
      "https://images.unsplash.com/photo-1620712943543-bcc4688e7485?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1555949963-ff9fe0c870eb?auto=format&fit=crop&w=1200&q=80"
    ],
    seller: {
      id: "sel-3",
      name: "Dr. Vikram Joshi",
      handle: "@vikram_ai",
      avatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=200&q=80",
      badge: "AI Specialist",
      verified: true,
      responseTime: "< 30 mins",
      totalSales: 310,
      rating: 4.98,
      joinedDate: "Nov 2023",
      location: "Hyderabad, TS"
    },
    featured: true,
    isNew: false,
    createdAt: "2026-07-28",
    licenseType: "Commercial License",
    compatibleWith: ["Python 3.11", "PyTorch 2.3", "Google Colab", "JupyterLab"],
    downloadUrl: "https://kreatestudio.dev/downloads/llama3-rag-notebooks.zip",
    reviewList: [
      {
        id: "rev-4",
        userName: "Karan Mehta",
        userAvatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=100&q=80",
        rating: 5,
        date: "Yesterday",
        comment: "Unsloth optimization saved us hundreds of dollars in Colab compute. Exceptional quality!",
        verifiedPurchase: true
      }
    ]
  },
  {
    id: "asset-4",
    title: "Cinematic Mumbai & Goa Drone LUTs (Rec.709 & Log)",
    category: "Video/Motion & Audio",
    subcategory: "Cinematic LUTs",
    description: "Professional color grading 3D LUT pack engineered specifically for golden hour lighting, tropical Indian greens, and high-dynamic-range drone footage (DJI, Sony S-Log3, Canon C-Log).",
    detailedFeatures: [
      "18 Custom 3D LUTs (.cube files) in 33x33 and 64x64 resolution",
      "Optimized for Sony S-Log3, Apple Log, DJI D-Log M, & Rec.709",
      "Premiere Pro, DaVinci Resolve, Final Cut Pro & CapCut compatible",
      "Includes exposure adjustment PDF guide & sample RAW stills"
    ],
    priceInINR: 899,
    rating: 4.7,
    reviewCount: 54,
    salesCount: 320,
    fileFormatTags: [".cube", ".zip"],
    fileSizeBytes: "18 MB",
    thumbnailUrl: "https://images.unsplash.com/photo-1518173946687-a4c8a383392e?auto=format&fit=crop&w=1000&q=80",
    previewImages: [
      "https://images.unsplash.com/photo-1518173946687-a4c8a383392e?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80"
    ],
    seller: {
      id: "sel-4",
      name: "Kabir Motion Arts",
      handle: "@kabir_visuals",
      avatar: "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&w=200&q=80",
      badge: "Verified Studio",
      verified: true,
      responseTime: "< 4 hours",
      totalSales: 1250,
      rating: 4.91,
      joinedDate: "Feb 2024",
      location: "Mumbai, MH"
    },
    featured: false,
    isNew: false,
    createdAt: "2026-06-10",
    licenseType: "Commercial License",
    compatibleWith: ["Premiere Pro 2026", "DaVinci Resolve", "Final Cut Pro", "CapCut"],
    downloadUrl: "https://kreatestudio.dev/downloads/mumbai-goa-luts.zip",
    reviewList: []
  },
  {
    id: "asset-5",
    title: "Agency OS 2026 — Notion Workspace for Indian Freelancers",
    category: "Productivity & Business",
    subcategory: "Notion Templates",
    description: "The ultimate operating system for Indian freelancers, agencies, and studios. Manages GST invoices, client CRM, project milestones, proposal templates, and WhatsApp notification links.",
    detailedFeatures: [
      "Auto GST & TDS Tax Calculator tailored for Indian IT/Service slabs",
      "Client Relationship Manager (CRM) with pipeline stage tracker",
      "Contract & Scope of Work (SOW) legal template generator",
      "Income & Expense dashboard with UPI QR embedding",
      "1-Click duplicate into your personal Notion workspace"
    ],
    priceInINR: 699,
    rating: 4.9,
    reviewCount: 88,
    salesCount: 540,
    fileFormatTags: [".notion", ".pdf"],
    fileSizeBytes: "Cloud Link",
    thumbnailUrl: "https://images.unsplash.com/photo-1484480974693-6ca0a78fb36b?auto=format&fit=crop&w=1000&q=80",
    previewImages: [
      "https://images.unsplash.com/photo-1484480974693-6ca0a78fb36b?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=1200&q=80"
    ],
    seller: {
      id: "sel-5",
      name: "Rishabh Kapoor",
      handle: "@rishabh_notion",
      avatar: "https://images.unsplash.com/photo-1501196354995-cbb51c65aaea?auto=format&fit=crop&w=200&q=80",
      badge: "Notion Certified",
      verified: true,
      responseTime: "< 1 hour",
      totalSales: 1890,
      rating: 4.96,
      joinedDate: "Dec 2023",
      location: "Delhi, NCR"
    },
    featured: false,
    isNew: true,
    createdAt: "2026-08-04",
    licenseType: "Commercial License",
    compatibleWith: ["Notion App", "Web Browser"],
    downloadUrl: "https://kreatestudio.dev/downloads/agency-os-notion.zip",
    reviewList: []
  },
  {
    id: "asset-6",
    title: "Substance 3D Cyberpunk Auto-Rickshaw & Indian Assets",
    category: "3D & CAD",
    subcategory: "Blender Files (.blend)",
    description: "High-detail 3D model of a futuristic neon auto-rickshaw, chai tapri stall, and street props. Rigged, textured in 4K 16-bit PBR maps, ready for Blender 4.x and Unreal Engine 5.4.",
    detailedFeatures: [
      "Full Blender .blend file with Cycles & EEVEE material setups",
      "4K PBR Texture maps (Albedo, Normal, Roughness, Metallic, Emission)",
      "Rigged wheels, handles, and suspension animations",
      "Low-poly LOD versions for game engines included (.fbx)"
    ],
    priceInINR: 2299,
    rating: 5.0,
    reviewCount: 14,
    salesCount: 62,
    fileFormatTags: [".blend", ".fbx", ".zip"],
    fileSizeBytes: "520 MB",
    thumbnailUrl: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1000&q=80",
    previewImages: [
      "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1633356122544-f134324a6cee?auto=format&fit=crop&w=1200&q=80"
    ],
    seller: {
      id: "sel-6",
      name: "Tanya Graphic Labs",
      handle: "@tanya_3d",
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80",
      badge: "3D Pro Artist",
      verified: true,
      responseTime: "< 3 hours",
      totalSales: 210,
      rating: 4.92,
      joinedDate: "Apr 2024",
      location: "Pune, MH"
    },
    featured: false,
    isNew: false,
    createdAt: "2026-07-02",
    licenseType: "Commercial License",
    compatibleWith: ["Blender 4.2+", "Unreal Engine 5", "Maya", "3ds Max"],
    downloadUrl: "https://kreatestudio.dev/downloads/cyberpunk-rickshaw-3d.zip",
    reviewList: []
  },
  {
    id: "asset-7",
    title: "Next.js 15 SaaS Starter with Supabase, Stripe & Tailwind v4",
    category: "Software & Development",
    subcategory: "React / Next.js Starters",
    description: "Production SaaS boilerplate with App Router, server actions, Supabase Auth, Row Level Security, Razorpay & Stripe webhooks, and responsive dashboard layout.",
    detailedFeatures: [
      "Next.js 15 App Router & React 19 Server Components",
      "Tailwind CSS v4 with dark mode & high-contrast theme",
      "Supabase DB with automatic migrations & typegen",
      "Razorpay + Stripe subscriptions & invoice portal"
    ],
    priceInINR: 1899,
    rating: 4.9,
    reviewCount: 28,
    salesCount: 140,
    fileFormatTags: [".tsx", ".zip", ".json"],
    fileSizeBytes: "32 MB",
    thumbnailUrl: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=1000&q=80",
    previewImages: [
      "https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=1200&q=80"
    ],
    seller: {
      id: "sel-2",
      name: "Priya Sundaram",
      handle: "@priya_flutter",
      avatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=200&q=80",
      badge: "Verified Developer",
      verified: true,
      responseTime: "< 2 hours",
      totalSales: 430,
      rating: 4.88,
      joinedDate: "Mar 2024",
      location: "Chennai, TN"
    },
    featured: false,
    isNew: true,
    createdAt: "2026-08-05",
    licenseType: "Commercial License",
    compatibleWith: ["Next.js 15", "Node 20+", "VS Code"],
    downloadUrl: "https://kreatestudio.dev/downloads/nextjs15-saas-starter.zip",
    reviewList: []
  },
  {
    id: "asset-8",
    title: "YouTube High-CTR Thumbnail Masterkit for Indian Tech & Vloggers",
    category: "Video/Motion & Audio",
    subcategory: "Thumbnail Templates",
    description: "50+ Photoshop & Canva Pro high-converting thumbnail templates built for viral Indian YouTube channels. Custom cutout layer styles, glowing text effects, and Devanagari typography presets.",
    detailedFeatures: [
      "50 PSD & Canva editable templates (1920x1080 300DPI)",
      "High-contrast color combos for Indian audience feeds",
      "Free Devanagari & bold display fonts included",
      "Expression cutouts & lighting adjustment overlays"
    ],
    priceInINR: 499,
    rating: 4.8,
    reviewCount: 65,
    salesCount: 410,
    fileFormatTags: [".psd", ".canva", ".zip"],
    fileSizeBytes: "310 MB",
    thumbnailUrl: "https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?auto=format&fit=crop&w=1000&q=80",
    previewImages: [
      "https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?auto=format&fit=crop&w=1200&q=80"
    ],
    seller: {
      id: "sel-4",
      name: "Kabir Motion Arts",
      handle: "@kabir_visuals",
      avatar: "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&w=200&q=80",
      badge: "Verified Studio",
      verified: true,
      responseTime: "< 4 hours",
      totalSales: 1250,
      rating: 4.91,
      joinedDate: "Feb 2024",
      location: "Mumbai, MH"
    },
    featured: false,
    isNew: false,
    createdAt: "2026-05-18",
    licenseType: "Commercial License",
    compatibleWith: ["Photoshop CC", "Canva Pro"],
    downloadUrl: "https://kreatestudio.dev/downloads/youtube-thumbnail-masterkit.zip",
    reviewList: []
  }
];

export const INITIAL_SELLER_STATS: SellerStats = {
  totalEarnedINR: 148250,
  pendingPayoutINR: 18400,
  totalSalesCount: 342,
  activeListingsCount: 8,
  averageRating: 4.92,
};

export const MOCK_SALES_HISTORY: SalesRecord[] = [
  {
    id: "sale-101",
    orderId: "KS-ORD-8921",
    assetTitle: "BharatPay — Fintech & UPI Payments Figma UI Kit",
    buyerName: "Vikramaditya S.",
    buyerLocation: "Bengaluru, KA",
    listedPriceINR: 1499,
    platformFeeINR: 187, // 12.5%
    totalPaidINR: 1686,
    sellerEarningsINR: 1349, // 90%
    paymentMethod: "UPI (GPay)",
    date: "2026-08-08 14:32",
    status: "Completed",
  },
  {
    id: "sale-102",
    orderId: "KS-ORD-8918",
    assetTitle: "BharatPay — Fintech & UPI Payments Figma UI Kit",
    buyerName: "Ananya Deshmukh",
    buyerLocation: "Pune, MH",
    listedPriceINR: 1499,
    platformFeeINR: 187,
    totalPaidINR: 1686,
    sellerEarningsINR: 1349,
    paymentMethod: "UPI (PhonePe)",
    date: "2026-08-07 19:15",
    status: "Completed",
  },
  {
    id: "sale-103",
    orderId: "KS-ORD-8902",
    assetTitle: "QuickServe — Flutter E-Commerce App Template",
    buyerName: "Rajesh Kumar",
    buyerLocation: "Gurugram, HR",
    listedPriceINR: 2999,
    platformFeeINR: 375,
    totalPaidINR: 3374,
    sellerEarningsINR: 2699,
    paymentMethod: "Credit Card",
    date: "2026-08-06 11:04",
    status: "Completed",
  },
  {
    id: "sale-104",
    orderId: "KS-ORD-8889",
    assetTitle: "Next.js 15 SaaS Starter with Supabase",
    buyerName: "Deepak Patel",
    buyerLocation: "Ahmedabad, GJ",
    listedPriceINR: 1899,
    platformFeeINR: 237,
    totalPaidINR: 2136,
    sellerEarningsINR: 1709,
    paymentMethod: "UPI (Paytm)",
    date: "2026-08-05 22:40",
    status: "Payout Processing",
  },
  {
    id: "sale-105",
    orderId: "KS-ORD-8874",
    assetTitle: "BharatPay — Fintech & UPI Payments Figma UI Kit",
    buyerName: "Siddharth N.",
    buyerLocation: "Hyderabad, TS",
    listedPriceINR: 1499,
    platformFeeINR: 187,
    totalPaidINR: 1686,
    sellerEarningsINR: 1349,
    paymentMethod: "UPI (GPay)",
    date: "2026-08-04 16:50",
    status: "Completed",
  },
];

export type StackGroup = {
  id: string;
  title: string;
  summary: string;
  items: readonly string[];
};

export const stackGroups: readonly StackGroup[] = [
  {
    id: "mobil",
    title: "Mobil",
    summary: "Native iOS'ta SwiftUI; gerektiğinde çapraz platform. Mağaza, abonelik ve sürüm süreçleri dahil.",
    items: [
      "SwiftUI",
      "Swift",
      "StoreKit",
      "Core Motion",
      "WidgetKit",
      "React Native",
      "Flutter",
      "App Store Connect",
      "fastlane",
    ],
  },
  {
    id: "web",
    title: "Web & Arayüz",
    summary: "Next.js ile hızlı, erişilebilir ve gerçek zamanlı veriyle beslenen arayüzler.",
    items: ["Next.js", "React", "TypeScript", "Tailwind CSS", "Three.js", "WebSocket", "Framer Motion"],
  },
  {
    id: "backend",
    title: "Servis & Veri",
    summary: "Spring Boot servisleri, Postgres tabanlı BaaS'lar ve yapay zekâ entegrasyonları.",
    items: ["Java", "Spring Boot", "REST API", "Supabase", "PostgreSQL", "Firebase", "OpenAI API"],
  },
  {
    id: "arac",
    title: "Araçlar & Süreç",
    summary: "Tasarımdan yayına kadar tek elden; sürüm kontrolü ve çevik süreçlerle.",
    items: ["Git", "GitHub", "Figma", "XcodeGen", "Photoshop", "Canva", "Agile"],
  },
];

/** Big words for the marquee band. */
export const marquee = [
  "SwiftUI",
  "Next.js",
  "Spring Boot",
  "TypeScript",
  "Supabase",
  "Three.js",
  "React Native",
  "StoreKit",
  "WebSocket",
  "Flutter",
] as const;

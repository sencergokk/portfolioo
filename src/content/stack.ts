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
    items: ["SwiftUI", "Swift", "StoreKit", "Core Motion", "React Native", "Flutter", "App Store Connect", "fastlane"],
  },
  {
    id: "web",
    title: "Web & Arayüz",
    summary: "Next.js ile hızlı, erişilebilir ve gerçek zamanlı veriyle beslenen arayüzler ve veri görselleştirme.",
    items: ["Next.js", "React", "TypeScript", "JavaScript", "Tailwind CSS", "Three.js", "WebSocket"],
  },
  {
    id: "backend",
    title: "Backend & Veri",
    summary: "Spring Boot servisleri, REST/SOAP entegrasyonları, ilişkisel veritabanları ve MES–ERP veri akışları.",
    items: ["Java", "Spring Boot", "REST API", "SOAP", "PostgreSQL", "SQL", "Supabase", "Firebase", "ERP entegrasyonu"],
  },
  {
    id: "altyapi",
    title: "Altyapı & Yapay Zekâ",
    summary: "Konteynerleştirilmiş dağıtım, sürüm kontrolü ve kurumsal verilerle konuşan LLM tabanlı asistanlar.",
    items: ["Docker", "Git", "GitHub", "GitLab", "LLM", "Chatbot", "OpenAI API", "Agile Scrum"],
  },
];

/** Big words for the marquee band. */
export const marquee = [
  "SwiftUI",
  "Next.js",
  "Spring Boot",
  "TypeScript",
  "PostgreSQL",
  "Three.js",
  "Docker",
  "StoreKit",
  "LLM",
  "Java",
] as const;

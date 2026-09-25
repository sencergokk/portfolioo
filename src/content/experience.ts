export type Role = {
  /** Kept generic on purpose: the employer is not named on the site. */
  org: string;
  title: string;
  period: string;
  current?: boolean;
  summary: string;
  highlights?: readonly string[];
  tags: readonly string[];
};

export const experience: readonly Role[] = [
  {
    org: "Kurumsal yazılım",
    title: "Yazılım Geliştirici",
    period: "Tem 2025'ten beri",
    current: true,
    summary:
      "Java ve Spring Boot ile kurumsal uygulamaların backend geliştirmesini ve bakımını yürütüyor, Next.js ile veri odaklı arayüzler geliştiriyorum.",
    highlights: [
      "RESTful API tasarımı ve harici sistem entegrasyonları",
      "ERP entegrasyonu, veritabanı tasarımı ve SQL optimizasyonu",
      "Docker ile dağıtım, LLM tabanlı chatbot çözümleri",
    ],
    tags: ["Java", "Spring Boot", "Next.js", "PostgreSQL", "Docker", "LLM"],
  },
  {
    org: "Bağımsız · App Store",
    title: "iOS Geliştirici",
    period: "2024'ten beri",
    current: true,
    summary:
      "Kendi ürünlerimi fikirden yayına tek başıma taşıyorum: tasarım, SwiftUI ile geliştirme, abonelikler, mağaza optimizasyonu ve çok dilli yayın.",
    highlights: [
      "StoreKit ile abonelik ve uygulama içi satın alma",
      "Supabase ve Firebase ile backend, gizlilik odaklı analitik",
      "fastlane ile 7 dilde mağaza görselleri ve metinleri",
    ],
    tags: ["SwiftUI", "StoreKit", "Supabase", "Firebase", "fastlane"],
  },
  {
    org: "Kurumsal yazılım",
    title: "Yazılım Stajyeri",
    period: "Şubat ile Haziran 2025",
    summary:
      "Next.js ile arayüzler ve rapor sayfaları geliştirdim, REST entegrasyonları ve Git akışlarıyla ekip içi geliştirme süreçlerine dahil oldum.",
    highlights: [
      "Next.js ile rapor ve yönetim ekranları",
      "REST API entegrasyonları",
      "Git ile ekip içi sürüm akışları",
    ],
    tags: ["Next.js", "REST", "SQL", "Git"],
  },
];

export const education = {
  school: "Başkent Üniversitesi",
  degree: "Yönetim Bilişim Sistemleri",
  period: "Mezuniyet 2025",
  notes: ["YBS Topluluğu aktif üyesi", "AFAD gönüllüsü", "İngilizce B2"],
} as const;

export const certificates = [
  { name: "Çevik Proje Yönetimi", issuer: "BTK Akademi" },
  { name: "Git ve GitHub", issuer: "BTK Akademi" },
  { name: "Algoritma ve Veri Yapıları", issuer: "BTK Akademi" },
  { name: "C++ ile Programlama", issuer: "BTK Akademi" },
  { name: "Herkes İçin Yapay Zekâ", issuer: "Bilgeİş" },
  { name: "HTML", issuer: "Bilgeİş" },
] as const;

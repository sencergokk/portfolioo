export type Role = {
  /** Kept generic on purpose — the employer is not named on the site. */
  company: string;
  team?: string;
  title: string;
  period: string;
  current?: boolean;
  summary: string;
  highlights?: readonly string[];
  tags: readonly string[];
};

export const experience: readonly Role[] = [
  {
    company: "Endüstriyel otomasyon",
    team: "Kurumsal MES & ERP",
    title: "Yazılım Geliştirici",
    period: "Tem 2025 — Günümüz",
    current: true,
    summary:
      "Kurumsal MES yazılımının backend geliştirmesini ve bakımını Java ve Spring Boot ile yürütüyor; aynı ürünün Next.js arayüzlerini ve veri görselleştirme bileşenlerini geliştiriyorum.",
    highlights: [
      "RESTful API tasarımı; servislerin frontend ve harici sistemlerle entegrasyonu",
      "MES ile ERP arasındaki veri alışverişi ve iletişim mekanizmaları",
      "Veritabanı tasarımı, SQL geliştirme ve sorgu optimizasyonu",
      "Docker ile konteynerleştirme, geliştirme ve dağıtım ortamlarının yönetimi",
      "Kurumsal sistem ve verilerle konuşan LLM tabanlı chatbot çözümleri",
    ],
    tags: ["Java", "Spring Boot", "REST", "Next.js", "PostgreSQL", "Docker", "ERP", "LLM"],
  },
  {
    company: "Bağımsız",
    team: "App Store",
    title: "iOS Geliştirici",
    period: "2024 — Günümüz",
    current: true,
    summary:
      "Kendi ürünlerimi fikirden yayına tek başıma taşıyorum: ürün ve arayüz tasarımı, SwiftUI ile geliştirme, abonelik ve uygulama içi satın alma, mağaza optimizasyonu ve çok dilli yayın.",
    highlights: [
      "StoreKit ile abonelik ve uygulama içi satın alma akışları",
      "Supabase ve Firebase ile backend, gizlilik odaklı analitik",
      "fastlane ile otomatik ekran görüntüsü ve 7 dilde mağaza metadatası",
    ],
    tags: ["SwiftUI", "StoreKit", "Supabase", "Firebase", "fastlane", "ASO"],
  },
  {
    company: "Endüstriyel otomasyon",
    team: "Kurumsal MES & ERP",
    title: "Yazılım Stajyeri",
    period: "Şub — Haz 2025",
    summary:
      "Next.js ile ölçeklenebilir arayüzler ve rapor sayfaları geliştirdim; kullanıcı yönetimi ve veritabanı işlemleri, RESTful API entegrasyonları ve Git akışlarıyla ekip içi yazılım geliştirme süreçlerine dahil oldum.",
    tags: ["Next.js", "REST", "SQL", "Git"],
  },
];

export const education = {
  school: "Başkent Üniversitesi",
  degree: "Yönetim Bilişim Sistemleri",
  period: "2021 — 2025",
  notes: ["YBS Topluluğu aktif üyesi", "AFAD gönüllüsü", "İngilizce · B2"],
} as const;

export const certificates = [
  { name: "Çevik Proje Yönetimi", issuer: "BTK Akademi" },
  { name: "Versiyon Kontrolü: Git ve GitHub", issuer: "BTK Akademi" },
  { name: "Algoritma Programlama ve Veri Yapıları", issuer: "BTK Akademi" },
  { name: "C++ ile Programlamaya Giriş", issuer: "BTK Akademi" },
  { name: "Herkes İçin Yapay Zekâ", issuer: "Bilgeİş" },
  { name: "HTML Eğitimi", issuer: "Bilgeİş" },
] as const;

export type Role = {
  company: string;
  team?: string;
  title: string;
  period: string;
  current?: boolean;
  summary: string;
  tags: readonly string[];
};

export const experience: readonly Role[] = [
  {
    company: "TEKNOPAR Endüstriyel Otomasyon",
    team: "TIA Platform",
    title: "Yazılım Mühendisi",
    period: "Haz 2025 — Günümüz",
    current: true,
    summary:
      "REST API'ler ve WebSocket üzerinden akan endüstriyel verileri Next.js ile gerçek zamanlı görselleştiren, raporlara dönüştüren performans odaklı arayüzler geliştiriyorum. Java ile REST servislerinin geliştirilmesi, hata iyileştirmeleri ve ERP entegrasyon süreçlerinde yer alıyorum.",
    tags: ["Next.js", "TypeScript", "WebSocket", "Java", "Spring Boot", "ERP"],
  },
  {
    company: "TEKNOPAR Endüstriyel Otomasyon",
    team: "TIA Platform",
    title: "Yazılım Stajyeri",
    period: "Kas 2024 — Haz 2025",
    summary:
      "Gönüllü ve uzun dönem stajımda Next.js ile ölçeklenebilir arayüzler ve rapor sayfaları geliştirdim. Supabase ile kullanıcı yönetimi ve veritabanı işlemlerini kurdum, RESTful API entegrasyonları yaptım, Git akışlarıyla ekip içi geliştirme süreçlerine dahil oldum.",
    tags: ["Next.js", "Supabase", "REST", "Git"],
  },
  {
    company: "Febrics Bilişim Teknolojileri",
    title: "Stajyer",
    period: "Haz — Ağu 2024",
    summary:
      "Bilgi teknolojileri üzerine sunum ve araştırmalar yaptım; C++, JavaScript ve React Native üzerine kendimi geliştirdim.",
    tags: ["React Native", "JavaScript", "C++"],
  },
  {
    company: "NetDataSoft Bilişim Teknolojileri",
    title: "Gönüllü Stajyer",
    period: "Haz — Ağu 2022",
    summary:
      "HTML, CSS ve Bootstrap eğitimleri aldım; SHA algoritmaları, MD5 ve Code Smell üzerine sunumlar hazırladım.",
    tags: ["HTML", "CSS", "Bootstrap"],
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

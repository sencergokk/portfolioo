import { socials } from "./site";

const developerPage = socials.appStore.href;
const store = (id: string) => `https://apps.apple.com/tr/app/id${id}`;

/** Glyph keys resolved to icons in `components/ui/AppGlyph.tsx` — keeps content free of UI imports. */
export type GlyphKey =
  | "pitch"
  | "shield"
  | "book"
  | "sparkles"
  | "chef"
  | "sun"
  | "car"
  | "pill"
  | "droplets"
  | "waves"
  | "moon"
  | "scissors"
  | "languages"
  | "library";

export type Accent = {
  /** Two-stop gradient used for glyph tiles and card glows. */
  from: string;
  to: string;
};

export type FeaturedApp = {
  slug: string;
  name: string;
  storeName?: string;
  category: string;
  platforms: readonly string[];
  year?: string;
  tagline: string;
  description: string;
  highlights: readonly string[];
  stack: readonly string[];
  href: string;
  accent: Accent;
  visual: "halisaha" | "kpss" | "theft" | "masal";
};

export type CatalogApp = {
  slug: string;
  name: string;
  category: string;
  blurb: string;
  glyph: GlyphKey;
  accent: Accent;
  href: string;
  featured?: boolean;
  icon?: string;
};

export const featuredApps: readonly FeaturedApp[] = [
  {
    slug: "halisaha-tycoon",
    name: "Halı Saha Tycoon",
    storeName: "Soccer Field Tycoon: Idle Sim",
    category: "Oyun · Simülasyon",
    platforms: ["iPhone", "iPad"],
    year: "2026",
    tagline: "Mahalle sahasından şehrin futbol imparatorluğuna.",
    description:
      "Amcandan kalan yıpranmış bir halı sahayı devralıp şehrin futbol merkezine uzanan bir zincir kurduğun idle/tycoon oyunu. İzometrik saha sahnesi tamamen SwiftUI Canvas ile çiziliyor; oyun ekonomisi formülleri koruyan 87 birim testle güvence altında.",
    highlights: [
      "SwiftUI Canvas ile çizilen izometrik sahne",
      "87 birim testle korunan oyun ekonomisi",
      "7 dilde App Store yerelleştirmesi",
      "Reklamsız, aboneliksiz freemium model",
    ],
    stack: ["SwiftUI", "Canvas", "StoreKit", "XcodeGen", "fastlane"],
    href: developerPage,
    accent: { from: "#3f9b52", to: "#e8b86b" },
    visual: "halisaha",
  },
  {
    slug: "kpss-go",
    name: "KPSS GO",
    storeName: "KPSS GO: Soru ve Konu Anlatım",
    category: "Eğitim",
    platforms: ["iOS", "Android"],
    tagline: "KPSS hazırlığı; cebinde ve kulağında.",
    description:
      "Sesli ders notları, binlerce güncel soru, boşluk doldurma alıştırmaları ve oyunlaştırılmış içeriklerle KPSS'ye hazırlanmayı kolaylaştıran abonelikli eğitim platformu. Supabase altyapısı ve Telegram botuyla App Store ve Google Play'de yayında.",
    highlights: [
      "Silver · Gold · Platinum abonelik",
      "Arka planda çalan sesli ders notları",
      "İnternetsiz soru çözme",
      "Telegram botu entegrasyonu",
    ],
    stack: ["SwiftUI", "Flutter", "Supabase", "Abonelik", "Telegram Bot"],
    href: store("6746972924"),
    accent: { from: "#4f7cff", to: "#9b8cff" },
    visual: "kpss",
  },
  {
    slug: "theft-alarm",
    name: "Theft Alarm",
    storeName: "Theft Alarm: Anti-Theft Guard",
    category: "Araçlar · Güvenlik",
    platforms: ["iPhone", "iPad"],
    year: "2026",
    tagline: "Telefonun izinsiz kıpırdadığı an alarm çalar.",
    description:
      "İvmeölçer, şarj durumu ve yakınlık sensörünü yalnızca koruma modu açıkken, tamamen cihaz üzerinde okuyarak telefonu hırsızlığa karşı koruyan güvenlik uygulaması. Hesap yok, reklam yok; anonim kullanım analitiği kendi Supabase sunucumda.",
    highlights: [
      "Hareket, şarj ve cep koruma modları",
      "PIN ile susturulan alarm",
      "Sensör verisi cihazdan hiç çıkmaz",
      "Gizlilik odaklı, kendi sunucumda analitik",
    ],
    stack: ["SwiftUI", "Core Motion", "StoreKit", "Supabase"],
    href: developerPage,
    accent: { from: "#f59e0b", to: "#ef4444" },
    visual: "theft",
  },
  {
    slug: "masalai",
    name: "MasalAI",
    storeName: "MasalAI: Sonsuz Masal Deneyimi",
    category: "Kitap",
    platforms: ["iPhone"],
    tagline: "Her gece, daha önce hiç anlatılmamış bir masal.",
    description:
      "Çocuklar için her seferinde yeni masallar üreten; okunabilen ve dinlenebilen sakin bir masal uygulaması. Yapay zekâ destekli kurguyu sesli anlatımla tek bir yatmadan önce ritüelinde birleştiriyor.",
    highlights: ["Yapay zekâ ile sonsuz masal", "Sesli anlatım modu", "Çocuk dostu, sade arayüz"],
    stack: ["SwiftUI", "Yapay Zekâ", "Text-to-Speech"],
    href: store("6737716152"),
    accent: { from: "#a855f7", to: "#f472b6" },
    visual: "masal",
  },
];

export const catalog: readonly CatalogApp[] = [
  {
    slug: "halisaha-tycoon",
    name: "Soccer Field Tycoon: Idle Sim",
    category: "Oyun",
    blurb: "Halı sahadan futbol imparatorluğuna uzanan idle/tycoon oyunu.",
    glyph: "pitch",
    accent: { from: "#3f9b52", to: "#e8b86b" },
    href: developerPage,
    featured: true,
    icon: "/apps/halisaha-icon.png",
  },
  {
    slug: "theft-alarm",
    name: "Theft Alarm: Anti-Theft Guard",
    category: "Araçlar",
    blurb: "Sensörlerle çalışan, gizlilik odaklı hırsızlık alarmı.",
    glyph: "shield",
    accent: { from: "#f59e0b", to: "#ef4444" },
    href: developerPage,
    featured: true,
  },
  {
    slug: "kpss-go",
    name: "KPSS GO: Soru ve Konu Anlatım",
    category: "Eğitim",
    blurb: "Sesli dersler ve soru bankasıyla abonelikli KPSS platformu.",
    glyph: "book",
    accent: { from: "#4f7cff", to: "#9b8cff" },
    href: store("6746972924"),
    featured: true,
  },
  {
    slug: "masalai",
    name: "MasalAI: Sonsuz Masal Deneyimi",
    category: "Kitap",
    blurb: "Yapay zekâ ile her gece yeni, sesli bir masal.",
    glyph: "sparkles",
    accent: { from: "#a855f7", to: "#f472b6" },
    href: store("6737716152"),
    featured: true,
  },
  {
    slug: "cooka",
    name: "Cooka",
    category: "Yemek & İçecek",
    blurb: "Elindeki malzemelerden adım adım tarif üreten mutfak asistanı.",
    glyph: "chef",
    accent: { from: "#fb923c", to: "#f43f5e" },
    href: store("6738347469"),
  },
  {
    slug: "notishine",
    name: "Notishine",
    category: "Yaşam Tarzı",
    blurb: "Güne iyi hissettiren, kişiselleştirilmiş pozitif bildirimler.",
    glyph: "sun",
    accent: { from: "#facc15", to: "#fb923c" },
    href: store("6742649551"),
  },
  {
    slug: "ehliyetbox",
    name: "EhliyetBox: Ehliyet Sınav Soru",
    category: "Eğitim",
    blurb: "Firebase destekli güncel soru bankasıyla ehliyet sınavı hazırlığı.",
    glyph: "car",
    accent: { from: "#f97316", to: "#dc2626" },
    href: developerPage,
  },
  {
    slug: "medication-tracking",
    name: "Medication Tracking & Reminder",
    category: "Sağlık",
    blurb: "Kritik ilaçları öncelik seviyesiyle takip eden hatırlatıcı.",
    glyph: "pill",
    accent: { from: "#14b8a6", to: "#22c55e" },
    href: developerPage,
  },
  {
    slug: "speaker-cleaner-water-remover",
    name: "Speaker Cleaner Water Remover",
    category: "Araçlar",
    blurb: "Ses ve titreşim frekanslarıyla hoparlördeki suyu dışarı atar.",
    glyph: "droplets",
    accent: { from: "#22d3ee", to: "#3b82f6" },
    href: developerPage,
  },
  {
    slug: "speaker-cleaner-get-water-out",
    name: "Speaker Cleaner: Get Water Out",
    category: "Araçlar",
    blurb: "Tek dokunuşla frekans dalgalarıyla hoparlör temizliği.",
    glyph: "waves",
    accent: { from: "#38bdf8", to: "#6366f1" },
    href: developerPage,
  },
  {
    slug: "sleep-sounds-plus",
    name: "Sleep Sounds Plus: Brown Noise",
    category: "Sağlık & Fitness",
    blurb: "Kahverengi gürültü ve ortam sesleriyle uyku ve odak.",
    glyph: "moon",
    accent: { from: "#6366f1", to: "#1e1b4b" },
    href: developerPage,
  },
  {
    slug: "beauty-salon-tycoon",
    name: "Beauty Salon Tycoon: Idle",
    category: "Oyun",
    blurb: "Küçük bir salonu güzellik zincirine dönüştürdüğün idle oyun.",
    glyph: "scissors",
    accent: { from: "#ec4899", to: "#f59e0b" },
    href: developerPage,
  },
  {
    slug: "yds",
    name: "YDS Sınav Soruları",
    category: "Eğitim",
    blurb: "YDS'ye hazırlananlar için konu bazlı soru bankası.",
    glyph: "languages",
    accent: { from: "#0ea5e9", to: "#8b5cf6" },
    href: developerPage,
  },
  {
    slug: "yazar-eser-ayt",
    name: "Yazar Eser AYT Edebiyat Kitabı",
    category: "Eğitim",
    blurb: "AYT edebiyatında yazar–eser eşleştirmeleri için çalışma kitabı.",
    glyph: "library",
    accent: { from: "#eab308", to: "#b45309" },
    href: developerPage,
  },
];

/** Region-less App Store link — Apple redirects to the visitor's own storefront. */
const store = (id: string) => `https://apps.apple.com/app/id${id}`;

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
  | "graduation"
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
  /** Home-screen style label used on the mobile grid. */
  shortName: string;
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
      "Amcandan kalan yıpranmış bir halı sahayı devralıp şehrin futbol merkezine uzanan bir zincir kurduğun idle tycoon oyunu. İzometrik saha sahnesi tamamen SwiftUI Canvas ile çiziliyor, oyun ekonomisi 87 birim testle güvence altında.",
    highlights: [
      "SwiftUI Canvas ile çizilen izometrik sahne",
      "87 birim testle korunan oyun ekonomisi",
      "7 dilde App Store yerelleştirmesi",
      "Reklamsız, aboneliksiz freemium model",
    ],
    stack: ["SwiftUI", "Canvas", "StoreKit", "XcodeGen", "fastlane"],
    href: store("6801822720"),
    accent: { from: "#3f9b52", to: "#e8b86b" },
    visual: "halisaha",
  },
  {
    slug: "kpss-go",
    name: "KPSS GO",
    storeName: "KPSS GO: Soru ve Konu Anlatım",
    category: "Eğitim",
    platforms: ["iOS", "Android"],
    tagline: "KPSS hazırlığı cebinde ve kulağında.",
    description:
      "Soru bankası, sesli dersler, deneme testleri, ilerleme takibi, kaydedilen sorular ve Pomodoro çalışma sistemiyle KPSS'ye hazırlanmayı kolaylaştıran abonelikli eğitim platformu. Supabase altyapısıyla App Store ve Google Play'de yayında.",
    highlights: [
      "Soru bankası ve deneme testleri",
      "Arka planda çalan sesli dersler",
      "Pomodoro çalışma sistemi ve ilerleme takibi",
      "Silver · Gold · Platinum abonelik",
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
      "Cihazın hareket ettirilmesini, şarj kablosunun çekilmesini ve cepten çıkarılmasını algılayıp alarm çalan güvenlik uygulaması. Sensörler yalnızca koruma modu açıkken ve tamamen cihaz üzerinde okunur. Hesap yok, reklam yok.",
    highlights: [
      "Hareket, şarj ve cep koruma modları",
      "Ayarlanabilir hassasiyet",
      "PIN ile susturulan alarm",
      "Tamamen çevrimdışı çalışır",
    ],
    stack: ["SwiftUI", "Core Motion", "StoreKit", "Supabase"],
    href: store("6787492253"),
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
    shortName: "Halı Saha",
    category: "Oyun",
    blurb: "Halı sahadan futbol imparatorluğuna uzanan idle tycoon oyunu.",
    glyph: "pitch",
    accent: { from: "#3f9b52", to: "#e8b86b" },
    href: store("6801822720"),
    featured: true,
    icon: "/apps/halisaha-icon.png",
  },
  {
    slug: "theft-alarm",
    name: "Theft Alarm: Anti-Theft Guard",
    shortName: "Theft Alarm",
    category: "Araçlar",
    blurb: "Hareket, şarj ve cep algılayan, çevrimdışı hırsızlık alarmı.",
    glyph: "shield",
    accent: { from: "#f59e0b", to: "#ef4444" },
    href: store("6787492253"),
    featured: true,
    icon: "/apps/theft-alarm-icon.png",
  },
  {
    slug: "kpss-go",
    name: "KPSS GO: Soru ve Konu Anlatım",
    shortName: "KPSS GO",
    category: "Eğitim",
    blurb: "Soru bankası, sesli dersler ve Pomodoro ile abonelikli KPSS platformu.",
    glyph: "book",
    accent: { from: "#4f7cff", to: "#9b8cff" },
    href: store("6746972924"),
    featured: true,
    icon: "/apps/kpss-go-icon.png",
  },
  {
    slug: "ingilizce-ogren",
    name: "İngilizce Öğren Pratik Yap",
    shortName: "İngilizce",
    category: "Eğitim",
    blurb: "A1'den C2'ye oyunlaştırılmış kelime ve günlük İngilizce pratiği.",
    glyph: "languages",
    accent: { from: "#22c55e", to: "#0ea5e9" },
    href: store("6778374680"),
    icon: "/apps/ingilizce-ogren-icon.png",
  },
  {
    slug: "masalai",
    name: "MasalAI: Sonsuz Masal Deneyimi",
    shortName: "MasalAI",
    category: "Kitap",
    blurb: "Yapay zekâ ile her gece yeni, sesli bir masal.",
    glyph: "sparkles",
    accent: { from: "#a855f7", to: "#f472b6" },
    href: store("6737716152"),
    featured: true,
    icon: "/apps/masalai-icon.png",
  },
  {
    slug: "cooka",
    name: "Cooka",
    shortName: "Cooka",
    category: "Yemek & İçecek",
    blurb: "Elindeki malzemelerden yapay zekâ ile kişisel, adım adım tarifler.",
    glyph: "chef",
    accent: { from: "#fb923c", to: "#f43f5e" },
    href: store("6738347469"),
    icon: "/apps/cooka-icon.png",
  },
  {
    slug: "notishine",
    name: "Notishine",
    shortName: "Notishine",
    category: "Yaşam Tarzı",
    blurb: "Aktif saatlerine göre planlanan, kişiselleştirilmiş motivasyon bildirimleri.",
    glyph: "sun",
    accent: { from: "#facc15", to: "#fb923c" },
    href: store("6742649551"),
    icon: "/apps/notishine-icon.png",
  },
  {
    slug: "sleep-sounds-plus",
    name: "Sleep Sounds Plus: Brown Noise",
    shortName: "Sleep Sounds",
    category: "Sağlık & Fitness",
    blurb: "Kahverengi, beyaz ve pembe gürültüyü yağmur ve fan sesleriyle karıştıran uyku mikseri.",
    glyph: "moon",
    accent: { from: "#6366f1", to: "#1e1b4b" },
    href: store("6792748576"),
    icon: "/apps/sleep-sounds-plus-icon.png",
  },
  {
    slug: "medication-tracking",
    name: "Medication Tracking & Reminder",
    shortName: "İlaç Takibi",
    category: "Sağlık",
    blurb: "Doz, sıklık ve önceliğe göre tekrarlayan ilaç hatırlatıcıları.",
    glyph: "pill",
    accent: { from: "#14b8a6", to: "#22c55e" },
    href: store("6745835442"),
    icon: "/apps/medication-tracking-icon.png",
  },
  {
    slug: "speaker-cleaner-water-remover",
    name: "Speaker Water Eject & Dust",
    shortName: "Cleaner",
    category: "Araçlar",
    blurb: "Ses frekansı ve titreşimle hoparlördeki nemi ve tozu dışarı atar.",
    glyph: "droplets",
    accent: { from: "#22d3ee", to: "#3b82f6" },
    href: store("6746083491"),
    icon: "/apps/speaker-cleaner-water-remover-icon.png",
  },
  {
    slug: "speaker-cleaner-get-water-out",
    name: "Speaker Cleaner: Get Water Out",
    shortName: "Water Out",
    category: "Araçlar",
    blurb: "Tek dokunuşla frekans dalgalarıyla hoparlör temizliği.",
    glyph: "waves",
    accent: { from: "#38bdf8", to: "#6366f1" },
    href: store("6791226633"),
    icon: "/apps/speaker-cleaner-get-water-out-icon.png",
  },
  {
    slug: "ehliyetbox",
    name: "EhliyetBox: Ehliyet Sınav Soru",
    shortName: "EhliyetBox",
    category: "Eğitim",
    blurb: "Firebase destekli güncel soru bankasıyla ehliyet sınavı hazırlığı.",
    glyph: "car",
    accent: { from: "#f97316", to: "#dc2626" },
    href: store("6740466156"),
    icon: "/apps/ehliyetbox-icon.png",
  },
  {
    slug: "beauty-salon-tycoon",
    name: "Beauty Salon Tycoon: Idle",
    shortName: "Beauty Salon",
    category: "Oyun",
    blurb: "Küçük bir salonu güzellik zincirine dönüştürdüğün idle oyun.",
    glyph: "scissors",
    accent: { from: "#ec4899", to: "#f59e0b" },
    href: store("6809159412"),
    icon: "/apps/beauty-salon-tycoon-icon.png",
  },
  {
    slug: "yds",
    name: "YDS Sınav Soruları",
    shortName: "YDS",
    category: "Eğitim",
    blurb: "YDS'ye hazırlananlar için konu bazlı soru bankası.",
    glyph: "graduation",
    accent: { from: "#0ea5e9", to: "#8b5cf6" },
    href: store("6749510139"),
    icon: "/apps/yds-icon.png",
  },
  {
    slug: "yazar-eser-ayt",
    name: "Yazar Eser AYT Edebiyat Kitabı",
    shortName: "Yazar Eser",
    category: "Eğitim",
    blurb: "AYT edebiyatında yazar ve eser eşleştirmeleri için çalışma kitabı.",
    glyph: "library",
    accent: { from: "#eab308", to: "#b45309" },
    href: store("6770453951"),
    icon: "/apps/yazar-eser-ayt-icon.png",
  },
  {
    slug: "recipe-chef",
    name: "Recipe Chef: Merge & Cook",
    shortName: "Recipe Chef",
    category: "Oyun",
    blurb: "Malzemeleri birleştirip yemeğe dönüştürdüğün merge ve mutfak oyunu.",
    glyph: "chef",
    accent: { from: "#f97316", to: "#facc15" },
    href: store("6813817710"),
    icon: "/apps/recipe-chef-icon.png",
  },
];

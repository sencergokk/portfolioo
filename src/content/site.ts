/**
 * Single source of truth for personal/profile content.
 * Everything rendered on the page reads from `src/content/*` — edit here, not in components.
 */

export const site = {
  url: "https://sencergok.com",
  name: "Sencer Gök",
  firstName: "Sencer",
  lastName: "Gök",
  role: "Yazılım Mühendisi & iOS Geliştirici",
  title: "Sencer Gök — Yazılım Mühendisi & iOS Geliştirici",
  description:
    "Ankara'da yaşayan yazılım mühendisi ve bağımsız iOS geliştirici. TEKNOPAR'da Next.js ve Java ile endüstriyel veriyi arayüzlere dönüştürüyor; SwiftUI ile App Store'da 14 uygulama yayınladı.",
  locale: "tr_TR",
  location: "Ankara, Türkiye",
  timeZone: "Europe/Istanbul",
  email: "sencergok@outlook.com",
  resume: "/SencerGok_Ozgecmis.pdf",
  availability: "Yeni projelere açık",
  currentRole: { title: "Yazılım Mühendisi", company: "TEKNOPAR — TIA Platform" },
  photo: {
    cutout: "/images/sencer-portrait.png",
    full: "/images/sencer.jpg",
    alt: "Sencer Gök'ün siyah-beyaz portresi",
  },
} as const;

export const socials = {
  github: { label: "GitHub", handle: "@sencergokk", href: "https://github.com/sencergokk" },
  linkedin: { label: "LinkedIn", handle: "in/sencergok", href: "https://www.linkedin.com/in/sencergok" },
  x: { label: "X", handle: "@sencerdev", href: "https://x.com/sencerdev" },
  appStore: {
    label: "App Store",
    handle: "Sencer GOK",
    href: "https://apps.apple.com/tr/developer/sencer-gok/id1777568061",
  },
} as const;

export const nav = [
  { id: "hakkimda", label: "Hakkımda" },
  { id: "uygulamalar", label: "Uygulamalar" },
  { id: "deneyim", label: "Deneyim" },
  { id: "yetkinlikler", label: "Yetkinlikler" },
  { id: "iletisim", label: "İletişim" },
] as const;

export const about = {
  /** `em` parts render in the gold serif italic accent. */
  headline: [
    { text: "Bir fikri; tasarımı, kodu ve mağaza sayfasıyla birlikte" },
    { text: "uçtan uca yaşayan bir ürüne", em: true },
    { text: "dönüştürmeyi seviyorum." },
  ],
  paragraphs: [
    "Başkent Üniversitesi Yönetim Bilişim Sistemleri mezunuyum. Gündüzleri TEKNOPAR'ın TIA Platform ekibinde; REST ve WebSocket üzerinden akan endüstriyel veriyi Next.js ile anlaşılır, hızlı raporlara dönüştürüyor, Java tarafında servis ve ERP entegrasyonlarına dokunuyorum.",
    "Geri kalan zamanımda bağımsız bir iOS geliştiricisiyim: SwiftUI ile eğitimden oyuna, sağlıktan güvenliğe uzanan 14 uygulamayı fikir aşamasından App Store'a kadar tek başıma taşıdım. YBS Topluluğu'nda aktif, AFAD gönüllüsüyüm.",
  ],
  stats: [
    { value: 14, suffix: "", label: "App Store'da yayında uygulama" },
    { value: 10, suffix: "K+", label: "Uygulamalarıma ulaşan kullanıcı" },
    { value: 3, suffix: "+", label: "Yıl profesyonel deneyim" },
    { value: 7, suffix: "", label: "Dilde yerelleştirilmiş oyun" },
  ],
  principles: [
    {
      title: "Net kapsam",
      body: "Önce problemi ve başarı ölçütünü netleştiririm; küçük bir MVP ile başlar, veriye bakarak büyütürüm.",
    },
    {
      title: "Hız ve erişilebilirlik",
      body: "Yükleme süresi, akıcı etkileşim, klavye ve kontrast — hiçbiri sona bırakılan bir detay değil.",
    },
    {
      title: "Bakımı kolay kod",
      body: "Tip güvenliği, test ve tutarlı mimari. Yarın değişecek kodu bugün aceleye getirmem.",
    },
    {
      title: "Şeffaf iletişim",
      body: "Blokajları saklamam; kısa aralıklarla durum paylaşır, kararları birlikte veririm.",
    },
  ],
} as const;

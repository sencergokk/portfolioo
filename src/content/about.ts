import { catalog } from "./apps";

export const about = {
  /** `em` parts render in the gold display-serif accent. */
  headline: [
    { text: "Bir fikri tasarımı, kodu ve mağaza sayfasıyla birlikte" },
    { text: "uçtan uca yaşayan bir ürüne", em: true },
    { text: "dönüştürmeyi seviyorum." },
  ],
  bio: `Başkent Üniversitesi Yönetim Bilişim Sistemleri mezunuyum. Java, Spring Boot ve Next.js ile kurumsal yazılımlar geliştiriyor, SwiftUI ile tasarladığım ${catalog.length} uygulamayı fikir aşamasından App Store'a kadar tek başıma taşıyorum.`,
  stats: [
    { value: catalog.length, suffix: "", label: "App Store'da uygulama" },
    { value: 10, suffix: "K+", label: "Kullanıcıya ulaştı" },
    { value: 7, suffix: "", label: "Dilde yerelleştirme" },
    { value: 3, suffix: "", label: "Platform: iOS, Android, Web" },
  ],
} as const;

export const principles = [
  {
    title: "Net kapsam",
    body: "Önce problemi ve başarı ölçütünü netleştirir, küçük bir MVP ile başlayıp veriye bakarak büyütürüm.",
  },
  {
    title: "Hız ve erişilebilirlik",
    body: "Yükleme süresi, akıcı etkileşim, klavye ve kontrast baştan düşünülür, sona bırakılmaz.",
  },
  {
    title: "Bakımı kolay kod",
    body: "Tip güvenliği, test ve tutarlı mimari. Yarın değişecek kodu bugün aceleye getirmem.",
  },
  {
    title: "Şeffaf iletişim",
    body: "Blokajları saklamam. Kısa aralıklarla durum paylaşır, kararları birlikte veririm.",
  },
] as const;

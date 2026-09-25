import { catalog } from "./apps";

export const about = {
  /** `em` parts render in the gold display-serif accent. */
  headline: [
    { text: "Bir fikri; tasarımı, kodu ve mağaza sayfasıyla birlikte" },
    { text: "uçtan uca yaşayan bir ürüne", em: true },
    { text: "dönüştürmeyi seviyorum." },
  ],
  paragraphs: [
    "Başkent Üniversitesi Yönetim Bilişim Sistemleri mezunuyum. Gündüzleri endüstriyel otomasyon alanında kurumsal MES yazılımları geliştiriyorum: Java ve Spring Boot ile servisler, MES–ERP entegrasyonları, Next.js ile veri görselleştiren arayüzler ve kurumsal verilerle konuşan LLM tabanlı chatbot'lar.",
    `Geri kalan zamanımda bağımsız bir iOS geliştiricisiyim: SwiftUI ile eğitimden oyuna, sağlıktan güvenliğe uzanan ${catalog.length} uygulamayı fikir aşamasından App Store'a kadar tek başıma taşıdım. YBS Topluluğu'nda aktif, AFAD gönüllüsüyüm.`,
  ],
  stats: [
    { value: catalog.length, suffix: "", label: "App Store'da yayında uygulama" },
    { value: 10, suffix: "K+", label: "Uygulamalarıma ulaşan kullanıcı" },
    { value: 7, suffix: "", label: "Dilde yerelleştirilmiş oyun" },
    { value: 3, suffix: "", label: "Platform: iOS, Android ve web" },
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

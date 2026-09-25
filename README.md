# sencergok.com: Portfolyo

Sencer Gök'ün kişisel portfolyosu. **Next.js 16 + Three.js** ile yazılmış, tek sayfalık, karanlık temalı bir site.
Her bölüm tam olarak bir ekran kaplar ve scroll bölümlere oturur. Arka planda scroll ile şekil değiştiren GPU tabanlı
bir sahne var: **uygulama yörüngesi → iPhone ana ekranı**.

- **Hero:** App Store'daki 15 uygulamanın ikonları, altın rengi parçacıklardan oluşan iki eğik yörüngede dönen parlak
  3B karolar olarak yer alır. Her ikonun arkasında bir kuyruklu yıldız izi bırakılır, uzaktaki ikonlar küçülüp kararır.
  İmleç bir ikonun üzerine geldiğinde ikon büyür ve yörünge onu "yakalamak" için yavaşlar; aşağı kaydırınca ikonlar
  merkezdeki çekirdeğe çekilir ve parçacıklar telefona akar.
- **Uygulamalar:** parçacıklar iPhone 15 Pro oranlarında bir ana ekrana dönüşür. Işık alan titanyum çerçeve ve yan
  tuşlar, açılıp kapanan Dynamic Island, canlı bir widget grafiği, ikonlar üzerinden geçen bir dalga ve cam yansıması
  içerir; telefon süzülür ve yavaşça döner. Ardından her biri bir ekran olan 4 öne çıkan uygulama kartı ve mobilde iOS
  ana ekranı gibi görünen uygulama kataloğu gelir.
- **Alt bölümler:** sahne tamamen söner ve render durur; deneyim, yetkinlikler ve iletişim bölümlerinde arka plan
  animasyonu yoktur.

## Teknoloji

| Katman    | Seçim                                                                        |
| --------- | ---------------------------------------------------------------------------- |
| Framework | Next.js 16 (App Router, Turbopack), React 19, TypeScript (strict)            |
| 3B        | three.js + @react-three/fiber, özel GLSL vertex/fragment shader              |
| Animasyon | motion (Framer Motion), Lenis (smooth scroll + snap)                         |
| Stil      | Tailwind CSS v4 (`@theme` token'ları), next/font (Geist, Playfair Display)   |
| SEO       | Metadata API, JSON-LD `Person`, dinamik OG görseli, sitemap, robots, ikonlar |

## Geliştirme

```bash
npm install
npm run dev        # http://localhost:3000
npm run check      # typecheck + eslint + prettier
npm run build      # production build (tamamen statik)
```

Node.js ≥ 20.9 gerekir. Vercel'e ek ayar olmadan deploy edilir.

## İçerik nasıl güncellenir?

Bileşenlere dokunmadan, tüm metinler `src/content/` altında:

| Dosya           | İçerik                                                                |
| --------------- | --------------------------------------------------------------------- |
| `site.ts`       | isim, unvan, tanıtım cümlesi, iletişim, sosyal linkler, özgeçmiş yolu |
| `about.ts`      | hakkımda metni, istatistikler, yaklaşım maddeleri                     |
| `apps.ts`       | öne çıkan 4 uygulama ve tüm katalog (App Store linkleri, kısa adlar)  |
| `experience.ts` | iş deneyimi, eğitim, sertifikalar (işveren adı bilinçli olarak yok)   |
| `stack.ts`      | yetkinlik grupları ve kayan yazı bandı                                |

Özgeçmiş `public/Sencer-Gok-CV.pdf` olarak sunulur; güncellemek için dosyayı değiştirmek yeterli.

Yeni bir öne çıkan uygulama eklemek için `featuredApps`'e kayıt ekleyip `components/mocks/AppMocks.tsx` içinde bir görsel
bileşeni yazmak ve `Apps.tsx`'teki `VISUALS` tablosuna bağlamak yeterli.

### Fotoğrafı değiştirmek

Portre; hakkımda kartı, OG görseli ve profil rozeti için tek bir fotoğraftan üretilir:

```bash
pip install "rembg[cpu]" pillow numpy
python scripts/build-portrait-assets.py yeni-foto.jpg
```

Kare, omuz hizası bir fotoğraf ve ≥1000px çözünürlük önerilir (mevcut kaynak CV'deki 401px fotoğraf).
`--clean-sencer-2025` bayrağı yalnızca mevcut fotoğraf için elle ayarlanmış temizliği uygular.

## Mimari notlar

```
src/
├── app/             layout (font, metadata, JSON-LD), page, OG/ikon/sitemap/robots
├── content/         tüm metin ve veri (tek doğruluk kaynağı)
├── components/
│   ├── layout/      Nav (aktif bölüm, mobil menü), SmoothScroll (Lenis, bölüm snap, MotionConfig)
│   ├── sections/    Hero, About, Principles, Apps (giriş, kartlar, katalog), Experience, Stack, Contact
│   ├── mocks/       uygulama UI mock'ları (CSS ile, görselsiz)
│   └── ui/          Section, ScaleToFit, Reveal/SplitText/Magnetic/Counter, PhoneFrame, AppGlyph, ikonlar
└── scene/
    ├── shapes.ts        deterministik nokta bulutları (yörünge halkaları, parça kimlikli iPhone)
    ├── shapes.worker.ts şekilleri Web Worker'da üretir (typed array transfer)
    ├── shaders.ts       morph, dönen halkalar ve izler, telefon animasyonları, imleç etkileşimi (tek draw call)
    ├── orbit.ts         yörünge geometrisi; shader ve ikon mesh'leri aynı hesabı paylaşır
    ├── AppOrbit.tsx     15 ikon karosu (bevel'li extrude, clearcoat), hover ile yakalama, scroll ile çekirdeğe çekilme
    ├── iconTextures.ts  ikon dokuları: uygulama renkleri + lucide glifi, canvas'a Path2D ile çizilir
    ├── director.ts      DOM'daki `data-scene` çapalarından scroll'a bağlı sahne durumu
    ├── ParticleCanvas   R3F canvas, stüdyo ışığı (RoomEnvironment PMREM), adaptif kalite, görünmezken render durdurma
    └── SceneLayer       lazy-load, WebGL tespiti, CSS fallback
```

- **Ekrana oturan bölümler.** Her bölüm `Section` bileşeniyle en az bir ekran yüksekliğindedir; başlık, metin ve
  boşluklar hem genişliğe hem yüksekliğe göre (`min(vw, svh)`) ölçeklenir. Tek ekrana sığmayan içerikler ekranın
  boyutuna göre biçim değiştirir: katalog mobilde ikon ızgarası, deneyim mobil ve tablette kaydırmalı kartlar,
  yetkinlikler sekmeler. Mock'lar `ScaleToFit` ile kartın içine ölçeklenir. `short`/`tall`/`xtall` Tailwind
  varyantları ekran yüksekliğine göre ikincil içerikleri açıp kapatır. 375×667 (iPhone SE) ile 1920×1080 arasındaki
  yaygın ekranlarda her bölümün tek ekrana sığdığı otomatik olarak test edilmiştir; daha küçük ekranlarda bölümler
  taşmak yerine uzar.
- **Bölüm snap.** Fare ve trackpad için `lenis/snap` (yakınlık tabanlı, bölümün başı ve sonu), dokunmatik cihazlarda
  native CSS scroll-snap kullanılır; Lenis bir çapa linkine animasyonla giderken CSS snap geçici olarak kapanır.
- **Sahne koreografisi deklaratif.** Bölümler `data-scene="apps"` gibi çapalar bırakır; `SceneDirector` hangi çapanın
  ekranın ortasında olduğuna göre durumu (şekil, konum, ölçek, parlaklık) enterpolasyonla hesaplar.
- **Performans.**
  - three.js ana bundle'da değil (`next/dynamic`, `ssr: false`); nokta bulutları Web Worker'da üretilir. Tüm animasyon
    GPU'da, kare başına sıfır allocation.
  - Adaptif kalite: kare süresi sürekli ölçülür; yavaşlık sürerse önce DPR (1.5 → 1.25 → 1), sonra çizilen parçacık
    sayısı kademeli düşer. Sahne sönükken daha az, tamamen söndüğünde hiç çizilmez.
  - Hero ikonları yalnızca hero görünürken çizilir (15 mesh, ortak geometri). Kenar yumuşatma (MSAA) sadece düşük piksel
    yoğunluklu ekranlarda açılır; retina ekranlarda ve telefonlarda fark edilmediği için kapalıdır.
  - Canlı WebGL tuvalinin üstünde `backdrop-filter` ve `filter: blur` animasyonu kullanılmaz; reveal animasyonları
    yalnızca `transform` ve `opacity` kullanır.
- **Erişilebilirlik.** Semantik başlık hiyerarşisi, "içeriğe geç" linki, klavye odak stilleri, animasyonlu metinlerde
  ekran okuyucu için düz metin, sekmeler için ARIA rolleri, `prefers-reduced-motion` desteği.

## Lisanslar

`assets/fonts/` altındaki Geist ve Playfair Display fontları SIL Open Font License 1.1 ile dağıtılır ve yalnızca
OG görseli/ikon üretiminde kullanılır.

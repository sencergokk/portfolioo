# sencergok.com — Portfolyo

Sencer Gök'ün kişisel portfolyosu: **Next.js 16 + Three.js** ile yazılmış, tek sayfalık, karanlık temalı bir site.
Sayfanın merkezinde, scroll ile şekil değiştiren GPU tabanlı bir parçacık sahnesi var:

**portre → iPhone ana ekranı → galaksi**

- **Hero** — fotoğraftan örneklenen ~30K parçacıklık 3B portre; parçacıklar hafifçe parlar, portrenin üzerinden periyodik
  bir ışık taraması geçer, imleç parçacıkları iter ve sahne scroll hızına tepki verir.
- **Uygulamalar** — parçacıklar bir iPhone silüetine dönüşür (ikon renkleri uygulamaların renkleri). Ardından 4 öne çıkan
  uygulama yapışkan, üst üste binen kartlarda; her biri için elle kurulmuş, görselsiz UI mock'ları ve Halı Saha
  Tycoon'un gerçek mağaza ekranları. Altında 14 uygulamalık katalog ve imleci takip eden ikon önizlemesi.
- **İletişim** — parçacıklar dönen bir galaksiye dönüşür.

## Teknoloji

| Katman    | Seçim                                                                        |
| --------- | ---------------------------------------------------------------------------- |
| Framework | Next.js 16 (App Router, Turbopack), React 19, TypeScript (strict)            |
| 3B        | three.js + @react-three/fiber, özel GLSL vertex/fragment shader              |
| Animasyon | motion (Framer Motion), Lenis (smooth scroll)                                |
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
| `site.ts`       | isim, unvan, iletişim, sosyal linkler, özgeçmiş yolu                  |
| `about.ts`      | hakkımda metni, istatistikler (uygulama sayısı katalogdan hesaplanır) |
| `apps.ts`       | öne çıkan 4 uygulama + tüm katalog (App Store linkleri)               |
| `experience.ts` | iş deneyimi, eğitim, sertifikalar (işveren adı bilinçli olarak yok)   |
| `stack.ts`      | yetkinlik grupları ve kayan yazı bandı                                |

Özgeçmiş `public/Sencer-Gok-CV.pdf` olarak sunulur; güncellemek için dosyayı değiştirmek yeterli.

Yeni bir öne çıkan uygulama eklemek için `featuredApps`'e kayıt ekleyip `components/mocks/AppMocks.tsx` içinde bir görsel
bileşeni yazmak ve `Apps.tsx`'teki `VISUALS` tablosuna bağlamak yeterli.

### Fotoğrafı değiştirmek

Portre; hakkımda kartı, OG görseli ve 3B parçacık haritası için tek bir fotoğraftan üretilir:

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
│   ├── layout/      Nav (aktif bölüm, mobil menü), SmoothScroll (Lenis + MotionConfig)
│   ├── sections/    Hero, About, Apps, Experience, Stack, Contact
│   ├── mocks/       uygulama UI mock'ları (CSS ile, görselsiz)
│   └── ui/          Reveal/SplitText/Magnetic/Counter, PhoneFrame, AppGlyph, ikonlar
└── scene/
    ├── shapes.ts        deterministik nokta bulutları (portre, telefon, galaksi)
    ├── shapes.worker.ts şekilleri Web Worker'da üretir (typed array transfer)
    ├── shaders.ts       morph + girdap + imleç etkileşimi (tek draw call)
    ├── director.ts      DOM'daki `data-scene` çapalarından scroll'a bağlı sahne durumu
    ├── ParticleCanvas   R3F canvas, adaptif kalite (DPR + parçacık bütçesi)
    └── SceneLayer       lazy-load, WebGL tespiti, CSS fallback
```

- **Sahne koreografisi deklaratif.** Bölümler `data-scene="apps"` gibi çapalar bırakır; `SceneDirector` hangi çapanın
  ekranın ortasında olduğuna göre durumu (şekil, konum, ölçek, parlaklık) enterpolasyonla hesaplar. Bölüm sırası
  değişse bile WebGL koduna dokunmak gerekmez.
- **Performans.**
  - three.js ana bundle'da değil (`next/dynamic`, `ssr: false`); nokta bulutları Web Worker'da üretilir, ana thread
    hiç bloklanmaz. Tüm animasyon GPU'da, kare başına sıfır allocation.
  - Adaptif kalite: kare süresi sürekli ölçülür; yavaşlık sürerse önce DPR (1.5 → 1.25 → 1), sonra çizilen parçacık
    sayısı kademeli düşer. Sahne içeriğin arkasında sönükken zaten daha az parçacık çizilir.
  - Canlı WebGL tuvalinin üstünde `backdrop-filter` ve `filter: blur` animasyonu kullanılmaz (her karede yeniden
    hesaplanırlar); reveal animasyonları yalnızca `transform` + `opacity`.
  - Mobilde ve ≤4 çekirdekli cihazlarda parçacık sayısı yarıya iner. WebGL yoksa sayfa CSS arka planıyla tam çalışır.
- **Erişilebilirlik.** Semantik başlık hiyerarşisi, "içeriğe geç" linki, klavye odak stilleri, animasyonlu metinlerde
  ekran okuyucu için düz metin, `prefers-reduced-motion` desteği (Lenis, motion ve shader zamanı durur).

## Lisanslar

`assets/fonts/` altındaki Geist ve Playfair Display fontları SIL Open Font License 1.1 ile dağıtılır ve yalnızca
OG görseli/ikon üretiminde kullanılır.

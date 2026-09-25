/**
 * Single source of truth for personal/profile content.
 * Everything rendered on the page reads from `src/content/*` — edit here, not in components.
 */

export const site = {
  url: "https://sencergok.com",
  name: "Sencer Gök",
  firstName: "Sencer",
  lastName: "Gök",
  role: "Full-Stack & iOS Geliştirici",
  title: "Sencer Gök | Full-Stack & iOS Geliştirici",
  description:
    "Ankara'da yaşayan full-stack ve iOS geliştirici. Java, Spring Boot ve Next.js ile kurumsal yazılımlar geliştiriyor, SwiftUI ile kendi uygulamalarını App Store'da yayınlıyor.",
  intro:
    "Java ve Spring Boot ile sağlam backend servisleri, Next.js ile hızlı web arayüzleri ve SwiftUI ile App Store'da yaşayan iOS uygulamaları geliştiriyorum.",
  locale: "tr_TR",
  location: "Ankara, Türkiye",
  timeZone: "Europe/Istanbul",
  email: "sencergok@outlook.com",
  resume: "/Sencer-Gok-CV.pdf",
  availability: "Yeni projelere açık",
  focus: "Java · Next.js · SwiftUI",
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

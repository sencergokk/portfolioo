import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono, Instrument_Serif } from "next/font/google";
import { SmoothScroll } from "@/components/layout/SmoothScroll";
import { site, socials } from "@/content/site";
import "./globals.css";

const geist = Geist({
  variable: "--font-geist",
  subsets: ["latin", "latin-ext"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin", "latin-ext"],
  display: "swap",
});

const instrument = Instrument_Serif({
  variable: "--font-instrument",
  weight: "400",
  style: ["normal", "italic"],
  subsets: ["latin", "latin-ext"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: { default: site.title, template: `%s · ${site.name}` },
  description: site.description,
  applicationName: site.name,
  authors: [{ name: site.name, url: site.url }],
  creator: site.name,
  keywords: [
    "Sencer Gök",
    "yazılım mühendisi",
    "iOS geliştirici",
    "SwiftUI",
    "Next.js",
    "Spring Boot",
    "mobil uygulama",
    "App Store",
    "Ankara",
  ],
  alternates: { canonical: "/" },
  openGraph: {
    type: "profile",
    locale: site.locale,
    url: site.url,
    siteName: site.name,
    title: site.title,
    description: site.description,
    firstName: site.firstName,
    lastName: site.lastName,
  },
  twitter: {
    card: "summary_large_image",
    title: site.title,
    description: site.description,
    creator: socials.x.handle,
  },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: "#070708",
  colorScheme: "dark",
};

const personJsonLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: site.name,
  url: site.url,
  image: `${site.url}${site.photo.full}`,
  jobTitle: site.currentRole.title,
  worksFor: { "@type": "Organization", name: "TEKNOPAR Endüstriyel Otomasyon" },
  alumniOf: { "@type": "CollegeOrUniversity", name: "Başkent Üniversitesi" },
  address: { "@type": "PostalAddress", addressLocality: "Ankara", addressCountry: "TR" },
  email: `mailto:${site.email}`,
  sameAs: [socials.github.href, socials.linkedin.href, socials.x.href, socials.appStore.href],
  knowsAbout: ["SwiftUI", "iOS", "Next.js", "React", "TypeScript", "Java", "Spring Boot", "Supabase"],
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="tr" className={`${geist.variable} ${geistMono.variable} ${instrument.variable}`}>
      <body className="grain min-h-dvh">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(personJsonLd).replace(/</g, "\\u003c") }}
        />
        <a
          href="#icerik"
          className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[100] focus:rounded-full focus:bg-fg focus:px-4 focus:py-2 focus:text-sm focus:text-bg"
        >
          İçeriğe geç
        </a>
        <SmoothScroll>{children}</SmoothScroll>
      </body>
    </html>
  );
}

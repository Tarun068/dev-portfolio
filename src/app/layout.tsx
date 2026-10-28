import type { Metadata, Viewport } from "next";
import { Cursor } from "@/components/cursor";
import { IntroLoader, introSkipScript } from "@/components/intro-loader";
import { Providers } from "@/components/providers";
import { SiteHeader } from "@/components/site-header";
import { SmoothScroll } from "@/components/smooth-scroll";
import { site } from "@/content/site";
import "lenis/dist/lenis.css";
import "./globals.css";

// The client's Adobe Fonts web project: Futura PT (Light 300 … Heavy 800) and Skia (used for the
// Bio notes). Served by Adobe under the client's licence; families are set in globals.css.
const ADOBE_FONTS_KIT = "https://use.typekit.net/xks4ram.css";

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: `${site.name} — ${site.taglines[0]}`,
    template: `%s — ${site.name}`,
  },
  description: site.description,
  keywords: ["video editor", "motion graphics", "Toronto", "film editor", "music videos", "colour grading", site.name],
  authors: [{ name: site.name }],
  creator: site.name,
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: "en_CA",
    siteName: site.name,
    title: `${site.name} — ${site.taglines[0]}`,
    description: site.description,
    url: "/",
  },
  twitter: {
    card: "summary_large_image",
    title: `${site.name} — ${site.taglines[0]}`,
    description: site.description,
  },
};

export const viewport: Viewport = {
  themeColor: "#fafafa",
};

export default function RootLayout({ children, modal }: LayoutProps<"/">) {
  return (
    <html lang="en" className="antialiased" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://use.typekit.net" crossOrigin="anonymous" />
        <link rel="preconnect" href="https://p.typekit.net" crossOrigin="anonymous" />
        <link rel="stylesheet" href={ADOBE_FONTS_KIT} />
        <script dangerouslySetInnerHTML={{ __html: introSkipScript }} />
        <noscript>
          <style>{"[data-intro]{display:none}"}</style>
        </noscript>
      </head>
      <body className="flex min-h-svh flex-col overflow-x-clip">
        <Providers>
          <SmoothScroll />
          <a
            href="#content"
            className="fixed left-4 top-4 z-[95] -translate-y-24 bg-ink px-4 py-2 text-paper transition-transform focus:translate-y-0"
          >
            Skip to content
          </a>
          <SiteHeader />
          <main id="content" className="flex flex-1 flex-col">
            {children}
          </main>
          {modal}
          <IntroLoader />
          <Cursor />
        </Providers>
      </body>
    </html>
  );
}

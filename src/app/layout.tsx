import type { Metadata, Viewport } from "next";
import { Caveat, Jost } from "next/font/google";
import { Cursor } from "@/components/cursor";
import { IntroLoader, introSkipScript } from "@/components/intro-loader";
import { PageCurtain } from "@/components/page-curtain";
import { Providers } from "@/components/providers";
import { SiteHeader } from "@/components/site-header";
import { site } from "@/content/site";
import "./globals.css";

// Stand-in for Futura PT (see globals.css). To switch, load the licensed files with
// next/font/local and keep the same CSS variable name.
const futura = Jost({
  variable: "--font-futura",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
});

const handwriting = Caveat({
  variable: "--font-handwriting",
  subsets: ["latin"],
  weight: ["500"],
});

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
    <html lang="en" className={`${futura.variable} ${handwriting.variable} antialiased`} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: introSkipScript }} />
        <noscript>
          <style>{"[data-intro]{display:none}"}</style>
        </noscript>
      </head>
      <body className="flex min-h-svh flex-col overflow-x-clip">
        <Providers>
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
          <PageCurtain />
          <IntroLoader />
          <Cursor />
        </Providers>
      </body>
    </html>
  );
}

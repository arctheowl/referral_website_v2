import type { Metadata } from "next";
import { Inter, IBM_Plex_Sans, IBM_Plex_Mono } from "next/font/google";
import { Geist_Mono } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { ThemeProvider } from "@/providers/theme-provider";
import { DesignProvider } from "@/providers/design-provider";
import { DesignSwitcher } from "@/components/ui/design-switcher";
import { seoDefaults } from "@/data/site-data";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

const ibmPlexSans = IBM_Plex_Sans({
  variable: "--font-ibm-plex-sans",
  subsets: ["latin"],
  weight: ["300", "400", "600"],
  display: "swap",
});

const ibmPlexMono = IBM_Plex_Mono({
  variable: "--font-ibm-plex-mono",
  subsets: ["latin"],
  weight: ["400"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: seoDefaults.title,
    template: `%s — ${seoDefaults.siteName}`,
  },
  description: seoDefaults.description,
  metadataBase: new URL(seoDefaults.url),
  openGraph: {
    type: "website",
    siteName: seoDefaults.siteName,
    url: seoDefaults.url,
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${geistMono.variable} ${ibmPlexSans.variable} ${ibmPlexMono.variable}`}
      suppressHydrationWarning
    >
      <head>
        {/*
          Runs synchronously before React hydrates.
          Sets theme (dark/light) and design (design-ibm) classes on <html>
          to eliminate any flash of wrong theme or design on first paint.
        */}
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{
              var t=localStorage.getItem('theme');
              var dark=t?t==='dark':window.matchMedia('(prefers-color-scheme: dark)').matches;
              document.documentElement.classList.add(dark?'dark':'light');
              if(localStorage.getItem('design')==='ibm'){
                document.documentElement.classList.add('design-ibm');
              }
            }catch(e){}})();`,
          }}
        />
      </head>
      <body className="flex flex-col min-h-screen bg-bg text-fg antialiased pb-9">
        <DesignProvider>
          <ThemeProvider>
            <Header />
            <main className="flex-1">{children}</main>
            <Footer />
            <DesignSwitcher />
          </ThemeProvider>
        </DesignProvider>
      </body>
    </html>
  );
}

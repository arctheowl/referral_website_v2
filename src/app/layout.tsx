import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Geist_Mono } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { ThemeProvider } from "@/providers/theme-provider";
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
      className={`${inter.variable} ${geistMono.variable}`}
      suppressHydrationWarning
    >
      <head>
        {/* Runs before React hydrates to set theme class and avoid flash */}
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var s=localStorage.getItem('theme');var prefersDark=window.matchMedia('(prefers-color-scheme: dark)').matches;var dark=s?s==='dark':prefersDark;document.documentElement.classList.add(dark?'dark':'light');}catch(e){}})();`,
          }}
        />
      </head>
      <body className="flex flex-col min-h-screen bg-bg text-fg antialiased">
        <ThemeProvider>
          <Header />
          <main className="flex-1">{children}</main>
          <Footer />
        </ThemeProvider>
      </body>
    </html>
  );
}

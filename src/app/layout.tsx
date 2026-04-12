import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Referral Program V2 - Mustard Seed",
  description: "Advanced referral system with waiting room and queue management",
  icons: {
    icon: "/MustardSeed_Primary-Logo.png",
    shortcut: "/MustardSeed_Primary-Logo.png",
    apple: "/MustardSeed_Primary-Logo.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <div className="min-h-screen">
          {children}
        </div>
      </body>
    </html>
  );
}
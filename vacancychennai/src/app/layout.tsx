import type { Metadata } from "next";
import { Geist_Mono, Noto_Sans_Tamil, Poppins } from "next/font/google";
import "./globals.css";
import { GoogleAnalytics } from "@/components/google-analytics";
import { PartnerOutboundAnalytics } from "@/components/partner-outbound-analytics";
import SiteFooter from "@/components/site-footer";
import SiteHeader from "@/components/site-header";
import { SITE_DEFAULT_DESCRIPTION } from "@/lib/home-seo-copy";

const poppins = Poppins({
  subsets: ["latin", "latin-ext"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-poppins",
  display: "swap",
});

const notoTamil = Noto_Sans_Tamil({
  subsets: ["tamil"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-noto-tamil",
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Vacancy Chennai",
  description: SITE_DEFAULT_DESCRIPTION,
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "https://vacancychennai.in"),
  alternates: {
    types: {
      "application/rss+xml": "/rss.xml",
    },
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
      className={`${poppins.variable} ${notoTamil.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full overflow-x-hidden bg-slate-50 font-sans text-slate-900 antialiased">
        <GoogleAnalytics />
        <PartnerOutboundAnalytics />
        <SiteHeader />
        <main className="mx-auto w-full max-w-6xl px-4 py-6">{children}</main>
        <SiteFooter />
      </body>
    </html>
  );
}

import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import SiteFooter from "@/components/site-footer";
import SiteHeader from "@/components/site-header";
import { SITE_DEFAULT_DESCRIPTION } from "@/lib/home-seo-copy";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Vacancy Chennai",
  description: SITE_DEFAULT_DESCRIPTION,
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "https://vacancychennai.in"),
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full overflow-x-hidden bg-slate-50 font-sans text-slate-900 antialiased">
        <SiteHeader />
        <main className="mx-auto w-full max-w-6xl px-4 py-6">{children}</main>
        <SiteFooter />
      </body>
    </html>
  );
}

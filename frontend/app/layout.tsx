import type { Metadata } from "next";
import { Geist, Geist_Mono, Noto_Sans_Thai } from "next/font/google";
import "./globals.css";
import { Suspense } from "react";
import { LanguageProvider } from "@/app/context/LanguageContext";
import { CurrencyProvider } from "@/app/context/CurrencyContext";
import HtmlLangSync from "@/components/layout/HtmlLangSync";
import ConditionalLayout from "@/components/layout/ConditionalLayout";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

const notoSansThai = Noto_Sans_Thai({
  variable: "--font-thai",
  subsets: ["thai", "latin"],
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://ideabyido.com"),
  title: {
    default: "IDEABYIDO — แฟชั่น & รับผลิตยูนิฟอร์ม",
    template: "%s | IDEABYIDO",
  },
  description:
    "IDEABYIDO — แบรนด์เสื้อผ้าแฟชั่นและโรงงานผลิตยูนิฟอร์มครบวงจร เน้นคุณภาพ ทันสมัย สะท้อนตัวตน รับผลิตเสื้อ กางเกง ชุดพนักงาน ทุกประเภท",
  keywords: [
    "ideabyido", "ido identity", "เสื้อผ้าแฟชั่น", "ยูนิฟอร์ม", "รับผลิตยูนิฟอร์ม",
    "ชุดพนักงาน", "เสื้อบริษัท", "uniform factory", "แฟชั่นไทย", "เสื้อผ้าออนไลน์",
  ],
  authors: [{ name: "IDEABYIDO" }],
  creator: "IDEABYIDO",
  robots: { index: true, follow: true, googleBot: { index: true, follow: true } },
  alternates: { canonical: "https://ideabyido.com" },
  openGraph: {
    type: "website",
    locale: "th_TH",
    url: "https://ideabyido.com",
    siteName: "IDEABYIDO",
    title: "IDEABYIDO — แฟชั่น & รับผลิตยูนิฟอร์ม",
    description: "แบรนด์เสื้อผ้าแฟชั่นและโรงงานผลิตยูนิฟอร์มครบวงจร คุณภาพสูง ราคาดี",
    images: [{ url: "/og-image.png", width: 1200, height: 630, alt: "IDEABYIDO" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "IDEABYIDO — แฟชั่น & รับผลิตยูนิฟอร์ม",
    description: "แบรนด์เสื้อผ้าแฟชั่นและโรงงานผลิตยูนิฟอร์มครบวงจร",
    images: ["/og-image.png"],
  },
};


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="th">
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${notoSansThai.variable} antialiased grow`}
      >
       <LanguageProvider>
         <HtmlLangSync />
         <CurrencyProvider>
           <Suspense fallback={<div className="h-16" />}>
             <ConditionalLayout>
               {children}
             </ConditionalLayout>
           </Suspense>
         </CurrencyProvider>
       </LanguageProvider>
      </body>
    </html>
  );
}

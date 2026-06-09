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
  title: "IDEABYIDO",
  description: "IDEABYIDO — A clothing brand focused on simplicity, modernity, and reflecting the wearer's identity.",
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

import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/layout/navbar";
import Footer from "@/components/layout/footer";
import { Suspense } from "react";
import { LanguageProvider } from "@/app/context/LanguageContext";
import { CurrencyProvider } from "@/app/context/CurrencyContext";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "IDOIDENTITY",
  description: "IDOIDENTITY — A clothing brand focused on simplicity, modernity, and reflecting the wearer's identity.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">

      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased grow`}
      >
       <LanguageProvider>
         <CurrencyProvider>
           <Suspense fallback={<div className="h-16" />}>
             <Navbar/>
           </Suspense>
           {children}
           <Footer/>
         </CurrencyProvider>
       </LanguageProvider>
      </body>
    </html>
  );
}


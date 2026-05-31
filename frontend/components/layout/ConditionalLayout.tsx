"use client";
import { usePathname } from "next/navigation";
import Navbar from "@/components/layout/navbar";
import Footer from "@/components/layout/footer";
import { Suspense } from "react";

export default function ConditionalLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isIdeaByIdo = pathname?.startsWith("/ideabyido");

  if (isIdeaByIdo) {
    // IDEABYIDO has its own layout/navbar/footer
    return <>{children}</>;
  }

  return (
    <>
      <Suspense fallback={<div className="h-16" />}>
        <Navbar />
      </Suspense>
      {children}
      <Footer />
    </>
  );
}

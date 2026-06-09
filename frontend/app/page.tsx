import type { Metadata } from "next";
import Hero_section from "@/components/sections/hero_section";

export const metadata: Metadata = {
  title: "IDEABYIDO — แฟชั่น & รับผลิตยูนิฟอร์ม",
  description:
    "IDEABYIDO — แบรนด์เสื้อผ้าแฟชั่นสไตล์มินิมอล และโรงงานรับผลิตยูนิฟอร์มครบวงจร เสื้อพนักงาน ชุดบริษัท ส่งทั่วไทย",
  alternates: { canonical: "https://ideabyido.com" },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "IDEABYIDO",
  url: "https://ideabyido.com",
  logo: "https://ideabyido.com/logo.png",
  description: "แบรนด์เสื้อผ้าแฟชั่นและโรงงานรับผลิตยูนิฟอร์มครบวงจร",
  address: {
    "@type": "PostalAddress",
    addressLocality: "กรุงเทพมหานคร",
    addressCountry: "TH",
  },
  sameAs: [],
};

export default function Home() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Hero_section />
    </>
  );
}

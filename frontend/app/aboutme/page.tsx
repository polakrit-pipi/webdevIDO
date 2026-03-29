"use client";
import Image from "next/image";
import { useLanguage } from "@/app/context/LanguageContext";

export default function AboutPage() {
  const { t } = useLanguage();
  return (
    <main className="mt-[7w] w-full bg-white text-black">
      <section className="w-full h-[420px]">
        <Image src="https://images.unsplash.com/photo-1441986300917-64674bd600d8" alt="Store Banner" className="w-full h-full object-cover" width={300} height={300} unoptimized />
      </section>
      <section className="max-w-4xl mx-auto py-20 px-6 text-center">
        <h2 className="text-3xl font-medium mb-6">{t("about.whoWeAre")}</h2>
        <p className="text-sm leading-7 mb-3">{t("about.intro1")}</p>
        <p className="text-sm leading-7">{t("about.intro2")}</p>
      </section>
      <section className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 items-center px-6 py-24">
        <div>
          <h3 className="text-2xl font-medium mb-6">Header</h3>
          <p className="text-sm mb-3"><strong>Detail -</strong> {t("about.detail1")}</p>
          <p className="text-sm mb-3"><strong>Detail -</strong> {t("about.detail2")}</p>
          <p className="text-sm leading-7">{t("about.detail3")}</p>
        </div>
        <div className="w-full h-[420px]">
          <img src="https://images.unsplash.com/photo-1521334884684-d80222895322" alt="Clothes Rack" className="w-full h-full object-cover rounded-md" />
        </div>
      </section>
      <section className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 items-center px-6 py-24">
        <div className="w-full h-[420px]">
          <img src="https://images.unsplash.com/photo-1503341455253-b2e723bb3dbb" alt="Model" className="w-full h-full object-cover rounded-md" />
        </div>
        <div>
          <h3 className="text-2xl font-medium mb-6">Header</h3>
          <p className="text-sm mb-3"><strong>Detail -</strong> {t("about.detail4")}</p>
          <p className="text-sm mb-3"><strong>Detail -</strong> {t("about.detail5")}</p>
          <p className="text-sm leading-7">{t("about.detail6")}</p>
        </div>
      </section>
    </main>
  );
}

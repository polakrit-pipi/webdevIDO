"use client";
import { useEffect, useState } from "react";
import Image from "next/image";
import Button from "../ui/button";
import { useLanguage } from "@/app/context/LanguageContext";

export default function Hero_section() {
  const [visible, setVisible] = useState(false);
  const [bannerUrl, setBannerUrl] = useState("");
  const { t } = useLanguage();

  useEffect(() => {
    setVisible(true);
    setBannerUrl("https://img.freepik.com/free-photo/shop-is-now-open_53876-15332.jpg");
  }, []);

  return (
    <section
      aria-labelledby="hero-title"
      className="w-full h-[60vh] sm:h-[50vw] md:h-[40vw] relative flex items-center justify-center mt-[7vw] min-h-[420px] bg-neutral-200 transition-all duration-700 overflow-hidden"
    >
      {bannerUrl && (
        <Image
          src={bannerUrl}
          alt=""
          aria-hidden="true"
          fill
          priority
          sizes="100vw"
          className="object-cover object-center z-0"
        />
      )}
      {/* Subtle scrim for legibility (kept on-theme: low-opacity black) */}
      <div className="absolute inset-0 bg-black/30 z-[1]" aria-hidden="true" />

      <div
        className={`text-center text-white flex flex-col items-center relative z-10 px-4 ${
          visible ? "opacity-100" : "opacity-0"
        } transition-opacity duration-1000`}
      >
        <p lang="en" className="text-base sm:text-xl md:text-[1.8vw] tracking-[0.2em] uppercase">
          Choose your
        </p>
        <h1
          id="hero-title"
          lang="en"
          className="text-5xl sm:text-7xl md:text-[6vw] font-bold mb-6 md:mb-[3vw] leading-[1.05] tracking-tight"
        >
          &ldquo;IDENTITY&rdquo;
        </h1>
        <div className="flex flex-wrap justify-center gap-4 md:gap-[4vw]">
          <Button
            bg="bg-neutral-900 border-1 border-black"
            text="text-white"
            hoverBg="hover:bg-purple-900"
            hoverText="hover:text-white"
            text_size="text-sm md:text-[1vw]"
            px="px-6 md:px-[2vw]"
            py="py-3 md:py-[1vh]"
            label={t("hero.buyNow")}
            link="/product"
          />
          <Button
            bg="bg-white border-1 border-black"
            text="text-black"
            hoverBg="hover:bg-purple-900"
            hoverText="hover:text-white"
            text_size="text-sm md:text-[1vw]"
            px="px-6 md:px-[2vw]"
            py="py-3 md:py-[1vh]"
            label={t("hero.aboutUs")}
            link="/aboutme"
          />
        </div>
      </div>
    </section>
  );
}

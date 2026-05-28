"use client";
import Image from "next/image";
import { useLanguage } from "@/app/context/LanguageContext";

export default function AboutPage() {
  const { t, locale } = useLanguage();
  const isThai = locale === "th";
  const bodyLeading = isThai ? "leading-[1.85]" : "leading-7";

  return (
    <main className="mt-[7vw] w-full bg-white text-black">
      <section className="w-full h-[60vw] max-h-[420px] min-h-[260px] relative">
        <Image
          src="https://images.unsplash.com/photo-1441986300917-64674bd600d8"
          alt=""
          aria-hidden="true"
          fill
          sizes="100vw"
          className="object-cover"
          unoptimized
        />
      </section>

      <section className="max-w-2xl mx-auto py-16 md:py-20 px-6 text-center">
        <h1 className="text-3xl md:text-4xl font-semibold mb-6 tracking-tight">
          {t("about.whoWeAre")}
        </h1>
        <p className={`text-base ${bodyLeading} mb-4 text-neutral-800`}>
          {t("about.intro1")}
        </p>
        <p className={`text-base ${bodyLeading} text-neutral-800`}>
          {t("about.intro2")}
        </p>
      </section>

      <section className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-12 items-center px-6 py-16 md:py-24">
        <div className="max-w-[34rem]">
          <h2 className="text-2xl md:text-3xl font-semibold mb-6 tracking-tight">
            {t("about.detail4")}
          </h2>
          <p className={`text-base ${bodyLeading} mb-3 text-neutral-800`}>
            <strong className="font-semibold">·</strong> {t("about.detail1")}
          </p>
          <p className={`text-base ${bodyLeading} mb-3 text-neutral-800`}>
            <strong className="font-semibold">·</strong> {t("about.detail2")}
          </p>
          <p className={`text-base ${bodyLeading} text-neutral-800`}>
            {t("about.detail3")}
          </p>
        </div>
        <div className="w-full aspect-[4/3] md:h-[420px] relative">
          <Image
            src="https://images.unsplash.com/photo-1521334884684-d80222895322"
            alt=""
            aria-hidden="true"
            fill
            sizes="(min-width: 768px) 50vw, 100vw"
            className="object-cover rounded-md"
            unoptimized
          />
        </div>
      </section>

      <section className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-12 items-center px-6 py-16 md:py-24">
        <div className="w-full aspect-[4/3] md:h-[420px] relative order-2 md:order-1">
          <Image
            src="https://images.unsplash.com/photo-1503341455253-b2e723bb3dbb"
            alt=""
            aria-hidden="true"
            fill
            sizes="(min-width: 768px) 50vw, 100vw"
            className="object-cover rounded-md"
            unoptimized
          />
        </div>
        <div className="max-w-[34rem] order-1 md:order-2">
          <h2 className="text-2xl md:text-3xl font-semibold mb-6 tracking-tight">
            {t("about.detail5")}
          </h2>
          <p className={`text-base ${bodyLeading} mb-3 text-neutral-800`}>
            <strong className="font-semibold">·</strong> {t("about.detail4")}
          </p>
          <p className={`text-base ${bodyLeading} mb-3 text-neutral-800`}>
            <strong className="font-semibold">·</strong> {t("about.detail5")}
          </p>
          <p className={`text-base ${bodyLeading} text-neutral-800`}>
            {t("about.detail6")}
          </p>
        </div>
      </section>
    </main>
  );
}

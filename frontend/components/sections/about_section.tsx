'use client';
import Image from "next/image";
import { useInView } from "@/lib/hooks/useInView";
import { useLanguage } from "@/app/context/LanguageContext";

export default function About_section() {
    const { ref, isVisible } = useInView();
    const { t, locale } = useLanguage();
    return (
        <section
            aria-labelledby="about-heading"
            ref={ref}
            className={`fade-section w-full px-4 md:px-[10vw] mb-[5vw] ${isVisible ? 'fade-section-visible' : ''}`}
        >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 items-center">
                <div className="relative w-full aspect-[16/10] overflow-hidden rounded-lg bg-neutral-100">
                    <Image
                        src='https://img.freepik.com/free-photo/shop-clothing-clothes-shop-hanger-modern-shop-boutique_1150-8886.jpg'
                        alt=""
                        aria-hidden="true"
                        fill
                        sizes="(min-width: 768px) 40vw, 100vw"
                        className="object-cover"
                    />
                </div>
                <div className="text-start text-black max-w-[34rem]">
                    <h2
                        id="about-heading"
                        className="text-3xl md:text-[2vw] font-bold mb-4 md:mb-[1vw] leading-tight tracking-tight"
                    >
                        {t("section.whoWeAre")}
                    </h2>
                    <p
                        lang={locale}
                        className={`text-base md:text-[1vw] text-neutral-700 ${locale === 'th' ? 'leading-[1.85]' : 'leading-relaxed'}`}
                    >
                        {t("section.whoWeAreDesc")}
                    </p>
                </div>
            </div>
        </section>
    );
}

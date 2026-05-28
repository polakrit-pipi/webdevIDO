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
            className={`fade-section w-full flex flex-col md:flex-row items-center justify-between pr-[10vw] mb-[5vw] ${isVisible ? 'fade-section-visible' : ''}`}
        >
            <Image
                src='https://img.freepik.com/free-photo/shop-clothing-clothes-shop-hanger-modern-shop-boutique_1150-8886.jpg'
                width={800}
                height={450}
                alt=""
                aria-hidden="true"
                className="bg-neutral-200 w-full md:w-auto"
            />
            <div className="text-start text-black p-4 md:p-[2vw] rounded-md">
                <h2
                    id="about-heading"
                    className="text-2xl md:text-[2vw] font-bold mb-2 md:mb-[1vw] leading-tight"
                >
                    {t("section.whoWeAre")}
                </h2>
                <p
                    lang={locale}
                    className={`text-base md:text-[1vw] max-w-3xl text-neutral-800 ${locale === 'th' ? 'leading-[1.85]' : 'leading-relaxed'}`}
                >
                    {t("section.whoWeAreDesc")}
                </p>
            </div>
        </section>
    );
}

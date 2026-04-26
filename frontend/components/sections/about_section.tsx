'use client';
import Image from "next/image";
import { useInView } from "@/lib/hooks/useInView";
import { useLanguage } from "@/app/context/LanguageContext";

export default function About_section() {
    const { ref, isVisible } = useInView();
    const { t } = useLanguage();
    return (
        <div className={`w-full h-fit flex items-center justify-between pr-[10vw] mb-[5vw] ${isVisible ? 'fade-section-visible' : ''}`} ref={ref}>
            <Image src='/about-section-bg.png' width={800} height={450} alt="about-section-bg" className="bg-neutral-200" />  
            <div className="text-start text-black bg-opacity-70 p-[2vw] rounded-md">
                <h2 className="text-[2vw] font-bold mb-[1vw]">{t("section.whoWeAre")}</h2>
                <p className="text-[1vw] max-w-3xl">{t("section.whoWeAreDesc")}</p>
            </div>
        </div>
    );
}
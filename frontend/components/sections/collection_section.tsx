'use client';
import Collection_Card from "../ui/collection_card";
import { useInView } from "@/lib/hooks/useInView";
import { useLanguage } from "@/app/context/LanguageContext";

export default function Collection_section() {
    const { ref, isVisible } = useInView();
    const { t } = useLanguage();
    return (
        <div className={`w-full h-fit flex my-[5vw] justify-center ${isVisible ? 'fade-section-visible' : ''}`} ref={ref}>
            <div className="text-center w-full">
                <h2 className="text-[2.5vw] font-bold mb-[3vw]">{t("section.collection")}</h2>
                <div className="w-full grid grid-cols-3 grid-rows-2 gap-[1vw]">
                    <Collection_Card /><Collection_Card /><Collection_Card />
                    <Collection_Card /><Collection_Card /><Collection_Card />
                </div>
            </div>
        </div>
    );
}
"use client";
import { useEffect, useState } from "react";
import Image from "next/image";
import Button from "../ui/button";
import { useLanguage } from "@/app/context/LanguageContext";

export default function Hero_section() {
  const [visible, setVisible] = useState(false);
  const [bannerUrl, setBannerUrl] = useState("");
  const { t } = useLanguage();

  const apiUrl = process.env.NEXT_PUBLIC_STRAPI_URL || "http://localhost:1337";

  useEffect(() => {
    setVisible(true);
    fetchBanner();
  }, []);

  const fetchBanner = async () => {
    try {
      const res = await fetch(`${apiUrl}/api/banner?populate=*`);
      const response = await res.json();
      const imageData = response.data?.Image;
      if (imageData && imageData.url) {
        setBannerUrl(`${apiUrl}${imageData.url}`);
      }
    } catch (error) {
      console.log("Error fetching banner: " + error);
    }
  };

  return (
    <div className="w-full h-[40vw] relative flex items-center justify-center mt-[7vw] bg-neutral-200 transition-all duration-700 overflow-hidden">
      {bannerUrl && (
        <Image src={bannerUrl} alt="Hero Banner" fill priority className="object-cover object-center z-0" sizes="100vw" />
      )}
      <div className={`text-center text-white flex flex-col items-center relative z-10 ${visible ? 'opacity-100' : 'opacity-0'} transition-opacity duration-1000`}>
        <p className="text-[1.8vw]">CHOOSE YOUR</p>
        <h1 className="text-[6vw] font-bold mb-[3vw]">&quot;IDENTITY&quot;</h1>
        <div className="flex justify-center gap-[4vw]">
          <Button bg="bg-neutral-900 border-1 border-black" text="text-white" hoverBg="hover:bg-purple-900" hoverText="hover:text-white" text_size="text-[1vw]" px="px-[2vw]" py="py-[1vh]" label={t("hero.buyNow")} link="/product" />
          <Button bg="bg-white border-1 border-black" text="text-black" hoverBg="hover:bg-purple-900" hoverText="hover:text-white" text_size="text-[1vw]" px="px-[2vw]" py="py-[1vh]" label={t("hero.aboutUs")} link="/aboutme" />
        </div>
      </div>
    </div>
  );
}
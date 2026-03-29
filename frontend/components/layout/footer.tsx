"use client";

import Image from "next/image";
import { useState } from "react";
import { useLanguage } from "@/app/context/LanguageContext";

export default function Footer() {
  const [email, setEmail] = useState("");
  const [consent, setConsent] = useState(false);
  const [loading, setLoading] = useState(false);
  const { t } = useLanguage();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email) return alert(t("footer.alertEmail"));
    if (!consent) return alert(t("footer.alertConsent"));

    setLoading(true);
    await new Promise((r) => setTimeout(r, 1000));

    alert(t("footer.alertSuccess"));
    setEmail("");
    setConsent(false);
    setLoading(false);
  };

  return (
    <>
      {/* NEWSLETTER */}
      <div className="bg-[#F3D7FF] text-[#5F4B8B] py-12">
        <div className="max-w-7xl mx-auto md:max-w-[68vw] flex flex-col md:flex-row gap-8 justify-between px-4">
          <div>
            <p className="text-2xl md:text-[2.5vw] font-bold">{t("footer.register")}</p>
            <p className="text-4xl md:text-[4vw] font-bold">{t("footer.newsletter")}</p>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-2">
            <p className="text-sm md:text-[1vw]">{t("footer.subscribe")}</p>
            <p className="text-lg md:text-[1.8vw] font-bold">
              {t("footer.specialOffer")}
            </p>

            <div className="flex">
              <input
                type="email"
                placeholder={t("footer.emailPlaceholder")}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full md:w-[25vw] h-12 md:h-[3vw] px-4 text-sm md:text-[1vw] bg-white outline-none"
              />
              <button
                type="submit"
                disabled={loading}
                className="px-4 bg-[#5F4B8B] hover:bg-[#7b66a7] transition disabled:opacity-50"
              >
                <Image src="/arrow.png" width={20} height={20} alt="submit" />
              </button>
            </div>

            <label className="flex items-center gap-2 mt-2 cursor-pointer">
              <input
                type="checkbox"
                checked={consent}
                onChange={(e) => setConsent(e.target.checked)}
                className="w-4 h-4 accent-blue-600"
              />
              <span className="text-sm md:text-[0.9vw] text-gray-700">
                {t("footer.consent")}
              </span>
            </label>
          </form>
        </div>
      </div>

      {/* BOTTOM FOOTER */}
      <div className="bg-[#362B3F]">
        <div className="max-w-7xl mx-auto md:max-w-[68vw] grid grid-cols-1 md:grid-cols-3 gap-8 py-10 px-4 text-white text-sm md:text-[0.9vw]">
          <div>
            <p className="font-bold mb-2">{t("footer.help")}</p>
            <a href="#">{t("footer.contactUs")}</a><br />
            <a href="#">{t("footer.faq")}</a><br />
            <a href="#">{t("footer.productChart")}</a><br />
            <a href="#">{t("footer.returnPolicy")}</a>
          </div>

          <div>
            <p className="font-bold mb-2">{t("footer.aboutUs")}</p>
            <a href="#">{t("footer.aboutUsLink")}</a><br />
            <a href="#">{t("footer.terms")}</a><br />
            <a href="#">{t("footer.privacy")}</a>
          </div>

          <div>
            <p className="font-bold mb-2">{t("footer.followUs")}</p>
            <div className="flex gap-4">
              {["instagram", "facebook", "line"].map((s) => (
                <Image
                  key={s}
                  src={`/${s}-icon.png`}
                  width={24}
                  height={24}
                  alt={s}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

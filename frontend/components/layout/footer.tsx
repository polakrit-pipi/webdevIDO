"use client";

import Image from "next/image";
import { useId, useState } from "react";
import { useLanguage } from "@/app/context/LanguageContext";

type Status = "idle" | "loading" | "success" | "error";

export default function Footer() {
  const [email, setEmail] = useState("");
  const [consent, setConsent] = useState(false);
  const [status, setStatus] = useState<Status>("idle");
  const [errorMsg, setErrorMsg] = useState("");
  const { t } = useLanguage();

  const emailId = useId();
  const consentId = useId();
  const statusId = useId();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email) {
      setStatus("error");
      setErrorMsg(t("footer.alertEmail"));
      return;
    }
    if (!consent) {
      setStatus("error");
      setErrorMsg(t("footer.alertConsent"));
      return;
    }

    setStatus("loading");
    setErrorMsg("");
    await new Promise((r) => setTimeout(r, 1000));

    setStatus("success");
    setEmail("");
    setConsent(false);
  };

  return (
    <>
      {/* NEWSLETTER */}
      <section aria-labelledby="newsletter-heading" className="bg-[#F3D7FF] text-[#5F4B8B] py-12">
        <div className="max-w-7xl mx-auto md:max-w-[68vw] flex flex-col md:flex-row gap-8 justify-between px-4">
          <div>
            <p className="text-2xl md:text-[2.5vw] font-bold leading-tight">{t("footer.register")}</p>
            <h2 id="newsletter-heading" className="text-4xl md:text-[4vw] font-bold leading-tight">{t("footer.newsletter")}</h2>
          </div>

          <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-2 w-full md:w-auto">
            <label htmlFor={emailId} className="text-sm md:text-[1vw]">{t("footer.subscribe")}</label>
            <p className="text-lg md:text-[1.8vw] font-bold leading-tight">
              {t("footer.specialOffer")}
            </p>

            <div className="flex">
              <input
                id={emailId}
                name="email"
                type="email"
                inputMode="email"
                autoComplete="email"
                placeholder={t("footer.emailPlaceholder")}
                value={email}
                onChange={(e) => { setEmail(e.target.value); if (status === "error") setStatus("idle"); }}
                aria-invalid={status === "error"}
                aria-describedby={statusId}
                className="w-full md:w-[25vw] h-12 md:h-[3vw] min-h-[44px] px-4 text-base md:text-[1vw] bg-white outline-none focus-visible:ring-2 focus-visible:ring-[#5F4B8B] focus-visible:ring-inset"
                required
              />
              <button
                type="submit"
                disabled={status === "loading"}
                aria-label={t("footer.subscribe")}
                className="px-4 min-w-[48px] bg-[#5F4B8B] hover:bg-[#7b66a7] transition disabled:opacity-50 disabled:cursor-not-allowed focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#5F4B8B]"
              >
                {status === "loading" ? (
                  <span className="block w-5 h-5 border-2 border-white/40 border-t-white rounded-full animate-spin" aria-hidden="true" />
                ) : (
                  <Image src="/arrow.png" width={20} height={20} alt="" aria-hidden="true" />
                )}
              </button>
            </div>

            <label htmlFor={consentId} className="flex items-center gap-2 mt-2 cursor-pointer">
              <input
                id={consentId}
                type="checkbox"
                checked={consent}
                onChange={(e) => setConsent(e.target.checked)}
                className="w-4 h-4 accent-[#5F4B8B] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#5F4B8B]"
              />
              <span className="text-sm md:text-[0.9vw] text-gray-700">
                {t("footer.consent")}
              </span>
            </label>

            <p
              id={statusId}
              role="status"
              aria-live="polite"
              className={`text-sm md:text-[0.85vw] mt-1 min-h-[1.25rem] ${
                status === "error" ? "text-red-700" : status === "success" ? "text-[#3d2f5c]" : "text-transparent"
              }`}
            >
              {status === "error" ? errorMsg : status === "success" ? t("footer.alertSuccess") : "."}
            </p>
          </form>
        </div>
      </section>

      {/* BOTTOM FOOTER */}
      <footer className="bg-[#362B3F]">
        <div className="max-w-7xl mx-auto md:max-w-[68vw] grid grid-cols-1 md:grid-cols-3 gap-8 py-10 px-4 text-white text-sm md:text-[0.9vw]">
          <nav aria-label={t("footer.help")}>
            <p className="font-bold mb-2">{t("footer.help")}</p>
            <ul className="space-y-1">
              <li><a href="#" className="hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white rounded-sm">{t("footer.contactUs")}</a></li>
              <li><a href="#" className="hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white rounded-sm">{t("footer.faq")}</a></li>
              <li><a href="#" className="hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white rounded-sm">{t("footer.productChart")}</a></li>
              <li><a href="#" className="hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white rounded-sm">{t("footer.returnPolicy")}</a></li>
            </ul>
          </nav>

          <nav aria-label={t("footer.aboutUs")}>
            <p className="font-bold mb-2">{t("footer.aboutUs")}</p>
            <ul className="space-y-1">
              <li><a href="#" className="hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white rounded-sm">{t("footer.aboutUsLink")}</a></li>
              <li><a href="#" className="hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white rounded-sm">{t("footer.terms")}</a></li>
              <li><a href="#" className="hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white rounded-sm">{t("footer.privacy")}</a></li>
            </ul>
          </nav>

          <div>
            <p className="font-bold mb-2">{t("footer.followUs")}</p>
            <ul className="flex gap-4">
              {(["instagram", "facebook", "line"] as const).map((s) => (
                <li key={s}>
                  <a
                    href="#"
                    aria-label={s.charAt(0).toUpperCase() + s.slice(1)}
                    className="inline-flex items-center justify-center min-w-[44px] min-h-[44px] hover:opacity-70 transition-opacity focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white rounded-sm"
                  >
                    <Image src={`/${s}-icon.png`} width={24} height={24} alt="" aria-hidden="true" />
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </footer>
    </>
  );
}

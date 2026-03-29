"use client";

import { useLanguage } from "@/app/context/LanguageContext";

interface ProfileHeaderProps {
  onLogout: () => void;
}

export default function ProfileHeader({ onLogout }: ProfileHeaderProps) {
  const { t } = useLanguage();

  return (
    <div className="mb-12">
      <button
        onClick={onLogout}
        className="text-gray-400 hover:text-black text-sm mb-4 transition-colors"
      >
        {t("account.logout")}
      </button>
      <h1 className="text-[2.5rem] font-normal mb-2">{t("account.title")}</h1>
      <p className="text-gray-500">
        {t("account.subtitle")}
      </p>
    </div>
  );
}
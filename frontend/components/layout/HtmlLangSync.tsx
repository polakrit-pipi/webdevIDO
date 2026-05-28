"use client";

import { useEffect } from "react";
import { useLanguage } from "@/app/context/LanguageContext";

export default function HtmlLangSync() {
  const { locale } = useLanguage();

  useEffect(() => {
    if (typeof document !== "undefined") {
      document.documentElement.lang = locale;
    }
  }, [locale]);

  return null;
}

"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import th from "../../locales/th";
import en from "../../locales/en";

type Locale = "th" | "en";
type Translations = typeof th;

interface LanguageContextType {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

const dictionaries: Record<Locale, Translations> = { th, en };

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>("th");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem("locale") as Locale | null;
    if (saved && (saved === "th" || saved === "en")) {
      setLocaleState(saved);
    }
    setMounted(true);
  }, []);

  const setLocale = (newLocale: Locale) => {
    setLocaleState(newLocale);
    localStorage.setItem("locale", newLocale);
  };

  const t = (key: string): string => {
    const dict = dictionaries[locale] as Record<string, string>;
    return dict[key] || key;
  };

  if (!mounted) {
    const t = (key: string): string => {
      const dict = dictionaries["th"] as Record<string, string>;
      return dict[key] || key;
    };
    return (
      <LanguageContext.Provider value={{ locale: "th", setLocale, t }}>
        {children}
      </LanguageContext.Provider>
    );
  }

  return (
    <LanguageContext.Provider value={{ locale, setLocale, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
}

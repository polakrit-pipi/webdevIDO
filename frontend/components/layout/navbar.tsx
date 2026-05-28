"use client";
import Image from "next/image";
import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Search from "./Search";
import { useLanguage } from "@/app/context/LanguageContext";
import { useCurrency } from "@/app/context/CurrencyContext";

function CurrencySwitcher() {
  const { currency, setCurrency } = useCurrency();
  const [isOpen, setIsOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    }
    function handleEscape(e: KeyboardEvent) {
      if (e.key === "Escape") setIsOpen(false);
    }
    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEscape);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscape);
    };
  }, []);

  const currencies: ("THB" | "USD" | "EUR" | "GBP" | "JPY")[] = ["THB", "USD", "EUR", "GBP", "JPY"];

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-center font-bold text-[0.8vw] opacity-70 hover:opacity-100 transition-opacity tabular-nums-fixed min-w-[44px] min-h-[44px] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#5F4B8B] rounded-sm"
        aria-label={`Change currency, current ${currency}`}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
      >
        {currency}
      </button>

      {isOpen && (
        <div
          role="listbox"
          aria-label="Currency"
          className="absolute top-full right-0 mt-[0.3vw] bg-white border border-gray-200 rounded-md shadow-lg z-50 min-w-[5rem] overflow-hidden"
        >
          {currencies.map((c) => (
            <button
              type="button"
              key={c}
              role="option"
              aria-selected={currency === c}
              onClick={() => { setCurrency(c); setIsOpen(false); }}
              className={`block w-full text-left px-3 py-2 text-sm md:text-[0.75vw] tabular-nums-fixed hover:bg-gray-50 transition-colors focus-visible:bg-gray-50 focus-visible:outline-none ${currency === c ? "text-[#5F4B8B] font-bold" : "text-gray-600"}`}
            >
              {c}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

function LanguageSwitcher() {
  const { locale, setLocale } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    }
    function handleEscape(e: KeyboardEvent) {
      if (e.key === "Escape") setIsOpen(false);
    }
    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEscape);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscape);
    };
  }, []);

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-center w-[1.3vw] h-[1.3vw] min-w-[44px] min-h-[44px] opacity-70 hover:opacity-100 transition-opacity focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#5F4B8B] rounded-sm"
        aria-label={`Change language, current ${locale === "th" ? "Thai" : "English"}`}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
      >
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-[1.3vw] h-[1.3vw] min-w-[18px] min-h-[18px]" aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9.004 9.004 0 008.716-6.747M12 21a9.004 9.004 0 01-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 017.843 4.582M12 3a8.997 8.997 0 00-7.843 4.582m15.686 0A11.953 11.953 0 0112 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0121 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0112 16.5a17.92 17.92 0 01-8.716-2.247m0 0A9.015 9.015 0 013 12c0-1.605.42-3.113 1.157-4.418" />
        </svg>
      </button>

      {isOpen && (
        <div
          role="listbox"
          aria-label="Language"
          className="absolute top-full right-0 mt-[0.3vw] bg-white border border-gray-200 rounded-md shadow-lg z-50 min-w-[5rem] overflow-hidden"
        >
          <button
            type="button"
            role="option"
            aria-selected={locale === "th"}
            onClick={() => { setLocale("th"); setIsOpen(false); }}
            className={`block w-full text-left px-3 py-2 text-sm md:text-[0.75vw] hover:bg-gray-50 transition-colors focus-visible:bg-gray-50 focus-visible:outline-none ${locale === "th" ? "text-[#5F4B8B] font-bold" : "text-gray-600"}`}
          >
            ไทย
          </button>
          <button
            type="button"
            role="option"
            aria-selected={locale === "en"}
            onClick={() => { setLocale("en"); setIsOpen(false); }}
            className={`block w-full text-left px-3 py-2 text-sm md:text-[0.75vw] hover:bg-gray-50 transition-colors focus-visible:bg-gray-50 focus-visible:outline-none ${locale === "en" ? "text-[#5F4B8B] font-bold" : "text-gray-600"}`}
          >
            English
          </button>
        </div>
      )}
    </div>
  );
}

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const { t } = useLanguage();

  const handleScroll = () => {
    if (window.scrollY > 20) {
      setIsScrolled(true);
    } else {
      setIsScrolled(false);
    }
  };

  useEffect(() => {
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <nav
      aria-label="Primary"
      className={`flex items-center justify-center border-b border-gray-200 fixed top-0 bg-white/95 backdrop-blur-sm z-50 w-screen transition-all duration-300 ${isScrolled ? 'h-[4.5vw] min-h-[56px]' : 'h-[7vw] min-h-[64px]'}`}
    >
      {/* left — product categories + team */}
      <div className="flex absolute left-0 justify-between w-[30vw] pl-[3vw] text-[1vw] hover:[&_a]:opacity-100">
        <Link href={'/product'} className="hover:opacity-70 transition-opacity focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#5F4B8B] rounded-sm">
          <p>{t('nav.recommend')}</p>
        </Link>
        <Link href={'/product?type=shirt'} className="hover:opacity-70 transition-opacity focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#5F4B8B] rounded-sm">
          <p>{t('nav.shirt')}</p>
        </Link>
        <Link href={'/product?type=trouser'} className="hover:opacity-70 transition-opacity focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#5F4B8B] rounded-sm">
          <p>{t('nav.trouser')}</p>
        </Link>
        <Link href={'/product?type=others'} className="hover:opacity-70 transition-opacity focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#5F4B8B] rounded-sm">
          <p>{t('nav.others')}</p>
        </Link>
        <Link href={'/product?sale=true'} className="hover:opacity-70 transition-opacity focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#5F4B8B] rounded-sm">
          <p className="text-[#5F4B8B] font-semibold">{t('nav.sale')}</p>
        </Link>
      </div>

      {/* mid — wordmark */}
      <div className="flex flex-col gap-1.5 w-[20vw] text-center justify-center items-center">
        <Link href={'/'} aria-label="IDOIDENTITY Bangkok — Home" className="focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#5F4B8B] rounded-sm">
          <p lang="en" className={`leading-none transition-all duration-300 tracking-tight ${isScrolled ? 'text-[2vw]' : 'text-[2.7vw]'}`}>IDOIDENTITY</p>
          <p lang="en" className={`leading-none transition-all duration-300 ${isScrolled ? 'text-[1vw]' : 'text-[1.3vw]'}`}>BANGKOK</p>
        </Link>
      </div>

      {/* right — actions */}
      <div className="flex items-center justify-between pr-[3vw] w-[22vw] absolute right-0">
        <Link
          href={'/account/'}
          aria-label={t('nav.recommend') ? 'Account' : 'Account'}
          className="flex items-center justify-center min-w-[44px] min-h-[44px] hover:opacity-70 transition-opacity focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#5F4B8B] rounded-sm"
        >
          <span className="w-[1.1vw] h-[1.1vw] min-w-[18px] min-h-[18px] relative block">
            <Image src='/user-info-icon.png' fill alt="" aria-hidden="true" className="object-contain" />
          </span>
        </Link>

        <Search isScrolled={isScrolled} />

        <Link
          href={'/wishlist/'}
          aria-label="Wishlist"
          className="flex items-center justify-center min-w-[44px] min-h-[44px] hover:opacity-70 transition-opacity focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#5F4B8B] rounded-sm"
        >
          <span className="w-[1.1vw] h-[1.1vw] min-w-[18px] min-h-[18px] relative block">
            <Image src='/wishlist-icon.png' fill alt="" aria-hidden="true" className="object-contain" />
          </span>
        </Link>

        <Link
          href={'/cart/'}
          aria-label="Cart"
          className="flex items-center justify-center min-w-[44px] min-h-[44px] hover:opacity-70 transition-opacity focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#5F4B8B] rounded-sm"
        >
          <span className="w-[1.1vw] h-[1.1vw] min-w-[18px] min-h-[18px] relative block">
            <Image src='/cart-icon.png' fill alt="" aria-hidden="true" className="object-contain" />
          </span>
        </Link>

        {/* Admin link — must use <a> for full page nav across the rewrite boundary */}
        <a
          href="/admin/login"
          aria-label="Admin"
          className="flex items-center justify-center min-w-[44px] min-h-[44px] hover:opacity-70 transition-opacity focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#5F4B8B] rounded-sm"
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-[1.1vw] h-[1.1vw] min-w-[18px] min-h-[18px] text-gray-700" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
          </svg>
        </a>

        <CurrencySwitcher />
        <LanguageSwitcher />
      </div>
    </nav>
  );
}

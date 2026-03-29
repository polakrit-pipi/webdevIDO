"use client";
import Image from "next/image";
import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import Search from "./Search";
import { useLanguage } from "@/app/context/LanguageContext";

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
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-center w-[1.3vw] h-[1.3vw] opacity-70 hover:opacity-100 transition-opacity"
        aria-label="Change language"
      >
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-full h-full">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9.004 9.004 0 008.716-6.747M12 21a9.004 9.004 0 01-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 017.843 4.582M12 3a8.997 8.997 0 00-7.843 4.582m15.686 0A11.953 11.953 0 0112 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0121 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0112 16.5a17.92 17.92 0 01-8.716-2.247m0 0A9.015 9.015 0 013 12c0-1.605.42-3.113 1.157-4.418" />
        </svg>
      </button>

      {isOpen && (
        <div className="absolute top-full right-0 mt-[0.3vw] bg-white border border-gray-200 rounded-md shadow-lg z-50 min-w-[3.5vw] overflow-hidden">
          <button
            onClick={() => { setLocale("th"); setIsOpen(false); }}
            className={`block w-full text-left px-[0.6vw] py-[0.4vw] text-[0.75vw] hover:bg-gray-50 transition-colors ${locale === "th" ? "text-[#5F4B8B] font-bold" : "text-gray-600"}`}
          >
            TH
          </button>
          <button
            onClick={() => { setLocale("en"); setIsOpen(false); }}
            className={`block w-full text-left px-[0.6vw] py-[0.4vw] text-[0.75vw] hover:bg-gray-50 transition-colors ${locale === "en" ? "text-[#5F4B8B] font-bold" : "text-gray-600"}`}
          >
            EN
          </button>
        </div>
      )}
    </div>
  );
}

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
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
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (

    <>  
    <nav className={`flex items-center justify-center border-b fixed top-0 bg-white z-50 w-screen transition-all duration-300 ${isScrolled ? 'h-[4.5vw]' : 'h-[7vw]'}`}>
        {/* left */}
        <div className="flex absolute left-0 justify-between w-[25vw] pl-[3vw] text-[1vw]">
          <Link href={'/product'}>
          <p>{t('nav.recommend')}</p>
          </Link>
          <Link href={'/product?type=shirt'}>
          <p>{t('nav.shirt')}</p>
          </Link>
          <Link href={'/product?type=trouser'}>
          <p>{t('nav.trouser')}</p>
          </Link>
          <Link href={'/product?type=others'}>
          <p>{t('nav.others')}</p>
          </Link>
          <Link href={'/product?sale=true'}>
          <p className="text-[#5F4B8B]">{t('nav.sale')}</p>
          </Link>
        </div>
        
        {/* mid */}
        <div className="flex flex-col gap-1.5 w-[20vw] text-center justify-center items-center">
          <Link href={'/'}>
            <p className={`leading-none transition-all duration-300 ${isScrolled ? 'text-[2vw]' : 'text-[2.7vw]'}`}>IDOIDENTITY</p>
            <p className={`leading-none transition-all duration-300 ${isScrolled ? 'text-[1vw]' : 'text-[1.3vw]'}`}>BANGKOK</p>
          </Link>
        </div>

        {/* right */}
        <div className="flex items-center  justify-between pr-[3vw] w-[20vw] absolute right-0">
          <div className="w-[1.1vw] h-[1.1vw] relative">
            <Link href={'/account/'}>
              <Image src='/user-info-icon.png' fill alt="user-info-icon" className="object-contain"></Image>
            </Link>
          </div>
          <Search isScrolled={isScrolled} />
  
          
          <div className="w-[1.1vw] h-[1.1vw] relative">
            <Link href={'/wishlist/'}>
            <Image src='/wishlist-icon.png' fill alt="wishlist-icon" className="object-contain"></Image>
            </Link>
          </div>
          <div className="w-[1.1vw] h-[1.1vw] relative">
            <Link href={'/cart/'}>
            <Image src='/cart-icon.png' fill alt="cart-icon" className="object-contain"></Image>
            </Link>
          </div>

          <LanguageSwitcher />
          
        </div>
    </nav>
      
    </>
  );
}

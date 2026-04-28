"use client";

import React, { createContext, useContext, useEffect, useState } from "react";

type Currency = "THB" | "USD" | "EUR" | "GBP" | "JPY";

interface CurrencyContextType {
  currency: Currency;
  setCurrency: (c: Currency) => void;
  rates: Record<string, number>;
  formatPrice: (priceInTHB: number) => string;
}

const CurrencyContext = createContext<CurrencyContextType | undefined>(undefined);

const CURRENCY_SYMBOLS: Record<Currency, string> = {
  THB: "฿",
  USD: "$",
  EUR: "€",
  GBP: "£",
  JPY: "¥",
};

export function CurrencyProvider({ children }: { children: React.ReactNode }) {
  const [currency, setCurrencyState] = useState<Currency>("THB");
  const [rates, setRates] = useState<Record<string, number>>({});

  // Load currency from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem("app_currency") as Currency;
    if (saved && CURRENCY_SYMBOLS[saved]) {
      setCurrencyState(saved);
    }

    // Fetch exchange rates from a public API
    const fetchRates = async () => {
      try {
        const res = await fetch("https://api.exchangerate-api.com/v4/latest/THB");
        const data = await res.json();
        setRates(data.rates);
      } catch (error) {
        console.error("Failed to fetch exchange rates:", error);
      }
    };

    fetchRates();
  }, []);

  const setCurrency = (c: Currency) => {
    setCurrencyState(c);
    localStorage.setItem("app_currency", c);
  };

  const formatPrice = (priceInTHB: number) => {
    if (currency === "THB" || !rates[currency]) {
      // Default formatting
      return `฿${priceInTHB.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    }

    const converted = priceInTHB * rates[currency];
    const symbol = CURRENCY_SYMBOLS[currency];
    
    // JPY usually doesn't have decimals
    if (currency === "JPY") {
      return `${symbol}${Math.round(converted).toLocaleString("en-US")}`;
    }

    return `${symbol}${converted.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  };

  return (
    <CurrencyContext.Provider value={{ currency, setCurrency, rates, formatPrice }}>
      {children}
    </CurrencyContext.Provider>
  );
}

export function useCurrency() {
  const context = useContext(CurrencyContext);
  if (!context) {
    throw new Error("useCurrency must be used within a CurrencyProvider");
  }
  return context;
}

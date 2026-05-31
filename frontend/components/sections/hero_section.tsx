"use client";
import { useEffect, useState } from "react";
import Link from "next/link";

export default function Hero_section() {
  const [visible, setVisible] = useState(false);
  const [hovered, setHovered] = useState<"ido" | "idea" | null>(null);

  useEffect(() => {
    setTimeout(() => setVisible(true), 50);
  }, []);

  return (
    <section
      aria-label="Site selector"
      className={`w-full flex flex-col sm:flex-row relative overflow-hidden transition-opacity duration-700 ${
        visible ? "opacity-100" : "opacity-0"
      }`}
      style={{ height: "calc(100vh - 64px)", minHeight: "500px" }}
    >
      {/* ─── IDO IDENTITY (Left) ─────────────────────────────── */}
      <Link
        href="/product"
        id="selector-ido-identity"
        className="relative flex-1 flex flex-col items-center justify-center cursor-pointer overflow-hidden group"
        onMouseEnter={() => setHovered("ido")}
        onMouseLeave={() => setHovered(null)}
        style={{
          transition: "flex 0.6s cubic-bezier(0.4,0,0.2,1)",
          flex: hovered === "ido" ? "1.4" : hovered === "idea" ? "0.6" : "1",
        }}
      >
        {/* Background image */}
        <div
          className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105"
          style={{
            backgroundImage:
              "url('https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=1200&q=80')",
          }}
        />
        {/* Dark overlay */}
        <div
          className="absolute inset-0 transition-all duration-500"
          style={{
            background:
              hovered === "ido"
                ? "linear-gradient(135deg, rgba(10,5,20,0.55) 0%, rgba(80,40,120,0.45) 100%)"
                : "linear-gradient(135deg, rgba(10,5,20,0.72) 0%, rgba(40,20,60,0.65) 100%)",
          }}
        />

        {/* Content */}
        <div className="relative z-10 flex flex-col items-center text-center px-8">
          {/* Label */}
          <p
            className="text-xs sm:text-sm tracking-[0.35em] uppercase mb-4 transition-all duration-500"
            style={{
              color: hovered === "ido" ? "#d8b4fe" : "#a78bfa",
              letterSpacing: "0.35em",
            }}
          >
            FASHION &amp; LIFESTYLE
          </p>

          <h2
            className="font-black leading-none mb-6 transition-all duration-500"
            style={{
              fontSize: "clamp(2.5rem, 7vw, 6rem)",
              color: "#ffffff",
              fontFamily: "'Geist', sans-serif",
              letterSpacing: "-0.02em",
              textShadow:
                hovered === "ido"
                  ? "0 0 60px rgba(167,139,250,0.6)"
                  : "none",
            }}
          >
            IDO
            <br />
            IDENTITY
          </h2>

          <p
            className="text-white/70 text-sm sm:text-base mb-8 max-w-xs leading-relaxed transition-all duration-500"
            style={{ opacity: hovered === "ido" ? 1 : 0.7 }}
          >
            เสื้อผ้าแฟชั่น — สะท้อนตัวตนที่แท้จริงของคุณ
          </p>

          <div
            className="flex items-center gap-3 px-8 py-3 rounded-full text-sm font-semibold tracking-wider transition-all duration-500"
            style={{
              background:
                hovered === "ido"
                  ? "rgba(139,92,246,0.9)"
                  : "rgba(255,255,255,0.15)",
              color: "#fff",
              border: "1px solid rgba(255,255,255,0.3)",
              backdropFilter: "blur(12px)",
              transform: hovered === "ido" ? "translateY(-4px)" : "translateY(0)",
              boxShadow:
                hovered === "ido" ? "0 8px 32px rgba(139,92,246,0.5)" : "none",
            }}
          >
            <span>SHOP NOW</span>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </div>
        </div>

        {/* Decorative vertical text */}
        <div
          className="absolute right-6 bottom-12 text-white/20 text-xs tracking-[0.5em] uppercase hidden sm:block"
          style={{ writingMode: "vertical-rl", transform: "rotate(180deg)" }}
        >
          IDO IDENTITY
        </div>
      </Link>

      {/* ─── Divider ─────────────────────────────────────────── */}
      <div
        className="relative z-20 hidden sm:flex flex-col items-center justify-center"
        style={{ width: "2px", background: "rgba(255,255,255,0.15)" }}
      >
        <div
          className="w-10 h-10 rounded-full flex items-center justify-center text-white text-xs font-bold"
          style={{
            background: "rgba(255,255,255,0.1)",
            backdropFilter: "blur(12px)",
            border: "1px solid rgba(255,255,255,0.25)",
          }}
        >
          OR
        </div>
      </div>

      {/* ─── IDEA BY IDO (Right) ──────────────────────────────── */}
      <Link
        href="/ideabyido"
        id="selector-ideabyido"
        className="relative flex-1 flex flex-col items-center justify-center cursor-pointer overflow-hidden group"
        onMouseEnter={() => setHovered("idea")}
        onMouseLeave={() => setHovered(null)}
        style={{
          transition: "flex 0.6s cubic-bezier(0.4,0,0.2,1)",
          flex: hovered === "idea" ? "1.4" : hovered === "ido" ? "0.6" : "1",
        }}
      >
        {/* Background image */}
        <div
          className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105"
          style={{
            backgroundImage:
              "url('https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1200&q=80')",
          }}
        />
        {/* Dark overlay */}
        <div
          className="absolute inset-0 transition-all duration-500"
          style={{
            background:
              hovered === "idea"
                ? "linear-gradient(135deg, rgba(5,10,20,0.55) 0%, rgba(20,60,80,0.45) 100%)"
                : "linear-gradient(135deg, rgba(5,10,20,0.72) 0%, rgba(10,30,40,0.65) 100%)",
          }}
        />

        {/* Content */}
        <div className="relative z-10 flex flex-col items-center text-center px-8">
          {/* Label */}
          <p
            className="text-xs sm:text-sm tracking-[0.35em] uppercase mb-4 transition-all duration-500"
            style={{
              color: hovered === "idea" ? "#fcd34d" : "#d4a017",
            }}
          >
            UNIFORM FACTORY
          </p>

          <h2
            className="font-black leading-none mb-6 transition-all duration-500"
            style={{
              fontSize: "clamp(2.5rem, 7vw, 6rem)",
              color: "#ffffff",
              fontFamily: "'Geist', sans-serif",
              letterSpacing: "-0.02em",
              textShadow:
                hovered === "idea"
                  ? "0 0 60px rgba(201,168,76,0.6)"
                  : "none",
            }}
          >
            IDEA
            <br />
            BY IDO
          </h2>

          <p
            className="text-white/70 text-sm sm:text-base mb-8 max-w-xs leading-relaxed transition-all duration-500"
            style={{ opacity: hovered === "idea" ? 1 : 0.7 }}
          >
            รับผลิตยูนิฟอร์ม — ครบทุกประเภท มืออาชีพระดับโรงงาน
          </p>

          <div
            className="flex items-center gap-3 px-8 py-3 rounded-full text-sm font-semibold tracking-wider transition-all duration-500"
            style={{
              background:
                hovered === "idea"
                  ? "rgba(201,168,76,0.9)"
                  : "rgba(255,255,255,0.15)",
              color: hovered === "idea" ? "#0a0f1e" : "#fff",
              border: "1px solid rgba(255,255,255,0.3)",
              backdropFilter: "blur(12px)",
              transform: hovered === "idea" ? "translateY(-4px)" : "translateY(0)",
              boxShadow:
                hovered === "idea"
                  ? "0 8px 32px rgba(201,168,76,0.5)"
                  : "none",
            }}
          >
            <span>OUR PORTFOLIO</span>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </div>
        </div>

        {/* Decorative vertical text */}
        <div
          className="absolute left-6 bottom-12 text-white/20 text-xs tracking-[0.5em] uppercase hidden sm:block"
          style={{ writingMode: "vertical-rl" }}
        >
          IDEA BY IDO
        </div>
      </Link>

      {/* Mobile divider */}
      <div className="sm:hidden w-full h-px bg-white/20" />
    </section>
  );
}

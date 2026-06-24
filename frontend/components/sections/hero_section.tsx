"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";

// ── Multi-color letters ──────────────────────────────────────
const COLORS = ["#f59e0b","#ef4444","#22c55e","#3b82f6","#ec4899","#8b5cf6","#06b6d4","#f97316","#84cc16"];

function ColorfulText({ text }: { text: string }) {
  let ci = 0;
  return (
    <>
      {text.split("").map((char, i) =>
        char === " " || char === "&" ? (
          <span key={i} style={{ color: "#ffffff" }}>{char}</span>
        ) : (
          <span key={i} style={{ color: COLORS[ci++ % COLORS.length] }}>{char}</span>
        )
      )}
    </>
  );
}

// ── Social Icon Button ───────────────────────────────────────
function SocialBtn({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      onClick={e => e.stopPropagation()}
      style={{
        width: 40, height: 40, borderRadius: "50%",
        display: "flex", alignItems: "center", justifyContent: "center",
        background: "rgba(255,255,255,0.15)",
        border: "1px solid rgba(255,255,255,0.35)",
        color: "#fff",
        backdropFilter: "blur(8px)",
        flexShrink: 0,
      }}
    >
      {children}
    </a>
  );
}

export default function Hero_section() {
  const [visible, setVisible] = useState(false);
  const [hovered, setHovered] = useState<"ido" | "idea" | null>(null);

  useEffect(() => { setTimeout(() => setVisible(true), 50); }, []);

  return (
    <section
      aria-label="Site selector"
      style={{
        width: "100%",
        minHeight: "100svh",
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
        opacity: visible ? 1 : 0,
        transition: "opacity 0.7s ease",
      }}
    >
      {/* ─── Row on desktop, Column on mobile ── */}
      <div style={{ display: "flex", flex: 1, flexDirection: "row", flexWrap: "wrap" }}>

        {/* ══ IDO IDENTITY ══════════════════════════════════════ */}
        <Link
          href="/product"
          id="selector-ido-identity"
          onMouseEnter={() => setHovered("ido")}
          onMouseLeave={() => setHovered(null)}
          style={{
            position: "relative",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            textDecoration: "none",
            overflow: "hidden",
            // Desktop: side-by-side; Mobile: full width stacked
            flex: "1 1 300px",
            minHeight: "55svh",
            transition: "flex 0.6s cubic-bezier(0.4,0,0.2,1)",
          }}
        >
          {/* BG — using Next.js Image for priority preload */}
          <div style={{
            position: "absolute", inset: 0,
            transform: hovered === "ido" ? "scale(1.06)" : "scale(1)",
            transition: "transform 0.7s ease",
            overflow: "hidden",
          }}>
            <Image
              src="/hero-ido.jpg"
              alt="IDO Identity background"
              fill
              priority
              sizes="50vw"
              style={{ objectFit: "cover", objectPosition: "center" }}
            />
          </div>
          {/* Overlay */}
          <div style={{
            position: "absolute", inset: 0,
            background: hovered === "ido"
              ? "linear-gradient(135deg,rgba(10,5,20,0.52),rgba(80,40,120,0.42))"
              : "linear-gradient(135deg,rgba(10,5,20,0.70),rgba(40,20,60,0.62))",
            transition: "background 0.5s",
          }} />

          {/* Content */}
          <div style={{
            position: "relative", zIndex: 10,
            display: "flex", flexDirection: "column",
            alignItems: "center", textAlign: "center",
            padding: "clamp(2rem, 5vw, 3rem) clamp(1.5rem, 4vw, 3rem)",
            gap: "0.5rem",
          }}>
            {/* แฟชั่น & ไลฟ์สไตล์ */}
            <p style={{
              fontSize: "clamp(0.8rem, 2.5vw, 1.1rem)",
              fontWeight: 900,
              letterSpacing: "0.12em",
              textTransform: "uppercase",
              textShadow: "0 2px 12px rgba(0,0,0,0.9)",
              marginBottom: "0.5rem",
              lineHeight: 1.4,
            }}>
              <ColorfulText text="แฟชั่น & ไลฟ์สไตล์" />
            </p>

            {/* Heading */}
            <h2 style={{
              fontSize: "clamp(3rem, 9vw, 6rem)",
              fontWeight: 900,
              color: "#ffffff",
              lineHeight: 1,
              letterSpacing: "-0.02em",
              margin: 0,
              textShadow: hovered === "ido" ? "0 0 60px rgba(167,139,250,0.6)" : "none",
              transition: "text-shadow 0.5s",
            }}>
              IDO<br />IDENTITY
            </h2>

            {/* Sub */}
            <p style={{
              color: "rgba(255,255,255,0.72)",
              fontSize: "clamp(0.8rem, 2vw, 1rem)",
              lineHeight: 1.7,
              margin: "0.75rem 0",
              maxWidth: "26ch",
            }}>
              เสื้อผ้าแฟชั่น — สะท้อนตัวตนที่แท้จริงของคุณ
            </p>

            {/* Social */}
            <div style={{ display: "flex", gap: "0.75rem", margin: "0.25rem 0 0.75rem" }}>
              <SocialBtn href="https://www.facebook.com/share/p/18kWjasgNV/?mibextid=wwXIfr">
                <svg width="17" height="17" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/>
                </svg>
              </SocialBtn>
              <SocialBtn href="https://www.instagram.com/idoidentity">
                <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="2" y="2" width="20" height="20" rx="5"/>
                  <circle cx="12" cy="12" r="4"/>
                  <circle cx="17.5" cy="6.5" r="1.5" fill="currentColor" stroke="none"/>
                </svg>
              </SocialBtn>
            </div>

            {/* CTA */}
            <div style={{
              display: "inline-flex", alignItems: "center", gap: "0.5rem",
              padding: "0.75rem 2rem",
              borderRadius: "100px",
              fontSize: "clamp(0.75rem, 2vw, 0.875rem)",
              fontWeight: 700,
              letterSpacing: "0.1em",
              background: hovered === "ido" ? "rgba(139,92,246,0.9)" : "rgba(255,255,255,0.14)",
              color: "#fff",
              border: "1px solid rgba(255,255,255,0.3)",
              backdropFilter: "blur(12px)",
              transition: "all 0.4s",
              transform: hovered === "ido" ? "translateY(-3px)" : "translateY(0)",
              boxShadow: hovered === "ido" ? "0 8px 28px rgba(139,92,246,0.45)" : "none",
              whiteSpace: "nowrap",
            }}>
              SHOP NOW
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M5 12h14M12 5l7 7-7 7"/>
              </svg>
            </div>
          </div>
        </Link>

        {/* Divider — desktop only */}
        <div style={{
          width: "2px",
          background: "rgba(255,255,255,0.14)",
          display: "none",
          alignSelf: "stretch",
        }} className="hero-divider" />

        {/* ══ IDEA BY IDO ════════════════════════════════════════ */}
        <Link
          href="/ideabyido"
          id="selector-ideabyido"
          onMouseEnter={() => setHovered("idea")}
          onMouseLeave={() => setHovered(null)}
          style={{
            position: "relative",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            textDecoration: "none",
            overflow: "hidden",
            flex: "1 1 300px",
            minHeight: "55svh",
            transition: "flex 0.6s cubic-bezier(0.4,0,0.2,1)",
          }}
        >
          {/* BG — using Next.js Image for priority preload */}
          <div style={{
            position: "absolute", inset: 0,
            transform: hovered === "idea" ? "scale(1.06)" : "scale(1)",
            transition: "transform 0.7s ease",
            overflow: "hidden",
          }}>
            <Image
              src="https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1200&q=80"
              alt="Idea by IDO background"
              fill
              priority
              sizes="50vw"
              style={{ objectFit: "cover", objectPosition: "center" }}
            />
          </div>
          {/* Overlay */}
          <div style={{
            position: "absolute", inset: 0,
            background: hovered === "idea"
              ? "linear-gradient(135deg,rgba(5,10,20,0.52),rgba(20,60,80,0.42))"
              : "linear-gradient(135deg,rgba(5,10,20,0.70),rgba(10,30,40,0.62))",
            transition: "background 0.5s",
          }} />

          {/* Content */}
          <div style={{
            position: "relative", zIndex: 10,
            display: "flex", flexDirection: "column",
            alignItems: "center", textAlign: "center",
            padding: "clamp(2rem, 5vw, 3rem) clamp(1.5rem, 4vw, 3rem)",
            gap: "0.5rem",
          }}>
            {/* UNIFORM FACTORY label */}
            <p style={{
              fontSize: "clamp(0.8rem, 2.5vw, 1.1rem)",
              fontWeight: 900,
              letterSpacing: "0.2em",
              textTransform: "uppercase",
              color: hovered === "idea" ? "#fde68a" : "#fbbf24",
              textShadow: "0 2px 12px rgba(0,0,0,0.9)",
              marginBottom: "0.5rem",
            }}>
              UNIFORM FACTORY
            </p>

            {/* Heading */}
            <h2 style={{
              fontSize: "clamp(3rem, 9vw, 6rem)",
              fontWeight: 900,
              color: "#ffffff",
              lineHeight: 1,
              letterSpacing: "-0.02em",
              margin: 0,
              textShadow: hovered === "idea" ? "0 0 60px rgba(201,168,76,0.6)" : "none",
              transition: "text-shadow 0.5s",
            }}>
              IDEA<br />BY IDO
            </h2>

            {/* Sub */}
            <p style={{
              color: "rgba(255,255,255,0.72)",
              fontSize: "clamp(0.8rem, 2vw, 1rem)",
              lineHeight: 1.7,
              margin: "0.75rem 0",
              maxWidth: "26ch",
            }}>
              รับผลิตยูนิฟอร์ม — ครบทุกประเภท มืออาชีพระดับโรงงาน
            </p>

            {/* CTA */}
            <div style={{
              display: "inline-flex", alignItems: "center", gap: "0.5rem",
              padding: "0.75rem 2rem",
              borderRadius: "100px",
              fontSize: "clamp(0.75rem, 2vw, 0.875rem)",
              fontWeight: 700,
              letterSpacing: "0.1em",
              background: hovered === "idea" ? "rgba(201,168,76,0.9)" : "rgba(255,255,255,0.14)",
              color: hovered === "idea" ? "#0a0f1e" : "#fff",
              border: "1px solid rgba(255,255,255,0.3)",
              backdropFilter: "blur(12px)",
              transition: "all 0.4s",
              transform: hovered === "idea" ? "translateY(-3px)" : "translateY(0)",
              boxShadow: hovered === "idea" ? "0 8px 28px rgba(201,168,76,0.45)" : "none",
              whiteSpace: "nowrap",
            }}>
              OUR PORTFOLIO
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M5 12h14M12 5l7 7-7 7"/>
              </svg>
            </div>
          </div>
        </Link>
      </div>

      {/* Desktop divider via CSS */}
      <style>{`
        @media (min-width: 640px) {
          .hero-divider { display: flex !important; }
          #selector-ido-identity { min-height: 100svh !important; }
          #selector-ideabyido { min-height: 100svh !important; }
        }
      `}</style>
    </section>
  );
}

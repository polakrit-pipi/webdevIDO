"use client";
import Link from "next/link";
import { useState, useEffect } from "react";

export default function IdeaByIdoLayout({ children }: { children: React.ReactNode }) {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handler, { passive: true });
    return () => window.removeEventListener("scroll", handler);
  }, []);

  return (
    <div style={{ fontFamily: "'Inter', sans-serif" }}>
      {/* ─── IDEABYIDO Navbar ─────────────────────────────── */}
      <nav
        className="fixed top-0 left-0 right-0 z-50 transition-all duration-300"
        style={{
          background: scrolled ? "rgba(10, 15, 30, 0.95)" : "rgba(10, 15, 30, 0.7)",
          backdropFilter: "blur(16px)",
          borderBottom: scrolled ? "1px solid rgba(201,168,76,0.2)" : "none",
          height: "64px",
        }}
      >
        <div
          className="flex items-center justify-between h-full"
          style={{ maxWidth: "1280px", margin: "0 auto", padding: "0 2rem" }}
        >
          {/* Logo */}
          <Link href="/ideabyido" className="flex items-center gap-3">
            <div
              style={{
                width: "36px",
                height: "36px",
                background: "linear-gradient(135deg, #c9a84c, #f0d080)",
                borderRadius: "8px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" stroke="#0a0f1e" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <div>
              <div style={{ color: "#ffffff", fontWeight: 800, fontSize: "15px", letterSpacing: "-0.02em", lineHeight: 1 }}>
                IDEA BY IDO
              </div>
              <div style={{ color: "#c9a84c", fontSize: "10px", letterSpacing: "0.2em", lineHeight: 1.2 }}>
                UNIFORM FACTORY
              </div>
            </div>
          </Link>

          {/* Nav links */}
          <div className="hidden sm:flex items-center gap-8">
            {[
              { label: "ผลงานของเรา", href: "/ideabyido#portfolio" },
              { label: "บริการ", href: "/ideabyido#services" },
              { label: "ขั้นตอน", href: "/ideabyido#process" },
              { label: "ติดต่อ", href: "/ideabyido#contact" },
            ].map((item) => (
              <Link
                key={item.href}
                href={item.href}
                style={{
                  color: "rgba(255,255,255,0.75)",
                  fontSize: "13.5px",
                  textDecoration: "none",
                  transition: "color 0.2s",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.color = "#c9a84c")}
                onMouseLeave={(e) => (e.currentTarget.style.color = "rgba(255,255,255,0.75)")}
              >
                {item.label}
              </Link>
            ))}
          </div>

          {/* CTA */}
          <div className="flex items-center gap-4">
            <Link href="/" style={{ color: "rgba(255,255,255,0.5)", fontSize: "12px", textDecoration: "none" }}>
              ← IDO IDENTITY
            </Link>
            <a
              href="#contact"
              style={{
                background: "linear-gradient(135deg, #c9a84c, #f0d080)",
                color: "#0a0f1e",
                padding: "8px 20px",
                borderRadius: "100px",
                fontSize: "13px",
                fontWeight: 700,
                textDecoration: "none",
                letterSpacing: "0.02em",
              }}
            >
              สั่งผลิต
            </a>
          </div>
        </div>
      </nav>

      {/* Content */}
      <main style={{ paddingTop: "64px" }}>{children}</main>

      {/* ─── Footer ─────────────────────────────────────────── */}
      <footer
        style={{
          background: "#060a12",
          borderTop: "1px solid rgba(201,168,76,0.15)",
          padding: "3rem 2rem",
          marginTop: "0",
        }}
      >
        <div style={{ maxWidth: "1280px", margin: "0 auto" }} className="flex flex-col sm:flex-row justify-between gap-8">
          <div>
            <div style={{ color: "#c9a84c", fontWeight: 800, fontSize: "20px", letterSpacing: "-0.02em", marginBottom: "8px" }}>
              IDEA BY IDO
            </div>
            <p style={{ color: "rgba(255,255,255,0.4)", fontSize: "13px", maxWidth: "260px", lineHeight: 1.7 }}>
              โรงงานรับผลิตยูนิฟอร์มคุณภาพสูง ทุกประเภท ทุกขนาด
            </p>
          </div>
          <div className="flex gap-16">
            <div>
              <div style={{ color: "rgba(255,255,255,0.6)", fontSize: "11px", letterSpacing: "0.1em", marginBottom: "12px", textTransform: "uppercase" }}>
                บริการ
              </div>
              {["ยูนิฟอร์มสำนักงาน", "เสื้อโรงเรียน", "ยูนิฟอร์มโรงแรม", "ชุดกีฬา", "ชุดร้านอาหาร"].map((s) => (
                <div key={s} style={{ color: "rgba(255,255,255,0.4)", fontSize: "13px", marginBottom: "6px" }}>{s}</div>
              ))}
            </div>
            <div>
              <div style={{ color: "rgba(255,255,255,0.6)", fontSize: "11px", letterSpacing: "0.1em", marginBottom: "12px", textTransform: "uppercase" }}>
                ติดต่อ
              </div>
              <div style={{ color: "rgba(255,255,255,0.4)", fontSize: "13px", marginBottom: "6px" }}>Line: @ideabyido</div>
              <div style={{ color: "rgba(255,255,255,0.4)", fontSize: "13px", marginBottom: "6px" }}>Tel: 02-XXX-XXXX</div>
              <div style={{ color: "rgba(255,255,255,0.4)", fontSize: "13px" }}>Email: factory@ideabyido.com</div>
            </div>
          </div>
        </div>
        <div style={{ maxWidth: "1280px", margin: "2rem auto 0", borderTop: "1px solid rgba(255,255,255,0.06)", paddingTop: "1.5rem" }}>
          <p style={{ color: "rgba(255,255,255,0.25)", fontSize: "12px", textAlign: "center" }}>
            © 2024 IDEA BY IDO — A Division of IDO GROUP. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}

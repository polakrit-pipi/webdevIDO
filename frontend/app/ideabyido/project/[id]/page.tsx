"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";

interface UniformProject {
  id: number;
  title: string;
  clientName?: string;
  category: string;
  description?: string;
  coverImage?: string;
  images?: { url: string }[];
  tags?: string[];
  quantity?: number;
  material?: string;
  featured: boolean;
  createdAt: string;
}

const CATEGORY_COLORS: Record<string, string> = {
  "Work Uniform": "#6366f1",
  "School": "#0ea5e9",
  "Hotel": "#c9a84c",
  "Sport": "#22c55e",
  "Corporate": "#8b5cf6",
  "Restaurant": "#f59e0b",
  "Medical": "#ec4899",
  "Other": "#64748b",
};

// Use Next.js proxy route to avoid CORS / mixed-content issues on Vercel
const API_BASE = "/api";

export default function ProjectDetailPage() {
  const params = useParams();
  const id = params?.id as string;

  const [project, setProject] = useState<UniformProject | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeImg, setActiveImg] = useState(0);

  useEffect(() => {
    if (!id) return;
    fetch(`${API_BASE}/uniform-projects/${id}`)
      .then((r) => r.json())
      .then((data) => setProject(data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <div
        style={{
          background: "#0a0f1e",
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <div
          style={{
            width: "48px",
            height: "48px",
            border: "3px solid rgba(201,168,76,0.2)",
            borderTopColor: "#c9a84c",
            borderRadius: "50%",
            animation: "spin 0.8s linear infinite",
          }}
        />
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  if (!project) {
    return (
      <div
        style={{
          background: "#0a0f1e",
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          color: "#fff",
          gap: "16px",
        }}
      >
        <div style={{ fontSize: "4rem" }}>🔍</div>
        <h2 style={{ fontSize: "1.5rem", fontWeight: 700 }}>ไม่พบผลงานนี้</h2>
        <Link
          href="/ideabyido#portfolio"
          style={{
            color: "#c9a84c",
            textDecoration: "none",
            fontSize: "14px",
            display: "flex",
            alignItems: "center",
            gap: "6px",
          }}
        >
          ← กลับไปดูผลงานทั้งหมด
        </Link>
      </div>
    );
  }

  const allImages: string[] = [];
  if (project.coverImage) allImages.push(project.coverImage);
  if (Array.isArray(project.images)) {
    project.images.forEach((img) => {
      if (img.url && img.url !== project.coverImage) allImages.push(img.url);
    });
  }

  const catColor = CATEGORY_COLORS[project.category] ?? "#64748b";

  return (
    <div style={{ background: "#0a0f1e", color: "#ffffff", minHeight: "100vh" }}>
      {/* Breadcrumb */}
      <div style={{ padding: "1.5rem 2rem 0", maxWidth: "1280px", margin: "0 auto" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "13px", color: "rgba(255,255,255,0.4)" }}>
          <Link href="/ideabyido" style={{ color: "#c9a84c", textDecoration: "none" }}>
            IDEABYIDO
          </Link>
          <span>/</span>
          <Link href="/ideabyido#portfolio" style={{ color: "rgba(255,255,255,0.4)", textDecoration: "none" }}>
            ผลงาน
          </Link>
          <span>/</span>
          <span style={{ color: "rgba(255,255,255,0.7)" }}>{project.title}</span>
        </div>
      </div>

      <div style={{ maxWidth: "1280px", margin: "0 auto", padding: "2rem" }}>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr",
            gap: "3rem",
          }}
          className="lg-grid"
        >
          {/* ─── Left: Gallery ───────────────────────────── */}
          <div>
            {/* Main image */}
            <div
              style={{
                width: "100%",
                minHeight: "400px",
                maxHeight: "600px",
                aspectRatio: "auto",
                borderRadius: "20px",
                overflow: "hidden",
                background: "#0a0f1e",
                border: "1px solid rgba(255,255,255,0.07)",
                display: "flex",
                alignItems: "center",
                position: "relative",
              }}
            >
              {allImages[activeImg] ? (
                <Image
                  src={allImages[activeImg]}
                  alt={project.title}
                  fill
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  style={{ objectFit: "contain", background: "#0a0f1e" }}
                  priority
                />
              ) : (
                <span style={{ fontSize: "5rem", opacity: 0.3 }}>🏭</span>
              )}
            </div>

            {/* Thumbnails */}
            {allImages.length > 1 && (
              <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
                {allImages.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setActiveImg(i)}
                    style={{
                      width: "72px",
                      height: "72px",
                      borderRadius: "10px",
                      overflow: "hidden",
                      border: `2px solid ${i === activeImg ? "#c9a84c" : "rgba(255,255,255,0.1)"}`,
                      padding: 0,
                      cursor: "pointer",
                      transition: "border-color 0.2s",
                      background: "transparent",
                      position: "relative",
                    }}
                  >
                    <Image src={img} alt="" fill sizes="72px" style={{ objectFit: "cover" }} loading="lazy" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* ─── Right: Info ─────────────────────────────── */}
          <div>
            {project.featured && (
              <div
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "6px",
                  background: "rgba(201,168,76,0.12)",
                  border: "1px solid rgba(201,168,76,0.3)",
                  borderRadius: "100px",
                  padding: "4px 14px",
                  fontSize: "11px",
                  fontWeight: 700,
                  color: "#c9a84c",
                  marginBottom: "16px",
                  letterSpacing: "0.05em",
                }}
              >
                ⭐ FEATURED PROJECT
              </div>
            )}

            <h1
              style={{
                fontSize: "clamp(1.8rem, 3.5vw, 2.8rem)",
                fontWeight: 900,
                lineHeight: 1.1,
                letterSpacing: "-0.02em",
                marginBottom: "8px",
              }}
            >
              {project.title}
            </h1>

            {project.clientName && (
              <p style={{ color: "#c9a84c", fontSize: "15px", fontWeight: 600, marginBottom: "20px" }}>
                {project.clientName}
              </p>
            )}

            {/* Category badge */}
            <div
              style={{
                display: "inline-block",
                background: `${catColor}22`,
                color: catColor,
                borderRadius: "100px",
                padding: "4px 14px",
                fontSize: "12px",
                fontWeight: 600,
                marginBottom: "24px",
              }}
            >
              {project.category}
            </div>

            {/* Specs */}
            <div
              style={{
                background: "rgba(255,255,255,0.04)",
                border: "1px solid rgba(255,255,255,0.08)",
                borderRadius: "16px",
                padding: "20px",
                marginBottom: "24px",
              }}
            >
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
                {project.quantity && (
                  <div>
                    <div style={{ color: "rgba(255,255,255,0.35)", fontSize: "11px", letterSpacing: "0.1em", marginBottom: "4px", textTransform: "uppercase" }}>
                      จำนวนผลิต
                    </div>
                    <div style={{ fontWeight: 700, fontSize: "18px" }}>
                      {project.quantity.toLocaleString()} <span style={{ fontSize: "13px", fontWeight: 400, color: "rgba(255,255,255,0.5)" }}>ชิ้น</span>
                    </div>
                  </div>
                )}
                {project.material && (
                  <div>
                    <div style={{ color: "rgba(255,255,255,0.35)", fontSize: "11px", letterSpacing: "0.1em", marginBottom: "4px", textTransform: "uppercase" }}>
                      วัสดุ
                    </div>
                    <div style={{ fontWeight: 600, fontSize: "15px" }}>{project.material}</div>
                  </div>
                )}
                {project.createdAt && (
                  <div>
                    <div style={{ color: "rgba(255,255,255,0.35)", fontSize: "11px", letterSpacing: "0.1em", marginBottom: "4px", textTransform: "uppercase" }}>
                      วันที่เพิ่ม
                    </div>
                    <div style={{ fontWeight: 500, fontSize: "14px", color: "rgba(255,255,255,0.7)" }}>
                      {new Date(project.createdAt).toLocaleDateString("th-TH", { year: "numeric", month: "long", day: "numeric" })}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Description */}
            {project.description && (
              <div style={{ marginBottom: "24px" }}>
                <div style={{ color: "rgba(255,255,255,0.35)", fontSize: "11px", letterSpacing: "0.1em", marginBottom: "12px", textTransform: "uppercase" }}>
                  รายละเอียด
                </div>
                <p style={{ color: "rgba(255,255,255,0.65)", lineHeight: 1.8, fontSize: "15px", whiteSpace: "pre-wrap" }}>
                  {project.description}
                </p>
              </div>
            )}

            {/* Tags */}
            {Array.isArray(project.tags) && project.tags.length > 0 && (
              <div style={{ marginBottom: "28px" }}>
                <div style={{ color: "rgba(255,255,255,0.35)", fontSize: "11px", letterSpacing: "0.1em", marginBottom: "12px", textTransform: "uppercase" }}>
                  Tags
                </div>
                <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                  {project.tags.map((tag) => (
                    <span
                      key={tag}
                      style={{
                        background: "rgba(201,168,76,0.08)",
                        color: "#c9a84c",
                        border: "1px solid rgba(201,168,76,0.2)",
                        borderRadius: "6px",
                        padding: "4px 12px",
                        fontSize: "12px",
                        fontWeight: 500,
                      }}
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* CTA */}
            <a
              href="/ideabyido#contact"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "8px",
                background: "linear-gradient(135deg, #c9a84c, #f0d080)",
                color: "#0a0f1e",
                padding: "14px 32px",
                borderRadius: "100px",
                fontWeight: 700,
                fontSize: "15px",
                textDecoration: "none",
                letterSpacing: "0.02em",
              }}
            >
              สั่งผลิตแบบนี้
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </a>

            <div style={{ marginTop: "16px" }}>
              <Link
                href="/ideabyido#portfolio"
                style={{
                  color: "rgba(255,255,255,0.4)",
                  textDecoration: "none",
                  fontSize: "13px",
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "6px",
                }}
              >
                ← กลับไปดูผลงานทั้งหมด
              </Link>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @media (min-width: 900px) {
          .lg-grid {
            grid-template-columns: 1fr 1fr !important;
          }
        }
      `}</style>
    </div>
  );
}

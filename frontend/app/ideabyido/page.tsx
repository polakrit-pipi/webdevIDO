"use client";
import { useEffect, useState } from "react";
import Link from "next/link";

// ─── Types ──────────────────────────────────────────────
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

// ─── Category Filter ─────────────────────────────────────
const CATEGORIES = ["ทั้งหมด", "Work Uniform", "School", "Hotel", "Sport", "Corporate", "Restaurant", "Medical", "Other"];

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

// ─── Services Data ───────────────────────────────────────
const SERVICES = [
  {
    icon: "🏢",
    title: "ยูนิฟอร์มสำนักงาน",
    desc: "ออกแบบและผลิตชุดทำงานสำหรับองค์กร สวมใส่สบาย ดูดีเป็นมืออาชีพ",
    category: "Corporate",
  },
  {
    icon: "🎓",
    title: "เสื้อโรงเรียน",
    desc: "ชุดนักเรียนทุกระดับ ผ้าคุณภาพ ทนทาน ราคาเหมาะสม",
    category: "School",
  },
  {
    icon: "🏨",
    title: "ยูนิฟอร์มโรงแรม",
    desc: "ชุดพนักงานโรงแรม ดีไซน์หรูหรา เน้นความสะอาดเรียบร้อย",
    category: "Hotel",
  },
  {
    icon: "⚽",
    title: "ชุดกีฬา",
    desc: "เสื้อกีฬาทีม ผ้าระบายอากาศ พิมพ์ชื่อ-หมายเลขได้",
    category: "Sport",
  },
  {
    icon: "🍜",
    title: "ชุดร้านอาหาร",
    desc: "ยูนิฟอร์มร้านอาหาร ครัว บาริสต้า ออกแบบตามแบรนด์",
    category: "Restaurant",
  },
  {
    icon: "🏥",
    title: "ชุดการแพทย์",
    desc: "Scrubs, ชุดพยาบาล, ชุดผู้ช่วย ผ้าต้านเชื้อโรค",
    category: "Medical",
  },
];

// ─── Process Steps ───────────────────────────────────────
const PROCESS = [
  { step: "01", title: "ติดต่อ & บรีฟงาน", desc: "แจ้งความต้องการ จำนวน ประเภทชุด พร้อมโลโก้และสี" },
  { step: "02", title: "ออกแบบ & อนุมัติ", desc: "ทีมออกแบบทำ mockup ให้อนุมัติก่อนผลิตจริง" },
  { step: "03", title: "เลือกวัสดุ", desc: "เลือกผ้าจากตัวอย่างจริง มีหลายคุณภาพให้เลือก" },
  { step: "04", title: "ผลิต & ตรวจสอบ", desc: "ผลิตในโรงงานของเรา QC ทุกชิ้น" },
  { step: "05", title: "ส่งมอบ", desc: "จัดส่งถึงที่ทั่วประเทศ พร้อมใบรับประกันคุณภาพ" },
];

// Use Next.js proxy route to avoid CORS / mixed-content issues on Vercel
const API_BASE = "/api";

// ─── Main Component ──────────────────────────────────────
export default function IdeaByIdoPage() {
  const [projects, setProjects] = useState<UniformProject[]>([]);
  const [featured, setFeatured] = useState<UniformProject[]>([]);
  const [activeCategory, setActiveCategory] = useState("ทั้งหมด");
  const [loading, setLoading] = useState(true);
  const [heroVisible, setHeroVisible] = useState(false);

  useEffect(() => {
    setTimeout(() => setHeroVisible(true), 100);
    fetchProjects();
  }, []);

  async function fetchProjects() {
    try {
      const res = await fetch(`${API_BASE}/uniform-projects`);
      if (res.ok) {
        const data = await res.json();
        setProjects(data.projects ?? []);
        setFeatured((data.projects ?? []).filter((p: UniformProject) => p.featured));
      }
    } catch {
      // offline — show empty state
    } finally {
      setLoading(false);
    }
  }

  const filtered =
    activeCategory === "ทั้งหมด"
      ? projects
      : projects.filter((p) => p.category === activeCategory);

  return (
    <div style={{ background: "#0a0f1e", color: "#ffffff", minHeight: "100vh" }}>
      {/* ═══════════════════════════════════════════════════
          HERO
      ════════════════════════════════════════════════════ */}
      <section
        style={{
          position: "relative",
          minHeight: "90vh",
          display: "flex",
          alignItems: "center",
          overflow: "hidden",
        }}
      >
        {/* Background */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            backgroundImage: "url('https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1600&q=80')",
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        />
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: "linear-gradient(135deg, rgba(10,15,30,0.92) 0%, rgba(10,15,30,0.75) 50%, rgba(10,15,30,0.85) 100%)",
          }}
        />

        {/* Grid decoration */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            backgroundImage:
              "linear-gradient(rgba(201,168,76,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(201,168,76,0.04) 1px, transparent 1px)",
            backgroundSize: "60px 60px",
          }}
        />

        {/* Content */}
        <div
          style={{
            maxWidth: "1280px",
            margin: "0 auto",
            padding: "4rem 2rem",
            position: "relative",
            zIndex: 1,
            opacity: heroVisible ? 1 : 0,
            transform: heroVisible ? "translateY(0)" : "translateY(32px)",
            transition: "all 0.9s cubic-bezier(0.4,0,0.2,1)",
          }}
        >
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "8px",
              background: "rgba(201,168,76,0.12)",
              border: "1px solid rgba(201,168,76,0.3)",
              borderRadius: "100px",
              padding: "6px 16px",
              marginBottom: "24px",
            }}
          >
            <div style={{ width: "6px", height: "6px", background: "#c9a84c", borderRadius: "50%" }} />
            <span style={{ color: "#c9a84c", fontSize: "12px", letterSpacing: "0.15em", fontWeight: 600 }}>
              UNIFORM FACTORY — SINCE 2018
            </span>
          </div>

          <h1
            style={{
              fontSize: "clamp(2.8rem, 6vw, 5.5rem)",
              fontWeight: 900,
              lineHeight: 1.05,
              letterSpacing: "-0.03em",
              marginBottom: "1.5rem",
              maxWidth: "800px",
            }}
          >
            ผลิตยูนิฟอร์ม
            <br />
            <span
              style={{
                background: "linear-gradient(135deg, #c9a84c, #f0d080, #c9a84c)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              คุณภาพระดับโรงงาน
            </span>
          </h1>

          <p
            style={{
              fontSize: "clamp(1rem, 1.5vw, 1.2rem)",
              color: "rgba(255,255,255,0.65)",
              lineHeight: 1.8,
              maxWidth: "560px",
              marginBottom: "2.5rem",
            }}
          >
            รับผลิตยูนิฟอร์มทุกประเภท ออกแบบตามความต้องการ
            ควบคุมคุณภาพทุกขั้นตอน ตั้งแต่ 50 ชิ้นขึ้นไป
          </p>

          <div style={{ display: "flex", gap: "16px", flexWrap: "wrap" }}>
            <a
              href="#portfolio"
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
              ดูผลงาน
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </a>
            <a
              href="#contact"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "8px",
                background: "rgba(255,255,255,0.08)",
                color: "#ffffff",
                padding: "14px 32px",
                borderRadius: "100px",
                fontWeight: 600,
                fontSize: "15px",
                textDecoration: "none",
                border: "1px solid rgba(255,255,255,0.2)",
                backdropFilter: "blur(8px)",
              }}
            >
              ติดต่อสอบถาม
            </a>
          </div>

          {/* Stats */}
          <div
            style={{
              display: "flex",
              gap: "3rem",
              marginTop: "4rem",
              flexWrap: "wrap",
            }}
          >
            {[
              { value: "500+", label: "โปรเจกต์ที่ผ่านมา" },
              { value: "6+", label: "ปีประสบการณ์" },
              { value: "50+", label: "บริษัทที่ไว้วางใจ" },
            ].map((stat) => (
              <div key={stat.label}>
                <div
                  style={{
                    fontSize: "2rem",
                    fontWeight: 800,
                    background: "linear-gradient(135deg, #c9a84c, #f0d080)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    lineHeight: 1,
                  }}
                >
                  {stat.value}
                </div>
                <div style={{ color: "rgba(255,255,255,0.45)", fontSize: "13px", marginTop: "4px" }}>
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════
          SERVICES
      ════════════════════════════════════════════════════ */}
      <section id="services" style={{ padding: "6rem 2rem", background: "#0d1526" }}>
        <div style={{ maxWidth: "1280px", margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: "3.5rem" }}>
            <p style={{ color: "#c9a84c", fontSize: "12px", letterSpacing: "0.25em", fontWeight: 600, marginBottom: "12px" }}>
              WHAT WE MAKE
            </p>
            <h2 style={{ fontSize: "clamp(1.8rem, 3.5vw, 2.8rem)", fontWeight: 800, letterSpacing: "-0.02em" }}>
              บริการของเรา
            </h2>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
              gap: "20px",
            }}
          >
            {SERVICES.map((svc) => (
              <div
                key={svc.title}
                style={{
                  background: "rgba(255,255,255,0.04)",
                  border: "1px solid rgba(255,255,255,0.08)",
                  borderRadius: "16px",
                  padding: "28px",
                  transition: "all 0.3s",
                  cursor: "default",
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLDivElement).style.background = "rgba(201,168,76,0.08)";
                  (e.currentTarget as HTMLDivElement).style.borderColor = "rgba(201,168,76,0.25)";
                  (e.currentTarget as HTMLDivElement).style.transform = "translateY(-4px)";
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLDivElement).style.background = "rgba(255,255,255,0.04)";
                  (e.currentTarget as HTMLDivElement).style.borderColor = "rgba(255,255,255,0.08)";
                  (e.currentTarget as HTMLDivElement).style.transform = "translateY(0)";
                }}
              >
                <div style={{ fontSize: "2rem", marginBottom: "16px" }}>{svc.icon}</div>
                <div
                  style={{
                    display: "inline-block",
                    background: `${CATEGORY_COLORS[svc.category]}22`,
                    color: CATEGORY_COLORS[svc.category],
                    borderRadius: "100px",
                    padding: "2px 10px",
                    fontSize: "11px",
                    fontWeight: 600,
                    marginBottom: "12px",
                    letterSpacing: "0.05em",
                  }}
                >
                  {svc.category}
                </div>
                <h3 style={{ fontSize: "17px", fontWeight: 700, marginBottom: "8px" }}>{svc.title}</h3>
                <p style={{ color: "rgba(255,255,255,0.5)", fontSize: "13.5px", lineHeight: 1.7 }}>{svc.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════
          PORTFOLIO
      ════════════════════════════════════════════════════ */}
      <section id="portfolio" style={{ padding: "6rem 2rem" }}>
        <div style={{ maxWidth: "1280px", margin: "0 auto" }}>
          {/* Header */}
          <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", flexWrap: "wrap", gap: "20px", marginBottom: "2.5rem" }}>
            <div>
              <p style={{ color: "#c9a84c", fontSize: "12px", letterSpacing: "0.25em", fontWeight: 600, marginBottom: "12px" }}>
                OUR WORK
              </p>
              <h2 style={{ fontSize: "clamp(1.8rem, 3.5vw, 2.8rem)", fontWeight: 800, letterSpacing: "-0.02em" }}>
                ผลงานของเรา
              </h2>
            </div>
          </div>

          {/* Category Filter */}
          <div style={{ display: "flex", gap: "8px", flexWrap: "wrap", marginBottom: "2.5rem" }}>
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                style={{
                  padding: "8px 18px",
                  borderRadius: "100px",
                  border: "1px solid",
                  fontSize: "13px",
                  fontWeight: 600,
                  cursor: "pointer",
                  transition: "all 0.2s",
                  background: activeCategory === cat ? "#c9a84c" : "rgba(255,255,255,0.05)",
                  borderColor: activeCategory === cat ? "#c9a84c" : "rgba(255,255,255,0.12)",
                  color: activeCategory === cat ? "#0a0f1e" : "rgba(255,255,255,0.65)",
                }}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Grid */}
          {loading ? (
            <div style={{ textAlign: "center", padding: "5rem 0", color: "rgba(255,255,255,0.3)" }}>
              <div
                style={{
                  width: "40px",
                  height: "40px",
                  border: "3px solid rgba(201,168,76,0.2)",
                  borderTopColor: "#c9a84c",
                  borderRadius: "50%",
                  margin: "0 auto 16px",
                  animation: "spin 0.8s linear infinite",
                }}
              />
              กำลังโหลด...
            </div>
          ) : filtered.length === 0 ? (
            <div
              style={{
                textAlign: "center",
                padding: "5rem 0",
                background: "rgba(255,255,255,0.03)",
                borderRadius: "20px",
                border: "1px solid rgba(255,255,255,0.06)",
              }}
            >
              <div style={{ fontSize: "3rem", marginBottom: "16px" }}>🏭</div>
              <div style={{ color: "rgba(255,255,255,0.4)", fontSize: "16px", marginBottom: "8px" }}>
                ยังไม่มีผลงาน{activeCategory !== "ทั้งหมด" ? `ในหมวด ${activeCategory}` : ""}
              </div>
              <div style={{ color: "rgba(255,255,255,0.25)", fontSize: "13px" }}>
                ผลงานจะปรากฏเมื่อ Admin เพิ่มข้อมูล
              </div>
            </div>
          ) : (
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))",
                gap: "24px",
              }}
            >
              {filtered.map((project) => (
                <ProjectCard key={project.id} project={project} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════
          PROCESS
      ════════════════════════════════════════════════════ */}
      <section id="process" style={{ padding: "6rem 2rem", background: "#0d1526" }}>
        <div style={{ maxWidth: "1280px", margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: "4rem" }}>
            <p style={{ color: "#c9a84c", fontSize: "12px", letterSpacing: "0.25em", fontWeight: 600, marginBottom: "12px" }}>
              HOW WE WORK
            </p>
            <h2 style={{ fontSize: "clamp(1.8rem, 3.5vw, 2.8rem)", fontWeight: 800, letterSpacing: "-0.02em" }}>
              ขั้นตอนการสั่งผลิต
            </h2>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "0" }}>
            {PROCESS.map((step, i) => (
              <div
                key={step.step}
                style={{
                  display: "flex",
                  gap: "2rem",
                  alignItems: "flex-start",
                  paddingBottom: i < PROCESS.length - 1 ? "2rem" : "0",
                  position: "relative",
                }}
              >
                {/* Line connector */}
                {i < PROCESS.length - 1 && (
                  <div
                    style={{
                      position: "absolute",
                      left: "28px",
                      top: "60px",
                      width: "2px",
                      height: "calc(100% - 16px)",
                      background: "linear-gradient(to bottom, rgba(201,168,76,0.4), rgba(201,168,76,0.05))",
                    }}
                  />
                )}

                {/* Step number */}
                <div
                  style={{
                    width: "56px",
                    height: "56px",
                    borderRadius: "50%",
                    background: "linear-gradient(135deg, #c9a84c22, #c9a84c44)",
                    border: "1px solid rgba(201,168,76,0.4)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                    color: "#c9a84c",
                    fontWeight: 800,
                    fontSize: "14px",
                  }}
                >
                  {step.step}
                </div>

                {/* Content */}
                <div style={{ paddingTop: "12px" }}>
                  <h3 style={{ fontSize: "18px", fontWeight: 700, marginBottom: "6px" }}>{step.title}</h3>
                  <p style={{ color: "rgba(255,255,255,0.5)", fontSize: "14px", lineHeight: 1.7 }}>{step.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════
          CONTACT
      ════════════════════════════════════════════════════ */}
      <section id="contact" style={{ padding: "6rem 2rem" }}>
        <div style={{ maxWidth: "800px", margin: "0 auto", textAlign: "center" }}>
          <p style={{ color: "#c9a84c", fontSize: "12px", letterSpacing: "0.25em", fontWeight: 600, marginBottom: "12px" }}>
            GET IN TOUCH
          </p>
          <h2
            style={{
              fontSize: "clamp(2rem, 4vw, 3.5rem)",
              fontWeight: 900,
              letterSpacing: "-0.03em",
              marginBottom: "1.5rem",
            }}
          >
            พร้อมรับผลิตยูนิฟอร์ม
            <br />
            <span
              style={{
                background: "linear-gradient(135deg, #c9a84c, #f0d080)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              ตั้งแต่ 50 ชิ้นขึ้นไป
            </span>
          </h2>
          <p style={{ color: "rgba(255,255,255,0.5)", fontSize: "16px", lineHeight: 1.8, marginBottom: "3rem" }}>
            บรีฟงาน แนบโลโก้ และแจ้งจำนวน — ทีมเราจะติดต่อกลับภายใน 24 ชั่วโมง
          </p>

          <div style={{ display: "flex", justifyContent: "center", gap: "16px", flexWrap: "wrap" }}>
            {[
              { icon: "💬", label: "Line Official", value: "@ideabyido", href: "#" },
              { icon: "📞", label: "โทรศัพท์", value: "02-XXX-XXXX", href: "tel:02XXXXXXX" },
              { icon: "📧", label: "อีเมล", value: "factory@ideabyido.com", href: "mailto:factory@ideabyido.com" },
            ].map((contact) => (
              <a
                key={contact.label}
                href={contact.href}
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: "8px",
                  padding: "28px 36px",
                  background: "rgba(201,168,76,0.06)",
                  border: "1px solid rgba(201,168,76,0.2)",
                  borderRadius: "16px",
                  textDecoration: "none",
                  minWidth: "160px",
                  transition: "all 0.25s",
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLAnchorElement).style.background = "rgba(201,168,76,0.12)";
                  (e.currentTarget as HTMLAnchorElement).style.transform = "translateY(-4px)";
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLAnchorElement).style.background = "rgba(201,168,76,0.06)";
                  (e.currentTarget as HTMLAnchorElement).style.transform = "translateY(0)";
                }}
              >
                <span style={{ fontSize: "2rem" }}>{contact.icon}</span>
                <span style={{ color: "rgba(255,255,255,0.4)", fontSize: "11px", letterSpacing: "0.1em", textTransform: "uppercase" }}>
                  {contact.label}
                </span>
                <span style={{ color: "#c9a84c", fontSize: "14px", fontWeight: 600 }}>{contact.value}</span>
              </a>
            ))}
          </div>
        </div>
      </section>

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
}

// ─── Project Card Component ─────────────────────────────
function ProjectCard({ project }: { project: UniformProject }) {
  const coverSrc =
    project.coverImage ||
    (Array.isArray(project.images) && project.images[0]?.url) ||
    null;

  const catColor = CATEGORY_COLORS[project.category] ?? "#64748b";

  return (
    <Link
      href={`/ideabyido/project/${project.id}`}
      style={{ textDecoration: "none", display: "block" }}
    >
      <div
        style={{
          background: "rgba(255,255,255,0.04)",
          border: "1px solid rgba(255,255,255,0.08)",
          borderRadius: "16px",
          overflow: "hidden",
          transition: "all 0.3s",
          cursor: "pointer",
        }}
        onMouseEnter={(e) => {
          (e.currentTarget as HTMLDivElement).style.transform = "translateY(-6px)";
          (e.currentTarget as HTMLDivElement).style.borderColor = "rgba(201,168,76,0.3)";
          (e.currentTarget as HTMLDivElement).style.boxShadow = "0 20px 48px rgba(0,0,0,0.4)";
        }}
        onMouseLeave={(e) => {
          (e.currentTarget as HTMLDivElement).style.transform = "translateY(0)";
          (e.currentTarget as HTMLDivElement).style.borderColor = "rgba(255,255,255,0.08)";
          (e.currentTarget as HTMLDivElement).style.boxShadow = "none";
        }}
      >
        {/* Image */}
        <div
          style={{
            height: "220px",
            background: coverSrc
              ? `url(${coverSrc}) center/cover no-repeat`
              : `linear-gradient(135deg, ${catColor}22, ${catColor}44)`,
            position: "relative",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {!coverSrc && (
            <span style={{ fontSize: "3rem", opacity: 0.4 }}>🏭</span>
          )}
          {project.featured && (
            <div
              style={{
                position: "absolute",
                top: "12px",
                right: "12px",
                background: "linear-gradient(135deg, #c9a84c, #f0d080)",
                color: "#0a0f1e",
                borderRadius: "100px",
                padding: "3px 10px",
                fontSize: "11px",
                fontWeight: 700,
              }}
            >
              ⭐ Featured
            </div>
          )}
        </div>

        {/* Info */}
        <div style={{ padding: "20px" }}>
          <div
            style={{
              display: "inline-block",
              background: `${catColor}22`,
              color: catColor,
              borderRadius: "100px",
              padding: "2px 10px",
              fontSize: "11px",
              fontWeight: 600,
              marginBottom: "10px",
            }}
          >
            {project.category}
          </div>
          <h3
            style={{
              fontSize: "16px",
              fontWeight: 700,
              color: "#ffffff",
              marginBottom: "6px",
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
            }}
          >
            {project.title}
          </h3>
          {project.clientName && (
            <p style={{ color: "rgba(255,255,255,0.4)", fontSize: "13px", marginBottom: "12px" }}>
              {project.clientName}
            </p>
          )}

          {/* Tags */}
          {Array.isArray(project.tags) && project.tags.length > 0 && (
            <div style={{ display: "flex", gap: "6px", flexWrap: "wrap", marginTop: "12px" }}>
              {project.tags.slice(0, 3).map((tag) => (
                <span
                  key={tag}
                  style={{
                    background: "rgba(255,255,255,0.06)",
                    color: "rgba(255,255,255,0.45)",
                    borderRadius: "4px",
                    padding: "2px 8px",
                    fontSize: "11px",
                  }}
                >
                  #{tag}
                </span>
              ))}
            </div>
          )}

          {/* Quantity */}
          {project.quantity && (
            <div
              style={{
                marginTop: "12px",
                color: "rgba(255,255,255,0.35)",
                fontSize: "12px",
                display: "flex",
                alignItems: "center",
                gap: "4px",
              }}
            >
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M20 7H4a2 2 0 00-2 2v10a2 2 0 002 2h16a2 2 0 002-2V9a2 2 0 00-2-2z" />
                <path d="M16 3H8a2 2 0 00-2 2v2h12V5a2 2 0 00-2-2z" />
              </svg>
              {project.quantity.toLocaleString()} ชิ้น
            </div>
          )}
        </div>
      </div>
    </Link>
  );
}

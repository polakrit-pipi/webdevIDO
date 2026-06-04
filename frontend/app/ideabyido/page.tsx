"use client";
import { useEffect, useState } from "react";
import Image from "next/image";
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

// ─── SVG Icons for Services (no emoji) ───────────────────
const ServiceIcons: Record<string, React.ReactNode> = {
  Corporate: (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="7" width="20" height="14" rx="2" />
      <path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2" />
      <line x1="12" y1="12" x2="12" y2="12.01" />
    </svg>
  ),
  School: (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
      <path d="M6 12v5c3 3 9 3 12 0v-5" />
    </svg>
  ),
  Hotel: (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
      <polyline points="9 22 9 12 15 12 15 22" />
    </svg>
  ),
  Sport: (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
      <line x1="2" y1="12" x2="22" y2="12" />
    </svg>
  ),
  Restaurant: (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 2v7c0 1.1.9 2 2 2h4a2 2 0 0 0 2-2V2" />
      <path d="M7 2v20" />
      <path d="M21 15V2v0a5 5 0 0 0-5 5v6c0 1.1.9 2 2 2h3zm0 0v7" />
    </svg>
  ),
  Medical: (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
    </svg>
  ),
};

// ─── Services Data ───────────────────────────────────────
const SERVICES = [
  { category: "Corporate", title: "ยูนิฟอร์มสำนักงาน", desc: "ออกแบบและผลิตชุดทำงานสำหรับองค์กร สวมใส่สบาย ดูดีเป็นมืออาชีพ" },
  { category: "School",    title: "เสื้อโรงเรียน",     desc: "ชุดนักเรียนทุกระดับ ผ้าคุณภาพ ทนทาน ราคาเหมาะสม" },
  { category: "Hotel",     title: "ยูนิฟอร์มโรงแรม",  desc: "ชุดพนักงานโรงแรม ดีไซน์หรูหรา เน้นความสะอาดเรียบร้อย" },
  { category: "Sport",     title: "ชุดกีฬา",           desc: "เสื้อกีฬาทีม ผ้าระบายอากาศ พิมพ์ชื่อ-หมายเลขได้" },
  { category: "Restaurant",title: "ชุดร้านอาหาร",     desc: "ยูนิฟอร์มร้านอาหาร ครัว บาริสต้า ออกแบบตามแบรนด์" },
  { category: "Medical",   title: "ชุดการแพทย์",      desc: "Scrubs, ชุดพยาบาล, ชุดผู้ช่วย ผ้าต้านเชื้อโรค" },
];

// ─── Contact icons (SVG) ─────────────────────────────────
const LineIcon = () => (
  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
  </svg>
);

const PhoneIcon = () => (
  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.61 1.27h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L7.91 8.91a16 16 0 0 0 6 6l.9-.9a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 21.73 16.92z" />
  </svg>
);

const MailIcon = () => (
  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
    <polyline points="22,6 12,13 2,6" />
  </svg>
);

const MapIcon = () => (
  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
    <circle cx="12" cy="10" r="3"/>
  </svg>
);

// ─── Process Steps ───────────────────────────────────────
const PROCESS = [
  { step: "01", title: "ติดต่อ & บรีฟงาน", desc: "แจ้งความต้องการ จำนวน ประเภทชุด พร้อมโลโก้และสี" },
  { step: "02", title: "ออกแบบ Artwork & อนุมัติ", desc: "ทีมออกแบบทำ mockup ให้อนุมัติก่อนผลิตจริง พร้อมตัวอย่างผ้า" },
  { step: "03", title: "ผลิต & QC ทุกขั้นตอน", desc: "ผลิตในโรงงานของเรา ตรวจสอบคุณภาพทุกชิ้นก่อนส่ง" },
  { step: "04", title: "งานปัก & สกรีน", desc: "บริการปักโลโก้ด้วยเครื่องปักอัตโนมัติ และสกรีนทุกแบบ" },
  { step: "05", title: "จัดส่งทั่วประเทศ", desc: "จัดส่งถึงที่ทั่วประเทศ พร้อมใบรับประกันคุณภาพ" },
];

// ─── Gallery images from company profile ─────────────────
const GALLERY_IMAGES = [
  { src: "/ideabyido/img_p4_63_1280x853.png",  alt: "ผลงาน DPU RUN 2025 - เสื้อกีฬากิจกรรม",        label: "Sport Event" },
  { src: "/ideabyido/img_p4_64_1477x1108.png", alt: "ผลงานยูนิฟอร์มลูกค้า",                          label: "Corporate" },
  { src: "/ideabyido/img_p4_65_1290x844.png",  alt: "งานผลิตจริง ผลงานที่ไว้วางใจ",                  label: "Event" },
  { src: "/ideabyido/img_p4_66_1290x857.png",  alt: "งานผลิต ชุดยูนิฟอร์มหลากสี",                   label: "Uniform" },
  { src: "/ideabyido/img_p4_67_1246x1312.png", alt: "ผลงานยูนิฟอร์มสถาบันการศึกษา",                 label: "School" },
];

const FACTORY_IMAGES = [
  { src: "/ideabyido/img_p2_1_363x272.jpeg",   alt: "ป้ายบริษัท ไอเดียบายไอดู",         label: "สำนักงาน" },
  { src: "/ideabyido/img_p2_2_363x272.jpeg",   alt: "หน้าโรงงาน ไอเดียบายไอดู",         label: "โรงงาน" },
  { src: "/ideabyido/img_p2_3_351x273.jpeg",   alt: "ทีมงาน ไอเดียบายไอดู",             label: "ทีมงาน" },
  { src: "/ideabyido/img_p2_4_365x274.jpeg",   alt: "โรงงานยามค่ำคืน ไอเดียบายไอดู",   label: "โรงงาน" },
  { src: "/ideabyido/img_p2_5_363x272.jpeg",   alt: "สายการผลิต ไอเดียบายไอดู",        label: "การผลิต" },
];

const PRODUCTION_IMAGES = [
  { src: "/ideabyido/img_p5_1_621x465.jpeg",   alt: "เครื่องจักรปักอัตโนมัติ",          label: "งานปัก" },
  { src: "/ideabyido/img_p6_1_317x238.jpeg",   alt: "การตัดเย็บผ้า",                    label: "การผลิต" },
  { src: "/ideabyido/img_p6_2_317x237.jpeg",   alt: "ห้องตัดเย็บ",                      label: "การผลิต" },
  { src: "/ideabyido/img_p5_9_534x400.jpeg",   alt: "เครื่องสกรีน",                     label: "งานสกรีน" },
  { src: "/ideabyido/img_p6_15_593x333.jpeg",  alt: "คลังสินค้า",                       label: "จัดส่ง" },
  { src: "/ideabyido/img_p6_17_593x333.jpeg",  alt: "บรรจุภัณฑ์พร้อมส่ง",              label: "จัดส่ง" },
];

// ─── No-image placeholder SVG ───────────────────────────
const ImagePlaceholder = ({ color }: { color: string }) => (
  <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1" opacity="0.35">
    <rect x="3" y="3" width="18" height="18" rx="2" />
    <circle cx="8.5" cy="8.5" r="1.5" />
    <path d="M21 15l-5-5L5 21" />
  </svg>
);

// Use Next.js proxy route to avoid CORS / mixed-content issues on Vercel
const API_BASE = "/api";

// ─── Main Component ──────────────────────────────────────
export default function IdeaByIdoPage() {
  const [projects, setProjects] = useState<UniformProject[]>([]);
  const [activeCategory, setActiveCategory] = useState("ทั้งหมด");
  const [loading, setLoading] = useState(true);
  const [heroVisible, setHeroVisible] = useState(false);
  const [activeGalleryTab, setActiveGalleryTab] = useState<"clients" | "factory" | "production">("clients");

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

      {/* ═══════════════ HERO ═══════════════ */}
      <section style={{ position: "relative", minHeight: "90vh", display: "flex", alignItems: "center", overflow: "hidden" }}>
        {/* Hero background: real team photo */}
        <div style={{ position: "absolute", inset: 0 }}>
          <Image
            src="/ideabyido/img_p2_3_351x273.jpeg"
            alt="ทีมงาน ไอเดียบายไอดู"
            fill
            style={{ objectFit: "cover", objectPosition: "center top", filter: "brightness(0.35) saturate(1.2)" }}
            unoptimized
            priority
          />
        </div>
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(135deg, rgba(10,15,30,0.95) 0%, rgba(10,15,30,0.70) 50%, rgba(10,15,30,0.88) 100%)" }} />
        <div style={{ position: "absolute", inset: 0, backgroundImage: "linear-gradient(rgba(201,168,76,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(201,168,76,0.04) 1px, transparent 1px)", backgroundSize: "60px 60px" }} />

        <div style={{ maxWidth: "1280px", margin: "0 auto", padding: "4rem 2rem", position: "relative", zIndex: 1, opacity: heroVisible ? 1 : 0, transform: heroVisible ? "translateY(0)" : "translateY(32px)", transition: "all 0.9s cubic-bezier(0.4,0,0.2,1)" }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: "8px", background: "rgba(201,168,76,0.12)", border: "1px solid rgba(201,168,76,0.3)", borderRadius: "100px", padding: "6px 16px", marginBottom: "24px" }}>
            <div style={{ width: "6px", height: "6px", background: "#c9a84c", borderRadius: "50%" }} />
            <span style={{ color: "#c9a84c", fontSize: "12px", letterSpacing: "0.15em", fontWeight: 600 }}>UNIFORM FACTORY — ก่อตั้ง พ.ศ.2554</span>
          </div>

          <h1 style={{ fontSize: "clamp(2.4rem, 5.5vw, 5rem)", fontWeight: 900, lineHeight: 1.05, letterSpacing: "-0.03em", marginBottom: "1rem", maxWidth: "800px" }}>
            บริษัท ไอเดียบายไอดู
            <br />
            <span style={{ background: "linear-gradient(135deg, #c9a84c, #f0d080, #c9a84c)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
              จำกัด
            </span>
          </h1>

          <p style={{ fontSize: "clamp(1rem, 1.5vw, 1.25rem)", color: "rgba(255,255,255,0.8)", fontWeight: 500, marginBottom: "0.75rem", fontStyle: "italic", letterSpacing: "0.02em" }}>
            &ldquo;ทุกสิ่งเป็นไปได้เพื่อบริการที่ดีเยี่ยม&rdquo;
          </p>

          <p style={{ fontSize: "clamp(0.95rem, 1.3vw, 1.1rem)", color: "rgba(255,255,255,0.55)", lineHeight: 1.8, maxWidth: "560px", marginBottom: "2.5rem" }}>
            โรงงานรับผลิตออกแบบเสื้อผ้ายูนิฟอร์มและแฟชั่น ประสบการณ์กว่า 15 ปี
            รับผลิตเสื้อเชิ้ต เสื้อแจ็คเก็ต กางเกง เสื้อยืดโปโล ชุดช่าง ทุกรูปแบบ
          </p>

          <div style={{ display: "flex", gap: "16px", flexWrap: "wrap" }}>
            <a href="#portfolio" style={{ display: "inline-flex", alignItems: "center", gap: "8px", background: "linear-gradient(135deg, #c9a84c, #f0d080)", color: "#0a0f1e", padding: "14px 32px", borderRadius: "100px", fontWeight: 700, fontSize: "15px", textDecoration: "none", letterSpacing: "0.02em" }}>
              ดูผลงาน
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
            </a>
            <a href="#contact" style={{ display: "inline-flex", alignItems: "center", gap: "8px", background: "rgba(255,255,255,0.08)", color: "#ffffff", padding: "14px 32px", borderRadius: "100px", fontWeight: 600, fontSize: "15px", textDecoration: "none", border: "1px solid rgba(255,255,255,0.2)", backdropFilter: "blur(8px)" }}>
              ติดต่อสอบถาม
            </a>
          </div>

          {/* Stats from profile */}
          <div style={{ display: "flex", gap: "3rem", marginTop: "4rem", flexWrap: "wrap" }}>
            {[
              { value: "15+",  label: "ปีประสบการณ์ (ก่อตั้ง 2554)" },
              { value: "500+", label: "โปรเจกต์ที่ผ่านมา" },
              { value: "50+",  label: "บริษัทที่ไว้วางใจ" },
            ].map((stat) => (
              <div key={stat.label}>
                <div style={{ fontSize: "2rem", fontWeight: 800, background: "linear-gradient(135deg, #c9a84c, #f0d080)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", lineHeight: 1 }}>{stat.value}</div>
                <div style={{ color: "rgba(255,255,255,0.45)", fontSize: "13px", marginTop: "4px" }}>{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════ ABOUT / WHO WE ARE ═══════════════ */}
      <section id="about" style={{ padding: "6rem 2rem", background: "#0d1526" }}>
        <div style={{ maxWidth: "1280px", margin: "0 auto" }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "4rem", alignItems: "center" }}>
            {/* Text */}
            <div>
              <p style={{ color: "#c9a84c", fontSize: "12px", letterSpacing: "0.25em", fontWeight: 600, marginBottom: "12px" }}>WHO WE ARE</p>
              <h2 style={{ fontSize: "clamp(1.8rem, 3.5vw, 2.8rem)", fontWeight: 800, letterSpacing: "-0.02em", marginBottom: "1.5rem" }}>
                บริษัท ไอเดียบายไอดู จำกัด
              </h2>
              <div style={{ width: "48px", height: "3px", background: "linear-gradient(90deg, #c9a84c, #f0d080)", borderRadius: "2px", marginBottom: "1.5rem" }} />
              <p style={{ color: "rgba(255,255,255,0.65)", lineHeight: 1.9, fontSize: "15px", marginBottom: "1.2rem" }}>
                เราเป็นโรงงานที่รับผลิตออกแบบเสื้อผ้ายูนิฟอร์มและแฟชั่น <strong style={{ color: "rgba(255,255,255,0.85)" }}>จดทะเบียนบริษัทตั้งแต่ปีพ.ศ.2554</strong> มีประสบการณ์พร้อมให้คำแนะนำปรึกษา
              </p>
              <p style={{ color: "rgba(255,255,255,0.65)", lineHeight: 1.9, fontSize: "15px", marginBottom: "1.2rem" }}>
                ไม่ว่าจะเป็นงานผลิตเสื้อเชิ้ต เสื้อแจ็คเก็ต กางเกงขายาว กางเกงขาสั้น เสื้อยืดโปโล ชุดช่าง ตลอดงานเย็บทุกรูป ตามจำนวนที่คุณต้องการในราคาที่คุณพอใจ
              </p>
              <p style={{ color: "rgba(255,255,255,0.65)", lineHeight: 1.9, fontSize: "15px", marginBottom: "2rem" }}>
                เราให้บริการด้านการผลิตสินค้าที่รวดเร็ว ตอบสนองความต้องการของคุณด้วยประสบการณ์ที่เราได้รับจากบริษัทชั้นนำหลายๆ บริษัท ที่ให้ความไว้วางใจ
              </p>
              <div style={{ display: "inline-flex", alignItems: "center", gap: "10px", background: "rgba(201,168,76,0.1)", border: "1px solid rgba(201,168,76,0.25)", borderRadius: "12px", padding: "14px 20px" }}>
                <span style={{ fontSize: "22px" }}>💬</span>
                <div>
                  <div style={{ color: "#c9a84c", fontWeight: 700, fontSize: "14px" }}>"ทุกสิ่งเป็นไปได้เพื่อบริการที่ดีเยี่ยม"</div>
                  <div style={{ color: "rgba(255,255,255,0.4)", fontSize: "11px", marginTop: "2px" }}>— IDEA BY IDO, Everything&apos;s Possible</div>
                </div>
              </div>
            </div>

            {/* Factory Images grid */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
              {FACTORY_IMAGES.slice(0, 4).map((img, i) => (
                <div key={i} style={{ borderRadius: "12px", overflow: "hidden", aspectRatio: "4/3", position: "relative", border: "1px solid rgba(255,255,255,0.07)" }}>
                  <Image src={img.src} alt={img.alt} fill style={{ objectFit: "cover" }} unoptimized />
                  <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, background: "linear-gradient(transparent, rgba(0,0,0,0.65))", padding: "8px", fontSize: "11px", color: "rgba(255,255,255,0.7)", fontWeight: 500 }}>{img.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════ SERVICES ═══════════════ */}
      <section id="services" style={{ padding: "6rem 2rem", background: "#0a0f1e" }}>
        <div style={{ maxWidth: "1280px", margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: "3.5rem" }}>
            <p style={{ color: "#c9a84c", fontSize: "12px", letterSpacing: "0.25em", fontWeight: 600, marginBottom: "12px" }}>WHAT WE MAKE</p>
            <h2 style={{ fontSize: "clamp(1.8rem, 3.5vw, 2.8rem)", fontWeight: 800, letterSpacing: "-0.02em" }}>บริการของเรา</h2>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: "20px" }}>
            {SERVICES.map((svc) => (
              <div
                key={svc.title}
                style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "16px", padding: "28px", transition: "all 0.3s", cursor: "default" }}
                onMouseEnter={(e) => { const d = e.currentTarget as HTMLDivElement; d.style.background = "rgba(201,168,76,0.08)"; d.style.borderColor = "rgba(201,168,76,0.25)"; d.style.transform = "translateY(-4px)"; }}
                onMouseLeave={(e) => { const d = e.currentTarget as HTMLDivElement; d.style.background = "rgba(255,255,255,0.04)"; d.style.borderColor = "rgba(255,255,255,0.08)"; d.style.transform = "translateY(0)"; }}
              >
                <div style={{ color: CATEGORY_COLORS[svc.category], marginBottom: "16px" }}>
                  {ServiceIcons[svc.category]}
                </div>
                <div style={{ display: "inline-block", background: `${CATEGORY_COLORS[svc.category]}22`, color: CATEGORY_COLORS[svc.category], borderRadius: "100px", padding: "2px 10px", fontSize: "11px", fontWeight: 600, marginBottom: "12px", letterSpacing: "0.05em" }}>
                  {svc.category}
                </div>
                <h3 style={{ fontSize: "17px", fontWeight: 700, marginBottom: "8px" }}>{svc.title}</h3>
                <p style={{ color: "rgba(255,255,255,0.5)", fontSize: "13.5px", lineHeight: 1.7 }}>{svc.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════ PHOTO GALLERY ═══════════════ */}
      <section id="gallery" style={{ padding: "6rem 2rem", background: "#0d1526" }}>
        <div style={{ maxWidth: "1280px", margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: "3rem" }}>
            <p style={{ color: "#c9a84c", fontSize: "12px", letterSpacing: "0.25em", fontWeight: 600, marginBottom: "12px" }}>OUR PHOTOS</p>
            <h2 style={{ fontSize: "clamp(1.8rem, 3.5vw, 2.8rem)", fontWeight: 800, letterSpacing: "-0.02em" }}>ภาพถ่ายจากงานจริง</h2>
          </div>

          {/* Tab switcher */}
          <div style={{ display: "flex", justifyContent: "center", gap: "12px", marginBottom: "2.5rem", flexWrap: "wrap" }}>
            {([
              { key: "clients",    label: "ผลงานลูกค้า" },
              { key: "factory",    label: "โรงงานของเรา" },
              { key: "production", label: "กระบวนการผลิต" },
            ] as const).map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveGalleryTab(tab.key)}
                style={{ padding: "10px 24px", borderRadius: "100px", border: "1px solid", fontSize: "13px", fontWeight: 600, cursor: "pointer", transition: "all 0.2s", background: activeGalleryTab === tab.key ? "#c9a84c" : "rgba(255,255,255,0.05)", borderColor: activeGalleryTab === tab.key ? "#c9a84c" : "rgba(255,255,255,0.12)", color: activeGalleryTab === tab.key ? "#0a0f1e" : "rgba(255,255,255,0.65)" }}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Gallery Grid */}
          {activeGalleryTab === "clients" && (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: "16px" }}>
              {GALLERY_IMAGES.map((img, i) => (
                <div key={i} style={{ borderRadius: "14px", overflow: "hidden", position: "relative", aspectRatio: i === 0 ? "16/9" : "4/3", border: "1px solid rgba(255,255,255,0.07)", gridColumn: i === 0 ? "span 2" : "span 1" }}>
                  <Image src={img.src} alt={img.alt} fill style={{ objectFit: "cover", transition: "transform 0.4s" }} unoptimized
                    onMouseOver={(e) => (e.currentTarget.style.transform = "scale(1.04)")}
                    onMouseOut={(e) => (e.currentTarget.style.transform = "scale(1)")}
                  />
                  <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, background: "linear-gradient(transparent, rgba(0,0,0,0.7))", padding: "16px 14px 12px" }}>
                    <div style={{ display: "inline-block", background: "rgba(201,168,76,0.9)", color: "#0a0f1e", borderRadius: "6px", padding: "2px 8px", fontSize: "10px", fontWeight: 700, marginBottom: "4px" }}>{img.label}</div>
                    <div style={{ color: "rgba(255,255,255,0.85)", fontSize: "12px" }}>{img.alt}</div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeGalleryTab === "factory" && (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: "16px" }}>
              {FACTORY_IMAGES.map((img, i) => (
                <div key={i} style={{ borderRadius: "14px", overflow: "hidden", position: "relative", aspectRatio: "4/3", border: "1px solid rgba(255,255,255,0.07)" }}>
                  <Image src={img.src} alt={img.alt} fill style={{ objectFit: "cover", transition: "transform 0.4s" }} unoptimized
                    onMouseOver={(e) => (e.currentTarget.style.transform = "scale(1.04)")}
                    onMouseOut={(e) => (e.currentTarget.style.transform = "scale(1)")}
                  />
                  <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, background: "linear-gradient(transparent, rgba(0,0,0,0.7))", padding: "12px" }}>
                    <div style={{ color: "rgba(255,255,255,0.85)", fontSize: "12px" }}>{img.alt}</div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeGalleryTab === "production" && (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: "16px" }}>
              {PRODUCTION_IMAGES.map((img, i) => (
                <div key={i} style={{ borderRadius: "14px", overflow: "hidden", position: "relative", aspectRatio: "4/3", border: "1px solid rgba(255,255,255,0.07)" }}>
                  <Image src={img.src} alt={img.alt} fill style={{ objectFit: "cover", transition: "transform 0.4s" }} unoptimized
                    onMouseOver={(e) => (e.currentTarget.style.transform = "scale(1.04)")}
                    onMouseOut={(e) => (e.currentTarget.style.transform = "scale(1)")}
                  />
                  <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, background: "linear-gradient(transparent, rgba(0,0,0,0.7))", padding: "12px" }}>
                    <div style={{ display: "inline-block", background: "rgba(201,168,76,0.85)", color: "#0a0f1e", borderRadius: "6px", padding: "2px 8px", fontSize: "10px", fontWeight: 700, marginBottom: "4px" }}>{img.label}</div>
                    <div style={{ color: "rgba(255,255,255,0.8)", fontSize: "12px" }}>{img.alt}</div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ═══════════════ PORTFOLIO ═══════════════ */}
      <section id="portfolio" style={{ padding: "6rem 2rem" }}>
        <div style={{ maxWidth: "1280px", margin: "0 auto" }}>
          <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", flexWrap: "wrap", gap: "20px", marginBottom: "2.5rem" }}>
            <div>
              <p style={{ color: "#c9a84c", fontSize: "12px", letterSpacing: "0.25em", fontWeight: 600, marginBottom: "12px" }}>OUR WORK</p>
              <h2 style={{ fontSize: "clamp(1.8rem, 3.5vw, 2.8rem)", fontWeight: 800, letterSpacing: "-0.02em" }}>ผลงานของเรา</h2>
            </div>
          </div>

          {/* Category Filter */}
          <div style={{ display: "flex", gap: "8px", flexWrap: "wrap", marginBottom: "2.5rem" }}>
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                style={{ padding: "8px 18px", borderRadius: "100px", border: "1px solid", fontSize: "13px", fontWeight: 600, cursor: "pointer", transition: "all 0.2s", background: activeCategory === cat ? "#c9a84c" : "rgba(255,255,255,0.05)", borderColor: activeCategory === cat ? "#c9a84c" : "rgba(255,255,255,0.12)", color: activeCategory === cat ? "#0a0f1e" : "rgba(255,255,255,0.65)" }}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Grid */}
          {loading ? (
            <div style={{ textAlign: "center", padding: "5rem 0", color: "rgba(255,255,255,0.3)" }}>
              <div style={{ width: "40px", height: "40px", border: "3px solid rgba(201,168,76,0.2)", borderTopColor: "#c9a84c", borderRadius: "50%", margin: "0 auto 16px", animation: "spin 0.8s linear infinite" }} />
              กำลังโหลด...
            </div>
          ) : filtered.length === 0 ? (
            <div style={{ textAlign: "center", padding: "5rem 0", background: "rgba(255,255,255,0.03)", borderRadius: "20px", border: "1px solid rgba(255,255,255,0.06)" }}>
              <div style={{ marginBottom: "16px", opacity: 0.3 }}>
                <svg width="56" height="56" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" style={{ margin: "0 auto" }}>
                  <rect x="3" y="3" width="18" height="18" rx="2" />
                  <circle cx="8.5" cy="8.5" r="1.5" />
                  <path d="M21 15l-5-5L5 21" />
                </svg>
              </div>
              <div style={{ color: "rgba(255,255,255,0.4)", fontSize: "16px", marginBottom: "8px" }}>
                ยังไม่มีผลงาน{activeCategory !== "ทั้งหมด" ? ` ในหมวด ${activeCategory}` : ""}
              </div>
              <div style={{ color: "rgba(255,255,255,0.25)", fontSize: "13px" }}>ผลงานจะปรากฏเมื่อ Admin เพิ่มข้อมูล</div>
            </div>
          ) : (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: "24px" }}>
              {filtered.map((project) => (
                <ProjectCard key={project.id} project={project} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ═══════════════ PROCESS ═══════════════ */}
      <section id="process" style={{ padding: "6rem 2rem", background: "#0d1526" }}>
        <div style={{ maxWidth: "1280px", margin: "0 auto", display: "grid", gridTemplateColumns: "1fr 1fr", gap: "4rem", alignItems: "start" }}>
          <div>
            <p style={{ color: "#c9a84c", fontSize: "12px", letterSpacing: "0.25em", fontWeight: 600, marginBottom: "12px" }}>HOW WE WORK</p>
            <h2 style={{ fontSize: "clamp(1.8rem, 3.5vw, 2.8rem)", fontWeight: 800, letterSpacing: "-0.02em", marginBottom: "2.5rem" }}>ขั้นตอนการสั่งผลิต</h2>

            <div style={{ display: "flex", flexDirection: "column" }}>
              {PROCESS.map((step, i) => (
                <div key={step.step} style={{ display: "flex", gap: "2rem", alignItems: "flex-start", paddingBottom: i < PROCESS.length - 1 ? "2rem" : "0", position: "relative" }}>
                  {i < PROCESS.length - 1 && (
                    <div style={{ position: "absolute", left: "28px", top: "60px", width: "2px", height: "calc(100% - 16px)", background: "linear-gradient(to bottom, rgba(201,168,76,0.4), rgba(201,168,76,0.05))" }} />
                  )}
                  <div style={{ width: "56px", height: "56px", borderRadius: "50%", background: "linear-gradient(135deg, #c9a84c22, #c9a84c44)", border: "1px solid rgba(201,168,76,0.4)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, color: "#c9a84c", fontWeight: 800, fontSize: "14px" }}>
                    {step.step}
                  </div>
                  <div style={{ paddingTop: "12px" }}>
                    <h3 style={{ fontSize: "18px", fontWeight: 700, marginBottom: "6px" }}>{step.title}</h3>
                    <p style={{ color: "rgba(255,255,255,0.5)", fontSize: "14px", lineHeight: 1.7 }}>{step.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Production photo showcase */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
            <div style={{ borderRadius: "14px", overflow: "hidden", gridColumn: "span 2", position: "relative", aspectRatio: "16/9", border: "1px solid rgba(255,255,255,0.07)" }}>
              <Image src="/ideabyido/img_p5_1_621x465.jpeg" alt="เครื่องจักรปักอัตโนมัติ" fill style={{ objectFit: "cover" }} unoptimized />
              <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, background: "linear-gradient(transparent, rgba(0,0,0,0.7))", padding: "12px" }}>
                <div style={{ color: "rgba(255,255,255,0.85)", fontSize: "12px", fontWeight: 500 }}>เครื่องปักอัตโนมัติสำหรับงานปักโลโก้</div>
              </div>
            </div>
            <div style={{ borderRadius: "14px", overflow: "hidden", position: "relative", aspectRatio: "4/3", border: "1px solid rgba(255,255,255,0.07)" }}>
              <Image src="/ideabyido/img_p6_1_317x238.jpeg" alt="การตัดเย็บผ้า" fill style={{ objectFit: "cover" }} unoptimized />
            </div>
            <div style={{ borderRadius: "14px", overflow: "hidden", position: "relative", aspectRatio: "4/3", border: "1px solid rgba(255,255,255,0.07)" }}>
              <Image src="/ideabyido/img_p5_9_534x400.jpeg" alt="เครื่องสกรีน" fill style={{ objectFit: "cover" }} unoptimized />
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════ CONTACT ═══════════════ */}
      <section id="contact" style={{ padding: "6rem 2rem", background: "#0a0f1e" }}>
        <div style={{ maxWidth: "900px", margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: "3rem" }}>
            <p style={{ color: "#c9a84c", fontSize: "12px", letterSpacing: "0.25em", fontWeight: 600, marginBottom: "12px" }}>GET IN TOUCH</p>
            <h2 style={{ fontSize: "clamp(2rem, 4vw, 3rem)", fontWeight: 900, letterSpacing: "-0.03em", marginBottom: "1rem" }}>
              พร้อมรับผลิตยูนิฟอร์ม
              <br />
              <span style={{ background: "linear-gradient(135deg, #c9a84c, #f0d080)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
                IDEA BY IDO CO., LTD
              </span>
            </h2>
            <p style={{ color: "rgba(255,255,255,0.5)", fontSize: "15px", lineHeight: 1.8 }}>
              บรีฟงาน แนบโลโก้ และแจ้งจำนวน — ทีมเราจะติดต่อกลับภายใน 24 ชั่วโมง
            </p>
          </div>

          {/* Contact Cards */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: "16px", marginBottom: "2.5rem" }}>
            {[
              { icon: <LineIcon />, label: "Line Official",   value: "@ideabyido",           href: "https://line.me/ti/p/ideabyido" },
              { icon: <PhoneIcon />, label: "โทรศัพท์ (เก๋)",  value: "064-424-1519",          href: "tel:0644241519" },
              { icon: <PhoneIcon />, label: "โทรศัพท์ (อู๋)",  value: "093-879-6965",          href: "tel:0938796965" },
              { icon: <MailIcon />,  label: "Fax",            value: "02-120-7521",            href: "#" },
            ].map((contact) => (
              <a
                key={contact.label}
                href={contact.href}
                style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "10px", padding: "24px 20px", background: "rgba(201,168,76,0.06)", border: "1px solid rgba(201,168,76,0.2)", borderRadius: "16px", textDecoration: "none", transition: "all 0.25s" }}
                onMouseEnter={(e) => { const a = e.currentTarget as HTMLAnchorElement; a.style.background = "rgba(201,168,76,0.12)"; a.style.transform = "translateY(-4px)"; }}
                onMouseLeave={(e) => { const a = e.currentTarget as HTMLAnchorElement; a.style.background = "rgba(201,168,76,0.06)"; a.style.transform = "translateY(0)"; }}
              >
                <span style={{ color: "#c9a84c" }}>{contact.icon}</span>
                <span style={{ color: "rgba(255,255,255,0.4)", fontSize: "11px", letterSpacing: "0.1em", textTransform: "uppercase" }}>{contact.label}</span>
                <span style={{ color: "#c9a84c", fontSize: "14px", fontWeight: 600 }}>{contact.value}</span>
              </a>
            ))}
          </div>

          {/* Address */}
          <div style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "16px", padding: "24px 28px", display: "flex", gap: "20px", alignItems: "flex-start" }}>
            <div style={{ color: "#c9a84c", flexShrink: 0, marginTop: "2px" }}><MapIcon /></div>
            <div>
              <div style={{ fontWeight: 700, fontSize: "15px", marginBottom: "6px" }}>ที่อยู่โรงงาน</div>
              <div style={{ color: "rgba(255,255,255,0.6)", fontSize: "14px", lineHeight: 1.8 }}>
                79/253 ถนนพหลโยธิน ซอยพหลโยธิน 54/1 แยก 4<br />
                แขวงสายไหม เขตสายไหม กรุงเทพมหานคร 10220
              </div>
              <div style={{ color: "rgba(255,255,255,0.4)", fontSize: "13px", marginTop: "6px" }}>
                79/253 Phahon Yothin 54/1 Alley, Lane 4, Sai Mai, Bangkok 10220
              </div>
              <a
                href="https://goo.gl/maps/3xWWNbB7gr9azfxP6"
                target="_blank"
                rel="noopener noreferrer"
                style={{ display: "inline-flex", alignItems: "center", gap: "6px", marginTop: "12px", color: "#c9a84c", fontSize: "13px", fontWeight: 600, textDecoration: "none" }}
              >
                ดูแผนที่ Google Maps
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" /><polyline points="15 3 21 3 21 9" /><line x1="10" y1="14" x2="21" y2="3" /></svg>
              </a>
            </div>
          </div>
        </div>
      </section>

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}

// ─── Project Card ─────────────────────────────────────────
function ProjectCard({ project }: { project: UniformProject }) {
  const coverSrc = project.coverImage || (Array.isArray(project.images) && project.images[0]?.url) || null;
  const catColor = CATEGORY_COLORS[project.category] ?? "#64748b";

  return (
    <Link href={`/ideabyido/project/${project.id}`} style={{ textDecoration: "none", display: "block" }}>
      <div
        style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "16px", overflow: "hidden", transition: "all 0.3s", cursor: "pointer" }}
        onMouseEnter={(e) => { const d = e.currentTarget as HTMLDivElement; d.style.transform = "translateY(-6px)"; d.style.borderColor = "rgba(201,168,76,0.3)"; d.style.boxShadow = "0 20px 48px rgba(0,0,0,0.4)"; }}
        onMouseLeave={(e) => { const d = e.currentTarget as HTMLDivElement; d.style.transform = "translateY(0)"; d.style.borderColor = "rgba(255,255,255,0.08)"; d.style.boxShadow = "none"; }}
      >
        {/* Image */}
        <div style={{ height: "220px", background: coverSrc ? `url(${coverSrc}) center/cover no-repeat` : `linear-gradient(135deg, ${catColor}18, ${catColor}30)`, position: "relative", display: "flex", alignItems: "center", justifyContent: "center" }}>
          {!coverSrc && <ImagePlaceholder color={catColor} />}
          {project.featured && (
            <div style={{ position: "absolute", top: "12px", right: "12px", background: "linear-gradient(135deg, #c9a84c, #f0d080)", color: "#0a0f1e", borderRadius: "100px", padding: "3px 10px", fontSize: "11px", fontWeight: 700, display: "flex", alignItems: "center", gap: "4px" }}>
              <svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
              Featured
            </div>
          )}
        </div>

        {/* Info */}
        <div style={{ padding: "20px" }}>
          <div style={{ display: "inline-block", background: `${catColor}22`, color: catColor, borderRadius: "100px", padding: "2px 10px", fontSize: "11px", fontWeight: 600, marginBottom: "10px" }}>
            {project.category}
          </div>
          <h3 style={{ fontSize: "16px", fontWeight: 700, color: "#ffffff", marginBottom: "6px", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
            {project.title}
          </h3>
          {project.clientName && (
            <p style={{ color: "rgba(255,255,255,0.4)", fontSize: "13px", marginBottom: "12px" }}>{project.clientName}</p>
          )}

          {/* Tags */}
          {Array.isArray(project.tags) && project.tags.length > 0 && (
            <div style={{ display: "flex", gap: "6px", flexWrap: "wrap", marginTop: "12px" }}>
              {project.tags.slice(0, 3).map((tag) => (
                <span key={tag} style={{ background: "rgba(255,255,255,0.06)", color: "rgba(255,255,255,0.45)", borderRadius: "4px", padding: "2px 8px", fontSize: "11px" }}>
                  #{tag}
                </span>
              ))}
            </div>
          )}

          {/* Quantity */}
          {project.quantity && (
            <div style={{ marginTop: "12px", color: "rgba(255,255,255,0.35)", fontSize: "12px", display: "flex", alignItems: "center", gap: "4px" }}>
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

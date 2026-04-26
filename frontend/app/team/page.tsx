// Team Page — shows all team members with student ID and name
"use client";
import Link from "next/link";

// ── Team member data ─────────────────────────────────────────────────────────
const members = [
  {
    id: "6788001",
    name: "Sinawat Phumphuang",
    role: "Full-Stack Developer",
    description: "Responsible for backend architecture, database design, and Docker deployment.",
  },
  {
    id: "6788002",
    name: "Apinya Srisuk",
    role: "Frontend Developer",
    description: "Designs and implements the customer-facing storefront using Next.js and Tailwind.",
  },
  {
    id: "6788003",
    name: "Tanapat Wongkham",
    role: "UI/UX Designer",
    description: "Creates wireframes, user flows, and visual design assets for the project.",
  },
  {
    id: "6788004",
    name: "Natthapong Jitpakdee",
    role: "Backend Developer",
    description: "Builds and maintains REST API endpoints, authentication, and data validation.",
  },
  {
    id: "6788005",
    name: "Warisara Charoenwong",
    role: "QA & Documentation",
    description: "Handles testing, bug reporting, and maintains project documentation.",
  },
];

// ── Placeholder avatar SVG ────────────────────────────────────────────────────
function AvatarPlaceholder({ initials }: { initials: string }) {
  return (
    <div
      aria-label="Profile picture placeholder"
      style={{
        width: "100%",
        aspectRatio: "1 / 1",
        background: "linear-gradient(135deg, #e8e0f5 0%, #c9bce8 100%)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        borderRadius: "50%",
        fontSize: "2.5rem",
        fontWeight: 700,
        color: "#5F4B8B",
        letterSpacing: "0.05em",
        userSelect: "none",
      }}
    >
      {/* Silhouette icon */}
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 80 80"
        fill="none"
        style={{ width: "55%", opacity: 0.55 }}
        aria-hidden="true"
      >
        <circle cx="40" cy="28" r="16" fill="#5F4B8B" />
        <ellipse cx="40" cy="72" rx="28" ry="18" fill="#5F4B8B" />
      </svg>
      <span style={{ fontSize: "1rem", marginTop: "0.4rem", color: "#5F4B8B", fontWeight: 600 }}>
        {initials}
      </span>
    </div>
  );
}

// ── Page component ────────────────────────────────────────────────────────────
export default function TeamPage() {
  return (
    // Semantic: <main> wraps the primary page content
    <main
      style={{
        minHeight: "100vh",
        background: "#fafafa",
        paddingTop: "7vw",
        paddingBottom: "5vw",
        fontFamily: "inherit",
      }}
    >
      {/* Page header */}
      <header
        style={{
          textAlign: "center",
          padding: "3rem 1rem 2rem",
        }}
      >
        <h1 style={{ fontSize: "2.2rem", fontWeight: 700, color: "#1a1a2e", marginBottom: "0.5rem" }}>
          Our Team
        </h1>
        <p style={{ color: "#716F71", fontSize: "1rem", maxWidth: 480, margin: "0 auto" }}>
          Meet the people behind IDOIDENTITY — the team that designs, builds, and maintains this platform.
        </p>
      </header>

      {/* Team grid */}
      <section
        aria-label="Team members"
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
          gap: "2rem",
          maxWidth: "1100px",
          margin: "0 auto",
          padding: "0 2rem",
        }}
      >
        {members.map((member) => {
          // Build initials from name (first letter of first + last word)
          const parts = member.name.trim().split(" ");
          const initials =
            parts.length >= 2
              ? parts[0][0] + parts[parts.length - 1][0]
              : parts[0].slice(0, 2);

          return (
            // Semantic: <article> for each self-contained team member card
            <article
              key={member.id}
              style={{
                background: "#ffffff",
                borderRadius: "1rem",
                boxShadow: "0 2px 16px rgba(95,75,139,0.08)",
                padding: "2rem 1.5rem",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                textAlign: "center",
                transition: "transform 0.2s, box-shadow 0.2s",
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLElement).style.transform = "translateY(-4px)";
                (e.currentTarget as HTMLElement).style.boxShadow = "0 8px 28px rgba(95,75,139,0.15)";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLElement).style.transform = "translateY(0)";
                (e.currentTarget as HTMLElement).style.boxShadow = "0 2px 16px rgba(95,75,139,0.08)";
              }}
            >
              {/* Profile picture placeholder */}
              <div style={{ width: "120px", marginBottom: "1.2rem" }}>
                <AvatarPlaceholder initials={initials.toUpperCase()} />
              </div>

              {/* Student ID badge */}
              <span
                style={{
                  display: "inline-block",
                  background: "#ede9f8",
                  color: "#5F4B8B",
                  fontSize: "0.78rem",
                  fontWeight: 600,
                  padding: "0.25rem 0.75rem",
                  borderRadius: "999px",
                  marginBottom: "0.6rem",
                  letterSpacing: "0.04em",
                }}
              >
                {member.id}
              </span>

              {/* Name */}
              <h2 style={{ fontSize: "1.05rem", fontWeight: 700, color: "#1a1a2e", margin: "0 0 0.25rem" }}>
                {member.name}
              </h2>

              {/* Role */}
              <p style={{ fontSize: "0.82rem", color: "#5F4B8B", fontWeight: 500, marginBottom: "0.8rem" }}>
                {member.role}
              </p>

              {/* Description */}
              <p style={{ fontSize: "0.82rem", color: "#716F71", lineHeight: 1.6 }}>
                {member.description}
              </p>
            </article>
          );
        })}
      </section>

      {/* Back to home */}
      <footer
        style={{ textAlign: "center", marginTop: "3rem" }}
        aria-label="Page navigation"
      >
        <Link
          href="/"
          style={{
            color: "#5F4B8B",
            textDecoration: "none",
            fontSize: "0.9rem",
            fontWeight: 500,
            borderBottom: "1px solid #5F4B8B",
            paddingBottom: "1px",
          }}
        >
          ← Back to Home
        </Link>
      </footer>
    </main>
  );
}

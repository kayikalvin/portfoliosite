/**
 * KALVIN KAYI — PROJECTS (Redesigned)
 *
 * Layout:
 *  — First project: full-width hero card, horizontal split, oversized type
 *  — Remaining: asymmetric 2-col grid (alternating wide/narrow)
 *
 * Interaction surprises:
 *  — GitHub button is hidden; slides in only on card hover (left edge)
 *  — Live link is the primary CTA — always visible
 *  — Docs link appears on hover as a quiet secondary
 *  — Featured card has a slow-scan "radar" ring animation
 *
 * No emoji metrics. Status lives in the type hierarchy, not a badge.
 */

import { Link } from "react-router-dom";
import { ExternalLink, Github, BookOpen, ArrowUpRight, Plus } from "lucide-react";
import { projects as staticProjects } from "../utils/utils";
import { useEffect, useState, useRef, useCallback } from "react";

const PAGE_SIZE = 6;

/* ─────────────────────────────────────────────
   SKELETON
───────────────────────────────────────────── */
function ProjectSkeleton() {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 3 }}>
      {/* Hero skeleton */}
      <div style={{
        border: "1px solid #1a1a1a", borderRadius: 20, background: "#0d0d0d",
        padding: "48px", height: 320, animation: "skshimmer 1.6s ease-in-out infinite",
      }}>
        <div style={{ height: 14, width: "12%", borderRadius: 4, background: "#1a1a1a", marginBottom: 24 }} />
        <div style={{ height: 52, width: "55%", borderRadius: 6, background: "#1a1a1a", marginBottom: 20 }} />
        <div style={{ height: 14, width: "70%", borderRadius: 4, background: "#1a1a1a", marginBottom: 10 }} />
        <div style={{ height: 14, width: "60%", borderRadius: 4, background: "#1a1a1a" }} />
      </div>
      {/* Grid skeleton */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 3, marginTop: 3 }}>
        {[0, 1, 2, 3].map(i => (
          <div key={i} style={{
            border: "1px solid #1a1a1a", borderRadius: 16, background: "#0d0d0d",
            padding: "32px 28px", height: 280, animation: "skshimmer 1.6s ease-in-out infinite",
            animationDelay: `${i * 0.1}s`,
          }}>
            <div style={{ height: 12, width: "40%", borderRadius: 4, background: "#1a1a1a", marginBottom: 20 }} />
            <div style={{ height: 28, width: "80%", borderRadius: 4, background: "#1a1a1a", marginBottom: 16 }} />
            <div style={{ height: 12, width: "90%", borderRadius: 4, background: "#1a1a1a", marginBottom: 8 }} />
            <div style={{ height: 12, width: "75%", borderRadius: 4, background: "#1a1a1a" }} />
          </div>
        ))}
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────
   TECH PILL
───────────────────────────────────────────── */
function TechPill({ name, featured }) {
  return (
    <span style={{
      fontFamily: "'DM Mono', monospace",
      fontSize: featured ? 11 : 10,
      letterSpacing: "0.06em",
      color: featured ? "#787878" : "#4a4a4a",
      padding: featured ? "6px 14px" : "4px 11px",
      border: `1px solid ${featured ? "#1f1f1f" : "#141414"}`,
      borderRadius: 20,
      background: "transparent",
      whiteSpace: "nowrap",
    }}>
      {name}
    </span>
  );
}

/* ─────────────────────────────────────────────
   RADAR RING — ambient animation on hero card
───────────────────────────────────────────── */
function RadarRing() {
  return (
    <div style={{
      position: "absolute",
      bottom: -60,
      right: -60,
      width: 280,
      height: 280,
      pointerEvents: "none",
      zIndex: 0,
    }}>
      {[0, 1, 2].map(i => (
        <div key={i} style={{
          position: "absolute",
          inset: 0,
          borderRadius: "50%",
          border: "1px solid rgba(200,242,65,0.08)",
          transform: `scale(${0.5 + i * 0.25})`,
          animation: `radarPulse 3s ease-out ${i * 1}s infinite`,
        }} />
      ))}
      <div style={{
        position: "absolute",
        inset: "40%",
        borderRadius: "50%",
        background: "radial-gradient(circle, rgba(200,242,65,0.06), transparent 70%)",
      }} />
    </div>
  );
}

/* ─────────────────────────────────────────────
   FEATURED HERO CARD — first project
───────────────────────────────────────────── */
function FeaturedCard({ project, visible }) {
  const [hov, setHov] = useState(false);
  const [githubHov, setGithubHov] = useState(false);
  const [liveHov,   setLiveHov]   = useState(false);
  const [docsHov,   setDocsHov]   = useState(false);

  return (
    <div
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        position: "relative",
        border: `1px solid ${hov ? "#2a2a2a" : "#161616"}`,
        borderRadius: 20,
        background: "#0c0c0c",
        padding: "clamp(32px, 5vw, 56px)",
        display: "grid",
        gridTemplateColumns: "1fr auto",
        gap: "clamp(32px, 4vw, 64px)",
        alignItems: "center",
        overflow: "hidden",
        opacity: visible ? 1 : 0,
        transform: visible ? "none" : "translateY(32px)",
        transition: "opacity 0.8s ease, transform 0.8s ease, border-color 0.3s ease",
        minHeight: 280,
      }}
    >
      <RadarRing />

      {/* Left — content */}
      <div style={{ position: "relative", zIndex: 1 }}>
        {/* Eyebrow */}
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 20 }}>
          <div style={{
            width: 6, height: 6, borderRadius: "50%",
            background: "#c8f241",
            boxShadow: hov ? "0 0 8px rgba(200,242,65,0.6)" : "none",
            transition: "box-shadow 0.4s ease",
          }} />
          <span style={{
            fontFamily: "'DM Mono', monospace",
            fontSize: 10,
            letterSpacing: "0.18em",
            color: "#c8f241",
            textTransform: "uppercase",
          }}>
            Featured work
          </span>
        </div>

        {/* Title */}
        <h3 style={{
          fontFamily: "'DM Serif Display', serif",
          fontSize: "clamp(2rem, 3.5vw, 3.2rem)",
          fontWeight: 400,
          lineHeight: 1.06,
          color: "#f0ede6",
          margin: "0 0 16px",
          letterSpacing: "-0.01em",
          maxWidth: "18ch",
        }}>
          {project.title}
        </h3>

        {/* Description */}
        <p style={{
          fontFamily: "'DM Sans', sans-serif",
          fontSize: "clamp(0.88rem, 1vw, 1rem)",
          lineHeight: 1.75,
          color: "#4a4a4a",
          maxWidth: 480,
          margin: "0 0 28px",
        }}>
          {project.description}
        </p>

        {/* Tech pills */}
        <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 36 }}>
          {project.tech?.slice(0, 5).map((t, i) => (
            <TechPill key={i} name={t} featured />
          ))}
          {project.tech?.length > 5 && (
            <span style={{
              fontFamily: "'DM Mono', monospace", fontSize: 11,
              color: "#2a2a2a", padding: "6px 14px",
              border: "1px solid #141414", borderRadius: 20,
            }}>
              +{project.tech.length - 5}
            </span>
          )}
        </div>

        {/* Actions */}
        <div style={{ display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap" }}>

          {/* GitHub — hidden, slides in on hover */}
          <div style={{
            maxWidth: hov ? 120 : 0,
            overflow: "hidden",
            opacity: hov ? 1 : 0,
            transition: "max-width 0.4s cubic-bezier(.23,1,.32,1), opacity 0.3s ease",
          }}>
            {project.code && (
              <a
                href={project.code}
                target="_blank"
                rel="noopener noreferrer"
                onMouseEnter={() => setGithubHov(true)}
                onMouseLeave={() => setGithubHov(false)}
                style={{
                  display: "inline-flex", alignItems: "center", gap: 7,
                  fontFamily: "'DM Mono', monospace", fontSize: 11,
                  letterSpacing: "0.08em", textTransform: "uppercase",
                  color: githubHov ? "#f0ede6" : "#3a3a3a",
                  textDecoration: "none",
                  padding: "10px 18px",
                  border: `1px solid ${githubHov ? "#3a3a3a" : "#1a1a1a"}`,
                  borderRadius: 40,
                  transition: "color 0.2s, border-color 0.2s",
                  whiteSpace: "nowrap",
                }}
              >
                <Github size={13} /> Code
              </a>
            )}
          </div>

          {/* Live link — always visible primary CTA */}
          {project.url && (
            <a
              href={project.url}
              target="_blank"
              rel="noopener noreferrer"
              onMouseEnter={() => setLiveHov(true)}
              onMouseLeave={() => setLiveHov(false)}
              style={{
                display: "inline-flex", alignItems: "center", gap: 8,
                fontFamily: "'DM Sans', sans-serif", fontSize: 14, fontWeight: 500,
                color: liveHov ? "#0a0a0a" : "#0a0a0a",
                background: liveHov ? "#d4f54a" : "#c8f241",
                padding: "12px 24px",
                borderRadius: 40,
                textDecoration: "none",
                border: "none",
                transition: "background 0.2s ease",
                whiteSpace: "nowrap",
              }}
            >
              View live <ArrowUpRight size={15} />
            </a>
          )}

          {/* Docs — always visible, quiet */}
          <Link
            to={`/projects/${encodeURIComponent(project.title)}/docs`}
            onMouseEnter={() => setDocsHov(true)}
            onMouseLeave={() => setDocsHov(false)}
            style={{
              display: "inline-flex", alignItems: "center", gap: 6,
              fontFamily: "'DM Mono', monospace", fontSize: 11,
              letterSpacing: "0.08em", textTransform: "uppercase",
              color: docsHov ? "#c8f241" : "#3a3a3a",
              textDecoration: "none",
              padding: "10px 18px",
              border: `1px solid ${docsHov ? "#c8f241" : "#1a1a1a"}`,
              borderRadius: 40,
              transition: "color 0.2s, border-color 0.2s",
              whiteSpace: "nowrap",
            }}
          >
            <BookOpen size={12} /> Docs <ArrowUpRight size={11} />
          </Link>
        </div>
      </div>

      {/* Right — project index + status column */}
      <div style={{
        position: "relative",
        zIndex: 1,
        display: "flex",
        flexDirection: "column",
        alignItems: "flex-end",
        gap: 12,
        alignSelf: "stretch",
        justifyContent: "space-between",
        borderLeft: "1px solid #111",
        paddingLeft: "clamp(24px, 3vw, 48px)",
        minWidth: "clamp(80px, 10vw, 120px)",
      }}>
        <span style={{
          fontFamily: "'DM Serif Display', serif",
          fontSize: "clamp(3rem, 6vw, 5.5rem)",
          fontWeight: 400,
          color: "#111",
          lineHeight: 1,
          userSelect: "none",
        }}>
          01
        </span>

        <div style={{ textAlign: "right" }}>
          <div style={{
            fontFamily: "'DM Mono', monospace",
            fontSize: 9,
            letterSpacing: "0.16em",
            textTransform: "uppercase",
            color: project.status === "active" || project.status === "in progress"
              ? "#c8f241" : "#3a3a3a",
            marginBottom: 4,
          }}>
            {project.status || "active"}
          </div>
          <div style={{
            fontFamily: "'DM Mono', monospace",
            fontSize: 9,
            letterSpacing: "0.12em",
            textTransform: "uppercase",
            color: "#1e1e1e",
          }}>
            {project.tech?.length || 0} technologies
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────
   REGULAR PROJECT CARD
───────────────────────────────────────────── */
function ProjectCard({ project, index, globalIndex, visible }) {
  const [hov,       setHov]       = useState(false);
  const [githubHov, setGithubHov] = useState(false);
  const [liveHov,   setLiveHov]   = useState(false);
  const [docsHov,   setDocsHov]   = useState(false);

  const delay = (index % PAGE_SIZE) * 0.07 + 0.12;

  return (
    <div
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        border: `1px solid ${hov ? "#222" : "#141414"}`,
        borderRadius: 16,
        background: hov ? "#0f0f0f" : "#0d0d0d",
        padding: "clamp(24px, 3vw, 36px)",
        display: "flex",
        flexDirection: "column",
        position: "relative",
        overflow: "hidden",
        opacity: visible ? 1 : 0,
        transform: visible ? "none" : "translateY(24px)",
        transition: `opacity 0.6s ease ${delay}s, transform 0.6s ease ${delay}s, border-color 0.25s, background 0.25s`,
      }}
    >
      {/* Corner accent — chartreuse glow on hover */}
      <div style={{
        position: "absolute",
        top: -50,
        right: -50,
        width: 150,
        height: 150,
        borderRadius: "50%",
        background: "radial-gradient(circle, rgba(200,242,65,0.07), transparent 70%)",
        opacity: hov ? 1 : 0,
        transition: "opacity 0.35s ease",
        pointerEvents: "none",
      }} />

      {/* Top row: index + status */}
      <div style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 20,
      }}>
        <span style={{
          fontFamily: "'DM Mono', monospace",
          fontSize: 10,
          color: "#1e1e1e",
          letterSpacing: "0.12em",
        }}>
          {String(globalIndex + 1).padStart(2, "0")}
        </span>
        <span style={{
          fontFamily: "'DM Mono', monospace",
          fontSize: 9,
          letterSpacing: "0.14em",
          textTransform: "uppercase",
          color: project.status === "active" || project.status === "in progress"
            ? "#c8f241" : "#2a2a2a",
        }}>
          {project.status || "active"}
        </span>
      </div>

      {/* Title */}
      <h3 style={{
        fontFamily: "'DM Serif Display', serif",
        fontSize: "clamp(1.15rem, 1.8vw, 1.5rem)",
        fontWeight: 400,
        lineHeight: 1.12,
        color: hov ? "#f0ede6" : "#c0bdb6",
        margin: "0 0 12px",
        transition: "color 0.22s",
      }}>
        {project.title}
      </h3>

      {/* Description */}
      <p style={{
        fontFamily: "'DM Sans', sans-serif",
        fontSize: 13,
        lineHeight: 1.72,
        color: "#404040",
        marginBottom: 20,
        display: "-webkit-box",
        WebkitLineClamp: 3,
        WebkitBoxOrient: "vertical",
        overflow: "hidden",
        flexGrow: 1,
      }}>
        {project.description}
      </p>

      {/* Tech pills */}
      <div style={{ display: "flex", flexWrap: "wrap", gap: 5, marginBottom: 24 }}>
        {project.tech?.slice(0, 3).map((t, i) => (
          <TechPill key={i} name={t} />
        ))}
        {project.tech?.length > 3 && (
          <span style={{
            fontFamily: "'DM Mono', monospace", fontSize: 10,
            color: "#222", padding: "4px 11px",
            border: "1px solid #141414", borderRadius: 20,
          }}>
            +{project.tech.length - 3}
          </span>
        )}
      </div>

      {/* Actions */}
      <div style={{
        marginTop: "auto",
        paddingTop: 18,
        borderTop: "1px solid #111",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        gap: 8,
      }}>

        {/* Left: GitHub hidden → slides in on hover */}
        <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
          <div style={{
            maxWidth: hov ? 90 : 0,
            overflow: "hidden",
            opacity: hov ? 1 : 0,
            transition: "max-width 0.38s cubic-bezier(.23,1,.32,1), opacity 0.28s ease",
          }}>
            {project.code && (
              <a
                href={project.code}
                target="_blank"
                rel="noopener noreferrer"
                onMouseEnter={() => setGithubHov(true)}
                onMouseLeave={() => setGithubHov(false)}
                title="Source code"
                style={{
                  display: "inline-flex", alignItems: "center", justifyContent: "center",
                  width: 32, height: 32,
                  border: `1px solid ${githubHov ? "#c8f241" : "#1e1e1e"}`,
                  borderRadius: "50%",
                  textDecoration: "none",
                  transition: "border-color 0.2s",
                  flexShrink: 0,
                }}
              >
                <Github size={13} color={githubHov ? "#c8f241" : "#5a5a5a"} style={{ transition: "color 0.2s" }} />
              </a>
            )}
          </div>

          {/* Live link */}
          {project.url && (
            <a
              href={project.url}
              target="_blank"
              rel="noopener noreferrer"
              onMouseEnter={() => setLiveHov(true)}
              onMouseLeave={() => setLiveHov(false)}
              title="Live demo"
              style={{
                display: "inline-flex", alignItems: "center", justifyContent: "center",
                width: 32, height: 32,
                border: `1px solid ${liveHov ? "#c8f241" : "#1e1e1e"}`,
                borderRadius: "50%",
                textDecoration: "none",
                transition: "border-color 0.2s",
              }}
            >
              <ExternalLink size={13} color={liveHov ? "#c8f241" : "#5a5a5a"} style={{ transition: "color 0.2s" }} />
            </a>
          )}
        </div>

        {/* Docs — appears on hover */}
        <Link
          to={`/projects/${encodeURIComponent(project.title)}/docs`}
          onMouseEnter={() => setDocsHov(true)}
          onMouseLeave={() => setDocsHov(false)}
          style={{
            display: "inline-flex", alignItems: "center", gap: 5,
            fontFamily: "'DM Mono', monospace", fontSize: 10,
            letterSpacing: "0.08em", textTransform: "uppercase",
            color: docsHov ? "#c8f241" : hov ? "#3a3a3a" : "#1e1e1e",
            textDecoration: "none",
            padding: "7px 14px",
            border: `1px solid ${docsHov ? "#c8f241" : hov ? "#1e1e1e" : "#111"}`,
            borderRadius: 40,
            transition: "color 0.2s, border-color 0.2s",
          }}
        >
          <BookOpen size={11} />
          Docs
          <ArrowUpRight size={10} />
        </Link>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────
   LOAD MORE
───────────────────────────────────────────── */
function LoadMoreBtn({ onClick, remaining }) {
  const [hov, setHov] = useState(false);
  return (
    <div style={{ display: "flex", justifyContent: "center", marginTop: 48 }}>
      <button
        onClick={onClick}
        onMouseEnter={() => setHov(true)}
        onMouseLeave={() => setHov(false)}
        style={{
          display: "inline-flex", alignItems: "center", gap: 10,
          fontFamily: "'DM Sans', sans-serif", fontSize: 14,
          color: hov ? "#0a0a0a" : "#f0ede6",
          background: hov ? "#c8f241" : "transparent",
          padding: "14px 30px", borderRadius: 40,
          border: `1.5px solid ${hov ? "#c8f241" : "#222"}`,
          cursor: "pointer",
          transition: "background 0.25s, color 0.25s, border-color 0.25s",
        }}
      >
        <Plus size={15} />
        Show more
        <span style={{
          fontFamily: "'DM Mono', monospace", fontSize: 10,
          color: hov ? "rgba(0,0,0,0.5)" : "#3a3a3a",
        }}>
          ({remaining} left)
        </span>
      </button>
    </div>
  );
}

/* ─────────────────────────────────────────────
   EMPTY STATE
───────────────────────────────────────────── */
function EmptyState() {
  return (
    <div style={{ textAlign: "center", padding: "10vh 0" }}>
      <p style={{
        fontFamily: "'DM Mono', monospace", fontSize: 10,
        letterSpacing: "0.18em", color: "#c8f241",
        textTransform: "uppercase", marginBottom: 20,
      }}>
        Nothing here yet
      </p>
      <h3 style={{
        fontFamily: "'DM Serif Display', serif",
        fontSize: "clamp(1.5rem, 3vw, 2.5rem)",
        fontWeight: 400, color: "#f0ede6", lineHeight: 1.2, marginBottom: 14,
      }}>
        Projects <em style={{ fontStyle: "italic" }}>incoming</em>
      </h3>
      <p style={{
        fontFamily: "'DM Sans', sans-serif",
        fontSize: 14, color: "#404040",
        maxWidth: 340, margin: "0 auto", lineHeight: 1.75,
      }}>
        Work appears here as it's published. Check GitHub for latest builds.
      </p>
    </div>
  );
}

/* ─────────────────────────────────────────────
   MAIN EXPORT
───────────────────────────────────────────── */
const Projects = () => {
  const [projects, setProjects] = useState(staticProjects || []);
  const [loading,  setLoading]  = useState(true);
  const [visible,  setVisible]  = useState(false);
  const [count,    setCount]    = useState(PAGE_SIZE);
  const gridRef = useRef(null);

  useEffect(() => {
    let mounted = true;
    setLoading(true);
    const t = setTimeout(() => {
      fetch("http://localhost:4000/api/projects")
        .then(r => { if (!r.ok) throw new Error(); return r.json(); })
        .then(data => { if (mounted && Array.isArray(data) && data.length) setProjects(data); })
        .catch(() => {})
        .finally(() => mounted && setLoading(false));
    }, 500);
    return () => { mounted = false; clearTimeout(t); };
  }, []);

  useEffect(() => {
    const obs = new IntersectionObserver(
      ([e]) => e.isIntersecting && setVisible(true),
      { threshold: 0.04 }
    );
    if (gridRef.current) obs.observe(gridRef.current);
    return () => obs.disconnect();
  }, [loading]);

  const featured  = projects[0];
  const rest      = projects.slice(1, count);
  const remaining = projects.length - count;

  return (
    <div ref={gridRef}>
      {loading ? (
        <ProjectSkeleton />
      ) : projects.length === 0 ? (
        <EmptyState />
      ) : (
        <>
          {/* Featured hero card */}
          {featured && (
            <FeaturedCard project={featured} visible={visible} />
          )}

          {/* Rest: asymmetric 2-col grid */}
          {rest.length > 0 && (
            <div style={{
              display: "grid",
              gridTemplateColumns: "repeat(2, 1fr)",
              gap: 3,
              marginTop: 3,
            }}>
              {rest.map((project, i) => (
                <ProjectCard
                  key={project.id || project.title || i}
                  project={project}
                  index={i}
                  globalIndex={i + 1}
                  visible={visible}
                />
              ))}
            </div>
          )}

          {remaining > 0 && (
            <LoadMoreBtn
              onClick={() => setCount(c => Math.min(c + PAGE_SIZE, projects.length))}
              remaining={remaining}
            />
          )}
        </>
      )}

      <style>{`
        @keyframes skshimmer {
          0%,100% { opacity: 1; }
          50%      { opacity: 0.45; }
        }
        @keyframes radarPulse {
          0%   { opacity: 0.6; transform: scale(var(--s, 1)); }
          100% { opacity: 0;   transform: scale(calc(var(--s, 1) * 1.4)); }
        }
        a, button { cursor: none !important; }
        @media (max-width: 680px) {
          #projects-grid { grid-template-columns: 1fr !important; }
        }
        @media (prefers-reduced-motion: reduce) {
          * { animation: none !important; transition: none !important; }
        }
      `}</style>
    </div>
  );
};

export default Projects;
/**
 * KALVIN KAYI — PROJECT DOCS (Structural Rebuild)
 * Design system: "Machine Precision / Human Warmth"
 *
 * ── Design plan ──
 * The previous version was sidebar-of-facts + tabbed-panel — a generic
 * SaaS-docs template, disconnected from the rest of the site's editorial
 * language (asymmetric overlap on About, orbital diagram on Skills, radar
 * ring on Projects).
 *
 * New structure: a vertical "dossier" scroll. No tabs. No sidebar. The
 * case study is read top to bottom as ordered sections — Brief, Docs,
 * Overview, Stack — each introduced by a large serif label, separated by
 * hairline rules, consistent with how About and Skills are built.
 *
 * Signature element: a sticky progress rail running down the left edge.
 * A thin vertical line fills with chartreuse as the reader scrolls
 * through the case study, with small tick labels marking each section —
 * the page visualizes its own reading progress. This replaces the old
 * sidebar entirely; quick links (GitHub/Live) move into the top nav and
 * the hero block instead.
 *
 * Functional fixes carried over from the previous refactor pass:
 *  - all array reads (tech/features/challenges) are guarded with fallbacks
 *  - copy-to-clipboard state is tracked per code block, not globally
 *  - custom cursor only activates for real mouse input, never blocks
 *    keyboard/touch, and respects prefers-reduced-motion
 *  - category guesser pulled into a named, ordered, readable function
 */

import { useParams } from "react-router-dom";
import { projects as staticProjects } from "../utils/utils";
import { useEffect, useState, useRef, useCallback, useMemo } from "react";
import {
  Github,
  ArrowLeft,
  Calendar,
  Clock,
  Users,
  Star,
  Code,
  ChevronRight,
  Copy,
  Check,
  Globe,
} from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeHighlight from "rehype-highlight";
import "highlight.js/styles/github-dark.css";

/* ─────────────────────────────────────────────
   DESIGN TOKENS
───────────────────────────────────────────── */
const COLOR = {
  ink:      "#0a0a0a",
  panel:    "#0d0d0d",
  panelAlt: "#0f0f0f",
  border:   "#1a1a1a",
  borderHi: "#1f1f1f",
  text:     "#f0ede6",
  textDim:  "#a0a0a0",
  textMute: "#6b6b6b",
  textFaint:"#3a3a3a",
  accent:   "#c8f241",
};

const FONT = {
  display: "'DM Serif Display', serif",
  body:    "'DM Sans', sans-serif",
  mono:    "'DM Mono', monospace",
};

/* Reading order — drives both the rail ticks and the section render order. */
const SECTIONS = [
  { id: "brief",     index: "01", label: "Brief" },
  { id: "docs",      index: "02", label: "Documentation" },
  { id: "overview",  index: "03", label: "Overview" },
  { id: "stack",     index: "04", label: "Stack" },
];

/* ─────────────────────────────────────────────
   PURE HELPERS
───────────────────────────────────────────── */
function categorizeTech(tech) {
  const t = tech.toLowerCase();
  const rules = [
    { test: (s) => s.includes("react") || s.includes("next") || s.includes("vue"), label: "Frontend" },
    { test: (s) => s.includes("python") || s.includes("tensorflow") || s.includes("torch") || s.includes("scikit"), label: "ML / AI" },
    { test: (s) => s.includes("node") || s.includes("fastapi") || s.includes("api") || s.includes("graphql"), label: "Backend" },
    { test: (s) => s.includes("aws") || s.includes("gcp") || s.includes("docker") || s.includes("kubernetes"), label: "Infrastructure" },
  ];
  return rules.find((r) => r.test(t))?.label ?? "Core";
}

function fadeUp(entered, delay = 0) {
  return {
    opacity: entered ? 1 : 0,
    transform: entered ? "translateY(0)" : "translateY(20px)",
    transition: `opacity 0.7s ease ${delay}s, transform 0.7s ease ${delay}s`,
  };
}

/* ─────────────────────────────────────────────
   HOOKS
───────────────────────────────────────────── */
function useFonts() {
  useEffect(() => {
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href =
      "https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;1,9..40,300&family=DM+Mono:wght@400;500&display=swap";
    document.head.appendChild(link);
    return () => document.head.removeChild(link);
  }, []);
}

function usePointerActive() {
  const [active, setActive] = useState(false);
  useEffect(() => {
    const onMouseMove = () => setActive(true);
    const onTouch = () => setActive(false);
    const onKey = (e) => { if (e.key === "Tab") setActive(false); };
    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("touchstart", onTouch);
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("touchstart", onTouch);
      window.removeEventListener("keydown", onKey);
    };
  }, []);
  return active;
}

function usePrefersReducedMotion() {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduced(mq.matches);
    const onChange = (e) => setReduced(e.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);
  return reduced;
}

/** Tracks overall scroll progress through the case study (0–1) and which
 *  section is currently most visible. Drives the progress rail. */
function useScrollProgress(sectionIds) {
  const [progress, setProgress] = useState(0);
  const [activeId, setActiveId] = useState(sectionIds[0]);
  const refs = useRef({});

  const register = useCallback((id) => (el) => {
    if (el) refs.current[id] = el;
  }, []);

  useEffect(() => {
    const onScroll = () => {
      const docEl = document.documentElement;
      const scrollTop = window.scrollY;
      const scrollHeight = docEl.scrollHeight - window.innerHeight;
      setProgress(scrollHeight > 0 ? Math.min(1, Math.max(0, scrollTop / scrollHeight)) : 0);

      const triggerY = window.innerHeight * 0.3;
      let current = sectionIds[0];
      for (const id of sectionIds) {
        const el = refs.current[id];
        if (!el) continue;
        const top = el.getBoundingClientRect().top;
        if (top <= triggerY) current = id;
      }
      setActiveId(current);
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, [sectionIds]);

  return { progress, activeId, register };
}

/* ─────────────────────────────────────────────
   CUSTOM CURSOR
───────────────────────────────────────────── */
function CustomCursor({ enabled }) {
  const dotRef = useRef(null);
  const ringRef = useRef(null);
  const pos = useRef({ x: -100, y: -100 });
  const ring = useRef({ x: -100, y: -100 });
  const raf = useRef(null);
  const [hovered, setHovered] = useState(false);

  useEffect(() => {
    if (!enabled) return;
    const move = (e) => { pos.current = { x: e.clientX, y: e.clientY }; };
    const over = (e) => { if (e.target.closest("a, button, [data-cursor-expand]")) setHovered(true); };
    const out = () => setHovered(false);

    window.addEventListener("mousemove", move);
    document.addEventListener("mouseover", over);
    document.addEventListener("mouseout", out);

    const loop = () => {
      ring.current.x += (pos.current.x - ring.current.x) * 0.12;
      ring.current.y += (pos.current.y - ring.current.y) * 0.12;
      if (dotRef.current) dotRef.current.style.transform = `translate(${pos.current.x}px, ${pos.current.y}px) translate(-50%,-50%)`;
      if (ringRef.current) ringRef.current.style.transform = `translate(${ring.current.x}px, ${ring.current.y}px) translate(-50%,-50%) scale(${hovered ? 2.5 : 1})`;
      raf.current = requestAnimationFrame(loop);
    };
    raf.current = requestAnimationFrame(loop);

    return () => {
      window.removeEventListener("mousemove", move);
      document.removeEventListener("mouseover", over);
      document.removeEventListener("mouseout", out);
      cancelAnimationFrame(raf.current);
    };
  }, [hovered, enabled]);

  if (!enabled) return null;
  return (
    <>
      <div ref={dotRef} style={{ position: "fixed", top: 0, left: 0, width: 8, height: 8, borderRadius: "50%", background: COLOR.accent, pointerEvents: "none", zIndex: 9999, willChange: "transform" }} />
      <div ref={ringRef} style={{ position: "fixed", top: 0, left: 0, width: 36, height: 36, borderRadius: "50%", border: "1.5px solid rgba(200,242,65,0.4)", pointerEvents: "none", zIndex: 9998, willChange: "transform", transition: "transform 0.15s ease, opacity 0.2s" }} />
    </>
  );
}

function NoiseOverlay() {
  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 1, pointerEvents: "none", opacity: 0.035, backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`, backgroundSize: "200px 200px" }} />
  );
}

function MagneticBtn({ children, href, target, onClick, style, onMouseEnter, onMouseLeave }) {
  const ref = useRef(null);
  const onMove = useCallback((e) => {
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const x = e.clientX - (r.left + r.width / 2);
    const y = e.clientY - (r.top + r.height / 2);
    el.style.transform = `translate(${x * 0.25}px, ${y * 0.25}px)`;
  }, []);
  const onLeave = useCallback((e) => {
    if (ref.current) ref.current.style.transform = "translate(0,0)";
    onMouseLeave?.(e);
  }, [onMouseLeave]);
  const Tag = href ? "a" : "button";
  return (
    <Tag
      ref={ref} href={href} target={target}
      rel={target === "_blank" ? "noopener noreferrer" : undefined}
      onClick={onClick}
      style={{ display: "inline-flex", transition: "transform 0.3s cubic-bezier(.23,1,.32,1)", ...style }}
      onMouseMove={onMove} onMouseLeave={onLeave} onMouseEnter={onMouseEnter}
    >
      {children}
    </Tag>
  );
}

/* ─────────────────────────────────────────────
   PROGRESS RAIL — the signature element
   Sticky vertical line, fills with chartreuse as the page scrolls,
   with section ticks the reader can click to jump.
───────────────────────────────────────────── */
function ProgressRail({ progress, activeId, entered }) {
  const scrollToSection = (id) => {
    const el = document.getElementById(`section-${id}`);
    if (el) {
      const y = el.getBoundingClientRect().top + window.scrollY - 100;
      window.scrollTo({ top: y, behavior: "smooth" });
    }
  };

  return (
    <div
      className="progress-rail"
      style={{
        position: "fixed",
        left: "3.2vw",
        top: "50%",
        transform: "translateY(-50%)",
        zIndex: 40,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        opacity: entered ? 1 : 0,
        transition: "opacity 0.8s ease 0.6s",
      }}
    >
      <div style={{ position: "relative", width: 2, height: 220, background: COLOR.border, borderRadius: 2 }}>
        <div style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: `${progress * 100}%`,
          background: COLOR.accent,
          borderRadius: 2,
          transition: "height 0.1s linear",
          boxShadow: "0 0 8px rgba(200,242,65,0.4)",
        }} />

        {SECTIONS.map((s, i) => {
          const topPct = (i / (SECTIONS.length - 1)) * 100;
          const isActive = activeId === s.id;
          return (
            <button
              key={s.id}
              onClick={() => scrollToSection(s.id)}
              aria-label={`Jump to ${s.label}`}
              style={{
                position: "absolute",
                left: "50%",
                top: `${topPct}%`,
                transform: "translate(-50%, -50%)",
                width: isActive ? 12 : 7,
                height: isActive ? 12 : 7,
                borderRadius: "50%",
                border: `1.5px solid ${isActive ? COLOR.accent : COLOR.textFaint}`,
                background: isActive ? COLOR.accent : COLOR.ink,
                cursor: "pointer",
                transition: "width 0.25s ease, height 0.25s ease, border-color 0.25s ease, background 0.25s ease",
                padding: 0,
              }}
            />
          );
        })}
      </div>

      <div style={{
        position: "absolute",
        left: "calc(100% + 16px)",
        top: `${(SECTIONS.findIndex((s) => s.id === activeId) / (SECTIONS.length - 1)) * 100}%`,
        transform: "translateY(-50%)",
        whiteSpace: "nowrap",
        transition: "top 0.3s ease",
      }}>
        <span style={{
          fontFamily: FONT.mono,
          fontSize: 10,
          letterSpacing: "0.14em",
          textTransform: "uppercase",
          color: COLOR.accent,
        }}>
          {SECTIONS.find((s) => s.id === activeId)?.index} · {SECTIONS.find((s) => s.id === activeId)?.label}
        </span>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────
   SECTION HEADER
───────────────────────────────────────────── */
function SectionHeader({ index, label, sub }) {
  return (
    <div style={{ display: "flex", alignItems: "baseline", gap: 20, marginBottom: 40 }}>
      <span style={{
        fontFamily: FONT.display,
        fontSize: "clamp(2.2rem, 4vw, 3.4rem)",
        color: COLOR.border,
        lineHeight: 1,
        userSelect: "none",
        flexShrink: 0,
      }}>
        {index}
      </span>
      <div>
        <h2 style={{
          fontFamily: FONT.display,
          fontSize: "clamp(1.8rem, 3vw, 2.6rem)",
          fontWeight: 400,
          color: COLOR.text,
          lineHeight: 1.1,
          margin: 0,
        }}>
          {label}
        </h2>
        {sub && (
          <p style={{ fontFamily: FONT.body, fontSize: 14, color: COLOR.textMute, marginTop: 8, maxWidth: 480 }}>
            {sub}
          </p>
        )}
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────
   LOADING / NOT FOUND
───────────────────────────────────────────── */
function LoadingScreen() {
  return (
    <div style={{ minHeight: "100vh", background: COLOR.ink, display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column", gap: 24 }}>
      <div style={{ width: 48, height: 48, border: `1.5px solid ${COLOR.borderHi}`, borderTop: `1.5px solid ${COLOR.accent}`, borderRadius: "50%", animation: "spin 0.8s linear infinite" }} />
      <span style={{ fontFamily: FONT.mono, fontSize: 11, letterSpacing: "0.15em", color: COLOR.textMute, textTransform: "uppercase" }}>Loading project</span>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}

function NotFound() {
  return (
    <div style={{ minHeight: "100vh", background: COLOR.ink, display: "flex", alignItems: "center", justifyContent: "center", padding: "0 5vw" }}>
      <div style={{ textAlign: "center", maxWidth: 480 }}>
        <p style={{ fontFamily: FONT.mono, fontSize: 11, letterSpacing: "0.15em", color: COLOR.accent, textTransform: "uppercase", marginBottom: 24 }}>404</p>
        <h2 style={{ fontFamily: FONT.display, fontSize: "clamp(2.5rem, 5vw, 4rem)", fontWeight: 400, color: COLOR.text, lineHeight: 1.1, marginBottom: 16 }}>
          Project not <span style={{ fontStyle: "italic", color: COLOR.accent }}>found</span>
        </h2>
        <p style={{ fontFamily: FONT.body, fontSize: 15, color: COLOR.textMute, lineHeight: 1.7, marginBottom: 40 }}>
          This project doesn't exist or has been moved.
        </p>
        <MagneticBtn href="/" style={{ fontFamily: FONT.body, fontSize: 14, fontWeight: 500, padding: "14px 28px", background: COLOR.accent, color: COLOR.ink, borderRadius: 40, textDecoration: "none", alignItems: "center", gap: 8 }}>
          <ArrowLeft size={16} style={{ marginRight: 8 }} />
          Back to home
        </MagneticBtn>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────
   MAIN COMPONENT
───────────────────────────────────────────── */
const ProjectDocs = () => {
  useFonts();

  const { projectId } = useParams();
  const decodedId = projectId ? decodeURIComponent(projectId) : "";
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [copiedBlockId, setCopiedBlockId] = useState(null);
  const [entered, setEntered] = useState(false);

  const pointerActive = usePointerActive();
  const reducedMotion = usePrefersReducedMotion();
  const cursorEnabled = pointerActive && !reducedMotion;

  const sectionIds = useMemo(() => SECTIONS.map((s) => s.id), []);
  const { progress, activeId, register } = useScrollProgress(sectionIds);

  useEffect(() => {
    const t = setTimeout(() => setEntered(true), 100);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    const foundProject = staticProjects.find((p) => p.title === decodedId);
    setProject(foundProject || null);
    let mounted = true;
    setLoading(true);

    const timeoutId = setTimeout(() => {
      if (!projectId) { setLoading(false); return; }
      fetch(`http://localhost:4000/api/projects/${encodeURIComponent(decodedId)}`)
        .then((r) => { if (!r.ok) throw new Error("notfound"); return r.json(); })
        .then((data) => { if (mounted) setProject(data); })
        .catch(() => {})
        .finally(() => mounted && setLoading(false));
    }, 500);

    return () => { mounted = false; clearTimeout(timeoutId); };
  }, [projectId, decodedId]);

  const copyToClipboard = useCallback((text, blockId) => {
    navigator.clipboard.writeText(text);
    setCopiedBlockId(blockId);
    setTimeout(() => setCopiedBlockId((id) => (id === blockId ? null : id)), 2000);
  }, []);

  const codeBlockCounter = useRef(0);
  useEffect(() => { codeBlockCounter.current = 0; }, [project]);

  const markdownComponents = useMemo(() => ({
    h1: ({ children }) => (
      <h1 style={{ fontFamily: FONT.display, fontSize: "clamp(1.8rem, 3vw, 2.6rem)", fontWeight: 400, color: COLOR.text, lineHeight: 1.1, marginBottom: 28, paddingBottom: 18, borderBottom: `1px solid ${COLOR.borderHi}` }}>{children}</h1>
    ),
    h2: ({ children }) => (
      <h2 style={{ fontFamily: FONT.display, fontSize: "clamp(1.3rem, 2.2vw, 1.8rem)", fontWeight: 400, color: COLOR.text, lineHeight: 1.15, marginTop: 44, marginBottom: 18, display: "flex", alignItems: "center", gap: 10 }}>
        <ChevronRight size={17} color={COLOR.accent} />{children}
      </h2>
    ),
    h3: ({ children }) => (
      <h3 style={{ fontFamily: FONT.body, fontSize: "1.05rem", fontWeight: 500, color: "#d0d0d0", marginTop: 28, marginBottom: 12, letterSpacing: "0.02em" }}>{children}</h3>
    ),
    p: ({ children }) => (
      <p style={{ fontFamily: FONT.body, fontSize: "clamp(0.92rem, 1.1vw, 1rem)", lineHeight: 1.8, color: COLOR.textDim, marginBottom: 18 }}>{children}</p>
    ),
    ul: ({ children }) => <ul style={{ marginBottom: 18, paddingLeft: 0, listStyle: "none" }}>{children}</ul>,
    ol: ({ children }) => <ol style={{ marginBottom: 18, paddingLeft: 0, listStyle: "none" }}>{children}</ol>,
    li: ({ children }) => (
      <li style={{ display: "flex", alignItems: "flex-start", gap: 12, marginBottom: 10, fontFamily: FONT.body, fontSize: "clamp(0.92rem, 1.1vw, 1rem)", lineHeight: 1.7, color: COLOR.textDim }}>
        <span style={{ width: 6, height: 6, borderRadius: "50%", background: COLOR.accent, flexShrink: 0, marginTop: 9 }} />
        <span>{children}</span>
      </li>
    ),
    strong: ({ children }) => <strong style={{ color: COLOR.text, fontWeight: 500 }}>{children}</strong>,
    code: ({ children, className, inline }) => {
      if (inline) {
        return (
          <code style={{ fontFamily: FONT.mono, fontSize: "0.85em", background: "#111", color: COLOR.accent, padding: "2px 8px", borderRadius: 4, border: `1px solid ${COLOR.borderHi}` }}>{children}</code>
        );
      }
      const codeString = String(children).replace(/\n$/, "");
      const blockId = `code-${codeBlockCounter.current++}`;
      const isCopied = copiedBlockId === blockId;
      return (
        <div style={{ position: "relative", marginBottom: 22, borderRadius: 12, overflow: "hidden", border: `1px solid ${COLOR.borderHi}` }} className="code-block-group">
          <pre style={{ background: COLOR.panel, padding: "22px 26px", overflowX: "auto", margin: 0 }}>
            <code className={className} style={{ fontFamily: FONT.mono, fontSize: 13 }}>{children}</code>
          </pre>
          <button
            onClick={() => copyToClipboard(codeString, blockId)}
            className="copy-btn"
            aria-label={isCopied ? "Copied to clipboard" : "Copy code to clipboard"}
            style={{ position: "absolute", top: 12, right: 12, display: "flex", alignItems: "center", gap: 6, fontFamily: FONT.mono, fontSize: 11, letterSpacing: "0.08em", color: isCopied ? COLOR.accent : COLOR.textMute, background: "#111", border: `1px solid ${isCopied ? COLOR.accent : COLOR.borderHi}`, borderRadius: 6, padding: "6px 12px", transition: "color 0.2s, border-color 0.2s", opacity: 0 }}
            onMouseEnter={(e) => { if (!isCopied) { e.currentTarget.style.color = COLOR.accent; e.currentTarget.style.borderColor = COLOR.accent; } }}
            onMouseLeave={(e) => { if (!isCopied) { e.currentTarget.style.color = COLOR.textMute; e.currentTarget.style.borderColor = COLOR.borderHi; } }}
          >
            {isCopied ? <Check size={13} /> : <Copy size={13} />}
            {isCopied ? "Copied" : "Copy"}
          </button>
        </div>
      );
    },
    pre: ({ children }) => <>{children}</>,
    blockquote: ({ children }) => (
      <blockquote style={{ borderLeft: `2px solid ${COLOR.accent}`, paddingLeft: 22, paddingTop: 4, paddingBottom: 4, marginBottom: 18, fontFamily: FONT.display, fontStyle: "italic", color: COLOR.textMute, fontSize: "1rem", lineHeight: 1.7 }}>{children}</blockquote>
    ),
    a: ({ children, href }) => (
      <a href={href} target="_blank" rel="noopener noreferrer" style={{ color: COLOR.accent, textDecoration: "none", borderBottom: "1px solid rgba(200,242,65,0.3)", transition: "border-color 0.2s" }}
        onMouseEnter={(e) => { e.currentTarget.style.borderColor = COLOR.accent; }}
        onMouseLeave={(e) => { e.currentTarget.style.borderColor = "rgba(200,242,65,0.3)"; }}>
        {children}
      </a>
    ),
    table: ({ children }) => (
      <div style={{ overflowX: "auto", marginBottom: 22, border: `1px solid ${COLOR.borderHi}`, borderRadius: 12 }}>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>{children}</table>
      </div>
    ),
    thead: ({ children }) => <thead style={{ background: COLOR.panel }}>{children}</thead>,
    tbody: ({ children }) => <tbody>{children}</tbody>,
    tr: ({ children }) => <tr style={{ borderBottom: `1px solid ${COLOR.borderHi}` }}>{children}</tr>,
    th: ({ children }) => <th style={{ padding: "13px 18px", textAlign: "left", fontFamily: FONT.mono, fontSize: 11, letterSpacing: "0.1em", textTransform: "uppercase", color: COLOR.textMute }}>{children}</th>,
    td: ({ children }) => <td style={{ padding: "13px 18px", fontFamily: FONT.body, fontSize: 14, color: COLOR.textDim }}>{children}</td>,
    img: ({ src, alt }) => (
      <div style={{ marginBottom: 22, borderRadius: 12, overflow: "hidden", border: `1px solid ${COLOR.borderHi}` }}>
        <img src={src} alt={alt} loading="lazy" style={{ width: "100%", height: "auto", display: "block" }} />
        {alt && <div style={{ padding: "10px 16px", fontFamily: FONT.mono, fontSize: 11, color: COLOR.textMute, borderTop: `1px solid ${COLOR.borderHi}`, letterSpacing: "0.05em" }}>{alt}</div>}
      </div>
    ),
  }), [copiedBlockId, copyToClipboard]);

  if (loading) return <LoadingScreen />;
  if (!project) return <NotFound />;

  const tech       = project.tech ?? [];
  const features   = project.features ?? [];
  const challenges = project.challenges ?? [];

  const metaStats = [
    { icon: Calendar, label: "Created",      value: project.createdAt || "2024" },
    { icon: Clock,     label: "Status",       value: project.status || "active" },
    project.stats?.stars        && { icon: Star,  label: "Stars",        value: project.stats.stars },
    project.stats?.contributors && { icon: Users, label: "Contributors", value: project.stats.contributors },
  ].filter(Boolean);

  return (
    <div style={{ background: COLOR.ink, color: COLOR.text, minHeight: "100vh", cursor: cursorEnabled ? "none" : "auto" }}>
      <CustomCursor enabled={cursorEnabled} />
      <NoiseOverlay />
      <ProgressRail progress={progress} activeId={activeId} entered={entered} />

      {/* ── Top nav ── */}
      <div style={{ position: "sticky", top: 0, zIndex: 50, background: "rgba(10,10,10,0.95)", backdropFilter: "blur(12px)", borderBottom: `1px solid ${COLOR.border}` }}>
        <div style={{ maxWidth: 1100, margin: "0 auto", padding: "0 5vw", display: "flex", alignItems: "center", justifyContent: "space-between", height: 60 }}>
          <MagneticBtn
            href="/"
            style={{ display: "inline-flex", alignItems: "center", gap: 10, fontFamily: FONT.body, fontSize: 13, color: COLOR.textMute, textDecoration: "none", padding: "8px 16px", border: `1px solid ${COLOR.borderHi}`, borderRadius: 40, transition: "color 0.2s, border-color 0.2s" }}
            onMouseEnter={(e) => { e.currentTarget.style.color = COLOR.text; e.currentTarget.style.borderColor = COLOR.text; }}
            onMouseLeave={(e) => { e.currentTarget.style.color = COLOR.textMute; e.currentTarget.style.borderColor = COLOR.borderHi; }}
          >
            <ArrowLeft size={14} /> Portfolio
          </MagneticBtn>

          <div style={{ display: "flex", gap: 12 }}>
            {project.code && (
              <MagneticBtn
                href={project.code} target="_blank"
                style={{ display: "inline-flex", alignItems: "center", gap: 8, fontFamily: FONT.body, fontSize: 13, color: COLOR.textMute, textDecoration: "none", padding: "8px 16px", border: `1px solid ${COLOR.borderHi}`, borderRadius: 40, transition: "color 0.2s, border-color 0.2s" }}
                onMouseEnter={(e) => { e.currentTarget.style.color = COLOR.accent; e.currentTarget.style.borderColor = COLOR.accent; }}
                onMouseLeave={(e) => { e.currentTarget.style.color = COLOR.textMute; e.currentTarget.style.borderColor = COLOR.borderHi; }}
              >
                <Github size={14} /> <span>Code</span>
              </MagneticBtn>
            )}
            {project.url && (
              <MagneticBtn
                href={project.url} target="_blank"
                style={{ display: "inline-flex", alignItems: "center", gap: 8, fontFamily: FONT.body, fontSize: 13, fontWeight: 500, color: COLOR.ink, textDecoration: "none", padding: "8px 16px", background: COLOR.accent, borderRadius: 40 }}
              >
                <Globe size={14} /> <span>Live</span>
              </MagneticBtn>
            )}
          </div>
        </div>
      </div>

      {/* ── Hero block: title + horizontal stat strip ── */}
      <div style={{ borderBottom: `1px solid ${COLOR.border}`, position: "relative", zIndex: 2 }}>
        <div style={{ maxWidth: 1100, margin: "0 auto", padding: "8vh 5vw 6vh" }}>
          <p style={{ fontFamily: FONT.mono, fontSize: 11, letterSpacing: "0.15em", color: COLOR.accent, textTransform: "uppercase", marginBottom: 18, ...fadeUp(entered, 0.05) }}>
            Case Study
          </p>
          <h1 style={{ fontFamily: FONT.display, fontSize: "clamp(2.4rem, 5.5vw, 4.6rem)", fontWeight: 400, lineHeight: 1.04, color: COLOR.text, marginBottom: 36, maxWidth: "20ch", ...fadeUp(entered, 0.1) }}>
            {project.title}
          </h1>

          <div style={{ display: "flex", alignItems: "center", flexWrap: "wrap", gap: 0, ...fadeUp(entered, 0.2) }}>
            {metaStats.map((stat, i) => (
              <div key={stat.label} style={{ display: "flex", flexDirection: "column", gap: 6, padding: i === 0 ? "0 28px 0 0" : "0 28px", borderRight: i < metaStats.length - 1 ? `1px solid ${COLOR.border}` : "none" }}>
                <span style={{ fontFamily: FONT.display, fontSize: "1.5rem", color: COLOR.text, lineHeight: 1 }}>
                  {stat.value}
                </span>
                <span style={{ fontFamily: FONT.mono, fontSize: 9, color: COLOR.textFaint, textTransform: "uppercase", letterSpacing: "0.1em", whiteSpace: "nowrap" }}>
                  {stat.label}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Vertical dossier: sequential sections, no tabs, no sidebar ── */}
      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "0 5vw" }} className="docs-body">

        <section id="section-brief" ref={register("brief")} style={{ padding: "10vh 0", borderBottom: `1px solid ${COLOR.border}` }}>
          <SectionHeader index="01" label="Brief" />
          <p style={{ fontFamily: FONT.body, fontSize: "clamp(1.05rem, 1.5vw, 1.3rem)", lineHeight: 1.85, color: COLOR.textDim, maxWidth: 680 }}>
            {project.description || "No description provided yet."}
          </p>
        </section>

        <section id="section-docs" ref={register("docs")} style={{ padding: "10vh 0", borderBottom: `1px solid ${COLOR.border}` }}>
          <SectionHeader index="02" label="Documentation" sub="How it's built, and how to run it." />
          {project.markdown ? (
            <div style={{ maxWidth: 720 }}>
              <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeHighlight]} components={markdownComponents}>
                {project.markdown}
              </ReactMarkdown>
            </div>
          ) : (
            <div style={{ padding: "4vh 0" }}>
              <p style={{ fontFamily: FONT.mono, fontSize: 11, letterSpacing: "0.15em", color: COLOR.accent, textTransform: "uppercase", marginBottom: 18 }}>Coming soon</p>
              <h3 style={{ fontFamily: FONT.display, fontSize: "clamp(1.6rem, 2.8vw, 2.2rem)", fontWeight: 400, color: COLOR.text, lineHeight: 1.2, marginBottom: 14 }}>
                Documentation in <span style={{ fontStyle: "italic" }}>progress</span>
              </h3>
              <p style={{ fontFamily: FONT.body, fontSize: 15, color: COLOR.textMute, maxWidth: 460, lineHeight: 1.7 }}>
                Comprehensive docs for this project are being written. Check the GitHub repo in the meantime.
              </p>
            </div>
          )}
        </section>

        <section id="section-overview" ref={register("overview")} style={{ padding: "10vh 0", borderBottom: `1px solid ${COLOR.border}` }}>
          <SectionHeader index="03" label="Overview" sub="What it does, and what it took to get there." />

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 48 }} className="overview-grid">
            <div>
              <p style={{ fontFamily: FONT.mono, fontSize: 11, letterSpacing: "0.12em", textTransform: "uppercase", color: COLOR.textMute, marginBottom: 22, paddingBottom: 14, borderBottom: `1px solid ${COLOR.border}` }}>
                Key features
              </p>
              {features.length > 0 ? (
                <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                  {features.map((feature, i) => (
                    <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: 12 }}>
                      <span style={{ width: 6, height: 6, borderRadius: "50%", background: COLOR.accent, flexShrink: 0, marginTop: 8 }} />
                      <span style={{ fontFamily: FONT.body, fontSize: 14, color: COLOR.textDim, lineHeight: 1.6 }}>{feature}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <span style={{ fontFamily: FONT.body, fontSize: 14, color: COLOR.textFaint }}>No features listed.</span>
              )}
            </div>

            <div>
              <p style={{ fontFamily: FONT.mono, fontSize: 11, letterSpacing: "0.12em", textTransform: "uppercase", color: COLOR.textMute, marginBottom: 22, paddingBottom: 14, borderBottom: `1px solid ${COLOR.border}` }}>
                Challenges solved
              </p>
              {challenges.length > 0 ? (
                <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                  {challenges.map((c, i) => (
                    <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: 12 }}>
                      <span style={{ width: 6, height: 6, borderRadius: "50%", background: COLOR.textFaint, flexShrink: 0, marginTop: 8 }} />
                      <span style={{ fontFamily: FONT.body, fontSize: 14, color: COLOR.textDim, lineHeight: 1.6 }}>{c}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <span style={{ fontFamily: FONT.body, fontSize: 14, color: COLOR.textFaint }}>No challenges listed.</span>
              )}
            </div>
          </div>
        </section>

        <section id="section-stack" ref={register("stack")} style={{ padding: "10vh 0 14vh" }}>
          <SectionHeader index="04" label="Stack" sub="Every tool this project actually runs on." />

          {tech.length > 0 ? (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))", gap: 2 }}>
              {tech.map((t, i) => (
                <div
                  key={i}
                  style={{ border: `1px solid ${COLOR.border}`, borderRadius: 16, background: COLOR.panel, padding: "26px 22px", transition: "border-color 0.2s, background 0.2s" }}
                  onMouseEnter={(e) => { e.currentTarget.style.borderColor = COLOR.accent; e.currentTarget.style.background = COLOR.panelAlt; }}
                  onMouseLeave={(e) => { e.currentTarget.style.borderColor = COLOR.border; e.currentTarget.style.background = COLOR.panel; }}
                >
                  <div style={{ width: 34, height: 34, borderRadius: 10, border: `1px solid ${COLOR.borderHi}`, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 14 }}>
                    <Code size={15} color={COLOR.textMute} />
                  </div>
                  <div style={{ fontFamily: FONT.body, fontSize: 14, fontWeight: 500, color: COLOR.text, marginBottom: 5 }}>{t}</div>
                  <div style={{ fontFamily: FONT.mono, fontSize: 10, color: COLOR.textFaint, letterSpacing: "0.08em" }}>{categorizeTech(t)}</div>
                </div>
              ))}
            </div>
          ) : (
            <span style={{ fontFamily: FONT.body, fontSize: 14, color: COLOR.textFaint }}>No stack listed yet.</span>
          )}
        </section>
      </div>

      {/* ── Global styles ── */}
      <style>{`
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { background: ${COLOR.ink}; }
        ::selection { background: ${COLOR.accent}; color: ${COLOR.ink}; }

        a:focus-visible, button:focus-visible {
          outline: 2px solid ${COLOR.accent};
          outline-offset: 4px;
        }

        ::-webkit-scrollbar { width: 5px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: ${COLOR.borderHi}; border-radius: 4px; }

        .code-block-group:hover .copy-btn { opacity: 1 !important; }

        @media (max-width: 900px) {
          .progress-rail { display: none !important; }
        }

        @media (max-width: 640px) {
          .overview-grid { grid-template-columns: 1fr !important; }
        }

        @media (prefers-reduced-motion: reduce) {
          * { animation-duration: 0.01ms !important; transition-duration: 0.01ms !important; }
        }
      `}</style>
    </div>
  );
};

export default ProjectDocs;
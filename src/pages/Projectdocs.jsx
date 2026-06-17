/**
 * KALVIN KAYI — PROJECT DOCS (Refactored)
 * Design system: "Machine Precision / Human Warmth"
 *
 * Refactor notes (what changed and why):
 *
 *  1. MOBILE HEIGHT BUG — the root wrapper had inline `height: "100vh"` +
 *     `overflow: "hidden"`, which always wins over the CSS media-query
 *     override that tried to restore natural scrolling below 900px
 *     (inline styles beat external stylesheet rules of equal specificity).
 *     Fixed by tracking viewport width in JS and switching the root's
 *     height/overflow values directly, so the override is real.
 *
 *  2. UNGUARDED ARRAYS — `project.tech.map(...)` ran twice without an
 *     optional chain, so any project missing a `tech` field crashed the
 *     page. All three array reads (`tech`, `features`, `challenges`) are
 *     now optional-chained with explicit empty-state fallbacks.
 *
 *  3. SHARED COPY STATE — one `copied` boolean was shared across every
 *     code block, so copying block #1 flashed "Copied" on block #5 too.
 *     Now tracked by a per-block id so each block's button is independent.
 *
 *  4. CATEGORY GUESSER — the inline tech→category string-matching lived
 *     in the JSX as a wall of ternaries. Pulled into a small pure
 *     function (`categorizeTech`) with an explicit, ordered rule list and
 *     a clearly intentional "Core" fallback, so the logic can be read,
 *     tested, and extended without hunting through markup.
 *
 *  5. REPEATED STYLES — sidebar rows, tab buttons, and link rows had
 *     near-duplicate inline style blocks with copy-paste drift risk.
 *     Pulled into small style-returning helpers near the top of the file.
 *
 *  6. ACCESSIBILITY — `cursor: none` is applied globally regardless of
 *     input method, which is hostile to keyboard/touch users and to
 *     anyone whose JS hasn't finished loading. The custom cursor and
 *     `cursor: none` now only activate once a real mouse-move is
 *     detected, and back off automatically for touch and keyboard users.
 *     Reduced-motion users also skip the cursor's RAF loop entirely.
 */

import { useParams } from "react-router-dom";
import { projects as staticProjects } from "../utils/utils";
import { useEffect, useState, useRef, useCallback, useMemo } from "react";
import {
  Github,
  ExternalLink,
  ArrowLeft,
  Calendar,
  Clock,
  Users,
  Star,
  Code,
  BookOpen,
  ChevronRight,
  Copy,
  Check,
  Eye,
  Globe,
  Layers,
} from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeHighlight from "rehype-highlight";
import "highlight.js/styles/github-dark.css";

/* ─────────────────────────────────────────────
   DESIGN TOKENS
   Centralised so the palette/type can't drift between sections.
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

/* ─────────────────────────────────────────────
   PURE HELPERS
───────────────────────────────────────────── */

/** Ordered, explicit rules for labelling a tech tag. First match wins.
 *  "Core" is the deliberate fallback for anything unrecognised — not a bug. */
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

/** Centralised fade-up timing so every section animates on the same curve. */
function fadeUp(entered, delay = 0) {
  return {
    opacity: entered ? 1 : 0,
    transform: entered ? "translateY(0)" : "translateY(20px)",
    transition: `opacity 0.7s ease ${delay}s, transform 0.7s ease ${delay}s`,
  };
}

/* ─────────────────────────────────────────────
   FONT LOADER
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

/** Tracks whether the viewport is at/below the docs layout breakpoint.
 *  Drives BOTH the CSS grid collapse and the root wrapper's inline
 *  height/overflow — fixing the bug where inline styles silently beat
 *  the equivalent media-query rule. */
function useIsStacked(breakpoint = 900) {
  const [stacked, setStacked] = useState(
    typeof window !== "undefined" ? window.innerWidth <= breakpoint : false
  );
  useEffect(() => {
    const onResize = () => setStacked(window.innerWidth <= breakpoint);
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, [breakpoint]);
  return stacked;
}

/** True once the user has used a mouse, false if they're on touch or
 *  navigating by keyboard. Used to gate the custom cursor so it never
 *  hides the system cursor for people who actually need it. */
function usePointerActive() {
  const [active, setActive] = useState(false);
  useEffect(() => {
    const onMouseMove = () => setActive(true);
    const onTouch = () => setActive(false);
    const onKey = (e) => {
      if (e.key === "Tab") setActive(false);
    };
    window.addEventListener("mousemove", onMouseMove, { once: false });
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

/* ─────────────────────────────────────────────
   CUSTOM CURSOR
   Only renders/runs once a real mouse is in use AND motion isn't reduced.
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
    const over = (e) => {
      if (e.target.closest("a, button, [data-cursor-expand]")) setHovered(true);
    };
    const out = () => setHovered(false);

    window.addEventListener("mousemove", move);
    document.addEventListener("mouseover", over);
    document.addEventListener("mouseout", out);

    const loop = () => {
      ring.current.x += (pos.current.x - ring.current.x) * 0.12;
      ring.current.y += (pos.current.y - ring.current.y) * 0.12;
      if (dotRef.current)
        dotRef.current.style.transform = `translate(${pos.current.x}px, ${pos.current.y}px) translate(-50%,-50%)`;
      if (ringRef.current)
        ringRef.current.style.transform = `translate(${ring.current.x}px, ${ring.current.y}px) translate(-50%,-50%) scale(${hovered ? 2.5 : 1})`;
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

/* ─────────────────────────────────────────────
   NOISE OVERLAY
───────────────────────────────────────────── */
function NoiseOverlay() {
  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 1, pointerEvents: "none", opacity: 0.035, backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`, backgroundSize: "200px 200px" }} />
  );
}

/* ─────────────────────────────────────────────
   MAGNETIC BUTTON
───────────────────────────────────────────── */
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
      ref={ref}
      href={href}
      target={target}
      rel={target === "_blank" ? "noopener noreferrer" : undefined}
      onClick={onClick}
      style={{ display: "inline-flex", transition: "transform 0.3s cubic-bezier(.23,1,.32,1)", ...style }}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      onMouseEnter={onMouseEnter}
    >
      {children}
    </Tag>
  );
}

/* ─────────────────────────────────────────────
   SMALL STYLE HELPERS
   Pulled out of JSX to avoid copy-paste drift between near-identical
   rows (sidebar meta rows, quick-link rows, tab buttons).
───────────────────────────────────────────── */
function metaRowStyle(isLast) {
  return {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "16px 20px",
    background: COLOR.panel,
    borderBottom: isLast ? "none" : `1px solid ${COLOR.border}`,
  };
}

function quickLinkStyle(isLast) {
  return {
    display: "flex",
    alignItems: "center",
    gap: 14,
    padding: "16px 20px",
    background: COLOR.panel,
    textDecoration: "none",
    borderBottom: isLast ? "none" : `1px solid ${COLOR.border}`,
    transition: "background 0.2s",
  };
}

function tabButtonStyle(active) {
  return {
    display: "inline-flex",
    alignItems: "center",
    gap: 8,
    fontFamily: FONT.body,
    fontSize: 13,
    fontWeight: active ? 500 : 400,
    color: active ? COLOR.text : COLOR.textMute,
    background: "none",
    border: "none",
    padding: "12px 20px",
    borderBottom: active ? `2px solid ${COLOR.accent}` : "2px solid transparent",
    marginBottom: -1,
    transition: "color 0.2s",
    outlineOffset: 4,
  };
}

/* ─────────────────────────────────────────────
   LOADING STATE
───────────────────────────────────────────── */
function LoadingScreen() {
  return (
    <div style={{ minHeight: "100vh", background: COLOR.ink, display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column", gap: 24 }}>
      <div style={{ width: 48, height: 48, border: `1.5px solid ${COLOR.borderHi}`, borderTop: `1.5px solid ${COLOR.accent}`, borderRadius: "50%", animation: "spin 0.8s linear infinite" }} />
      <span style={{ fontFamily: FONT.mono, fontSize: 11, letterSpacing: "0.15em", color: COLOR.textMute, textTransform: "uppercase" }}>
        Loading project
      </span>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}

/* ─────────────────────────────────────────────
   NOT FOUND STATE
───────────────────────────────────────────── */
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
        <MagneticBtn
          href="/"
          style={{ fontFamily: FONT.body, fontSize: 14, fontWeight: 500, padding: "14px 28px", background: COLOR.accent, color: COLOR.ink, borderRadius: 40, textDecoration: "none", alignItems: "center", gap: 8 }}
        >
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
  const [activeTab, setActiveTab] = useState("documentation");
  const [copiedBlockId, setCopiedBlockId] = useState(null); // per-block, not global
  const [entered, setEntered] = useState(false);
  const contentRef = useRef(null);

  const isStacked = useIsStacked(900);
  const pointerActive = usePointerActive();
  const reducedMotion = usePrefersReducedMotion();
  const cursorEnabled = pointerActive && !reducedMotion;

  useEffect(() => {
    const t = setTimeout(() => setEntered(true), 100);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    if (contentRef.current) contentRef.current.scrollTop = 0;
  }, [activeTab]);

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

  // Stable per-render counter so each fenced code block gets a unique id
  // without needing the markdown source to carry one.
  const codeBlockCounter = useRef(0);
  useEffect(() => { codeBlockCounter.current = 0; }, [project, activeTab]);

  /* ── Markdown component map ──
     Memoised so ReactMarkdown doesn't get a brand-new components object
     (and therefore remount every node) on every keystroke-level re-render. */
  const markdownComponents = useMemo(() => ({
    h1: ({ children }) => (
      <h1 style={{ fontFamily: FONT.display, fontSize: "clamp(2rem, 3.5vw, 3rem)", fontWeight: 400, color: COLOR.text, lineHeight: 1.1, marginBottom: 32, paddingBottom: 20, borderBottom: `1px solid ${COLOR.borderHi}` }}>
        {children}
      </h1>
    ),
    h2: ({ children }) => (
      <h2 style={{ fontFamily: FONT.display, fontSize: "clamp(1.4rem, 2.5vw, 2rem)", fontWeight: 400, color: COLOR.text, lineHeight: 1.15, marginTop: 48, marginBottom: 20, display: "flex", alignItems: "center", gap: 10 }}>
        <ChevronRight size={18} color={COLOR.accent} />
        {children}
      </h2>
    ),
    h3: ({ children }) => (
      <h3 style={{ fontFamily: FONT.body, fontSize: "1.1rem", fontWeight: 500, color: "#d0d0d0", marginTop: 32, marginBottom: 12, letterSpacing: "0.02em" }}>
        {children}
      </h3>
    ),
    p: ({ children }) => (
      <p style={{ fontFamily: FONT.body, fontSize: "clamp(0.95rem, 1.2vw, 1.05rem)", lineHeight: 1.8, color: COLOR.textDim, marginBottom: 20 }}>
        {children}
      </p>
    ),
    ul: ({ children }) => <ul style={{ marginBottom: 20, paddingLeft: 0, listStyle: "none" }}>{children}</ul>,
    ol: ({ children }) => <ol style={{ marginBottom: 20, paddingLeft: 0, listStyle: "none", counterReset: "item" }}>{children}</ol>,
    li: ({ children }) => (
      <li style={{ display: "flex", alignItems: "flex-start", gap: 12, marginBottom: 10, fontFamily: FONT.body, fontSize: "clamp(0.95rem, 1.2vw, 1.05rem)", lineHeight: 1.7, color: COLOR.textDim }}>
        <span style={{ width: 6, height: 6, borderRadius: "50%", background: COLOR.accent, flexShrink: 0, marginTop: 9 }} />
        <span>{children}</span>
      </li>
    ),
    strong: ({ children }) => (
      <strong style={{ color: COLOR.text, fontWeight: 500 }}>{children}</strong>
    ),
    code: ({ children, className, inline }) => {
      if (inline) {
        return (
          <code style={{ fontFamily: FONT.mono, fontSize: "0.85em", background: "#111", color: COLOR.accent, padding: "2px 8px", borderRadius: 4, border: `1px solid ${COLOR.borderHi}` }}>
            {children}
          </code>
        );
      }
      const codeString = String(children).replace(/\n$/, "");
      // Assign a stable id for this render pass so copy state is per-block.
      const blockId = `code-${codeBlockCounter.current++}`;
      const isCopied = copiedBlockId === blockId;
      return (
        <div style={{ position: "relative", marginBottom: 24, borderRadius: 12, overflow: "hidden", border: `1px solid ${COLOR.borderHi}` }} className="code-block-group">
          <pre style={{ background: COLOR.panel, padding: "24px 28px", overflowX: "auto", margin: 0 }}>
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
      <blockquote style={{ borderLeft: `2px solid ${COLOR.accent}`, paddingLeft: 24, paddingTop: 4, paddingBottom: 4, marginBottom: 20, fontFamily: FONT.display, fontStyle: "italic", color: COLOR.textMute, fontSize: "1.05rem", lineHeight: 1.7 }}>
        {children}
      </blockquote>
    ),
    a: ({ children, href }) => (
      <a href={href} target="_blank" rel="noopener noreferrer" style={{ color: COLOR.accent, textDecoration: "none", borderBottom: "1px solid rgba(200,242,65,0.3)", transition: "border-color 0.2s" }}
        onMouseEnter={(e) => { e.currentTarget.style.borderColor = COLOR.accent; }}
        onMouseLeave={(e) => { e.currentTarget.style.borderColor = "rgba(200,242,65,0.3)"; }}>
        {children}
      </a>
    ),
    table: ({ children }) => (
      <div style={{ overflowX: "auto", marginBottom: 24, border: `1px solid ${COLOR.borderHi}`, borderRadius: 12 }}>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>{children}</table>
      </div>
    ),
    thead: ({ children }) => <thead style={{ background: COLOR.panel }}>{children}</thead>,
    tbody: ({ children }) => <tbody>{children}</tbody>,
    tr: ({ children }) => <tr style={{ borderBottom: `1px solid ${COLOR.borderHi}` }}>{children}</tr>,
    th: ({ children }) => <th style={{ padding: "14px 20px", textAlign: "left", fontFamily: FONT.mono, fontSize: 11, letterSpacing: "0.1em", textTransform: "uppercase", color: COLOR.textMute }}>{children}</th>,
    td: ({ children }) => <td style={{ padding: "14px 20px", fontFamily: FONT.body, fontSize: 14, color: COLOR.textDim }}>{children}</td>,
    img: ({ src, alt }) => (
      <div style={{ marginBottom: 24, borderRadius: 12, overflow: "hidden", border: `1px solid ${COLOR.borderHi}` }}>
        <img src={src} alt={alt} loading="lazy" style={{ width: "100%", height: "auto", display: "block" }} />
        {alt && (
          <div style={{ padding: "10px 16px", fontFamily: FONT.mono, fontSize: 11, color: COLOR.textMute, borderTop: `1px solid ${COLOR.borderHi}`, letterSpacing: "0.05em" }}>
            {alt}
          </div>
        )}
      </div>
    ),
  }), [copiedBlockId, copyToClipboard]);

  const tabs = [
    { id: "documentation", label: "Docs", icon: BookOpen },
    { id: "overview", label: "Overview", icon: Eye },
    { id: "tech", label: "Stack", icon: Layers },
  ];

  if (loading) return <LoadingScreen />;
  if (!project) return <NotFound />;

  // Optional-chained with explicit fallbacks — a project missing any of
  // these fields renders an empty list instead of throwing.
  const tech       = project.tech ?? [];
  const features   = project.features ?? [];
  const challenges = project.challenges ?? [];

  return (
    <div
      style={{
        background: COLOR.ink,
        color: COLOR.text,
        // Bug fix: these two values now respond to the same breakpoint
        // the CSS grid collapses at, instead of being permanently locked
        // to 100vh/hidden and silently overriding the old media query.
        height: isStacked ? "auto" : "100vh",
        minHeight: isStacked ? "100vh" : undefined,
        display: "flex",
        flexDirection: "column",
        overflow: isStacked ? "visible" : "hidden",
        cursor: cursorEnabled ? "none" : "auto",
      }}
    >
      <CustomCursor enabled={cursorEnabled} />
      <NoiseOverlay />

      {/* ── Top nav bar ── */}
      <div style={{ flexShrink: 0, zIndex: 50, background: "rgba(10,10,10,0.95)", borderBottom: `1px solid ${COLOR.border}` }}>
        <div style={{ maxWidth: 1280, margin: "0 auto", padding: "0 5vw", display: "flex", alignItems: "center", justifyContent: "space-between", height: 60 }}>
          <MagneticBtn
            href="/"
            style={{ display: "inline-flex", alignItems: "center", gap: 10, fontFamily: FONT.body, fontSize: 13, color: COLOR.textMute, textDecoration: "none", padding: "8px 16px", border: `1px solid ${COLOR.borderHi}`, borderRadius: 40, transition: "color 0.2s, border-color 0.2s" }}
            onMouseEnter={(e) => { e.currentTarget.style.color = COLOR.text; e.currentTarget.style.borderColor = COLOR.text; }}
            onMouseLeave={(e) => { e.currentTarget.style.color = COLOR.textMute; e.currentTarget.style.borderColor = COLOR.borderHi; }}
          >
            <ArrowLeft size={14} />
            Portfolio
          </MagneticBtn>

          <div style={{ display: "flex", gap: 12 }}>
            {project.code && (
              <MagneticBtn
                href={project.code}
                target="_blank"
                style={{ display: "inline-flex", alignItems: "center", gap: 8, fontFamily: FONT.body, fontSize: 13, color: COLOR.textMute, textDecoration: "none", padding: "8px 16px", border: `1px solid ${COLOR.borderHi}`, borderRadius: 40, transition: "color 0.2s, border-color 0.2s" }}
                onMouseEnter={(e) => { e.currentTarget.style.color = COLOR.accent; e.currentTarget.style.borderColor = COLOR.accent; }}
                onMouseLeave={(e) => { e.currentTarget.style.color = COLOR.textMute; e.currentTarget.style.borderColor = COLOR.borderHi; }}
              >
                <Github size={14} />
                <span>Code</span>
              </MagneticBtn>
            )}
            {project.url && (
              <MagneticBtn
                href={project.url}
                target="_blank"
                style={{ display: "inline-flex", alignItems: "center", gap: 8, fontFamily: FONT.body, fontSize: 13, fontWeight: 500, color: COLOR.ink, textDecoration: "none", padding: "8px 16px", background: COLOR.accent, borderRadius: 40 }}
              >
                <Globe size={14} />
                <span>Live</span>
              </MagneticBtn>
            )}
          </div>
        </div>
      </div>

      {/* ── Page title strip ── */}
      <div style={{ flexShrink: 0, borderBottom: `1px solid ${COLOR.border}`, position: "relative", zIndex: 2 }}>
        <div style={{ maxWidth: 1280, margin: "0 auto", padding: "4vh 5vw 3vh" }}>
          <p style={{ fontFamily: FONT.mono, fontSize: 11, letterSpacing: "0.15em", color: COLOR.accent, textTransform: "uppercase", marginBottom: 14, ...fadeUp(entered, 0.05) }}>
            Case Study
          </p>
          <h1 style={{ fontFamily: FONT.display, fontSize: "clamp(2rem, 4vw, 3.5rem)", fontWeight: 400, lineHeight: 1.05, color: COLOR.text, ...fadeUp(entered, 0.1) }}>
            {project.title}
          </h1>
        </div>
      </div>

      {/* ── Body: sidebar + main, independently scrollable on desktop ── */}
      <div
        style={{
          flex: 1,
          minHeight: 0,
          maxWidth: 1280,
          width: "100%",
          margin: "0 auto",
          padding: "0 5vw",
          display: "grid",
          gridTemplateColumns: "260px 1fr",
          gap: "5vw",
          alignItems: "stretch",
          position: "relative",
          zIndex: 2,
        }}
        className="docs-grid"
      >
        {/* ─────── Sidebar ─────── */}
        <aside style={{ overflowY: "auto", paddingTop: "4vh", paddingBottom: "4vh", ...fadeUp(entered, 0.2) }} className="docs-sidebar">

          {/* Meta card */}
          <div style={{ border: `1px solid ${COLOR.border}`, borderRadius: 16, overflow: "hidden", marginBottom: 2 }}>
            {[
              { icon: Calendar, label: "Created", value: project.createdAt || "2024" },
              {
                icon: Clock,
                label: "Status",
                value: (
                  <span style={{ fontFamily: FONT.mono, fontSize: 11, letterSpacing: "0.08em", padding: "3px 10px", borderRadius: 20, background: project.status === "active" ? "rgba(200,242,65,0.1)" : "rgba(107,107,107,0.15)", color: project.status === "active" ? COLOR.accent : COLOR.textMute }}>
                    {project.status || "Active"}
                  </span>
                ),
              },
              project.stats?.stars && { icon: Star, label: "Stars", value: project.stats.stars },
              project.stats?.contributors && { icon: Users, label: "Contributors", value: project.stats.contributors },
            ]
              .filter(Boolean)
              .map(({ icon: Icon, label, value }, i, arr) => (
                <div key={label} style={metaRowStyle(i === arr.length - 1)}>
                  <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <Icon size={13} color={COLOR.textMute} />
                    <span style={{ fontFamily: FONT.mono, fontSize: 11, letterSpacing: "0.08em", textTransform: "uppercase", color: COLOR.textMute }}>{label}</span>
                  </div>
                  {typeof value === "string" || typeof value === "number"
                    ? <span style={{ fontFamily: FONT.mono, fontSize: 12, color: COLOR.text }}>{value}</span>
                    : value}
                </div>
              ))}
          </div>

          {/* Tech stack */}
          <div style={{ border: `1px solid ${COLOR.border}`, borderRadius: 16, background: COLOR.panel, padding: 20, marginTop: 2, marginBottom: 2 }}>
            <p style={{ fontFamily: FONT.mono, fontSize: 11, letterSpacing: "0.12em", textTransform: "uppercase", color: COLOR.textMute, marginBottom: 16 }}>Stack</p>
            {tech.length > 0 ? (
              <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                {tech.map((t, i) => (
                  <span key={i} style={{ fontFamily: FONT.mono, fontSize: 11, letterSpacing: "0.05em", color: COLOR.textDim, padding: "5px 12px", border: `1px solid ${COLOR.borderHi}`, borderRadius: 20, background: "rgba(255,255,255,0.02)" }}>
                    {t}
                  </span>
                ))}
              </div>
            ) : (
              <span style={{ fontFamily: FONT.body, fontSize: 13, color: COLOR.textFaint }}>No stack listed yet.</span>
            )}
          </div>

          {/* Quick links */}
          <div style={{ border: `1px solid ${COLOR.border}`, borderRadius: 16, overflow: "hidden", marginTop: 2 }}>
            {[
              project.code && { href: project.code, icon: Github, label: "Source code", sub: "github.com" },
              project.url && { href: project.url, icon: ExternalLink, label: "Live demo", sub: "View project" },
            ]
              .filter(Boolean)
              .map(({ href, icon: Icon, label, sub }, i, arr) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={quickLinkStyle(i === arr.length - 1)}
                  onMouseEnter={(e) => { e.currentTarget.style.background = "#111"; e.currentTarget.querySelector(".link-label").style.color = COLOR.accent; }}
                  onMouseLeave={(e) => { e.currentTarget.style.background = COLOR.panel; e.currentTarget.querySelector(".link-label").style.color = COLOR.text; }}
                >
                  <Icon size={14} color={COLOR.textMute} />
                  <div>
                    <div className="link-label" style={{ fontFamily: FONT.body, fontSize: 13, color: COLOR.text, transition: "color 0.2s" }}>{label}</div>
                    <div style={{ fontFamily: FONT.mono, fontSize: 10, color: COLOR.textFaint, marginTop: 2, letterSpacing: "0.05em" }}>{sub}</div>
                  </div>
                </a>
              ))}
          </div>
        </aside>

        {/* ─────── Main content ─────── */}
        <main
          ref={contentRef}
          style={{
            minWidth: 0,
            overflowY: "auto",
            paddingTop: "4vh",
            paddingBottom: "6vh",
            ...fadeUp(entered, 0.25),
          }}
          className="docs-main"
        >
          {/* Brief */}
          <div style={{
            border: `1px solid ${COLOR.border}`,
            borderRadius: 16,
            background: COLOR.panel,
            padding: "28px 32px",
            marginBottom: 32,
            position: "relative",
            overflow: "hidden",
          }}>
            <div style={{ position: "absolute", top: 0, left: 0, width: 3, height: "100%", background: COLOR.accent }} />
            <p style={{ fontFamily: FONT.mono, fontSize: 11, letterSpacing: "0.12em", textTransform: "uppercase", color: COLOR.accent, marginBottom: 12 }}>
              Brief
            </p>
            <p style={{ fontFamily: FONT.body, fontSize: "clamp(1rem, 1.3vw, 1.15rem)", lineHeight: 1.8, color: COLOR.textDim, margin: 0 }}>
              {project.description || "No description provided yet."}
            </p>
          </div>

          {/* Tab bar */}
          <div style={{ display: "flex", gap: 2, marginBottom: 32, borderBottom: `1px solid ${COLOR.border}`, position: "sticky", top: 0, background: COLOR.ink, zIndex: 5 }}>
            {tabs.map(({ id, label, icon: Icon }) => {
              const active = activeTab === id;
              return (
                <button
                  key={id}
                  onClick={() => setActiveTab(id)}
                  aria-pressed={active}
                  style={tabButtonStyle(active)}
                  onMouseEnter={(e) => { if (!active) e.currentTarget.style.color = "#d0d0d0"; }}
                  onMouseLeave={(e) => { if (!active) e.currentTarget.style.color = COLOR.textMute; }}
                >
                  <Icon size={14} />
                  {label}
                </button>
              );
            })}
          </div>

          {/* Tab content */}
          <div key={activeTab} style={{ animation: reducedMotion ? "none" : "tabIn 0.35s ease" }}>

            {/* DOCUMENTATION */}
            {activeTab === "documentation" && (
              <div>
                {project.markdown ? (
                  <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeHighlight]} components={markdownComponents}>
                    {project.markdown}
                  </ReactMarkdown>
                ) : (
                  <div style={{ padding: "8vh 0", textAlign: "center" }}>
                    <p style={{ fontFamily: FONT.mono, fontSize: 11, letterSpacing: "0.15em", color: COLOR.accent, textTransform: "uppercase", marginBottom: 20 }}>Coming soon</p>
                    <h3 style={{ fontFamily: FONT.display, fontSize: "clamp(1.8rem, 3vw, 2.5rem)", fontWeight: 400, color: COLOR.text, lineHeight: 1.2, marginBottom: 16 }}>
                      Documentation in <span style={{ fontStyle: "italic" }}>progress</span>
                    </h3>
                    <p style={{ fontFamily: FONT.body, fontSize: 15, color: COLOR.textMute, maxWidth: 400, margin: "0 auto", lineHeight: 1.7 }}>
                      Comprehensive docs for this project are being written. Check the GitHub repo in the meantime.
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* OVERVIEW */}
            {activeTab === "overview" && (
              <div>
                <p style={{ fontFamily: FONT.mono, fontSize: 11, letterSpacing: "0.15em", color: COLOR.accent, textTransform: "uppercase", marginBottom: 16 }}>Overview</p>
                <h2 style={{ fontFamily: FONT.display, fontSize: "clamp(1.8rem, 3vw, 2.5rem)", fontWeight: 400, color: COLOR.text, lineHeight: 1.1, marginBottom: 48 }}>
                  What it <span style={{ fontStyle: "italic" }}>does</span>
                </h2>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 2 }} className="overview-grid">
                  {/* Features */}
                  <div style={{ border: `1px solid ${COLOR.border}`, borderRadius: 16, background: COLOR.panel, padding: "32px 28px" }}>
                    <p style={{ fontFamily: FONT.mono, fontSize: 11, letterSpacing: "0.12em", textTransform: "uppercase", color: COLOR.textMute, marginBottom: 24 }}>Key features</p>
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

                  {/* Challenges */}
                  <div style={{ border: `1px solid ${COLOR.border}`, borderRadius: 16, background: COLOR.panel, padding: "32px 28px" }}>
                    <p style={{ fontFamily: FONT.mono, fontSize: 11, letterSpacing: "0.12em", textTransform: "uppercase", color: COLOR.textMute, marginBottom: 24 }}>Challenges solved</p>
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
              </div>
            )}

            {/* TECH STACK */}
            {activeTab === "tech" && (
              <div>
                <p style={{ fontFamily: FONT.mono, fontSize: 11, letterSpacing: "0.15em", color: COLOR.accent, textTransform: "uppercase", marginBottom: 16 }}>Technology</p>
                <h2 style={{ fontFamily: FONT.display, fontSize: "clamp(1.8rem, 3vw, 2.5rem)", fontWeight: 400, color: COLOR.text, lineHeight: 1.1, marginBottom: 48 }}>
                  Technical <span style={{ fontStyle: "italic" }}>arsenal</span>
                </h2>

                {tech.length > 0 ? (
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: 2 }}>
                    {tech.map((t, i) => (
                      <div
                        key={i}
                        style={{ border: `1px solid ${COLOR.border}`, borderRadius: 16, background: COLOR.panel, padding: "28px 24px", transition: "border-color 0.2s, background 0.2s" }}
                        onMouseEnter={(e) => { e.currentTarget.style.borderColor = COLOR.accent; e.currentTarget.style.background = COLOR.panelAlt; }}
                        onMouseLeave={(e) => { e.currentTarget.style.borderColor = COLOR.border; e.currentTarget.style.background = COLOR.panel; }}
                      >
                        <div style={{ width: 36, height: 36, borderRadius: 10, border: `1px solid ${COLOR.borderHi}`, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 16 }}>
                          <Code size={16} color={COLOR.textMute} />
                        </div>
                        <div style={{ fontFamily: FONT.body, fontSize: 14, fontWeight: 500, color: COLOR.text, marginBottom: 6 }}>{t}</div>
                        <div style={{ fontFamily: FONT.mono, fontSize: 10, color: COLOR.textFaint, letterSpacing: "0.08em" }}>
                          {categorizeTech(t)}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <span style={{ fontFamily: FONT.body, fontSize: 14, color: COLOR.textFaint }}>No stack listed yet.</span>
                )}
              </div>
            )}
          </div>
        </main>
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

        .docs-sidebar::-webkit-scrollbar,
        .docs-main::-webkit-scrollbar { width: 4px; }
        .docs-sidebar::-webkit-scrollbar-track,
        .docs-main::-webkit-scrollbar-track { background: transparent; }
        .docs-sidebar::-webkit-scrollbar-thumb,
        .docs-main::-webkit-scrollbar-thumb { background: ${COLOR.borderHi}; border-radius: 4px; }

        @keyframes tabIn {
          from { opacity: 0; transform: translateY(12px); }
          to   { opacity: 1; transform: translateY(0); }
        }

        .code-block-group:hover .copy-btn { opacity: 1 !important; }

        @media (max-width: 900px) {
          .docs-grid { grid-template-columns: 1fr !important; }
          .docs-sidebar { overflow-y: visible !important; }
          .docs-main { overflow-y: visible !important; }
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
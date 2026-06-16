/**
 * KALVIN KAYI — PROJECT DOCS
 * Design system: "Machine Precision / Human Warmth"
 *
 * Change in this pass:
 *  - Page itself no longer scrolls past the header. The two-column
 *    layout (sidebar + main) is height-locked to the viewport, and
 *    ONLY the main content column scrolls internally — sidebar stays
 *    pinned, you never lose your place scrolling through long docs.
 *  - The project description is pulled out of the cramped header line
 *    and given its own "Brief" card at the top of the content pane,
 *    so it reads properly instead of being a single truncated line.
 */

import { useParams, Link } from "react-router-dom";
import { projects as staticProjects } from "../utils/utils";
import { useEffect, useState, useRef, useCallback } from "react";
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
   FONT LOADER (mirrors Home.jsx)
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

/* ─────────────────────────────────────────────
   CUSTOM CURSOR (mirrors Home.jsx)
───────────────────────────────────────────── */
function CustomCursor() {
  const dotRef = useRef(null);
  const ringRef = useRef(null);
  const pos = useRef({ x: -100, y: -100 });
  const ring = useRef({ x: -100, y: -100 });
  const raf = useRef(null);
  const [hovered, setHovered] = useState(false);

  useEffect(() => {
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
  }, [hovered]);

  return (
    <>
      <div ref={dotRef} style={{ position: "fixed", top: 0, left: 0, width: 8, height: 8, borderRadius: "50%", background: "#c8f241", pointerEvents: "none", zIndex: 9999, willChange: "transform" }} />
      <div ref={ringRef} style={{ position: "fixed", top: 0, left: 0, width: 36, height: 36, borderRadius: "50%", border: "1.5px solid rgba(200,242,65,0.4)", pointerEvents: "none", zIndex: 9998, willChange: "transform", transition: "transform 0.15s ease, opacity 0.2s" }} />
    </>
  );
}

/* ─────────────────────────────────────────────
   NOISE OVERLAY (mirrors Home.jsx)
───────────────────────────────────────────── */
function NoiseOverlay() {
  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 1, pointerEvents: "none", opacity: 0.035, backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`, backgroundSize: "200px 200px" }} />
  );
}

/* ─────────────────────────────────────────────
   MAGNETIC BUTTON (mirrors Home.jsx)
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
   LOADING STATE
───────────────────────────────────────────── */
function LoadingScreen() {
  return (
    <div style={{ minHeight: "100vh", background: "#0a0a0a", display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column", gap: 24 }}>
      <div style={{ width: 48, height: 48, border: "1.5px solid #1f1f1f", borderTop: "1.5px solid #c8f241", borderRadius: "50%", animation: "spin 0.8s linear infinite" }} />
      <span style={{ fontFamily: "'DM Mono', monospace", fontSize: 11, letterSpacing: "0.15em", color: "#6b6b6b", textTransform: "uppercase" }}>
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
    <div style={{ minHeight: "100vh", background: "#0a0a0a", display: "flex", alignItems: "center", justifyContent: "center", padding: "0 5vw" }}>
      <div style={{ textAlign: "center", maxWidth: 480 }}>
        <p style={{ fontFamily: "'DM Mono', monospace", fontSize: 11, letterSpacing: "0.15em", color: "#c8f241", textTransform: "uppercase", marginBottom: 24 }}>404</p>
        <h2 style={{ fontFamily: "'DM Serif Display', serif", fontSize: "clamp(2.5rem, 5vw, 4rem)", fontWeight: 400, color: "#f0ede6", lineHeight: 1.1, marginBottom: 16 }}>
          Project not <span style={{ fontStyle: "italic", color: "#c8f241" }}>found</span>
        </h2>
        <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 15, color: "#6b6b6b", lineHeight: 1.7, marginBottom: 40 }}>
          This project doesn't exist or has been moved.
        </p>
        <MagneticBtn
          href="/"
          style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 14, fontWeight: 500, padding: "14px 28px", background: "#c8f241", color: "#0a0a0a", borderRadius: 40, textDecoration: "none", alignItems: "center", gap: 8 }}
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
  const [copied, setCopied] = useState(false);
  const [entered, setEntered] = useState(false);
  const contentRef = useRef(null);

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

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (loading) return <LoadingScreen />;
  if (!project) return <NotFound />;

  /* ── Markdown component map ── */
  const markdownComponents = {
    h1: ({ children }) => (
      <h1 style={{ fontFamily: "'DM Serif Display', serif", fontSize: "clamp(2rem, 3.5vw, 3rem)", fontWeight: 400, color: "#f0ede6", lineHeight: 1.1, marginBottom: 32, paddingBottom: 20, borderBottom: "1px solid #1f1f1f" }}>
        {children}
      </h1>
    ),
    h2: ({ children }) => (
      <h2 style={{ fontFamily: "'DM Serif Display', serif", fontSize: "clamp(1.4rem, 2.5vw, 2rem)", fontWeight: 400, color: "#f0ede6", lineHeight: 1.15, marginTop: 48, marginBottom: 20, display: "flex", alignItems: "center", gap: 10 }}>
        <ChevronRight size={18} color="#c8f241" />
        {children}
      </h2>
    ),
    h3: ({ children }) => (
      <h3 style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "1.1rem", fontWeight: 500, color: "#d0d0d0", marginTop: 32, marginBottom: 12, letterSpacing: "0.02em" }}>
        {children}
      </h3>
    ),
    p: ({ children }) => (
      <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "clamp(0.95rem, 1.2vw, 1.05rem)", lineHeight: 1.8, color: "#a0a0a0", marginBottom: 20 }}>
        {children}
      </p>
    ),
    ul: ({ children }) => <ul style={{ marginBottom: 20, paddingLeft: 0, listStyle: "none" }}>{children}</ul>,
    ol: ({ children }) => <ol style={{ marginBottom: 20, paddingLeft: 0, listStyle: "none", counterReset: "item" }}>{children}</ol>,
    li: ({ children }) => (
      <li style={{ display: "flex", alignItems: "flex-start", gap: 12, marginBottom: 10, fontFamily: "'DM Sans', sans-serif", fontSize: "clamp(0.95rem, 1.2vw, 1.05rem)", lineHeight: 1.7, color: "#a0a0a0" }}>
        <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#c8f241", flexShrink: 0, marginTop: 9 }} />
        <span>{children}</span>
      </li>
    ),
    strong: ({ children }) => (
      <strong style={{ color: "#f0ede6", fontWeight: 500 }}>{children}</strong>
    ),
    code: ({ children, className, inline }) => {
      if (inline) {
        return (
          <code style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.85em", background: "#111", color: "#c8f241", padding: "2px 8px", borderRadius: 4, border: "1px solid #1f1f1f" }}>
            {children}
          </code>
        );
      }
      const codeString = String(children).replace(/\n$/, "");
      return (
        <div style={{ position: "relative", marginBottom: 24, borderRadius: 12, overflow: "hidden", border: "1px solid #1f1f1f" }} className="code-block-group">
          <pre style={{ background: "#0d0d0d", padding: "24px 28px", overflowX: "auto", margin: 0 }}>
            <code className={className} style={{ fontFamily: "'DM Mono', monospace", fontSize: 13 }}>{children}</code>
          </pre>
          <button
            onClick={() => copyToClipboard(codeString)}
            className="copy-btn"
            style={{ position: "absolute", top: 12, right: 12, display: "flex", alignItems: "center", gap: 6, fontFamily: "'DM Mono', monospace", fontSize: 11, letterSpacing: "0.08em", color: "#6b6b6b", background: "#111", border: "1px solid #1f1f1f", borderRadius: 6, padding: "6px 12px", cursor: "none", transition: "color 0.2s, border-color 0.2s", opacity: 0 }}
            onMouseEnter={(e) => { e.currentTarget.style.color = "#c8f241"; e.currentTarget.style.borderColor = "#c8f241"; }}
            onMouseLeave={(e) => { e.currentTarget.style.color = "#6b6b6b"; e.currentTarget.style.borderColor = "#1f1f1f"; }}
          >
            {copied ? <Check size={13} /> : <Copy size={13} />}
            {copied ? "Copied" : "Copy"}
          </button>
        </div>
      );
    },
    pre: ({ children }) => <>{children}</>,
    blockquote: ({ children }) => (
      <blockquote style={{ borderLeft: "2px solid #c8f241", paddingLeft: 24, paddingTop: 4, paddingBottom: 4, marginBottom: 20, fontFamily: "'DM Serif Display', serif", fontStyle: "italic", color: "#6b6b6b", fontSize: "1.05rem", lineHeight: 1.7 }}>
        {children}
      </blockquote>
    ),
    a: ({ children, href }) => (
      <a href={href} target="_blank" rel="noopener noreferrer" style={{ color: "#c8f241", textDecoration: "none", borderBottom: "1px solid rgba(200,242,65,0.3)", transition: "border-color 0.2s" }}
        onMouseEnter={(e) => { e.currentTarget.style.borderColor = "#c8f241"; }}
        onMouseLeave={(e) => { e.currentTarget.style.borderColor = "rgba(200,242,65,0.3)"; }}>
        {children}
      </a>
    ),
    table: ({ children }) => (
      <div style={{ overflowX: "auto", marginBottom: 24, border: "1px solid #1f1f1f", borderRadius: 12 }}>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>{children}</table>
      </div>
    ),
    thead: ({ children }) => <thead style={{ background: "#0d0d0d" }}>{children}</thead>,
    tbody: ({ children }) => <tbody>{children}</tbody>,
    tr: ({ children }) => <tr style={{ borderBottom: "1px solid #1f1f1f" }}>{children}</tr>,
    th: ({ children }) => <th style={{ padding: "14px 20px", textAlign: "left", fontFamily: "'DM Mono', monospace", fontSize: 11, letterSpacing: "0.1em", textTransform: "uppercase", color: "#6b6b6b" }}>{children}</th>,
    td: ({ children }) => <td style={{ padding: "14px 20px", fontFamily: "'DM Sans', sans-serif", fontSize: 14, color: "#a0a0a0" }}>{children}</td>,
    img: ({ src, alt }) => (
      <div style={{ marginBottom: 24, borderRadius: 12, overflow: "hidden", border: "1px solid #1f1f1f" }}>
        <img src={src} alt={alt} loading="lazy" style={{ width: "100%", height: "auto", display: "block" }} />
        {alt && (
          <div style={{ padding: "10px 16px", fontFamily: "'DM Mono', monospace", fontSize: 11, color: "#6b6b6b", borderTop: "1px solid #1f1f1f", letterSpacing: "0.05em" }}>
            {alt}
          </div>
        )}
      </div>
    ),
  };

  const tabs = [
    { id: "documentation", label: "Docs", icon: BookOpen },
    { id: "overview", label: "Overview", icon: Eye },
    { id: "tech", label: "Stack", icon: Layers },
  ];

  const fadeUp = (delay = 0) => ({
    opacity: entered ? 1 : 0,
    transform: entered ? "translateY(0)" : "translateY(20px)",
    transition: `opacity 0.7s ease ${delay}s, transform 0.7s ease ${delay}s`,
  });

  return (
    <div style={{ background: "#0a0a0a", color: "#f0ede6", height: "100vh", display: "flex", flexDirection: "column", cursor: "none", overflow: "hidden" }}>
      <CustomCursor />
      <NoiseOverlay />

      {/* ── Top nav bar (fixed height, not sticky — page no longer scrolls) ── */}
      <div style={{ flexShrink: 0, zIndex: 50, background: "rgba(10,10,10,0.95)", borderBottom: "1px solid #1a1a1a" }}>
        <div style={{ maxWidth: 1280, margin: "0 auto", padding: "0 5vw", display: "flex", alignItems: "center", justifyContent: "space-between", height: 60 }}>
          <MagneticBtn
            href="/"
            style={{ display: "inline-flex", alignItems: "center", gap: 10, fontFamily: "'DM Sans', sans-serif", fontSize: 13, color: "#6b6b6b", textDecoration: "none", padding: "8px 16px", border: "1px solid #1f1f1f", borderRadius: 40, transition: "color 0.2s, border-color 0.2s" }}
            onMouseEnter={(e) => { e.currentTarget.style.color = "#f0ede6"; e.currentTarget.style.borderColor = "#f0ede6"; }}
            onMouseLeave={(e) => { e.currentTarget.style.color = "#6b6b6b"; e.currentTarget.style.borderColor = "#1f1f1f"; }}
          >
            <ArrowLeft size={14} />
            Portfolio
          </MagneticBtn>

          <div style={{ display: "flex", gap: 12 }}>
            {project.code && (
              <MagneticBtn
                href={project.code}
                target="_blank"
                style={{ display: "inline-flex", alignItems: "center", gap: 8, fontFamily: "'DM Sans', sans-serif", fontSize: 13, color: "#6b6b6b", textDecoration: "none", padding: "8px 16px", border: "1px solid #1f1f1f", borderRadius: 40, transition: "color 0.2s, border-color 0.2s" }}
                onMouseEnter={(e) => { e.currentTarget.style.color = "#c8f241"; e.currentTarget.style.borderColor = "#c8f241"; }}
                onMouseLeave={(e) => { e.currentTarget.style.color = "#6b6b6b"; e.currentTarget.style.borderColor = "#1f1f1f"; }}
              >
                <Github size={14} />
                <span>Code</span>
              </MagneticBtn>
            )}
            {project.url && (
              <MagneticBtn
                href={project.url}
                target="_blank"
                style={{ display: "inline-flex", alignItems: "center", gap: 8, fontFamily: "'DM Sans', sans-serif", fontSize: 13, fontWeight: 500, color: "#0a0a0a", textDecoration: "none", padding: "8px 16px", background: "#c8f241", borderRadius: 40 }}
              >
                <Globe size={14} />
                <span>Live</span>
              </MagneticBtn>
            )}
          </div>
        </div>
      </div>

      {/* ── Page title strip (fixed height, not part of scroll area) ── */}
      <div style={{ flexShrink: 0, borderBottom: "1px solid #1a1a1a", position: "relative", zIndex: 2 }}>
        <div style={{ maxWidth: 1280, margin: "0 auto", padding: "4vh 5vw 3vh" }}>
          <p style={{ fontFamily: "'DM Mono', monospace", fontSize: 11, letterSpacing: "0.15em", color: "#c8f241", textTransform: "uppercase", marginBottom: 14, ...fadeUp(0.05) }}>
            Case Study
          </p>
          <h1 style={{ fontFamily: "'DM Serif Display', serif", fontSize: "clamp(2rem, 4vw, 3.5rem)", fontWeight: 400, lineHeight: 1.05, color: "#f0ede6", ...fadeUp(0.1) }}>
            {project.title}
          </h1>
        </div>
      </div>

      {/* ── Body: sidebar pinned, content scrolls independently ── */}
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

        {/* ─────── Sidebar — own scroll if it ever runs long, but stays put ─────── */}
        <aside style={{ overflowY: "auto", paddingTop: "4vh", paddingBottom: "4vh", ...fadeUp(0.2) }} className="docs-sidebar">

          {/* Meta card */}
          <div style={{ border: "1px solid #1a1a1a", borderRadius: 16, overflow: "hidden", marginBottom: 2 }}>
            {[
              { icon: Calendar, label: "Created", value: project.createdAt || "2024" },
              {
                icon: Clock,
                label: "Status",
                value: (
                  <span style={{ fontFamily: "'DM Mono', monospace", fontSize: 11, letterSpacing: "0.08em", padding: "3px 10px", borderRadius: 20, background: project.status === "active" ? "rgba(200,242,65,0.1)" : "rgba(107,107,107,0.15)", color: project.status === "active" ? "#c8f241" : "#6b6b6b" }}>
                    {project.status || "Active"}
                  </span>
                ),
              },
              project.stats?.stars && { icon: Star, label: "Stars", value: project.stats.stars },
              project.stats?.contributors && { icon: Users, label: "Contributors", value: project.stats.contributors },
            ]
              .filter(Boolean)
              .map(({ icon: Icon, label, value }, i, arr) => (
                <div key={label} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "16px 20px", background: "#0d0d0d", borderBottom: i < arr.length - 1 ? "1px solid #1a1a1a" : "none" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <Icon size={13} color="#6b6b6b" />
                    <span style={{ fontFamily: "'DM Mono', monospace", fontSize: 11, letterSpacing: "0.08em", textTransform: "uppercase", color: "#6b6b6b" }}>{label}</span>
                  </div>
                  {typeof value === "string" || typeof value === "number"
                    ? <span style={{ fontFamily: "'DM Mono', monospace", fontSize: 12, color: "#f0ede6" }}>{value}</span>
                    : value}
                </div>
              ))}
          </div>

          {/* Tech stack */}
          <div style={{ border: "1px solid #1a1a1a", borderRadius: 16, background: "#0d0d0d", padding: "20px", marginTop: 2, marginBottom: 2 }}>
            <p style={{ fontFamily: "'DM Mono', monospace", fontSize: 11, letterSpacing: "0.12em", textTransform: "uppercase", color: "#6b6b6b", marginBottom: 16 }}>Stack</p>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
              {project.tech.map((t, i) => (
                <span key={i} style={{ fontFamily: "'DM Mono', monospace", fontSize: 11, letterSpacing: "0.05em", color: "#a0a0a0", padding: "5px 12px", border: "1px solid #1f1f1f", borderRadius: 20, background: "rgba(255,255,255,0.02)" }}>
                  {t}
                </span>
              ))}
            </div>
          </div>

          {/* Quick links */}
          <div style={{ border: "1px solid #1a1a1a", borderRadius: 16, overflow: "hidden", marginTop: 2 }}>
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
                  style={{ display: "flex", alignItems: "center", gap: 14, padding: "16px 20px", background: "#0d0d0d", textDecoration: "none", borderBottom: i < arr.length - 1 ? "1px solid #1a1a1a" : "none", transition: "background 0.2s" }}
                  onMouseEnter={(e) => { e.currentTarget.style.background = "#111"; e.currentTarget.querySelector(".link-label").style.color = "#c8f241"; }}
                  onMouseLeave={(e) => { e.currentTarget.style.background = "#0d0d0d"; e.currentTarget.querySelector(".link-label").style.color = "#f0ede6"; }}
                >
                  <Icon size={14} color="#6b6b6b" />
                  <div>
                    <div className="link-label" style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 13, color: "#f0ede6", transition: "color 0.2s" }}>{label}</div>
                    <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 10, color: "#3a3a3a", marginTop: 2, letterSpacing: "0.05em" }}>{sub}</div>
                  </div>
                </a>
              ))}
          </div>
        </aside>

        {/* ─────── Main content — the ONLY part that scrolls ─────── */}
        <main
          ref={contentRef}
          style={{
            minWidth: 0,
            overflowY: "auto",
            paddingTop: "4vh",
            paddingBottom: "6vh",
            ...fadeUp(0.25),
          }}
          className="docs-main"
        >
          {/* Brief — the description gets a real home instead of a clipped header line */}
          <div style={{
            border: "1px solid #1a1a1a",
            borderRadius: 16,
            background: "#0d0d0d",
            padding: "28px 32px",
            marginBottom: 32,
            position: "relative",
            overflow: "hidden",
          }}>
            <div style={{
              position: "absolute",
              top: 0,
              left: 0,
              width: 3,
              height: "100%",
              background: "#c8f241",
            }} />
            <p style={{ fontFamily: "'DM Mono', monospace", fontSize: 11, letterSpacing: "0.12em", textTransform: "uppercase", color: "#c8f241", marginBottom: 12 }}>
              Brief
            </p>
            <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "clamp(1rem, 1.3vw, 1.15rem)", lineHeight: 1.8, color: "#d0d0d0", margin: 0 }}>
              {project.description}
            </p>
          </div>

          {/* Tab bar */}
          <div style={{ display: "flex", gap: 2, marginBottom: 32, borderBottom: "1px solid #1a1a1a", paddingBottom: 0, position: "sticky", top: 0, background: "#0a0a0a", zIndex: 5 }}>
            {tabs.map(({ id, label, icon: Icon }) => {
              const active = activeTab === id;
              return (
                <button
                  key={id}
                  onClick={() => setActiveTab(id)}
                  style={{ display: "inline-flex", alignItems: "center", gap: 8, fontFamily: "'DM Sans', sans-serif", fontSize: 13, fontWeight: active ? 500 : 400, color: active ? "#f0ede6" : "#6b6b6b", background: "none", border: "none", padding: "12px 20px", cursor: "none", borderBottom: active ? "2px solid #c8f241" : "2px solid transparent", marginBottom: "-1px", transition: "color 0.2s" }}
                  onMouseEnter={(e) => { if (!active) e.currentTarget.style.color = "#d0d0d0"; }}
                  onMouseLeave={(e) => { if (!active) e.currentTarget.style.color = "#6b6b6b"; }}
                >
                  <Icon size={14} />
                  {label}
                </button>
              );
            })}
          </div>

          {/* Tab content */}
          <div key={activeTab} style={{ animation: "tabIn 0.35s ease" }}>

            {/* DOCUMENTATION */}
            {activeTab === "documentation" && (
              <div>
                {project.markdown ? (
                  <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeHighlight]} components={markdownComponents}>
                    {project.markdown}
                  </ReactMarkdown>
                ) : (
                  <div style={{ padding: "8vh 0", textAlign: "center" }}>
                    <p style={{ fontFamily: "'DM Mono', monospace", fontSize: 11, letterSpacing: "0.15em", color: "#c8f241", textTransform: "uppercase", marginBottom: 20 }}>Coming soon</p>
                    <h3 style={{ fontFamily: "'DM Serif Display', serif", fontSize: "clamp(1.8rem, 3vw, 2.5rem)", fontWeight: 400, color: "#f0ede6", lineHeight: 1.2, marginBottom: 16 }}>
                      Documentation in <span style={{ fontStyle: "italic" }}>progress</span>
                    </h3>
                    <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 15, color: "#6b6b6b", maxWidth: 400, margin: "0 auto", lineHeight: 1.7 }}>
                      Comprehensive docs for this project are being written. Check the GitHub repo in the meantime.
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* OVERVIEW */}
            {activeTab === "overview" && (
              <div>
                <p style={{ fontFamily: "'DM Mono', monospace", fontSize: 11, letterSpacing: "0.15em", color: "#c8f241", textTransform: "uppercase", marginBottom: 16 }}>Overview</p>
                <h2 style={{ fontFamily: "'DM Serif Display', serif", fontSize: "clamp(1.8rem, 3vw, 2.5rem)", fontWeight: 400, color: "#f0ede6", lineHeight: 1.1, marginBottom: 48 }}>
                  What it <span style={{ fontStyle: "italic" }}>does</span>
                </h2>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 2 }} className="overview-grid">
                  {/* Features */}
                  <div style={{ border: "1px solid #1a1a1a", borderRadius: 16, background: "#0d0d0d", padding: "32px 28px" }}>
                    <p style={{ fontFamily: "'DM Mono', monospace", fontSize: 11, letterSpacing: "0.12em", textTransform: "uppercase", color: "#6b6b6b", marginBottom: 24 }}>Key features</p>
                    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                      {project.features?.map((feature, i) => (
                        <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: 12 }}>
                          <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#c8f241", flexShrink: 0, marginTop: 8 }} />
                          <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 14, color: "#a0a0a0", lineHeight: 1.6 }}>{feature}</span>
                        </div>
                      )) || <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 14, color: "#3a3a3a" }}>No features listed.</span>}
                    </div>
                  </div>

                  {/* Challenges */}
                  <div style={{ border: "1px solid #1a1a1a", borderRadius: 16, background: "#0d0d0d", padding: "32px 28px" }}>
                    <p style={{ fontFamily: "'DM Mono', monospace", fontSize: 11, letterSpacing: "0.12em", textTransform: "uppercase", color: "#6b6b6b", marginBottom: 24 }}>Challenges solved</p>
                    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                      {project.challenges?.map((c, i) => (
                        <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: 12 }}>
                          <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#3a3a3a", flexShrink: 0, marginTop: 8 }} />
                          <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 14, color: "#a0a0a0", lineHeight: 1.6 }}>{c}</span>
                        </div>
                      )) || <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 14, color: "#3a3a3a" }}>No challenges listed.</span>}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* TECH STACK */}
            {activeTab === "tech" && (
              <div>
                <p style={{ fontFamily: "'DM Mono', monospace", fontSize: 11, letterSpacing: "0.15em", color: "#c8f241", textTransform: "uppercase", marginBottom: 16 }}>Technology</p>
                <h2 style={{ fontFamily: "'DM Serif Display', serif", fontSize: "clamp(1.8rem, 3vw, 2.5rem)", fontWeight: 400, color: "#f0ede6", lineHeight: 1.1, marginBottom: 48 }}>
                  Technical <span style={{ fontStyle: "italic" }}>arsenal</span>
                </h2>

                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: 2 }}>
                  {project.tech.map((tech, i) => (
                    <div
                      key={i}
                      style={{ border: "1px solid #1a1a1a", borderRadius: 16, background: "#0d0d0d", padding: "28px 24px", transition: "border-color 0.2s, background 0.2s" }}
                      onMouseEnter={(e) => { e.currentTarget.style.borderColor = "#c8f241"; e.currentTarget.style.background = "#0f0f0f"; }}
                      onMouseLeave={(e) => { e.currentTarget.style.borderColor = "#1a1a1a"; e.currentTarget.style.background = "#0d0d0d"; }}
                    >
                      <div style={{ width: 36, height: 36, borderRadius: 10, border: "1px solid #1f1f1f", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 16 }}>
                        <Code size={16} color="#6b6b6b" />
                      </div>
                      <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 14, fontWeight: 500, color: "#f0ede6", marginBottom: 6 }}>{tech}</div>
                      <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 10, color: "#3a3a3a", letterSpacing: "0.08em" }}>
                        {tech.toLowerCase().includes("react") || tech.toLowerCase().includes("next") ? "Frontend" :
                         tech.toLowerCase().includes("node") || tech.toLowerCase().includes("api") ? "Backend" :
                         tech.toLowerCase().includes("python") || tech.toLowerCase().includes("tensorflow") || tech.toLowerCase().includes("torch") ? "ML / AI" :
                         tech.toLowerCase().includes("aws") || tech.toLowerCase().includes("gcp") || tech.toLowerCase().includes("docker") ? "Infrastructure" :
                         "Core"}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </main>
      </div>

      {/* ── Global styles ── */}
      <style>{`
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { cursor: none !important; background: #0a0a0a; }
        a, button { cursor: none !important; }
        ::selection { background: #c8f241; color: #0a0a0a; }

        .docs-sidebar::-webkit-scrollbar,
        .docs-main::-webkit-scrollbar { width: 4px; }
        .docs-sidebar::-webkit-scrollbar-track,
        .docs-main::-webkit-scrollbar-track { background: transparent; }
        .docs-sidebar::-webkit-scrollbar-thumb,
        .docs-main::-webkit-scrollbar-thumb { background: #1f1f1f; border-radius: 4px; }

        @keyframes tabIn {
          from { opacity: 0; transform: translateY(12px); }
          to   { opacity: 1; transform: translateY(0); }
        }

        .code-block-group:hover .copy-btn { opacity: 1 !important; }

        @media (max-width: 900px) {
          .docs-grid { grid-template-columns: 1fr !important; }
          .docs-sidebar { overflow-y: visible !important; }
        }

        @media (max-width: 640px) {
          .overview-grid { grid-template-columns: 1fr !important; }
        }

        /* Below the breakpoint, fall back to one natural page scroll
           instead of two competing scroll panes — better on mobile. */
        @media (max-width: 900px) {
          html, body, #root { height: auto !important; }
        }

        @media (prefers-reduced-motion: reduce) {
          * { animation-duration: 0.01ms !important; transition-duration: 0.01ms !important; }
        }
      `}</style>
    </div>
  );
};

export default ProjectDocs;
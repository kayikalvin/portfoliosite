/**
 * KALVIN KAYI — PROJECT DOCS
 * Design system: "Machine Precision / Human Warmth"
 *
 * Matches Home.jsx exactly:
 *   --ink:       #0a0a0a
 *   --off-white: #f0ede6
 *   --electric:  #c8f241
 *   --muted:     #6b6b6b
 *   --border:    #1f1f1f
 *   --glass:     rgba(255,255,255,0.04)
 *
 *   DM Serif Display / DM Sans / DM Mono
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
    <div style={{ background: "#0a0a0a", color: "#f0ede6", minHeight: "100vh", cursor: "none" }}>
      <CustomCursor />
      <NoiseOverlay />

      {/* ── Sticky nav bar ── */}
      <div style={{ position: "sticky", top: 0, zIndex: 50, background: "rgba(10,10,10,0.85)", backdropFilter: "blur(20px)", borderBottom: "1px solid #1a1a1a" }}>
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

      <div style={{ maxWidth: 1280, margin: "0 auto", padding: "6vh 5vw", position: "relative", zIndex: 2 }}>

        {/* ── Page header ── */}
        <div style={{ marginBottom: "6vh", borderBottom: "1px solid #1a1a1a", paddingBottom: "5vh" }}>
          <p style={{ fontFamily: "'DM Mono', monospace", fontSize: 11, letterSpacing: "0.15em", color: "#c8f241", textTransform: "uppercase", marginBottom: 16, ...fadeUp(0.05) }}>
            Case Study
          </p>
          <h1 style={{ fontFamily: "'DM Serif Display', serif", fontSize: "clamp(2.5rem, 5vw, 5rem)", fontWeight: 400, lineHeight: 1.05, color: "#f0ede6", marginBottom: 16, ...fadeUp(0.1) }}>
            {project.title}
          </h1>
          <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "clamp(1rem, 1.4vw, 1.2rem)", color: "#6b6b6b", maxWidth: 600, lineHeight: 1.7, ...fadeUp(0.15) }}>
            {project.description}
          </p>
        </div>

        {/* ── Layout grid ── */}
        <div style={{ display: "grid", gridTemplateColumns: "260px 1fr", gap: "5vw", alignItems: "start" }} className="docs-grid">

          {/* ─────── Sidebar ─────── */}
          <aside style={{ position: "sticky", top: 80, ...fadeUp(0.2) }}>

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

          {/* ─────── Main content ─────── */}
          <main style={{ minWidth: 0, ...fadeUp(0.25) }}>

            {/* Tab bar */}
            <div style={{ display: "flex", gap: 2, marginBottom: 32, borderBottom: "1px solid #1a1a1a", paddingBottom: 0 }}>
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
            <div ref={contentRef} key={activeTab} style={{ animation: "tabIn 0.35s ease" }}>

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
      </div>

      {/* ── Global styles ── */}
      <style>{`
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { cursor: none !important; background: #0a0a0a; }
        a, button { cursor: none !important; }
        ::selection { background: #c8f241; color: #0a0a0a; }
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-track { background: #0a0a0a; }
        ::-webkit-scrollbar-thumb { background: #1f1f1f; border-radius: 4px; }

        @keyframes tabIn {
          from { opacity: 0; transform: translateY(12px); }
          to   { opacity: 1; transform: translateY(0); }
        }

        .code-block-group:hover .copy-btn { opacity: 1 !important; }

        @media (max-width: 900px) {
          .docs-grid { grid-template-columns: 1fr !important; }
          aside { position: static !important; }
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





























// import { useParams, Link } from "react-router-dom";
// import { projects as staticProjects } from "../utils/utils";
// import { useEffect, useState, useRef } from "react";
// import { 
//   Cast, 
//   FileCode2, 
//   Github, 
//   ExternalLink, 
//   ArrowLeft,
//   Calendar,
//   Clock,
//   Users,
//   Star,
//   Code,
//   BookOpen,
//   ChevronRight,
//   Download,
//   Copy,
//   Check,
//   Eye,
//   Globe,
//   Layers
// } from "lucide-react";
// import ReactMarkdown from "react-markdown";
// import remarkGfm from "remark-gfm";
// import rehypeHighlight from "rehype-highlight";
// import "highlight.js/styles/github-dark.css";
// import { motion, AnimatePresence } from "framer-motion";

// const ProjectDocs = () => {
//   const { projectId } = useParams();
//   const decodedId = projectId ? decodeURIComponent(projectId) : '';
//   const [project, setProject] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [activeTab, setActiveTab] = useState('documentation');
//   const [copied, setCopied] = useState(false);
//   const contentRef = useRef(null);

//   // Custom scroll to top when tab changes
//   useEffect(() => {
//     if (contentRef.current) {
//       contentRef.current.scrollTop = 0;
//     }
//   }, [activeTab]);

//   useEffect(() => {
//     const foundProject = staticProjects.find((p) => p.title === decodedId);
//     setProject(foundProject || null);
    
//     let mounted = true;
//     setLoading(true);
    
//     // Simulate loading for better UX
//     const timeoutId = setTimeout(() => {
//       if (!projectId) {
//         setLoading(false);
//         return;
//       }
      
//       fetch(`http://localhost:4000/api/projects/${encodeURIComponent(decodedId)}`)
//         .then((r) => {
//           if (!r.ok) throw new Error('notfound');
//           return r.json();
//         })
//         .then((data) => {
//           if (mounted) setProject(data);
//         })
//         .catch(() => {
//           console.log("Using static project data");
//         })
//         .finally(() => mounted && setLoading(false));
//     }, 500);

//     return () => {
//       mounted = false;
//       clearTimeout(timeoutId);
//     };
//   }, [projectId, decodedId]);

//   // Copy code to clipboard
//   const copyToClipboard = (text) => {
//     navigator.clipboard.writeText(text);
//     setCopied(true);
//     setTimeout(() => setCopied(false), 2000);
//   };

//   if (loading) {
//     return (
//       <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black flex items-center justify-center">
//         <div className="text-center">
//           <div className="w-16 h-16 border-4 border-gray-700 border-t-cyan-500 rounded-full animate-spin mx-auto mb-6"></div>
//           <p className="text-gray-400">Loading project documentation...</p>
//         </div>
//       </div>
//     );
//   }

//   if (!project) {
//     return (
//       <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black flex items-center justify-center">
//         <div className="text-center max-w-md p-8 bg-white/5 border border-white/10 rounded-2xl backdrop-blur-sm">
//           <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-to-r from-red-500/20 to-pink-500/20 flex items-center justify-center">
//             <span className="text-4xl">🚨</span>
//           </div>
//           <h2 className="text-2xl font-bold text-white mb-3">Project Not Found</h2>
//           <p className="text-gray-400 mb-6">
//             The project you're looking for doesn't exist or has been moved.
//           </p>
//           <Link
//             to="/"
//             className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-gradient-to-r from-cyan-500 to-purple-500 text-white font-medium hover:opacity-90 transition-opacity"
//           >
//             <ArrowLeft size={18} />
//             Back to Home
//           </Link>
//         </div>
//       </div>
//     );
//   }

//   // Enhanced markdown components with better styling
//   const markdownComponents = {
//     h1: ({ children }) => (
//       <motion.h1 
//         initial={{ opacity: 0, y: 20 }}
//         animate={{ opacity: 1, y: 0 }}
//         className="text-3xl md:text-4xl font-bold text-white mb-6 pb-4 border-b border-white/10"
//       >
//         {children}
//       </motion.h1>
//     ),
//     h2: ({ children }) => (
//       <h2 className="text-2xl font-bold text-white mb-4 mt-8 flex items-center gap-2">
//         <ChevronRight className="text-cyan-400" size={20} />
//         {children}
//       </h2>
//     ),
//     h3: ({ children }) => (
//       <h3 className="text-xl font-semibold text-white mb-3 mt-6">
//         {children}
//       </h3>
//     ),
//     p: ({ children }) => (
//       <p className="text-gray-300 mb-6 leading-relaxed">
//         {children}
//       </p>
//     ),
//     ul: ({ children }) => (
//       <ul className="mb-6 space-y-2">
//         {children}
//       </ul>
//     ),
//     ol: ({ children }) => (
//       <ol className="mb-6 space-y-2">
//         {children}
//       </ol>
//     ),
//     li: ({ children }) => (
//       <li className="flex items-start gap-3 text-gray-300">
//         <div className="mt-2 w-1.5 h-1.5 rounded-full bg-cyan-400 flex-shrink-0"></div>
//         <span>{children}</span>
//       </li>
//     ),
//     strong: ({ children }) => (
//       <strong className="text-white font-semibold">
//         {children}
//       </strong>
//     ),
//     code: ({ children, className, inline }) => {
//       if (inline) {
//         return (
//           <code className="bg-gray-800 text-gray-200 px-2 py-1 rounded text-sm font-mono border border-gray-700">
//             {children}
//           </code>
//         );
//       }
      
//       const codeString = String(children).replace(/\n$/, '');
//       return (
//         <div className="relative group mb-6">
//           <pre className="bg-gray-900 rounded-xl p-6 overflow-x-auto border border-gray-800">
//             <code className={className}>{children}</code>
//           </pre>
//           <button
//             onClick={() => copyToClipboard(codeString)}
//             className="absolute top-4 right-4 px-3 py-2 rounded-lg bg-gray-800 text-gray-300 hover:bg-gray-700 hover:text-white transition-all opacity-0 group-hover:opacity-100 flex items-center gap-2"
//           >
//             {copied ? <Check size={16} /> : <Copy size={16} />}
//             <span className="text-sm">{copied ? 'Copied!' : 'Copy'}</span>
//           </button>
//         </div>
//       );
//     },
//     pre: ({ children }) => (
//       <>{children}</>
//     ),
//     blockquote: ({ children }) => (
//       <blockquote className="border-l-4 border-cyan-500 pl-6 py-4 italic text-gray-300 bg-gradient-to-r from-cyan-500/10 to-transparent mb-6">
//         {children}
//       </blockquote>
//     ),
//     a: ({ children, href }) => (
//       <a
//         href={href}
//         className="text-cyan-400 hover:text-cyan-300 underline hover:no-underline transition-colors inline-flex items-center gap-1"
//         target="_blank"
//         rel="noopener noreferrer"
//       >
//         {children}
//         <ExternalLink size={14} />
//       </a>
//     ),
//     table: ({ children }) => (
//       <div className="overflow-x-auto mb-8 rounded-xl border border-gray-800">
//         <table className="min-w-full">
//           {children}
//         </table>
//       </div>
//     ),
//     thead: ({ children }) => (
//       <thead className="bg-gradient-to-r from-gray-900 to-gray-800">
//         {children}
//       </thead>
//     ),
//     tbody: ({ children }) => (
//       <tbody className="divide-y divide-gray-800">
//         {children}
//       </tbody>
//     ),
//     tr: ({ children }) => (
//       <tr className="hover:bg-white/5 transition-colors">
//         {children}
//       </tr>
//     ),
//     th: ({ children }) => (
//       <th className="px-6 py-4 text-left text-white font-semibold">
//         {children}
//       </th>
//     ),
//     td: ({ children }) => (
//       <td className="px-6 py-4 text-gray-300">
//         {children}
//       </td>
//     ),
//     img: ({ src, alt }) => (
//       <motion.div 
//         initial={{ opacity: 0, scale: 0.95 }}
//         animate={{ opacity: 1, scale: 1 }}
//         className="mb-8 rounded-2xl overflow-hidden border border-white/10 shadow-2xl"
//       >
//         <img
//           src={src}
//           alt={alt}
//           className="w-full h-auto object-cover hover:scale-105 transition-transform duration-500 cursor-zoom-in"
//           loading="lazy"
//         />
//         {alt && (
//           <div className="px-4 py-3 bg-gray-900/80 backdrop-blur-sm text-sm text-gray-400">
//             {alt}
//           </div>
//         )}
//       </motion.div>
//     ),
//   };

//   // Tab configuration
//   const tabs = [
//     { id: 'documentation', label: 'Documentation', icon: BookOpen },
//     { id: 'overview', label: 'Overview', icon: Eye },
//     { id: 'tech', label: 'Tech Stack', icon: Layers },
//   ];

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black">
//       {/* Navigation */}
//       <div className="sticky top-0 z-40 bg-black/80 backdrop-blur-xl border-b border-white/10">
//         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//           <div className="flex items-center justify-between h-16">
//             <Link
//               to="/"
//               className="inline-flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
//             >
//               <ArrowLeft size={20} />
//               Back to Portfolio
//             </Link>
            
//             <div className="flex items-center gap-4">
//               {project.code && (
//                 <a
//                   href={project.code}
//                   target="_blank"
//                   rel="noopener noreferrer"
//                   className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-white/5 hover:bg-white/10 transition-all"
//                 >
//                   <Github size={18} />
//                   <span className="hidden sm:inline">Source Code</span>
//                 </a>
//               )}
//               {project.url && (
//                 <a
//                   href={project.url}
//                   target="_blank"
//                   rel="noopener noreferrer"
//                   className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-cyan-500 to-purple-500 text-white hover:opacity-90 transition-opacity"
//                 >
//                   <Globe size={18} />
//                   <span className="hidden sm:inline">Live Demo</span>
//                 </a>
//               )}
//             </div>
//           </div>
//         </div>
//       </div>

//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
//         <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
//           {/* Sidebar */}
//           <div className="lg:col-span-1 space-y-6">
//             {/* Project Card */}
//             <div className="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-sm">
//               <div className="flex flex-col sm:flex-row items-center sm:items-start justify-between mb-4 space-y-4 sm:space-y-0">
//                 <div className="w-full">
//                   <h1 className="text-2xl font-bold text-white mb-2 text-center sm:text-left">{project.title}</h1>
//                   <p className="text-gray-400 text-sm text-center sm:text-left">{project.description}</p>
//                 </div>
//                 <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-cyan-500/20 to-purple-500/20 flex items-center justify-center">
//                   <Code className="text-cyan-400" size={24} />
//                 </div>
//               </div>

//               {/* Project Stats */}
//               <div className="space-y-4 mt-6">
//                 <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between text-sm gap-2 sm:gap-0">
//                   <div className="flex items-center gap-2 text-gray-400">
//                     <Calendar size={16} />
//                     <span>Created</span>
//                   </div>
//                   <span className="text-white">{project.createdAt || '2024'}</span>
//                 </div>

//                 <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between text-sm gap-2 sm:gap-0">
//                   <div className="flex items-center gap-2 text-gray-400">
//                     <Clock size={16} />
//                     <span>Status</span>
//                   </div>
//                   <span className={`px-2 py-1 rounded-full text-xs font-medium ${
//                     project.status === 'active' 
//                       ? 'bg-green-500/20 text-green-400'
//                       : project.status === 'completed'
//                       ? 'bg-blue-500/20 text-blue-400'
//                       : 'bg-gray-500/20 text-gray-400'
//                   }`}>
//                     {project.status || 'Active'}
//                   </span>
//                 </div>

//                 {project.stats && (
//                   <>
//                     {project.stats.stars && (
//                       <div className="flex items-center justify-between text-sm">
//                         <div className="flex items-center gap-2 text-gray-400">
//                           <Star size={16} />
//                           <span>Stars</span>
//                         </div>
//                         <span className="text-white">{project.stats.stars}</span>
//                       </div>
//                     )}
                    
//                     {project.stats.contributors && (
//                       <div className="flex items-center justify-between text-sm">
//                         <div className="flex items-center gap-2 text-gray-400">
//                           <Users size={16} />
//                           <span>Contributors</span>
//                         </div>
//                         <span className="text-white">{project.stats.contributors}</span>
//                       </div>
//                     )}
//                   </>
//                 )}
//               </div>

//               {/* Tech Stack */}
//               <div className="mt-6">
//                 <h3 className="text-sm font-semibold text-gray-400 mb-3">TECH STACK</h3>
//                 <div className="flex flex-wrap gap-2 justify-center sm:justify-start">
//                   {project.tech.map((tech, index) => (
//                     <span
//                       key={index}
//                       className="px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-sm text-gray-300 hover:bg-white/10 transition-colors"
//                     >
//                       {tech}
//                     </span>
//                   ))}
//                 </div>
//               </div>
//             </div>

//             {/* Quick Links */}
//             <div className="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-sm">
//               <h3 className="text-lg font-semibold text-white mb-4">Quick Links</h3>
//               <div className="space-y-3">
//                 {project.code && (
//                   <a
//                     href={project.code}
//                     target="_blank"
//                     rel="noopener noreferrer"
//                     className="flex items-center gap-3 p-3 rounded-lg hover:bg-white/5 transition-all group w-full"
//                   >
//                     <Github size={20} className="text-gray-400 group-hover:text-white" />
//                     <div>
//                       <div className="font-medium text-white">GitHub Repository</div>
//                       <div className="text-sm text-gray-500">View source code</div>
//                     </div>
//                   </a>
//                 )}
//                 {project.url && (
//                   <a
//                     href={project.url}
//                     target="_blank"
//                     rel="noopener noreferrer"
//                     className="flex items-center gap-3 p-3 rounded-lg hover:bg-white/5 transition-all group w-full"
//                   >
//                     <ExternalLink size={20} className="text-gray-400 group-hover:text-white" />
//                     <div>
//                       <div className="font-medium text-white">Live Demo</div>
//                       <div className="text-sm text-gray-500">Try it out</div>
//                     </div>
//                   </a>
//                 )}
//               </div>
//             </div>
//           </div>

//           {/* Main Content */}
//           <div className="lg:col-span-3">
//             {/* Tabs */}
//             <div className="flex space-x-1 mb-8 p-1 rounded-xl bg-white/5 border border-white/10 backdrop-blur-sm overflow-x-auto">
//               {tabs.map((tab) => {
//                 const Icon = tab.icon;
//                 const isActive = activeTab === tab.id;
                
//                 return (
//                   <button
//                     key={tab.id}
//                     onClick={() => setActiveTab(tab.id)}
//                     className={`flex-1 min-w-[120px] sm:min-w-0 flex items-center justify-center gap-2 px-4 py-3 rounded-lg transition-all ${
//                       isActive
//                         ? 'bg-gradient-to-r from-cyan-500 to-purple-500 text-white'
//                         : 'text-gray-400 hover:text-white hover:bg-white/5'
//                     }`}
//                   >
//                     <Icon size={20} />
//                     <span className="font-medium">{tab.label}</span>
//                   </button>
//                 );
//               })}
//             </div>

//             {/* Tab Content */}
//             <div ref={contentRef} className="overflow-y-auto max-h-[60vh] sm:max-h-[calc(100vh-200px)]">
//               <AnimatePresence mode="wait">
//                 <motion.div
//                   key={activeTab}
//                   initial={{ opacity: 0, y: 20 }}
//                   animate={{ opacity: 1, y: 0 }}
//                   exit={{ opacity: 0, y: -20 }}
//                   transition={{ duration: 0.3 }}
//                   className="bg-white/5 border border-white/10 rounded-2xl p-4 sm:p-8 backdrop-blur-sm"
//                 >
//                   {activeTab === 'documentation' && (
//                     <div className="markdown-content">
//                       {project.markdown ? (
//                         <ReactMarkdown
//                           remarkPlugins={[remarkGfm]}
//                           rehypePlugins={[rehypeHighlight]}
//                           components={markdownComponents}
//                         >
//                           {project.markdown}
//                         </ReactMarkdown>
//                       ) : (
//                         <div className="text-center py-12">
//                           <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-to-r from-yellow-500/20 to-orange-500/20 flex items-center justify-center">
//                             <span className="text-3xl">🚧</span>
//                           </div>
//                           <h3 className="text-2xl font-bold text-white mb-3">Documentation Coming Soon</h3>
//                           <p className="text-gray-400 max-w-md mx-auto">
//                             We're currently working on comprehensive documentation for this project. Check back soon!
//                           </p>
//                         </div>
//                       )}
//                     </div>
//                   )}

//                   {activeTab === 'overview' && (
//                     <div className="space-y-6">
//                       <h2 className="text-3xl font-bold text-white mb-6">Project Overview</h2>
//                       <div className="grid md:grid-cols-2 gap-6">
//                         <div className="space-y-4">
//                           <h3 className="text-xl font-semibold text-white">Key Features</h3>
//                           <ul className="space-y-3">
//                             {project.features?.map((feature, index) => (
//                               <li key={index} className="flex items-start gap-3">
//                                 <div className="mt-1.5 w-2 h-2 rounded-full bg-cyan-400"></div>
//                                 <span className="text-gray-300">{feature}</span>
//                               </li>
//                             )) || (
//                               <li className="text-gray-400">No features listed</li>
//                             )}
//                           </ul>
//                         </div>
//                         <div className="space-y-4">
//                           <h3 className="text-xl font-semibold text-white">Challenges Solved</h3>
//                           <ul className="space-y-3">
//                             {project.challenges?.map((challenge, index) => (
//                               <li key={index} className="flex items-start gap-3">
//                                 <div className="mt-1.5 w-2 h-2 rounded-full bg-purple-400"></div>
//                                 <span className="text-gray-300">{challenge}</span>
//                               </li>
//                             )) || (
//                               <li className="text-gray-400">No challenges listed</li>
//                             )}
//                           </ul>
//                         </div>
//                       </div>
//                     </div>
//                   )}

//                   {activeTab === 'tech' && (
//                     <div className="space-y-6">
//                       <h2 className="text-3xl font-bold text-white mb-6">Technology Stack</h2>
//                       <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
//                         {project.tech.map((tech, index) => (
//                           <div
//                             key={index}
//                             className="p-4 rounded-xl bg-white/5 border border-white/10 hover:border-cyan-500/30 transition-all group"
//                           >
//                             <div className="flex items-center gap-3 mb-2">
//                               <div className="w-10 h-10 rounded-lg bg-gradient-to-r from-cyan-500/10 to-purple-500/10 flex items-center justify-center">
//                                 <Code size={20} className="text-cyan-400" />
//                               </div>
//                               <h3 className="font-semibold text-white">{tech}</h3>
//                             </div>
//                             <p className="text-sm text-gray-400">
//                               Used for {tech.toLowerCase()} implementation
//                             </p>
//                           </div>
//                         ))}
//                       </div>
//                     </div>
//                   )}
//                 </motion.div>
//               </AnimatePresence>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default ProjectDocs;
















/**
 * KALVIN KAYI — PORTFOLIO
 * Design direction: "Machine Precision / Human Warmth"
 *
 * Palette:
 *   --ink:        #0a0a0a   (near-black background)
 *   --off-white:  #f0ede6   (warm paper white — type, accents)
 *   --electric:   #c8f241   (acid chartreuse — THE signature accent)
 *   --muted:      #6b6b6b   (secondary text)
 *   --border:     #1f1f1f   (subtle dividers)
 *   --glass:      rgba(255,255,255,0.04)
 *
 * Type:
 *   Display  — "DM Serif Display" (editorial gravitas, italic for contrast)
 *   Body     — "DM Sans" (clean, slightly geometric)
 *   Mono     — "DM Mono" (data labels, counters)
 *
 * Signature element:
 *   A full-viewport "KALVIN" kinetic text block where each letter
 *   individually tracks the mouse position and warps in 3D perspective —
 *   only on hero entry, then settles. Nothing else does this.
 *
 * Layout language: strict asymmetric grid, generous negative space,
 * large typographic anchors with small supporting elements.
 */

import {
  useEffect,
  useRef,
  useState,
  useCallback,
  useMemo,
} from "react";
import { Link } from "react-router-dom";
import {
  ArrowUpRight,
  Github,
  Linkedin,
  Mail,
  ExternalLink,
  ChevronDown,
} from "lucide-react";
import Projects from "../components/Projects";
import { posts } from "../utils/utils";
import PaypalDonate from "../components/PaypalDonate";
import About from "../components/About";
import Skills from "../components/EnhancedSkillsSection";

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

/* ─────────────────────────────────────────────
   GLOBAL CURSOR
───────────────────────────────────────────── */
function CustomCursor() {
  const dotRef = useRef(null);
  const ringRef = useRef(null);
  const pos = useRef({ x: -100, y: -100 });
  const ring = useRef({ x: -100, y: -100 });
  const raf = useRef(null);
  const [hovered, setHovered] = useState(false);

  useEffect(() => {
    const move = (e) => {
      pos.current = { x: e.clientX, y: e.clientY };
    };
    const over = (e) => {
      if (
        e.target.closest("a, button, [data-cursor-expand]")
      )
        setHovered(true);
    };
    const out = () => setHovered(false);

    window.addEventListener("mousemove", move);
    document.addEventListener("mouseover", over);
    document.addEventListener("mouseout", out);

    const loop = () => {
      ring.current.x += (pos.current.x - ring.current.x) * 0.12;
      ring.current.y += (pos.current.y - ring.current.y) * 0.12;

      if (dotRef.current) {
        dotRef.current.style.transform = `translate(${pos.current.x}px, ${pos.current.y}px) translate(-50%,-50%)`;
      }
      if (ringRef.current) {
        ringRef.current.style.transform = `translate(${ring.current.x}px, ${ring.current.y}px) translate(-50%,-50%) scale(${hovered ? 2.5 : 1})`;
      }
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
      <div
        ref={dotRef}
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: 8,
          height: 8,
          borderRadius: "50%",
          background: "#c8f241",
          pointerEvents: "none",
          zIndex: 9999,
          willChange: "transform",
        }}
      />
      <div
        ref={ringRef}
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: 36,
          height: 36,
          borderRadius: "50%",
          border: "1.5px solid rgba(200,242,65,0.4)",
          pointerEvents: "none",
          zIndex: 9998,
          willChange: "transform",
          transition: "transform 0.15s ease, opacity 0.2s",
        }}
      />
    </>
  );
}

/* ─────────────────────────────────────────────
   MAGNETIC BUTTON
───────────────────────────────────────────── */
function MagneticBtn({ children, href, target, onClick, style, onMouseEnter, onMouseLeave }) {
  const ref = useRef(null);
  const onMove = useCallback((e) => {
    const el = ref.current; if (!el) return;
    const r = el.getBoundingClientRect();
    el.style.transform = `translate(${(e.clientX - (r.left + r.width / 2)) * 0.25}px,${(e.clientY - (r.top + r.height / 2)) * 0.25}px)`;
  }, []);
  const onLeave = useCallback((e) => {
    if (ref.current) ref.current.style.transform = "translate(0,0)";
    onMouseLeave?.(e);
  }, [onMouseLeave]);
  const Tag = href ? "a" : "button";
  return (
    <Tag ref={ref} href={href} target={target}
      rel={target === "_blank" ? "noopener noreferrer" : undefined}
      onClick={onClick} style={{ display: "inline-flex", transition: "transform 0.3s cubic-bezier(.23,1,.32,1)", ...style }}
      onMouseMove={onMove} onMouseLeave={onLeave} onMouseEnter={onMouseEnter}>
      {children}
    </Tag>
  );
}


/* ─────────────────────────────────────────────
   NOISE TEXTURE OVERLAY
───────────────────────────────────────────── */
function NoiseOverlay() {
  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 1,
        pointerEvents: "none",
        opacity: 0.035,
        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
        backgroundSize: "200px 200px",
      }}
    />
  );
}

/* ─────────────────────────────────────────────
   HERO — KINETIC LETTERS
───────────────────────────────────────────── */
export function KineticHero() {
  const letters      = "KALVIN".split("");
  const containerRef = useRef(null);
  const letterRefs   = useRef([]);
  const mouseRef     = useRef({ x: 0.5, y: 0.5 });
  const raf          = useRef(null);
  const [entered,   setEntered]   = useState(false);
  const [menuOpen,  setMenuOpen]  = useState(false);
  const [isMobile,  setIsMobile]  = useState(false);
  const [imgLoaded, setImgLoaded] = useState(false);
 
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);
 
  useEffect(() => {
    const t = setTimeout(() => setEntered(true), 200);
    return () => clearTimeout(t);
  }, []);
 
  useEffect(() => {
    if (isMobile) return;
    const onMove = (e) => {
      mouseRef.current = { x: e.clientX / window.innerWidth, y: e.clientY / window.innerHeight };
    };
    window.addEventListener("mousemove", onMove);
    const loop = () => {
      const { x, y } = mouseRef.current;
      letterRefs.current.forEach((el, i) => {
        if (!el) return;
        const dx  = (x - 0.5) * 22 * (i % 2 === 0 ? 1 : -1);
        const dy  = (y - 0.5) * 14;
        const rot = (x - 0.5) * 4  * (i % 2 === 0 ? 1 : -1);
        el.style.transform = `translate(${dx}px,${dy}px) rotate(${rot}deg)`;
      });
      raf.current = requestAnimationFrame(loop);
    };
    raf.current = requestAnimationFrame(loop);
    return () => { window.removeEventListener("mousemove", onMove); cancelAnimationFrame(raf.current); };
  }, [isMobile]);
 
  useEffect(() => { if (!isMobile) setMenuOpen(false); }, [isMobile]);
 
  const navItems = ["Work", "About", "Contact"];
 
  return (
    <section
      id="home"
      ref={containerRef}
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "flex-end",
        padding: isMobile ? "0 6vw 10vh" : "0 5vw 8vh",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* BACKGROUND — portrait image + vignette */}
      <div style={{ position: "absolute", inset: 0, zIndex: 0, pointerEvents: "none" }}>
        <img
          src="/1735390396166-removebg.png"
          alt=""
          aria-hidden
          onLoad={() => setImgLoaded(true)}
          style={{
            position: "absolute",
            bottom: 0,
            right: isMobile ? "-5%" : "3vw",
            height: isMobile ? "62vh" : "90vh",
            width: "auto",
            objectFit: "contain",
            objectPosition: "bottom",
            opacity: imgLoaded ? (isMobile ? 0.13 : 0.22) : 0,
            transition: "opacity 1.2s ease 0.4s",
            userSelect: "none",
            WebkitUserDrag: "none",
            filter: "grayscale(20%)",
          }}
        />
        <div style={{
          position: "absolute",
          inset: 0,
          background: isMobile
            ? "linear-gradient(to bottom, #0a0a0a 0%, rgba(10,10,10,0.92) 40%, rgba(10,10,10,0.97) 100%)"
            : "linear-gradient(to right, #0a0a0a 30%, rgba(10,10,10,0.7) 65%, rgba(10,10,10,0.2) 100%), linear-gradient(to bottom, rgba(10,10,10,0.5) 0%, transparent 30%, rgba(10,10,10,0.6) 100%)",
        }} />
        <div style={{
          position: "absolute",
          inset: 0,
          backgroundImage: "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(255,255,255,0.012) 2px, rgba(255,255,255,0.012) 4px)",
          pointerEvents: "none",
        }} />
      </div>
 
      {/* TOP BAR */}
      <div style={{
        position: "absolute",
        top: isMobile ? "4vh" : "5vh",
        left: isMobile ? "6vw" : "5vw",
        right: isMobile ? "6vw" : "5vw",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        zIndex: 20,
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#c8f241", flexShrink: 0 }} />
          <span style={{
            fontFamily: "'DM Mono', monospace",
            fontSize: isMobile ? 10 : 11,
            letterSpacing: "0.15em",
            color: "#6b6b6b",
            textTransform: "uppercase",
          }}>
            {isMobile ? "KK" : "Kalvin Kayi — 2025"}
          </span>
        </div>
 
        {!isMobile && (
          <nav style={{
            display: "flex",
            gap: 0,
            background: "rgba(15,15,15,0.7)",
            backdropFilter: "blur(16px)",
            border: "1px solid #1f1f1f",
            borderRadius: 40,
            padding: "8px 10px",
            boxShadow: "0 8px 30px rgba(0,0,0,0.4)",
          }}>
            {navItems.map((item) => (
              <a
                key={item}
                href={`#${item.toLowerCase()}`}
                style={{
                  fontFamily: "'DM Sans', sans-serif",
                  fontSize: 14,
                  color: "#9a9a9a",
                  textDecoration: "none",
                  letterSpacing: "0.04em",
                  padding: "10px 24px",
                  borderRadius: 32,
                  transition: "color 0.2s, background 0.2s",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.color = "#f0ede6";
                  e.currentTarget.style.background = "rgba(255,255,255,0.06)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.color = "#9a9a9a";
                  e.currentTarget.style.background = "transparent";
                }}
              >
                {item}
              </a>
            ))}
          </nav>
        )}
 
        {isMobile && (
          <button
            onClick={() => setMenuOpen((v) => !v)}
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            style={{
              width: 44,
              height: 44,
              borderRadius: "50%",
              border: "1px solid #1f1f1f",
              background: "rgba(15,15,15,0.8)",
              backdropFilter: "blur(12px)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "none",
              transition: "border-color 0.2s",
            }}
            onMouseEnter={(e) => { e.currentTarget.style.borderColor = "#c8f241"; }}
            onMouseLeave={(e) => { e.currentTarget.style.borderColor = "#1f1f1f"; }}
          >
            {menuOpen
              ? <X size={18} color="#f0ede6" />
              : <Menu size={18} color="#9a9a9a" />}
          </button>
        )}
      </div>
 
      {/* MOBILE DRAWER */}
      {isMobile && (
        <div style={{ position: "fixed", inset: 0, zIndex: 90, pointerEvents: menuOpen ? "all" : "none" }}>
          <div
            onClick={() => setMenuOpen(false)}
            style={{
              position: "absolute",
              inset: 0,
              background: "rgba(10,10,10,0.7)",
              backdropFilter: "blur(8px)",
              opacity: menuOpen ? 1 : 0,
              transition: "opacity 0.3s ease",
            }}
          />
          <div style={{
            position: "absolute",
            top: 0,
            right: 0,
            bottom: 0,
            width: "72vw",
            maxWidth: 300,
            background: "#0d0d0d",
            borderLeft: "1px solid #1f1f1f",
            padding: "6vh 7vw",
            display: "flex",
            flexDirection: "column",
            transform: menuOpen ? "translateX(0)" : "translateX(100%)",
            transition: "transform 0.35s cubic-bezier(.23,1,.32,1)",
          }}>
            <button
              onClick={() => setMenuOpen(false)}
              aria-label="Close menu"
              style={{ alignSelf: "flex-end", background: "none", border: "none", cursor: "none", marginBottom: 40 }}
            >
              <X size={18} color="#6b6b6b" />
            </button>
 
            <p style={{ fontFamily: "'DM Mono', monospace", fontSize: 10, letterSpacing: "0.15em", color: "#3a3a3a", textTransform: "uppercase", marginBottom: 24 }}>
              Navigate
            </p>
 
            {navItems.map((item, i) => (
              <a
                key={item}
                href={`#${item.toLowerCase()}`}
                onClick={() => setMenuOpen(false)}
                style={{
                  fontFamily: "'DM Serif Display', serif",
                  fontSize: "2rem",
                  fontWeight: 400,
                  color: "#f0ede6",
                  textDecoration: "none",
                  padding: "16px 0",
                  borderBottom: "1px solid #1a1a1a",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  opacity: menuOpen ? 1 : 0,
                  transform: menuOpen ? "translateX(0)" : "translateX(20px)",
                  transition: `opacity 0.4s ease ${i * 0.06 + 0.15}s, transform 0.4s ease ${i * 0.06 + 0.15}s, color 0.2s`,
                }}
                onMouseEnter={(e) => { e.currentTarget.style.color = "#c8f241"; }}
                onMouseLeave={(e) => { e.currentTarget.style.color = "#f0ede6"; }}
              >
                {item}
                <ArrowUpRight size={16} color="#3a3a3a" />
              </a>
            ))}
 
            <div style={{ marginTop: "auto" }}>
              <a
                href="mailto:kayikalvin@gmail.com"
                style={{
                  fontFamily: "'DM Mono', monospace",
                  fontSize: 11,
                  letterSpacing: "0.08em",
                  color: "#6b6b6b",
                  textDecoration: "none",
                  display: "block",
                  paddingTop: 32,
                  opacity: menuOpen ? 1 : 0,
                  transition: "opacity 0.4s ease 0.35s",
                }}
              >
                kayikalvin@gmail.com
              </a>
            </div>
          </div>
        </div>
      )}
 
      {/* KINETIC NAME */}
      <div style={{
        display: "flex",
        alignItems: "flex-end",
        gap: isMobile ? "0.01em" : "0.02em",
        marginBottom: "2vh",
        perspective: 800,
        position: "relative",
        zIndex: 2,
      }}>
        {letters.map((letter, i) => (
          <span
            key={i}
            ref={(el) => (letterRefs.current[i] = el)}
            style={{
              fontFamily: "'DM Serif Display', serif",
              fontSize: isMobile ? "clamp(3.2rem,16vw,5rem)" : "clamp(5rem,14vw,14rem)",
              fontWeight: 400,
              lineHeight: 0.88,
              color: "#f0ede6",
              display: "block",
              willChange: "transform",
              transition: "transform 0.6s cubic-bezier(.23,1,.32,1)",
              opacity: entered ? 1 : 0,
              transform: entered ? "translateY(0)" : "translateY(60px)",
              transitionDelay: `${i * 0.06 + 0.1}s`,
              transitionProperty: "opacity, transform",
            }}
          >
            {letter}
          </span>
        ))}
        <span style={{
          fontFamily: "'DM Serif Display', serif",
          fontStyle: "italic",
          fontSize: isMobile ? "clamp(1.8rem,9vw,3rem)" : "clamp(3rem,8vw,8rem)",
          fontWeight: 400,
          lineHeight: 0.88,
          color: "#c8f241",
          marginLeft: "0.08em",
          alignSelf: "flex-end",
          marginBottom: "0.06em",
          opacity: entered ? 1 : 0,
          transform: entered ? "translateY(0)" : "translateY(40px)",
          transition: "opacity 0.7s ease 0.6s, transform 0.7s cubic-bezier(.23,1,.32,1) 0.6s",
        }}>
          Kayi
        </span>
      </div>
 
      {/* TAGLINE + BUTTONS */}
      <div style={{
        display: "flex",
        flexDirection: isMobile ? "column" : "row",
        justifyContent: "space-between",
        alignItems: isMobile ? "flex-start" : "flex-end",
        gap: isMobile ? 28 : 24,
        flexWrap: "wrap",
        position: "relative",
        zIndex: 2,
      }}>
        <p style={{
          fontFamily: "'DM Sans', sans-serif",
          fontSize: isMobile ? "clamp(0.9rem,4vw,1.05rem)" : "clamp(1rem,1.6vw,1.25rem)",
          color: "#6b6b6b",
          maxWidth: isMobile ? "100%" : 420,
          lineHeight: 1.65,
          margin: 0,
          opacity: entered ? 1 : 0,
          transform: entered ? "translateY(0)" : "translateY(20px)",
          transition: "opacity 0.7s ease 0.8s, transform 0.7s ease 0.8s",
        }}>
          Full-Stack Developer & ML Engineer building
          intelligent applications that merge data,
          design, and human experience.
        </p>
 
        <div style={{
          display: "flex",
          gap: 12,
          flexWrap: "wrap",
          opacity: entered ? 1 : 0,
          transform: entered ? "translateY(0)" : "translateY(20px)",
          transition: "opacity 0.7s ease 1s, transform 0.7s ease 1s",
        }}>
          <MagneticBtn
            href="#projects"
            style={{
              fontFamily: "'DM Sans', sans-serif",
              fontSize: isMobile ? 13 : 14,
              fontWeight: 500,
              padding: isMobile ? "12px 22px" : "14px 28px",
              background: "#c8f241",
              color: "#0a0a0a",
              borderRadius: 40,
              textDecoration: "none",
              letterSpacing: "0.02em",
              border: "none",
              cursor: "pointer",
              alignItems: "center",
              gap: 8,
            }}
          >
            See my work <ArrowUpRight size={15} />
          </MagneticBtn>
 
          <MagneticBtn
            href="mailto:kayikalvin@gmail.com"
            style={{
              fontFamily: "'DM Sans', sans-serif",
              fontSize: isMobile ? 13 : 14,
              padding: isMobile ? "12px 22px" : "14px 28px",
              background: "rgba(15,15,15,0.6)",
              backdropFilter: "blur(12px)",
              color: "#f0ede6",
              borderRadius: 40,
              textDecoration: "none",
              letterSpacing: "0.02em",
              border: "1.5px solid #2a2a2a",
              cursor: "pointer",
              alignItems: "center",
              gap: 8,
              transition: "border-color 0.2s",
            }}
            onMouseEnter={(e) => { e.currentTarget.style.borderColor = "#c8f241"; }}
            onMouseLeave={(e) => { e.currentTarget.style.borderColor = "#2a2a2a"; }}
          >
            Get in touch
          </MagneticBtn>
        </div>
      </div>
 
      {!isMobile && (
        <div style={{
          position: "absolute",
          bottom: "5vh",
          left: "50%",
          transform: "translateX(-50%)",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 8,
          opacity: 0.35,
          animation: "floatDown 2s ease-in-out infinite",
          zIndex: 2,
        }}>
          <span style={{ fontFamily: "'DM Mono', monospace", fontSize: 10, letterSpacing: "0.15em", color: "#6b6b6b" }}>
            SCROLL
          </span>
          <ChevronDown size={14} color="#6b6b6b" />
        </div>
      )}
 
      <style>{`
        @keyframes floatDown {
          0%,100% { transform: translateX(-50%) translateY(0); }
          50%      { transform: translateX(-50%) translateY(6px); }
        }
        @media (max-width: 767px) {
          #home span[style*="willChange"] { transition: none !important; }
        }
      `}</style>
    </section>
  );
}


/* ─────────────────────────────────────────────
   HORIZONTAL MARQUEE
───────────────────────────────────────────── */
function Marquee({ items }) {
  return (
    <div
      style={{
        overflow: "hidden",
        borderTop: "1px solid #1f1f1f",
        borderBottom: "1px solid #1f1f1f",
        padding: "18px 0",
        position: "relative",
        zIndex: 2,
      }}
    >
      <div
        style={{
          display: "flex",
          gap: 48,
          animation: "marquee 22s linear infinite",
          whiteSpace: "nowrap",
        }}
      >
        {[...items, ...items, ...items].map((item, i) => (
          <span
            key={i}
            style={{
              fontFamily: "'DM Serif Display', serif",
              fontStyle: "italic",
              fontSize: "clamp(1.1rem, 2vw, 1.5rem)",
              color: "#6b6b6b",
              flexShrink: 0,
            }}
          >
            {item}
            <span style={{ color: "#c8f241", margin: "0 24px", fontStyle: "normal" }}>·</span>
          </span>
        ))}
      </div>
      <style>{`@keyframes marquee { from{transform:translateX(0)} to{transform:translateX(-33.33%)} }`}</style>
    </div>
  );
}



/* ─────────────────────────────────────────────
   PROJECTS SECTION
───────────────────────────────────────────── */
function ProjectsSection() {
  const ref = useRef(null);
  const [vis, setVis] = useState(false);

  useEffect(() => {
    const obs = new IntersectionObserver(
      ([e]) => e.isIntersecting && setVis(true),
      { threshold: 0.05 }
    );
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);

  return (
    <section
      id="projects"
      ref={ref}
      style={{ padding: "12vh 5vw", position: "relative", zIndex: 2 }}
    >
      <div
        style={{
          marginBottom: 64,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-end",
          flexWrap: "wrap",
          gap: 24,
        }}
      >
        <div>
          <p
            style={{
              fontFamily: "'DM Mono', monospace",
              fontSize: 11,
              letterSpacing: "0.15em",
              color: "#c8f241",
              textTransform: "uppercase",
              marginBottom: 16,
              opacity: vis ? 1 : 0,
              transition: "opacity 0.6s ease",
            }}
          >
            Selected Work
          </p>
          <h2
            style={{
              fontFamily: "'DM Serif Display', serif",
              fontSize: "clamp(2.5rem, 4vw, 4rem)",
              fontWeight: 400,
              lineHeight: 1.1,
              color: "#f0ede6",
              margin: 0,
              opacity: vis ? 1 : 0,
              transform: vis ? "none" : "translateY(20px)",
              transition: "opacity 0.7s ease 0.1s, transform 0.7s ease 0.1s",
            }}
          >
            Products I've
            <br />
            <span style={{ fontStyle: "italic", color: "#c8f241" }}>shipped</span>
          </h2>
        </div>
      </div>
      <Projects />
    </section>
  );
}

/* ─────────────────────────────────────────────
   BLOG SECTION
───────────────────────────────────────────── */
function Blog() {
  const ref = useRef(null);
  const [vis, setVis] = useState(false);

  useEffect(() => {
    const obs = new IntersectionObserver(
      ([e]) => e.isIntersecting && setVis(true),
      { threshold: 0.1 }
    );
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);

  return (
    <section
      id="blog"
      ref={ref}
      style={{ padding: "12vh 5vw", position: "relative", zIndex: 2 }}
    >
      <p
        style={{
          fontFamily: "'DM Mono', monospace",
          fontSize: 11,
          letterSpacing: "0.15em",
          color: "#c8f241",
          textTransform: "uppercase",
          marginBottom: 16,
          opacity: vis ? 1 : 0,
          transition: "opacity 0.6s ease",
        }}
      >
        Writing
      </p>
      <h2
        style={{
          fontFamily: "'DM Serif Display', serif",
          fontSize: "clamp(2.5rem, 4vw, 4rem)",
          fontWeight: 400,
          lineHeight: 1.1,
          color: "#f0ede6",
          marginBottom: 56,
          opacity: vis ? 1 : 0,
          transform: vis ? "none" : "translateY(20px)",
          transition: "opacity 0.7s ease 0.1s, transform 0.7s ease 0.1s",
        }}
      >
        Insights &{" "}
        <span style={{ fontStyle: "italic", color: "#c8f241" }}>
          Articles
        </span>
      </h2>

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "1px",
          border: "1px solid #1a1a1a",
          borderRadius: 16,
          overflow: "hidden",
        }}
      >
        {posts.map((post, i) => (
          <a
            key={i}
            href={post.link}
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              padding: "28px 32px",
              background: "#0d0d0d",
              textDecoration: "none",
              borderBottom: i < posts.length - 1 ? "1px solid #1a1a1a" : "none",
              transition: "background 0.2s",
              opacity: vis ? 1 : 0,
              transform: vis ? "none" : "translateX(-20px)",
              transitionProperty: "background, opacity, transform",
              transitionDuration: "0.2s, 0.6s, 0.6s",
              transitionDelay: `0s, ${i * 0.1 + 0.2}s, ${i * 0.1 + 0.2}s`,
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = "#111";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "#0d0d0d";
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 24 }}>
              <span
                style={{
                  fontFamily: "'DM Mono', monospace",
                  fontSize: 11,
                  color: "#3a3a3a",
                  minWidth: 24,
                }}
              >
                0{i + 1}
              </span>
              <span
                style={{
                  fontFamily: "'DM Sans', sans-serif",
                  fontSize: "clamp(1rem, 1.4vw, 1.15rem)",
                  color: "#d0d0d0",
                  fontWeight: 400,
                }}
              >
                {post.title}
              </span>
            </div>
            <ArrowUpRight size={18} color="#3a3a3a" />
          </a>
        ))}
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────────
   CONTACT SECTION
───────────────────────────────────────────── */
function Contact() {
  const ref = useRef(null);
  const [vis, setVis] = useState(false);

  useEffect(() => {
    const obs = new IntersectionObserver(
      ([e]) => e.isIntersecting && setVis(true),
      { threshold: 0.1 }
    );
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);

  return (
    <section
      id="contact"
      ref={ref}
      style={{
        padding: "16vh 5vw",
        borderTop: "1px solid #1a1a1a",
        position: "relative",
        zIndex: 2,
      }}
    >
      <p
        style={{
          fontFamily: "'DM Mono', monospace",
          fontSize: 11,
          letterSpacing: "0.15em",
          color: "#c8f241",
          textTransform: "uppercase",
          marginBottom: 24,
          opacity: vis ? 1 : 0,
          transition: "opacity 0.6s ease",
        }}
      >
        Let's talk
      </p>

      <h2
        style={{
          fontFamily: "'DM Serif Display', serif",
          fontSize: "clamp(3rem, 7vw, 8rem)",
          fontWeight: 400,
          lineHeight: 1.0,
          color: "#f0ede6",
          maxWidth: "16ch",
          marginBottom: 56,
          opacity: vis ? 1 : 0,
          transform: vis ? "none" : "translateY(40px)",
          transition: "opacity 0.8s ease 0.1s, transform 0.8s ease 0.1s",
        }}
      >
        Have a project
        <br />
        <span style={{ fontStyle: "italic", color: "#c8f241" }}>
          in mind?
        </span>
      </h2>

      <div
        style={{
          display: "flex",
          gap: 16,
          flexWrap: "wrap",
          opacity: vis ? 1 : 0,
          transform: vis ? "none" : "translateY(20px)",
          transition: "opacity 0.7s ease 0.3s, transform 0.7s ease 0.3s",
        }}
      >
        <MagneticBtn
          href="mailto:kayikalvin@gmail.com"
          style={{
            fontFamily: "'DM Sans', sans-serif",
            fontSize: 14,
            fontWeight: 500,
            padding: "16px 32px",
            background: "#c8f241",
            color: "#0a0a0a",
            borderRadius: 40,
            textDecoration: "none",
            display: "inline-flex",
            alignItems: "center",
            gap: 8,
            border: "none",
            cursor: "pointer",
          }}
        >
          <Mail size={16} />
          kayikalvin@gmail.com
        </MagneticBtn>

        <MagneticBtn
          href="/Alvin Kayi CV.pdf"
          target="_blank"
          style={{
            fontFamily: "'DM Sans', sans-serif",
            fontSize: 14,
            padding: "16px 32px",
            background: "transparent",
            color: "#f0ede6",
            borderRadius: 40,
            textDecoration: "none",
            display: "inline-flex",
            alignItems: "center",
            gap: 8,
            border: "1.5px solid #2a2a2a",
            cursor: "pointer",
            transition: "border-color 0.2s",
          }}
          onMouseEnter={(e) => { e.currentTarget.style.borderColor = "#c8f241"; }}
          onMouseLeave={(e) => { e.currentTarget.style.borderColor = "#2a2a2a"; }}
        >
          Download CV <ExternalLink size={14} />
        </MagneticBtn>
      </div>

      <p
        style={{
          fontFamily: "'DM Mono', monospace",
          fontSize: 12,
          color: "#3a3a3a",
          marginTop: 40,
          opacity: vis ? 1 : 0,
          transition: "opacity 0.7s ease 0.5s",
        }}
      >
        Typically respond within 24 hours · Nairobi, Kenya
      </p>
    </section>
  );
}

/* ─────────────────────────────────────────────
   FOOTER
───────────────────────────────────────────── */
/* ─────────────────────────────────────────────
   FOOTER — Awwwards-tier redesign
───────────────────────────────────────────── */



function Footer() {
  return (
    <footer style={{ background: "#0a0a0a", position: "relative", zIndex: 2 }}>
      {/* PREMIUM SPLIT LAYOUT */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "80px",
          padding: "120px 5vw 80px",
          borderTop: "1px solid #1a1a1a",
          position: "relative",
        }}
        onMouseMove={(e) => {
          const el = e.currentTarget;
          const rect = el.getBoundingClientRect();
          const x = ((e.clientX - rect.left) / rect.width) * 100;
          const y = ((e.clientY - rect.top) / rect.height) * 100;
          el.style.background = `radial-gradient(600px at ${x}% ${y}%, rgba(200,242,65,0.03) 0%, transparent 80%)`;
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.background = "transparent";
        }}
      >
        {/* LEFT: BRAND + STATEMENT */}
        <div style={{ display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
          <div>
            <h2
              style={{
                fontFamily: "'DM Serif Display', serif",
                fontSize: "clamp(2.5rem, 6vw, 5rem)",
                fontWeight: 400,
                lineHeight: 1.1,
                color: "#f0ede6",
                margin: "0 0 32px",
              }}
            >
              Let's create
              <br />
              <em style={{ fontStyle: "italic", color: "#c8f241" }}>something remarkable</em>
            </h2>

            <p
              style={{
                fontFamily: "'DM Sans', sans-serif",
                fontSize: 15,
                lineHeight: 1.8,
                color: "#6b6b6b",
                maxWidth: "420px",
                margin: "0 0 48px",
              }}
            >
              I build digital experiences with precision and intention. Let's talk about your next project.
            </p>

            <MagneticBtn
              href="mailto:kayikalvin@gmail.com"
              style={{
                fontFamily: "'DM Sans', sans-serif",
                fontSize: 14,
                fontWeight: 500,
                padding: "16px 36px",
                background: "#c8f241",
                color: "#0a0a0a",
                borderRadius: 40,
                textDecoration: "none",
                display: "inline-flex",
                alignItems: "center",
                gap: 10,
                border: "none",
                cursor: "pointer",
              }}
            >
              Start a project <ArrowUpRight size={15} />
            </MagneticBtn>
          </div>

          {/* Bottom: Availability + Socials */}
          <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <div
                style={{
                  width: 8,
                  height: 8,
                  borderRadius: "50%",
                  background: "#c8f241",
                  animation: "footerPulse 2.5s ease-in-out infinite",
                }}
              />
              <span
                style={{
                  fontFamily: "'DM Mono', monospace",
                  fontSize: 12,
                  letterSpacing: "0.12em",
                  color: "#3a3a3a",
                  textTransform: "uppercase",
                }}
              >
                Open for work
              </span>
            </div>

            <div style={{ display: "flex", gap: 16 }}>
              {[
                { href: "https://github.com/kayikalvin", label: "GitHub" },
                { href: "https://linkedin.com/in/kayikalvin", label: "LinkedIn" },
                { href: "mailto:kayikalvin@gmail.com", label: "Email" },
              ].map(({ href, label }) => (
                <a
                  key={label}
                  href={href}
                  target={href.startsWith("http") ? "_blank" : undefined}
                  rel={href.startsWith("http") ? "noopener noreferrer" : undefined}
                  style={{
                    fontFamily: "'DM Sans', sans-serif",
                    fontSize: 13,
                    color: "#3a3a3a",
                    textDecoration: "none",
                    padding: "8px 0",
                    borderBottom: "1px solid transparent",
                    transition: "all 0.2s ease",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.color = "#c8f241";
                    e.currentTarget.style.borderBottomColor = "#c8f241";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.color = "#3a3a3a";
                    e.currentTarget.style.borderBottomColor = "transparent";
                  }}
                >
                  {label}
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* RIGHT: GRID OF LINKS + METADATA */}
        <div style={{ display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
          {/* Link Grid */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "60px 40px" }}>
            {/* Navigation */}
            <div>
              <p
                style={{
                  fontFamily: "'DM Mono', monospace",
                  fontSize: 10,
                  letterSpacing: "0.15em",
                  color: "#c8f241",
                  textTransform: "uppercase",
                  margin: "0 0 24px",
                }}
              >
                Navigate
              </p>
              <ul style={{ listStyle: "none", margin: 0, padding: 0, display: "flex", flexDirection: "column", gap: 14 }}>
                {[
                  { label: "Work", href: "#projects" },
                  { label: "About", href: "#about" },
                  { label: "Skills", href: "#skills" },
                  { label: "Writing", href: "#blog" },
                  { label: "Contact", href: "#contact" },
                ].map(({ label, href }) => (
                  <li key={label}>
                    <a
                      href={href}
                      style={{
                        fontFamily: "'DM Sans', sans-serif",
                        fontSize: 14,
                        color: "#6b6b6b",
                        textDecoration: "none",
                        transition: "color 0.2s ease",
                      }}
                      onMouseEnter={(e) => (e.currentTarget.style.color = "#f0ede6")}
                      onMouseLeave={(e) => (e.currentTarget.style.color = "#6b6b6b")}
                    >
                      {label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Resources */}
            <div>
              <p
                style={{
                  fontFamily: "'DM Mono', monospace",
                  fontSize: 10,
                  letterSpacing: "0.15em",
                  color: "#c8f241",
                  textTransform: "uppercase",
                  margin: "0 0 24px",
                }}
              >
                Resources
              </p>
              <ul style={{ listStyle: "none", margin: 0, padding: 0, display: "flex", flexDirection: "column", gap: 14 }}>
                {[
                  { label: "Download CV", href: "/Alvin Kayi CV.pdf", external: true },
                  { label: "GitHub", href: "https://github.com/kayikalvin", external: true },
                  { label: "LinkedIn", href: "https://linkedin.com/in/kayikalvin", external: true },
                  { label: "Get in touch", href: "mailto:kayikalvin@gmail.com" },
                ].map(({ label, href, external }) => (
                  <li key={label}>
                    <a
                      href={href}
                      target={external ? "_blank" : undefined}
                      rel={external ? "noopener noreferrer" : undefined}
                      style={{
                        fontFamily: "'DM Sans', sans-serif",
                        fontSize: 14,
                        color: "#6b6b6b",
                        textDecoration: "none",
                        transition: "color 0.2s ease",
                      }}
                      onMouseEnter={(e) => (e.currentTarget.style.color = "#f0ede6")}
                      onMouseLeave={(e) => (e.currentTarget.style.color = "#6b6b6b")}
                    >
                      {label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Footer Meta */}
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <div style={{ height: 1, background: "#1a1a1a" }} />
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
              <p
                style={{
                  fontFamily: "'DM Mono', monospace",
                  fontSize: 11,
                  color: "#3a3a3a",
                  letterSpacing: "0.08em",
                  margin: 0,
                }}
              >
                © {new Date().getFullYear()} Kalvin Kayi
              </p>
              <p
                style={{
                  fontFamily: "'DM Mono', monospace",
                  fontSize: 11,
                  color: "#3a3a3a",
                  letterSpacing: "0.08em",
                  margin: 0,
                }}
              >
                Nairobi, Kenya
              </p>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes footerPulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.4; }
        }
      `}</style>
    </footer>
  );
}
/* ─────────────────────────────────────────────
   FLOATING NAV DOTS
───────────────────────────────────────────── */
function FloatingNav() {
  const [active, setActive] = useState("home");
  const sections = useMemo(
    () => ["home", "about", "skills", "projects", "blog", "contact"],
    []
  );

  useEffect(() => {
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) setActive(e.target.id);
        });
      },
      { threshold: 0.15 }  // ← was 0.4, About is too tall to ever hit 40%
    );
    sections.forEach((id) => {
      const el = document.getElementById(id);
      if (el) obs.observe(el);
    });
    return () => obs.disconnect();
  }, [sections]);

  

  return (
    <div
      style={{
        position: "fixed",
        right: 28,
        top: "50%",
        transform: "translateY(-50%)",
        display: "flex",
        flexDirection: "column",
        gap: 12,
        zIndex: 100,
      }}
    >
      {sections.map((id) => (
        <a
          key={id}
          href={`#${id}`}
          title={id.charAt(0).toUpperCase() + id.slice(1)}
          style={{
            width: active === id ? 24 : 6,
            height: 6,
            borderRadius: 4,
            background: active === id ? "#c8f241" : "#2a2a2a",
            display: "block",
            transition: "width 0.3s ease, background 0.3s ease",
          }}
        />
      ))}
    </div>
  );
}

/* ─────────────────────────────────────────────
   ROOT PAGE
───────────────────────────────────────────── */
export default function Home() {
  useFonts();

  return (
    <div
      style={{
        background: "#0a0a0a",
        color: "#f0ede6",
        minHeight: "100vh",
        cursor: "none",
      }}
    >
      <CustomCursor />
      <NoiseOverlay />
      <FloatingNav />
      <PaypalDonate />

      <KineticHero />

      <Marquee
        items={[
          "Full-Stack Development",
          "Machine Learning",
          "Data Engineering",
          "React & Next.js",
          "Python",
          "Cloud Architecture",
          "NLP & LLMs",
          "UI / UX",
        ]}
      />

      <About />
      <Skills />
      <ProjectsSection />
      <Blog />
      <Contact />
      <Footer />

      {/* Global styles */}
      <style>{`
        * { box-sizing: border-box; margin: 0; padding: 0; }
        html { scroll-behavior: smooth; }
        body { cursor: none !important; background: #0a0a0a; }
        a, button { cursor: none !important; }
        ::selection { background: #c8f241; color: #0a0a0a; }
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-track { background: #0a0a0a; }
        ::-webkit-scrollbar-thumb { background: #1f1f1f; border-radius: 4px; }

        @media (max-width: 640px) {
          #floatingnav { display: none; }
        }

        @media (prefers-reduced-motion: reduce) {
          * { animation-duration: 0.01ms !important; transition-duration: 0.01ms !important; }
        }
      `}</style>
    </div>
  );
}

























// import {
//   Code,
//   Brain,
//   BarChart3,
//   Sparkles,
//   ExternalLink,
//   Mail,
//   FileText,
// } from "lucide-react";
// import { useState, useEffect, useRef } from "react";
// import Projects from "../components/Projects";
// import { skills } from "../utils/utils";
// import { posts } from "../utils/utils";
// import Floatingnavbar from "../components/Floatingnavbar";
// import PaypalDonate from "../components/PaypalDonate";
// import EnhancedSkillsSection from "../components/EnhancedSkillsSection";

// const Home = () => {
//   const heroRef = useRef(null);
//   const skillsRef = useRef(null);
//   const projectsRef = useRef(null);
//   const revealRef = useRef(null);
//   const logoRef = useRef(null);
//   const progressRef = useRef(null);
//   const mainContentRef = useRef(null);
//   const particlesRef = useRef([]);

//   const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
//   const [showReveal, setShowReveal] = useState(true);
//   const [gsapLoaded, setGsapLoaded] = useState(false);
//   const [isVisible, setIsVisible] = useState(false);
//   const [activeSection, setActiveSection] = useState("home");

//   // Track active section for navigation
//   useEffect(() => {
//     const handleScroll = () => {
//       const sections = [
//         "home",
//         "about",
//         "skills",
//         "projects",
//         "blog",
//         "contact",
//       ];
//       const current = sections.find((section) => {
//         const element = document.getElementById(section);
//         if (element) {
//           const rect = element.getBoundingClientRect();
//           return rect.top <= 100 && rect.bottom >= 100;
//         }
//         return false;
//       });
//       if (current) setActiveSection(current);
//     };

//     window.addEventListener("scroll", handleScroll);
//     return () => window.removeEventListener("scroll", handleScroll);
//   }, []);

//   useEffect(() => {
//     const observer = new IntersectionObserver(
//       ([entry]) => {
//         if (entry.isIntersecting) {
//           setIsVisible(true);
//         }
//       },
//       {
//         threshold: 0.3,
//       }
//     );

//     if (skillsRef.current) {
//       observer.observe(skillsRef.current);
//     }

//     return () => {
//       if (skillsRef.current) {
//         observer.unobserve(skillsRef.current);
//       }
//     };
//   }, []);

//   // Initialize GSAP
//   useEffect(() => {
//     const loadGSAP = async () => {
//       if (window.gsap) {
//         setGsapLoaded(true);
//         return;
//       }

//       const script = document.createElement("script");
//       script.src =
//         "https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/gsap.min.js";
//       script.onload = () => {
//         const scrollScript = document.createElement("script");
//         scrollScript.src =
//           "https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/ScrollTrigger.min.js";
//         scrollScript.onload = () => {
//           window.gsap.registerPlugin(window.ScrollTrigger);
//           setGsapLoaded(true);
//         };
//         document.head.appendChild(scrollScript);
//       };
//       document.head.appendChild(script);
//     };

//     loadGSAP();
//   }, []);

//   // GSAP Animations
//   useEffect(() => {
//     if (!gsapLoaded || !window.gsap) return;

//     const gsap = window.gsap;
//     const ScrollTrigger = window.ScrollTrigger;

//     // Page Reveal Animation Timeline
//     const revealTL = gsap.timeline();

//     // Animate particles
//     particlesRef.current.forEach((particle, i) => {
//       if (particle) {
//         gsap.set(particle, {
//           x: Math.random() * window.innerWidth,
//           y: Math.random() * window.innerHeight,
//           scale: Math.random() * 0.5 + 0.5,
//           opacity: 0,
//         });

//         gsap.to(particle, {
//           opacity: 0.6,
//           duration: 1,
//           delay: i * 0.05,
//           ease: "power2.out",
//         });

//         gsap.to(particle, {
//           y: "-=100",
//           x: "+=50",
//           rotation: 360,
//           duration: 3 + Math.random() * 2,
//           repeat: -1,
//           yoyo: true,
//           ease: "sine.inOut",
//         });
//       }
//     });

//     // Logo animation
//     revealTL
//       .from(logoRef.current, {
//         scale: 0,
//         rotation: -180,
//         opacity: 0,
//         duration: 1.2,
//         ease: "back.out(1.7)",
//       })
//       .from(
//         ".reveal-text",
//         {
//           y: 40,
//           opacity: 0,
//           duration: 0.8,
//           stagger: 0.15,
//           ease: "power3.out",
//         },
//         "-=0.4"
//       )
//       .from(
//         ".geometric-shape",
//         {
//           scale: 0,
//           rotation: 180,
//           opacity: 0,
//           duration: 1,
//           stagger: 0.2,
//           ease: "elastic.out(1, 0.5)",
//         },
//         "-=0.3"
//       );

//     // Progress bar animation
//     gsap.to(progressRef.current, {
//       width: "100%",
//       duration: 2.2,
//       ease: "power2.inOut",
//       onComplete: () => {
//         gsap.to(revealRef.current, {
//           y: "-100%",
//           duration: 0.8,
//           ease: "power4.inOut",
//           onComplete: () => {
//             setShowReveal(false);
//             setTimeout(() => {
//               initMainAnimations();
//             }, 10);
//           },
//         });
//       },
//     });

//     // Shimmer effect on progress bar
//     gsap.to(".progress-shimmer", {
//       x: "200%",
//       duration: 1.5,
//       repeat: -1,
//       ease: "none",
//     });

//     const initMainAnimations = () => {
//       // Hero section entrance
//       const heroTL = gsap.timeline();

//       heroTL
//         .from(".hero-title", {
//           y: -80,
//           opacity: 0,
//           duration: 1,
//           ease: "power4.out",
//         })
//         .from(
//           ".hero-subtitle",
//           {
//             opacity: 0,
//             duration: 1,
//             stagger: 0.1,
//             ease: "power3.out",
//           },
//           "-=0.6"
//         )
//         .fromTo(
//           ".hero-badge",
//           { scale: 0, opacity: 0 },
//           {
//             scale: 1,
//             opacity: 1,
//             duration: 0.6,
//             stagger: 0.08,
//             ease: "back.out(1.7)",
//           },
//           "-=0.4"
//         )
//         .fromTo(
//           ".social-icon",
//           { y: 20, opacity: 0 },
//           {
//             y: 0,
//             opacity: 1,
//             duration: 0.5,
//             stagger: 0.08,
//             ease: "power2.out",
//           },
//           "-=0.3"
//         );

//       // Scroll-triggered animations
//       ScrollTrigger.batch(".skill-card", {
//         onEnter: (elements) => {
//           gsap.from(elements, {
//             y: 60,
//             opacity: 0,
//             duration: 0.8,
//             stagger: 0.1,
//             ease: "power3.out",
//           });

//           elements.forEach((element, i) => {
//             const skillBar = element.querySelector(".skill-bar");
//             const level = skills[i % skills.length]?.level || 0;
//             gsap.to(skillBar, {
//               width: `${level}%`,
//               duration: 1.2,
//               delay: 0.3,
//               ease: "power2.out",
//             });
//           });
//         },
//         start: "top bottom-=80",
//       });

//       ScrollTrigger.batch(".project-card", {
//         onEnter: (elements) => {
//           gsap.from(elements, {
//             y: 60,
//             opacity: 0,
//             duration: 0.9,
//             stagger: 0.15,
//             ease: "power3.out",
//           });
//         },
//         start: "top bottom-=80",
//       });

//       // Continuous animations
//       gsap.to(".floating-shape-1", {
//         y: -20,
//         rotation: 5,
//         duration: 4,
//         repeat: -1,
//         yoyo: true,
//         ease: "sine.inOut",
//       });

//       gsap.to(".floating-shape-2", {
//         x: 20,
//         rotation: -5,
//         duration: 5,
//         repeat: -1,
//         yoyo: true,
//         ease: "sine.inOut",
//       });

//       gsap.to(".floating-shape-3", {
//         y: 15,
//         x: -15,
//         rotation: 8,
//         duration: 6,
//         repeat: -1,
//         yoyo: true,
//         ease: "sine.inOut",
//       });

//       // Mouse follower effect
//       const updateMousePosition = (e) => {
//         setMousePosition({ x: e.clientX, y: e.clientY });
//         gsap.to(".mouse-follower", {
//           x: e.clientX,
//           y: e.clientY,
//           duration: 0.2,
//           ease: "power2.out",
//         });
//       };

//       window.addEventListener("mousemove", updateMousePosition);

//       // Hover animations
//       document.querySelectorAll(".hover-card").forEach((element) => {
//         element.addEventListener("mouseenter", () => {
//           gsap.to(element, {
//             scale: 1.03,
//             y: -5,
//             duration: 0.3,
//             ease: "power2.out",
//           });
//         });

//         element.addEventListener("mouseleave", () => {
//           gsap.to(element, {
//             scale: 1,
//             y: 0,
//             duration: 0.3,
//             ease: "power2.out",
//           });
//         });
//       });

//       // Parallax scrolling
//       gsap.to(".parallax-bg", {
//         yPercent: -30,
//         ease: "none",
//         scrollTrigger: {
//           trigger: ".parallax-bg",
//           start: "top bottom",
//           end: "bottom top",
//           scrub: 1,
//         },
//       });
//     };

//     return () => {
//       ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
//     };
//   }, [gsapLoaded]);

//   return (
//     <div className="min-h-screen bg-black text-white overflow-hidden">
//       {/* Mouse Follower */}
//       <div className="mouse-follower fixed w-8 h-8 bg-gradient-to-r from-cyan-500 via-purple-500 to-pink-500 rounded-full opacity-15 pointer-events-none z-50 mix-blend-screen blur-sm" />

//       {/* Page Reveal Overlay */}
//       {showReveal && (
//         <div
//           ref={revealRef}
//           className="fixed inset-0 z-50 bg-black flex items-center justify-center overflow-hidden"
//         >
//           <div className="absolute inset-0 parallax-bg">
//             <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-black to-gray-900" />

//             {[...Array(20)].map((_, i) => (
//               <div
//                 key={i}
//                 ref={(el) => (particlesRef.current[i] = el)}
//                 className="absolute w-1.5 h-1.5 bg-gradient-to-r from-cyan-400 to-purple-400 rounded-full"
//               />
//             ))}
//           </div>

//           <div className="absolute inset-0 pointer-events-none overflow-hidden">
//             <div className="geometric-shape floating-shape-1 absolute top-1/4 left-1/4 w-32 h-32 border border-cyan-400/30 opacity-20 rounded-lg" />
//             <div className="geometric-shape floating-shape-2 absolute bottom-1/4 right-1/4 w-24 h-24 border-2 border-purple-400/40 opacity-30 rounded-full" />
//             <div className="geometric-shape floating-shape-3 absolute top-1/2 right-1/3 w-20 h-20 bg-gradient-to-r from-pink-500/20 to-purple-500/20 opacity-20 rounded-full" />
//           </div>

//           <div className="relative z-10 text-center max-w-4xl mx-auto px-6">
//             <div className="mb-12">
//               <div className="relative inline-block">
//                 <div className="absolute inset-0 blur-3xl bg-gradient-to-r from-cyan-500 via-purple-500 to-pink-500 opacity-40" />
//                 <h1
//                   ref={logoRef}
//                   className="relative text-6xl md:text-8xl font-bold bg-gradient-to-r from-white via-cyan-100 to-purple-100 bg-clip-text text-transparent"
//                 >
//                   Kalvin Kayi.
//                 </h1>
//               </div>
//             </div>

//             <div className="mb-12 space-y-6">
//               <div className="overflow-hidden">
//                 <p className="reveal-text text-2xl md:text-3xl font-light text-cyan-300">
//                   Welcome to my portfolio
//                 </p>
//               </div>
//               <div className="overflow-hidden">
//                 <p className="reveal-text text-lg text-gray-400">
//                   Data Science • Web Development • Machine Learning
//                 </p>
//               </div>
//             </div>

//             <div className="relative w-72 h-1.5 mx-auto bg-gray-800/50 rounded-full overflow-hidden">
//               <div
//                 ref={progressRef}
//                 className="absolute left-0 top-0 h-full bg-gradient-to-r from-cyan-500 via-purple-500 to-pink-500 w-0"
//               />
//               <div className="progress-shimmer absolute inset-0 bg-gradient-to-r from-transparent via-white/50 to-transparent opacity-20 w-full -translate-x-full" />
//             </div>

//             <p className="reveal-text mt-8 text-sm text-gray-500">
//               Crafting digital experiences with precision...
//             </p>
//           </div>
//         </div>
//       )}

//       {/* Main Site Content */}
//       <div ref={mainContentRef} className={showReveal ? "hidden" : "block"}>
//         <PaypalDonate />

//         {/* Animated Background */}
//         <div className="fixed inset-0 z-0">
//           <div
//             className="absolute inset-0 opacity-20 transition-all duration-500"
//             style={{
//               background: `radial-gradient(600px at ${mousePosition.x}px ${mousePosition.y}px, rgba(34, 211, 238, 0.15) 0%, transparent 80%)`,
//             }}
//           />
//           <div className="absolute inset-0 bg-gradient-to-br from-black via-gray-900/50 to-black">
//             <div className="absolute inset-0 opacity-[0.15]">
//               <div
//                 className="absolute inset-0"
//                 style={{
//                   backgroundImage: `radial-gradient(circle at 20% 20%, rgba(34, 211, 238, 0.1) 0%, transparent 50%),
//                                  radial-gradient(circle at 80% 80%, rgba(168, 85, 247, 0.1) 0%, transparent 50%),
//                                  radial-gradient(circle at 40% 40%, rgba(236, 72, 153, 0.1) 0%, transparent 50%)`,
//                 }}
//               />
//             </div>
//           </div>
//         </div>

//         {/* Hero Section */}
//         <section id="home" className="relative h-[80vh]">
//           <Floatingnavbar activeSection={activeSection} />
//           <div
//             ref={heroRef}
//             className="relative h-full flex flex-col items-center justify-center pt-24 md:pt-32 px-4 md:px-0"
//           >
//             <div className="absolute -top-40 -left-40 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl" />
//             <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl" />

//             <div className="relative z-10 text-center max-w-4xl mx-auto">
//               <div className="inline-flex items-center gap-2 mb-6 px-4 py-2 rounded-full bg-white/5 border border-white/10">
//                 <Sparkles size={16} className="text-cyan-400" />
//                 <span className="text-sm text-gray-300">
//                   Full-Stack Developer & ML Engineer
//                 </span>
//               </div>

//               <h1 className="hero-title text-5xl md:text-7xl lg:text-8xl font-bold mb-6 tracking-tight">
//                 Hey, I'm{" "}
//                 <span className="bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
//                   Kalvin
//                 </span>{" "}
                
//               </h1>

//               <p className="hero-subtitle text-xl md:text-2xl text-gray-300 max-w-2xl mx-auto mb-8 leading-relaxed">
//                 I build intelligent web applications that bridge{" "}
//                 <span className="text-cyan-300">data</span>,{" "}
//                 <span className="text-purple-300">design</span>, and{" "}
//                 <span className="text-pink-300">human experience</span>.
//               </p>

//               <div className="h-1 w-32 bg-gradient-to-r from-cyan-400 via-purple-500 to-pink-500 rounded-full mx-auto mb-12 animate-pulse" />

//               <div className="flex flex-wrap justify-center gap-3 mb-12">
//                 {[
//                   {
//                     icon: Code,
//                     label: "Full-Stack Dev",
//                     color: "from-cyan-500 to-blue-500",
//                   },
//                   {
//                     icon: Brain,
//                     label: "ML Engineer",
//                     color: "from-purple-500 to-pink-500",
//                   },
//                   {
//                     icon: BarChart3,
//                     label: "Data Analyst",
//                     color: "from-pink-500 to-rose-500",
//                   },
//                 ].map((item, index) => {
//                   const Icon = item.icon;
//                   return (
//                     <div
//                       key={index}
//                       className={`hero-badge group flex items-center gap-3 px-6 py-3 rounded-xl bg-gradient-to-r ${item.color} bg-opacity-10 border border-white/10 backdrop-blur-sm hover:bg-opacity-20 transition-all duration-300 hover-card`}
//                     >
//                       <Icon
//                         size={20}
//                         className="text-gray-300 group-hover:scale-110 transition-transform"
//                       />
//                       <span className="text-sm font-medium text-white">
//                         {item.label}
//                       </span>
//                     </div>
//                   );
//                 })}
//               </div>

//               <div className="flex gap-4 justify-center">
//                 <a
//                   href="#projects"
//                   className="px-8 py-3.5 rounded-full bg-gradient-to-r from-cyan-500 to-purple-500 text-white font-semibold hover:scale-105 hover:shadow-lg hover:shadow-cyan-500/25 transition-all duration-300 flex items-center gap-2"
//                 >
//                   See My Work
//                   <ExternalLink size={18} />
//                 </a>
//                 <a
//                   href="#contact"
//                   className="px-8 py-3.5 rounded-full border-2 border-white/20 bg-white/5 backdrop-blur-sm font-semibold hover:bg-white/10 hover:border-white/30 transition-all duration-300"
//                 >
//                   Let's Connect
//                 </a>
//               </div>

//               {/* Social Links */}
//               <div className="flex justify-center gap-6 mt-6">
//                 <a
//                   href="https://github.com/kayikalvin"
//                   target="_blank"
//                   rel="noopener noreferrer"
//                   className="text-gray-400 hover:text-white transition-transform duration-300 transform hover:scale-110"
//                 >
//                   <svg
//                     xmlns="http://www.w3.org/2000/svg"
//                     viewBox="0 0 24 24"
//                     fill="currentColor"
//                     className="w-8 h-8"
//                   >
//                     <path
//                       fillRule="evenodd"
//                       d="M12 2C6.477 2 2 6.477 2 12c0 4.418 2.865 8.166 6.839 9.49.5.092.682-.217.682-.483 0-.237-.009-.868-.014-1.703-2.782.603-3.369-1.342-3.369-1.342-.454-1.154-1.11-1.461-1.11-1.461-.908-.62.069-.607.069-.607 1.004.07 1.532 1.032 1.532 1.032.892 1.528 2.341 1.087 2.91.832.092-.647.35-1.087.636-1.338-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.983 1.03-2.682-.103-.253-.447-1.27.098-2.645 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0 1 12 6.8c.85.004 1.705.115 2.504.337 1.91-1.296 2.75-1.026 2.75-1.026.545 1.375.2 2.392.098 2.645.64.7 1.03 1.591 1.03 2.682 0 3.841-2.337 4.687-4.565 4.937.36.31.678.923.678 1.86 0 1.344-.012 2.428-.012 2.756 0 .268.18.579.688.48C19.138 20.162 22 16.418 22 12c0-5.523-4.477-10-10-10z"
//                       clipRule="evenodd"
//                     />
//                   </svg>
//                 </a>
//                 <a
//                   href="https://www.facebook.com/kayikalvin"
//                   target="_blank"
//                   rel="noopener noreferrer"
//                   className="text-gray-400 hover:text-white transition-transform duration-300 transform hover:scale-110"
//                 >
//                   <svg
//                     xmlns="http://www.w3.org/2000/svg"
//                     viewBox="0 0 24 24"
//                     fill="currentColor"
//                     className="w-8 h-8"
//                   >
//                     <path d="M22.675 0H1.325C.593 0 0 .593 0 1.325v21.351C0 23.407.593 24 1.325 24h11.495v-9.294H9.691v-3.622h3.129V8.413c0-3.1 1.894-4.788 4.659-4.788 1.325 0 2.464.099 2.795.143v3.24l-1.918.001c-1.504 0-1.796.715-1.796 1.763v2.31h3.587l-.467 3.622h-3.12V24h6.116c.73 0 1.324-.593 1.324-1.324V1.325C24 .593 23.407 0 22.675 0z" />
//                   </svg>
//                 </a>
//                 <a
//                   href="https://linkedin.com/in/kayikalvin"
//                   target="_blank"
//                   rel="noopener noreferrer"
//                   className="text-gray-400 hover:text-white transition-transform duration-300 transform hover:scale-110"
//                 >
//                   <svg
//                     xmlns="http://www.w3.org/2000/svg"
//                     viewBox="0 0 24 24"
//                     fill="currentColor"
//                     className="w-8 h-8"
//                   >
//                     <path d="M20.447 20.452H16.89v-5.396c0-1.287-.025-2.945-1.797-2.945-1.798 0-2.073 1.403-2.073 2.854v5.487H9.366V9h3.396v1.561h.048c.472-.896 1.625-1.797 3.348-1.797 3.579 0 4.238 2.358 4.238 5.428v6.26zM5.337 7.433a1.957 1.957 0 1 1 0-3.914 1.957 1.957 0 0 1 0 3.914zM6.893 20.452H3.78V9h3.113v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.226.792 24 1.771 24h20.451c.979 0 1.774-.774 1.774-1.729V1.729C24 .774 23.204 0 22.225 0z" />
//                 </svg>
//                 </a>
//               </div>
//             </div>

//             {/* Stats Section */}
//             {/* <div className="relative mt-32 w-full max-w-6xl px-6">
//               <div className="grid grid-cols-2 md:grid-cols-5 gap-6">
//                 {[
//                   { number: "45+", label: "Repositories" },
//                   { number: "15+", label: "Projects Completed" },
//                   { number: "100K+", label: "Lines of Code" },
//                   { number: "50+", label: "Data Pipelines" },
//                   { number: "∞", label: "Cups of Coffee" },
//                 ].map((stat, index) => (
//                   <div
//                     key={index}
//                     className="hover-card bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-sm hover:bg-white/10 transition-all duration-300"
//                   >
//                     <div className="text-3xl mb-2">{stat.icon}</div>
//                     <h3 className="text-2xl md:text-3xl font-bold mb-1 bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
//                       {stat.number}
//                     </h3>
//                     <p className="text-gray-400 text-sm">{stat.label}</p>
//                   </div>
//                 ))}
//               </div>
//             </div> */}
//           </div>
//         </section>

//         {/* About Me Section */}
//         {/* <section id="about" className="relative max-w-6xl mx-auto px-6 py-24">
//           <div className="grid grid-cols-1 lg:grid-cols-2 items-center gap-16">
//             <div className="space-y-8">
//               <div>
//                 <h2 className="text-4xl md:text-5xl font-bold mb-6">
//                   About <span className="bg-gradient-to-r from-orange-400 via-pink-500 to-purple-500 bg-clip-text text-transparent">Me</span>
//                 </h2>
//                 <div className="h-1 w-20 bg-gradient-to-r from-orange-400 to-purple-500 rounded-full mb-8" />
//               </div>

//               <p className="text-lg text-gray-200 leading-relaxed">
//                 I'm a <span className="font-semibold text-white">Full-Stack Developer and Machine Learning Engineer</span> with a proven track record of delivering scalable, production-ready applications.
//               </p>

//               <p className="text-gray-300 leading-relaxed">
//                 My expertise spans the entire development lifecycle—from designing AI-powered solutions like fact-checking APIs and predictive healthcare models, to building real-time platforms for finance and real estate sectors.
//               </p>

//               <div className="space-y-4">
//                 <h3 className="text-xl font-semibold text-white">Specializations:</h3>
//                 <ul className="space-y-3">
//                   {[
//                     "Machine Learning & NLP: Deep learning models, natural language processing",
//                     "Full-Stack Development: React, Node.js, Python, cloud deployment (AWS, Azure)",
//                     "Data Engineering: ETL pipelines, data warehousing, real-time analytics",
//                   ].map((item, index) => (
//                     <li key={index} className="flex items-start gap-3">
//                       <div className="mt-1.5 w-2 h-2 bg-cyan-400 rounded-full flex-shrink-0" />
//                       <span className="text-gray-300">{item}</span>
//                     </li>
//                   ))}
//                 </ul>
//               </div>

//               <p className="text-gray-300 leading-relaxed">
//                 Passionate about creating solutions that not only meet technical requirements but drive measurable business impact.
//               </p>
//             </div>

//             <div className="relative flex justify-center">
//               <div className="relative w-80 h-80">
//                 <div className="absolute inset-0 bg-gradient-to-r from-cyan-500 to-purple-500 rounded-3xl blur-xl opacity-30 animate-pulse" />
//                 <div className="absolute -inset-4 bg-gradient-to-r from-cyan-500/20 to-purple-500/20 rounded-3xl blur-2xl" />
//                 <img
//                   src="/1735390396166-removebg.png"
//                   alt="Kalvin Kayi"
//                   className="relative rounded-3xl shadow-2xl w-full h-full object-cover border-4 border-white/20 backdrop-blur-lg"
//                 />
//                 <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-gradient-to-r from-pink-500 to-purple-500 rounded-2xl blur-xl opacity-30" />
//               </div>
//             </div>
//           </div>
//         </section> */}
//         <section id="about" className="relative py-20 overflow-hidden">
//           {/* Background effects */}
//           <div className="absolute inset-0">
//             <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-orange-500/10 rounded-full blur-3xl" />
//             <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl" />
//           </div>

//           <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
//             <div className="grid lg:grid-cols-2 gap-12 items-center">
//               {/* Text content */}
//               <div className="space-y-6">
//                 <div>
//                   <h2 className="text-4xl md:text-5xl font-bold mb-4">
//                     About{" "}
//                     <span className="bg-gradient-to-r from-orange-400 to-purple-500 bg-clip-text text-transparent">
//                       Me
//                     </span>
//                   </h2>
//                   <div className="h-1 w-16 bg-gradient-to-r from-orange-400 to-purple-500 rounded-full mb-6" />
//                 </div>

//                 <p className="text-lg text-gray-200">
//                   I'm a{" "}
//                   <span className="font-semibold text-white">
//                     Full-Stack Developer & ML Engineer
//                   </span>{" "}
//                   focused on building scalable, production-ready applications
//                   that solve real business challenges.
//                 </p>

//                 {/* Key expertise */}
//                 <div className="space-y-4">
//                   <h3 className="text-xl font-semibold text-white">
//                     Core Expertise
//                   </h3>
//                   <div className="space-y-3">
//                     {[
//                       {
                        
//                         title: "Machine Learning",
//                         items: ["Deep Learning", "NLP", "Predictive Analytics"],
//                       },
//                       {
                        
//                         title: "Full-Stack Dev",
//                         items: [
//                           "React/Next.js",
//                           "Node.js/Python",
//                           "Cloud Deployment",
//                         ],
//                       },
//                       {
                        
//                         title: "Data Engineering",
//                         items: [
//                           "ETL Pipelines",
//                           "Real-time Analytics",
//                           "Data Platforms",
//                         ],
//                       },
//                     ].map((item, index) => (
//                       <div
//                         key={index}
//                         className="flex items-start gap-3 p-3 rounded-lg bg-white/5 border border-white/10"
//                       >
//                         {/* <div className="text-xl mt-1">{item.icon}</div> */}
//                         <div>
//                           <h4 className="font-medium text-white mb-1">
//                             {item.title}
//                           </h4>
//                           <p className="text-sm text-gray-300">
//                             {item.items.join(" • ")}
//                           </p>
//                         </div>
//                       </div>
//                     ))}
//                   </div>
//                 </div>

//                 <p className="text-gray-300">
//                   I build solutions that bridge technical innovation with
//                   measurable business impact, delivering value from concept to
//                   production.
//                 </p>
//               </div>

//               {/* Image section */}
//               <div className="relative">
//                 <div className="relative mx-auto max-w-sm">
//                   {/* Glow effect */}
//                   <div className="absolute inset-0 bg-gradient-to-r from-orange-500/20 to-purple-500/20 rounded-3xl blur-xl" />

//                   {/* Image container */}
//                   <div className="relative rounded-2xl overflow-hidden border-2 border-white/20">
//                     <img
//                       src="/1735390396166-removebg.png"
//                       alt="Kalvin Kayi"
//                       className="w-full h-auto object-contain bg-gradient-to-br from-gray-900 to-black p-8"
//                     />
//                   </div>

//                   {/* Floating tech badges */}
//                   <div className="flex flex-wrap justify-center gap-2 mt-6">
//                     {["React", "Python", "TensorFlow", "AWS", "Node.js"].map(
//                       (tech, index) => (
//                         <div
//                           key={index}
//                           className="px-3 py-1 rounded-full bg-white/5 border border-white/10 text-sm text-gray-300 hover:bg-gradient-to-r hover:from-orange-500/20 hover:to-purple-500/20 transition-colors"
//                         >
//                           {tech}
//                         </div>
//                       )
//                     )}
//                   </div>
//                 </div>

//                 {/* Quick stats */}
//                 <div className="grid grid-cols-3 gap-4 mt-8">
//                   {[
//                     { value: "45+", label: "Projects" },
//                     { value: "5+", label: "Years Exp" },
//                     { value: "100%", label: "Satisfaction" },
//                   ].map((stat, index) => (
//                     <div
//                       key={index}
//                       className="text-center p-3 rounded-lg bg-white/5 border border-white/10"
//                     >
//                       <div className="text-xl font-bold text-white">
//                         {stat.value}
//                       </div>
//                       <div className="text-xs text-gray-400 mt-1">
//                         {stat.label}
//                       </div>
//                     </div>
//                   ))}
//                 </div>
//               </div>
//             </div>

//             {/* Simple CTA */}
//             <div className="mt-12 text-center">
//               <a
//                 href="#contact"
//                 className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-gradient-to-r from-orange-500 to-purple-500 text-white font-medium hover:opacity-90 transition-opacity"
//               >
//                 Let's Connect
//               </a>
//             </div>
//           </div>
//         </section>

//         {/* Skills Section */}
//         <section id="skills" ref={skillsRef} className="relative py-24">
//           <EnhancedSkillsSection />
//         </section>

//         {/* Projects Section */}
//         <section
//           id="projects"
//           ref={projectsRef}
//           className="relative py-24 px-6"
//         >
//           <div className="max-w-6xl mx-auto">
//             {/* <div className="text-center mb-16">
//               <h2 className="text-4xl md:text-5xl font-bold mb-6">
//                 Featured <span className="bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">Projects</span>
//               </h2>
//               <p className="text-gray-400 max-w-2xl mx-auto text-lg">
//                 A collection of my recent work spanning web development, machine learning, and data analytics.
//               </p>
//             </div> */}
//             <Projects />
//           </div>
//         </section>

//         {/* Blog Section */}
//         <section id="blog" className="relative py-24 px-6">
//           <div className="max-w-6xl mx-auto">
//             <div className="text-center mb-16">
//               <h2 className="text-4xl md:text-5xl font-bold mb-6">
//                 Insights &{" "}
//                 <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
//                   Articles
//                 </span>
//               </h2>
//               <p className="text-gray-400 max-w-2xl mx-auto text-lg">
//                 Sharing knowledge about data science, modern engineering, and
//                 development practices.
//               </p>
//             </div>

//             <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
//               {posts.map((post, index) => (
//                 <a
//                   key={index}
//                   href={post.link}
//                   className="hover-card group block bg-white/5 border border-white/10 rounded-2xl p-8 backdrop-blur-sm hover:bg-white/10 transition-all duration-300"
//                 >
//                   <div className="mb-6 w-12 h-12 rounded-xl bg-gradient-to-r from-cyan-500/20 to-purple-500/20 flex items-center justify-center">
//                     <FileText className="text-cyan-400" size={24} />
//                   </div>
//                   <h3 className="text-xl font-semibold mb-4 text-white group-hover:text-cyan-300 transition-colors">
//                     {post.title}
//                   </h3>
//                   <p className="text-gray-500 mb-6">
//                     {post.description || "Read more about this topic"}
//                   </p>
//                   <div className="flex items-center text-cyan-400 group-hover:text-cyan-300 transition-colors">
//                     <span className="text-sm font-medium">Read article</span>
//                     <ExternalLink size={16} className="ml-2" />
//                   </div>
//                 </a>
//               ))}
//             </div>
//           </div>
//         </section>

//         {/* Contact Section */}
//         <section id="contact" className="relative py-24 px-6">
//           <div className="max-w-4xl mx-auto text-center">
//             <div className="relative mb-12">
//               <div className="absolute inset-0 blur-3xl bg-gradient-to-r from-cyan-500/20 to-purple-500/20" />
//               <h2 className="relative text-4xl md:text-5xl font-bold mb-6">
//                 Let's Build Something{" "}
//                 <span className="bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
//                   Amazing
//                 </span>
//               </h2>
//             </div>

//             <p className="text-gray-300 text-lg mb-12 max-w-2xl mx-auto leading-relaxed">
//               Ready to transform your ideas into powerful digital experiences?
//               Let's discuss your next project.
//             </p>

//             <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
//               <a
//                 href="mailto:kayikalvin@gmail.com"
//                 className="group px-8 py-4 rounded-full bg-gradient-to-r from-cyan-500 to-purple-500 text-white font-semibold hover:shadow-xl hover:shadow-cyan-500/25 transition-all duration-300 flex items-center justify-center gap-3"
//               >
//                 <Mail size={20} />
//                 Get In Touch
//               </a>
//               <a
//                 href="/Alvin Kayi CV.pdf"
//                 target="_blank"
//                 rel="noopener noreferrer"
//                 className="group px-8 py-4 rounded-full border-2 border-white/20 bg-white/5 backdrop-blur-sm font-semibold hover:bg-white/10 hover:border-white/30 transition-all duration-300 flex items-center justify-center gap-3"
//               >
//                 <FileText size={20} />
//                 View Resume
//               </a>
//             </div>

//             <div className="border-t border-white/10 pt-12">
//               <p className="text-gray-400">
//                 Typically respond within{" "}
//                 <span className="text-cyan-300">24 hours</span>
//               </p>
//             </div>
//           </div>
//         </section>

//         {/* Footer */}
//         <footer className="relative py-12 px-6 border-t border-white/10 bg-gradient-to-b from-black to-gray-900/50">
//           <div className="max-w-6xl mx-auto">
//             <div className="flex flex-col md:flex-row justify-between items-center gap-8">
//               <div className="text-center md:text-left">
//                 <h3 className="text-2xl font-bold mb-2 bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
//                   Kalvin Kayi
//                 </h3>
//                 <p className="text-gray-400">
//                   Full-Stack Developer & ML Engineer
//                 </p>
//               </div>

//               <div className="flex gap-8">
//                 {["Privacy", "Terms", "Contact"].map((item, index) => (
//                   <a
//                     key={index}
//                     href="#"
//                     className="text-gray-400 hover:text-white transition-colors duration-300"
//                   >
//                     {item}
//                   </a>
//                 ))}
//               </div>
//             </div>

//             <div className="mt-12 pt-8 border-t border-white/10 text-center text-gray-500 text-sm">
//               <p>
//                 © {new Date().getFullYear()} Kalvin Kayi. All rights reserved.
//               </p>
//               {/* <p className="mt-2">
//                 Built with React, TypeScript, and Tailwind CSS
//               </p> */}
//             </div>
//           </div>
//         </footer>
//       </div>
//     </div>
//   );
// };

// export default Home;

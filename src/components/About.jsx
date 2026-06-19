/**
 * About.jsx — Full-bleed editorial About section
 *
 * Design language: Awwwards-tier editorial. Large-format magazine meets
 * generative-AI portfolio. Portrait bleeds to edge with scroll-driven
 * duotone → full-color "develop" effect. Asymmetric type overlay.
 * Inline stat-strip. Cursor-tracked magnetic links.
 *
 * Drop into Home.jsx as a named export or default — works either way.
 * Requires: lucide-react (Github, Linkedin, ArrowUpRight)
 */

import { useEffect, useRef, useState, useCallback } from "react";
import { Github, Linkedin, ArrowUpRight } from "lucide-react";

/* ─────────────────────────────────────────────────────────────────────────────
   CONSTANTS
───────────────────────────────────────────────────────────────────────────── */
const GLYPHS = "01ABCDEFGHIJKLMNOPQRSTUVWXYZ#$%&+=";

const STATS = [
  { value: 45, suffix: "+", label: "Repos" },
  { value: 5, suffix: "+", label: "Yrs exp" },
  { value: 15, suffix: "+", label: "Products" },
  { value: 100, suffix: "K+", label: "Lines" },
];

/* ─────────────────────────────────────────────────────────────────────────────
   DECODE TEXT
   Chars resolve left-to-right from random glyphs. Fires once on active.
───────────────────────────────────────────────────────────────────────────── */
function DecodeText({
  text,
  active,
  color,
  italic = false,
  delay = 0,
  speed = 24,
}) {
  const [display, setDisplay] = useState(() => text.replace(/[^ ]/g, "\u00A0"));
  const firedRef = useRef(false);

  useEffect(() => {
    if (!active || firedRef.current) return;
    firedRef.current = true;

    const chars = text.split("");
    const resolved = new Array(chars.length).fill(false);
    let frame = 0;
    let tid;

    const startTid = setTimeout(() => {
      const tick = () => {
        const frontier = Math.floor(frame / 2);
        for (let i = 0; i <= frontier && i < chars.length; i++) {
          if (chars[i] === " ") {
            resolved[i] = true;
            continue;
          }
          if (frontier - i > 3) resolved[i] = true;
        }
        const next = chars
          .map((c, i) => {
            if (c === " ") return " ";
            if (resolved[i]) return c;
            if (i > frontier)
              return GLYPHS[Math.floor(Math.random() * GLYPHS.length)];
            return c;
          })
          .join("");
        setDisplay(next);
        frame++;
        if (!resolved.every(Boolean)) {
          tid = setTimeout(tick, speed);
        } else {
          setDisplay(text);
        }
      };
      tick();
    }, delay);

    return () => {
      clearTimeout(startTid);
      clearTimeout(tid);
    };
  }, [active, text, delay, speed]);

  return (
    <span
      style={{
        fontFamily: "'DM Serif Display', 'Georgia', serif",
        fontStyle: italic ? "italic" : "normal",
        color: color || "inherit",
        whiteSpace: "pre-wrap",
      }}
    >
      {display}
    </span>
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
   COUNTER
   Eased numeric count-up when visible fires.
───────────────────────────────────────────────────────────────────────────── */
function Counter({ target, suffix, visible, delay = 0 }) {
  const [n, setN] = useState(0);

  useEffect(() => {
    if (!visible) return;
    let raf;
    const duration = 1200;
    const startTime = performance.now() + delay * 1000;

    const tick = (now) => {
      const elapsed = Math.max(0, now - startTime);
      const t = Math.min(1, elapsed / duration);
      const eased = 1 - Math.pow(1 - t, 4);
      setN(Math.round(target * eased));
      if (t < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [visible, target, delay]);

  return (
    <>
      {n}
      {suffix}
    </>
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
   MAGNETIC LINK
───────────────────────────────────────────────────────────────────────────── */
function MagneticLink({ href, children }) {
  const ref = useRef(null);

  const onMove = useCallback((e) => {
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const x = (e.clientX - (r.left + r.width / 2)) * 0.3;
    const y = (e.clientY - (r.top + r.height / 2)) * 0.3;
    el.style.transform = `translate(${x}px, ${y}px)`;
  }, []);

  const onLeave = useCallback(() => {
    if (ref.current) ref.current.style.transform = "translate(0,0)";
  }, []);

  return (
    <a
      ref={ref}
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      style={{ transition: "transform 0.35s cubic-bezier(.23,1,.32,1)" }}
    >
      {children}
    </a>
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
   ABOUT — main section
───────────────────────────────────────────────────────────────────────────── */
export default function About() {
  const sectionRef = useRef(null);
  const portraitRef = useRef(null);
  const overlayRef = useRef(null); // chartreuse duotone overlay
  const inkRef = useRef(null); // dark ink overlay

  const [visible, setVisible] = useState(false);
  const [scrollP, setScrollP] = useState(0); // 0 → 1 as section crosses viewport

  /* Intersection → fire entrance */
  useEffect(() => {
    const obs = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) setVisible(true);
      },
      { threshold: 0.15 },
    );
    if (sectionRef.current) obs.observe(sectionRef.current);
    return () => obs.disconnect();
  }, []);

  /* Scroll → duotone develop + subtle portrait parallax */
  useEffect(() => {
    const onScroll = () => {
      const el = sectionRef.current;
      if (!el) return;
      const r = el.getBoundingClientRect();
      const vh = window.innerHeight;
      // 0 when section top is at viewport bottom, 1 when section bottom clears viewport top
      const p = Math.min(1, Math.max(0, 1 - r.top / vh));
      setScrollP(p);

      // Duotone develop: overlay fades out as section scrolls into view
      if (overlayRef.current)
        overlayRef.current.style.opacity = Math.max(0, 1 - p * 2).toString();
      if (inkRef.current)
        inkRef.current.style.opacity = Math.max(0, 0.72 - p * 1.1).toString();

      // Slow parallax on portrait
      if (portraitRef.current) {
        const shift = (p - 0.4) * -40;
        portraitRef.current.style.transform = `translateY(${shift}px)`;
      }
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  /* Cursor light on portrait */
  const onPortraitMove = useCallback((e) => {
    const el = sectionRef.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const xPct = ((e.clientX - r.left) / r.width) * 100;
    const yPct = ((e.clientY - r.top) / r.height) * 100;
    const light = el.querySelector(".cursor-light");
    if (light) {
      light.style.background = `radial-gradient(circle at ${xPct}% ${yPct}%, rgba(200,242,65,0.09) 0%, transparent 55%)`;
    }
  }, []);

  const T = (delay) => ({
    opacity: visible ? 1 : 0,
    transform: visible ? "none" : "translateY(22px)",
    transition: `opacity 0.75s ease ${delay}s, transform 0.75s ease ${delay}s`,
  });

  return (
    <>
      {/* ── Google Fonts import (add to <head> in production instead) ── */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=DM+Mono:wght@400;500&family=DM+Sans:ital,wght@0,300;0,400;0,500;1,300&display=swap');

        #about *,
        #about *::before,
        #about *::after { box-sizing: border-box; }

        #about a { color: inherit; text-decoration: none; }

        /* Grain texture overlay */
        #about::before {
          content: "";
          position: absolute;
          inset: 0;
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.04'/%3E%3C/svg%3E");
          background-size: 180px;
          pointer-events: none;
          z-index: 1;
          opacity: 0.55;
        }

        /* Vertical hairline dividers in stat strip */
        .stat-divider {
          width: 1px;
          height: 38px;
          background: #1f1f1f;
          flex-shrink: 0;
        }

        /* Link pill hover */
        .about-link-pill {
          display: inline-flex;
          align-items: center;
          gap: 9px;
          font-family: 'DM Sans', sans-serif;
          font-size: 12px;
          font-weight: 400;
          letter-spacing: 0.04em;
          color: #5a5a5a;
          padding: 10px 20px;
          border: 1px solid #1e1e1e;
          border-radius: 40px;
          cursor: pointer;
          transition: color 0.22s, border-color 0.22s, background 0.22s;
          white-space: nowrap;
        }
        .about-link-pill:hover {
          color: #c8f241;
          border-color: #c8f241;
          background: rgba(200,242,65,0.04);
        }

        /* Portrait clip path animate in */
        @keyframes portraitReveal {
          from { clip-path: inset(0 100% 0 0); }
          to   { clip-path: inset(0 0% 0 0); }
        }
        .portrait-reveal {
          animation: portraitReveal 1.1s cubic-bezier(.77,0,.18,1) forwards;
        }

        /* Floating marquee ticker */
        @keyframes ticker {
          from { transform: translateX(0); }
          to   { transform: translateX(-50%); }
        }
        .ticker-track {
          display: flex;
          animation: ticker 18s linear infinite;
          will-change: transform;
        }

        /* Reduced motion */
        @media (prefers-reduced-motion: reduce) {
          #about *, #about *::before { animation: none !important; transition: none !important; }
        }

        /* Mobile */
        @media (max-width: 760px) {
          .about-inner { flex-direction: column !important; }
          .about-portrait-col { width: 100% !important; height: 65vh !important; min-height: 480px !important; }
          .about-content-col { padding: 36px 24px 48px !important; }
          .overlap-headline { position: relative !important; bottom: auto !important; left: auto !important; padding: 28px 24px 0 !important; }
          .headline-size { font-size: clamp(2rem, 7vw, 3rem) !important; }
          .stat-strip-wrap { flex-wrap: wrap; gap: 20px 0 !important; }
          .stat-divider { display: none !important; }
          .stat-item { padding: 0 16px !important; }

          /* NEW: lighten and enlarge the portrait on mobile */
          .about-portrait-col img { object-position: center top !important; }
          .about-ink-overlay { opacity: 0.35 !important; }
          .about-duotone-overlay { opacity: 0.5 !important; }
          .about-vignette { background: radial-gradient(ellipse at 60% 40%, transparent 45%, rgba(0,0,0,0.4) 100%) !important; }
        }
      `}</style>

      <section
        id="about"
        ref={sectionRef}
        onMouseMove={onPortraitMove}
        style={{
          position: "relative",
          background: "#080808",
          overflow: "hidden",
          zIndex: 2,
        }}
      >
        {/* Cursor light — follows mouse across whole section */}
        <div
          className="cursor-light"
          style={{
            position: "absolute",
            inset: 0,
            pointerEvents: "none",
            zIndex: 0,
            transition: "background 0.12s ease",
          }}
        />

        {/* ── Top ruled line ── */}
        {/* <div style={{ position: "relative", zIndex: 3 }}>
          <div style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "18px 5vw",
            borderBottom: "1px solid #141414",
            ...T(0),
          }}>
            <span style={{ fontFamily: "'DM Mono', monospace", fontSize: 10, letterSpacing: "0.18em", color: "#2d2d2d", textTransform: "uppercase" }}>
              Section — 02 / 04
            </span>
            <span style={{ fontFamily: "'DM Mono', monospace", fontSize: 10, letterSpacing: "0.14em", color: "#2d2d2d", textTransform: "uppercase" }}>
              Based in Nairobi, KE
            </span>
          </div>
        </div> */}

        {/* ── Main split ── */}
        <div
          className="about-inner"
          style={{
            display: "flex",
            alignItems: "stretch",
            position: "relative",
            zIndex: 3,
          }}
        >
          {/* ────────────────── LEFT: Portrait column ────────────────── */}
          <div
            className="about-portrait-col"
            style={{
              position: "relative",
              width: "42%",
              minHeight: "88vh",
              flexShrink: 0,
              overflow: "hidden",
              borderRight: "1px solid #141414",
            }}
          >
            {/* Portrait image — parallax wrapper */}
            <div
              ref={portraitRef}
              className={visible ? "portrait-reveal" : ""}
              style={{
                position: "absolute",
                inset: "-8% 0",
                willChange: "transform",
                transition: "transform 0.08s linear",
              }}
            >
              <img
                src="/1735390396166-removebg.png"
                alt="Kalvin Kayi"
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                  objectPosition: "center top",
                  display: "block",
                  background:
                    "linear-gradient(170deg, #121409 0%, #0a0a0a 100%)",
                  padding: "0 24px",
                }}
              />
            </div>

            {/* ── Duotone layer — chartreuse tint ── */}
            <div
              ref={overlayRef}
              className="about-duotone-overlay"
              style={{
                position: "absolute",
                inset: 0,
                mixBlendMode: "color",
                background:
                  "linear-gradient(160deg, #c8f241 0%, #a0bf30 40%, #2a3300 100%)",
                pointerEvents: "none",
                transition: "opacity 0.6s ease",
                zIndex: 2,
              }}
            />

            {/* ── Ink darken layer ── */}
            <div
              ref={inkRef}
              className="about-ink-overlay"
              style={{
                position: "absolute",
                inset: 0,
                background: "linear-gradient(160deg, #000 0%, #0d0d0d 100%)",
                mixBlendMode: "multiply",
                pointerEvents: "none",
                opacity: 0.72,
                transition: "opacity 0.6s ease",
                zIndex: 1,
              }}
            />

            {/* Vignette — always on */}
            <div
              className="about-vignette"
              style={{
                position: "absolute",
                inset: 0,
                background:
                  "radial-gradient(ellipse at 60% 40%, transparent 30%, rgba(0,0,0,0.65) 100%)",
                pointerEvents: "none",
                zIndex: 3,
              }}
            />

            {/* Bottom fade */}
            <div
              style={{
                position: "absolute",
                bottom: 0,
                left: 0,
                right: 0,
                height: "45%",
                background:
                  "linear-gradient(to top, #080808 0%, transparent 100%)",
                pointerEvents: "none",
                zIndex: 4,
              }}
            />

            {/* ── Headline overlaid on portrait ── */}
            <div
              className="overlap-headline"
              style={{
                position: "absolute",
                bottom: "9%",
                left: 0,
                right: "-8%",
                zIndex: 5,
                padding: "0 5vw 0 5vw",
                opacity: visible ? 1 : 0,
                transform: visible ? "none" : "translateY(24px)",
                transition: "opacity 0.8s ease 0.1s, transform 0.8s ease 0.1s",
              }}
            >
              <h2
                className="headline-size"
                style={{
                  fontSize: "clamp(2.4rem, 3.8vw, 4.6rem)",
                  fontWeight: 400,
                  lineHeight: 1.04,
                  margin: 0,
                  letterSpacing: "-0.015em",
                }}
              >
                <DecodeText
                  text="I make machines"
                  color="#f0ede6"
                  active={visible}
                  delay={120}
                  speed={20}
                />
                <br />
                <DecodeText
                  text="understand humans."
                  color="#c8f241"
                  italic
                  active={visible}
                  delay={560}
                  speed={24}
                />
              </h2>

              {/* Scroll indicator — bottom-left of portrait */}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                  marginTop: 32,
                  opacity: visible ? 0.35 : 0,
                  transition: "opacity 0.8s ease 2s",
                }}
              >
                <div style={{ width: 40, height: 1, background: "#c8f241" }} />
                <span
                  style={{
                    fontFamily: "'DM Mono', monospace",
                    fontSize: 9,
                    color: "#c8f241",
                    letterSpacing: "0.18em",
                    textTransform: "uppercase",
                  }}
                >
                  Scroll to develop
                </span>
              </div>
            </div>
          </div>

          {/* ────────────────── RIGHT: Content column ────────────────── */}
          <div
            className="about-content-col"
            style={{
              flex: 1,
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
              padding: "72px 6vw 64px 5vw",
            }}
          >
            {/* Top area */}
            <div>
              {/* Eyebrow */}
              <p
                style={{
                  fontFamily: "'DM Mono', monospace",
                  fontSize: 10,
                  letterSpacing: "0.2em",
                  color: "#c8f241",
                  textTransform: "uppercase",
                  margin: "0 0 48px",
                  ...T(0.05),
                }}
              >
                About
              </p>

              {/* Large pull quote — stacked right of the headline overflow */}
              <p
                style={{
                  fontFamily: "'DM Sans', sans-serif",
                  fontWeight: 300,
                  fontSize: "clamp(1.05rem, 1.3vw, 1.22rem)",
                  lineHeight: 1.82,
                  color: "#4a4a4a",
                  maxWidth: 400,
                  margin: "0 0 56px",
                  ...T(0.18),
                }}
              >
                Based in Nairobi. I build production systems where rigorous data
                engineering meets considered design — fact-checkers, predictive
                healthcare models, real-time platforms —{" "}
                <em style={{ color: "#787878", fontStyle: "italic" }}>
                  work that doesn't just function, it resonates.
                </em>
              </p>

              {/* ── Stat strip ── */}
              <div
                className="stat-strip-wrap"
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 0,
                  marginBottom: 56,
                  ...T(0.32),
                }}
              >
                {STATS.map((s, i) => (
                  <>
                    <div
                      key={s.label}
                      className="stat-item"
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        gap: 6,
                        padding: i === 0 ? "0 28px 0 0" : "0 28px",
                      }}
                    >
                      <span
                        style={{
                          fontFamily: "'DM Serif Display', serif",
                          fontSize: "2.1rem",
                          color: "#f0ede6",
                          lineHeight: 1,
                          letterSpacing: "-0.02em",
                        }}
                      >
                        <Counter
                          target={s.value}
                          suffix={s.suffix}
                          visible={visible}
                          delay={0.65 + i * 0.08}
                        />
                      </span>
                      <span
                        style={{
                          fontFamily: "'DM Mono', monospace",
                          fontSize: 9,
                          color: "#303030",
                          textTransform: "uppercase",
                          letterSpacing: "0.12em",
                          whiteSpace: "nowrap",
                        }}
                      >
                        {s.label}
                      </span>
                    </div>
                    {i < STATS.length - 1 && (
                      <div key={`div-${i}`} className="stat-divider" />
                    )}
                  </>
                ))}
              </div>

              {/* ── Links ── */}
              <div
                style={{
                  display: "flex",
                  gap: 12,
                  flexWrap: "wrap",
                  ...T(0.45),
                }}
              >
                <MagneticLink href="https://github.com/kayikalvin">
                  <span className="about-link-pill">
                    <Github size={13} />
                    GitHub
                    <ArrowUpRight size={11} style={{ opacity: 0.5 }} />
                  </span>
                </MagneticLink>
                <MagneticLink href="https://linkedin.com/in/kayikalvin">
                  <span className="about-link-pill">
                    <Linkedin size={13} />
                    LinkedIn
                    <ArrowUpRight size={11} style={{ opacity: 0.5 }} />
                  </span>
                </MagneticLink>
              </div>
            </div>

            {/* ── Bottom: skills marquee ── */}
            <div
              style={{
                marginTop: "auto",
                paddingTop: 60,
                borderTop: "1px solid #111",
                overflow: "hidden",
                ...T(0.55),
              }}
            >
              <p
                style={{
                  fontFamily: "'DM Mono', monospace",
                  fontSize: 9,
                  color: "#242424",
                  letterSpacing: "0.16em",
                  textTransform: "uppercase",
                  marginBottom: 14,
                }}
              >
                Stack
              </p>
              <div
                style={{
                  overflow: "hidden",
                  maskImage:
                    "linear-gradient(to right, transparent 0%, black 8%, black 92%, transparent 100%)",
                }}
              >
                <div className="ticker-track" style={{ width: "max-content" }}>
                  {[
                    "Python",
                    "React",
                    "TypeScript",
                    "PostgreSQL",
                    "TensorFlow",
                    "FastAPI",
                    "Next.js",
                    "Docker",
                    "Airflow",
                    "dbt",
                    "Redis",
                    "GraphQL",
                    "Python",
                    "React",
                    "TypeScript",
                    "PostgreSQL",
                    "TensorFlow",
                    "FastAPI",
                    "Next.js",
                    "Docker",
                    "Airflow",
                    "dbt",
                    "Redis",
                    "GraphQL",
                  ].map((tech, i) => (
                    <span
                      key={i}
                      style={{
                        display: "inline-block",
                        fontFamily: "'DM Mono', monospace",
                        fontSize: 11,
                        color: i % 2 === 0 ? "#2a2a2a" : "#1a1a1a",
                        letterSpacing: "0.08em",
                        padding: "0 22px",
                        borderRight: "1px solid #141414",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ── Full-width bottom ticker ── */}
        <div
          style={{
            borderTop: "1px solid #111",
            overflow: "hidden",
            position: "relative",
            zIndex: 3,
            height: 44,
            display: "flex",
            alignItems: "center",
            ...T(0.6),
          }}
        >
          <div
            className="ticker-track"
            style={{
              width: "max-content",
              animationDuration: "24s",
              animationDirection: "reverse",
            }}
          >
            {Array.from({ length: 8 }, (_, i) => (
              <span
                key={i}
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 14,
                  fontFamily: "'DM Mono', monospace",
                  fontSize: 10,
                  color: "#1c1c1c",
                  letterSpacing: "0.16em",
                  textTransform: "uppercase",
                  padding: "0 32px",
                  borderRight: "1px solid #111",
                  whiteSpace: "nowrap",
                }}
              >
                Data Engineering
                <span style={{ color: "#c8f241", fontSize: 5 }}>◆</span>
                Machine Learning
                <span style={{ color: "#c8f241", fontSize: 5 }}>◆</span>
                Full-Stack Systems
                <span style={{ color: "#c8f241", fontSize: 5 }}>◆</span>
                Product Design
              </span>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}

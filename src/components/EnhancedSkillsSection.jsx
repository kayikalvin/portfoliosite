/**
 * KALVIN KAYI — SKILLS SECTION (Redesigned)
 *
 * Design: Three editorial domain columns replacing the progress-bar grid.
 * Each domain is a full-height column with a large serif title, a short
 * positioning line, and a list of tool tags that light up on hover showing
 * a brief context note. Signature element: an ambient SVG radial diagram
 * that slowly rotates behind the columns, mapping the three domains as
 * orbital arcs — visible but never competing with the type.
 *
 * No percentages. No bars. No pips. Tools are facts, not grades.
 */

import { useState, useEffect, useRef } from "react";

/* ─────────────────────────────────────────────
   SKILL DATA
   context = what it's actually used for in real projects
───────────────────────────────────────────── */
const DOMAINS = [
  {
    id: "ml",
    index: "01",
    title: "Machine\nLearning",
    arc: "Building models that learn from messy, real-world data.",
    color: "#c8f241",
    tools: [
      { name: "Python",            context: "Primary language — data pipelines, APIs, scripts" },
      { name: "TensorFlow",        context: "Deep learning model architecture & training" },
      { name: "PyTorch",           context: "Research prototyping & custom neural nets" },
      { name: "Scikit-learn",      context: "Classical ML, feature engineering, ensembles" },
      { name: "Hugging Face",      context: "Fine-tuning & deploying transformer models" },
      { name: "NLP",               context: "Text classification, NER, semantic search" },
      { name: "MLOps",             context: "Model versioning, monitoring & CI/CD for ML" },
      { name: "Computer Vision",   context: "Object detection, segmentation, OCR" },
    ],
  },
  {
    id: "data",
    index: "02",
    title: "Data\nEngineering",
    arc: "Turning raw, fragmented data into reliable infrastructure.",
    color: "#f0ede6",
    tools: [
      { name: "PostgreSQL",        context: "Primary relational DB — complex queries, tuning" },
      { name: "MongoDB",           context: "Document store for flexible, nested data" },
      { name: "Apache Spark",      context: "Distributed processing for large-scale datasets" },
      { name: "dbt",               context: "SQL-based transformation & data modelling" },
      { name: "Airflow",           context: "Orchestrating multi-step ETL pipelines" },
      { name: "Redis",             context: "Caching layer & real-time pub/sub" },
      { name: "Power BI",          context: "Executive dashboards & self-service analytics" },
      { name: "BigQuery",          context: "Cloud data warehouse & analytical workloads" },
    ],
  },
  {
    id: "dev",
    index: "03",
    title: "Full-Stack\nDevelopment",
    arc: "Shipping products from schema to UI that people actually use.",
    color: "#c8f241",
    tools: [
      { name: "React / Next.js",   context: "Production web apps — SSR, routing, state" },
      { name: "TypeScript",        context: "Type-safe codebases across front and back" },
      { name: "Node.js",           context: "REST & GraphQL APIs, background workers" },
      { name: "FastAPI",           context: "High-performance Python APIs for ML services" },
      { name: "Docker",            context: "Containerising services for consistent deploys" },
      { name: "AWS / GCP",         context: "Cloud infra — EC2, Lambda, Cloud Run, S3" },
      { name: "GraphQL",           context: "Flexible API layer for complex data graphs" },
      { name: "CI/CD",             context: "GitHub Actions pipelines, automated testing" },
    ],
  },
];

/* ─────────────────────────────────────────────
   AMBIENT RADIAL DIAGRAM (SVG)
   Three orbital arcs, one per domain. Rotates slowly.
   Purely decorative — aria-hidden.
───────────────────────────────────────────── */
function RadialDiagram({ visible }) {
  const rotRef = useRef(null);
  const angleRef = useRef(0);
  const rafRef = useRef(null);

  useEffect(() => {
    if (!visible) return;
    const tick = () => {
      angleRef.current += 0.018;
      if (rotRef.current) {
        rotRef.current.setAttribute(
          "transform",
          `rotate(${angleRef.current}, 400, 400)`
        );
      }
      rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
  }, [visible]);

  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 800 800"
      style={{
        position: "absolute",
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
        width: "min(90vw, 820px)",
        height: "min(90vw, 820px)",
        opacity: visible ? 0.07 : 0,
        transition: "opacity 2s ease 0.5s",
        pointerEvents: "none",
        zIndex: 0,
      }}
    >
      <g ref={rotRef}>
        {/* Outer arc — ML */}
        <circle cx="400" cy="400" r="340" fill="none" stroke="#c8f241" strokeWidth="0.8" strokeDasharray="12 8" />
        {/* Mid arc — Data */}
        <circle cx="400" cy="400" r="240" fill="none" stroke="#f0ede6" strokeWidth="0.5" strokeDasharray="6 12" />
        {/* Inner arc — Dev */}
        <circle cx="400" cy="400" r="140" fill="none" stroke="#c8f241" strokeWidth="0.4" strokeDasharray="4 14" />

        {/* Orbital nodes — one per domain */}
        <circle cx="400" cy="60"  r="5" fill="#c8f241" opacity="0.6" />
        <circle cx="660" cy="540" r="4" fill="#f0ede6" opacity="0.5" />
        <circle cx="160" cy="540" r="3" fill="#c8f241" opacity="0.4" />

        {/* Cross-hairs */}
        <line x1="400" y1="50"  x2="400" y2="750" stroke="#f0ede6" strokeWidth="0.3" opacity="0.3" />
        <line x1="50"  y1="400" x2="750" y2="400" stroke="#f0ede6" strokeWidth="0.3" opacity="0.3" />

        {/* Diagonal spokes */}
        <line x1="165" y1="165" x2="635" y2="635" stroke="#f0ede6" strokeWidth="0.2" opacity="0.2" />
        <line x1="635" y1="165" x2="165" y2="635" stroke="#f0ede6" strokeWidth="0.2" opacity="0.2" />

        {/* Centre dot */}
        <circle cx="400" cy="400" r="3" fill="#c8f241" opacity="0.5" />
        <circle cx="400" cy="400" r="10" fill="none" stroke="#c8f241" strokeWidth="0.5" opacity="0.3" />
      </g>
    </svg>
  );
}

/* ─────────────────────────────────────────────
   TOOL TAG
───────────────────────────────────────────── */
function ToolTag({ tool, domainColor, visible, delay }) {
  const [hovered, setHovered] = useState(false);

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        gap: 12,
        padding: "13px 0",
        borderBottom: "1px solid #111",
        cursor: "default",
        opacity: visible ? 1 : 0,
        transform: visible ? "none" : "translateX(-12px)",
        transition: `opacity 0.55s ease ${delay}s, transform 0.55s ease ${delay}s`,
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 10, minWidth: 0 }}>
        {/* Dot indicator */}
        <div style={{
          width: 5,
          height: 5,
          borderRadius: "50%",
          background: hovered ? domainColor : "#2a2a2a",
          flexShrink: 0,
          transition: "background 0.2s ease",
        }} />
        <span style={{
          fontFamily: "'DM Sans', sans-serif",
          fontSize: "clamp(0.88rem, 1vw, 1rem)",
          fontWeight: hovered ? 500 : 400,
          color: hovered ? "#f0ede6" : "#787878",
          transition: "color 0.2s ease, font-weight 0.2s ease",
          whiteSpace: "nowrap",
        }}>
          {tool.name}
        </span>
      </div>

      {/* Context — slides in on hover */}
      <span style={{
        fontFamily: "'DM Mono', monospace",
        fontSize: 10,
        color: "#3a3a3a",
        letterSpacing: "0.04em",
        textAlign: "right",
        maxWidth: hovered ? 180 : 0,
        overflow: "hidden",
        opacity: hovered ? 1 : 0,
        transition: "max-width 0.3s ease, opacity 0.25s ease",
        whiteSpace: "nowrap",
        flexShrink: 0,
      }}>
        {tool.context}
      </span>
    </div>
  );
}

/* ─────────────────────────────────────────────
   DOMAIN COLUMN
───────────────────────────────────────────── */
function DomainColumn({ domain, visible, colIndex }) {
  const titleLines = domain.title.split("\n");
  const baseDelay  = colIndex * 0.12;

  return (
    <div style={{
      flex: 1,
      minWidth: 0,
      padding: "0 3vw",
      borderRight: colIndex < 2 ? "1px solid #111" : "none",
      position: "relative",
      zIndex: 1,
    }}>
      {/* Domain index */}
      <p style={{
        fontFamily: "'DM Mono', monospace",
        fontSize: 10,
        letterSpacing: "0.2em",
        color: "#2d2d2d",
        textTransform: "uppercase",
        marginBottom: 28,
        opacity: visible ? 1 : 0,
        transition: `opacity 0.6s ease ${baseDelay}s`,
      }}>
        {domain.index}
      </p>

      {/* Domain title */}
      <h3 style={{
        fontFamily: "'DM Serif Display', serif",
        fontSize: "clamp(1.9rem, 2.8vw, 3rem)",
        fontWeight: 400,
        lineHeight: 1.05,
        color: "#f0ede6",
        margin: "0 0 20px",
        whiteSpace: "pre-line",
        opacity: visible ? 1 : 0,
        transform: visible ? "none" : "translateY(18px)",
        transition: `opacity 0.7s ease ${baseDelay + 0.08}s, transform 0.7s ease ${baseDelay + 0.08}s`,
      }}>
        {titleLines[0]}
        <br />
        <em style={{ fontStyle: "italic", color: domain.color }}>
          {titleLines[1]}
        </em>
      </h3>

      {/* Arc / positioning line */}
      <p style={{
        fontFamily: "'DM Sans', sans-serif",
        fontSize: "clamp(0.78rem, 0.9vw, 0.88rem)",
        lineHeight: 1.7,
        color: "#3d3d3d",
        marginBottom: 36,
        maxWidth: 260,
        opacity: visible ? 1 : 0,
        transition: `opacity 0.7s ease ${baseDelay + 0.16}s`,
      }}>
        {domain.arc}
      </p>

      {/* Divider */}
      <div style={{
        width: visible ? "100%" : "0%",
        height: 1,
        background: `linear-gradient(to right, ${domain.color}, transparent)`,
        marginBottom: 8,
        transition: `width 0.9s cubic-bezier(.23,1,.32,1) ${baseDelay + 0.22}s`,
      }} />

      {/* Tool list */}
      <div>
        {domain.tools.map((tool, i) => (
          <ToolTag
            key={tool.name}
            tool={tool}
            domainColor={domain.color}
            visible={visible}
            delay={baseDelay + 0.28 + i * 0.055}
          />
        ))}
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────
   MAIN EXPORT
───────────────────────────────────────────── */
const EnhancedSkillsSection = () => {
  const [visible, setVisible] = useState(false);
  const sectionRef = useRef(null);

  useEffect(() => {
    const obs = new IntersectionObserver(
      ([e]) => e.isIntersecting && setVisible(true),
      { threshold: 0.08 }
    );
    if (sectionRef.current) obs.observe(sectionRef.current);
    return () => obs.disconnect();
  }, []);

  return (
    <section
      id="skills"
      ref={sectionRef}
      style={{
        padding: "14vh 5vw",
        position: "relative",
        zIndex: 2,
        overflow: "hidden",
      }}
    >
      {/* Ambient background diagram */}
      <RadialDiagram visible={visible} />

      {/* ── Section header ── */}
      <div style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "flex-end",
        flexWrap: "wrap",
        gap: 24,
        marginBottom: "8vh",
        position: "relative",
        zIndex: 1,
      }}>
        <div>
          <p style={{
            fontFamily: "'DM Mono', monospace",
            fontSize: 10,
            letterSpacing: "0.2em",
            color: "#c8f241",
            textTransform: "uppercase",
            marginBottom: 20,
            opacity: visible ? 1 : 0,
            transition: "opacity 0.6s ease",
          }}>
            Expertise
          </p>
          <h2 style={{
            fontFamily: "'DM Serif Display', serif",
            fontSize: "clamp(2.6rem, 4.5vw, 5rem)",
            fontWeight: 400,
            lineHeight: 1.02,
            color: "#f0ede6",
            margin: 0,
            opacity: visible ? 1 : 0,
            transform: visible ? "none" : "translateY(22px)",
            transition: "opacity 0.7s ease 0.08s, transform 0.7s ease 0.08s",
          }}>
            Tools I reach
            <br />
            <em style={{ fontStyle: "italic", color: "#c8f241" }}>for, and why.</em>
          </h2>
        </div>

        {/* Tool count */}
        <div style={{
          opacity: visible ? 1 : 0,
          transition: "opacity 0.7s ease 0.3s",
          textAlign: "right",
        }}>
          <p style={{
            fontFamily: "'DM Serif Display', serif",
            fontSize: "3.5rem",
            fontWeight: 400,
            color: "#1a1a1a",
            lineHeight: 1,
            margin: 0,
          }}>
            {DOMAINS.reduce((n, d) => n + d.tools.length, 0)}
          </p>
          <p style={{
            fontFamily: "'DM Mono', monospace",
            fontSize: 9,
            color: "#2a2a2a",
            letterSpacing: "0.16em",
            textTransform: "uppercase",
            marginTop: 4,
          }}>
            Tools across 3 domains
          </p>
        </div>
      </div>

      {/* ── Three-column domain layout ── */}
      <div style={{
        display: "flex",
        gap: 0,
        borderTop: "1px solid #111",
        paddingTop: "6vh",
        position: "relative",
        zIndex: 1,
      }}>
        {DOMAINS.map((domain, i) => (
          <DomainColumn
            key={domain.id}
            domain={domain}
            visible={visible}
            colIndex={i}
          />
        ))}
      </div>

      {/* ── Bottom rule + note ── */}
      <div style={{
        marginTop: "7vh",
        paddingTop: 24,
        borderTop: "1px solid #111",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        flexWrap: "wrap",
        gap: 16,
        position: "relative",
        zIndex: 1,
        opacity: visible ? 1 : 0,
        transition: "opacity 0.7s ease 1.2s",
      }}>
        <p style={{
          fontFamily: "'DM Mono', monospace",
          fontSize: 10,
          color: "#222",
          letterSpacing: "0.12em",
          textTransform: "uppercase",
        }}>
          Hover any tool to see its real-world role
        </p>
        <p style={{
          fontFamily: "'DM Mono', monospace",
          fontSize: 10,
          color: "#222",
          letterSpacing: "0.12em",
          textTransform: "uppercase",
        }}>
          Continuously updated · 2025
        </p>
      </div>

      <style>{`
        @media (max-width: 900px) {
          #skills > div:nth-child(3) {
            flex-direction: column !important;
          }
          #skills > div:nth-child(3) > div {
            border-right: none !important;
            border-bottom: 1px solid #111 !important;
            padding: 5vh 0 !important;
          }
          #skills > div:nth-child(3) > div:last-child {
            border-bottom: none !important;
          }
        }
        @media (prefers-reduced-motion: reduce) {
          #skills *, #skills *::before { animation: none !important; transition: none !important; }
        }
      `}</style>
    </section>
  );
};

export default EnhancedSkillsSection;
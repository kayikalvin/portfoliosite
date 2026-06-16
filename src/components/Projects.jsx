/**
 * KALVIN KAYI — PROJECTS GRID
 * Design system: "Machine Precision / Human Warmth"
 *
 * Changes in this pass:
 *  - Grid now has real breathing room (24px gap, not 2px hairlines)
 *  - Cards reveal in capped batches instead of all 12+ firing at once
 *  - "Load more" control appends the next batch + re-triggers stagger
 */

import { Link } from "react-router-dom";
import { ExternalLink, Github, BookOpen, ArrowUpRight, Plus } from "lucide-react";
import { projects as staticProjects } from "../utils/utils";
import { useEffect, useState, useRef } from "react";

const PAGE_SIZE = 6;

/* ─────────────────────────────────────────────
   SKELETON
───────────────────────────────────────────── */
function ProjectSkeleton() {
  return (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(400px, 1fr))", gap: 24 }}>
      {[0, 1, 2].map((i) => (
        <div
          key={i}
          style={{
            border: "1px solid #1a1a1a",
            borderRadius: 16,
            background: "#0d0d0d",
            padding: "32px 28px",
            height: 340,
            display: "flex",
            flexDirection: "column",
            gap: 16,
            animation: "shimmer 1.6s ease-in-out infinite",
          }}
        >
          <div style={{ height: 20, width: "60%", borderRadius: 4, background: "#1a1a1a" }} />
          <div style={{ height: 14, width: "90%", borderRadius: 4, background: "#1a1a1a" }} />
          <div style={{ height: 14, width: "75%", borderRadius: 4, background: "#1a1a1a" }} />
          <div style={{ display: "flex", gap: 8, marginTop: 8 }}>
            {[0, 1, 2].map((j) => (
              <div key={j} style={{ height: 24, width: 56, borderRadius: 20, background: "#1a1a1a" }} />
            ))}
          </div>
          <div style={{ marginTop: "auto", height: 1, background: "#1a1a1a" }} />
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <div style={{ display: "flex", gap: 8 }}>
              <div style={{ width: 32, height: 32, borderRadius: "50%", background: "#1a1a1a" }} />
              <div style={{ width: 32, height: 32, borderRadius: "50%", background: "#1a1a1a" }} />
            </div>
            <div style={{ width: 72, height: 32, borderRadius: 20, background: "#1a1a1a" }} />
          </div>
        </div>
      ))}
    </div>
  );
}

/* ─────────────────────────────────────────────
   ICON BUTTON (GitHub / ExternalLink)
───────────────────────────────────────────── */
function IconBtn({ href, icon: Icon, label }) {
  const [hov, setHov] = useState(false);
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      title={label}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        width: 34,
        height: 34,
        borderRadius: "50%",
        border: `1px solid ${hov ? "#c8f241" : "#1f1f1f"}`,
        background: "none",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        textDecoration: "none",
        transition: "border-color 0.2s",
        flexShrink: 0,
      }}
    >
      <Icon size={14} color={hov ? "#c8f241" : "#6b6b6b"} style={{ transition: "color 0.2s" }} />
    </a>
  );
}

/* ─────────────────────────────────────────────
   PROJECT CARD
───────────────────────────────────────────── */
function ProjectCard({ project, index, visible }) {
  const [hov, setHov] = useState(false);
  const status = project.status || "active";

  const statusColor =
    status === "active"      ? "#c8f241" :
    status === "completed"   ? "#f0ede6" :
    status === "in progress" ? "#c8f241" : "#6b6b6b";

  // index here is position WITHIN its batch, so stagger always restarts
  // at a believable speed instead of compounding across 20 cards.
  const delay = (index % PAGE_SIZE) * 0.08;

  return (
    <div
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        border: `1px solid ${hov ? "#c8f241" : "#1a1a1a"}`,
        borderRadius: 16,
        background: hov ? "#0f0f0f" : "#0d0d0d",
        padding: "32px 28px",
        display: "flex",
        flexDirection: "column",
        position: "relative",
        overflow: "hidden",
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(28px)",
        transition: `opacity 0.6s ease ${delay}s, transform 0.6s ease ${delay}s, border-color 0.2s, background 0.2s`,
      }}
    >
      {/* Corner glow */}
      <div style={{
        position: "absolute",
        top: -48,
        right: -48,
        width: 140,
        height: 140,
        borderRadius: "50%",
        background: "radial-gradient(circle, rgba(200,242,65,0.1), transparent 70%)",
        opacity: hov ? 1 : 0,
        transition: "opacity 0.3s ease",
        pointerEvents: "none",
      }} />

      {/* Status badge */}
      <div style={{
        position: "absolute",
        top: 20,
        right: 20,
        fontFamily: "'DM Mono', monospace",
        fontSize: 10,
        letterSpacing: "0.1em",
        textTransform: "uppercase",
        color: statusColor,
        padding: "4px 10px",
        borderRadius: 20,
        border: `1px solid ${statusColor === "#c8f241" ? "rgba(200,242,65,0.25)" : "rgba(240,237,230,0.15)"}`,
        background: statusColor === "#c8f241" ? "rgba(200,242,65,0.06)" : "rgba(255,255,255,0.03)",
      }}>
        {status}
      </div>

      {/* Title */}
      <h3 style={{
        fontFamily: "'DM Serif Display', serif",
        fontSize: "clamp(1.2rem, 2vw, 1.5rem)",
        fontWeight: 400,
        color: hov ? "#f0ede6" : "#d0d0d0",
        lineHeight: 1.2,
        marginBottom: 12,
        marginTop: 8,
        paddingRight: 64,
        transition: "color 0.2s",
      }}>
        {project.title}
      </h3>

      {/* Description */}
      <p style={{
        fontFamily: "'DM Sans', sans-serif",
        fontSize: 14,
        lineHeight: 1.7,
        color: "#6b6b6b",
        marginBottom: 24,
        display: "-webkit-box",
        WebkitLineClamp: 3,
        WebkitBoxOrient: "vertical",
        overflow: "hidden",
      }}>
        {project.description}
      </p>

      {/* Tech pills */}
      <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 28 }}>
        {project.tech?.slice(0, 4).map((tech, i) => (
          <span
            key={i}
            style={{
              fontFamily: "'DM Mono', monospace",
              fontSize: 10,
              letterSpacing: "0.06em",
              color: "#a0a0a0",
              padding: "5px 11px",
              border: "1px solid #1f1f1f",
              borderRadius: 20,
              background: "rgba(255,255,255,0.02)",
            }}
          >
            {tech}
          </span>
        ))}
        {project.tech?.length > 4 && (
          <span style={{ fontFamily: "'DM Mono', monospace", fontSize: 10, letterSpacing: "0.06em", color: "#3a3a3a", padding: "5px 11px", border: "1px solid #1a1a1a", borderRadius: 20 }}>
            +{project.tech.length - 4}
          </span>
        )}
      </div>

      {/* Metrics row */}
      {(project.metrics?.stars || project.stats?.contributors) && (
        <div style={{ display: "flex", gap: 20, marginBottom: 20 }}>
          {project.metrics?.stars && (
            <span style={{ fontFamily: "'DM Mono', monospace", fontSize: 11, color: "#6b6b6b" }}>
              ★ {project.metrics.stars}
            </span>
          )}
          {project.stats?.contributors && (
            <span style={{ fontFamily: "'DM Mono', monospace", fontSize: 11, color: "#6b6b6b" }}>
              👥 {project.stats.contributors}
            </span>
          )}
        </div>
      )}

      {/* Actions */}
      <div style={{
        marginTop: "auto",
        paddingTop: 20,
        borderTop: "1px solid #1a1a1a",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        gap: 12,
      }}>
        <div style={{ display: "flex", gap: 8 }}>
          {project.code && <IconBtn href={project.code} icon={Github}       label="Source code" />}
          {project.url  && <IconBtn href={project.url}  icon={ExternalLink} label="Live demo"   />}
        </div>

        <DocsLink to={`/projects/${encodeURIComponent(project.title)}/docs`} />
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────
   DOCS LINK BUTTON
───────────────────────────────────────────── */
function DocsLink({ to }) {
  const [hov, setHov] = useState(false);
  return (
    <Link
      to={to}
      title="View documentation"
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 6,
        fontFamily: "'DM Mono', monospace",
        fontSize: 11,
        letterSpacing: "0.08em",
        textTransform: "uppercase",
        color: hov ? "#c8f241" : "#6b6b6b",
        textDecoration: "none",
        padding: "8px 16px",
        border: `1px solid ${hov ? "#c8f241" : "#1f1f1f"}`,
        borderRadius: 40,
        transition: "color 0.2s, border-color 0.2s",
        flexShrink: 0,
      }}
    >
      <BookOpen size={12} />
      Docs
      <ArrowUpRight size={11} />
    </Link>
  );
}

/* ─────────────────────────────────────────────
   LOAD MORE BUTTON
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
          display: "inline-flex",
          alignItems: "center",
          gap: 10,
          fontFamily: "'DM Sans', sans-serif",
          fontSize: 14,
          letterSpacing: "0.02em",
          color: hov ? "#0a0a0a" : "#f0ede6",
          background: hov ? "#c8f241" : "transparent",
          padding: "14px 30px",
          borderRadius: 40,
          border: `1.5px solid ${hov ? "#c8f241" : "#2a2a2a"}`,
          cursor: "pointer",
          transition: "background 0.25s ease, color 0.25s ease, border-color 0.25s ease",
        }}
      >
        <Plus size={16} />
        Show more
        <span style={{
          fontFamily: "'DM Mono', monospace",
          fontSize: 11,
          color: hov ? "#0a0a0a" : "#6b6b6b",
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
    <div style={{ textAlign: "center", padding: "8vh 0" }}>
      <p style={{ fontFamily: "'DM Mono', monospace", fontSize: 11, letterSpacing: "0.15em", color: "#c8f241", textTransform: "uppercase", marginBottom: 20 }}>
        Nothing here yet
      </p>
      <h3 style={{ fontFamily: "'DM Serif Display', serif", fontSize: "clamp(1.5rem, 3vw, 2.5rem)", fontWeight: 400, color: "#f0ede6", lineHeight: 1.2, marginBottom: 16 }}>
        Projects <span style={{ fontStyle: "italic" }}>incoming</span>
      </h3>
      <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 14, color: "#6b6b6b", maxWidth: 360, margin: "0 auto", lineHeight: 1.7 }}>
        Work will appear here as it's published. Check GitHub for the latest builds.
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

  /* Fetch */
  useEffect(() => {
    let mounted = true;
    setLoading(true);
    const t = setTimeout(() => {
      fetch("http://localhost:4000/api/projects")
        .then((r) => { if (!r.ok) throw new Error(); return r.json(); })
        .then((data) => { if (mounted && Array.isArray(data) && data.length) setProjects(data); })
        .catch(() => {})
        .finally(() => mounted && setLoading(false));
    }, 500);
    return () => { mounted = false; clearTimeout(t); };
  }, []);

  /* Scroll visibility */
  useEffect(() => {
    const obs = new IntersectionObserver(
      ([e]) => e.isIntersecting && setVisible(true),
      { threshold: 0.05 }
    );
    if (gridRef.current) obs.observe(gridRef.current);
    return () => obs.disconnect();
  }, [loading]);

  const visibleProjects = projects.slice(0, count);
  const remaining = projects.length - visibleProjects.length;

  // Re-arm the reveal animation for the newly appended batch only.
  const handleLoadMore = () => {
    setCount((c) => Math.min(c + PAGE_SIZE, projects.length));
  };

  return (
    <div ref={gridRef}>
      {loading ? (
        <ProjectSkeleton />
      ) : projects.length === 0 ? (
        <EmptyState />
      ) : (
        <>
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(400px, 1fr))",
            gap: 24,
          }}>
            {visibleProjects.map((project, i) => (
              <ProjectCard
                key={project.id || project.title || i}
                project={project}
                index={i}
                visible={visible}
              />
            ))}
          </div>

          {remaining > 0 && (
            <LoadMoreBtn onClick={handleLoadMore} remaining={remaining} />
          )}
        </>
      )}

      <style>{`
        @keyframes shimmer {
          0%,100% { opacity: 1; }
          50%      { opacity: 0.5; }
        }
        a, button { cursor: none !important; }
        @media (prefers-reduced-motion: reduce) {
          * { animation-duration: 0.01ms !important; transition-duration: 0.01ms !important; }
        }
      `}</style>
    </div>
  );
};

export default Projects;








































// import { Link } from "react-router-dom";
// import { ExternalLink, Github, BookOpen, Sparkles, Clock, TrendingUp, Eye } from "lucide-react";
// import { projects as staticProjects } from "../utils/utils";
// import { useEffect, useState, useRef } from "react";

// const Projects = () => {
//   const [projects, setProjects] = useState(staticProjects || []);
//   const [loading, setLoading] = useState(true);
//   const [hoveredIndex, setHoveredIndex] = useState(null);
//   const projectRefs = useRef([]);

//   useEffect(() => {
//     let mounted = true;
//     setLoading(true);
    
//     // Simulate API delay for better UX
//     const fetchTimer = setTimeout(() => {
//       fetch("http://localhost:4000/api/projects")
//         .then((r) => {
//           if (!r.ok) throw new Error('Network error');
//           return r.json();
//         })
//         .then((data) => {
//           if (mounted && Array.isArray(data) && data.length) {
//             setProjects(data);
//           }
//         })
//         .catch(() => {
//           console.log("Using static projects as fallback");
//         })
//         .finally(() => mounted && setLoading(false));
//     }, 500);

//     return () => {
//       mounted = false;
//       clearTimeout(fetchTimer);
//     };
//   }, []);

//   // Animation on scroll
//   useEffect(() => {
//     const observer = new IntersectionObserver(
//       (entries) => {
//         entries.forEach((entry) => {
//           if (entry.isIntersecting) {
//             entry.target.classList.add('animate-fade-up');
//           }
//         });
//       },
//       { threshold: 0.1, rootMargin: '0px 0px -50px 0px' }
//     );

//     projectRefs.current.forEach((ref) => {
//       if (ref) observer.observe(ref);
//     });

//     return () => observer.disconnect();
//   }, [projects]);

//   const ProjectSkeleton = () => (
//     <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
//       {[1, 2, 3].map((i) => (
//         <div
//           key={i}
//           className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-gray-900/50 to-gray-800/50 border border-white/10 animate-pulse"
//         >
//           <div className="p-6 flex flex-col h-[380px]">
//             <div className="h-7 bg-gray-700/50 rounded-lg mb-4 w-3/4"></div>
//             <div className="space-y-2 mb-6">
//               <div className="h-4 bg-gray-700/50 rounded w-full"></div>
//               <div className="h-4 bg-gray-700/50 rounded w-5/6"></div>
//               <div className="h-4 bg-gray-700/50 rounded w-4/6"></div>
//             </div>
//             <div className="flex flex-wrap gap-2 mb-6">
//               {[1, 2, 3].map((j) => (
//                 <div key={j} className="h-6 bg-gray-700/50 rounded-full w-16"></div>
//               ))}
//             </div>
//             <div className="mt-auto flex justify-between">
//               <div className="flex gap-2">
//                 {[1, 2].map((k) => (
//                   <div key={k} className="h-10 w-10 bg-gray-700/50 rounded-full"></div>
//                 ))}
//               </div>
//               <div className="h-10 w-10 bg-gray-700/50 rounded-full"></div>
//             </div>
//           </div>
//         </div>
//       ))}
//     </div>
//   );

//   const getStatusColor = (status) => {
//     switch (status?.toLowerCase()) {
//       case 'active':
//         return 'bg-green-500/20 text-green-400 border-green-500/30';
//       case 'completed':
//         return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
//       case 'archived':
//         return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
//       case 'in progress':
//         return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
//       default:
//         return 'bg-purple-500/20 text-purple-400 border-purple-500/30';
//     }
//   };

//   return (
//     <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//       {/* Enhanced Header */}
//       <div className="text-center mb-16 relative">
//         <div className="inline-flex items-center gap-3 mb-4 px-4 py-2 rounded-full bg-gradient-to-r from-cyan-500/10 to-purple-500/10 border border-white/10 backdrop-blur-sm">
//           <Sparkles size={18} className="text-cyan-400" />
//           <span className="text-sm text-gray-300 font-medium">Portfolio Showcase</span>
//         </div>
        
//         <h2 className="text-4xl md:text-6xl font-bold mb-6 tracking-tight">
//           <span className="bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
//             Featured Projects
//           </span>
//         </h2>
        
//         <p className="text-gray-300 text-lg md:text-xl max-w-3xl mx-auto leading-relaxed">
//           Real-world applications showcasing the power of data-driven web engineering 
//           and innovative problem-solving.
//         </p>
        
//         <div className="flex items-center justify-center gap-6 mt-8">
//           <div className="flex items-center gap-2 text-sm text-gray-400">
//             <Clock size={16} />
//             <span>Updated recently</span>
//           </div>
//           <div className="h-6 w-px bg-gray-700"></div>
//           <div className="flex items-center gap-2 text-sm text-gray-400">
//             <TrendingUp size={16} />
//             <span>Production ready</span>
//           </div>
//           <div className="h-6 w-px bg-gray-700"></div>
//           <div className="flex items-center gap-2 text-sm text-gray-400">
//             <Eye size={16} />
//             <span>Interactive demos</span>
//           </div>
//         </div>
//       </div>

//       {loading ? (
//         <ProjectSkeleton />
//       ) : (
//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//           {projects.map((project, index) => {
//             const gradient = project.gradient || 'from-cyan-500/20 to-purple-500/20';
//             const status = project.status || 'active';
            
//             return (
//               <div
//                 key={project.id || index}
//                 ref={(el) => (projectRefs.current[index] = el)}
//                 className="group relative overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-br from-gray-900/40 to-black/40 backdrop-blur-sm transition-all duration-500 hover:border-white/20 hover:scale-[1.02] hover:shadow-2xl hover:shadow-purple-500/10"
//                 onMouseEnter={() => setHoveredIndex(index)}
//                 onMouseLeave={() => setHoveredIndex(null)}
//                 style={{
//                   transform: hoveredIndex === index ? 'translateY(-8px)' : 'translateY(0)',
//                 }}
//               >
//                 {/* Animated gradient overlay */}
//                 <div 
//                   className={`absolute inset-0 bg-gradient-to-r ${gradient} opacity-0 group-hover:opacity-10 transition-opacity duration-500`}
//                 />
                
//                 {/* Glow effect */}
//                 <div className="absolute -inset-0.5 bg-gradient-to-r from-cyan-500/0 via-purple-500/0 to-pink-500/0 group-hover:from-cyan-500/10 group-hover:via-purple-500/10 group-hover:to-pink-500/10 rounded-2xl blur-xl transition-all duration-500" />
                
//                 {/* Status badge */}
//                 <div className="absolute top-4 right-4 z-10">
//                   <span className={`px-3 py-1 rounded-full text-xs font-medium border backdrop-blur-sm ${getStatusColor(status)}`}>
//                     {status}
//                   </span>
//                 </div>

//                 <div className="relative p-6 flex flex-col h-full">
//                   {/* Project type icon */}
//                   <div className="mb-6">
//                     <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-cyan-500/20 to-purple-500/20 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
//                       {project.icon || <Sparkles size={24} className="text-cyan-400" />}
//                     </div>
//                   </div>

//                   <div className="flex-1">
//                     <h3 className="text-xl font-bold mb-3 text-white group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-cyan-400 group-hover:to-purple-400 group-hover:bg-clip-text transition-all duration-300">
//                       {project.title}
//                     </h3>
                    
//                     <p className="text-gray-300 text-sm mb-6 leading-relaxed line-clamp-3">
//                       {project.description}
//                     </p>

//                     {/* Tech stack */}
//                     <div className="flex flex-wrap gap-2 mb-6">
//                       {project.tech?.slice(0, 4).map((tech, techIndex) => (
//                         <span
//                           key={techIndex}
//                           className="px-3 py-1.5 rounded-full bg-white/5 text-xs font-medium text-gray-200 border border-white/10 hover:bg-gradient-to-r hover:from-cyan-500 hover:to-purple-500 hover:text-white hover:border-transparent transition-all duration-300 cursor-pointer backdrop-blur-sm"
//                           title={tech}
//                         >
//                           {tech}
//                         </span>
//                       ))}
//                       {project.tech?.length > 4 && (
//                         <span className="px-3 py-1.5 rounded-full bg-white/5 text-xs font-medium text-gray-400 border border-white/10">
//                           +{project.tech.length - 4} more
//                         </span>
//                       )}
//                     </div>

//                     {/* Metrics (if available) */}
//                     {(project.metrics || project.stats) && (
//                       <div className="flex items-center gap-4 mb-6 text-sm text-gray-400">
//                         {project.metrics?.stars && (
//                           <div className="flex items-center gap-1">
//                             <span className="text-yellow-400">★</span>
//                             <span>{project.metrics.stars}</span>
//                           </div>
//                         )}
//                         {project.stats?.contributors && (
//                           <div className="flex items-center gap-1">
//                             <span className="text-cyan-400">👥</span>
//                             <span>{project.stats.contributors}</span>
//                           </div>
//                         )}
//                       </div>
//                     )}
//                   </div>

//                   {/* Action buttons */}
//                   <div className="flex justify-between items-center pt-6 border-t border-white/10">
//                     <div className="flex gap-3">
//                       {project.code && (
//                         <a
//                           href={project.code}
//                           target="_blank"
//                           rel="noopener noreferrer"
//                           className="relative p-2.5 rounded-full bg-white/5 border border-white/10 hover:bg-gradient-to-r hover:from-cyan-500 hover:to-purple-500 hover:border-transparent transition-all duration-300 group/btn"
//                           title="View Source Code"
//                         >
//                           <Github
//                             size={18}
//                             className="text-gray-200 group-hover/btn:text-white transition-colors duration-300"
//                           />
//                           <span className="absolute -top-8 left-1/2 -translate-x-1/2 px-2 py-1 bg-gray-900 text-xs text-white rounded opacity-0 group-hover/btn:opacity-100 transition-opacity duration-300 whitespace-nowrap">
//                             Source Code
//                           </span>
//                         </a>
//                       )}

//                       {project.url && (
//                         <a
//                           href={project.url}
//                           target="_blank"
//                           rel="noopener noreferrer"
//                           className="relative p-2.5 rounded-full bg-white/5 border border-white/10 hover:bg-gradient-to-r hover:from-purple-500 hover:to-pink-500 hover:border-transparent transition-all duration-300 group/btn"
//                           title="Live Demo"
//                         >
//                           <ExternalLink
//                             size={18}
//                             className="text-gray-200 group-hover/btn:text-white transition-colors duration-300"
//                           />
//                           <span className="absolute -top-8 left-1/2 -translate-x-1/2 px-2 py-1 bg-gray-900 text-xs text-white rounded opacity-0 group-hover/btn:opacity-100 transition-opacity duration-300 whitespace-nowrap">
//                             Live Demo
//                           </span>
//                         </a>
//                       )}
//                     </div>

//                     <Link
//                       to={`/projects/${encodeURIComponent(project.title)}/docs`}
//                       className="relative group/btn flex items-center gap-2 px-4 py-2.5 rounded-full bg-gradient-to-r from-green-500/10 to-teal-500/10 border border-green-500/20 hover:from-green-500 hover:to-teal-500 hover:text-white hover:border-transparent transition-all duration-300"
//                       title="View Documentation"
//                     >
//                       <BookOpen
//                         size={16}
//                         className="text-green-400 group-hover/btn:text-white transition-colors duration-300"
//                       />
//                       <span className="text-sm font-medium text-green-400 group-hover/btn:text-white transition-colors duration-300">
//                         Docs
//                       </span>
//                       <span className="absolute -top-8 left-1/2 -translate-x-1/2 px-2 py-1 bg-gray-900 text-xs text-white rounded opacity-0 group-hover/btn:opacity-100 transition-opacity duration-300 whitespace-nowrap">
//                         View Documentation
//                       </span>
//                     </Link>
//                   </div>
//                 </div>
//               </div>
//             );
//           })}
//         </div>
//       )}

//       {/* Empty state */}
//       {!loading && projects.length === 0 && (
//         <div className="text-center py-16">
//           <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-gradient-to-r from-cyan-500/10 to-purple-500/10 flex items-center justify-center">
//             <Sparkles size={40} className="text-gray-400" />
//           </div>
//           <h3 className="text-2xl font-bold text-gray-300 mb-3">No Projects Found</h3>
//           <p className="text-gray-400 max-w-md mx-auto">
//             Projects will be displayed here once they're added. In the meantime, check out my GitHub for recent work.
//           </p>
//         </div>
//       )}

//       {/* View more link */}
//       {/* {projects.length > 0 && (
//         <div className="text-center mt-12 pt-8 border-t border-white/10">
//           <Link
//             to="/projects"
//             className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-white/5 border border-white/10 hover:bg-gradient-to-r hover:from-cyan-500/20 hover:to-purple-500/20 hover:border-white/20 transition-all duration-300 group"
//           >
//             <span className="text-gray-300 group-hover:text-white">View All Projects</span>
//             <ExternalLink size={16} className="text-gray-400 group-hover:text-cyan-400" />
//           </Link>
//         </div>
//       )} */}

//       {/* Add custom animation */}
//       <style jsx>{`
//         @keyframes fadeUp {
//           from {
//             opacity: 0;
//             transform: translateY(20px);
//           }
//           to {
//             opacity: 1;
//             transform: translateY(0);
//           }
//         }
//         .animate-fade-up {
//           animation: fadeUp 0.6s ease-out forwards;
//         }
//         .line-clamp-3 {
//           display: -webkit-box;
//           -webkit-line-clamp: 3;
//           -webkit-box-orient: vertical;
//           overflow: hidden;
//         }
//       `}</style>
//     </div>
//   );
// };

// export default Projects;
// import { Link } from "react-router-dom";
// import { ExternalLink, Github, BookOpen } from "lucide-react";
// import { projects as staticProjects } from "../utils/utils";
// import { useEffect, useState } from "react";

// const Projects = () => {
//   const [projects, setProjects] = useState(staticProjects || []);
//   const [loading, setLoading] = useState(false);

//   useEffect(() => {
//     let mounted = true;
//     setLoading(true);
//     fetch("http://localhost:4000/api/projects")
//       .then((r) => {
//         if (!r.ok) throw new Error('network');
//         return r.json();
//       })
//       .then((data) => {
//         if (mounted && Array.isArray(data) && data.length) setProjects(data);
//       })
//       .catch(() => {
//         // keep staticProjects as fallback
//       })
//       .finally(() => mounted && setLoading(false));
//     return () => (mounted = false);
//   }, []);

//   return (
//     <div className="max-w-6xl mx-auto">
//       <div className="text-center mb-16">
//         <h2 className="text-4xl md:text-5xl font-bold mb-4">
//           <span className="bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text text-transparent">
//             Featured Projects
//           </span>
//         </h2>
//         <p className="text-gray-400 max-w-2xl mx-auto">
//           Real-world applications showcasing the power of data-driven web
//           engineering.
//         </p>
//         <div className="h-1 w-20 bg-gradient-to-r from-pink-500 to-purple-500 rounded-full mx-auto mt-4 animate-pulse"></div>
//       </div>

//       <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
//         {(projects || []).map((project, index) => (
//           <div
//             key={index}
//             className="relative overflow-hidden rounded-2xl bg-white/5 border border-white/10 hover:scale-[1.02] transition-transform duration-300"
//           >
//             {/* Gradient overlay */}
//             <div
//               className={`absolute inset-0 bg-gradient-to-r ${project.gradient} opacity-20`}
//             />

//             <div className="relative p-6 flex flex-col h-full justify-between">
//               <div>
//                 <h3 className="text-xl font-bold mb-3">{project.title}</h3>
//                 <p className="text-gray-300 text-sm mb-4 leading-relaxed">
//                   {project.description}
//                 </p>
//               </div>

//               <div className="flex flex-wrap gap-2 mb-4">
//                 {project.tech.map((tech, techIndex) => (
//                   <span
//                     key={techIndex}
//                     className="px-2 py-1 rounded-full bg-white/10 text-sm text-gray-200 hover:bg-gradient-to-r hover:from-cyan-500 hover:to-purple-500 hover:text-black transition-all duration-300 cursor-pointer"
//                   >
//                     {tech}
//                   </span>
//                 ))}
//               </div>

//               <div className="flex justify-between mt-auto">
//                 <div className="flex space-x-2  items-center">
//                   {project.code && (
//                     <div className="group flex flex-col items-center">
//                       <a
//                         href={project.code}
//                         target="_blank"
//                         rel="noopener noreferrer"
//                         className="p-2 rounded-full bg-white/10 hover:bg-gradient-to-r hover:from-cyan-500 hover:to-purple-500 transition-all duration-300"
//                       >
//                         <Github
//                           size={20}
//                           className="text-gray-200 group-hover:text-black transition-colors duration-300"
//                         />
//                       </a>
//                       <span className="mt-4 text-xs font-bold text-gray-100 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
//                         Code
//                       </span>
//                     </div>
//                   )}

//                   {project.url && (
//                     <div className="group flex flex-col items-center">
//                       <a
//                         href={project.url}
//                         target="_blank"
//                         rel="noopener noreferrer"
//                         className="p-2 rounded-full bg-white/10 hover:bg-gradient-to-r hover:from-cyan-500 hover:to-purple-500 transition-all duration-300"
//                       >
//                         <ExternalLink
//                           size={20}
//                           className="text-gray-200 group-hover:text-black transition-colors duration-300"
//                         />
//                       </a>
//                       <span className="mt-4 text-sm font-bold text-gray-100 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
//                         Live
//                       </span>
//                     </div>
//                   )}
//                 </div>

//                 {/* NEW View Docs link */}
//                 <div className="group flex flex-col items-center">
//                   <Link
//                     to={`/projects/${encodeURIComponent(project.title)}/docs`}
//                     className="p-2 rounded-full bg-white/10 hover:bg-gradient-to-r hover:from-green-500 hover:to-teal-500 transition-all duration-300"
//                   >
//                     <BookOpen
//                       size={20}
//                       className="text-gray-200 group-hover:text-black transition-colors duration-300"
//                     />
//                   </Link>

//                   <span className="mt-4 text-xs font-bold text-gray-100 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
//                     View Docs
//                   </span>
//                 </div>
//               </div>
//             </div>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// };

// export default Projects;

import { Link } from "react-router-dom";
import { ExternalLink, Github, BookOpen, Sparkles, Clock, TrendingUp, Eye } from "lucide-react";
import { projects as staticProjects } from "../utils/utils";
import { useEffect, useState, useRef } from "react";

const Projects = () => {
  const [projects, setProjects] = useState(staticProjects || []);
  const [loading, setLoading] = useState(true);
  const [hoveredIndex, setHoveredIndex] = useState(null);
  const projectRefs = useRef([]);

  useEffect(() => {
    let mounted = true;
    setLoading(true);
    
    // Simulate API delay for better UX
    const fetchTimer = setTimeout(() => {
      fetch("http://localhost:4000/api/projects")
        .then((r) => {
          if (!r.ok) throw new Error('Network error');
          return r.json();
        })
        .then((data) => {
          if (mounted && Array.isArray(data) && data.length) {
            setProjects(data);
          }
        })
        .catch(() => {
          console.log("Using static projects as fallback");
        })
        .finally(() => mounted && setLoading(false));
    }, 500);

    return () => {
      mounted = false;
      clearTimeout(fetchTimer);
    };
  }, []);

  // Animation on scroll
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('animate-fade-up');
          }
        });
      },
      { threshold: 0.1, rootMargin: '0px 0px -50px 0px' }
    );

    projectRefs.current.forEach((ref) => {
      if (ref) observer.observe(ref);
    });

    return () => observer.disconnect();
  }, [projects]);

  const ProjectSkeleton = () => (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
      {[1, 2, 3].map((i) => (
        <div
          key={i}
          className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-gray-900/50 to-gray-800/50 border border-white/10 animate-pulse"
        >
          <div className="p-6 flex flex-col h-[380px]">
            <div className="h-7 bg-gray-700/50 rounded-lg mb-4 w-3/4"></div>
            <div className="space-y-2 mb-6">
              <div className="h-4 bg-gray-700/50 rounded w-full"></div>
              <div className="h-4 bg-gray-700/50 rounded w-5/6"></div>
              <div className="h-4 bg-gray-700/50 rounded w-4/6"></div>
            </div>
            <div className="flex flex-wrap gap-2 mb-6">
              {[1, 2, 3].map((j) => (
                <div key={j} className="h-6 bg-gray-700/50 rounded-full w-16"></div>
              ))}
            </div>
            <div className="mt-auto flex justify-between">
              <div className="flex gap-2">
                {[1, 2].map((k) => (
                  <div key={k} className="h-10 w-10 bg-gray-700/50 rounded-full"></div>
                ))}
              </div>
              <div className="h-10 w-10 bg-gray-700/50 rounded-full"></div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'active':
        return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'completed':
        return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      case 'archived':
        return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
      case 'in progress':
        return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      default:
        return 'bg-purple-500/20 text-purple-400 border-purple-500/30';
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Enhanced Header */}
      <div className="text-center mb-16 relative">
        <div className="inline-flex items-center gap-3 mb-4 px-4 py-2 rounded-full bg-gradient-to-r from-cyan-500/10 to-purple-500/10 border border-white/10 backdrop-blur-sm">
          <Sparkles size={18} className="text-cyan-400" />
          <span className="text-sm text-gray-300 font-medium">Portfolio Showcase</span>
        </div>
        
        <h2 className="text-4xl md:text-6xl font-bold mb-6 tracking-tight">
          <span className="bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
            Featured Projects
          </span>
        </h2>
        
        <p className="text-gray-300 text-lg md:text-xl max-w-3xl mx-auto leading-relaxed">
          Real-world applications showcasing the power of data-driven web engineering 
          and innovative problem-solving.
        </p>
        
        <div className="flex items-center justify-center gap-6 mt-8">
          <div className="flex items-center gap-2 text-sm text-gray-400">
            <Clock size={16} />
            <span>Updated recently</span>
          </div>
          <div className="h-6 w-px bg-gray-700"></div>
          <div className="flex items-center gap-2 text-sm text-gray-400">
            <TrendingUp size={16} />
            <span>Production ready</span>
          </div>
          <div className="h-6 w-px bg-gray-700"></div>
          <div className="flex items-center gap-2 text-sm text-gray-400">
            <Eye size={16} />
            <span>Interactive demos</span>
          </div>
        </div>
      </div>

      {loading ? (
        <ProjectSkeleton />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project, index) => {
            const gradient = project.gradient || 'from-cyan-500/20 to-purple-500/20';
            const status = project.status || 'active';
            
            return (
              <div
                key={project.id || index}
                ref={(el) => (projectRefs.current[index] = el)}
                className="group relative overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-br from-gray-900/40 to-black/40 backdrop-blur-sm transition-all duration-500 hover:border-white/20 hover:scale-[1.02] hover:shadow-2xl hover:shadow-purple-500/10"
                onMouseEnter={() => setHoveredIndex(index)}
                onMouseLeave={() => setHoveredIndex(null)}
                style={{
                  transform: hoveredIndex === index ? 'translateY(-8px)' : 'translateY(0)',
                }}
              >
                {/* Animated gradient overlay */}
                <div 
                  className={`absolute inset-0 bg-gradient-to-r ${gradient} opacity-0 group-hover:opacity-10 transition-opacity duration-500`}
                />
                
                {/* Glow effect */}
                <div className="absolute -inset-0.5 bg-gradient-to-r from-cyan-500/0 via-purple-500/0 to-pink-500/0 group-hover:from-cyan-500/10 group-hover:via-purple-500/10 group-hover:to-pink-500/10 rounded-2xl blur-xl transition-all duration-500" />
                
                {/* Status badge */}
                <div className="absolute top-4 right-4 z-10">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium border backdrop-blur-sm ${getStatusColor(status)}`}>
                    {status}
                  </span>
                </div>

                <div className="relative p-6 flex flex-col h-full">
                  {/* Project type icon */}
                  <div className="mb-6">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-cyan-500/20 to-purple-500/20 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                      {project.icon || <Sparkles size={24} className="text-cyan-400" />}
                    </div>
                  </div>

                  <div className="flex-1">
                    <h3 className="text-xl font-bold mb-3 text-white group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-cyan-400 group-hover:to-purple-400 group-hover:bg-clip-text transition-all duration-300">
                      {project.title}
                    </h3>
                    
                    <p className="text-gray-300 text-sm mb-6 leading-relaxed line-clamp-3">
                      {project.description}
                    </p>

                    {/* Tech stack */}
                    <div className="flex flex-wrap gap-2 mb-6">
                      {project.tech?.slice(0, 4).map((tech, techIndex) => (
                        <span
                          key={techIndex}
                          className="px-3 py-1.5 rounded-full bg-white/5 text-xs font-medium text-gray-200 border border-white/10 hover:bg-gradient-to-r hover:from-cyan-500 hover:to-purple-500 hover:text-white hover:border-transparent transition-all duration-300 cursor-pointer backdrop-blur-sm"
                          title={tech}
                        >
                          {tech}
                        </span>
                      ))}
                      {project.tech?.length > 4 && (
                        <span className="px-3 py-1.5 rounded-full bg-white/5 text-xs font-medium text-gray-400 border border-white/10">
                          +{project.tech.length - 4} more
                        </span>
                      )}
                    </div>

                    {/* Metrics (if available) */}
                    {(project.metrics || project.stats) && (
                      <div className="flex items-center gap-4 mb-6 text-sm text-gray-400">
                        {project.metrics?.stars && (
                          <div className="flex items-center gap-1">
                            <span className="text-yellow-400">★</span>
                            <span>{project.metrics.stars}</span>
                          </div>
                        )}
                        {project.stats?.contributors && (
                          <div className="flex items-center gap-1">
                            <span className="text-cyan-400">👥</span>
                            <span>{project.stats.contributors}</span>
                          </div>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Action buttons */}
                  <div className="flex justify-between items-center pt-6 border-t border-white/10">
                    <div className="flex gap-3">
                      {project.code && (
                        <a
                          href={project.code}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="relative p-2.5 rounded-full bg-white/5 border border-white/10 hover:bg-gradient-to-r hover:from-cyan-500 hover:to-purple-500 hover:border-transparent transition-all duration-300 group/btn"
                          title="View Source Code"
                        >
                          <Github
                            size={18}
                            className="text-gray-200 group-hover/btn:text-white transition-colors duration-300"
                          />
                          <span className="absolute -top-8 left-1/2 -translate-x-1/2 px-2 py-1 bg-gray-900 text-xs text-white rounded opacity-0 group-hover/btn:opacity-100 transition-opacity duration-300 whitespace-nowrap">
                            Source Code
                          </span>
                        </a>
                      )}

                      {project.url && (
                        <a
                          href={project.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="relative p-2.5 rounded-full bg-white/5 border border-white/10 hover:bg-gradient-to-r hover:from-purple-500 hover:to-pink-500 hover:border-transparent transition-all duration-300 group/btn"
                          title="Live Demo"
                        >
                          <ExternalLink
                            size={18}
                            className="text-gray-200 group-hover/btn:text-white transition-colors duration-300"
                          />
                          <span className="absolute -top-8 left-1/2 -translate-x-1/2 px-2 py-1 bg-gray-900 text-xs text-white rounded opacity-0 group-hover/btn:opacity-100 transition-opacity duration-300 whitespace-nowrap">
                            Live Demo
                          </span>
                        </a>
                      )}
                    </div>

                    <Link
                      to={`/projects/${encodeURIComponent(project.title)}/docs`}
                      className="relative group/btn flex items-center gap-2 px-4 py-2.5 rounded-full bg-gradient-to-r from-green-500/10 to-teal-500/10 border border-green-500/20 hover:from-green-500 hover:to-teal-500 hover:text-white hover:border-transparent transition-all duration-300"
                      title="View Documentation"
                    >
                      <BookOpen
                        size={16}
                        className="text-green-400 group-hover/btn:text-white transition-colors duration-300"
                      />
                      <span className="text-sm font-medium text-green-400 group-hover/btn:text-white transition-colors duration-300">
                        Docs
                      </span>
                      <span className="absolute -top-8 left-1/2 -translate-x-1/2 px-2 py-1 bg-gray-900 text-xs text-white rounded opacity-0 group-hover/btn:opacity-100 transition-opacity duration-300 whitespace-nowrap">
                        View Documentation
                      </span>
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Empty state */}
      {!loading && projects.length === 0 && (
        <div className="text-center py-16">
          <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-gradient-to-r from-cyan-500/10 to-purple-500/10 flex items-center justify-center">
            <Sparkles size={40} className="text-gray-400" />
          </div>
          <h3 className="text-2xl font-bold text-gray-300 mb-3">No Projects Found</h3>
          <p className="text-gray-400 max-w-md mx-auto">
            Projects will be displayed here once they're added. In the meantime, check out my GitHub for recent work.
          </p>
        </div>
      )}

      {/* View more link */}
      {/* {projects.length > 0 && (
        <div className="text-center mt-12 pt-8 border-t border-white/10">
          <Link
            to="/projects"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-white/5 border border-white/10 hover:bg-gradient-to-r hover:from-cyan-500/20 hover:to-purple-500/20 hover:border-white/20 transition-all duration-300 group"
          >
            <span className="text-gray-300 group-hover:text-white">View All Projects</span>
            <ExternalLink size={16} className="text-gray-400 group-hover:text-cyan-400" />
          </Link>
        </div>
      )} */}

      {/* Add custom animation */}
      <style jsx>{`
        @keyframes fadeUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fade-up {
          animation: fadeUp 0.6s ease-out forwards;
        }
        .line-clamp-3 {
          display: -webkit-box;
          -webkit-line-clamp: 3;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
      `}</style>
    </div>
  );
};

export default Projects;
import { useParams, Link } from "react-router-dom";
import { projects as staticProjects } from "../utils/utils";
import { useEffect, useState, useRef } from "react";
import { 
  Cast, 
  FileCode2, 
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
  Download,
  Copy,
  Check,
  Eye,
  Globe,
  Layers
} from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeHighlight from "rehype-highlight";
import "highlight.js/styles/github-dark.css";
import { motion, AnimatePresence } from "framer-motion";

const ProjectDocs = () => {
  const { projectId } = useParams();
  const decodedId = projectId ? decodeURIComponent(projectId) : '';
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('documentation');
  const [copied, setCopied] = useState(false);
  const contentRef = useRef(null);

  // Custom scroll to top when tab changes
  useEffect(() => {
    if (contentRef.current) {
      contentRef.current.scrollTop = 0;
    }
  }, [activeTab]);

  useEffect(() => {
    const foundProject = staticProjects.find((p) => p.title === decodedId);
    setProject(foundProject || null);
    
    let mounted = true;
    setLoading(true);
    
    // Simulate loading for better UX
    const timeoutId = setTimeout(() => {
      if (!projectId) {
        setLoading(false);
        return;
      }
      
      fetch(`http://localhost:4000/api/projects/${encodeURIComponent(decodedId)}`)
        .then((r) => {
          if (!r.ok) throw new Error('notfound');
          return r.json();
        })
        .then((data) => {
          if (mounted) setProject(data);
        })
        .catch(() => {
          console.log("Using static project data");
        })
        .finally(() => mounted && setLoading(false));
    }, 500);

    return () => {
      mounted = false;
      clearTimeout(timeoutId);
    };
  }, [projectId, decodedId]);

  // Copy code to clipboard
  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-gray-700 border-t-cyan-500 rounded-full animate-spin mx-auto mb-6"></div>
          <p className="text-gray-400">Loading project documentation...</p>
        </div>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black flex items-center justify-center">
        <div className="text-center max-w-md p-8 bg-white/5 border border-white/10 rounded-2xl backdrop-blur-sm">
          <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-to-r from-red-500/20 to-pink-500/20 flex items-center justify-center">
            <span className="text-4xl">🚨</span>
          </div>
          <h2 className="text-2xl font-bold text-white mb-3">Project Not Found</h2>
          <p className="text-gray-400 mb-6">
            The project you're looking for doesn't exist or has been moved.
          </p>
          <Link
            to="/"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-gradient-to-r from-cyan-500 to-purple-500 text-white font-medium hover:opacity-90 transition-opacity"
          >
            <ArrowLeft size={18} />
            Back to Home
          </Link>
        </div>
      </div>
    );
  }

  // Enhanced markdown components with better styling
  const markdownComponents = {
    h1: ({ children }) => (
      <motion.h1 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-3xl md:text-4xl font-bold text-white mb-6 pb-4 border-b border-white/10"
      >
        {children}
      </motion.h1>
    ),
    h2: ({ children }) => (
      <h2 className="text-2xl font-bold text-white mb-4 mt-8 flex items-center gap-2">
        <ChevronRight className="text-cyan-400" size={20} />
        {children}
      </h2>
    ),
    h3: ({ children }) => (
      <h3 className="text-xl font-semibold text-white mb-3 mt-6">
        {children}
      </h3>
    ),
    p: ({ children }) => (
      <p className="text-gray-300 mb-6 leading-relaxed">
        {children}
      </p>
    ),
    ul: ({ children }) => (
      <ul className="mb-6 space-y-2">
        {children}
      </ul>
    ),
    ol: ({ children }) => (
      <ol className="mb-6 space-y-2">
        {children}
      </ol>
    ),
    li: ({ children }) => (
      <li className="flex items-start gap-3 text-gray-300">
        <div className="mt-2 w-1.5 h-1.5 rounded-full bg-cyan-400 flex-shrink-0"></div>
        <span>{children}</span>
      </li>
    ),
    strong: ({ children }) => (
      <strong className="text-white font-semibold">
        {children}
      </strong>
    ),
    code: ({ children, className, inline }) => {
      if (inline) {
        return (
          <code className="bg-gray-800 text-gray-200 px-2 py-1 rounded text-sm font-mono border border-gray-700">
            {children}
          </code>
        );
      }
      
      const codeString = String(children).replace(/\n$/, '');
      return (
        <div className="relative group mb-6">
          <pre className="bg-gray-900 rounded-xl p-6 overflow-x-auto border border-gray-800">
            <code className={className}>{children}</code>
          </pre>
          <button
            onClick={() => copyToClipboard(codeString)}
            className="absolute top-4 right-4 px-3 py-2 rounded-lg bg-gray-800 text-gray-300 hover:bg-gray-700 hover:text-white transition-all opacity-0 group-hover:opacity-100 flex items-center gap-2"
          >
            {copied ? <Check size={16} /> : <Copy size={16} />}
            <span className="text-sm">{copied ? 'Copied!' : 'Copy'}</span>
          </button>
        </div>
      );
    },
    pre: ({ children }) => (
      <>{children}</>
    ),
    blockquote: ({ children }) => (
      <blockquote className="border-l-4 border-cyan-500 pl-6 py-4 italic text-gray-300 bg-gradient-to-r from-cyan-500/10 to-transparent mb-6">
        {children}
      </blockquote>
    ),
    a: ({ children, href }) => (
      <a
        href={href}
        className="text-cyan-400 hover:text-cyan-300 underline hover:no-underline transition-colors inline-flex items-center gap-1"
        target="_blank"
        rel="noopener noreferrer"
      >
        {children}
        <ExternalLink size={14} />
      </a>
    ),
    table: ({ children }) => (
      <div className="overflow-x-auto mb-8 rounded-xl border border-gray-800">
        <table className="min-w-full">
          {children}
        </table>
      </div>
    ),
    thead: ({ children }) => (
      <thead className="bg-gradient-to-r from-gray-900 to-gray-800">
        {children}
      </thead>
    ),
    tbody: ({ children }) => (
      <tbody className="divide-y divide-gray-800">
        {children}
      </tbody>
    ),
    tr: ({ children }) => (
      <tr className="hover:bg-white/5 transition-colors">
        {children}
      </tr>
    ),
    th: ({ children }) => (
      <th className="px-6 py-4 text-left text-white font-semibold">
        {children}
      </th>
    ),
    td: ({ children }) => (
      <td className="px-6 py-4 text-gray-300">
        {children}
      </td>
    ),
    img: ({ src, alt }) => (
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="mb-8 rounded-2xl overflow-hidden border border-white/10 shadow-2xl"
      >
        <img
          src={src}
          alt={alt}
          className="w-full h-auto object-cover hover:scale-105 transition-transform duration-500 cursor-zoom-in"
          loading="lazy"
        />
        {alt && (
          <div className="px-4 py-3 bg-gray-900/80 backdrop-blur-sm text-sm text-gray-400">
            {alt}
          </div>
        )}
      </motion.div>
    ),
  };

  // Tab configuration
  const tabs = [
    { id: 'documentation', label: 'Documentation', icon: BookOpen },
    { id: 'overview', label: 'Overview', icon: Eye },
    { id: 'tech', label: 'Tech Stack', icon: Layers },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black">
      {/* Navigation */}
      <div className="sticky top-0 z-40 bg-black/80 backdrop-blur-xl border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link
              to="/"
              className="inline-flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
            >
              <ArrowLeft size={20} />
              Back to Portfolio
            </Link>
            
            <div className="flex items-center gap-4">
              {project.code && (
                <a
                  href={project.code}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-white/5 hover:bg-white/10 transition-all"
                >
                  <Github size={18} />
                  <span className="hidden sm:inline">Source Code</span>
                </a>
              )}
              {project.url && (
                <a
                  href={project.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-cyan-500 to-purple-500 text-white hover:opacity-90 transition-opacity"
                >
                  <Globe size={18} />
                  <span className="hidden sm:inline">Live Demo</span>
                </a>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            {/* Project Card */}
            <div className="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-sm">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h1 className="text-2xl font-bold text-white mb-2">{project.title}</h1>
                  <p className="text-gray-400 text-sm">{project.description}</p>
                </div>
                <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-cyan-500/20 to-purple-500/20 flex items-center justify-center">
                  <Code className="text-cyan-400" size={24} />
                </div>
              </div>

              {/* Project Stats */}
              <div className="space-y-4 mt-6">
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2 text-gray-400">
                    <Calendar size={16} />
                    <span>Created</span>
                  </div>
                  <span className="text-white">{project.createdAt || '2024'}</span>
                </div>
                
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2 text-gray-400">
                    <Clock size={16} />
                    <span>Status</span>
                  </div>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    project.status === 'active' 
                      ? 'bg-green-500/20 text-green-400'
                      : project.status === 'completed'
                      ? 'bg-blue-500/20 text-blue-400'
                      : 'bg-gray-500/20 text-gray-400'
                  }`}>
                    {project.status || 'Active'}
                  </span>
                </div>

                {project.stats && (
                  <>
                    {project.stats.stars && (
                      <div className="flex items-center justify-between text-sm">
                        <div className="flex items-center gap-2 text-gray-400">
                          <Star size={16} />
                          <span>Stars</span>
                        </div>
                        <span className="text-white">{project.stats.stars}</span>
                      </div>
                    )}
                    
                    {project.stats.contributors && (
                      <div className="flex items-center justify-between text-sm">
                        <div className="flex items-center gap-2 text-gray-400">
                          <Users size={16} />
                          <span>Contributors</span>
                        </div>
                        <span className="text-white">{project.stats.contributors}</span>
                      </div>
                    )}
                  </>
                )}
              </div>

              {/* Tech Stack */}
              <div className="mt-6">
                <h3 className="text-sm font-semibold text-gray-400 mb-3">TECH STACK</h3>
                <div className="flex flex-wrap gap-2">
                  {project.tech.map((tech, index) => (
                    <span
                      key={index}
                      className="px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-sm text-gray-300 hover:bg-white/10 transition-colors"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Quick Links */}
            <div className="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-sm">
              <h3 className="text-lg font-semibold text-white mb-4">Quick Links</h3>
              <div className="space-y-3">
                {project.code && (
                  <a
                    href={project.code}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 p-3 rounded-lg hover:bg-white/5 transition-all group"
                  >
                    <Github size={20} className="text-gray-400 group-hover:text-white" />
                    <div>
                      <div className="font-medium text-white">GitHub Repository</div>
                      <div className="text-sm text-gray-500">View source code</div>
                    </div>
                  </a>
                )}
                {project.url && (
                  <a
                    href={project.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 p-3 rounded-lg hover:bg-white/5 transition-all group"
                  >
                    <ExternalLink size={20} className="text-gray-400 group-hover:text-white" />
                    <div>
                      <div className="font-medium text-white">Live Demo</div>
                      <div className="text-sm text-gray-500">Try it out</div>
                    </div>
                  </a>
                )}
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            {/* Tabs */}
            <div className="flex space-x-1 mb-8 p-1 rounded-xl bg-white/5 border border-white/10 backdrop-blur-sm">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.id;
                
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-lg transition-all ${
                      isActive
                        ? 'bg-gradient-to-r from-cyan-500 to-purple-500 text-white'
                        : 'text-gray-400 hover:text-white hover:bg-white/5'
                    }`}
                  >
                    <Icon size={20} />
                    <span className="font-medium">{tab.label}</span>
                  </button>
                );
              })}
            </div>

            {/* Tab Content */}
            <div ref={contentRef} className="overflow-y-auto max-h-[calc(100vh-200px)]">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeTab}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                  className="bg-white/5 border border-white/10 rounded-2xl p-8 backdrop-blur-sm"
                >
                  {activeTab === 'documentation' && (
                    <div className="markdown-content">
                      {project.markdown ? (
                        <ReactMarkdown
                          remarkPlugins={[remarkGfm]}
                          rehypePlugins={[rehypeHighlight]}
                          components={markdownComponents}
                        >
                          {project.markdown}
                        </ReactMarkdown>
                      ) : (
                        <div className="text-center py-12">
                          <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-to-r from-yellow-500/20 to-orange-500/20 flex items-center justify-center">
                            <span className="text-3xl">🚧</span>
                          </div>
                          <h3 className="text-2xl font-bold text-white mb-3">Documentation Coming Soon</h3>
                          <p className="text-gray-400 max-w-md mx-auto">
                            We're currently working on comprehensive documentation for this project. Check back soon!
                          </p>
                        </div>
                      )}
                    </div>
                  )}

                  {activeTab === 'overview' && (
                    <div className="space-y-6">
                      <h2 className="text-3xl font-bold text-white mb-6">Project Overview</h2>
                      <div className="grid md:grid-cols-2 gap-6">
                        <div className="space-y-4">
                          <h3 className="text-xl font-semibold text-white">Key Features</h3>
                          <ul className="space-y-3">
                            {project.features?.map((feature, index) => (
                              <li key={index} className="flex items-start gap-3">
                                <div className="mt-1.5 w-2 h-2 rounded-full bg-cyan-400"></div>
                                <span className="text-gray-300">{feature}</span>
                              </li>
                            )) || (
                              <li className="text-gray-400">No features listed</li>
                            )}
                          </ul>
                        </div>
                        <div className="space-y-4">
                          <h3 className="text-xl font-semibold text-white">Challenges Solved</h3>
                          <ul className="space-y-3">
                            {project.challenges?.map((challenge, index) => (
                              <li key={index} className="flex items-start gap-3">
                                <div className="mt-1.5 w-2 h-2 rounded-full bg-purple-400"></div>
                                <span className="text-gray-300">{challenge}</span>
                              </li>
                            )) || (
                              <li className="text-gray-400">No challenges listed</li>
                            )}
                          </ul>
                        </div>
                      </div>
                    </div>
                  )}

                  {activeTab === 'tech' && (
                    <div className="space-y-6">
                      <h2 className="text-3xl font-bold text-white mb-6">Technology Stack</h2>
                      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        {project.tech.map((tech, index) => (
                          <div
                            key={index}
                            className="p-4 rounded-xl bg-white/5 border border-white/10 hover:border-cyan-500/30 transition-all group"
                          >
                            <div className="flex items-center gap-3 mb-2">
                              <div className="w-10 h-10 rounded-lg bg-gradient-to-r from-cyan-500/10 to-purple-500/10 flex items-center justify-center">
                                <Code size={20} className="text-cyan-400" />
                              </div>
                              <h3 className="font-semibold text-white">{tech}</h3>
                            </div>
                            <p className="text-sm text-gray-400">
                              Used for {tech.toLowerCase()} implementation
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectDocs;
















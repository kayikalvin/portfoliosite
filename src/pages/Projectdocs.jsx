import { useParams } from "react-router-dom";
import { projects } from "../utils/utils";
import { Cast, FileCode2, Github } from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeHighlight from "rehype-highlight";
import "highlight.js/styles/github-dark.css"; // Dark theme for code highlighting

const ProjectDocs = () => {
  const { projectId } = useParams();

  const project = projects.find((proj) => proj.title === projectId);

  if (!project) {
    return (
      <div className="p-6 text-center">
        <h2 className="text-2xl font-bold">Project not found 🚨</h2>
      </div>
    );
  }

  // Custom components for better styling
  const markdownComponents = {
    h1: ({ children }) => (
      <h1 className="text-3xl font-bold text-white mb-6 border-b border-white/20 pb-2">
        {children}
      </h1>
    ),
    h2: ({ children }) => (
      <h2 className="text-2xl font-bold text-white mb-4 mt-8">
        {children}
      </h2>
    ),
    h3: ({ children }) => (
      <h3 className="text-xl font-semibold text-white mb-3 mt-6">
        {children}
      </h3>
    ),
    p: ({ children }) => (
      <p className="text-gray-300 mb-4 leading-relaxed">
        {children}
      </p>
    ),
    ul: ({ children }) => (
      <ul className="list-disc list-inside text-gray-300 mb-4 space-y-1">
        {children}
      </ul>
    ),
    ol: ({ children }) => (
      <ol className="list-decimal list-inside text-gray-300 mb-4 space-y-1">
        {children}
      </ol>
    ),
    li: ({ children }) => (
      <li className="text-gray-300 mb-1">
        {children}
      </li>
    ),
    strong: ({ children }) => (
      <strong className="text-white font-semibold">
        {children}
      </strong>
    ),
    code: ({ children, className }) => {
      const isInline = !className;
      if (isInline) {
        return (
          <code className="bg-gray-800 text-gray-200 px-2 py-1 rounded text-sm font-mono">
            {children}
          </code>
        );
      }
      return <code className={className}>{children}</code>;
    },
    pre: ({ children }) => (
      <pre className="bg-gray-900 rounded-lg p-4 mb-4 overflow-x-auto border border-gray-700">
        {children}
      </pre>
    ),
    blockquote: ({ children }) => (
      <blockquote className="border-l-4 border-blue-500 pl-4 italic text-gray-400 mb-4">
        {children}
      </blockquote>
    ),
    a: ({ children, href }) => (
      <a
        href={href}
        className="text-blue-400 hover:text-blue-300 underline"
        target="_blank"
        rel="noopener noreferrer"
      >
        {children}
      </a>
    ),
    table: ({ children }) => (
      <div className="overflow-x-auto mb-4">
        <table className="min-w-full border-collapse border border-gray-600">
          {children}
        </table>
      </div>
    ),
    thead: ({ children }) => (
      <thead className="bg-gray-800">
        {children}
      </thead>
    ),
    tbody: ({ children }) => (
      <tbody className="bg-gray-900">
        {children}
      </tbody>
    ),
    tr: ({ children }) => (
      <tr className="border-b border-gray-600">
        {children}
      </tr>
    ),
    th: ({ children }) => (
      <th className="border border-gray-600 px-4 py-2 text-left text-white font-semibold">
        {children}
      </th>
    ),
    td: ({ children }) => (
      <td className="border border-gray-600 px-4 py-2 text-gray-300">
        {children}
      </td>
    ),
    img: ({ src, alt }) => (
      <img
        src={src}
        alt={alt}
        className="max-w-full h-auto rounded-lg shadow-lg mb-4"
      />
    ),
  };

  return (
    <div className="p-6 w-screen min-h-screen mx-auto bg-black text-white">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-4">{project.title}</h1>
        <p className="text-gray-300 mb-4">{project.description}</p>

        <div className="space-y-2">
          <p className="flex items-center gap-2">
            <FileCode2 className="rounded-4xl p-1 bg-gray-800" size={28} />
            {project.tech.join(", ")}
          </p>
          <p className="flex items-center gap-2">
            <Github className="rounded-4xl p-1 bg-gray-800" size={28} />
            <a 
              href={project.code} 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-blue-400 hover:text-blue-300 underline"
            >
              View on GitHub
            </a>
          </p>
          <p className="flex items-center gap-2">
            <Cast className="rounded-4xl p-1 bg-gray-800" size={28} />
            <a 
              href={project.url} 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-blue-400 hover:text-blue-300 underline"
            >
              Visit Live
            </a>
          </p>
        </div>

        <div className="mt-6 p-6 bg-white/5 border border-white/10 rounded-lg">
          <h2 className="text-xl font-bold mb-4">Documentation</h2>
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
              <p className="text-gray-400">
                🚧 The documentation of the project is coming soon.....
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectDocs;
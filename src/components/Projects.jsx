import { Link } from "react-router-dom";
import { ExternalLink, Github, BookOpen } from "lucide-react";
import { projects } from "../utils/utils";

const Projects = () => {
  return (
    <div className="max-w-6xl mx-auto">
      <div className="text-center mb-16">
        <h2 className="text-4xl md:text-5xl font-bold mb-4">
          <span className="bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text text-transparent">
            Featured Projects
          </span>
        </h2>
        <p className="text-gray-400 max-w-2xl mx-auto">
          Real-world applications showcasing the power of data-driven web
          engineering.
        </p>
        <div className="h-1 w-20 bg-gradient-to-r from-pink-500 to-purple-500 rounded-full mx-auto mt-4 animate-pulse"></div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {projects.map((project, index) => (
          <div
            key={index}
            className="relative overflow-hidden rounded-2xl bg-white/5 border border-white/10 hover:scale-[1.02] transition-transform duration-300"
          >
            {/* Gradient overlay */}
            <div
              className={`absolute inset-0 bg-gradient-to-r ${project.gradient} opacity-20`}
            />

            <div className="relative p-6 flex flex-col h-full justify-between">
              <div>
                <h3 className="text-xl font-bold mb-3">{project.title}</h3>
                <p className="text-gray-300 text-sm mb-4 leading-relaxed">
                  {project.description}
                </p>
              </div>

              <div className="flex flex-wrap gap-2 mb-4">
                {project.tech.map((tech, techIndex) => (
                  <span
                    key={techIndex}
                    className="px-2 py-1 rounded-full bg-white/10 text-sm text-gray-200 hover:bg-gradient-to-r hover:from-cyan-500 hover:to-purple-500 hover:text-black transition-all duration-300 cursor-pointer"
                  >
                    {tech}
                  </span>
                ))}
              </div>

              <div className="flex space-x-4 mt-auto">
                {project.code && (
                  <div className="group flex flex-col items-center">
                    <a
                      href={project.code}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 rounded-full bg-white/10 hover:bg-gradient-to-r hover:from-cyan-500 hover:to-purple-500 transition-all duration-300"
                    >
                      <Github
                        size={20}
                        className="text-gray-200 group-hover:text-black transition-colors duration-300"
                      />
                    </a>
                    <span className="mt-1 text-xs text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      Code
                    </span>
                  </div>
                )}

                {project.url && (
                  <div className="group flex flex-col items-center">
                    <a
                      href={project.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 rounded-full bg-white/10 hover:bg-gradient-to-r hover:from-cyan-500 hover:to-purple-500 transition-all duration-300"
                    >
                      <ExternalLink
                        size={20}
                        className="text-gray-200 group-hover:text-black transition-colors duration-300"
                      />
                    </a>
                    <span className="mt-1 text-xs text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      Live
                    </span>
                  </div>
                )}

                {/* NEW View Docs link */}
                <div className="group flex flex-col items-center">
                  <Link
                    to={`/projects/${project.title}/docs`}
                    className="p-2 rounded-full bg-white/10 hover:bg-gradient-to-r hover:from-green-500 hover:to-teal-500 transition-all duration-300"
                  >
                    <BookOpen
                      size={20}
                      className="text-gray-200 group-hover:text-black transition-colors duration-300"
                    />
                  </Link>

                  <span className="mt-1 text-xs text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    View Docs
                  </span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Projects;

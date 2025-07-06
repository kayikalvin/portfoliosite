import { useParams } from "react-router-dom";
import { projects } from "../utils/utils";
import { Cast, CodeXml, FileCode2, Github } from "lucide-react";

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

  return (
    <div className="p-6 w-screen h-screen mx-auto bg-black text-white">
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
            <a href={project.code} target="_blank" rel="noopener noreferrer">
              View on GitHub
            </a>
          </p>
          <p className="flex items-center gap-2">
            <Cast className="rounded-4xl p-1 bg-gray-800" size={28} />
            <a href={project.url} target="_blank" rel="noopener noreferrer">
              Visit Live
            </a>
          </p>
        </div>

        <div className="mt-6 p-4 bg-white/5 border border-white/10 rounded-lg">
          <h2 className="text-xl font-bold mb-2">Documentation Content</h2>
          <div>
            {project.markdown ? (
              <div className="prose prose-invert max-w-none">
                {project.markdown}
              </div>
            ) : (
              <p>
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

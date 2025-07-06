import { useParams } from "react-router-dom";
import projects from "../utils/utils";

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
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-4">Docs for: {project.title}</h1>
      <p className="text-gray-300 mb-4">{project.description}</p>

      <div className="space-y-2">
        <p><strong>Technologies:</strong> {project.tech.join(", ")}</p>
        <p><strong>Code:</strong> <a href={project.code} target="_blank" rel="noopener noreferrer" className="text-blue-500 underline">View on GitHub</a></p>
        <p><strong>Live:</strong> <a href={project.url} target="_blank" rel="noopener noreferrer" className="text-blue-500 underline">Visit Live</a></p>
      </div>

      <div className="mt-6 p-4 bg-white/5 border border-white/10 rounded-lg">
        <h2 className="text-xl font-bold mb-2">Documentation Content</h2>
        <p>🚧 Here you can write or load full markdown docs, embed diagrams, API references, etc.</p>
      </div>
    </div>
  );
};

export default ProjectDocs;


import { FiEdit, FiTrash2, FiPlus } from 'react-icons/fi';

export default function Projects({ projects, onEdit, onDelete, onAdd }) {
  return (
    <div className="min-h-[60vh] p-4">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold">Projects</h1>
        <button
          onClick={onAdd}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg shadow"
        >
          <FiPlus /> Add Project.
        </button>
      </div>
      {projects && projects.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {projects.map((project) => (
            <div key={project.id || project._id || project.title} className="bg-gray-800 border border-gray-700 rounded-xl p-5 flex flex-col gap-2">
              {project.image && (
                <img
                  src={project.image}
                  alt={project.title}
                  className="w-full max-h-40 object-contain rounded mb-2 border border-gray-700 bg-gray-900"
                />
              )}
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-semibold text-blue-300">{project.title}</h2>
                  <p className="text-gray-400 text-sm">{project.description}</p>
                  <div className="text-xs text-gray-500 mt-1">{Array.isArray(project.tech) ? project.tech.join(', ') : project.tech}</div>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => onEdit(project)}
                    className="p-2 rounded hover:bg-blue-900 text-blue-400"
                    title="Edit"
                  >
                    <FiEdit />
                  </button>
                  <button
                    onClick={() => onDelete(project.title)}
                    className="p-2 rounded hover:bg-red-900 text-red-400"
                    title="Delete"
                  >
                    <FiTrash2 />
                  </button>
                </div>
              </div>
              {project.url && (
                <a href={project.url} target="_blank" rel="noopener noreferrer" className="text-blue-400 text-xs hover:underline mt-2">{project.url}</a>
              )}
            </div>
          ))}
        </div>
      ) : (
        <div className="text-gray-500 text-center py-8">No projects found.</div>
      )}
    </div>
  );
}

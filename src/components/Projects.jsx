import { ExternalLink, Github } from "lucide-react";

const Projects = () => {
  const projects = [
    {
      title: "sonar-rock-vs-mine-ui",
      description:
        "Interactive dashboard processing 1M+ data points with live visualizations using React, D3.js, and WebSocket connections.",
      tech: ["React", "D3.js", "Python", "FastAPI", "Redis"],
      gradient: "from-blue-600 via-purple-600 to-pink-600",
      code: "https://github.com/kayikalvin/sonar-rock-vs-mine-ui",
      url: "https://sonar-rock-vs-mine-ui.vercel.app/",
    },
    {
      title: "ML Model Platform",
      description:
        "Full-stack platform for deploying and monitoring ML models with A/B testing capabilities and automated retraining.",
      tech: ["TensorFlow", "Docker", "Kubernetes", "React", "PostgreSQL"],
      gradient: "from-green-600 via-teal-600 to-blue-600",
      code: "https://github.com/your-repo/ml-platform",
      url: "https://ml-platform-live.com",
    },
    {
      title: "Data Pipeline Orchestrator",
      description:
        "Scalable ETL pipeline processing TB-scale data with fault tolerance and real-time monitoring dashboards.",
      tech: ["Apache Airflow", "Spark", "Kafka", "MongoDB", "Grafana"],
      gradient: "from-orange-600 via-red-600 to-pink-600",
      code: "https://github.com/your-repo/data-pipeline",
      url: "https://pipeline-dashboard.com",
    },
  ];

  return (
    <div className="max-w-6xl mx-auto">
      <div className="text-center mb-16">
        <h2 className="text-4xl md:text-5xl font-bold mb-4">
          <span className="bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text text-transparent">
            Featured Projects
          </span>
        </h2>
        <p className="text-gray-400 max-w-2xl mx-auto">
          Real-world applications showcasing the power of data-driven web engineering.
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

              <div className="flex space-x-2 mt-auto">
                {project.code && (
                  <a
                    href={project.code}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 rounded-full bg-white/10 hover:bg-gradient-to-r hover:from-cyan-500 hover:to-purple-500 transition-all duration-300"
                  >
                    <Github size={18} className="text-gray-200 hover:text-black" />
                  </a>
                )}
                {project.url && (
                  <a
                    href={project.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 rounded-full bg-white/10 hover:bg-gradient-to-r hover:from-cyan-500 hover:to-purple-500 transition-all duration-300"
                  >
                    <ExternalLink size={18} className="text-gray-200 hover:text-black" />
                  </a>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Projects;

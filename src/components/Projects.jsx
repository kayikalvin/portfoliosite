import { ExternalLink, Github } from "lucide-react";
import SplashCursor from "./SplashCursor";

const Projects = () => {
  const projects = [
    {
      title: 'sonar-rock-vs-mine-ui',
      description:
        'Interactive dashboard processing 1M+ data points with live visualizations using React, D3.js, and WebSocket connections.',
      tech: ['React', 'D3.js', 'Python', 'FastAPI', 'Redis'],
      gradient: 'from-blue-600 via-purple-600 to-pink-600',
      code: 'https://github.com/kayikalvin/sonar-rock-vs-mine-ui',
      url: 'https://sonar-rock-vs-mine-ui.vercel.app/',
    },
    {
      title: 'ML Model Platform',
      description:
        'Full-stack platform for deploying and monitoring ML models with A/B testing capabilities and automated retraining.',
      tech: ['TensorFlow', 'Docker', 'Kubernetes', 'React', 'PostgreSQL'],
      gradient: 'from-green-600 via-teal-600 to-blue-600',
      code: 'https://github.com/your-repo/ml-platform',
      url: 'https://ml-platform-live.com',
    },
    {
      title: 'Data Pipeline Orchestrator',
      description:
        'Scalable ETL pipeline processing TB-scale data with fault tolerance and real-time monitoring dashboards.',
      tech: ['Apache Airflow', 'Spark', 'Kafka', 'MongoDB', 'Grafana'],
      gradient: 'from-orange-600 via-red-600 to-pink-600',
      code: 'https://github.com/your-repo/data-pipeline',
      url: 'https://pipeline-dashboard.com',
    },
     {
      title: 'Real-time Analytics Dashboard',
      description:
        'Interactive dashboard processing 1M+ data points with live visualizations using React, D3.js, and WebSocket connections.',
      tech: ['React', 'D3.js', 'Python', 'FastAPI', 'Redis'],
      gradient: 'from-blue-600 via-purple-600 to-pink-600',
      code: 'https://github.com/your-repo/analytics-dashboard',
      url: 'https://your-live-site.com/analytics',
    },
    {
      title: 'ML Model Platform',
      description:
        'Full-stack platform for deploying and monitoring ML models with A/B testing capabilities and automated retraining.',
      tech: ['TensorFlow', 'Docker', 'Kubernetes', 'React', 'PostgreSQL'],
      gradient: 'from-green-600 via-teal-600 to-blue-600',
      code: 'https://github.com/your-repo/ml-platform',
      url: 'https://ml-platform-live.com',
    },
    {
      title: 'Data Pipeline Orchestrator',
      description:
        'Scalable ETL pipeline processing TB-scale data with fault tolerance and real-time monitoring dashboards.',
      tech: ['Apache Airflow', 'Spark', 'Kafka', 'MongoDB', 'Grafana'],
      gradient: 'from-orange-600 via-red-600 to-pink-600',
      code: 'https://github.com/your-repo/data-pipeline',
      url: 'https://pipeline-dashboard.com',
    },
  ];

  return (
    <div className="max-w-6xl mx-auto">
      <div className="text-center mb-16">
        <h2 className="text-4xl md:text-5xl font-bold mb-4">
          <span className="bg-gradient-to-r from-green-400 to-blue-400 bg-clip-text text-transparent">
            Featured Projects
          </span>
        </h2>
        <p className="text-gray-400 max-w-2xl mx-auto">
          Real-world applications showcasing the power of data-driven web development
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {projects.map((project, index) => (
          <div
            key={index}
            className="project-card hover-scale overflow-hidden rounded-2xl bg-gradient-to-br from-gray-900 to-gray-800 border border-gray-700 cursor-pointer relative"
          >
            <div className={`absolute inset-0 bg-gradient-to-r ${project.gradient} opacity-5`} />

            <div className="relative p-8 md:p-8">
              <div className="flex flex-col md:flex-row md:items-start justify-between mb-6">
                <h3 className="text-2xl md:text-xl font-bold text-white mb-4 md:mb-0">
                  {project.title}
                </h3>
                <div className="flex space-x-2 justify-baseline">
                  {project.code && (
                    <a
                      href={project.code}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover-lift p-1 rounded-lg bg-white bg-opacity-10"
                    >
                      <Github size={18} className="text-black" />
                    </a>
                  )}
                  {project.url && (
                    <a
                      href={project.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover-lift p-1 rounded-lg bg-white bg-opacity-10"
                    >
                      <ExternalLink size={18} className="text-black" />
                    </a>
                  )}
                </div>
              </div>

              <p className="text-gray-300 text-sm mb-6 leading-relaxed">{project.description}</p>

              <div className="flex flex-wrap gap-3">
                {project.tech.map((tech, techIndex) => (
                  <span
                    key={techIndex}
                    className="hover-scale px-2 py-1 rounded-full bg-white bg-opacity-10 text-sm font-medium text-black cursor-pointer"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Projects;

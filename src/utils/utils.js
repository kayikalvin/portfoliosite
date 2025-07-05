import {Code,Database,Brain,BarChart3,Cpu,} from "lucide-react";




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



const skills = [
    {
      name: "Python",
      level: 95,
      icon: Code,
      color: "from-blue-500 to-cyan-500",
      iconColor: "text-blue-400",
    },
    {
      name: "JavaScript/React",
      level: 90,
      icon: Code,
      color: "from-yellow-500 to-orange-500",
      iconColor: "text-yellow-400",
    },
    {
      name: "Machine Learning",
      level: 88,
      icon: Brain,
      color: "from-purple-500 to-pink-500",
      iconColor: "text-purple-400",
    },
    {
      name: "Data Analysis",
      level: 92,
      icon: BarChart3,
      color: "from-green-500 to-emerald-500",
      iconColor: "text-green-400",
    },
    {
      name: "SQL/NoSQL",
      level: 85,
      icon: Database,
      color: "from-red-500 to-rose-500",
      iconColor: "text-red-400",
    },
    {
      name: "Cloud/DevOps",
      level: 80,
      icon: Cpu,
      color: "from-indigo-500 to-blue-500",
      iconColor: "text-indigo-400",
    },
  ];




export { projects, skills };

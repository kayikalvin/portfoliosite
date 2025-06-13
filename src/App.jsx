import React, { useEffect, useRef, useState } from 'react';
import { Code, Database, Brain, BarChart3, Github, Linkedin, Mail, ExternalLink, ChevronDown, Terminal, Cpu, LineChart } from 'lucide-react';

const App = () => {
  const heroRef = useRef(null);
  const skillsRef = useRef(null);
  const projectsRef = useRef(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setIsLoaded(true);

    // Mouse tracking for interactive effects
    const handleMouseMove = (e) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener('mousemove', handleMouseMove);

    // Scroll animations
    const observerOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -100px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('animate-fade-in');
        }
      });
    }, observerOptions);

    document.querySelectorAll('.scroll-animate').forEach(el => {
      observer.observe(el);
    });

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      observer.disconnect();
    };
  }, []);
const skills = [
  { name: 'Python', level: 95, icon: Code, color: 'from-blue-500 to-cyan-500', iconColor: 'text-blue-400' },
  { name: 'JavaScript/React', level: 90, icon: Code, color: 'from-yellow-500 to-orange-500', iconColor: 'text-yellow-400' },
  { name: 'Machine Learning', level: 88, icon: Brain, color: 'from-purple-500 to-pink-500', iconColor: 'text-purple-400' },
  { name: 'Data Analysis', level: 92, icon: BarChart3, color: 'from-green-500 to-emerald-500', iconColor: 'text-green-400' },
  { name: 'SQL/NoSQL', level: 85, icon: Database, color: 'from-red-500 to-rose-500', iconColor: 'text-red-400' },
  { name: 'Cloud/DevOps', level: 80, icon: Cpu, color: 'from-indigo-500 to-blue-500', iconColor: 'text-indigo-400' }
];


  const projects = [
    {
      title: 'Real-time Analytics Dashboard',
      description: 'Interactive dashboard processing 1M+ data points with live visualizations using React, D3.js, and WebSocket connections.',
      tech: ['React', 'D3.js', 'Python', 'FastAPI', 'Redis'],
      gradient: 'from-blue-600 via-purple-600 to-pink-600'
    },
    {
      title: 'ML Model Deployment Platform',
      description: 'Full-stack platform for deploying and monitoring ML models with A/B testing capabilities and automated retraining.',
      tech: ['TensorFlow', 'Docker', 'Kubernetes', 'React', 'PostgreSQL'],
      gradient: 'from-green-600 via-teal-600 to-blue-600'
    },
    {
      title: 'Data Pipeline Orchestrator',
      description: 'Scalable ETL pipeline processing TB-scale data with fault tolerance and real-time monitoring dashboards.',
      tech: ['Apache Airflow', 'Spark', 'Kafka', 'MongoDB', 'Grafana'],
      gradient: 'from-orange-600 via-red-600 to-pink-600'
    }
  ];

  return (
    <div className="min-h-screen bg-black text-white overflow-x-hidden">
      {/* Animated Background */}
      <div className="fixed inset-0 z-0">
        <div
          className="absolute inset-0 opacity-30"
          style={{
            background: `radial-gradient(circle at ${mousePosition.x}px ${mousePosition.y}px, rgba(139, 92, 246, 0.15) 0%, transparent 50%)`
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-br from-black via-gray-900 to-black">
          <div className="absolute inset-0 opacity-20">
            <div className="absolute inset-0" style={{
              backgroundImage: `radial-gradient(circle at 20% 20%, rgba(120, 119, 198, 0.1) 0%, transparent 50%),
                               radial-gradient(circle at 80% 80%, rgba(255, 119, 198, 0.1) 0%, transparent 50%),
                               radial-gradient(circle at 40% 40%, rgba(120, 219, 255, 0.1) 0%, transparent 50%)`
            }} />
          </div>
        </div>
      </div>

      {/* Hero Section */}
      <section ref={heroRef} className="relative z-10 min-h-screen flex items-center justify-center px-6">
        <div className={`text-center max-w-4xl mx-auto transition-all duration-2000 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <div className="mb-8 relative">
            <div className="absolute inset-0 blur-3xl bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 opacity-30 animate-pulse" />
            <h1 className="relative text-6xl md:text-8xl font-bold bg-gradient-to-r from-white via-blue-200 to-purple-200 bg-clip-text text-transparent mb-4">
              Kalvin Kayi
            </h1>
          </div>

          <div className="space-y-2 mb-8">
            <p className="text-xl md:text-2xl text-gray-300 font-light">
              Data Web Developer • ML Engineer • Data Analyst
            </p>
            <p className="text-lg text-gray-400 max-w-2xl mx-auto leading-relaxed">
              Transforming complex data into intelligent web experiences.
              Building the future where data science meets beautiful user interfaces.
            </p>
          </div>

      
          <div className="flex flex-wrap justify-center gap-4 mb-12">
            {[
              { icon: Code, label: 'Full-Stack Dev', color: 'from-blue-500 to-cyan-500', iconColor: 'text-blue-400' },
              { icon: Brain, label: 'ML Engineer', color: 'from-purple-500 to-pink-500', iconColor: 'text-purple-400' },
              { icon: BarChart3, label: 'Data Analyst', color: 'from-green-500 to-emerald-500', iconColor: 'text-green-400' }
            ].map((item, index) => (
              <div
                key={index}
                className={`group px-6 py-3 rounded-full bg-gradient-to-r ${item.color} bg-opacity-10 border border-white border-opacity-20 hover:bg-opacity-20 transition-all duration-300 hover:scale-105 hover:shadow-lg`}
              >
                <div className="flex items-center space-x-2">
                  <item.icon size={20} className={item.iconColor} />
                  <span className="text-white font-medium">{item.label}</span>
                </div>
              </div>
            ))}
          </div>


          <div className="flex justify-center space-x-6">
            {[
              { icon: Github, href: '#', label: 'GitHub' },
              { icon: Linkedin, href: '#', label: 'LinkedIn' },
              { icon: Mail, href: '#', label: 'Email' }
            ].map((social, index) => (
              <a
                key={index}
                href={social.href}
                className="group relative p-4 rounded-full bg-white bg-opacity-5 hover:bg-opacity-10 transition-all duration-300 hover:scale-110 hover:shadow-xl"
              >
                <social.icon size={24} className="text-black group-hover:text-blue-400 transition-colors duration-300" />
                <div className="absolute -bottom-12 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <span className="text-sm text-gray-400">{social.label}</span>
                </div>
              </a>
            ))}
          </div>
        </div>

        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
          <ChevronDown size={32} className="text-gray-400" />
        </div>
      </section>

      {/* Skills Section */}
      <section ref={skillsRef} className="relative z-10 py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="scroll-animate opacity-0 translate-y-10 transition-all duration-1000">
            <h2 className="text-4xl md:text-5xl font-bold text-center mb-4">
              <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                Technical Expertise
              </span>
            </h2>
            <p className="text-gray-400 text-center mb-16 max-w-2xl mx-auto">
              Mastering the intersection of data science, machine learning, and modern web development
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {skills.map((skill, index) => (
              <div
                key={index}
                className="scroll-animate opacity-0 translate-y-10 transition-all duration-1000 group"
                style={{ transitionDelay: `${index * 100}ms` }}
              >
                <div className="relative p-6 rounded-2xl bg-gradient-to-br from-gray-900 to-gray-800 border border-gray-700 hover:border-gray-600 transition-all duration-300 hover:transform hover:scale-105 hover:shadow-2xl">
                  <div className="flex items-center mb-4">
                    <div className={`p-3 rounded-xl bg-gradient-to-r ${skill.color} bg-opacity-20 mr-4`}>
                      <skill.icon size={24} className={` ${skill.iconColor}`} />
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold text-white">{skill.name}</h3>
                      <p className="text-gray-400 text-sm">{skill.level}% Proficiency</p>
                    </div>
                  </div>

                  <div className="relative">
                    <div className="w-full bg-gray-700 rounded-full h-2 mb-2">
                      <div
                        className={`h-2 rounded-full bg-gradient-to-r ${skill.color} transition-all duration-2000 group-hover:animate-pulse`}
                        style={{ width: `${skill.level}%` }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Projects Section */}
      <section ref={projectsRef} className="relative z-10 py-20 px-6 bg-gradient-to-b from-gray-900 to-black">
        <div className="max-w-6xl mx-auto">
          <div className="scroll-animate opacity-0 translate-y-10 transition-all duration-1000">
            <h2 className="text-4xl md:text-5xl font-bold text-center mb-4">
              <span className="bg-gradient-to-r from-green-400 to-blue-400 bg-clip-text text-transparent">
                Featured Projects
              </span>
            </h2>
            <p className="text-gray-400 text-center mb-16 max-w-2xl mx-auto">
              Real-world applications showcasing the power of data-driven web development
            </p>
          </div>

          <div className="space-y-12">
            {projects.map((project, index) => (
              <div
                key={index}
                className="scroll-animate opacity-0 translate-y-10 transition-all duration-1000 group"
                style={{ transitionDelay: `${index * 200}ms` }}
              >
                <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-gray-900 to-gray-800 border border-gray-700 hover:border-gray-600 transition-all duration-500 hover:transform hover:scale-[1.02] hover:shadow-2xl">
                  <div className={`absolute inset-0 bg-gradient-to-r ${project.gradient} opacity-5 group-hover:opacity-10 transition-opacity duration-500`} />

                  <div className="relative p-8 md:p-12">
                    <div className="flex flex-col md:flex-row md:items-center justify-between mb-6">
                      <h3 className="text-2xl md:text-3xl font-bold text-white mb-4 md:mb-0">
                        {project.title}
                      </h3>
                      <div className="flex space-x-3">
                        <button className="p-2 rounded-lg bg-white bg-opacity-10 hover:bg-opacity-20 transition-all duration-300 hover:scale-110">
                          <Github size={20} className="text-black" />
                        </button>
                        <button className="p-2 rounded-lg bg-white bg-opacity-10 hover:bg-opacity-20 transition-all duration-300 hover:scale-110">
                          <ExternalLink size={20} className="text-black" />
                        </button>
                      </div>
                    </div>

                    <p className="text-gray-300 text-lg mb-6 leading-relaxed">
                      {project.description}
                    </p>

                    <div className="flex flex-wrap gap-3">
                      {project.tech.map((tech, techIndex) => (
                        <span
                          key={techIndex}
                          className="px-4 py-2 rounded-full bg-white bg-opacity-10 text-sm font-medium text-black hover:bg-opacity-20 transition-all duration-300 hover:scale-105"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="relative z-10 py-20 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <div className="scroll-animate opacity-0 translate-y-10 transition-all duration-1000">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              <span className="bg-gradient-to-r from-pink-400 to-purple-400 bg-clip-text text-transparent">
                Lets Build Something Amazing
              </span>
            </h2>
            <p className="text-gray-400 text-lg mb-12 max-w-2xl mx-auto">
              Ready to turn your data into powerful web experiences? Let's discuss your next project.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="group px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full font-semibold text-white hover:from-blue-700 hover:to-purple-700 transition-all duration-300 hover:scale-105 hover:shadow-xl">
                <span className="flex items-center justify-center space-x-2">
                  <Mail size={20} />
                  <span>Get In Touch</span>
                </span>
              </button>
              <button className="group px-8 py-4 border-2 border-gray-600 rounded-full font-semibold text-white hover:border-gray-500 hover:text-black hover:bg-white hover:bg-opacity-5 transition-all duration-300 hover:scale-105">
                <span className="flex items-center justify-center space-x-2">
                  <span>View Resume</span>
                  <Terminal size={20} />
                </span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 py-8 px-6 border-t border-gray-800">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-400 mb-4 md:mb-0">
            © 2025 Alex Chen. Crafted with React, Tailwind & GSAP
          </p>
          <div className="flex space-x-6">
            <a href="#" className="text-gray-400 hover:text-white transition-colors duration-300">Privacy</a>
            <a href="#" className="text-gray-400 hover:text-white transition-colors duration-300">Terms</a>
            <a href="#" className="text-gray-400 hover:text-white transition-colors duration-300">Contact</a>
          </div>
        </div>
      </footer>

      <style >{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .animate-fade-in {
          animation: fade-in 1s ease-out forwards;
        }
      `}</style>
    </div>
  );
};

export default App;
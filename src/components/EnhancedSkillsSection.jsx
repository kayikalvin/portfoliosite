import React, { useState, useEffect, useRef } from 'react';
import { Brain, Database, Code, BarChart3, Cpu, Globe, Layers, Terminal, Sparkles, TrendingUp } from 'lucide-react';

const EnhancedSkillsSection = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [activeCategory, setActiveCategory] = useState('all');
  const [hoveredSkill, setHoveredSkill] = useState(null);
  const skillsRef = useRef(null);

  const skillCategories = [
    { id: 'all', label: 'All Skills', icon: Sparkles },
    { id: 'ml', label: 'Machine Learning', icon: Brain },
    { id: 'data', label: 'Data Science', icon: BarChart3 },
    { id: 'dev', label: 'Development', icon: Code },
  ];

  const skills = [
    { name: 'Python', level: 95, icon: Terminal, color: 'from-blue-400 to-blue-600', iconColor: 'text-blue-400', category: 'ml', description: 'Advanced programming & data manipulation' },
    { name: 'Machine Learning', level: 92, icon: Brain, color: 'from-purple-400 to-purple-600', iconColor: 'text-purple-400', category: 'ml', description: 'Deep learning, NLP & computer vision' },
    { name: 'TensorFlow', level: 88, icon: Cpu, color: 'from-orange-400 to-orange-600', iconColor: 'text-orange-400', category: 'ml', description: 'Neural networks & model deployment' },
    { name: 'Data Analysis', level: 93, icon: BarChart3, color: 'from-green-400 to-green-600', iconColor: 'text-green-400', category: 'data', description: 'Statistical analysis & visualization' },
    { name: 'SQL & NoSQL', level: 90, icon: Database, color: 'from-cyan-400 to-cyan-600', iconColor: 'text-cyan-400', category: 'data', description: 'Database design & optimization' },
    { name: 'React & Next.js', level: 87, icon: Code, color: 'from-indigo-400 to-indigo-600', iconColor: 'text-indigo-400', category: 'dev', description: 'Modern web applications' },
    { name: 'APIs & Cloud', level: 85, icon: Globe, color: 'from-pink-400 to-pink-600', iconColor: 'text-pink-400', category: 'dev', description: 'AWS, GCP & microservices' },
    { name: 'MLOps', level: 83, icon: Layers, color: 'from-yellow-400 to-yellow-600', iconColor: 'text-yellow-400', category: 'ml', description: 'Model deployment & monitoring' },
    { name: 'Big Data', level: 86, icon: TrendingUp, color: 'from-red-400 to-red-600', iconColor: 'text-red-400', category: 'data', description: 'Spark, Hadoop & distributed systems' },
  ];

  const filteredSkills = activeCategory === 'all' 
    ? skills 
    : skills.filter(skill => skill.category === activeCategory);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 }
    );

    if (skillsRef.current) {
      observer.observe(skillsRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <section
      id="skills"
      ref={skillsRef}
      className="relative py-20 sm:py-28 px-4 sm:px-6 bg-black text-white overflow-hidden"
    >
      {/* Enhanced background effects */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-gray-900 via-black to-black"></div>
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-cyan-500/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full h-full">
        <div className="absolute top-1/4 left-1/3 w-2 h-2 bg-white/20 rounded-full animate-ping"></div>
        <div className="absolute bottom-1/3 right-1/4 w-2 h-2 bg-white/20 rounded-full animate-ping" style={{ animationDelay: '0.5s' }}></div>
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Header */}
        <div className="text-center mb-12 sm:mb-16">
          <div className="inline-block mb-4">
            <span className="px-4 py-2 bg-gradient-to-r from-cyan-500/10 to-purple-500/10 border border-cyan-500/20 rounded-full text-sm font-medium text-cyan-400">
              Technical Arsenal
            </span>
          </div>
          <h2 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-white via-cyan-100 to-purple-100 bg-clip-text text-transparent">
            Skills & Expertise
          </h2>
          <p className="text-gray-400 max-w-3xl mx-auto text-base sm:text-lg leading-relaxed">
            A comprehensive toolkit spanning machine learning, data science, and full-stack development—
            built through years of hands-on experience and continuous learning.
          </p>
        </div>

        {/* Category Filter */}
        <div className="flex flex-wrap justify-center gap-3 mb-12">
          {skillCategories.map((category) => {
            const Icon = category.icon;
            return (
              <button
                key={category.id}
                onClick={() => setActiveCategory(category.id)}
                className={`group px-5 py-3 rounded-xl font-medium transition-all duration-300 flex items-center gap-2 ${
                  activeCategory === category.id
                    ? 'bg-gradient-to-r from-cyan-500 to-purple-500 text-white shadow-lg shadow-cyan-500/25'
                    : 'bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white border border-white/10'
                }`}
              >
                <Icon size={18} className={activeCategory === category.id ? 'animate-pulse' : ''} />
                {category.label}
              </button>
            );
          })}
        </div>

        {/* Skills Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredSkills.map((skill, index) => {
            const Icon = skill.icon;
            const isHovered = hoveredSkill === index;
            
            return (
              <div
                key={index}
                onMouseEnter={() => setHoveredSkill(index)}
                onMouseLeave={() => setHoveredSkill(null)}
                className="group relative p-6 rounded-2xl bg-gradient-to-br from-white/5 to-white/[0.02] border border-white/10 hover:border-white/30 transition-all duration-500 cursor-pointer backdrop-blur-sm overflow-hidden"
                style={{
                  animation: isVisible ? `fadeInUp 0.6s ease-out ${index * 0.1}s both` : 'none',
                }}
              >
                {/* Hover glow effect */}
                <div className={`absolute inset-0 bg-gradient-to-r ${skill.color} opacity-0 group-hover:opacity-10 transition-opacity duration-500 blur-xl`}></div>
                
                {/* Content */}
                <div className="relative z-10">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className={`p-3 rounded-xl bg-gradient-to-r ${skill.color} group-hover:scale-110 transition-transform duration-300`}>
                        <Icon size={24} className="text-white" />
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-white group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:bg-clip-text group-hover:from-cyan-400 group-hover:to-purple-400 transition-all duration-300">
                          {skill.name}
                        </h3>
                        <p className="text-xs text-gray-500 mt-1">
                          {isHovered ? skill.description : `${skill.level}% mastery`}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Circular progress indicator */}
                  <div className="relative">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-gray-400">Proficiency</span>
                      <span className={`text-sm font-bold ${skill.iconColor}`}>{skill.level}%</span>
                    </div>
                    
                    {/* Progress bar with animation */}
                    <div className="relative w-full h-2.5 bg-gray-800/50 rounded-full overflow-hidden">
                      <div
                        className={`absolute inset-y-0 left-0 rounded-full bg-gradient-to-r ${skill.color} transition-all duration-1000 ease-out`}
                        style={{
                          width: isVisible ? `${skill.level}%` : '0%',
                          transitionDelay: `${index * 0.1}s`,
                        }}
                      >
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shimmer"></div>
                      </div>
                    </div>
                  </div>

                  {/* Skill level indicator */}
                  <div className="mt-4 flex gap-1">
                    {[...Array(5)].map((_, i) => (
                      <div
                        key={i}
                        className={`h-1 flex-1 rounded-full transition-all duration-500 ${
                          i < Math.ceil(skill.level / 20)
                            ? `bg-gradient-to-r ${skill.color}`
                            : 'bg-gray-800'
                        }`}
                        style={{ transitionDelay: `${(index * 0.1) + (i * 0.05)}s` }}
                      ></div>
                    ))}
                  </div>
                </div>

                {/* Corner accent */}
                <div className={`absolute top-0 right-0 w-20 h-20 bg-gradient-to-br ${skill.color} opacity-0 group-hover:opacity-20 blur-2xl transition-opacity duration-500`}></div>
              </div>
            );
          })}
        </div>

        {/* Stats Footer */}
        {/* <div className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-6">
          {[
            { label: 'Years Experience', value: '5+', icon: TrendingUp },
            { label: 'Technologies', value: '20+', icon: Layers },
            { label: 'Projects Completed', value: '50+', icon: Sparkles },
            { label: 'Certifications', value: '10+', icon: Brain },
          ].map((stat, i) => {
            const Icon = stat.icon;
            return (
              <div key={i} className="text-center p-6 rounded-xl bg-white/5 border border-white/10 backdrop-blur-sm group hover:bg-white/10 transition-all duration-300">
                <Icon className="w-8 h-8 mx-auto mb-3 text-cyan-400 group-hover:scale-110 transition-transform duration-300" />
                <div className="text-3xl font-bold bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent mb-1">
                  {stat.value}
                </div>
                <div className="text-sm text-gray-400">{stat.label}</div>
              </div>
            );
          })}
        </div> */}
      </div>

      <style jsx>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes shimmer {
          0% {
            transform: translateX(-100%);
          }
          100% {
            transform: translateX(100%);
          }
        }
        
        .animate-shimmer {
          animation: shimmer 2s infinite;
        }
      `}</style>
    </section>
  );
};

export default EnhancedSkillsSection;
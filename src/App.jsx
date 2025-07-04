import {
  Code,
  Database,
  Brain,
  BarChart3,
  Cpu,
 
} from "lucide-react";
import { useState, useEffect, useRef } from "react";
import Projects from "./components/Projects";
import { Analytics } from "@vercel/analytics/react"

const App = () => {
  const heroRef = useRef(null);
  const skillsRef = useRef(null);
  const projectsRef = useRef(null);
  const revealRef = useRef(null);
  const logoRef = useRef(null);
  const progressRef = useRef(null);
  const mainContentRef = useRef(null);
  const particlesRef = useRef([]);

  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [showReveal, setShowReveal] = useState(true);
  const [gsapLoaded, setGsapLoaded] = useState(false);

  // Initialize GSAP
  useEffect(() => {
    const loadGSAP = async () => {
      // Load GSAP from CDN
      const script = document.createElement("script");
      script.src =
        "https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/gsap.min.js";
      script.onload = () => {
        const scrollScript = document.createElement("script");
        scrollScript.src =
          "https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/ScrollTrigger.min.js";
        scrollScript.onload = () => {
          window.gsap.registerPlugin(window.ScrollTrigger);
          setGsapLoaded(true);
        };
        document.head.appendChild(scrollScript);
      };
      document.head.appendChild(script);
    };

    loadGSAP();
  }, []);

  // GSAP Animations
  useEffect(() => {
    if (!gsapLoaded || !window.gsap) return;

    const gsap = window.gsap;
    const ScrollTrigger = window.ScrollTrigger;

    // Page Reveal Animation Timeline
    const revealTL = gsap.timeline();

    // Animate particles
    particlesRef.current.forEach((particle, i) => {
      if (particle) {
        gsap.set(particle, {
          x: Math.random() * window.innerWidth,
          y: Math.random() * window.innerHeight,
          scale: Math.random() * 0.5 + 0.5,
          opacity: 0,
        });

        gsap.to(particle, {
          opacity: 0.6,
          duration: 1,
          delay: i * 0.1,
          ease: "power2.out",
        });

        gsap.to(particle, {
          y: "-=100",
          x: "+=50",
          rotation: 360,
          duration: 3 + Math.random() * 2,
          repeat: -1,
          yoyo: true,
          ease: "sine.inOut",
        });
      }
    });

    // Logo animation
    revealTL
      .from(logoRef.current, {
        scale: 0,
        rotation: -180,
        opacity: 0,
        duration: 1,
        ease: "back.out(1.7)",
      })
      .from(
        ".reveal-text",
        {
          y: 50,
          opacity: 0,
          duration: 0.8,
          stagger: 0.2,
          ease: "power3.out",
        },
        "-=0.5"
      )
      .from(
        ".geometric-shape",
        {
          scale: 0,
          rotation: 180,
          opacity: 0,
          duration: 1,
          stagger: 0.3,
          ease: "elastic.out(1, 0.5)",
        },
        "-=0.5"
      );

    // Progress bar animation
    gsap.to(progressRef.current, {
      width: "100%",
      duration: 2.5,
      ease: "power2.inOut",
      onComplete: () => {
        // Reveal exit animation
        gsap.to(revealRef.current, {
          y: "-100%",
          duration: 1,
          ease: "power4.inOut",
          onComplete: () => {
            setShowReveal(false);

            // Wait for DOM to fully render before animating hero
            setTimeout(() => {
              initMainAnimations();
            }, 10); // small delay to ensure DOM is ready
          },
        });
      },
    });

    // Shimmer effect on progress bar
    gsap.to(".progress-shimmer", {
      x: "200%",
      duration: 1.5,
      repeat: -1,
      ease: "none",
    });

    const initMainAnimations = () => {
      // Hero section entrance
      const heroTL = gsap.timeline();

      heroTL
        .from(".hero-title", {
          y: -100,
          opacity: 0,
          duration: 1.2,
          ease: "power4.out",
        })
        .from(
          ".hero-subtitle",
          {
            // y: 50,
            opacity: 0,
            duration: 1.4,
            stagger: 0.2,
            ease: "power3.out",
          },
          "-=0.8"
        )
        .fromTo(
          ".hero-badge",
          { scale: 0, opacity: 0 },
          {
            scale: 1,
            opacity: 1,
            duration: 0.8,
            stagger: 0.1,
            ease: "back.out(1.7)",
          }
        )
        .fromTo(
          ".social-icon",
          { y: 30, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.6,
            stagger: 0.1,
            ease: "power2.out",
          },
          "-=0.4"
        );

      // Scroll-triggered animations
      ScrollTrigger.batch(".skill-card", {
        onEnter: (elements) => {
          gsap.from(elements, {
            y: 100,
            opacity: 0,
            duration: 1,
            stagger: 0.15,
            ease: "power3.out",
          });

          // Animate skill bars
          elements.forEach((element, i) => {
            const skillBar = element.querySelector(".skill-bar");
            const level = skills[i % skills.length].level;
            gsap.to(skillBar, {
              width: `${level}%`,
              duration: 1.5,
              delay: 0.5,
              ease: "power2.out",
            });
          });
        },
        start: "top bottom-=100",
      });

      ScrollTrigger.batch(".project-card", {
        onEnter: (elements) => {
          gsap.from(elements, {
            y: 100,
            opacity: 0,
            duration: 1.2,
            stagger: 0.2,
            ease: "power3.out",
          });
        },
        start: "top bottom-=100",
      });

      // Continuous animations
      gsap.to(".floating-shape-1", {
        y: -20,
        rotation: 5,
        duration: 3,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
      });

      gsap.to(".floating-shape-2", {
        x: 15,
        rotation: -5,
        duration: 4,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
      });

      gsap.to(".floating-shape-3", {
        y: 15,
        x: -10,
        rotation: 10,
        duration: 5,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
      });

      // Mouse follower effect
      const updateMousePosition = (e) => {
        setMousePosition({ x: e.clientX, y: e.clientY });

        gsap.to(".mouse-follower", {
          x: e.clientX,
          y: e.clientY,
          duration: 0.1,
          ease: "power2.out",
        });
      };

      window.addEventListener("mousemove", updateMousePosition);

      // Hover animations for interactive elements
      document.querySelectorAll(".hover-scale").forEach((element) => {
        element.addEventListener("mouseenter", () => {
          gsap.to(element, {
            scale: 1.05,
            duration: 0.3,
            ease: "power2.out",
          });
        });

        element.addEventListener("mouseleave", () => {
          gsap.to(element, {
            scale: 1,
            duration: 0.3,
            ease: "power2.out",
          });
        });
      });

      document.querySelectorAll(".hover-lift").forEach((element) => {
        element.addEventListener("mouseenter", () => {
          gsap.to(element, {
            y: -10,
            duration: 0.3,
            ease: "power2.out",
          });
        });

        element.addEventListener("mouseleave", () => {
          gsap.to(element, {
            y: 0,
            duration: 0.3,
            ease: "power2.out",
          });
        });
      });

      // Parallax scrolling effects
      gsap.registerPlugin(ScrollTrigger);

      gsap.to(".parallax-bg", {
        yPercent: -50,
        ease: "none",
        scrollTrigger: {
          trigger: ".parallax-bg",
          start: "top bottom",
          end: "bottom top",
          scrub: true,
        },
      });
    };

    return () => {
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
    };
  }, [gsapLoaded]);

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

  return (
    <div className="min-h-screen bg-black text-white overflow-hidden">
      {/* Mouse Follower */}
      <div className="mouse-follower fixed w-6 h-6 bg-gradient-to-r from-green-400 to-red-400 rounded-full opacity-20 pointer-events-none z-50 mix-blend-screen" />
      {/* <div
      className="w-10 h-"
      style={{ cursor: "url('https://img.icons8.com/?size=100&id=TdbpMMmYMvER&format=png&color=000000'), auto" }}
    >
      Custom cursor area
    </div> */}

      {/* Page Reveal Overlay */}
      {showReveal && (
        <div
          ref={revealRef}
          className="fixed inset-0 z-50 bg-black flex items-center justify-center overflow-hidden"
        >
          {/* Animated Background */}
          <div className="absolute inset-0 parallax-bg">
            <div className="absolute inset-0 bg-gradient-to-bropacity-20" />
            <div className="absolute inset-0  to-transparent opacity-10" />

            {/* Floating Particles */}
            {[...Array(25)].map((_, i) => (
              <div
                key={i}
                ref={(el) => (particlesRef.current[i] = el)}
                className="absolute w-2 h-2 bg-white rounded-full"
              />
            ))}
          </div>

          {/* Geometric Animations */}
          <div className="absolute inset-0 pointer-events-none overflow-hidden">
            <div className="geometric-shape floating-shape-1 absolute top-1/4 left-1/4 w-32 h-32 border border-blue-500 opacity-20" />
            <div className="geometric-shape floating-shape-2 absolute bottom-1/4 right-1/4 w-24 h-24 border-2 border-purple-500 opacity-30 rounded-full" />
            <div className="geometric-shape floating-shape-3 absolute top-1/2 right-1/3 w-16 h-16 bg-gradient-to-r from-pink-500 to-purple-500 opacity-10 rounded-full" />
          </div>

          {/* Main Content */}
          <div className="relative z-10 text-center max-w-4xl mx-auto px-6">
            {/* Logo Animation */}
            <div className="mb-12">
              <div className="relative inline-block">
                <div className="absolute inset-0 blur-2xl bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 opacity-50" />
                <h1
                  ref={logoRef}
                  className="relative text-6xl md:text-8xl font-bold bg-gradient-to-r from-white via-blue-200 to-purple-200 bg-clip-text text-transparent"
                >
                  Kalvin Kayi
                </h1>
              </div>
            </div>

            {/* Animated Text */}
            <div className="mb-12 space-y-4">
              <div className="overflow-hidden">
                <p className="reveal-text text-2xl md:text-3xl font-light text-blue-300">
                  Welcome to my portfolio
                </p>
              </div>
              <div className="overflow-hidden">
                <p className="reveal-text text-lg text-gray-400">
                  Data Science • Web Development • Machine Learning
                </p>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="relative w-64 h-2 mx-auto bg-gray-800 rounded-full overflow-hidden">
              <div
                ref={progressRef}
                className="absolute left-0 top-0 h-full bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 w-0"
              />
              <div className="progress-shimmer absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-30 w-full -translate-x-full" />
            </div>

            <p className="reveal-text mt-6 text-sm text-gray-500">
              Crafting digital experiences...
            </p>
          </div>
        </div>
      )}

      {/* Main Site Content */}
      <div ref={mainContentRef} className={showReveal ? "hidden" : "block"}>
        {/* Animated Background */}
        <div className="fixed inset-0 z-0">
          <div
            className="absolute inset-0 opacity-30 transition-all duration-300"
            style={{
              background: `radial-gradient(circle at ${mousePosition.x}px ${mousePosition.y}px, rgba(139, 92, 246, 0.15) 0%, transparent 50%)`,
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-br from-black via-gray-900 to-black">
            <div className="absolute inset-0 opacity-20">
              <div
                className="absolute inset-0"
                style={{
                  backgroundImage: `radial-gradient(circle at 20% 20%, rgba(120, 119, 198, 0.1) 0%, transparent 50%),
                                 radial-gradient(circle at 80% 80%, rgba(255, 119, 198, 0.1) 0%, transparent 50%),
                                 radial-gradient(circle at 40% 40%, rgba(120, 219, 255, 0.1) 0%, transparent 50%)`,
                }}
              />
            </div>
          </div>
        </div>

        {/* Hero Section */}
        <div
          ref={heroRef}
          className="relative h-screen flex flex-col items-center justify-center pt-52 bg-black text-white overflow-hidden"
        >
          {/* Headline */}
          <h1 className="hero-title text-center text-5xl md:text-7xl font-extrabold mb-4 tracking-tight">
            Hey, I’m Kalvin 👋
          </h1>

          {/* Tagline */}
          <p className="hero-subtitle text-center text-xl md:text-2xl text-gray-400 max-w-xl mb-6">
            I build intelligent web apps that bridge data, design, and human
            experience.
          </p>

          {/* Animated gradient line */}
          <div className="h-1 w-24 bg-gradient-to-r from-cyan-400 via-purple-500 to-pink-500 rounded-full animate-pulse mb-8"></div>

          {/* Skills badges */}
          <div className="flex flex-wrap justify-center gap-4 mb-10">
            {[
              { icon: Code, label: "Full-Stack Dev" },
              { icon: Brain, label: "ML Engineer" },
              { icon: BarChart3, label: "Data Analyst" },
            ].map((item, index) => {
              const Icon = item.icon;
              return (
                <div
                  key={index}
                  className="flex items-center gap-2 px-5 py-2 rounded-full border border-white/10 bg-white/5 hover:bg-gradient-to-r hover:from-cyan-500 hover:to-purple-500 hover:scale-105 transition-all duration-300 cursor-pointer"
                >
                  <Icon size={20} className="hero-badge text-gray-300" />
                  <span className="text-sm font-medium">{item.label}</span>
                </div>
              );
            })}
          </div>

          {/* Call to action */}
          <a
            href="#projects"
            className="inline-block mt-4 px-8 py-3 rounded-full bg-gradient-to-r from-cyan-500 to-purple-500 text-black font-semibold hover:scale-105 transition-all duration-300"
          >
            See My Work
          </a>

          {/* Subtle background shape */}
          <div className="absolute -top-20 -left-20 w-[300px] h-[300px] bg-gradient-to-br from-cyan-500 to-purple-500 opacity-20 rounded-full blur-3xl"></div>
          <div className="absolute -bottom-20 -right-20 w-[300px] h-[300px] bg-gradient-to-br from-pink-500 to-purple-500 opacity-20 rounded-full blur-3xl"></div>
          {/* Fun facts and achievments */}
        <div className="relative py-20 px-6 bg-black text-white">
          <div className="max-w-5xl mx-auto text-center">

            <div className="grid grid-cols-2 md:grid-cols-5 gap-8">
              {[
                { number: "45+", label: "Repositories" },
                { number: "15+", label: "Products completed" },
                { number: "100K+", label: "Lines of Code" },
                { number: "50+", label: "Data Pipelines Deployed" },
                { number: "∞", label: "Cups of Coffee" },
              ].map((stat, index) => (
                <div
                  key={index}
                  className="bg-white/5 border border-white/10 rounded-2xl p-4 hover:scale-105 transition-transform duration-300"
                >
                  <h3 className="text-3xl font-bold mb-1">{stat.number}</h3>
                  <p className="text-gray-400">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
        </div>

        {/* <ScrollVelocity
            texts={['React Bits', 'Scroll Down']} 
            velocity={100} 
            className="custom-scroll-text"
          /> */}

        {/* Skills Section */}
        <section
          ref={skillsRef}
          className="relative py-20 px-6 bg-black text-white overflow-hidden"
        >
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold mb-4">
                Technical Expertise
              </h2>
              <p className="text-gray-400 max-w-2xl mx-auto">
                Mastering the intersection of data science, machine learning,
                and modern web development.
              </p>
              <div className="h-1 w-20 bg-gradient-to-r from-cyan-400 to-purple-500 rounded-full mx-auto mt-4 animate-pulse"></div>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {skills.map((skill, index) => {
                const Icon = skill.icon;
                return (
                  <div
                    key={index}
                    className="skill-card p-4 rounded-2xl bg-white/5 border border-white/10 hover:scale-105 transition-transform duration-300 cursor-pointer "
                  >
                    <div className="flex items-center mb-4">
                      <div
                        className={`p-3 rounded-xl bg-gradient-to-r ${skill.color} bg-opacity-20 mr-4`}
                      >
                        <Icon size={24} className={skill.iconColor} />
                      </div>
                      <div>
                        <h3 className="text-xl font-semibold">{skill.name}</h3>
                        <p className="text-gray-400 text-sm">
                          {skill.level}% Proficiency
                        </p>
                      </div>
                    </div>
                    <div className="w-full bg-gray-700 rounded-full h-2 overflow-hidden">
                      <div
                        className={`skill-bar h-2 rounded-full bg-gradient-to-r ${skill.color}`}
                          style={{ width: `0%` }} 
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Projects Section */}
        <section
          id="projects"
          ref={projectsRef}
          className="relative py-20 px-6 bg-gradient-to-b from-black via-gray-900 to-black text-white"
        >
          <div className="max-w-6xl mx-auto text-center mb-12"></div>
          <Projects />
        </section>

        {/* Blog post area */}
        <section className="relative py-20 px-6 bg-gradient-to-b from-black via-gray-900 to-black text-white">
          <div className="max-w-6xl mx-auto text-center">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              Insights & Articles
            </h2>
            <p className="text-gray-400 max-w-2xl mx-auto mb-12">
              Sharing knowledge about data science, design, and modern
              engineering.
            </p>
            <div className="h-1 w-20 bg-gradient-to-r from-cyan-500 to-purple-500 rounded-full mx-auto mb-12 animate-pulse"></div>

            <div className="grid md:grid-cols-2 gap-8">
              {[
                {
                  title: "Building Scalable ML Platforms with Kubernetes",
                  link: "#",
                },
                {
                  title: "Designing Data-Driven Dashboards Users Actually Love",
                  link: "#",
                },
              ].map((post, index) => (
                <a
                  key={index}
                  href={post.link}
                  className="block bg-white/5 border border-white/10 rounded-2xl p-6 text-left hover:scale-105 transition-transform duration-300"
                >
                  <h3 className="text-lg font-semibold mb-2">{post.title}</h3>
                  <p className="text-gray-500 text-sm">Read more →</p>
                </a>
              ))}
            </div>
          </div>
        </section>

        

        {/* Contact Section */}
        <section className="relative py-20 px-6 bg-black text-white">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Let’s Build Something Amazing
            </h2>
            <p className="text-gray-400 text-lg mb-12 max-w-2xl mx-auto">
              Ready to turn your data into powerful web experiences? Let’s
              discuss your next project.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="mailto:kayikalvin@gmail.com"
                className="px-8 py-4 rounded-full bg-gradient-to-r from-cyan-500 to-purple-500 font-semibold text-black hover:scale-105 transition-transform duration-300"
              >
                Get In Touch
              </a>
              <a
                href="/resume.pdf"
                target="_blank"
                rel="noopener noreferrer"
                className="px-8 py-4 border-2 border-gray-600 rounded-full font-semibold text-white hover:bg-white hover:text-black transition-all duration-300"
              >
                View Resume
              </a>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="relative z-10 py-8 px-6 border-t border-gray-800">
          <div className="max-w-6xl mx-auto flex flex-col md:flex-row gap-4 justify-between items-center">
            <p className="text-gray-400 mb-4 md:mb-0">
              © 2025 Kayi Kalvin. All rights reserved
            </p>
            <div className="flex space-x-6">
              <a
                href="#"
                className="text-gray-400 hover:text-white transition-colors duration-300"
              >
                Privacy
              </a>
              <a
                href="#"
                className="text-gray-400 hover:text-white transition-colors duration-300"
              >
                Terms
              </a>
              <a
                href="#"
                className="text-gray-400 hover:text-white transition-colors duration-300"
              >
                Contact
              </a>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default App;

// import { Code, Database, Brain, BarChart3, Github, Linkedin, Mail, ExternalLink, ChevronDown, Terminal, Cpu, LineChart } from 'lucide-react';
// import { useState, useEffect, useRef } from 'react';

// const App = () => {
//   const heroRef = useRef(null);
//   const skillsRef = useRef(null);
//   const projectsRef = useRef(null);
//   const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
//   const [isLoaded, setIsLoaded] = useState(false);
//   const [showReveal, setShowReveal] = useState(true);
//   const [revealProgress, setRevealProgress] = useState(0);

//   useEffect(() => {
//     // Page reveal sequence
//     const revealSequence = async () => {
//       // Progress animation
//       const progressInterval = setInterval(() => {
//         setRevealProgress(prev => {
//           if (prev >= 100) {
//             clearInterval(progressInterval);
//             return 100;
//           }
//           return prev + 2;
//         });
//       }, 50);

//       // Wait for progress to complete
//       setTimeout(() => {
//         setShowReveal(false);
//         setIsLoaded(true);
//       }, 3000);
//     };

//     revealSequence();

//     // Mouse tracking for interactive effects
//     const handleMouseMove = (e) => {
//       setMousePosition({ x: e.clientX, y: e.clientY });
//     };

//     window.addEventListener('mousemove', handleMouseMove);

//     // Scroll animations
//     const observerOptions = {
//       threshold: 0.1,
//       rootMargin: '0px 0px -100px 0px'
//     };

//     const observer = new IntersectionObserver((entries) => {
//       entries.forEach(entry => {
//         if (entry.isIntersecting) {
//           entry.target.classList.add('animate-fade-in');
//         }
//       });
//     }, observerOptions);

//     document.querySelectorAll('.scroll-animate').forEach(el => {
//       observer.observe(el);
//     });

//     return () => {
//       window.removeEventListener('mousemove', handleMouseMove);
//       observer.disconnect();
//     };
//   }, []);

//   const skills = [
//     { name: 'Python', level: 95, icon: Code, color: 'from-blue-500 to-cyan-500', iconColor: 'text-blue-400' },
//     { name: 'JavaScript/React', level: 90, icon: Code, color: 'from-yellow-500 to-orange-500', iconColor: 'text-yellow-400' },
//     { name: 'Machine Learning', level: 88, icon: Brain, color: 'from-purple-500 to-pink-500', iconColor: 'text-purple-400' },
//     { name: 'Data Analysis', level: 92, icon: BarChart3, color: 'from-green-500 to-emerald-500', iconColor: 'text-green-400' },
//     { name: 'SQL/NoSQL', level: 85, icon: Database, color: 'from-red-500 to-rose-500', iconColor: 'text-red-400' },
//     { name: 'Cloud/DevOps', level: 80, icon: Cpu, color: 'from-indigo-500 to-blue-500', iconColor: 'text-indigo-400' }
//   ];

//   const projects = [
//     {
//       title: 'Real-time Analytics Dashboard',
//       description: 'Interactive dashboard processing 1M+ data points with live visualizations using React, D3.js, and WebSocket connections.',
//       tech: ['React', 'D3.js', 'Python', 'FastAPI', 'Redis'],
//       gradient: 'from-blue-600 via-purple-600 to-pink-600'
//     },
//     {
//       title: 'ML Model Deployment Platform',
//       description: 'Full-stack platform for deploying and monitoring ML models with A/B testing capabilities and automated retraining.',
//       tech: ['TensorFlow', 'Docker', 'Kubernetes', 'React', 'PostgreSQL'],
//       gradient: 'from-green-600 via-teal-600 to-blue-600'
//     },
//     {
//       title: 'Data Pipeline Orchestrator',
//       description: 'Scalable ETL pipeline processing TB-scale data with fault tolerance and real-time monitoring dashboards.',
//       tech: ['Apache Airflow', 'Spark', 'Kafka', 'MongoDB', 'Grafana'],
//       gradient: 'from-orange-600 via-red-600 to-pink-600'
//     }
//   ];

//   return (
//     <div className="min-h-screen bg-black text-white overflow-x-hidden">
//       {/* Page Reveal Overlay */}
//       {showReveal && (
//         <div className="fixed inset-0 z-50 bg-black flex items-center justify-center">
//           {/* Animated Background */}
//           <div className="absolute inset-0">
//             <div className="absolute inset-0 bg-gradient-to-br from-blue-900 via-purple-900 to-pink-900 opacity-20" />
//             <div className="absolute inset-0 bg-gradient-to-r from-transparent via-blue-500 to-transparent opacity-10 animate-pulse" />

//             {/* Floating Particles */}
//             {[...Array(20)].map((_, i) => (
//               <div
//                 key={i}
//                 className="absolute w-2 h-2 bg-white rounded-full opacity-30 animate-bounce"
//                 style={{
//                   left: `${Math.random() * 100}%`,
//                   top: `${Math.random() * 100}%`,
//                   animationDelay: `${Math.random() * 2}s`,
//                   animationDuration: `${2 + Math.random() * 2}s`
//                 }}
//               />
//             ))}
//           </div>

//           {/* Main Content */}
//           <div className="relative z-10 text-center max-w-4xl mx-auto px-6">
//             {/* Logo Animation */}
//             <div className="mb-12">
//               <div className="relative inline-block">
//                 <div className="absolute inset-0 blur-2xl bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 opacity-50 animate-pulse" />
//                 <h1 className="relative text-6xl md:text-8xl font-bold bg-gradient-to-r from-white via-blue-200 to-purple-200 bg-clip-text text-transparent animate-pulse">
//                   KK
//                 </h1>
//               </div>
//             </div>

//             {/* Animated Text */}
//             <div className="mb-12 space-y-4">
//               <div className="overflow-hidden">
//                 <p className="text-2xl md:text-3xl font-light text-blue-300 animate-slide-up">
//                   Welcome to my portfolio
//                 </p>
//               </div>
//               <div className="overflow-hidden">
//                 <p className="text-lg text-gray-400 animate-slide-up delay-300">
//                   Data Science • Web Development • Machine Learning
//                 </p>
//               </div>
//             </div>

//             {/* Progress Bar */}
//             <div className="relative w-64 h-2 mx-auto bg-gray-800 rounded-full overflow-hidden">
//               <div
//                 className="absolute left-0 top-0 h-full bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 transition-all duration-300 ease-out"
//                 style={{ width: `${revealProgress}%` }}
//               />
//               <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-30 animate-shimmer" />
//             </div>

//             {/* Loading Text */}
//             <p className="mt-6 text-sm text-gray-500 animate-pulse">
//               {revealProgress < 30 ? 'Initializing...' :
//                revealProgress < 60 ? 'Loading experience...' :
//                revealProgress < 90 ? 'Almost ready...' : 'Welcome!'}
//             </p>

//             {/* Geometric Animations */}
//             <div className="absolute inset-0 pointer-events-none">
//               <div className="absolute top-1/4 left-1/4 w-32 h-32 border border-blue-500 opacity-20 animate-spin-slow" />
//               <div className="absolute bottom-1/4 right-1/4 w-24 h-24 border-2 border-purple-500 opacity-30 animate-pulse" />
//               <div className="absolute top-1/2 right-1/3 w-16 h-16 bg-gradient-to-r from-pink-500 to-purple-500 opacity-10 rounded-full animate-bounce" />
//             </div>
//           </div>
//         </div>
//       )}

//       {/* Main Site Content */}
//       <div className={`transition-all duration-1000 ${showReveal ? 'opacity-0 scale-95' : 'opacity-100 scale-100'}`}>
//         {/* Animated Background */}
//         <div className="fixed inset-0 z-0">
//           <div
//             className="absolute inset-0 opacity-30"
//             style={{
//               background: `radial-gradient(circle at ${mousePosition.x}px ${mousePosition.y}px, rgba(139, 92, 246, 0.15) 0%, transparent 50%)`
//             }}
//           />
//           <div className="absolute inset-0 bg-gradient-to-br from-black via-gray-900 to-black">
//             <div className="absolute inset-0 opacity-20">
//               <div className="absolute inset-0" style={{
//                 backgroundImage: `radial-gradient(circle at 20% 20%, rgba(120, 119, 198, 0.1) 0%, transparent 50%),
//                                  radial-gradient(circle at 80% 80%, rgba(255, 119, 198, 0.1) 0%, transparent 50%),
//                                  radial-gradient(circle at 40% 40%, rgba(120, 219, 255, 0.1) 0%, transparent 50%)`
//               }} />
//             </div>
//           </div>
//         </div>

//         {/* Hero Section */}
//         <section ref={heroRef} className="relative z-10 min-h-screen flex items-center justify-center px-6">
//           <div className={`text-center max-w-4xl mx-auto transition-all duration-2000 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
//             <div className="mb-8 relative">
//               <div className="absolute inset-0 blur-3xl bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 opacity-30 animate-pulse" />
//               <h1 className="relative text-6xl md:text-8xl font-bold bg-gradient-to-r from-white via-blue-200 to-purple-200 bg-clip-text text-transparent mb-4">
//                 Kalvin Kayi
//               </h1>
//             </div>

//             <div className="space-y-2 mb-8">
//               <p className="text-xl md:text-2xl text-gray-300 font-light">
//                 Data Web Developer • ML Engineer • Data Analyst
//               </p>
//               <p className="text-lg text-gray-400 max-w-2xl mx-auto leading-relaxed">
//                 Transforming complex data into intelligent web experiences.
//                 Building the future where data science meets beautiful user interfaces.
//               </p>
//             </div>

//             <div className="flex flex-wrap justify-center gap-4 mb-12">
//               {[
//                 { icon: Code, label: 'Full-Stack Dev', color: 'from-blue-500 to-cyan-500', iconColor: 'text-blue-400' },
//                 { icon: Brain, label: 'ML Engineer', color: 'from-purple-500 to-pink-500', iconColor: 'text-purple-400' },
//                 { icon: BarChart3, label: 'Data Analyst', color: 'from-green-500 to-emerald-500', iconColor: 'text-green-400' }
//               ].map((item, index) => (
//                 <div
//                   key={index}
//                   className={`group px-6 py-3 rounded-full bg-gradient-to-r ${item.color} bg-opacity-10 border border-white border-opacity-20 hover:bg-opacity-20 transition-all duration-300 hover:scale-105 hover:shadow-lg`}
//                 >
//                   <div className="flex items-center space-x-2">
//                     <item.icon size={20} className={item.iconColor} />
//                     <span className="text-white font-medium">{item.label}</span>
//                   </div>
//                 </div>
//               ))}
//             </div>

//             <div className="flex justify-center space-x-6">
//               {[
//                 { icon: Github, href: 'https://github.com/kayikalvin', label: 'GitHub' },
//                 { icon: Linkedin, href: 'https://www.linkedin.com/in/kayikalvin/', label: 'LinkedIn' },
//                 { icon: Mail, href: 'mailto:kayikalvin@gmail.com', label: 'Email' }
//               ].map((social, index) => (
//                 <a
//                   key={index}
//                   href={social.href}
//                   className="group relative p-4 rounded-full bg-white bg-opacity-5 hover:bg-opacity-10 transition-all duration-300 hover:scale-110 hover:shadow-xl"
//                 >
//                   <social.icon size={24} className="text-white group-hover:text-blue-400 transition-colors duration-300" />
//                   <div className="absolute -bottom-12 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
//                     <span className="text-sm text-gray-400">{social.label}</span>
//                   </div>
//                 </a>
//               ))}
//             </div>
//           </div>

//           <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
//             <ChevronDown size={32} className="text-gray-400" />
//           </div>
//         </section>

//         {/* Skills Section */}
//         <section ref={skillsRef} className="relative z-10 py-20 px-6">
//           <div className="max-w-6xl mx-auto">
//             <div className="scroll-animate opacity-0 translate-y-10 transition-all duration-1000">
//               <h2 className="text-4xl md:text-5xl font-bold text-center mb-4">
//                 <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
//                   Technical Expertise
//                 </span>
//               </h2>
//               <p className="text-gray-400 text-center mb-16 max-w-2xl mx-auto">
//                 Mastering the intersection of data science, machine learning, and modern web development
//               </p>
//             </div>

//             <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
//               {skills.map((skill, index) => (
//                 <div
//                   key={index}
//                   className="scroll-animate opacity-0 translate-y-10 transition-all duration-1000 group"
//                   style={{ transitionDelay: `${index * 100}ms` }}
//                 >
//                   <div className="relative p-6 rounded-2xl bg-gradient-to-br from-gray-900 to-gray-800 border border-gray-700 hover:border-gray-600 transition-all duration-300 hover:transform hover:scale-105 hover:shadow-2xl">
//                     <div className="flex items-center mb-4">
//                       <div className={`p-3 rounded-xl bg-gradient-to-r ${skill.color} bg-opacity-20 mr-4`}>
//                         <skill.icon size={24} className={skill.iconColor} />
//                       </div>
//                       <div>
//                         <h3 className="text-xl font-semibold text-white">{skill.name}</h3>
//                         <p className="text-gray-400 text-sm">{skill.level}% Proficiency</p>
//                       </div>
//                     </div>

//                     <div className="relative">
//                       <div className="w-full bg-gray-700 rounded-full h-2 mb-2">
//                         <div
//                           className={`h-2 rounded-full bg-gradient-to-r ${skill.color} transition-all duration-2000 group-hover:animate-pulse`}
//                           style={{ width: `${skill.level}%` }}
//                         />
//                       </div>
//                     </div>
//                   </div>
//                 </div>
//               ))}
//             </div>
//           </div>
//         </section>

//         {/* Projects Section */}
//         <section ref={projectsRef} className="relative z-10 py-20 px-6 bg-gradient-to-b from-gray-900 to-black">
//           <div className="max-w-6xl mx-auto">
//             <div className="scroll-animate opacity-0 translate-y-10 transition-all duration-1000">
//               <h2 className="text-4xl md:text-5xl font-bold text-center mb-4">
//                 <span className="bg-gradient-to-r from-green-400 to-blue-400 bg-clip-text text-transparent">
//                   Featured Projects
//                 </span>
//               </h2>
//               <p className="text-gray-400 text-center mb-16 max-w-2xl mx-auto">
//                 Real-world applications showcasing the power of data-driven web development
//               </p>
//             </div>

//             <div className="space-y-12">
//               {projects.map((project, index) => (
//                 <div
//                   key={index}
//                   className="scroll-animate opacity-0 translate-y-10 transition-all duration-1000 group"
//                   style={{ transitionDelay: `${index * 200}ms` }}
//                 >
//                   <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-gray-900 to-gray-800 border border-gray-700 hover:border-gray-600 transition-all duration-500 hover:transform hover:scale-[1.02] hover:shadow-2xl">
//                     <div className={`absolute inset-0 bg-gradient-to-r ${project.gradient} opacity-5 group-hover:opacity-10 transition-opacity duration-500`} />

//                     <div className="relative p-8 md:p-12">
//                       <div className="flex flex-col md:flex-row md:items-center justify-between mb-6">
//                         <h3 className="text-2xl md:text-3xl font-bold text-white mb-4 md:mb-0">
//                           {project.title}
//                         </h3>
//                         <div className="flex space-x-3">
//                           <button className="p-2 rounded-lg bg-white bg-opacity-10 hover:bg-opacity-20 transition-all duration-300 hover:scale-110">
//                             <Github size={20} className="text-white" />
//                           </button>
//                           <button className="p-2 rounded-lg bg-white bg-opacity-10 hover:bg-opacity-20 transition-all duration-300 hover:scale-110">
//                             <ExternalLink size={20} className="text-white" />
//                           </button>
//                         </div>
//                       </div>

//                       <p className="text-gray-300 text-lg mb-6 leading-relaxed">
//                         {project.description}
//                       </p>

//                       <div className="flex flex-wrap gap-3">
//                         {project.tech.map((tech, techIndex) => (
//                           <span
//                             key={techIndex}
//                             className="px-4 py-2 rounded-full bg-white bg-opacity-10 text-sm font-medium text-white hover:bg-opacity-20 transition-all duration-300 hover:scale-105"
//                           >
//                             {tech}
//                           </span>
//                         ))}
//                       </div>
//                     </div>
//                   </div>
//                 </div>
//               ))}
//             </div>
//           </div>
//         </section>

//         {/* Contact Section */}
//         <section className="relative z-10 py-20 px-6">
//           <div className="max-w-4xl mx-auto text-center">
//             <div className="scroll-animate opacity-0 translate-y-10 transition-all duration-1000">
//               <h2 className="text-4xl md:text-5xl font-bold mb-6">
//                 <span className="bg-gradient-to-r from-pink-400 to-purple-400 bg-clip-text text-transparent">
//                   Let's Build Something Amazing
//                 </span>
//               </h2>
//               <p className="text-gray-400 text-lg mb-12 max-w-2xl mx-auto">
//                 Ready to turn your data into powerful web experiences? Let's discuss your next project.
//               </p>

//               <div className="flex flex-col sm:flex-row gap-4 justify-center">
//                 <button className="group px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full font-semibold text-white hover:from-blue-700 hover:to-purple-700 transition-all duration-300 hover:scale-105 hover:shadow-xl">
//                   <span className="flex items-center justify-center space-x-2">
//                     <Mail size={20} />
//                     <span>Get In Touch</span>
//                   </span>
//                 </button>
//                 <button className="group px-8 py-4 border-2 border-gray-600 rounded-full font-semibold text-white hover:border-gray-500 hover:bg-white hover:bg-opacity-5 transition-all duration-300 hover:scale-105">
//                   <span className="flex items-center justify-center space-x-2">
//                     <span>View Resume</span>
//                     <Terminal size={20} />
//                   </span>
//                 </button>
//               </div>
//             </div>
//           </div>
//         </section>

//         {/* Footer */}
//         <footer className="relative z-10 py-8 px-6 border-t border-gray-800">
//           <div className="max-w-6xl mx-auto flex flex-col md:flex-row gap-4 justify-between items-center">
//             <p className="text-gray-400 mb-4 md:mb-0">
//               © 2025 Kayi Kalvin. All rights reserved
//             </p>
//             <div className="flex space-x-6">
//               <a href="#" className="text-gray-400 hover:text-white transition-colors duration-300">Privacy</a>
//               <a href="#" className="text-gray-400 hover:text-white transition-colors duration-300">Terms</a>
//               <a href="#" className="text-gray-400 hover:text-white transition-colors duration-300">Contact</a>
//             </div>
//           </div>
//         </footer>
//       </div>

//       <style>{`
//         @keyframes fade-in {
//           from {
//             opacity: 0;
//             transform: translateY(30px);
//           }
//           to {
//             opacity: 1;
//             transform: translateY(0);
//           }
//         }

//         @keyframes slide-up {
//           from {
//             opacity: 0;
//             transform: translateY(50px);
//           }
//           to {
//             opacity: 1;
//             transform: translateY(0);
//           }
//         }

//         @keyframes shimmer {
//           0% {
//             transform: translateX(-100%);
//           }
//           100% {
//             transform: translateX(100%);
//           }
//         }

//         @keyframes spin-slow {
//           from {
//             transform: rotate(0deg);
//           }
//           to {
//             transform: rotate(360deg);
//           }
//         }

//         .animate-fade-in {
//           animation: fade-in 1s ease-out forwards;
//         }

//         .animate-slide-up {
//           animation: slide-up 1s ease-out forwards;
//         }

//         .animate-shimmer {
//           animation: shimmer 2s infinite;
//         }

//         .animate-spin-slow {
//           animation: spin-slow 10s linear infinite;
//         }

//         .delay-300 {
//           animation-delay: 0.3s;
//         }
//       `}</style>
//     </div>
//   );
// };

// export default App;

// import React from 'react'
// import { useRef, useEffect } from "react";
// import gsap from "gsap";

// const App = () => {
//   const boxRef = useRef();

//   useEffect(() => {
//     gsap.to(boxRef.current, { x: 200, duration: 1 });
//   }, []);

//   return (
//   <div className="h-screen w-screen overflow-hidden " ref={boxRef} >Animate me</div>
//   )
// }

// export default App

// import React, { useRef, useEffect } from 'react';
// import { gsap } from 'gsap';

// function App() {
//   // Single element reference
//   const boxRef = useRef(null);

//   // Multiple elements reference
//   const itemsRef = useRef([]);

//   useEffect(() => {
//     // Target single element
//     gsap.to(boxRef.current, {
//       duration: 2,
//       x: 100,
//       rotation: 360
//     });

//     // Target multiple elements
//     gsap.to(itemsRef.current, {
//       duration: 1,
//       y: -50,
//       stagger: 0.2
//     });
//   }, []);

//   // Helper function to add refs to array
//   const addToRefs = (el) => {
//     if (el && !itemsRef.current.includes(el)) {
//       itemsRef.current.push(el);
//     }
//   };

//   return (
//     <div>
//       <div ref={boxRef} className="box">Single Box</div>

//       {[1, 2, 3, 4, 5].map((item, index) => (
//         <div
//           key={index}
//           ref={addToRefs}
//           className="item"
//         >
//           Item {item}
//         </div>
//       ))}
//     </div>
//   );
// }

// const App = () => {

//   // Single element reference
//   const boxRef = useRef(null);

//   // Multiple elements reference
//   const itemsRef = useRef([]);

//   useEffect(() => {
//     // Target single element
//     gsap.to(boxRef.current, {
//       duration: 2,
//       x: 100,
//       rotation: 360
//     });

//     // Target multiple elements
//     gsap.to(itemsRef.current, {
//       duration: 1,
//       y: -50,
//       stagger: 0.2
//     });
//   }, []);

//   // Helper function to add refs to array
//   const addToRefs = (el) => {
//     if (el && !itemsRef.current.includes(el)) {
//       itemsRef.current.push(el);
//     }
//   };
//   return (
//     <div>
//       <div ref={boxRef} className=" bg-black">Single Box</div>

//       {[1, 2, 3, 4, 5].map((item, index) => (
//         <div
//           key={index}
//           ref={addToRefs}
//           className="bg-green-400"
//         >
//           Item {item}
//         </div>
//       ))}
//     </div>
//   )
// }

// export default App

// const App = () => {
//    const boxRef = useRef(null);

//   useEffect(() => {
//     const element = boxRef.current;

//     // Create animation
//     const animation = gsap.to(element, {
//       duration: 8,
//       x: 100,
//       rotation: -90,
//       scale: 1.0,
//       ease: "bounce.out"
//     });

//     // Cleanup function (optional but recommended)
//     return () => {
//       animation.kill(); // Stop animation if component unmounts
//     };
//   }, []); // Empty dependency array = run once on mount
//   return (
//     <div ref={boxRef} className="min-h-full w-full m-10 items-center">Animated Box</div>
//   )
// }

// export default App

//

// const App = ({ color }) => {
//   const containerRef = useRef(null);
//   const box1Ref = useRef(null);
//   const box2Ref = useRef(null);
//   const box3Ref = useRef(null);

//   useEffect(() => {
//     const tl = gsap.timeline();

//     tl.to(box1Ref.current, { duration: 1, x: 100, rotation: -90 })
//       .to(box2Ref.current, { duration: 1, x: 100, scale: 1.5 })
//       .to(box3Ref.current, { duration: 1, x: 100, skewX: 45 });
//     return () => tl.kill();
//   }, []);

//   return (
//     <div className='flex flex-col h-full w-full p-40 m-20' ref={containerRef}>
//       <div ref={box1Ref} className="bg-blue-400">Box 1</div>
//       <div ref={box2Ref} className="bg-amber-400">Box 2</div>
//       <div ref={box3Ref} className="bg-amber-700">Box 3</div>
//     </div>
//   )
// }

// export default App

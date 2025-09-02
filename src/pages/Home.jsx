import { Code, Brain, BarChart3 } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { Analytics } from "@vercel/analytics/react";
import Projects from "../components/Projects";
import { skills } from "../utils/utils";
import { posts } from "../utils/utils";
import Floatingnavbar from "../components/Floatingnavbar";

const Home = () => {
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
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      {
        threshold: 0.3,
      }
    );

    if (skillsRef.current) {
      observer.observe(skillsRef.current);
    }

    return () => {
      if (skillsRef.current) {
        observer.unobserve(skillsRef.current);
      }
    };
  }, []);

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
                  Kalvin Kayi.
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
        <div id="home">
          <Floatingnavbar />
          <div
            ref={heroRef}
            className="relative h-full flex flex-col items-center justify-center pt-38 md:pt-52 px-4 md:px-0 bg-black text-white overflow-hidden"
          >
            {/* Headline */}
            <h1 className="hero-title text-center text-6xl md:text-7xl font-extrabold mb-4 tracking-tight">
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
              className="inline-block mt-4 text-white px-8 py-3 rounded-full bg-gradient-to-r from-cyan-500 to-purple-500  font-semibold hover:scale-105 transition-all duration-300"
            >
              See My Work
            </a>

            {/* Fun facts and achievments */}
            <div className="relative py-20 px-6 bg-black text-white">
              <div className="max-w-5xl mx-auto text-center">
                <div className="grid grid-cols-1 md:grid-cols-5 gap-8">
                  {[
                    { number: "45+", label: "Repositories" },
                    { number: "15+", label: "Products completed" },
                    { number: "100K+", label: "Lines of Code" },
                    { number: "50+", label: "Data Pipelines Deployed" },
                    { number: "∞", label: "Cups of Coffee" },
                  ].map((stat, index) => (
                    <div
                      key={index}
                      className="bg-white/5 border border-white/10 rounded-2xl p-2 md:p-4 hover:scale-105 transition-transform duration-300"
                    >
                      <h3 className="text-xl md:text-3xl font-bold mb-1">
                        {stat.number}
                      </h3>
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

          {/* About Me Section */}
          <section className="relative max-w-6xl mx-auto px-6 py-16 grid grid-cols-1 md:grid-cols-2 items-center gap-12 text-white">
            {/* Text Section */}
            <div className="flex flex-col space-y-6">
              <h2 className="text-4xl font-bold bg-gradient-to-r from-orange-400 via-pink-500 to-purple-500 bg-clip-text text-transparent">
                About Me
              </h2>

              <p className="text-base text-gray-300 leading-relaxed">
                Hi, I’m{" "}
                <span className="font-semibold bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text text-transparent">
                  Kalvin
                </span>
                — driven by curiosity and a problem-solving mindset. I
                specialize in transforming complex data into meaningful insights
                and building intelligent applications that make an impact. My
                experience spans AI-powered solutions like fact-checking APIs,
                predictive healthcare models, and real-time platforms for
                industries such as finance and real estate.
              </p>

              <p className="text-base text-gray-300 leading-relaxed">
                Working at the intersection of machine learning and full-stack
                development, I thrive on creating scalable, user-friendly
                systems—from NLP and deep learning to cloud deployment and
                modern web frameworks. My goal is not only to solve today’s
                challenges but to anticipate tomorrow’s.
              </p>
            </div>

            {/* Image Section */}
            <div className="flex justify-center">
              <img
                src="/1735390396166-removebg.png"
                alt="Kalvin"
                className="rounded-2xl shadow-lg w-72 h-72 object-cover border-4 border-white/60 backdrop-blur-lg"
              />
            </div>
          </section>

          {/* Skills Section */}
          <section
            id="skills"
            ref={skillsRef}
            className="relative py-16 sm:py-20 px-4 sm:px-6 bg-black text-white overflow-hidden"
          >
            {/* Background decorative elements */}
            <div className="absolute inset-0 bg-gradient-to-b from-gray-900/20 to-transparent"></div>
            <div className="absolute top-1/4 right-1/4 w-72 h-72 bg-purple-500/10 rounded-full blur-3xl"></div>
            <div className="absolute bottom-1/4 left-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl"></div>

            <div className="max-w-6xl mx-auto relative z-10">
              <div className="text-center mb-12 sm:mb-16">
                <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                  Technical Expertise
                </h2>
                <p className="text-gray-400 max-w-2xl mx-auto text-sm sm:text-base">
                  Mastering the intersection of data science, machine learning,
                  and modern web development.
                </p>
                <div className="h-1 w-16 sm:w-20 bg-gradient-to-r from-cyan-400 to-purple-500 rounded-full mx-auto mt-4 animate-pulse"></div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-6 sm:gap-8">
                {skills.map((skill, index) => {
                  const Icon = skill.icon;
                  return (
                    <div
                      key={index}
                      className="group p-4 sm:p-6 rounded-2xl bg-white/5 border border-white/10 hover:border-white/20 hover:bg-white/10 transition-all duration-300 cursor-pointer backdrop-blur-sm"
                      style={{
                        animationDelay: `${index * 0.1}s`,
                      }}
                    >
                      <div className="flex items-center mb-4 sm:mb-6">
                        <div
                          className={`p-2 sm:p-3 rounded-xl bg-gradient-to-r ${skill.color} bg-opacity-20 mr-3 sm:mr-4 group-hover:scale-110 transition-transform duration-300`}
                        >
                          <Icon
                            size={20}
                            className={`sm:w-6 sm:h-6 ${skill.iconColor}`}
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="text-lg sm:text-xl font-semibold mb-1 truncate">
                            {skill.name}
                          </h3>
                          <p className="text-gray-400 text-xs sm:text-sm">
                            {skill.level}% Proficiency
                          </p>
                        </div>
                      </div>

                      {/* Progress bar */}
                      <div className="w-full bg-gray-700/50 rounded-full h-2 overflow-hidden mb-2">
                        <div
                          className={`skill-bar h-2 rounded-full bg-gradient-to-r ${skill.color} transition-all duration-1000 ease-out`}
                          style={{
                            width: isVisible ? `${skill.level}%` : "0%",
                            transitionDelay: `${index * 0.1}s`,
                          }}
                        />
                      </div>

                      {/* Percentage indicator */}
                      <div className="text-right">
                        <span
                          className={`text-xs font-medium ${skill.iconColor} opacity-0 group-hover:opacity-100 transition-opacity duration-300`}
                        >
                          {skill.level}%
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Bottom decorative line */}
              <div className="mt-16 sm:mt-20 text-center">
                <div className="inline-block h-px w-32 sm:w-48 bg-gradient-to-r from-transparent via-gray-500 to-transparent"></div>
              </div>
            </div>
          </section>

          {/* Subtle background shape */}
          <div className="absolute -top-30 -left-30 w-[400px] h-[400px] bg-gradient-to-br from-cyan-500 to-purple-500 opacity-20 rounded-full blur-3xl"></div>
          <div className="absolute -bottom-50 -right-50 w-[600px] h-[600px] bg-gradient-to-br from-pink-500 to-purple-500 opacity-20 rounded-full blur-3xl"></div>
          {/* <div
            className="absolute -top-10 left-1/3 w-64 h-64 bg-gradient-to-b from-cyan-400 to-blue-500 opacity-20 rounded-full blur-3xl"
            style={{ clipPath: "ellipse(50% 50% at 50% 0%)" }}
          ></div> */}
        </div>

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
        <section
          id="blog"
          className="relative py-20 px-6 bg-gradient-to-b from-black via-gray-900 to-black text-white"
        >
          <div className="max-w-6xl mx-auto text-center">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              Insights & Articles
            </h2>
            <p className="text-gray-400 max-w-2xl mx-auto mb-12">
              Sharing knowledge about data science, design, and modern
              engineering.
            </p>
            <div className="h-1 w-20 bg-gradient-to-r from-cyan-500 to-purple-500 rounded-full mx-auto mb-12 animate-pulse"></div>

            {/* <div className="grid md:grid-cols-2 gap-8">
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
            </div> */}
            <div className="grid md:grid-cols-2 gap-8">
              {posts.map((post, index) => (
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
                href="/Alvin Kayi CV.pdf"
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
        <footer
          className="relative z-10 py-8 px-6  bg-blue-200/40 text-white"
          style={{
            clipPath:
              "polygon(0 10%, 20% 0, 45% 20%, 75% 10%, 100% 10%, 100% 100%, 0 100%)",
          }}
        >
          <div className="max-w-6xl mx-auto flex flex-col md:flex-row gap-4 justify-between items-center">
            <p className="text-white font-bold mb-4 md:mb-0">
              © 2025 Kayi Kalvin. All rights reserved
            </p>
            <div className="flex space-x-6">
              <a
                href="#"
                className="text-white font-bold hover:text-gray-400 transition-colors duration-300"
              >
                Privacy
              </a>
              <a
                href="#"
                className="text-white font-bold hover:text-gray-400 transition-colors duration-300"
              >
                Terms
              </a>
              <a
                href="#"
                className="text-white font-bold hover:text-gray-400 transition-colors duration-300"
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

export default Home;

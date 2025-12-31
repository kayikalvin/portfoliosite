// import { Code, Brain, BarChart3 } from "lucide-react";
// import { useState, useEffect, useRef } from "react";
// import Projects from "../components/Projects";
// import { skills } from "../utils/utils";
// import { posts } from "../utils/utils";
// import Floatingnavbar from "../components/Floatingnavbar";
// import PaypalDonate from "../components/PaypalDonate";
// import EnhancedSkillsSection from "../components/EnhancedSkillsSection";

// const Home = () => {
//   const heroRef = useRef(null);
//   const skillsRef = useRef(null);
//   const projectsRef = useRef(null);
//   const revealRef = useRef(null);
//   const logoRef = useRef(null);
//   const progressRef = useRef(null);
//   const mainContentRef = useRef(null);
//   const particlesRef = useRef([]);

//   const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
//   const [showReveal, setShowReveal] = useState(true);
//   const [gsapLoaded, setGsapLoaded] = useState(false);
//   const [isVisible, setIsVisible] = useState(false);

//   useEffect(() => {
//     const observer = new IntersectionObserver(
//       ([entry]) => {
//         if (entry.isIntersecting) {
//           setIsVisible(true);
//         }
//       },
//       {
//         threshold: 0.3,
//       }
//     );

//     if (skillsRef.current) {
//       observer.observe(skillsRef.current);
//     }

//     return () => {
//       if (skillsRef.current) {
//         observer.unobserve(skillsRef.current);
//       }
//     };
//   }, []);

//   // Initialize GSAP
//   useEffect(() => {
//     const loadGSAP = async () => {
//       // Load GSAP from CDN
//       const script = document.createElement("script");
//       script.src =
//         "https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/gsap.min.js";
//       script.onload = () => {
//         const scrollScript = document.createElement("script");
//         scrollScript.src =
//           "https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/ScrollTrigger.min.js";
//         scrollScript.onload = () => {
//           window.gsap.registerPlugin(window.ScrollTrigger);
//           setGsapLoaded(true);
//         };
//         document.head.appendChild(scrollScript);
//       };
//       document.head.appendChild(script);
//     };

//     loadGSAP();
//   }, []);

//   // GSAP Animations
//   useEffect(() => {
//     if (!gsapLoaded || !window.gsap) return;

//     const gsap = window.gsap;
//     const ScrollTrigger = window.ScrollTrigger;

//     // Page Reveal Animation Timeline
//     const revealTL = gsap.timeline();

//     // Animate particles
//     particlesRef.current.forEach((particle, i) => {
//       if (particle) {
//         gsap.set(particle, {
//           x: Math.random() * window.innerWidth,
//           y: Math.random() * window.innerHeight,
//           scale: Math.random() * 0.5 + 0.5,
//           opacity: 0,
//         });

//         gsap.to(particle, {
//           opacity: 0.6,
//           duration: 1,
//           delay: i * 0.1,
//           ease: "power2.out",
//         });

//         gsap.to(particle, {
//           y: "-=100",
//           x: "+=50",
//           rotation: 360,
//           duration: 3 + Math.random() * 2,
//           repeat: -1,
//           yoyo: true,
//           ease: "sine.inOut",
//         });
//       }
//     });

//     // Logo animation
//     revealTL
//       .from(logoRef.current, {
//         scale: 0,
//         rotation: -180,
//         opacity: 0,
//         duration: 1,
//         ease: "back.out(1.7)",
//       })
//       .from(
//         ".reveal-text",
//         {
//           y: 50,
//           opacity: 0,
//           duration: 0.8,
//           stagger: 0.2,
//           ease: "power3.out",
//         },
//         "-=0.5"
//       )
//       .from(
//         ".geometric-shape",
//         {
//           scale: 0,
//           rotation: 180,
//           opacity: 0,
//           duration: 1,
//           stagger: 0.3,
//           ease: "elastic.out(1, 0.5)",
//         },
//         "-=0.5"
//       );

//     // Progress bar animation
//     gsap.to(progressRef.current, {
//       width: "100%",
//       duration: 2.5,
//       ease: "power2.inOut",
//       onComplete: () => {
//         // Reveal exit animation
//         gsap.to(revealRef.current, {
//           y: "-100%",
//           duration: 1,
//           ease: "power4.inOut",
//           onComplete: () => {
//             setShowReveal(false);

//             // Wait for DOM to fully render before animating hero
//             setTimeout(() => {
//               initMainAnimations();
//             }, 10); // small delay to ensure DOM is ready
//           },
//         });
//       },
//     });

//     // Shimmer effect on progress bar
//     gsap.to(".progress-shimmer", {
//       x: "200%",
//       duration: 1.5,
//       repeat: -1,
//       ease: "none",
//     });

//     const initMainAnimations = () => {
//       // Hero section entrance
//       const heroTL = gsap.timeline();

//       heroTL
//         .from(".hero-title", {
//           y: -100,
//           opacity: 0,
//           duration: 1.2,
//           ease: "power4.out",
//         })
//         .from(
//           ".hero-subtitle",
//           {
//             // y: 50,
//             opacity: 0,
//             duration: 1.4,
//             stagger: 0.2,
//             ease: "power3.out",
//           },
//           "-=0.8"
//         )
//         .fromTo(
//           ".hero-badge",
//           { scale: 0, opacity: 0 },
//           {
//             scale: 1,
//             opacity: 1,
//             duration: 0.8,
//             stagger: 0.1,
//             ease: "back.out(1.7)",
//           }
//         )
//         .fromTo(
//           ".social-icon",
//           { y: 30, opacity: 0 },
//           {
//             y: 0,
//             opacity: 1,
//             duration: 0.6,
//             stagger: 0.1,
//             ease: "power2.out",
//           },
//           "-=0.4"
//         );

//       // Scroll-triggered animations
//       ScrollTrigger.batch(".skill-card", {
//         onEnter: (elements) => {
//           gsap.from(elements, {
//             y: 100,
//             opacity: 0,
//             duration: 1,
//             stagger: 0.15,
//             ease: "power3.out",
//           });

//           // Animate skill bars
//           elements.forEach((element, i) => {
//             const skillBar = element.querySelector(".skill-bar");
//             const level = skills[i % skills.length].level;
//             gsap.to(skillBar, {
//               width: `${level}%`,
//               duration: 1.5,
//               delay: 0.5,
//               ease: "power2.out",
//             });
//           });
//         },
//         start: "top bottom-=100",
//       });

//       ScrollTrigger.batch(".project-card", {
//         onEnter: (elements) => {
//           gsap.from(elements, {
//             y: 100,
//             opacity: 0,
//             duration: 1.2,
//             stagger: 0.2,
//             ease: "power3.out",
//           });
//         },
//         start: "top bottom-=100",
//       });

//       // Continuous animations
//       gsap.to(".floating-shape-1", {
//         y: -20,
//         rotation: 5,
//         duration: 3,
//         repeat: -1,
//         yoyo: true,
//         ease: "sine.inOut",
//       });

//       gsap.to(".floating-shape-2", {
//         x: 15,
//         rotation: -5,
//         duration: 4,
//         repeat: -1,
//         yoyo: true,
//         ease: "sine.inOut",
//       });

//       gsap.to(".floating-shape-3", {
//         y: 15,
//         x: -10,
//         rotation: 10,
//         duration: 5,
//         repeat: -1,
//         yoyo: true,
//         ease: "sine.inOut",
//       });

//       // Mouse follower effect
//       const updateMousePosition = (e) => {
//         setMousePosition({ x: e.clientX, y: e.clientY });

//         gsap.to(".mouse-follower", {
//           x: e.clientX,
//           y: e.clientY,
//           duration: 0.1,
//           ease: "power2.out",
//         });
//       };

//       window.addEventListener("mousemove", updateMousePosition);

//       // Hover animations for interactive elements
//       document.querySelectorAll(".hover-scale").forEach((element) => {
//         element.addEventListener("mouseenter", () => {
//           gsap.to(element, {
//             scale: 1.05,
//             duration: 0.3,
//             ease: "power2.out",
//           });
//         });

//         element.addEventListener("mouseleave", () => {
//           gsap.to(element, {
//             scale: 1,
//             duration: 0.3,
//             ease: "power2.out",
//           });
//         });
//       });

//       document.querySelectorAll(".hover-lift").forEach((element) => {
//         element.addEventListener("mouseenter", () => {
//           gsap.to(element, {
//             y: -10,
//             duration: 0.3,
//             ease: "power2.out",
//           });
//         });

//         element.addEventListener("mouseleave", () => {
//           gsap.to(element, {
//             y: 0,
//             duration: 0.3,
//             ease: "power2.out",
//           });
//         });
//       });

//       // Parallax scrolling effects
//       gsap.registerPlugin(ScrollTrigger);

//       gsap.to(".parallax-bg", {
//         yPercent: -50,
//         ease: "none",
//         scrollTrigger: {
//           trigger: ".parallax-bg",
//           start: "top bottom",
//           end: "bottom top",
//           scrub: true,
//         },
//       });
//     };

//     return () => {
//       ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
//     };
//   }, [gsapLoaded]);

//   return (
//     <div className="min-h-screen bg-black text-white overflow-hidden">
//       {/* Mouse Follower */}
//       <div className="mouse-follower fixed w-6 h-6 bg-gradient-to-r from-green-400 to-red-400 rounded-full opacity-20 pointer-events-none z-50 mix-blend-screen" />
//       {/* <div
//       className="w-10 h-"
//       style={{ cursor: "url('https://img.icons8.com/?size=100&id=TdbpMMmYMvER&format=png&color=000000'), auto" }}
//     >
//       Custom cursor area
//     </div> */}

//       {/* Page Reveal Overlay */}
//       {showReveal && (
//         <div
//           ref={revealRef}
//           className="fixed inset-0 z-50 bg-black flex items-center justify-center overflow-hidden"
//         >
//           {/* Animated Background */}
//           <div className="absolute inset-0 parallax-bg">
//             <div className="absolute inset-0 bg-black opacity-20" />
//             <div className="absolute inset-0 bg-black opacity-10" />

//             {/* Floating Particles */}
//             {[...Array(25)].map((_, i) => (
//               <div
//                 key={i}
//                 ref={(el) => (particlesRef.current[i] = el)}
//                 className="absolute w-2 h-2 bg-white rounded-full"
//               />
//             ))}
//           </div>

//           {/* Geometric Animations */}
//           <div className="absolute inset-0 pointer-events-none overflow-hidden">
//             <div className="geometric-shape floating-shape-1 absolute top-1/4 left-1/4 w-32 h-32 border border-blue-500 opacity-20" />
//             <div className="geometric-shape floating-shape-2 absolute bottom-1/4 right-1/4 w-24 h-24 border-2 border-purple-500 opacity-30 rounded-full" />
//             <div className="geometric-shape floating-shape-3 absolute top-1/2 right-1/3 w-16 h-16 bg-gradient-to-r from-pink-500 to-purple-500 opacity-10 rounded-full" />
//           </div>

//           {/* Main Content */}
//           <div className="relative z-10 text-center max-w-4xl mx-auto px-6">
//             {/* Logo Animation */}
//             <div className="mb-12">
//               <div className="relative inline-block">
//                 <div className="absolute inset-0 blur-2xl bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 opacity-50" />
//                 <h1
//                   ref={logoRef}
//                   className="relative text-6xl md:text-8xl font-bold bg-gradient-to-r from-white via-blue-200 to-purple-200 bg-clip-text text-transparent"
//                 >
//                   Kalvin Kayi.
//                 </h1>
//               </div>
//             </div>

//             {/* Animated Text */}
//             <div className="mb-12 space-y-4">
//               <div className="overflow-hidden">
//                 <p className="reveal-text text-2xl md:text-3xl font-light text-blue-300">
//                   Welcome to my portfolio
//                 </p>
//               </div>
//               <div className="overflow-hidden">
//                 <p className="reveal-text text-lg text-gray-400">
//                   Data Science • Web Development • Machine Learning
//                 </p>
//               </div>
//             </div>

//             {/* Progress Bar */}
//             <div className="relative w-64 h-2 mx-auto bg-gray-800 rounded-full overflow-hidden">
//               <div
//                 ref={progressRef}
//                 className="absolute left-0 top-0 h-full bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 w-0"
//               />
//               <div className="progress-shimmer absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-30 w-full -translate-x-full" />
//             </div>

//             <p className="reveal-text mt-6 text-sm text-gray-500">
//               Crafting digital experiences...
//             </p>
//           </div>
//         </div>
//       )}

//       {/* Main Site Content */}
//       <div ref={mainContentRef} className={showReveal ? "hidden" : "block"}>
//         <PaypalDonate />
//         {/* Animated Background */}
//         <div className="fixed inset-0 z-0">
//           <div
//             className="absolute inset-0 opacity-30 transition-all duration-300"
//             style={{
//               background: `radial-gradient(circle at ${mousePosition.x}px ${mousePosition.y}px, rgba(139, 92, 246, 0.15) 0%, transparent 50%)`,
//             }}
//           />
//           <div className="absolute inset-0 bg-gradient-to-br from-black via-gray-900 to-black">
//             <div className="absolute inset-0 opacity-20">
//               <div
//                 className="absolute inset-0"
//                 style={{
//                   backgroundImage: `radial-gradient(circle at 20% 20%, rgba(120, 119, 198, 0.1) 0%, transparent 50%),
//                                  radial-gradient(circle at 80% 80%, rgba(255, 119, 198, 0.1) 0%, transparent 50%),
//                                  radial-gradient(circle at 40% 40%, rgba(120, 219, 255, 0.1) 0%, transparent 50%)`,
//                 }}
//               />
//             </div>
//           </div>
//         </div>

//         {/* Hero Section */}
//         <div id="home">
//           <Floatingnavbar />
//           <div
//             ref={heroRef}
//             className="relative h-full flex flex-col items-center justify-center pt-20 md:pt-28 px-4 md:px-0 bg-black text-white overflow-hidden"
//           >
//             {/* Headline */}
//             <h1 className="hero-title text-center text-6xl md:text-7xl font-extrabold mb-4 tracking-tight">
//               Hey, I’m Kalvin 👋
//             </h1>

//             {/* Tagline */}
//             <p className="hero-subtitle text-center text-xl md:text-2xl text-gray-400 max-w-xl mb-6">
//               I build intelligent web apps that bridge data, design, and human
//               experience.
//             </p>

//             {/* Animated gradient line */}
//             <div className="h-1 w-24 bg-gradient-to-r from-cyan-400 via-purple-500 to-pink-500 rounded-full animate-pulse mb-8"></div>

//             {/* Skills badges */}
//             <div className="flex flex-wrap justify-center gap-4 mb-10">
//               {[
//                 { icon: Code, label: "Full-Stack Dev" },
//                 { icon: Brain, label: "ML Engineer" },
//                 { icon: BarChart3, label: "Data Analyst" },
//               ].map((item, index) => {
//                 const Icon = item.icon;
//                 return (
//                   <button
//                     key={index}
//                     type="button"
//                     aria-pressed="false"
//                     className="flex items-center gap-2 px-5 py-2 rounded-full border border-white/10 bg-white/5 hover:bg-gradient-to-r hover:from-cyan-500 hover:to-purple-500 hover:scale-105 transition-all duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400"
//                   >
//                     <Icon size={20} className="hero-badge text-gray-300" />
//                     <span className="text-sm font-medium">{item.label}</span>
//                   </button>
//                 );
//               })}
//             </div>

//             {/* Call to action */}
//             <a
//               href="#projects"
//               className="inline-block mt-4 text-white px-8 py-3 rounded-full bg-gradient-to-r from-cyan-500 to-purple-500  font-semibold hover:scale-105 transition-all duration-300"
//             >
//               See My Work
//             </a>

//             {/* Fun facts and achievments */}
//             <div className="relative py-20 px-6 bg-black text-white">
//               <div className="max-w-5xl mx-auto text-center">
//                 <div className="grid grid-cols-1 md:grid-cols-5 gap-8">
//                   {[
//                     { number: "45+", label: "Repositories" },
//                     { number: "15+", label: "Products completed" },
//                     { number: "100K+", label: "Lines of Code" },
//                     { number: "50+", label: "Data Pipelines Deployed" },
//                     { number: "∞", label: "Cups of Coffee" },
//                   ].map((stat, index) => (
//                     <div
//                       key={index}
//                       className="bg-white/5 border border-white/10 rounded-2xl p-2 md:p-4 hover:scale-105 transition-transform duration-300"
//                     >
//                       <h3 className="text-xl md:text-3xl font-bold mb-1">
//                         {stat.number}
//                       </h3>
//                       <p className="text-gray-400">{stat.label}</p>
//                     </div>
//                   ))}
//                 </div>
//               </div>
//             </div>
//           </div>

//           {/* <ScrollVelocity
//             texts={['React Bits', 'Scroll Down']}
//             velocity={100}
//             className="custom-scroll-text"
//           /> */}

//           {/* About Me Section */}
//           <section className="relative max-w-6xl mx-auto px-6 py-20 grid grid-cols-1 md:grid-cols-2 items-center gap-12 text-white">
//             {/* Text Section */}
//             <div className="flex flex-col space-y-6">
//               <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-orange-400 via-pink-500 to-purple-500 bg-clip-text text-transparent">
//                 About Me
//               </h2>

//               <p className="text-lg text-gray-200 leading-relaxed">
//                 I'm a <span className="font-semibold text-white">Full-Stack Developer and Machine Learning Engineer</span> with a proven track record of delivering scalable, production-ready applications that solve complex business challenges.
//               </p>

//               <p className="text-base text-gray-300 leading-relaxed">
//                 My expertise spans the entire development lifecycle—from designing AI-powered solutions like fact-checking APIs and predictive healthcare models, to building real-time platforms for finance and real estate sectors. I specialize in:
//               </p>

//               <ul className="space-y-3 text-gray-300">
//                 <li className="flex items-start">
//                   <span className="text-cyan-400 mr-3 mt-1">▹</span>
//                   <span><strong className="text-white">Machine Learning & NLP:</strong> Deep learning models, natural language processing, and predictive analytics</span>
//                 </li>
//                 <li className="flex items-start">
//                   <span className="text-cyan-400 mr-3 mt-1">▹</span>
//                   <span><strong className="text-white">Full-Stack Development:</strong> React, Node.js, Python, with cloud deployment expertise (AWS, Azure)</span>
//                 </li>
//                 <li className="flex items-start">
//                   <span className="text-cyan-400 mr-3 mt-1">▹</span>
//                   <span><strong className="text-white">Data Engineering:</strong> ETL pipelines, data warehousing, and real-time analytics platforms</span>
//                 </li>
//               </ul>

//               <p className="text-base text-gray-300 leading-relaxed">
//                 I'm passionate about creating solutions that not only meet technical requirements but drive measurable business impact. Let's build something exceptional together.
//               </p>
//             </div>

//             {/* Image Section */}
//             <div className="flex justify-center">
//               <div className="relative">
//                 <div className="absolute inset-0 bg-gradient-to-r from-cyan-500 to-purple-500 rounded-2xl blur-xl opacity-50"></div>
//                 <img
//                   src="/1735390396166-removebg.png"
//                   alt="Kalvin Kayi - Full-Stack Developer & ML Engineer"
//                   className="relative rounded-2xl shadow-2xl w-72 h-72 object-cover border-4 border-white/40 backdrop-blur-lg"
//                 />
//               </div>
//             </div>
//           </section>

//           {/* Skills Section */}
//           <EnhancedSkillsSection />

//           {/* Subtle background shape */}
//           <div className="absolute -top-32 -left-32 w-[400px] h-[400px] bg-gradient-to-br from-cyan-500 to-purple-500 opacity-20 rounded-full blur-3xl"></div>
//           <div className="absolute -bottom-48 -right-48 w-[600px] h-[600px] bg-gradient-to-br from-pink-500 to-purple-500 opacity-20 rounded-full blur-3xl"></div>
//           {/* <div
//             className="absolute -top-10 left-1/3 w-64 h-64 bg-gradient-to-b from-cyan-400 to-blue-500 opacity-20 rounded-full blur-3xl"
//             style={{ clipPath: "ellipse(50% 50% at 50% 0%)" }}
//           ></div> */}
//         </div>

//         {/* Projects Section */}
//         <section
//           id="projects"
//           ref={projectsRef}
//           className="relative py-20 px-6 bg-gradient-to-b from-black via-gray-900 to-black text-white"
//         >
//           <div className="max-w-6xl mx-auto text-center mb-12"></div>
//           <Projects />
//         </section>

//         {/* Blog post area */}
//         <section
//           id="blog"
//           className="relative py-20 px-6 bg-gradient-to-b from-black via-gray-900 to-black text-white"
//         >
//           <div className="max-w-6xl mx-auto text-center">
//             <h2 className="text-4xl md:text-5xl font-bold mb-4">
//               Insights & Articles
//             </h2>
//             <p className="text-gray-400 max-w-2xl mx-auto mb-12">
//               Sharing knowledge about data science, design, and modern
//               engineering.
//             </p>
//             <div className="h-1 w-20 bg-gradient-to-r from-cyan-500 to-purple-500 rounded-full mx-auto mb-12 animate-pulse"></div>

//             {/* <div className="grid md:grid-cols-2 gap-8">
//               {[
//                 {
//                   title: "Building Scalable ML Platforms with Kubernetes",
//                   link: "#",
//                 },
//                 {
//                   title: "Designing Data-Driven Dashboards Users Actually Love",
//                   link: "#",
//                 },
//               ].map((post, index) => (
//                 <a
//                   key={index}
//                   href={post.link}
//                   className="block bg-white/5 border border-white/10 rounded-2xl p-6 text-left hover:scale-105 transition-transform duration-300"
//                 >
//                   <h3 className="text-lg font-semibold mb-2">{post.title}</h3>
//                   <p className="text-gray-500 text-sm">Read more →</p>
//                 </a>
//               ))}
//             </div> */}
//             <div className="grid md:grid-cols-2 gap-8">
//               {posts.map((post, index) => (
//                 <a
//                   key={index}
//                   href={post.link}
//                   className="block bg-white/5 border border-white/10 rounded-2xl p-6 text-left hover:scale-105 transition-transform duration-300"
//                 >
//                   <h3 className="text-lg font-semibold mb-2">{post.title}</h3>
//                   <p className="text-gray-500 text-sm">Read more →</p>
//                 </a>
//               ))}
//             </div>
//           </div>
//         </section>

//         {/* Contact Section */}
//         <section className="relative py-20 px-6 bg-black text-white">
//           <div className="max-w-4xl mx-auto text-center">
//             <h2 className="text-4xl md:text-5xl font-bold mb-6">
//               Let’s Build Something Amazing
//             </h2>
//             <p className="text-gray-400 text-lg mb-12 max-w-2xl mx-auto">
//               Ready to turn your data into powerful web experiences? Let’s
//               discuss your next project.
//             </p>
//             <div className="flex flex-col sm:flex-row gap-4 justify-center">
//               <a
//                 href="mailto:kayikalvin@gmail.com"
//                 className="px-8 py-4 rounded-full bg-gradient-to-r from-cyan-500 to-purple-500 font-semibold text-black hover:scale-105 transition-transform duration-300"
//               >
//                 Get In Touch
//               </a>
//               <a
//                 href="/Alvin Kayi CV.pdf"
//                 target="_blank"
//                 rel="noopener noreferrer"
//                 className="px-8 py-4 border-2 border-gray-600 rounded-full font-semibold text-white hover:bg-white hover:text-black transition-all duration-300"
//               >
//                 View Resume
//               </a>
//             </div>
//           </div>
//         </section>

//         {/* Footer */}
//         <footer
//           className="relative z-10 py-8 px-6 bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 text-gray-200"
//           style={{
//             clipPath:
//               "polygon(0 10%, 20% 0, 45% 20%, 75% 10%, 100% 10%, 100% 100%, 0 100%)",
//           }}
//         >
//           <div className="max-w-6xl mx-auto flex flex-col md:flex-row gap-4 justify-between items-center">
//             <p className="font-bold mb-4 md:mb-0">
//               © 2025 Kayi Kalvin. All rights reserved
//             </p>
//             <div className="flex space-x-6">
//               <a
//                 href="#"
//                 className="font-bold hover:text-gray-400 transition-colors duration-300"
//               >
//                 Privacy
//               </a>
//               <a
//                 href="#"
//                 className="font-bold hover:text-gray-400 transition-colors duration-300"
//               >
//                 Terms
//               </a>
//               <a
//                 href="#"
//                 className="font-bold hover:text-gray-400 transition-colors duration-300"
//               >
//                 Contact
//               </a>
//             </div>
//           </div>
//         </footer>
//       </div>
//     </div>
//   );
// };

// export default Home;

import {
  Code,
  Brain,
  BarChart3,
  Sparkles,
  ExternalLink,
  Mail,
  FileText,
} from "lucide-react";
import { useState, useEffect, useRef } from "react";
import Projects from "../components/Projects";
import { skills } from "../utils/utils";
import { posts } from "../utils/utils";
import Floatingnavbar from "../components/Floatingnavbar";
import PaypalDonate from "../components/PaypalDonate";
import EnhancedSkillsSection from "../components/EnhancedSkillsSection";

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
  const [activeSection, setActiveSection] = useState("home");

  // Track active section for navigation
  useEffect(() => {
    const handleScroll = () => {
      const sections = [
        "home",
        "about",
        "skills",
        "projects",
        "blog",
        "contact",
      ];
      const current = sections.find((section) => {
        const element = document.getElementById(section);
        if (element) {
          const rect = element.getBoundingClientRect();
          return rect.top <= 100 && rect.bottom >= 100;
        }
        return false;
      });
      if (current) setActiveSection(current);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

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
      if (window.gsap) {
        setGsapLoaded(true);
        return;
      }

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
          delay: i * 0.05,
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
        duration: 1.2,
        ease: "back.out(1.7)",
      })
      .from(
        ".reveal-text",
        {
          y: 40,
          opacity: 0,
          duration: 0.8,
          stagger: 0.15,
          ease: "power3.out",
        },
        "-=0.4"
      )
      .from(
        ".geometric-shape",
        {
          scale: 0,
          rotation: 180,
          opacity: 0,
          duration: 1,
          stagger: 0.2,
          ease: "elastic.out(1, 0.5)",
        },
        "-=0.3"
      );

    // Progress bar animation
    gsap.to(progressRef.current, {
      width: "100%",
      duration: 2.2,
      ease: "power2.inOut",
      onComplete: () => {
        gsap.to(revealRef.current, {
          y: "-100%",
          duration: 0.8,
          ease: "power4.inOut",
          onComplete: () => {
            setShowReveal(false);
            setTimeout(() => {
              initMainAnimations();
            }, 10);
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
          y: -80,
          opacity: 0,
          duration: 1,
          ease: "power4.out",
        })
        .from(
          ".hero-subtitle",
          {
            opacity: 0,
            duration: 1,
            stagger: 0.1,
            ease: "power3.out",
          },
          "-=0.6"
        )
        .fromTo(
          ".hero-badge",
          { scale: 0, opacity: 0 },
          {
            scale: 1,
            opacity: 1,
            duration: 0.6,
            stagger: 0.08,
            ease: "back.out(1.7)",
          },
          "-=0.4"
        )
        .fromTo(
          ".social-icon",
          { y: 20, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.5,
            stagger: 0.08,
            ease: "power2.out",
          },
          "-=0.3"
        );

      // Scroll-triggered animations
      ScrollTrigger.batch(".skill-card", {
        onEnter: (elements) => {
          gsap.from(elements, {
            y: 60,
            opacity: 0,
            duration: 0.8,
            stagger: 0.1,
            ease: "power3.out",
          });

          elements.forEach((element, i) => {
            const skillBar = element.querySelector(".skill-bar");
            const level = skills[i % skills.length]?.level || 0;
            gsap.to(skillBar, {
              width: `${level}%`,
              duration: 1.2,
              delay: 0.3,
              ease: "power2.out",
            });
          });
        },
        start: "top bottom-=80",
      });

      ScrollTrigger.batch(".project-card", {
        onEnter: (elements) => {
          gsap.from(elements, {
            y: 60,
            opacity: 0,
            duration: 0.9,
            stagger: 0.15,
            ease: "power3.out",
          });
        },
        start: "top bottom-=80",
      });

      // Continuous animations
      gsap.to(".floating-shape-1", {
        y: -20,
        rotation: 5,
        duration: 4,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
      });

      gsap.to(".floating-shape-2", {
        x: 20,
        rotation: -5,
        duration: 5,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
      });

      gsap.to(".floating-shape-3", {
        y: 15,
        x: -15,
        rotation: 8,
        duration: 6,
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
          duration: 0.2,
          ease: "power2.out",
        });
      };

      window.addEventListener("mousemove", updateMousePosition);

      // Hover animations
      document.querySelectorAll(".hover-card").forEach((element) => {
        element.addEventListener("mouseenter", () => {
          gsap.to(element, {
            scale: 1.03,
            y: -5,
            duration: 0.3,
            ease: "power2.out",
          });
        });

        element.addEventListener("mouseleave", () => {
          gsap.to(element, {
            scale: 1,
            y: 0,
            duration: 0.3,
            ease: "power2.out",
          });
        });
      });

      // Parallax scrolling
      gsap.to(".parallax-bg", {
        yPercent: -30,
        ease: "none",
        scrollTrigger: {
          trigger: ".parallax-bg",
          start: "top bottom",
          end: "bottom top",
          scrub: 1,
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
      <div className="mouse-follower fixed w-8 h-8 bg-gradient-to-r from-cyan-500 via-purple-500 to-pink-500 rounded-full opacity-15 pointer-events-none z-50 mix-blend-screen blur-sm" />

      {/* Page Reveal Overlay */}
      {showReveal && (
        <div
          ref={revealRef}
          className="fixed inset-0 z-50 bg-black flex items-center justify-center overflow-hidden"
        >
          <div className="absolute inset-0 parallax-bg">
            <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-black to-gray-900" />

            {[...Array(20)].map((_, i) => (
              <div
                key={i}
                ref={(el) => (particlesRef.current[i] = el)}
                className="absolute w-1.5 h-1.5 bg-gradient-to-r from-cyan-400 to-purple-400 rounded-full"
              />
            ))}
          </div>

          <div className="absolute inset-0 pointer-events-none overflow-hidden">
            <div className="geometric-shape floating-shape-1 absolute top-1/4 left-1/4 w-32 h-32 border border-cyan-400/30 opacity-20 rounded-lg" />
            <div className="geometric-shape floating-shape-2 absolute bottom-1/4 right-1/4 w-24 h-24 border-2 border-purple-400/40 opacity-30 rounded-full" />
            <div className="geometric-shape floating-shape-3 absolute top-1/2 right-1/3 w-20 h-20 bg-gradient-to-r from-pink-500/20 to-purple-500/20 opacity-20 rounded-full" />
          </div>

          <div className="relative z-10 text-center max-w-4xl mx-auto px-6">
            <div className="mb-12">
              <div className="relative inline-block">
                <div className="absolute inset-0 blur-3xl bg-gradient-to-r from-cyan-500 via-purple-500 to-pink-500 opacity-40" />
                <h1
                  ref={logoRef}
                  className="relative text-6xl md:text-8xl font-bold bg-gradient-to-r from-white via-cyan-100 to-purple-100 bg-clip-text text-transparent"
                >
                  Kalvin Kayi.
                </h1>
              </div>
            </div>

            <div className="mb-12 space-y-6">
              <div className="overflow-hidden">
                <p className="reveal-text text-2xl md:text-3xl font-light text-cyan-300">
                  Welcome to my portfolio
                </p>
              </div>
              <div className="overflow-hidden">
                <p className="reveal-text text-lg text-gray-400">
                  Data Science • Web Development • Machine Learning
                </p>
              </div>
            </div>

            <div className="relative w-72 h-1.5 mx-auto bg-gray-800/50 rounded-full overflow-hidden">
              <div
                ref={progressRef}
                className="absolute left-0 top-0 h-full bg-gradient-to-r from-cyan-500 via-purple-500 to-pink-500 w-0"
              />
              <div className="progress-shimmer absolute inset-0 bg-gradient-to-r from-transparent via-white/50 to-transparent opacity-20 w-full -translate-x-full" />
            </div>

            <p className="reveal-text mt-8 text-sm text-gray-500">
              Crafting digital experiences with precision...
            </p>
          </div>
        </div>
      )}

      {/* Main Site Content */}
      <div ref={mainContentRef} className={showReveal ? "hidden" : "block"}>
        <PaypalDonate />

        {/* Animated Background */}
        <div className="fixed inset-0 z-0">
          <div
            className="absolute inset-0 opacity-20 transition-all duration-500"
            style={{
              background: `radial-gradient(600px at ${mousePosition.x}px ${mousePosition.y}px, rgba(34, 211, 238, 0.15) 0%, transparent 80%)`,
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-br from-black via-gray-900/50 to-black">
            <div className="absolute inset-0 opacity-[0.15]">
              <div
                className="absolute inset-0"
                style={{
                  backgroundImage: `radial-gradient(circle at 20% 20%, rgba(34, 211, 238, 0.1) 0%, transparent 50%),
                                 radial-gradient(circle at 80% 80%, rgba(168, 85, 247, 0.1) 0%, transparent 50%),
                                 radial-gradient(circle at 40% 40%, rgba(236, 72, 153, 0.1) 0%, transparent 50%)`,
                }}
              />
            </div>
          </div>
        </div>

        {/* Hero Section */}
        <section id="home" className="relative">
          <Floatingnavbar activeSection={activeSection} />
          <div
            ref={heroRef}
            className="relative h-full flex flex-col items-center justify-center pt-24 md:pt-32 px-4 md:px-0"
          >
            <div className="absolute -top-40 -left-40 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl" />
            <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl" />

            <div className="relative z-10 text-center max-w-4xl mx-auto">
              <div className="inline-flex items-center gap-2 mb-6 px-4 py-2 rounded-full bg-white/5 border border-white/10">
                <Sparkles size={16} className="text-cyan-400" />
                <span className="text-sm text-gray-300">
                  Full-Stack Developer & ML Engineer
                </span>
              </div>

              <h1 className="hero-title text-5xl md:text-7xl lg:text-8xl font-bold mb-6 tracking-tight">
                Hey, I'm{" "}
                <span className="bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                  Kalvin
                </span>{" "}
                👋
              </h1>

              <p className="hero-subtitle text-xl md:text-2xl text-gray-300 max-w-2xl mx-auto mb-8 leading-relaxed">
                I build intelligent web applications that bridge{" "}
                <span className="text-cyan-300">data</span>,{" "}
                <span className="text-purple-300">design</span>, and{" "}
                <span className="text-pink-300">human experience</span>.
              </p>

              <div className="h-1 w-32 bg-gradient-to-r from-cyan-400 via-purple-500 to-pink-500 rounded-full mx-auto mb-12 animate-pulse" />

              <div className="flex flex-wrap justify-center gap-3 mb-12">
                {[
                  {
                    icon: Code,
                    label: "Full-Stack Dev",
                    color: "from-cyan-500 to-blue-500",
                  },
                  {
                    icon: Brain,
                    label: "ML Engineer",
                    color: "from-purple-500 to-pink-500",
                  },
                  {
                    icon: BarChart3,
                    label: "Data Analyst",
                    color: "from-pink-500 to-rose-500",
                  },
                ].map((item, index) => {
                  const Icon = item.icon;
                  return (
                    <div
                      key={index}
                      className={`hero-badge group flex items-center gap-3 px-6 py-3 rounded-xl bg-gradient-to-r ${item.color} bg-opacity-10 border border-white/10 backdrop-blur-sm hover:bg-opacity-20 transition-all duration-300 hover-card`}
                    >
                      <Icon
                        size={20}
                        className="text-gray-300 group-hover:scale-110 transition-transform"
                      />
                      <span className="text-sm font-medium text-white">
                        {item.label}
                      </span>
                    </div>
                  );
                })}
              </div>

              <div className="flex gap-4 justify-center">
                <a
                  href="#projects"
                  className="px-8 py-3.5 rounded-full bg-gradient-to-r from-cyan-500 to-purple-500 text-white font-semibold hover:scale-105 hover:shadow-lg hover:shadow-cyan-500/25 transition-all duration-300 flex items-center gap-2"
                >
                  See My Work
                  <ExternalLink size={18} />
                </a>
                <a
                  href="#contact"
                  className="px-8 py-3.5 rounded-full border-2 border-white/20 bg-white/5 backdrop-blur-sm font-semibold hover:bg-white/10 hover:border-white/30 transition-all duration-300"
                >
                  Let's Connect
                </a>
              </div>
            </div>

            {/* Stats Section */}
            <div className="relative mt-32 w-full max-w-6xl px-6">
              <div className="grid grid-cols-2 md:grid-cols-5 gap-6">
                {[
                  { number: "45+", label: "Repositories" },
                  { number: "15+", label: "Projects Completed" },
                  { number: "100K+", label: "Lines of Code" },
                  { number: "50+", label: "Data Pipelines" },
                  { number: "∞", label: "Cups of Coffee" },
                ].map((stat, index) => (
                  <div
                    key={index}
                    className="hover-card bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-sm hover:bg-white/10 transition-all duration-300"
                  >
                    {/* <div className="text-3xl mb-2">{stat.icon}</div> */}
                    <h3 className="text-2xl md:text-3xl font-bold mb-1 bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
                      {stat.number}
                    </h3>
                    <p className="text-gray-400 text-sm">{stat.label}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* About Me Section */}
        {/* <section id="about" className="relative max-w-6xl mx-auto px-6 py-24">
          <div className="grid grid-cols-1 lg:grid-cols-2 items-center gap-16">
            <div className="space-y-8">
              <div>
                <h2 className="text-4xl md:text-5xl font-bold mb-6">
                  About <span className="bg-gradient-to-r from-orange-400 via-pink-500 to-purple-500 bg-clip-text text-transparent">Me</span>
                </h2>
                <div className="h-1 w-20 bg-gradient-to-r from-orange-400 to-purple-500 rounded-full mb-8" />
              </div>

              <p className="text-lg text-gray-200 leading-relaxed">
                I'm a <span className="font-semibold text-white">Full-Stack Developer and Machine Learning Engineer</span> with a proven track record of delivering scalable, production-ready applications.
              </p>

              <p className="text-gray-300 leading-relaxed">
                My expertise spans the entire development lifecycle—from designing AI-powered solutions like fact-checking APIs and predictive healthcare models, to building real-time platforms for finance and real estate sectors.
              </p>

              <div className="space-y-4">
                <h3 className="text-xl font-semibold text-white">Specializations:</h3>
                <ul className="space-y-3">
                  {[
                    "Machine Learning & NLP: Deep learning models, natural language processing",
                    "Full-Stack Development: React, Node.js, Python, cloud deployment (AWS, Azure)",
                    "Data Engineering: ETL pipelines, data warehousing, real-time analytics",
                  ].map((item, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <div className="mt-1.5 w-2 h-2 bg-cyan-400 rounded-full flex-shrink-0" />
                      <span className="text-gray-300">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <p className="text-gray-300 leading-relaxed">
                Passionate about creating solutions that not only meet technical requirements but drive measurable business impact.
              </p>
            </div>

            <div className="relative flex justify-center">
              <div className="relative w-80 h-80">
                <div className="absolute inset-0 bg-gradient-to-r from-cyan-500 to-purple-500 rounded-3xl blur-xl opacity-30 animate-pulse" />
                <div className="absolute -inset-4 bg-gradient-to-r from-cyan-500/20 to-purple-500/20 rounded-3xl blur-2xl" />
                <img
                  src="/1735390396166-removebg.png"
                  alt="Kalvin Kayi"
                  className="relative rounded-3xl shadow-2xl w-full h-full object-cover border-4 border-white/20 backdrop-blur-lg"
                />
                <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-gradient-to-r from-pink-500 to-purple-500 rounded-2xl blur-xl opacity-30" />
              </div>
            </div>
          </div>
        </section> */}
        <section id="about" className="relative py-20 overflow-hidden">
          {/* Background effects */}
          <div className="absolute inset-0">
            <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-orange-500/10 rounded-full blur-3xl" />
            <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl" />
          </div>

          <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              {/* Text content */}
              <div className="space-y-6">
                <div>
                  <h2 className="text-4xl md:text-5xl font-bold mb-4">
                    About{" "}
                    <span className="bg-gradient-to-r from-orange-400 to-purple-500 bg-clip-text text-transparent">
                      Me
                    </span>
                  </h2>
                  <div className="h-1 w-16 bg-gradient-to-r from-orange-400 to-purple-500 rounded-full mb-6" />
                </div>

                <p className="text-lg text-gray-200">
                  I'm a{" "}
                  <span className="font-semibold text-white">
                    Full-Stack Developer & ML Engineer
                  </span>{" "}
                  focused on building scalable, production-ready applications
                  that solve real business challenges.
                </p>

                {/* Key expertise */}
                <div className="space-y-4">
                  <h3 className="text-xl font-semibold text-white">
                    Core Expertise
                  </h3>
                  <div className="space-y-3">
                    {[
                      {
                        
                        title: "Machine Learning",
                        items: ["Deep Learning", "NLP", "Predictive Analytics"],
                      },
                      {
                        
                        title: "Full-Stack Dev",
                        items: [
                          "React/Next.js",
                          "Node.js/Python",
                          "Cloud Deployment",
                        ],
                      },
                      {
                        
                        title: "Data Engineering",
                        items: [
                          "ETL Pipelines",
                          "Real-time Analytics",
                          "Data Platforms",
                        ],
                      },
                    ].map((item, index) => (
                      <div
                        key={index}
                        className="flex items-start gap-3 p-3 rounded-lg bg-white/5 border border-white/10"
                      >
                        {/* <div className="text-xl mt-1">{item.icon}</div> */}
                        <div>
                          <h4 className="font-medium text-white mb-1">
                            {item.title}
                          </h4>
                          <p className="text-sm text-gray-300">
                            {item.items.join(" • ")}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <p className="text-gray-300">
                  I build solutions that bridge technical innovation with
                  measurable business impact, delivering value from concept to
                  production.
                </p>
              </div>

              {/* Image section */}
              <div className="relative">
                <div className="relative mx-auto max-w-sm">
                  {/* Glow effect */}
                  <div className="absolute inset-0 bg-gradient-to-r from-orange-500/20 to-purple-500/20 rounded-3xl blur-xl" />

                  {/* Image container */}
                  <div className="relative rounded-2xl overflow-hidden border-2 border-white/20">
                    <img
                      src="/1735390396166-removebg.png"
                      alt="Kalvin Kayi"
                      className="w-full h-auto object-contain bg-gradient-to-br from-gray-900 to-black p-8"
                    />
                  </div>

                  {/* Floating tech badges */}
                  <div className="flex flex-wrap justify-center gap-2 mt-6">
                    {["React", "Python", "TensorFlow", "AWS", "Node.js"].map(
                      (tech, index) => (
                        <div
                          key={index}
                          className="px-3 py-1 rounded-full bg-white/5 border border-white/10 text-sm text-gray-300 hover:bg-gradient-to-r hover:from-orange-500/20 hover:to-purple-500/20 transition-colors"
                        >
                          {tech}
                        </div>
                      )
                    )}
                  </div>
                </div>

                {/* Quick stats */}
                <div className="grid grid-cols-3 gap-4 mt-8">
                  {[
                    { value: "45+", label: "Projects" },
                    { value: "5+", label: "Years Exp" },
                    { value: "100%", label: "Satisfaction" },
                  ].map((stat, index) => (
                    <div
                      key={index}
                      className="text-center p-3 rounded-lg bg-white/5 border border-white/10"
                    >
                      <div className="text-xl font-bold text-white">
                        {stat.value}
                      </div>
                      <div className="text-xs text-gray-400 mt-1">
                        {stat.label}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Simple CTA */}
            <div className="mt-12 text-center">
              <a
                href="#contact"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-gradient-to-r from-orange-500 to-purple-500 text-white font-medium hover:opacity-90 transition-opacity"
              >
                Let's Connect
              </a>
            </div>
          </div>
        </section>

        {/* Skills Section */}
        <section id="skills" ref={skillsRef} className="relative py-24">
          <EnhancedSkillsSection />
        </section>

        {/* Projects Section */}
        <section
          id="projects"
          ref={projectsRef}
          className="relative py-24 px-6"
        >
          <div className="max-w-6xl mx-auto">
            {/* <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold mb-6">
                Featured <span className="bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">Projects</span>
              </h2>
              <p className="text-gray-400 max-w-2xl mx-auto text-lg">
                A collection of my recent work spanning web development, machine learning, and data analytics.
              </p>
            </div> */}
            <Projects />
          </div>
        </section>

        {/* Blog Section */}
        <section id="blog" className="relative py-24 px-6">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold mb-6">
                Insights &{" "}
                <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                  Articles
                </span>
              </h2>
              <p className="text-gray-400 max-w-2xl mx-auto text-lg">
                Sharing knowledge about data science, modern engineering, and
                development practices.
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {posts.map((post, index) => (
                <a
                  key={index}
                  href={post.link}
                  className="hover-card group block bg-white/5 border border-white/10 rounded-2xl p-8 backdrop-blur-sm hover:bg-white/10 transition-all duration-300"
                >
                  <div className="mb-6 w-12 h-12 rounded-xl bg-gradient-to-r from-cyan-500/20 to-purple-500/20 flex items-center justify-center">
                    <FileText className="text-cyan-400" size={24} />
                  </div>
                  <h3 className="text-xl font-semibold mb-4 text-white group-hover:text-cyan-300 transition-colors">
                    {post.title}
                  </h3>
                  <p className="text-gray-400 mb-6">
                    {post.description || "Read more about this topic"}
                  </p>
                  <div className="flex items-center text-cyan-400 group-hover:text-cyan-300 transition-colors">
                    <span className="text-sm font-medium">Read article</span>
                    <ExternalLink size={16} className="ml-2" />
                  </div>
                </a>
              ))}
            </div>
          </div>
        </section>

        {/* Contact Section */}
        <section id="contact" className="relative py-24 px-6">
          <div className="max-w-4xl mx-auto text-center">
            <div className="relative mb-12">
              <div className="absolute inset-0 blur-3xl bg-gradient-to-r from-cyan-500/20 to-purple-500/20" />
              <h2 className="relative text-4xl md:text-5xl font-bold mb-6">
                Let's Build Something{" "}
                <span className="bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                  Amazing
                </span>
              </h2>
            </div>

            <p className="text-gray-300 text-lg mb-12 max-w-2xl mx-auto leading-relaxed">
              Ready to transform your ideas into powerful digital experiences?
              Let's discuss your next project.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
              <a
                href="mailto:kayikalvin@gmail.com"
                className="group px-8 py-4 rounded-full bg-gradient-to-r from-cyan-500 to-purple-500 text-white font-semibold hover:shadow-xl hover:shadow-cyan-500/25 transition-all duration-300 flex items-center justify-center gap-3"
              >
                <Mail size={20} />
                Get In Touch
              </a>
              <a
                href="/Alvin Kayi CV.pdf"
                target="_blank"
                rel="noopener noreferrer"
                className="group px-8 py-4 rounded-full border-2 border-white/20 bg-white/5 backdrop-blur-sm font-semibold hover:bg-white/10 hover:border-white/30 transition-all duration-300 flex items-center justify-center gap-3"
              >
                <FileText size={20} />
                View Resume
              </a>
            </div>

            <div className="border-t border-white/10 pt-12">
              <p className="text-gray-400">
                Typically respond within{" "}
                <span className="text-cyan-300">24 hours</span>
              </p>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="relative py-12 px-6 border-t border-white/10 bg-gradient-to-b from-black to-gray-900/50">
          <div className="max-w-6xl mx-auto">
            <div className="flex flex-col md:flex-row justify-between items-center gap-8">
              <div className="text-center md:text-left">
                <h3 className="text-2xl font-bold mb-2 bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
                  Kalvin Kayi
                </h3>
                <p className="text-gray-400">
                  Full-Stack Developer & ML Engineer
                </p>
              </div>

              <div className="flex gap-8">
                {["Privacy", "Terms", "Contact"].map((item, index) => (
                  <a
                    key={index}
                    href="#"
                    className="text-gray-400 hover:text-white transition-colors duration-300"
                  >
                    {item}
                  </a>
                ))}
              </div>
            </div>

            <div className="mt-12 pt-8 border-t border-white/10 text-center text-gray-500 text-sm">
              <p>
                © {new Date().getFullYear()} Kalvin Kayi. All rights reserved.
              </p>
              <p className="mt-2">
                Built with React, TypeScript, and Tailwind CSS
              </p>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default Home;

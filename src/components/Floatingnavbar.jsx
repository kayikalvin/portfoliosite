// import React, { useState, useEffect } from 'react';



// import { Home, Code, Briefcase, Mail, Github, Linkedin, Twitter } from 'lucide-react';

// export default function Floatingnavbar() {
//   const [activeSection, setActiveSection] = useState('hero');
//   const [isVisible, setIsVisible] = useState(false);

//   useEffect(() => {
//     // Show navbar after page loads
//     setTimeout(() => setIsVisible(true), 2000);

//     // Handle scroll for active section
//     const handleScroll = () => {
//       const sections = ['hero', 'skills', 'projects', 'contact'];
//       const scrollPos = window.scrollY + 100;

//       sections.forEach(section => {
//         const element = document.getElementById(section);
//         if (element && scrollPos >= element.offsetTop && scrollPos < element.offsetTop + element.offsetHeight) {
//           setActiveSection(section);
//         }
//       });
//     };

//     window.addEventListener('scroll', handleScroll);
//     return () => window.removeEventListener('scroll', handleScroll);
//   }, []);

//   const navItems = [
//     { id: 'home', icon: Home, label: 'Home' },
//     { id: 'skills', icon: Code, label: 'Skills' },
//     { id: 'projects', icon: Briefcase, label: 'Projects' },
//     { id: 'blog', icon: Briefcase, label: 'Blog' },
//     // { id: 'contact', icon: Mail, label: 'Contact' }
//   ];

//   const socialItems = [
//     { icon: Github, href: 'https://github.com/kayikalvin', label: 'GitHub' },
//     { icon: Linkedin, href: 'https://www.linkedin.com/in/kayikalvin/', label: 'LinkedIn' },
//     // { icon: Twitter, href: '#', label: 'Twitter' }
//   ];

//   const scrollToSection = (sectionId) => {
//     const element = document.getElementById(sectionId);
//     if (element) {
//       element.scrollIntoView({ behavior: 'smooth' });
//     }
//   };

//   return (
//     <div className={`fixed left-6 top-1/2 -translate-y-1/2 z-50 transition-all duration-1000 ${
//       isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-10'
//     }`}>
//       {/* Main Navigation */}
//       <div className="relative mb-6">
//         <div className="absolute inset-0 bg-gradient-to-b from-blue-500/20 via-purple-500/20 to-pink-500/20 rounded-full blur-xl"></div>
//         <nav className="relative backdrop-blur-xl bg-white/10 border border-white/20 rounded-full p-2 shadow-2xl">
//           {navItems.map((item, index) => {
//             const Icon = item.icon;
//             const isActive = activeSection === item.id;
            
//             return (
//               <button
//                 key={item.id}
//                 onClick={() => scrollToSection(item.id)}
//                 className={`group relative block w-12 h-12 rounded-full transition-all duration-300 mb-1 last:mb-0 ${
//                   isActive 
//                     ? 'bg-gradient-to-r from-cyan-500 shadow-lg scale-110' 
//                     : 'hover:bg-white/20 hover:scale-105'
//                 }`}
//                 title={item.label}
//               >
//                 <Icon 
//                   size={20} 
//                   className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 transition-colors duration-300 ${
//                     isActive ? 'text-white' : 'text-gray-400 group-hover:text-white'
//                   }`} 
//                 />
                
//                 {/* Tooltip */}
//                 <div className={`absolute right-full mr-3 top-1/2 -translate-y-1/2 px-3 py-1 bg-black/80 text-white text-sm rounded-lg whitespace-nowrap opacity-0 group-hover:opacity-100 transition-all duration-300 pointer-events-none ${
//                   isActive ? 'opacity-100' : ''
//                 }`}>
//                   {item.label}
//                   <div className="absolute left-full top-1/2 -translate-y-1/2 w-0 h-0 border-l-4 border-l-black/80 border-t-2 border-b-2 border-t-transparent border-b-transparent"></div>
//                 </div>
//               </button>
//             );
//           })}
//         </nav>
//       </div>

//       {/* Social Media Links */}
//       <div className="relative">
//         <div className="absolute inset-0 bg-gradient-to-b from-pink-500/20 via-purple-500/20 to-blue-500/20 rounded-full blur-xl"></div>
//         <div className="relative backdrop-blur-xl bg-white/10 border border-white/20 rounded-full p-2 shadow-2xl">
//           {socialItems.map((item, index) => {
//             const Icon = item.icon;
            
//             return (
//               <a
//                 key={index}
//                 href={item.href}
//                 target="_blank"
//                 rel="noopener noreferrer"
//                 className="group relative block w-10 h-10 rounded-full hover:bg-white/20 transition-all duration-300 mb-1 last:mb-0 hover:scale-105"
//                 title={item.label}
//               >
//                 <Icon 
//                   size={16} 
//                   className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-gray-300 group-hover:text-white transition-colors duration-300" 
//                 />
                
//                 {/* Tooltip */}
//                 <div className="absolute right-full mr-3 top-1/2 -translate-y-1/2 px-3 py-1 bg-black/80 text-white text-sm rounded-lg whitespace-nowrap opacity-0 group-hover:opacity-100 transition-all duration-300 pointer-events-none">
//                   {item.label}
//                   <div className="absolute left-full top-1/2 -translate-y-1/2 w-0 h-0 border-l-4 border-l-black/80 border-t-2 border-b-2 border-t-transparent border-b-transparent"></div>
//                 </div>
//               </a>
//             );
//           })}
//         </div>
//       </div>
//     </div>
//   );
// };

import React, { useState, useEffect } from "react";
import {
  Home,
  Code,
  Briefcase,
  BookOpen,
  Github,
  Linkedin,
} from "lucide-react";

export default function FloatingNavbar() {
  const [activeSection, setActiveSection] = useState("hero");
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Show navbar after short delay
    const timer = setTimeout(() => setIsVisible(true), 1200);

    // Scroll tracking
    const handleScroll = () => {
      const sections = ["hero", "skills", "projects", "blog", "contact"];
      const scrollPos = window.scrollY + 120;

      sections.forEach((section) => {
        const element = document.getElementById(section);
        if (
          element &&
          scrollPos >= element.offsetTop &&
          scrollPos < element.offsetTop + element.offsetHeight
        ) {
          setActiveSection(section);
        }
      });
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      clearTimeout(timer);
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const navItems = [
    { id: "home", icon: Home, label: "Home" },
    { id: "skills", icon: Code, label: "Skills" },
    { id: "projects", icon: Briefcase, label: "Projects" },
    { id: "blog", icon: BookOpen, label: "Blog" },
  ];

  const socialItems = [
    { icon: Github, href: "https://github.com/kayikalvin", label: "GitHub" },
    {
      icon: Linkedin,
      href: "https://www.linkedin.com/in/kayikalvin/",
      label: "LinkedIn",
    },
  ];

  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div
      className={`hidden md:block fixed left-6 top-1/2 -translate-y-1/2 z-50 transition-all duration-700 ease-out
      ${isVisible ? "opacity-100 translate-x-0 scale-100" : "opacity-0 translate-x-8 scale-90"}`}
    >
      {/* Main Navigation */}
      <div className="relative mb-6">
        <div className="absolute inset-0 bg-gradient-to-b from-cyan-500/20 via-purple-500/20 to-pink-500/20 rounded-full blur-2xl animate-pulse" />
        <nav className="relative backdrop-blur-2xl bg-white/10 border border-white/20 rounded-full p-3 shadow-2xl flex flex-col items-center space-y-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeSection === item.id;

            return (
              <button
                key={item.id}
                onClick={() => scrollToSection(item.id)}
                className={`group relative flex cursor-pointer items-center justify-center w-12 h-12 rounded-full transition-all duration-300
                ${
                  isActive
                    ? "bg-gradient-to-r from-cyan-500 to-purple-500 shadow-lg scale-110"
                    : "hover:bg-white/20 hover:scale-105"
                }`}
                title={item.label}
              >
                <Icon
                  size={22}
                  className={`transition-colors duration-300 ${
                    isActive
                      ? "text-white"
                      : "text-gray-400 group-hover:text-white"
                  }`}
                />
                {/* Tooltip */}
                <div
                  className={`absolute left-full ml-3 top-1/2 -translate-y-1/2 px-3 py-1 bg-black/80 text-white text-xs rounded-lg whitespace-nowrap opacity-0 group-hover:opacity-100 transition-all duration-300`}
                >
                  {item.label}
                  <div className="absolute left-full top-1/2 -translate-y-1/2 w-0 h-0 border-l-4 border-l-black/80 border-t-2 border-b-2 border-t-transparent border-b-transparent"></div>
                </div>
              </button>
            );
          })}
        </nav>
      </div>

      {/* Social Media */}
      <div className="relative">
        <div className="absolute inset-0 bg-gradient-to-b from-pink-500/20 via-purple-500/20 to-blue-500/20 rounded-full blur-2xl animate-pulse" />
        <div className="relative backdrop-blur-2xl bg-white/10 border border-white/20 rounded-full p-3 shadow-2xl flex flex-col items-center space-y-2">
          {socialItems.map((item, index) => {
            const Icon = item.icon;

            return (
              <a
                key={index}
                href={item.href}
                target="_blank"
                rel="noopener noreferrer"
                className="group relative flex items-center justify-center w-10 h-10 rounded-full hover:bg-white/20 hover:scale-105 transition-all duration-300"
                title={item.label}
              >
                <Icon
                  size={18}
                  className="text-gray-300 group-hover:text-white transition-colors duration-300"
                />
                {/* Tooltip */}
                <div className="absolute right-full mr-3 top-1/2 -translate-y-1/2 px-3 py-1 bg-black/80 text-white text-xs rounded-lg whitespace-nowrap opacity-0 group-hover:opacity-100 transition-all duration-300">
                  {item.label}
                  <div className="absolute left-full top-1/2 -translate-y-1/2 w-0 h-0 border-l-4 border-l-black/80 border-t-2 border-b-2 border-t-transparent border-b-transparent"></div>
                </div>
              </a>
            );
          })}
        </div>
      </div>
    </div>
  );
}

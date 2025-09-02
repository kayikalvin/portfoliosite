import {
  BookOpen,
  Briefcase,
  Code,
  Github,
  Home,
  Linkedin,
} from "lucide-react";
import { useEffect, useState } from "react";

export default function FloatingNavbar() {
  const [activeSection, setActiveSection] = useState("hero");
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 1200);

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
    { id: "hero", icon: Home, label: "Home" },
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
    if (element) element.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <>
      {/* === Desktop Floating Sidebar === */}
      <div
        className={`hidden md:block fixed left-6 top-1/2 -translate-y-1/2 z-50 transition-all duration-700 ease-out
        ${
          isVisible
            ? "opacity-100 translate-x-0 scale-100"
            : "opacity-0 translate-x-8 scale-90"
        }`}
      >
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
                  className={`group flex items-center justify-center w-12 h-12 rounded-full transition-all duration-300
                  ${
                    isActive
                      ? "bg-gradient-to-r from-cyan-500 to-purple-500 shadow-lg scale-110"
                      : "hover:bg-white/20 hover:scale-105"
                  }`}
                  title={item.label}
                >
                  <Icon
                    size={22}
                    className={
                      isActive
                        ? "text-white"
                        : "text-gray-400 group-hover:text-white"
                    }
                  />
                </button>
              );
            })}
          </nav>
        </div>
      </div>

      {/* === Mobile Bottom Nav === */}
      {/* <div className="md:hidden fixed bottom-6 left-1/2 -translate-x-1/2 z-50 w-[85%] max-w-md">
        <nav className="flex justify-around items-center backdrop-blur-xl bg-black/40 border border-white/10 rounded-2xl px-4 py-2 shadow-lg">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeSection === item.id;

            return (
              <button
                key={item.id}
                onClick={() => scrollToSection(item.id)}
                className={`flex flex-col items-center justify-center flex-1 py-2 transition-all duration-300
          ${isActive ? "text-cyan-400" : "text-gray-400 hover:text-white"}`}
              >
                <Icon size={22} />
                <span className="text-[11px] mt-1">{item.label}</span>
              </button>
            );
          })}
        </nav>
      </div> */}
    </>
  );
}

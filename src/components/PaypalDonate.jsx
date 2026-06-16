/**
 * KALVIN KAYI — PAYPAL DONATE
 * Design system: "Machine Precision / Human Warmth"
 *
 * Matches Home.jsx palette + type exactly.
 * No Tailwind gradients, no cyan/blue PayPal branding blobs.
 * The chartreuse accent is the only colour that fires.
 */

import { useState, useEffect, useRef, useCallback } from "react";
import { Heart, X } from "lucide-react";

/* ─────────────────────────────────────────────
   PAYPAL WORDMARK SVG (minimal, on-brand)
───────────────────────────────────────────── */
const PayPalIcon = ({ size = 16, color = "currentColor" }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    aria-hidden
  >
    <path
      d="M7.5 7.5h3.2l-.8 5.2c-.1.9.5 1.8 1.4 2 .9.2 2.9.5 3.8.5 1.3 0 3-.5 3.6-2.6l1.1-5.8H12"
      stroke={color}
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

/* ─────────────────────────────────────────────
   TIER ROW
───────────────────────────────────────────── */
const TIERS = [
  { emoji: "☕", label: "Coffee",          sub: "Fuel a coding session",       amount: "$5"  },
  { emoji: "🎨", label: "Design assets",   sub: "Support UI/UX development",   amount: "$15" },
  { emoji: "🚀", label: "Project sponsor", sub: "Back a larger feature build",  amount: "$50+", featured: true },
];

function TierRow({ tier }) {
  const [hovered, setHovered] = useState(false);
  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "14px 16px",
        borderRadius: 10,
        border: `1px solid ${tier.featured ? (hovered ? "#c8f241" : "rgba(200,242,65,0.25)") : (hovered ? "#2a2a2a" : "#1a1a1a")}`,
        background: hovered ? "#111" : "#0d0d0d",
        transition: "border-color 0.2s, background 0.2s",
        cursor: "default",
      }}
    >
      <div>
        <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 13, color: tier.featured ? "#c8f241" : "#d0d0d0", marginBottom: 2 }}>
          {tier.emoji} {tier.label}
        </div>
        <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 10, letterSpacing: "0.06em", color: "#6b6b6b" }}>
          {tier.sub}
        </div>
      </div>
      <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 13, color: tier.featured ? "#c8f241" : "#f0ede6", flexShrink: 0 }}>
        {tier.amount}
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────
   MAIN COMPONENT
───────────────────────────────────────────── */
export default function PaypalDonate() {
  const [expanded, setExpanded] = useState(false);
  const [visible,  setVisible]  = useState(true);
  const [btnHover, setBtnHover] = useState(false);
  const panelRef = useRef(null);

  const DONATE_URL =
    "https://www.paypal.com/cgi-bin/webscr?cmd=_donations&business=alshaxkalvinkayi@gmail.com&currency_code=USD";

  /* Close panel on outside click */
  useEffect(() => {
    if (!expanded) return;
    const handler = (e) => {
      if (panelRef.current && !panelRef.current.contains(e.target)) {
        setExpanded(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [expanded]);

  const handleMainClick = useCallback((e) => {
    if (!expanded) { e.preventDefault(); setExpanded(true); }
  }, [expanded]);

  const handleConfirm = useCallback(() => {
    window.open(DONATE_URL, "_blank", "noopener,noreferrer");
    setExpanded(false);
  }, []);

  if (!visible) return null;

  return (
    <div
      ref={panelRef}
      role="complementary"
      aria-label="Support this work"
      style={{ position: "fixed", right: 28, bottom: 28, zIndex: 200 }}
    >
      {/* ── Expanded panel ── */}
      {expanded && (
        <div
          style={{
            position: "absolute",
            bottom: "calc(100% + 16px)",
            right: 0,
            width: 300,
            background: "#0a0a0a",
            border: "1px solid #1f1f1f",
            borderRadius: 20,
            overflow: "hidden",
            animation: "panelIn 0.28s cubic-bezier(.23,1,.32,1) both",
            boxShadow: "0 32px 64px rgba(0,0,0,0.6)",
          }}
        >
          {/* Header */}
          <div style={{ padding: "18px 20px", borderBottom: "1px solid #1a1a1a", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <div>
              <div style={{ fontFamily: "'DM Serif Display', serif", fontSize: "1.15rem", fontWeight: 400, color: "#f0ede6", lineHeight: 1.2 }}>
                Support my <span style={{ fontStyle: "italic", color: "#c8f241" }}>work</span>
              </div>
              <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 10, letterSpacing: "0.1em", color: "#6b6b6b", marginTop: 4 }}>
                NAIROBI, KENYA
              </div>
            </div>
            <button
              onClick={() => setExpanded(false)}
              aria-label="Close"
              style={{ width: 28, height: 28, borderRadius: "50%", border: "1px solid #1f1f1f", background: "none", display: "flex", alignItems: "center", justifyContent: "center", cursor: "none", transition: "border-color 0.2s" }}
              onMouseEnter={(e) => { e.currentTarget.style.borderColor = "#6b6b6b"; }}
              onMouseLeave={(e) => { e.currentTarget.style.borderColor = "#1f1f1f"; }}
            >
              <X size={12} color="#6b6b6b" />
            </button>
          </div>

          {/* Body */}
          <div style={{ padding: "20px 20px 0" }}>
            <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 13, lineHeight: 1.7, color: "#6b6b6b", marginBottom: 16 }}>
              Contributions let me spend more time on open-source, educational content,
              and tools for the developer community.
            </p>

            <div style={{ display: "flex", flexDirection: "column", gap: 6, marginBottom: 20 }}>
              {TIERS.map((t) => <TierRow key={t.label} tier={t} />)}
            </div>

            {/* CTA */}
            <button
              onClick={handleConfirm}
              style={{
                width: "100%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 10,
                fontFamily: "'DM Sans', sans-serif",
                fontSize: 14,
                fontWeight: 500,
                padding: "14px 0",
                borderRadius: 40,
                background: "#c8f241",
                color: "#0a0a0a",
                border: "none",
                cursor: "none",
                transition: "opacity 0.2s",
              }}
              onMouseEnter={(e) => { e.currentTarget.style.opacity = "0.88"; }}
              onMouseLeave={(e) => { e.currentTarget.style.opacity = "1"; }}
            >
              <PayPalIcon size={15} color="#0a0a0a" />
              Continue to PayPal
            </button>
          </div>

          {/* Footer */}
          <div style={{ padding: "14px 20px", borderTop: "1px solid #1a1a1a", marginTop: 20 }}>
            <p style={{ fontFamily: "'DM Mono', monospace", fontSize: 10, letterSpacing: "0.08em", color: "#3a3a3a", textAlign: "center" }}>
              SECURE PAYMENT · PAYPAL
            </p>
          </div>
        </div>
      )}

      {/* ── Main FAB ── */}
      <div style={{ position: "relative" }}>
        <a
          href={DONATE_URL}
          onClick={handleMainClick}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Support via PayPal"
          onMouseEnter={() => setBtnHover(true)}
          onMouseLeave={() => setBtnHover(false)}
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 10,
            fontFamily: "'DM Sans', sans-serif",
            fontSize: 13,
            fontWeight: 500,
            padding: "13px 22px",
            borderRadius: 40,
            border: `1.5px solid ${btnHover ? "#c8f241" : "#1f1f1f"}`,
            background: btnHover ? "rgba(200,242,65,0.06)" : "#0d0d0d",
            color: btnHover ? "#c8f241" : "#6b6b6b",
            textDecoration: "none",
            cursor: "none",
            transition: "color 0.2s, border-color 0.2s, background 0.2s, transform 0.3s cubic-bezier(.23,1,.32,1)",
            transform: btnHover ? "translateY(-2px)" : "translateY(0)",
            animation: "fabFloat 3.5s ease-in-out infinite",
            boxShadow: btnHover ? "0 8px 32px rgba(200,242,65,0.08)" : "0 4px 24px rgba(0,0,0,0.4)",
          }}
        >
          <Heart
            size={14}
            color={btnHover ? "#c8f241" : "#6b6b6b"}
            fill={btnHover ? "#c8f241" : "none"}
            style={{ transition: "color 0.2s, fill 0.2s" }}
          />
          <span>Support</span>
          <PayPalIcon size={14} color={btnHover ? "#c8f241" : "#6b6b6b"} />
        </a>

        {/* Dismiss ✕ */}
        <button
          onClick={() => setVisible(false)}
          aria-label="Hide donation button"
          style={{
            position: "absolute",
            top: -8,
            right: -8,
            width: 20,
            height: 20,
            borderRadius: "50%",
            border: "1px solid #1f1f1f",
            background: "#0a0a0a",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "none",
            opacity: btnHover ? 1 : 0,
            transition: "opacity 0.2s",
          }}
          onMouseEnter={(e) => { e.currentTarget.style.borderColor = "#6b6b6b"; }}
          onMouseLeave={(e) => { e.currentTarget.style.borderColor = "#1f1f1f"; }}
        >
          <X size={10} color="#6b6b6b" />
        </button>
      </div>

      <style>{`
        @keyframes fabFloat {
          0%, 100% { transform: translateY(0); }
          50%       { transform: translateY(-4px); }
        }
        @keyframes panelIn {
          from { opacity: 0; transform: translateY(8px) scale(0.97); }
          to   { opacity: 1; transform: translateY(0)  scale(1);    }
        }
        @media (prefers-reduced-motion: reduce) {
          * { animation-duration: 0.01ms !important; transition-duration: 0.01ms !important; }
        }
      `}</style>
    </div>
  );
}
























// import React, { useState, useEffect } from "react";
// import { Heart, Sparkles, X, Gift } from "lucide-react";

// const PayPalIcon = ({ className = "w-6 h-6" }) => (
//   <svg 
//     viewBox="0 0 24 24" 
//     fill="none" 
//     className={className} 
//     xmlns="http://www.w3.org/2000/svg" 
//     aria-hidden
//   >
//     <path 
//       d="M7.5 7.5h3.2l-.8 5.2c-.1.9.5 1.8 1.4 2 .9.2 2.9.5 3.8.5 1.3 0 3-.5 3.6-2.6l1.1-5.8H12" 
//       stroke="currentColor" 
//       strokeWidth="1.2" 
//       strokeLinecap="round" 
//       strokeLinejoin="round" 
//     />
//   </svg>
// );

// export default function PaypalDonate() {
//   const [isExpanded, setIsExpanded] = useState(false);
//   const [isVisible, setIsVisible] = useState(true);
//   const [pulse, setPulse] = useState(false);
  
//   const donateUrl = "https://www.paypal.com/cgi-bin/webscr?cmd=_donations&business=alshaxkalvinkayi@gmail.com&currency_code=USD";

//   // Add periodic pulsing effect
//   useEffect(() => {
//     const interval = setInterval(() => {
//       setPulse(true);
//       setTimeout(() => setPulse(false), 1000);
//     }, 8000); // Pulse every 8 seconds

//     return () => clearInterval(interval);
//   }, []);

//   const handleDonateClick = (e) => {
//     if (!isExpanded) {
//       e.preventDefault();
//       setIsExpanded(true);
//     }
//   };

//   const handleClose = () => {
//     setIsExpanded(false);
//   };

//   const handleDonateConfirm = () => {
//     window.open(donateUrl, '_blank', 'noopener,noreferrer');
//     setIsExpanded(false);
//   };

//   // Hide button if user closes it
//   if (!isVisible) return null;

//   return (
//     <div className="fixed right-6 bottom-6 z-50" role="complementary" aria-label="Support this project">
//       {/* Expanded Panel */}
//       {isExpanded && (
//         <div 
//           className="absolute bottom-full right-0 mb-4 w-80 bg-gradient-to-br from-gray-900 to-black border border-white/20 rounded-2xl shadow-2xl overflow-hidden backdrop-blur-xl animate-fade-in"
//         >
//           {/* Header */}
//           <div className="p-4 border-b border-white/10 flex justify-between items-center">
//             <div className="flex items-center gap-3">
//               <div className="w-10 h-10 rounded-full bg-gradient-to-r from-[#003087] to-[#009cde] flex items-center justify-center">
//                 <Heart className="w-5 h-5 text-white" fill="currentColor" />
//               </div>
//               <div>
//                 <h3 className="font-bold text-white">Support My Work</h3>
//                 <p className="text-xs text-gray-400">Your contribution helps me continue creating</p>
//               </div>
//             </div>
//             <button
//               onClick={handleClose}
//               className="p-1 hover:bg-white/10 rounded-full transition-colors"
//               aria-label="Close donation panel"
//             >
//               <X className="w-4 h-4 text-gray-400" />
//             </button>
//           </div>

//           {/* Content */}
//           <div className="p-6">
//             <div className="flex items-center justify-center gap-2 mb-4">
//               <Sparkles className="w-4 h-4 text-yellow-400" />
//               <span className="text-sm text-gray-300">Every contribution matters!</span>
//               <Sparkles className="w-4 h-4 text-yellow-400" />
//             </div>
            
//             <p className="text-gray-300 text-sm leading-relaxed mb-6">
//               Your support helps me dedicate more time to open-source projects, 
//               create educational content, and build tools that benefit the developer community.
//             </p>

//             <div className="space-y-4">
//               <div className="bg-white/5 rounded-xl p-4 border border-white/10">
//                 <div className="flex items-center justify-between mb-2">
//                   <span className="text-sm text-gray-400">☕ Coffee</span>
//                   <span className="text-sm font-semibold text-white">$5</span>
//                 </div>
//                 <div className="text-xs text-gray-500">Help fuel my coding sessions</div>
//               </div>

//               <div className="bg-white/5 rounded-xl p-4 border border-white/10">
//                 <div className="flex items-center justify-between mb-2">
//                   <span className="text-sm text-gray-400">🎨 Design Assets</span>
//                   <span className="text-sm font-semibold text-white">$15</span>
//                 </div>
//                 <div className="text-xs text-gray-500">Support UI/UX development</div>
//               </div>

//               <div className="bg-white/5 rounded-xl p-4 border border-white/10 border-2 border-[#ffc439]">
//                 <div className="flex items-center justify-between mb-2">
//                   <span className="text-sm text-[#ffc439]">🚀 Project Sponsor</span>
//                   <span className="text-sm font-semibold text-[#ffc439]">$50+</span>
//                 </div>
//                 <div className="text-xs text-gray-500">Support larger feature development</div>
//               </div>
//             </div>

//             <button
//               onClick={handleDonateConfirm}
//               className="w-full mt-6 px-6 py-3 rounded-xl bg-gradient-to-r from-[#003087] to-[#009cde] text-white font-semibold hover:opacity-90 transition-all flex items-center justify-center gap-3 shadow-lg"
//             >
//               <PayPalIcon className="w-5 h-5 text-white" />
//               Continue to PayPal
//             </button>
//           </div>

//           {/* Footer */}
//           <div className="p-4 border-t border-white/10 bg-black/50">
//             <p className="text-xs text-center text-gray-500">
//               Secure payment via PayPal • 100% secure
//             </p>
//           </div>
//         </div>
//       )}

//       {/* Main Donate Button */}
//       <div className={`relative ${pulse ? 'animate-pulse-slow' : ''}`}>
//         {/* Glow effect */}
//         <div className="absolute inset-0 bg-gradient-to-r from-[#003087] to-[#009cde] rounded-full blur-xl opacity-50 animate-pulse" />
        
//         {/* Floating effect */}
//         <div className="relative animate-float">
//           <a
//             href={donateUrl}
//             onClick={handleDonateClick}
//             target="_blank"
//             rel="noopener noreferrer"
//             aria-label="Donate via PayPal"
//             className="flex items-center gap-3 px-5 py-4 bg-gradient-to-r from-[#003087] via-[#0066cc] to-[#009cde] text-white rounded-full shadow-2xl hover:shadow-[#ffc439]/30 hover:scale-110 transform transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-[#ffc439]/40 group"
//           >
//             {/* Heart icon with animation */}
//             <div className="relative">
//               <Heart className="w-5 h-5 text-white group-hover:scale-110 transition-transform" fill="currentColor" />
//               <div className="absolute inset-0 animate-ping opacity-20">
//                 <Heart className="w-5 h-5 text-pink-400" fill="currentColor" />
//               </div>
//             </div>

//             {/* Text that appears on hover */}
//             <div className="hidden sm:flex items-center gap-3">
//               <span className="font-bold text-sm tracking-wide">Support Me</span>
//               <div className="flex items-center gap-1">
//                 <span className="text-xs bg-[#ffc439] text-black px-2 py-0.5 rounded-full font-bold">
//                   PayPal
//                 </span>
//                 <Gift className="w-4 h-4 text-[#ffc439]" />
//               </div>
//             </div>

//             {/* Mobile text */}
//             <span className="sm:hidden font-bold text-sm">Support</span>
//           </a>

//           {/* Small close button */}
//           <button
//             onClick={() => setIsVisible(false)}
//             className="absolute -top-2 -right-2 w-6 h-6 bg-gray-800 border border-white/20 rounded-full flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity group-hover:opacity-100"
//             aria-label="Hide donation button"
//           >
//             <X className="w-3 h-3 text-gray-400" />
//           </button>
//         </div>
//       </div>

//       {/* Add custom animations */}
//       <style jsx>{`
//         @keyframes float {
//           0%, 100% { transform: translateY(0px); }
//           50% { transform: translateY(-5px); }
//         }
        
//         @keyframes fade-in {
//           from { opacity: 0; transform: translateY(10px) scale(0.95); }
//           to { opacity: 1; transform: translateY(0) scale(1); }
//         }
        
//         @keyframes pulse-slow {
//           0%, 100% { transform: scale(1); }
//           50% { transform: scale(1.05); }
//         }
        
//         .animate-float {
//           animation: float 3s ease-in-out infinite;
//         }
        
//         .animate-fade-in {
//           animation: fade-in 0.3s ease-out forwards;
//         }
        
//         .animate-pulse-slow {
//           animation: pulse-slow 2s ease-in-out;
//         }
//       `}</style>
//     </div>
//   );
// }

















// // import React from "react";

// // const PayPalIcon = ({ className = "w-6 h-6" }) => (
// //   <svg viewBox="0 0 24 24" fill="none" className={className} xmlns="http://www.w3.org/2000/svg" aria-hidden>
// //     <path d="M5.5 7.5h3.2l-.8 5.2c-.1.9.5 1.8 1.4 2 .9.2 2.9.5 3.8.5 1.3 0 3-.5 3.6-2.6l1.1-5.8H12" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
// //   </svg>
// // );

// // export default function PaypalDonate() {
// //   // Replace with your PayPal.me link or PayPal donation URL
// //   const donateUrl = "https://www.paypal.com/cgi-bin/webscr?cmd=_donations&business=alshaxkalvinkayi@gmail.com&currency_code=USD";

// //   return (
// //     <div aria-hidden={false}>
// //       <a
// //         href={donateUrl}
// //         target="_blank"
// //         rel="noopener noreferrer"
// //         aria-label="Donate via PayPal"
// //         className="fixed right-6 bottom-6 z-50 flex items-center gap-3 px-4 py-3 bg-[#003087] text-white rounded-full shadow-2xl hover:scale-105 transform transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-[#ffc439]/30"
// //       >
// //         <span className="sr-only">Donate via PayPal</span>
// //         <PayPalIcon className="w-5 h-5 text-white" />
// //         <span className="hidden sm:inline-block font-semibold">Donate</span>
// //       </a>
// //     </div>
// //   );
// // }

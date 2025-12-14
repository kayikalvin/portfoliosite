import React, { useState, useEffect } from "react";
import { Heart, Sparkles, X, Gift } from "lucide-react";

const PayPalIcon = ({ className = "w-6 h-6" }) => (
  <svg 
    viewBox="0 0 24 24" 
    fill="none" 
    className={className} 
    xmlns="http://www.w3.org/2000/svg" 
    aria-hidden
  >
    <path 
      d="M7.5 7.5h3.2l-.8 5.2c-.1.9.5 1.8 1.4 2 .9.2 2.9.5 3.8.5 1.3 0 3-.5 3.6-2.6l1.1-5.8H12" 
      stroke="currentColor" 
      strokeWidth="1.2" 
      strokeLinecap="round" 
      strokeLinejoin="round" 
    />
  </svg>
);

export default function PaypalDonate() {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [pulse, setPulse] = useState(false);
  
  const donateUrl = "https://www.paypal.com/cgi-bin/webscr?cmd=_donations&business=alshaxkalvinkayi@gmail.com&currency_code=USD";

  // Add periodic pulsing effect
  useEffect(() => {
    const interval = setInterval(() => {
      setPulse(true);
      setTimeout(() => setPulse(false), 1000);
    }, 8000); // Pulse every 8 seconds

    return () => clearInterval(interval);
  }, []);

  const handleDonateClick = (e) => {
    if (!isExpanded) {
      e.preventDefault();
      setIsExpanded(true);
    }
  };

  const handleClose = () => {
    setIsExpanded(false);
  };

  const handleDonateConfirm = () => {
    window.open(donateUrl, '_blank', 'noopener,noreferrer');
    setIsExpanded(false);
  };

  // Hide button if user closes it
  if (!isVisible) return null;

  return (
    <div className="fixed right-6 bottom-6 z-50" role="complementary" aria-label="Support this project">
      {/* Expanded Panel */}
      {isExpanded && (
        <div 
          className="absolute bottom-full right-0 mb-4 w-80 bg-gradient-to-br from-gray-900 to-black border border-white/20 rounded-2xl shadow-2xl overflow-hidden backdrop-blur-xl animate-fade-in"
        >
          {/* Header */}
          <div className="p-4 border-b border-white/10 flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-r from-[#003087] to-[#009cde] flex items-center justify-center">
                <Heart className="w-5 h-5 text-white" fill="currentColor" />
              </div>
              <div>
                <h3 className="font-bold text-white">Support My Work</h3>
                <p className="text-xs text-gray-400">Your contribution helps me continue creating</p>
              </div>
            </div>
            <button
              onClick={handleClose}
              className="p-1 hover:bg-white/10 rounded-full transition-colors"
              aria-label="Close donation panel"
            >
              <X className="w-4 h-4 text-gray-400" />
            </button>
          </div>

          {/* Content */}
          <div className="p-6">
            <div className="flex items-center justify-center gap-2 mb-4">
              <Sparkles className="w-4 h-4 text-yellow-400" />
              <span className="text-sm text-gray-300">Every contribution matters!</span>
              <Sparkles className="w-4 h-4 text-yellow-400" />
            </div>
            
            <p className="text-gray-300 text-sm leading-relaxed mb-6">
              Your support helps me dedicate more time to open-source projects, 
              create educational content, and build tools that benefit the developer community.
            </p>

            <div className="space-y-4">
              <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-gray-400">☕ Coffee</span>
                  <span className="text-sm font-semibold text-white">$5</span>
                </div>
                <div className="text-xs text-gray-500">Help fuel my coding sessions</div>
              </div>

              <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-gray-400">🎨 Design Assets</span>
                  <span className="text-sm font-semibold text-white">$15</span>
                </div>
                <div className="text-xs text-gray-500">Support UI/UX development</div>
              </div>

              <div className="bg-white/5 rounded-xl p-4 border border-white/10 border-2 border-[#ffc439]">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-[#ffc439]">🚀 Project Sponsor</span>
                  <span className="text-sm font-semibold text-[#ffc439]">$50+</span>
                </div>
                <div className="text-xs text-gray-500">Support larger feature development</div>
              </div>
            </div>

            <button
              onClick={handleDonateConfirm}
              className="w-full mt-6 px-6 py-3 rounded-xl bg-gradient-to-r from-[#003087] to-[#009cde] text-white font-semibold hover:opacity-90 transition-all flex items-center justify-center gap-3 shadow-lg"
            >
              <PayPalIcon className="w-5 h-5 text-white" />
              Continue to PayPal
            </button>
          </div>

          {/* Footer */}
          <div className="p-4 border-t border-white/10 bg-black/50">
            <p className="text-xs text-center text-gray-500">
              Secure payment via PayPal • 100% secure
            </p>
          </div>
        </div>
      )}

      {/* Main Donate Button */}
      <div className={`relative ${pulse ? 'animate-pulse-slow' : ''}`}>
        {/* Glow effect */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#003087] to-[#009cde] rounded-full blur-xl opacity-50 animate-pulse" />
        
        {/* Floating effect */}
        <div className="relative animate-float">
          <a
            href={donateUrl}
            onClick={handleDonateClick}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Donate via PayPal"
            className="flex items-center gap-3 px-5 py-4 bg-gradient-to-r from-[#003087] via-[#0066cc] to-[#009cde] text-white rounded-full shadow-2xl hover:shadow-[#ffc439]/30 hover:scale-110 transform transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-[#ffc439]/40 group"
          >
            {/* Heart icon with animation */}
            <div className="relative">
              <Heart className="w-5 h-5 text-white group-hover:scale-110 transition-transform" fill="currentColor" />
              <div className="absolute inset-0 animate-ping opacity-20">
                <Heart className="w-5 h-5 text-pink-400" fill="currentColor" />
              </div>
            </div>

            {/* Text that appears on hover */}
            <div className="hidden sm:flex items-center gap-3">
              <span className="font-bold text-sm tracking-wide">Support Me</span>
              <div className="flex items-center gap-1">
                <span className="text-xs bg-[#ffc439] text-black px-2 py-0.5 rounded-full font-bold">
                  PayPal
                </span>
                <Gift className="w-4 h-4 text-[#ffc439]" />
              </div>
            </div>

            {/* Mobile text */}
            <span className="sm:hidden font-bold text-sm">Support</span>
          </a>

          {/* Small close button */}
          <button
            onClick={() => setIsVisible(false)}
            className="absolute -top-2 -right-2 w-6 h-6 bg-gray-800 border border-white/20 rounded-full flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity group-hover:opacity-100"
            aria-label="Hide donation button"
          >
            <X className="w-3 h-3 text-gray-400" />
          </button>
        </div>
      </div>

      {/* Add custom animations */}
      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-5px); }
        }
        
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(10px) scale(0.95); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }
        
        @keyframes pulse-slow {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.05); }
        }
        
        .animate-float {
          animation: float 3s ease-in-out infinite;
        }
        
        .animate-fade-in {
          animation: fade-in 0.3s ease-out forwards;
        }
        
        .animate-pulse-slow {
          animation: pulse-slow 2s ease-in-out;
        }
      `}</style>
    </div>
  );
}

















// import React from "react";

// const PayPalIcon = ({ className = "w-6 h-6" }) => (
//   <svg viewBox="0 0 24 24" fill="none" className={className} xmlns="http://www.w3.org/2000/svg" aria-hidden>
//     <path d="M5.5 7.5h3.2l-.8 5.2c-.1.9.5 1.8 1.4 2 .9.2 2.9.5 3.8.5 1.3 0 3-.5 3.6-2.6l1.1-5.8H12" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
//   </svg>
// );

// export default function PaypalDonate() {
//   // Replace with your PayPal.me link or PayPal donation URL
//   const donateUrl = "https://www.paypal.com/cgi-bin/webscr?cmd=_donations&business=alshaxkalvinkayi@gmail.com&currency_code=USD";

//   return (
//     <div aria-hidden={false}>
//       <a
//         href={donateUrl}
//         target="_blank"
//         rel="noopener noreferrer"
//         aria-label="Donate via PayPal"
//         className="fixed right-6 bottom-6 z-50 flex items-center gap-3 px-4 py-3 bg-[#003087] text-white rounded-full shadow-2xl hover:scale-105 transform transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-[#ffc439]/30"
//       >
//         <span className="sr-only">Donate via PayPal</span>
//         <PayPalIcon className="w-5 h-5 text-white" />
//         <span className="hidden sm:inline-block font-semibold">Donate</span>
//       </a>
//     </div>
//   );
// }

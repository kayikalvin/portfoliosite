import React from "react";

const PayPalIcon = ({ className = "w-6 h-6" }) => (
  <svg viewBox="0 0 24 24" fill="none" className={className} xmlns="http://www.w3.org/2000/svg" aria-hidden>
    <path d="M5.5 7.5h3.2l-.8 5.2c-.1.9.5 1.8 1.4 2 .9.2 2.9.5 3.8.5 1.3 0 3-.5 3.6-2.6l1.1-5.8H12" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export default function PaypalDonate() {
  // Replace with your PayPal.me link or PayPal donation URL
  const donateUrl = "https://www.paypal.com/cgi-bin/webscr?cmd=_donations&business=alshaxkalvinkayi@gmail.com&currency_code=USD";

  return (
    <div aria-hidden={false}>
      <a
        href={donateUrl}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Donate via PayPal"
        className="fixed right-6 bottom-6 z-50 flex items-center gap-3 px-4 py-3 bg-[#003087] text-white rounded-full shadow-2xl hover:scale-105 transform transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-[#ffc439]/30"
      >
        <span className="sr-only">Donate via PayPal</span>
        <PayPalIcon className="w-5 h-5 text-white" />
        <span className="hidden sm:inline-block font-semibold">Donate</span>
      </a>
    </div>
  );
}

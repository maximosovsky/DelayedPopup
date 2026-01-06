import { usePopUp } from "../contexts/PopUpContext";
import { useState, useEffect } from "react";
import { clearPopupCookie } from "../lib/cookie";

export default function ChatButton() {
  const { showPopUp } = usePopUp();
  const [isHovered, setIsHovered] = useState(false);
  const [bounce, setBounce] = useState(false);
  
  useEffect(() => {
    const interval = setInterval(() => {
      setBounce(true);
      setTimeout(() => setBounce(false), 1000);
    }, 5000);
    
    return () => clearInterval(interval);
  }, []);
  
  return (
    <button
      className={`fixed bottom-5 right-5 bg-purple-400 text-white w-16 h-16 rounded-full 
                flex items-center justify-center shadow-lg z-40 transition-all duration-300 
                hover:scale-110 hover:bg-purple-500 border-2 border-white
                ${bounce ? 'animate-bounce' : ''}`}
      onClick={() => {
        clearPopupCookie();
        showPopUp();
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      aria-label="Open chat"
    >
      {isHovered ? (
        <svg 
          xmlns="http://www.w3.org/2000/svg" 
          width="30" 
          height="30" 
          viewBox="0 0 24 24" 
          fill="none" 
          stroke="currentColor" 
          strokeWidth="2" 
          strokeLinecap="round" 
          strokeLinejoin="round"
          className="animate-wiggle"
        >
          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" fill="rgba(255,255,255,0.2)" />
          <circle cx="8" cy="9" r="1" fill="#ffffff" />
          <circle cx="16" cy="9" r="1" fill="#ffffff" />
          <path d="M8 13C8.5 14.5 10 16 12 16C14 16 15.5 14.5 16 13" stroke="#ffffff" strokeWidth="2" />
        </svg>
      ) : (
        <svg 
          xmlns="http://www.w3.org/2000/svg" 
          width="30" 
          height="30" 
          viewBox="0 0 24 24" 
          fill="none" 
          stroke="currentColor" 
          strokeWidth="2" 
          strokeLinecap="round" 
          strokeLinejoin="round"
        >
          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" fill="rgba(255,255,255,0.2)" />
          <circle cx="8" cy="9" r="1" fill="#ffffff" />
          <circle cx="16" cy="9" r="1" fill="#ffffff" />
          <path d="M8 12C9.5 14 11.5 14 12 14C12.5 14 14.5 14 16 12" stroke="#ffffff" strokeWidth="2" />
        </svg>
      )}
    </button>
  );
}

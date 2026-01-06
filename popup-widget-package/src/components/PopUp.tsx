import { useEffect, useRef } from "react";
import { usePopUp } from "../contexts/PopUpContext";
import { cn } from "../lib/utils";
import PaymentButton from "./PaymentButton";

interface PopUpProps {
  title: string;
  description: string;
  price: string;
  discount?: string;
  imageSrc?: string;
  amount: number;
  avatarSrc?: string;
  avatarName?: string;
}

export default function PopUp({
  title,
  description,
  price,
  discount,
  imageSrc,
  amount,
  avatarSrc,
  avatarName = "Georgie"
}: PopUpProps) {
  const { isOpen, hidePopUp } = usePopUp();
  const popupRef = useRef<HTMLDivElement>(null);
  const paymentButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (popupRef.current && !popupRef.current.contains(event.target as Node)) {
        hidePopUp();
      }
    }

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen, hidePopUp]);

  useEffect(() => {
    function handleEscapeKey(event: KeyboardEvent) {
      if (event.key === "Escape") {
        hidePopUp();
      }
    }

    if (isOpen) {
      document.addEventListener("keydown", handleEscapeKey);
    }
    
    return () => {
      document.removeEventListener("keydown", handleEscapeKey);
    };
  }, [isOpen, hidePopUp]);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className={cn(
      "fixed inset-0 bg-black bg-opacity-50 z-50 flex items-end justify-end p-0",
      "transition-opacity duration-300",
      isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
    )}>
      <div 
        ref={popupRef}
        className={cn(
          "relative bg-white rounded-3xl shadow-2xl max-w-xs w-full overflow-hidden m-5 mr-5 mb-5",
          "transition-all duration-300 transform",
          "animate-in fade-in-0 slide-in-from-bottom-5 duration-500",
          isOpen ? "scale-100 opacity-100" : "scale-95 opacity-0"
        )}
      >
        <div className="border-b border-gray-100 p-3 flex items-center justify-between">
          <div className="flex items-center">
            <button 
              onClick={hidePopUp}
              className="mr-3 text-gray-500 hover:text-gray-700 focus:outline-none"
              aria-label="Back"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="15 18 9 12 15 6"></polyline>
              </svg>
            </button>
            
            <div className="flex items-center">
              <div className="h-10 w-10 rounded-full overflow-hidden flex-shrink-0 mr-3">
                {avatarSrc ? (
                  <img src={avatarSrc} alt="Avatar" className="h-full w-full object-cover" />
                ) : (
                  <div className="h-full w-full bg-purple-400 flex items-center justify-center text-white font-bold">
                    {avatarName.charAt(0)}
                  </div>
                )}
              </div>
              <div>
                <div className="font-semibold">{avatarName}</div>
                <div className="text-xs text-gray-500 flex items-center">
                  <span className="inline-block h-2 w-2 rounded-full bg-green-500 mr-1.5 online-indicator"></span>
                  online
                </div>
              </div>
            </div>
          </div>
          
          <div className="flex items-center">
            <button className="mx-2 text-gray-500 hover:text-gray-700 focus:outline-none">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="1"></circle>
                <circle cx="19" cy="12" r="1"></circle>
                <circle cx="5" cy="12" r="1"></circle>
              </svg>
            </button>
            <button className="text-gray-500 hover:text-gray-700 focus:outline-none">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="15 3 21 3 21 9"></polyline>
                <polyline points="9 21 3 21 3 15"></polyline>
                <line x1="21" y1="3" x2="14" y2="10"></line>
                <line x1="3" y1="21" x2="10" y2="14"></line>
              </svg>
            </button>
          </div>
        </div>
        
        <div className="p-4">
          <div className="flex gap-3 mb-3 items-start">
            <div className="flex-1">
              {imageSrc && (
                <div className="w-full rounded-xl overflow-hidden mb-4 bg-gray-100">
                  <img 
                    src={imageSrc} 
                    alt="Content"
                    className="w-full object-cover"
                  />
                </div>
              )}
              <div className="flex items-center gap-2 mb-1">
                <span className="text-base">👋</span>
                <h2 className="text-base font-bold text-gray-800">
                  {title}
                </h2>
              </div>
              
              <div className="text-gray-700 mb-0 whitespace-pre-line leading-tight text-sm">
                {description}
              </div>
            </div>
          </div>
          
          {price && (
            <div className="flex items-center justify-between mb-1 -mt-1">
              <div>
                <span className="text-2xl font-bold text-green-400">{price}</span>
              </div>
              {discount && (
                <div className="flex flex-col items-end">
                  <div className="text-3xl text-gray-400 line-through font-semibold">
                    {discount}
                  </div>
                  <span className="text-xxs font-normal text-red-500 -mt-1">Discount 38.1%</span>
                </div>
              )}
            </div>
          )}
          
          <PaymentButton amount={amount} buttonRef={paymentButtonRef} />
        </div>
        
        <div className="p-3 border-t border-gray-100 bg-gray-50 mt-0 flex items-center">
          <div 
            className="w-full rounded-full bg-white border border-gray-200 px-3 py-2 text-gray-400 flex items-center text-xs cursor-pointer hover:bg-gray-50"
            onClick={() => paymentButtonRef.current?.click()}
          >
            Your message...
            <div className="ml-auto flex gap-2">
              <span className="text-gray-300 text-base">😊</span>
              <span className="text-gray-300 text-base">GIF</span>
              <span className="text-gray-300 text-base">📎</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

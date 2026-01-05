import { createContext, useContext, useState, useCallback, useEffect, ReactNode } from "react";
import { getCookie, setCookie } from "@/lib/cookie";

interface PopUpContextType {
  isOpen: boolean;
  showPopUp: () => void;
  hidePopUp: () => void;
  updatePopUpConfig: (config: Partial<PopUpConfig>) => void;
  popupContent: PopUpContent;
  updatePopUpContent: (content: Partial<PopUpContent>) => void;
}

interface PopUpConfig {
  cookieName: string;
  cookieDuration: number; // days
  delay: number; // milliseconds
  enableCookies: boolean; // whether to use cookies to track if popup has been shown
}

interface PopUpContent {
  title: string;
  description: string;
  price: string;
  discount?: string;
  imageSrc?: string;
  amount: number;
}

interface PopUpProviderProps {
  children: ReactNode;
}

const PopUpContext = createContext<PopUpContextType | undefined>(undefined);

export function PopUpProvider({ children }: PopUpProviderProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [config, setConfig] = useState<PopUpConfig>({
    cookieName: "popupShown",
    cookieDuration: 7, // days
    delay: 2000, // 2 seconds
    enableCookies: true,
  });

  const [popupContent, setPopupContent] = useState<PopUpContent>({
    title: "Let us do all the work for you!",
    description: "I could register your @username across 16 platforms and set up your profiles. I'll reach out instantly after payment to discuss everything.",
    price: "$100",
    discount: "$160",
    imageSrc: "https://images.unsplash.com/photo-1551434678-e076c223a692?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80",
    amount: 10000,
  });

  const showPopUp = useCallback(() => {
    // Always show popup when called, regardless of cookie status
    setIsOpen(true);
  }, []);

  const hidePopUp = useCallback(() => {
    setIsOpen(false);
    // Set cookie to remember that popup has been shown (if cookies are enabled)
    if (config.enableCookies) {
      setCookie(config.cookieName, "true", config.cookieDuration);
    }
  }, [config]);

  const updatePopUpConfig = useCallback((newConfig: Partial<PopUpConfig>) => {
    setConfig(prevConfig => ({ ...prevConfig, ...newConfig }));
  }, []);

  const updatePopUpContent = useCallback((newContent: Partial<PopUpContent>) => {
    setPopupContent(prevContent => ({ ...prevContent, ...newContent }));
  }, []);

  // Check for cookie on initial render (if cookies are enabled)
  useEffect(() => {
    if (config.enableCookies) {
      const hasPopupBeenShown = getCookie(config.cookieName) === "true";
      if (hasPopupBeenShown) {
        setIsOpen(false);
      }
    }
  }, [config.cookieName, config.enableCookies]);

  const value = {
    isOpen,
    showPopUp,
    hidePopUp,
    updatePopUpConfig,
    popupContent,
    updatePopUpContent,
  };

  return <PopUpContext.Provider value={value}>{children}</PopUpContext.Provider>;
}

export function usePopUp() {
  const context = useContext(PopUpContext);
  if (context === undefined) {
    throw new Error("usePopUp must be used within a PopUpProvider");
  }
  return context;
}

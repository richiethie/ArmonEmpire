import React, { createContext, useContext, useState, useEffect } from "react";

// Create Context
export const IsMobileContext = createContext<boolean | undefined>(undefined);

// Custom Hook for consuming the context
export const useIsMobile = () => {
  const context = useContext(IsMobileContext);
  if (context === undefined) {
    throw new Error("useIsMobile must be used within a IsMobileProvider");
  }
  return context;
};

// Provider Component
export const IsMobileProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return <IsMobileContext.Provider value={isMobile}>{children}</IsMobileContext.Provider>;
};
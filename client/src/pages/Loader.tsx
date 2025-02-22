import React, { useEffect } from 'react';
import ArmonEmpireLogo from "../assets/img/ArmonEmpireLogo.png";
import "../styles/Loader.css";
import { useIsMobile } from '@/context/MobileContext';

const Loader = () => {
  const isMobile = useIsMobile();
  useEffect(() => {
    // Trigger fade-out at 3 seconds (or adjust as needed)
    const timer = setTimeout(() => {
      const loader = document.querySelector('.loader-container');
      loader?.classList.add('fade-out');
    }, 1500);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="loader-container fixed top-0 left-0 w-full h-screen z-50">
      {/* White background with logo & loading dots (always in the background) */}
      <div className="white-screen absolute top-0 left-0 w-full h-full z-10 bg-white flex flex-col justify-center items-center">
        <div className="logo-container flex flex-col justify-center items-center mb-20">
          <img src={ArmonEmpireLogo} alt="Logo" className="w-28 h-auto" />
          <div className="loading-dots flex space-x-2 mt-4">
            <div className="dot"></div>
            <div className="dot"></div>
            <div className="dot"></div>
            <div className="dot"></div>
          </div>
        </div>
      </div>

      {/* Black overlay divs at a higher z-index */}
      <div className="black-overlay top-overlay absolute top-0 left-0 w-full h-1/2 z-30 bg-black animate-move-up"></div>
      <div className="black-overlay bottom-overlay absolute bottom-0 left-0 w-full h-1/2 z-30 bg-black animate-move-down"></div>
    </div>
  );
};

export default Loader;

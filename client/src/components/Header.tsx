import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import ArmonPartialLogo from "../assets/img/ArmonPartialLogo.png";

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50); // Change background after 50px scroll
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 w-full z-10 p-4 transition-all duration-300 ${
        isScrolled ? "bg-black shadow-lg" : "bg-transparent"
      }`}
    >
        <div className="flex relative justify-between items-center mx-auto">
            {/* Logo */}
            <div className="flex text-6xl">  
                <div className="flex justify-center items-center w-15 mr-[2] bg-white rounded-full">
                    <img src={ArmonPartialLogo} alt="Armon Empire Logo" className="h-12 pb-1" />
                </div>
                <h1 className="text-white ml-1">Armon Empire</h1>
            </div>

            {/* Navigation */}
            <nav className="absolute w-full flex justify-center space-x-6 hidden md:flex">
                <Link to="/home" className="text-xl text-white font-bold hover:text-orange-300">
                    Home
                </Link>
                <Link to="/services" className="text-xl text-white font-bold hover:text-orange-300">
                    Services
                </Link>
                <Link to="/schedule" className="text-xl text-white font-bold hover:text-orange-300">
                    Schedule
                </Link>
                <Link to="/gallery" className="text-xl text-white font-bold hover:text-orange-300">
                    Gallery
                </Link>
                <Link to="/location" className="text-xl text-white font-bold hover:text-orange-300">
                    Location
                </Link>
            </nav>

            {/* Button */}
            <button className="text-white font-semibold border border-white px-4 py-2 rounded-md cursor-pointer hover:text-orange-300 hover:border-orange-300">
                Member Login
            </button>
        </div>
    </header>
  );
};

export default Header;

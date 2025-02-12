import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import ArmonPartialLogo from "../assets/img/ArmonPartialLogo.png";
import { useIsMobile } from '@/context/MobileContext';
import { FaBars } from "react-icons/fa"; // Import the hamburger icon
import { IoClose } from "react-icons/io5";
import { useNavigate } from "react-router-dom";

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isDrawerOpen, setDrawerOpen] = useState(false); // Drawer state
  const isMobile = useIsMobile();
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50); // Change background after 50px scroll
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Toggle drawer open/close
  const toggleDrawer = () => setDrawerOpen((prev) => !prev);

  // Mobile view
  if (isMobile) {
    return (
      <header
        className={`fixed top-0 left-0 w-full z-10 p-4 transition-all duration-300 ${
          isScrolled ? "bg-black" : "bg-transparent"
        }`}
      >
        <div className="flex justify-between items-center mx-auto">
          {/* Logo */}
          <div onClick={() => navigate("/")} className="flex items-center text-4xl">
            <div className="flex justify-center items-center w-12 mr-[2] bg-white rounded-full">
              <img src={ArmonPartialLogo} alt="Armon Empire Logo" className="h-12 pb-1" />
            </div>
            <h1 className="text-white mt-1 ml-1">Armon Empire</h1>
          </div>

          {/* Hamburger Icon (Mobile Menu) */}
          <button
            onClick={toggleDrawer}
            className="text-white text-2xl p-2 md:hidden"
            aria-label="Open Drawer"
          >
            <FaBars />
          </button>
        </div>

        {/* Mobile Drawer (Hidden until button is clicked) */}
        {isDrawerOpen && (
          <div className="fixed inset-0 bg-black z-20 flex">
            <aside className="bg-charcoal w-full p-4 overflow-y-scroll">
              <div className="flex justify-between items-center mb-4">
                <div 
                  onClick={() => {
                    navigate("/");
                    toggleDrawer();
                  }} 
                  className="flex items-center text-4xl"
                >
                  <div className="flex justify-center items-center w-12 mr-[2] bg-white rounded-full">
                    <img src={ArmonPartialLogo} alt="Armon Empire Logo" className="h-12 pb-1" />
                  </div>
                  <h1 className="text-white mt-1 ml-1">Armon Empire</h1>
                </div>
                <button
                  onClick={toggleDrawer}
                  className="text-white text-4xl p-1"
                  aria-label="Close Drawer"
                >
                  <IoClose />
                </button>
              </div>

              {/* Drawer Navigation Links */}
              <nav className="flex flex-col items-center justify-center mt-12">
                <Link to="/" onClick={toggleDrawer} className="text-3xl text-white font-bold hover:text-orange-300 py-6 block">Home</Link>
                <Link to="/services" onClick={toggleDrawer} className="text-3xl text-white font-bold hover:text-orange-300 py-6 block">Services</Link>
                <Link to="/schedule" onClick={toggleDrawer} className="text-3xl text-white font-bold hover:text-orange-300 py-6 block">Schedule</Link>
                <Link to="/gallery" onClick={toggleDrawer} className="text-3xl text-white font-bold hover:text-orange-300 py-6 block">Gallery</Link>
                <Link to="/location" onClick={toggleDrawer} className="text-3xl text-white font-bold hover:text-orange-300 py-6 block">Location</Link>
              </nav>

              {/* Mobile Button */}
              <div className="text-center mt-6">
                <button 
                  onClick={() => {
                    navigate("/login");
                    toggleDrawer();
                  }} 
                  className="text-white text-xl font-semibold border border-white px-4 py-2 rounded-md cursor-pointer hover:text-orange-300 hover:border-orange-300"
                >
                  Member Login
                </button>
              </div>
            </aside>

            {/* Close the drawer when clicking outside */}
            <div
              className="flex-1"
              onClick={toggleDrawer} // Close drawer when clicking outside
            />
          </div>
        )}
      </header>
    );
  }

  // Desktop or Tablet view (falls back to original layout)
  return (
    <header
      className={`fixed top-0 left-0 w-full z-10 p-4 transition-all duration-300 ${
        isScrolled ? "bg-black shadow-lg" : "bg-transparent"
      }`}
    >
      <div className="flex relative justify-between items-center mx-auto">
        {/* Logo */}
        <div 
          className="flex text-6xl cursor-pointer z-30"
          onClick={() => {
            navigate("/");
            toggleDrawer();
          }} 
        >
          <div className="flex justify-center items-center w-16 mr-[2] bg-white rounded-full">
            <img src={ArmonPartialLogo} alt="Armon Empire Logo" className="h-12 pb-1" />
          </div>
          <h1 className="text-white ml-1">Armon Empire</h1>
        </div>

        {/* Navigation */}
        <nav className="absolute w-full flex justify-center space-x-6 hidden md:flex">
          <Link to="/" className="text-xl text-white font-bold hover:text-orange-300">
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
        <button
          onClick={() => {
            navigate("/login");
            toggleDrawer();
          }}
          className="text-white font-semibold border border-white px-4 py-2 rounded-md cursor-pointer hover:text-orange-300 hover:border-orange-300 z-30"
        >
          Member Login
        </button>
      </div>
    </header>
  );
};

export default Header;

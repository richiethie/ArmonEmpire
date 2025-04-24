import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext"; // Import useAuth
import ArmonPartialLogo from "../assets/img/ArmonPartialLogo.png";
import { FaBars, FaFacebook, FaInstagram, FaSnapchatGhost, FaUserCircle } from "react-icons/fa";
import { useState, useEffect } from "react";
import { IoClose, IoLink } from "react-icons/io5";
import axios from "axios";
import { User } from "../types/User"

const MemberHeader = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated, logout } = useAuth(); // Get user authentication status
  const [isDrawerOpen, setDrawerOpen] = useState(false);
  const [userData, setUserData] = useState<User | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem("token");
      if (isAuthenticated) {
        try {
          const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/user`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }); // Adjust endpoint as needed
          setUserData(response.data);
          console.log(response.data)
        } catch (error) {
          console.error("Error fetching user data:", error);
        }
      }
    };

    fetchUser();
  }, [isAuthenticated]);

  const toggleDrawer = () => setDrawerOpen((prev) => !prev);

  return (
    <header className="fixed top-0 left-0 w-full z-10 p-4 bg-black border-b border-[#1b1f23]">
      <div className="flex justify-between items-center mx-auto">
        {/* Logo (Left) */}
        <div 
          className="flex items-center text-4xl cursor-pointer"
          onClick={() => navigate("/members")}
        >
          <div className="flex justify-center items-center w-12 bg-white rounded-full">
            <img src={ArmonPartialLogo} alt="Armon Empire Logo" className="h-12 pb-1" />
          </div>
          <h1 className="text-white ml-1 mt-1">Armon Empire</h1>
        </div>

        {/* Empty Middle Section */}
        <div className="flex-1"></div>

        {/* Hamburger Icon (Mobile Menu) */}
        <button
          onClick={toggleDrawer}
          className="text-white text-2xl p-2 cursor-pointer"
          aria-label="Open Drawer"
        >
          <FaBars />
        </button>
      </div>

      {/* Mobile Drawer */}
      {isDrawerOpen && (
        <div className="fixed inset-0 bg-black/75 z-20 flex">
          <aside className="bg-black w-full md:w-[30rem] h-full p-4 overflow-y-auto fixed top-0 md:right-0 md:rounded-l-lg shadow-lg flex flex-col">
            {/* Header Section */}
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
                className="text-white text-4xl p-1 cursor-pointer"
                aria-label="Close Drawer"
              >
                <IoClose />
              </button>
            </div>

            {/* Drawer Content - Takes Up Space */}
            <div className="flex flex-col flex-grow">
              {/* Drawer Navigation Links */}
              <nav className="flex flex-col items-center justify-center mt-12">
                <Link to="/" onClick={toggleDrawer} className="text-3xl text-white font-bold hover:text-orange-300 py-6 block">Home</Link>
                <Link to="/gallery" onClick={toggleDrawer} className="text-3xl text-white font-bold hover:text-orange-300 py-6 block">Gallery</Link>
                <Link to="/location" onClick={toggleDrawer} className="text-3xl text-white font-bold hover:text-orange-300 py-6 block">Location</Link>
                {isAuthenticated && (
                  <div className="text-center">
                    <button 
                      onClick={() => {
                        navigate("/members");
                        toggleDrawer();
                      }} 
                      className="text-3xl text-white font-bold hover:text-orange-300 py-6 block cursor-pointer"
                    >
                      Member Center
                    </button>
                  </div>
                )}
                {isAuthenticated && (
                  <div className="text-center">
                    <button 
                      onClick={() => {
                        navigate("/manage-membership");
                        toggleDrawer();
                      }} 
                      className="text-3xl text-white font-bold hover:text-orange-300 py-6 block cursor-pointer"
                    >
                      Manage Membership
                    </button>
                  </div>
                )}
                {/* Admin Center (Only if isAdmin) */}
                {userData?.isAdmin && (
                  <div className="text-center">
                    <button 
                      onClick={() => {
                        navigate("/admin");
                        toggleDrawer();
                      }} 
                      className="text-3xl text-white font-bold hover:text-orange-300 py-6 block cursor-pointer"
                    >
                      Admin Center
                    </button>
                  </div>
                )}
              </nav>

              {/* Member Login / Member Center Button */}
              {/* <div className="text-center mt-6">
                <button 
                  onClick={() => {
                    navigate(isAuthenticated ? "/members" : "/login");
                    toggleDrawer();
                  }} 
                  className="text-white text-xl font-semibold border border-white px-4 py-2 rounded-md cursor-pointer hover:text-orange-300 hover:border-orange-300"
                >
                  {isAuthenticated ? "Member Center" : "Member Login"}
                </button>
              </div> */}


            </div>

            {/* Social Media Links at Bottom */}
            <div className="mt-auto pt-6 mb-6 flex flex-col">
              {isAuthenticated && (
                <div className="flex justify-center mb-6">
                  <button onClick={logout} className="text-white text-xl font-semibold border border-white px-4 py-2 rounded-md cursor-pointer hover:text-orange-300 hover:border-orange-300">Logout</button>
                </div>
              )}
              <div className="flex items-center justify-center space-x-4">
                <a href="https://www.facebook.com/charlie.armon" target="_blank" rel="noopener noreferrer">
                  <FaFacebook size={30} className="hover:text-orange-300" />
                </a>
                <a href="https://www.instagram.com/charlesarmon" target="_blank" rel="noopener noreferrer">
                  <FaInstagram size={30} className="hover:text-orange-300" />
                </a>
                <a href="https://www.snapchat.com/add/gucci.swag" target="_blank" rel="noopener noreferrer">
                  <FaSnapchatGhost size={30} className="hover:text-orange-300" />
                </a>
                <a href="https://g.co/kgs/VcQfsb" target="_blank" rel="noopener noreferrer">
                  <IoLink size={30} className="hover:text-orange-300" />
                </a>
              </div>
            </div>
          </aside>

          {/* Close the drawer when clicking outside */}
          <div className="flex-1" onClick={toggleDrawer} />
        </div>
      )}
    </header>
  );
};

export default MemberHeader;

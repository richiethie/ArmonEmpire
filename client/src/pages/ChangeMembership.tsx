import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import EmptyHeader from '@/components/EmptyHeader';
import { useIsMobile } from '@/context/MobileContext';
import MemberHeader from '@/components/MemberHeader';
import Footer from '@/components/Footer';
import { IoChevronBackOutline } from 'react-icons/io5';
import { useAuth } from '@/context/AuthContext';
import { motion } from 'framer-motion';

const ChangeMembership = () => {
  const [selectedMembership, setSelectedMembership] = useState("");
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const { user } = useAuth();

  const handleChooseMembership = async (membership: string) => {
    try {
      const token = localStorage.getItem("token");

      if (!user || !user.email) {
        alert("User not authenticated.");
        return;
      }

      const payload = {
        email: user.email,
        newMembership: membership,
      };

      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/stripe/update-subscription`,
        payload,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 200) {
        navigate("/manage-membership");
      } else {
        alert("Something went wrong. Please try again.");
      }
    } catch (error) {
      console.error("Error updating membership:", error);
      alert("Error updating membership. Please try again.");
    }
  };

  return (
    <>
      <div className="flex flex-col bg-black justify-start items-center min-h-screen">
        <MemberHeader />
        
        {/* Back Button (Mobile only) */}
        {isMobile && (
          <div className="flex items-center justify-start w-full pl-4">
            <div
              className="mb-8 mt-28 md:mt-[10rem] flex items-center cursor-pointer hover:text-orange-300"
              onClick={() => navigate("/manage-membership")}
            >
              <IoChevronBackOutline className="mr-1 text-lg" />
              <p>Manage Membership</p>
            </div>
          </div>
        )}

        {/* Hero Section */}
        <div className={` ${!isMobile && ("mt-28")} mb-12 md:mb-16 px-4 w-full max-w-6xl text-center`}>
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-6 text-white">
              Update Your Membership
            </h2>
            <div className="w-24 h-1 bg-gray-800 mx-auto mb-6"></div>
            <p className="text-sm md:text-xl text-gray-400 max-w-2xl mx-auto">
              Select a new membership plan that suits your style and schedule.
            </p>
          </motion.div>
        </div>

        {/* Membership Cards */}
        <motion.div
          className="grid grid-cols-1 sm:grid-cols-3 gap-6 md:gap-10 max-w-6xl p-4 md:p-8 w-full mb-20"
          initial="hidden"
          animate="visible"
          variants={{
            hidden: { opacity: 0 },
            visible: {
              opacity: 1,
              transition: { staggerChildren: 0.2 },
            },
          }}
        >
          {/* Bronze Membership */}
          <motion.div
            className="px-6 py-12 rounded-lg bg-black border border-gray-800 hover:border-white text-center space-y-4 transition-all duration-300 hover:shadow-lg hover:shadow-gray-900/20 relative overflow-hidden group"
            variants={{
              hidden: { opacity: 0, y: 20 },
              visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
            }}
            whileHover={{ scale: 1.02 }}
          >
            <div className="relative">
              <div className="w-16 h-16 rounded-full bg-gray-900 flex items-center justify-center mx-auto mb-6">
                <span className="text-white text-2xl">B</span>
              </div>
              <h3 className="text-3xl md:text-4xl font-semibold text-white">Bronze</h3>
              <p className="text-white text-4xl font-bold mt-2">$50</p>
              <p className="text-gray-500 text-sm mt-1">per month</p>
              <div className="my-8 h-px bg-gray-800"></div>
              <ul className="space-y-6 text-md">
                <li className="text-gray-300">• Haircuts every 4 weeks</li>
                <li className="text-gray-300">• Complimentary drinks</li>
                <li className="text-gray-300">• Savings on specialty services</li>
                <li className="text-gray-300">• No overtime fees</li>
                <li className="text-gray-300">• No last-minute booking fees</li>
              </ul>
              <button
                className="w-full cursor-pointer mt-8 bg-white text-black font-semibold py-3 rounded hover:bg-gray-200 transition-all duration-300"
                onClick={() => handleChooseMembership("Bronze")}
              >
                Choose Bronze
              </button>
              <p className="text-xs text-gray-600 mt-4">
                Monthly recurring charge. No cancellation fees.
              </p>
            </div>
          </motion.div>

          {/* Silver Membership */}
          <motion.div
            className="px-6 py-12 rounded-lg bg-black border border-gray-800 hover:border-white text-center space-y-4 transition-all duration-300 hover:shadow-lg hover:shadow-gray-900/20 relative overflow-hidden group"
            variants={{
              hidden: { opacity: 0, y: 20 },
              visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
            }}
            whileHover={{ scale: 1.02 }}
          >
            <div className="relative">
              <div className="w-16 h-16 rounded-full bg-gray-900 flex items-center justify-center mx-auto mb-6">
                <span className="text-white text-2xl">S</span>
              </div>
              <h3 className="text-3xl md:text-4xl font-semibold text-white">Silver</h3>
              <p className="text-white text-4xl font-bold mt-2">$75</p>
              <p className="text-gray-500 text-sm mt-1">per month</p>
              <div className="my-8 h-px bg-gray-800"></div>
              <ul className="space-y-6 text-md">
                <li className="text-gray-300">• Haircuts every 3 weeks</li>
                <li className="text-gray-300">• Complimentary drinks</li>
                <li className="text-gray-300">• Savings on specialty services</li>
                <li className="text-gray-300">• No overtime fees</li>
                <li className="text-gray-300">• No last-minute booking fees</li>
              </ul>
              <button
                className="w-full cursor-pointer mt-8 bg-white text-black font-semibold py-3 rounded hover:bg-gray-200 transition-all duration-300"
                onClick={() => handleChooseMembership("Silver")}
              >
                Choose Silver
              </button>
              <p className="text-xs text-gray-600 mt-4">
                Monthly recurring charge. No cancellation fees.
              </p>
            </div>
          </motion.div>

          {/* Gold Membership */}
          <motion.div
            className="px-6 py-12 rounded-lg bg-black border border-orange-300 text-center space-y-4 transition-all duration-300 hover:shadow-lg hover:shadow-gray-900/20 relative overflow-hidden group"
            variants={{
              hidden: { opacity: 0, y: 20 },
              visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
            }}
            whileHover={{ scale: 1.02 }}
          >
            <div className="absolute top-0 right-0">
              <div className="bg-white text-black text-xs font-bold px-4 py-1 rounded-bl">
                POPULAR
              </div>
            </div>
            <div className="relative">
              <div className="w-16 h-16 rounded-full bg-gray-900 flex items-center justify-center mx-auto mb-6">
                <span className="text-white text-2xl">G</span>
              </div>
              <h3 className="text-3xl md:text-4xl font-semibold text-white">Gold</h3>
              <p className="text-orange-300 text-4xl font-bold mt-2">$100</p>
              <p className="text-gray-500 text-sm mt-1">per month</p>
              <div className="my-8 h-px bg-gray-800"></div>
              <ul className="space-y-6 text-md">
                <li className="text-gray-300">• Haircuts every 2 weeks</li>
                <li className="text-gray-300">• Complimentary drinks</li>
                <li className="text-gray-300">• Savings on specialty services</li>
                <li className="text-gray-300">• No overtime fees</li>
                <li className="text-gray-300">• No last-minute booking fees</li>
              </ul>
              <button
                className="w-full cursor-pointer mt-8 bg-orange-300 text-black font-semibold py-3 rounded hover:bg-orange-400 transition-all duration-300"
                onClick={() => handleChooseMembership("Gold")}
              >
                Choose Gold
              </button>
              <p className="text-xs text-gray-600 mt-4">
                Monthly recurring charge. No cancellation fees.
              </p>
            </div>
          </motion.div>
        </motion.div>
      </div>
      <Footer />
    </>
  );
};

export default ChangeMembership;

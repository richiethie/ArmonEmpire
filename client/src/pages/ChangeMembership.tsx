import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import EmptyHeader from '@/components/EmptyHeader';
import { useIsMobile } from '@/context/MobileContext';
import MemberHeader from '@/components/MemberHeader';
import Footer from '@/components/Footer';
import { IoChevronBackOutline } from 'react-icons/io5';
// Import your authentication context to get the user information
import { useAuth } from '@/context/AuthContext';

const ChangeMembership = () => {
  const [selectedMembership, setSelectedMembership] = useState("");
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const { user } = useAuth(); // Get the current user (make sure user.email is available)

  const handleChooseMembership = async (membership: string) => {
    try {
      // Get the token from localStorage (if authentication is required)
      const token = localStorage.getItem("token");

      // Make sure that the user is available
      if (!user || !user.email) {
        alert("User not authenticated.");
        return;
      }

      // Prepare the request payload. Notice we use "newMembership" instead of "membership"
      const payload = {
        email: user.email,
        newMembership: membership,
      };

      // Send a request to the backend to update the subscription and membership
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
        {isMobile && (
          <div className='flex items-center justify-start w-full pl-4'>
            <div
              className="mb-8 mt-28 md:mt-[10rem] flex items-center cursor-pointer hover:text-orange-300"
              onClick={() => navigate("/manage-membership")}
            >
              <IoChevronBackOutline className="mr-1 text-lg" />
              <p>Manage Membership</p>
            </div>
          </div>
        )}
        <h1 className="text-4xl md:text-5xl md:mb-[4rem]">Choose your membership</h1>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-10 max-w-8xl p-8">
          {/* Bronze Membership */}
          <div className="p-6 rounded-lg shadow-white border border-white text-center space-y-4">
            <h3 className="text-4xl font-semibold">Bronze Membership</h3>
            <p className="text-xl font-semibold text-orange-300">$45</p>
            <ul className="space-y-6 text-md">
              <li className="text-gray-300">• Haircuts every 4 weeks</li>
              <li className="text-gray-300">• Complimentary drinks provided</li>
              <li className="text-gray-300">• Savings on specialty services</li>
              <li className="text-gray-300">• No overtime fees on late bookings</li>
              <li className="text-gray-300">• No fees for last-minute bookings</li>
            </ul>
            <button
              className="w-full cursor-pointer bg-orange-300 text-black font-semibold py-2 rounded-md hover:bg-orange-500 transition"
              onClick={() => handleChooseMembership("Bronze")}
            >
              Choose Bronze
            </button>
            <p className="text-xs text-gray-500">
              Membership services are billed as a monthly recurring charge. No cancellation fees.
            </p>
          </div>

          {/* Silver Membership */}
          <div className="p-6 rounded-lg shadow-white border border-white text-center space-y-4">
            <h3 className="text-4xl font-semibold">Silver Membership</h3>
            <p className="text-xl font-semibold text-orange-300">$60</p>
            <ul className="space-y-6 text-md">
              <li className="text-gray-300">• Haircuts every 3 weeks</li>
              <li className="text-gray-300">• Complimentary drinks provided</li>
              <li className="text-gray-300">• Savings on specialty services</li>
              <li className="text-gray-300">• No overtime fees on late bookings</li>
              <li className="text-gray-300">• No fees for last-minute bookings</li>
            </ul>
            <button
              className="w-full cursor-pointer bg-orange-300 text-black font-semibold py-2 rounded-md hover:bg-orange-500 transition"
              onClick={() => handleChooseMembership("Silver")}
            >
              Choose Silver
            </button>
            <p className="text-xs text-gray-500">
              Membership services are billed as a monthly recurring charge. No cancellation fees.
            </p>
          </div>

          {/* Gold Membership */}
          <div className="p-6 rounded-lg shadow-white border border-white text-center space-y-4">
            <h3 className="text-4xl font-semibold">Gold Membership</h3>
            <p className="text-xl font-semibold text-orange-300">$90</p>
            <ul className="space-y-6 text-md">
              <li className="text-gray-300">• Haircuts every 2 weeks</li>
              <li className="text-gray-300">• Complimentary drinks provided</li>
              <li className="text-gray-300">• Savings on specialty services</li>
              <li className="text-gray-300">• No overtime fees on late bookings</li>
              <li className="text-gray-300">• No fees for last-minute bookings</li>
            </ul>
            <button
              className="w-full cursor-pointer bg-orange-300 text-black font-semibold py-2 rounded-md hover:bg-orange-500 transition"
              onClick={() => handleChooseMembership("Gold")}
            >
              Choose Gold
            </button>
            <p className="text-xs text-gray-500">
              Membership services are billed as a monthly recurring charge. No cancellation fees.
            </p>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default ChangeMembership;

import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import EmptyHeader from '@/components/EmptyHeader';

const SelectMembership = () => {
  const [selectedMembership, setSelectedMembership] = useState("");
  const navigate = useNavigate(); // Initialize navigate function

  const handleChooseMembership = async (membership: string) => {
    try {
      // Get the token from localStorage or state
      const token = localStorage.getItem("token");
  
      // Send a request to the backend to update the membership for the user
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/user/update-membership`,
        { membership },
        {
          headers: {
            Authorization: `Bearer ${token}`, // Include the token in the Authorization header
          },
        }
      );
  
      if (response.status === 200) {
        navigate("/customize-membership");
      } else {
        alert("Something went wrong. Please try again.");
      }
    } catch (error) {
      console.error("Error updating membership:", error);
      alert("Error updating membership. Please try again.");
    }
  };

  return (
    <div className="flex flex-col bg-black justify-start items-center min-h-screen">
      <EmptyHeader />  
      <h1 className="text-8xl my-[10rem]">Choose your membership</h1>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 max-w-8xl p-8">
        {/* Bronze Membership */}
        <div className="p-6 rounded-lg shadow-white border border-white text-center space-y-4">
          <h3 className="text-4xl font-semibold">Bronze Membership</h3>
          <p className="text-lg">Haircuts every 4 weeks</p>
          <p className="text-lg font-semibold text-orange-300">$45</p>
          <ul className="space-y-6 text-md">
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
            Membership services are billed as a monthly recurring charge. No
            cancellation fees.
          </p>
        </div>

        {/* Gold Membership (larger) */}
        <div className="p-8 rounded-lg shadow-white border border-white text-center space-y-4 transform scale-110">
          <h3 className="text-5xl font-semibold">Gold Membership</h3>
          <p className="text-xl">Haircuts every 2 weeks</p>
          <p className="text-xl font-semibold text-orange-300">$90</p>
          <ul className="space-y-6 text-lg">
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
            Membership services are billed as a monthly recurring charge. No
            cancellation fees.
          </p>
        </div>

        {/* Silver Membership */}
        <div className="p-6 rounded-lg shadow-white border border-white text-center space-y-4">
          <h3 className="text-4xl font-semibold">Silver Membership</h3>
          <p className="text-lg">Haircuts every 3 weeks</p>
          <p className="text-lg font-semibold text-orange-300">$62.50</p>
          <ul className="space-y-6 text-md">
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
            Membership services are billed as a monthly recurring charge. No
            cancellation fees.
          </p>
        </div>
      </div>
    </div>
  );
};

export default SelectMembership;

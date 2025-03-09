import { useNavigate } from 'react-router-dom'; // Import useNavigate
import { useIsMobile } from '@/context/MobileContext';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

const Membership = () => {
  const navigate = useNavigate(); // Initialize navigate function
  const isMobile = useIsMobile();

  const handleChooseMembership = () => {
    navigate("/signup");
  };

  return (
    <>
    
        <Header />  
        <div className="flex flex-col bg-black justify-start items-center min-h-screen">
            <div className='mt-28 md:my-[10rem] px-4'>
                <h1 className="text-4xl md:text-8xl text-center">Select your membership</h1>
                <h2 className='text-center text-sm md:text-2xl'>Choose the membership that fits your haircut routine.</h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-10 max-w-8xl p-8">
                {/* Bronze Membership */}
                <div className="px-6 py-12 rounded-lg shadow-white border border-white text-center space-y-4">
                <h3 className="text-3xl md:text-4xl font-semibold">Bronze Membership</h3>
                <p className="text-2xl font-bold text-orange-300">$45</p>
                <ul className="space-y-6 my-8 text-md md:text-lg">
                    <li className="text-gray-300">• Haircuts every 4 weeks</li>
                    <li className="text-gray-300">• Complimentary drinks provided</li>
                    <li className="text-gray-300">• Savings on specialty services</li>
                    <li className="text-gray-300">• No overtime fees on late bookings</li>
                    <li className="text-gray-300">• No fees for last-minute bookings</li>
                </ul>
                <button
                    className="w-full cursor-pointer mt-8 bg-orange-300 text-black font-semibold py-2 rounded-md hover:bg-orange-500 transition"
                    onClick={handleChooseMembership}
                >
                    Choose Bronze
                </button>
                <p className="text-xs text-gray-500">
                    Membership services are billed as a monthly recurring charge. No
                    cancellation fees.
                </p>
                </div>

                {/* Silver Membership */}
                <div className="px-6 py-12 rounded-lg shadow-white border border-white text-center space-y-4">
                    <h3 className="text-3xl md:text-4xl font-semibold">Silver Membership</h3>
                    <p className="text-2xl font-bold text-orange-300">$60</p>
                    <ul className="space-y-6 my-8 text-md md:text-lg">
                        <li className="text-gray-300">• Haircuts every 3 weeks</li>
                        <li className="text-gray-300">• Complimentary drinks provided</li>
                        <li className="text-gray-300">• Savings on specialty services</li>
                        <li className="text-gray-300">• No overtime fees on late bookings</li>
                        <li className="text-gray-300">• No fees for last-minute bookings</li>
                    </ul>
                    <button
                        className="w-full cursor-pointer mt-8 bg-orange-300 text-black font-semibold py-2 rounded-md hover:bg-orange-500 transition"
                        onClick={handleChooseMembership}
                    >
                        Choose Silver
                    </button>
                    <p className="text-xs text-gray-500">
                        Membership services are billed as a monthly recurring charge. No
                        cancellation fees.
                    </p>
                </div>

                {/* Gold Membership (larger) */}
                <div className="px-6 py-12 rounded-lg shadow-white border border-white text-center space-y-4">
                    <h3 className="text-3xl md:text-4xl font-semibold">Gold Membership</h3>
                    <p className="text-2xl font-bold text-orange-300">$90</p>
                    <ul className="space-y-6 my-8 text-md md:text-lg">
                        <li className="text-gray-300">• Haircuts every 2 weeks</li>
                        <li className="text-gray-300">• Complimentary drinks provided</li>
                        <li className="text-gray-300">• Savings on specialty services</li>
                        <li className="text-gray-300">• No overtime fees on late bookings</li>
                        <li className="text-gray-300">• No fees for last-minute bookings</li>
                    </ul>
                    <button
                        className="w-full cursor-pointer mt-8 bg-orange-300 text-black font-semibold py-2 rounded-md hover:bg-orange-500 transition"
                        onClick={handleChooseMembership}
                    >
                        Choose Gold
                    </button>
                    <p className="text-xs text-gray-500">
                        Membership services are billed as a monthly recurring charge. No
                        cancellation fees.
                    </p>
                </div>

            </div>
        </div>
        <Footer />
    </>
  );
};

export default Membership;

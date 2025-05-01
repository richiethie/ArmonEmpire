import { useNavigate } from 'react-router-dom';
import { useIsMobile } from '@/context/MobileContext';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { motion } from 'framer-motion';

const Membership = () => {
  const navigate = useNavigate();
  const isMobile = useIsMobile();

  const handleChooseMembership = () => {
    navigate("/signup");
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5
      }
    }
  };

  return (
    <>
      <Header />  
      <div className="flex flex-col bg-black justify-start items-center min-h-screen">
        {/* Hero Section */}
        <div className="mt-28 md:mt-32 mb-12 md:mb-16 px-4 w-full max-w-6xl">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            <h2 className="text-4xl md:text-5xl text-center font-bold mb-6 text-white">
              Select Your Membership
            </h2>
            <div className="w-24 h-1 bg-gray-800 mx-auto mb-6"></div>
            <h2 className="text-center text-sm md:text-xl text-gray-400 max-w-2xl mx-auto">
              Choose the membership that fits your style and schedule. Enjoy premium service with any plan.
            </h2>
          </motion.div>
        </div>
        
        {/* Membership Cards */}
        <motion.div 
          className="grid grid-cols-1 sm:grid-cols-3 gap-6 md:gap-10 max-w-6xl p-4 md:p-8 w-full mb-20"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {/* Bronze Membership */}
          <motion.div 
            variants={itemVariants}
            className="px-6 py-12 rounded-lg bg-black border border-gray-800 hover:border-white text-center space-y-4 transition-all duration-300 hover:shadow-lg hover:shadow-gray-900/20 relative overflow-hidden group"
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
              <ul className="space-y-6 my-8 text-md">
                <li className="text-gray-300 flex items-center justify-center">
                  <span className="text-white mr-2">•</span> Haircuts every 4 weeks
                </li>
                <li className="text-gray-300 flex items-center justify-center">
                  <span className="text-white mr-2">•</span> Complimentary drinks
                </li>
                <li className="text-gray-300 flex items-center justify-center">
                  <span className="text-white mr-2">•</span> Savings on specialty services
                </li>
                <li className="text-gray-300 flex items-center justify-center">
                  <span className="text-white mr-2">•</span> No overtime fees
                </li>
                <li className="text-gray-300 flex items-center justify-center">
                  <span className="text-white mr-2">•</span> No last-minute booking fees
                </li>
              </ul>
              <button
                className="w-full cursor-pointer mt-8 bg-white text-black font-semibold py-3 rounded hover:bg-gray-200 transition-all duration-300"
                onClick={handleChooseMembership}
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
            variants={itemVariants}
            className="px-6 py-12 rounded-lg bg-black border border-gray-800 hover:border-white text-center space-y-4 transition-all duration-300 hover:shadow-lg hover:shadow-gray-900/20 relative overflow-hidden group"
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
              <ul className="space-y-6 my-8 text-md">
                <li className="text-gray-300 flex items-center justify-center">
                  <span className="text-white mr-2">•</span> Haircuts every 3 weeks
                </li>
                <li className="text-gray-300 flex items-center justify-center">
                  <span className="text-white mr-2">•</span> Complimentary drinks
                </li>
                <li className="text-gray-300 flex items-center justify-center">
                  <span className="text-white mr-2">•</span> Savings on specialty services
                </li>
                <li className="text-gray-300 flex items-center justify-center">
                  <span className="text-white mr-2">•</span> No overtime fees
                </li>
                <li className="text-gray-300 flex items-center justify-center">
                  <span className="text-white mr-2">•</span> No last-minute booking fees
                </li>
              </ul>
              <button
                className="w-full cursor-pointer mt-8 bg-white text-black font-semibold py-3 rounded hover:bg-gray-200 transition-all duration-300"
                onClick={handleChooseMembership}
              >
                Choose Silver
              </button>
              <p className="text-xs text-gray-600 mt-4">
                Monthly recurring charge. No cancellation fees.
              </p>
            </div>
          </motion.div>

          {/* Gold Membership (featured) */}
          <motion.div 
            variants={itemVariants}
            className="px-6 py-12 rounded-lg bg-black border border-orange-300 text-center space-y-4 transition-all duration-300 hover:shadow-lg hover:shadow-gray-900/20 relative overflow-hidden group"
            whileHover={{ scale: 1.02 }}
          >
            {/* Popular badge */}
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
              <ul className="space-y-6 my-8 text-md">
                <li className="text-gray-300 flex items-center justify-center">
                  <span className="text-white mr-2">•</span> Haircuts every 2 weeks
                </li>
                <li className="text-gray-300 flex items-center justify-center">
                  <span className="text-white mr-2">•</span> Complimentary drinks
                </li>
                <li className="text-gray-300 flex items-center justify-center">
                  <span className="text-white mr-2">•</span> Savings on specialty services
                </li>
                <li className="text-gray-300 flex items-center justify-center">
                  <span className="text-white mr-2">•</span> No overtime fees
                </li>
                <li className="text-gray-300 flex items-center justify-center">
                  <span className="text-white mr-2">•</span> No last-minute booking fees
                </li>
              </ul>
              <button
                className="w-full cursor-pointer mt-8 bg-orange-300 text-black font-semibold py-3 rounded hover:bg-orange-400 transition-all duration-300"
                onClick={handleChooseMembership}
              >
                Choose Gold
              </button>
              <p className="text-xs text-gray-600 mt-4">
                Monthly recurring charge. No cancellation fees.
              </p>
            </div>
          </motion.div>
        </motion.div>

        {/* FAQ Section */}
        <div className="w-full max-w-4xl px-4 mb-20">
          <h3 className="text-2xl md:text-3xl font-semibold text-center mb-8 text-white">Frequently Asked Questions</h3>
          <div className="space-y-4">
            <div className="p-4 border border-gray-800 rounded-lg hover:border-gray-700 transition-all duration-300">
              <h4 className="text-xl text-white mb-2">How do I change my membership plan?</h4>
              <p className="text-gray-400">You can easily upgrade or downgrade your membership at any time through your account dashboard or by speaking with our staff.</p>
            </div>
            <div className="p-4 border border-gray-800 rounded-lg hover:border-gray-700 transition-all duration-300">
              <h4 className="text-xl text-white mb-2">Can I cancel anytime?</h4>
              <p className="text-gray-400">Yes, you can cancel your membership at any time without incurring cancellation fees. The membership will remain active until the end of your current billing cycle.</p>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Membership;
import { FaShower, FaRegSmile, FaSpa } from "react-icons/fa"; // Example service icons
import { GiRazor } from "react-icons/gi";
import { FaScissors } from "react-icons/fa6";
import Footer from "../components/Footer"; // Assuming Footer is already built
import Header from "../components/Header"; // Assuming Header is already built

const Services = () => {
  return (
    <div className="bg-black text-white">
      <Header />
      <div className="py-20 bg-cover bg-center" style={{ backgroundImage: `url('path/to/your/backsplash/image.jpg')` }}>
        <div className="max-w-7xl mx-auto px-8 pt-10 text-center">
          <h1 className="text-5xl mb-4">Our Premier Grooming Services</h1>
          <p className="text-lg mb-4">We provide a wide range of premium grooming services designed to make you look and feel your best.</p>
          <button className="w-[40%] text-white font-semibold border border-white px-4 py-2 rounded-md cursor-pointer hover:text-orange-300 hover:border-orange-300">
            Book Now
          </button>
        </div>
      </div>

      {/* Services List */}
      <div className="max-w-7xl mx-auto px-8 py-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        
        {/* Signature Haircut */}
        <div className="service-card bg-charcoal p-6 rounded-lg shadow-lg shadow-white">
          <FaScissors size={40} className="text-orange-300 mb-4 mx-auto" />
          <h3 className="text-xl font-semibold mb-2">Signature Haircut</h3>
          <p className="mb-4">Precision haircut tailored to your style with expert detail and focus on your preferences.</p>
          <p className="text-orange-300 font-bold">$40</p>
        </div>

        {/* Beard Grooming */}
        <div className="service-card bg-charcoal p-6 rounded-lg shadow-lg shadow-white">
          <FaShower size={40} className="text-orange-300 mb-4 mx-auto" />
          <h3 className="text-xl font-semibold mb-2">Beard Grooming</h3>
          <p className="mb-4">Perfect your beard with precise grooming, shaping, and trimming for a clean look.</p>
          <p className="text-orange-300 font-bold">$25</p>
        </div>

        {/* Hot Towel Shave */}
        <div className="service-card bg-charcoal p-6 rounded-lg shadow-lg shadow-white">
          <FaRegSmile size={40} className="text-orange-300 mb-4 mx-auto" />
          <h3 className="text-xl font-semibold mb-2">Hot Towel Shave</h3>
          <p className="mb-4">Relaxing hot towel shave with smooth, razor-sharp precision for a refined finish.</p>
          <p className="text-orange-300 font-bold">$30</p>
        </div>

        {/* Eyebrow Grooming */}
        <div className="service-card bg-charcoal p-6 rounded-lg shadow-lg shadow-white">
          <GiRazor size={40} className="text-orange-300 mb-4 mx-auto" />
          <h3 className="text-xl font-semibold mb-2">Eyebrow Grooming</h3>
          <p className="mb-4">Keep your eyebrows sharp and clean with expert grooming to maintain a fresh look.</p>
          <p className="text-orange-300 font-bold">$15</p>
        </div>

        {/* Shampoo & Conditioner Treatment */}
        <div className="service-card bg-charcoal p-6 rounded-lg shadow-lg shadow-white">
          <FaSpa size={40} className="text-orange-300 mb-4 mx-auto" />
          <h3 className="text-xl font-semibold mb-2">Shampoo & Conditioner Treatment</h3>
          <p className="mb-4">Rejuvenate your hair with a premium shampoo and conditioner treatment to keep it healthy.</p>
          <p className="text-orange-300 font-bold">$20</p>
        </div>

        {/* Scalp Treatment */}
        <div className="service-card bg-charcoal p-6 rounded-lg shadow-lg shadow-white">
          <FaSpa size={40} className="text-orange-300 mb-4 mx-auto" />
          <h3 className="text-xl font-semibold mb-2">Scalp Treatment</h3>
          <p className="mb-4">A soothing treatment designed to nourish your scalp and promote healthy hair growth.</p>
          <p className="text-orange-300 font-bold">$35</p>
        </div>

        {/* Facial Treatment */}
        <div className="service-card bg-charcoal p-6 rounded-lg shadow-lg shadow-white">
          <FaRegSmile size={40} className="text-orange-300 mb-4 mx-auto" />
          <h3 className="text-xl font-semibold mb-2">Facial Treatment</h3>
          <p className="mb-4">Deep cleansing facial treatment that refreshes and revitalizes your skin for a glowing look.</p>
          <p className="text-orange-300 font-bold">$45</p>
        </div>

        {/* Express Facial */}
        <div className="service-card bg-charcoal p-6 rounded-lg shadow-lg shadow-white">
          <FaSpa size={40} className="text-orange-300 mb-4 mx-auto" />
          <h3 className="text-xl font-semibold mb-2">Express Facial</h3>
          <p className="mb-4">Quick, rejuvenating facial for when you're on the go. Get a fresh glow in less than 30 minutes!</p>
          <p className="text-orange-300 font-bold">$30</p>
        </div>

        {/* Luxe Facial */}
        <div className="service-card bg-charcoal p-6 rounded-lg shadow-lg shadow-white">
          <FaSpa size={40} className="text-orange-300 mb-4 mx-auto" />
          <h3 className="text-xl font-semibold mb-2">Luxe Facial</h3>
          <p className="mb-4">Luxurious facial treatment designed to give you a deeply nourishing and relaxing experience.</p>
          <p className="text-orange-300 font-bold">$55</p>
        </div>

        {/* Nail Treatment */}
        <div className="service-card bg-charcoal p-6 rounded-lg shadow-lg shadow-white">
          <FaSpa size={40} className="text-orange-300 mb-4 mx-auto" />
          <h3 className="text-xl font-semibold mb-2">Nail Treatment</h3>
          <p className="mb-4">A relaxing nail treatment to ensure your hands and feet look and feel their best.</p>
          <p className="text-orange-300 font-bold">$25</p>
        </div>
      </div>

      {/* Call to Action */}
      <div className="bg-charcoal py-16 text-center">
        <h2 className="text-3xl font-semibold text-white mb-4">Book Your Appointment Today</h2>
        <p className="text-lg text-white mb-8">Don't wait to look your best! Schedule your grooming session now and experience the finest in men's grooming.</p>
        <button className="bg-orange-300 text-black px-8 py-4 rounded-md font-semibold hover:bg-orange-500">
          Book Now
        </button>
      </div>

      <Footer />
    </div>
  );
};

export default Services;

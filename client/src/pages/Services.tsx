import { FaShower, FaRegSmile, FaSpa, FaClipboardList, FaAngleRight } from "react-icons/fa";
import { GiRazor } from "react-icons/gi";
import { PiScissorsFill, PiSparkle } from "react-icons/pi";
import { FaScissors } from "react-icons/fa6";
import { TbMassage } from "react-icons/tb";
import { RiScissorsCutFill } from "react-icons/ri";
import Footer from "../components/Footer";
import Header from "../components/Header";
import { Link } from "react-router-dom";
import { useState } from "react";

const Services = () => {
  const [activeCategory, setActiveCategory] = useState("all");

  const serviceCategories = [
    { id: "all", label: "All Services" },
    { id: "haircuts", label: "Haircuts" },
    { id: "facial", label: "Facial Hair" },
    { id: "specialty", label: "Specialty" },
  ];

  const services = [
    {
      id: 1,
      title: "Full Haircut & Facial Hair",
      price: 50,
      description: "A tailored haircut and facial hair grooming session for a sharp, cohesive look.",
      icon: <FaScissors size={28} className="text-orange-300" />,
      categories: ["haircuts", "facial"],
    },
    {
      id: 2,
      title: "Scalp Treatment",
      price: 45,
      description: "A nourishing treatment to soothe and revitalize your scalp, promoting healthy hair.",
      icon: <FaShower size={28} className="text-orange-300" />,
      categories: ["specialty"],
    },
    {
      id: 3,
      title: "Kid's Haircut (12 & Under)",
      price: 30,
      description: "A fun, precise haircut designed for kids 12 and under, ensuring a comfortable experience.",
      icon: <PiScissorsFill size={28} className="text-orange-300" />,
      categories: ["haircuts"],
    },
    {
      id: 4,
      title: "Bald Head | Beard Trim & Lining",
      price: 35,
      description: "A smooth bald head shave with precise beard trimming and lining for a polished appearance.",
      icon: <GiRazor size={28} className="text-orange-300" />,
      categories: ["haircuts", "facial"],
    },
    {
      id: 5,
      title: "Hair Lining & Taper Back",
      price: 30,
      description: "Crisp hair lining and tapered back for a clean, defined style that enhances your look.",
      icon: <RiScissorsCutFill size={28} className="text-orange-300" />,
      categories: ["haircuts"],
    },
    {
      id: 6,
      title: "Full Haircut, Beard & Enhancements",
      price: 55,
      description: "A complete haircut, beard grooming, and enhancements for a bold, refined finish.",
      icon: <PiSparkle size={28} className="text-orange-300" />,
      categories: ["haircuts", "facial", "specialty"],
    },
    {
      id: 7,
      title: "Haircut & Sponge",
      price: 50,
      description: "A stylish haircut paired with sponge styling for textured, defined curls.",
      icon: <TbMassage size={28} className="text-orange-300" />,
      categories: ["haircuts", "specialty"],
    },
    {
      id: 8,
      title: "Full Haircut | No Facial Hair",
      price: 45,
      description: "A precision haircut tailored to your style, without facial hair grooming.",
      icon: <FaScissors size={28} className="text-orange-300" />,
      categories: ["haircuts"],
    },
    {
      id: 9,
      title: "Haircut | Removal of Longer Hair",
      price: 55,
      description: "A detailed haircut with expert removal of longer hair for a sleek, polished look.",
      icon: <RiScissorsCutFill size={28} className="text-orange-300" />,
      categories: ["haircuts"],
    },
  ];

  const filteredServices = activeCategory === "all" 
    ? services 
    : services.filter(service => service.categories.includes(activeCategory));

  return (
    <div className="bg-white text-black min-h-screen">
      <Header />
      
      {/* Hero Section with parallax effect */}
      <div className="relative py-32 bg-fixed bg-cover bg-center overflow-hidden" 
           style={{ backgroundImage: `url('path/to/your/backsplash/image.jpg')` }}>
        <div className="absolute inset-0 bg-black bg-opacity-60"></div>
        <div className="max-w-7xl mx-auto px-8 relative text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 tracking-tight text-white">
            Premier Grooming Services
          </h2>
          <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto font-light text-white">
            We provide a wide range of premium grooming services designed to make you look and feel your best.
          </p>
          <Link to="/schedule">
            <button className="bg-white hover:bg-gray-100 text-black border-2 border-white cursor-pointer font-bold py-3 px-12 rounded-md transition duration-300 ease-in-out transform hover:scale-105">
              Book Your Appointment
            </button>
          </Link>
        </div>
      </div>

      {/* Category Filter */}
      <div className="max-w-7xl mx-auto px-8 py-12">
        <div className="flex flex-wrap justify-center gap-2 mb-12">
          <div className="flex flex-wrap justify-center gap-2 p-1 rounded-lg bg-gray-100 shadow-md">
            {serviceCategories.map((category) => (
              <button
                key={category.id}
                className={`px-6 py-3 rounded-md font-medium cursor-pointer transition duration-200 ${
                  activeCategory === category.id
                    ? "bg-black text-white"
                    : "text-black hover:bg-gray-200"
                }`}
                onClick={() => setActiveCategory(category.id)}
              >
                {category.label}
              </button>
            ))}
          </div>
        </div>

        {/* Services List */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredServices.map((service) => (
            <div 
              key={service.id} 
              className="bg-gray-200 rounded-xl overflow-hidden border border-gray-200 shadow-lg hover:shadow-xl transition-all duration-300 hover:translate-y-[-5px]"
            >
              <div className="p-8">
                <div className="flex items-center justify-between mb-4">
                  <div className="bg-black text-orange-300 p-3 rounded-lg">
                    {service.icon}
                  </div>
                  <div className="text-right">
                    <span className="text-black text-2xl font-bold">${service.price}</span>
                  </div>
                </div>
                <h3 className="text-xl text-black font-bold mb-3">{service.title}</h3>
                <p className="text-gray-600 mb-6">{service.description}</p>
                <Link to="/schedule" className="inline-flex items-center text-black hover:text-orange-500 font-medium">
                  Book Now <FaAngleRight className="ml-2" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Premium Experience Section - Alternating Pattern */}
      <div className="bg-black py-24 mt-16 text-white">
        <div className="max-w-7xl mx-auto px-8">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl font-bold mb-6">
                Premium Grooming Experience
              </h2>
              <p className="text-xl mb-6 text-gray-300">
                At Armon Empire, we're committed to providing exceptional service and results that exceed your expectations.
              </p>
              <ul className="space-y-4">
                {[
                  "Expert barbers with years of experience",
                  "Premium products for the best results",
                  "Comfortable, relaxing environment",
                  "Attention to detail on every service"
                ].map((item, index) => (
                  <li key={index} className="flex items-center">
                    <div className="bg-orange-300 p-1 rounded-full mr-3">
                      <FaClipboardList className="text-black" size={14} />
                    </div>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="bg-white p-8 rounded-xl text-black">
              <h3 className="text-2xl font-bold mb-6 text-center">Membership Benefits</h3>
              <div className="space-y-4">
                {[
                  "Priority booking for members",
                  "Discounted services and packages",
                  "Exclusive access to premium products",
                  "Complimentary touch-ups between appointments"
                ].map((benefit, index) => (
                  <div key={index} className="flex items-center p-3 bg-gray-100 rounded-lg">
                    <div className="bg-black p-2 rounded-full mr-4">
                      <FaRegSmile className="text-white" size={16} />
                    </div>
                    <span>{benefit}</span>
                  </div>
                ))}
              </div>
              <div className="mt-8 text-center">
                <Link to="/memberships">
                  <button className="bg-black text-white cursor-pointer font-bold py-3 px-6 rounded-lg hover:bg-gray-800 transition duration-300">
                    Join Membership
                  </button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Testimonials Section */}
      <div className="py-16 bg-gray-100">
        <div className="max-w-7xl mx-auto px-8">
          <h2 className="text-3xl font-bold text-center mb-12">What Our Clients Say</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                quote: "The attention to detail is unmatched. My haircut was exactly what I wanted and lasted longer than expected.",
                author: "Michael R."
              },
              {
                quote: "The barbers truly understand men's hair. Great atmosphere, excellent service, and reasonable prices.",
                author: "James T."
              },
              {
                quote: "The beard trim and lineup was perfect. It's refreshing to find barbers who really know what they're doing.",
                author: "William K."
              }
            ].map((testimonial, index) => (
              <div key={index} className="bg-white p-8 rounded-xl shadow-md">
                <p className="text-lg italic mb-4">"{testimonial.quote}"</p>
                <p className="font-bold text-right">— {testimonial.author}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Call to Action */}
      <div className="bg-black text-white py-20 text-center">
        <div className="max-w-4xl mx-auto px-8">
          <h2 className="text-4xl font-bold mb-6">Ready to Look Your Best?</h2>
          <p className="text-xl mb-8">
            Don't wait to elevate your style. Schedule your grooming session now and experience the finest in men's grooming.
          </p>
          <Link to="/schedule">
            <button className="bg-white text-black cursor-pointer hover:bg-gray-100 font-bold py-4 px-12 rounded-lg transition duration-300 shadow-lg">
              Book Your Appointment Now
            </button>
          </Link>
          <Link to="/services" className="block mt-4">
            <span className="text-sm text-gray-300 hover:text-orange-300 cursor-pointer transition-colors">View all services</span>
          </Link>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Services;
import { Link } from "react-router-dom";
import { useEffect } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";

const Schedule = () => {

  const services = [
    { name: 'Full Haircut & Facial Hair', duration: '45 minutes', price: '$50.00' },
    { name: 'Barber Apprentice - Full Adult Haircut / No Facial Hair', duration: '1 hour', price: '$30.00' },
    { name: 'Barber Apprentice - Kids Haircut (12 & Under)', duration: '1 hour', price: '$30.00' },
    { name: 'Barber Apprentice - Full Adult Haircut & Facial Hair', duration: '1 hour', price: '$35.00' },
    { name: 'Scalp Treatment', duration: '35 minutes', price: '$45.00' },
    { name: 'Permanent Wave (Perm)', duration: '3 hours', price: '$100.00' },
    { name: 'Color Application', duration: '2 hours', price: '$65.00', description: 'Color Application Services including basic retouch as well as hair lightning styles. Pricing starting at $65 and ranging to $150 depending on desired look and application practices.' },
    { name: 'SMYLEXO Teeth Whitener', duration: '45 minutes', price: '$80.00', description: 'A premium service designed to brighten your smile and boost your confidence! Experience dentist-quality whitening without the dental chair. Our SmyleXo system targets tough stains for noticeable results.' },
    { name: 'Spa Facial', duration: '1 hour 30 minutes', price: '$70.00', description: 'A relaxing, noninvasive skin treatment that includes cleansing, moisturizing, exfoliating and other elements that are customized to your specific skin type and needs.' },
    { name: 'Kid\'s Haircut 12 & Under', duration: '30 minutes', price: '$30.00' },
    { name: 'Bald Head w/ Beard Trim/Lining', duration: '30 minutes', price: '$35.00' },
    { name: 'Hair Lining & Taper back and side low', duration: '30 minutes', price: '$30.00' },
    { name: 'Hair cut, Beard & Enhancements', duration: '45 minutes', price: '$55.00' },
    { name: 'Hair Cut & Sponge', duration: '45 minutes', price: '$50.00' },
    { name: 'Full Haircut & No Facial Hair', duration: '40 minutes', price: '$45.00' },
    { name: 'Haircut and Charcoal Nose Peel', duration: '45 minutes', price: '$55.00' },
    { name: 'Haircut Mohawk-Phily-Hightop-South of France.Et', duration: '30 minutes', price: '$45.00' },
    { name: 'Haircut with Removal of Longer Hair', duration: '45 minutes', price: '$55.00' },
    { name: 'Hair Lining, taper back, sides & beard', duration: '30 minutes', price: '$35.00' },
    { name: 'Armon Empire Deluxe Package (Face Mask, Style, Haircut, Shave, Eyebrows, Beard Trim, Shampoo and Condition)', duration: '1 hour 15 minutes', price: '$90.00' },
    { name: 'Full Haircut, Shampoo & Condition', duration: '1 hour', price: '$65.00' },
    { name: 'Full Haircut and Thermal Styling', duration: '50 minutes', price: '$55.00' },
    { name: 'Full Haircut, Facial Hair, Shampoo and Conditioner', duration: '1 hour', price: '$70.00' },
  ];

  useEffect(() => {
    const script = document.createElement('script');
    script.src = "https://assets.calendly.com/assets/external/widget.js";
    script.async = true;
    document.body.appendChild(script);
  }, []);

  return (
    <div className="bg-black min-h-screen">
      {/* Header */}
      <Header />

      {/* Page Content */}
      <div className="pt-[100px] px-8 py-12 text-center text-crispWhite">
        <h1 className="text-4xl font-bold text-white mb-6">Schedule Your Service</h1>
        <p className="text-xl text-white mb-12">
          We're excited to serve you! Choose your desired service and schedule
          your appointment below.
        </p>

        {/* Calendly Inline Embed */}
        <div className="my-12">
          <h2 className="text-2xl text-white mb-6">Book an Appointment</h2>
          <div
            className="calendly-inline-widget"
            data-url="https://calendly.com/richiethie"
            style={{ minWidth: "320px", height: "700px" }}
          ></div>
        </div>

        {/* Service Cards */}
        <div className="grid grid-cols-1 gap-2 max-w-3xl mx-auto">
          {services.map((service, index) => (
            <div
              key={index}
              className="bg-white flex justify-between items-center text-black rounded-lg shadow-lg p-6"
            >
              <div className="flex flex-col items-start">
                <h2 className="text-2xl text-start font-bold mb-4">{service.name}</h2>
                <p className="mb-4">{service.duration} @ {service.price}</p>
                {service.description && (
                  <p className="mb-4 text-start text-gray-600">{service.description}</p>
                )}
              </div>
              <Link
                to="/book-now"
                className="inline-block text-white text-nowrap bg-orange-500 hover:bg-orange-400 px-6 py-2 rounded-md ml-8"
              >
                Book Now
              </Link>
            </div>
          ))}
        </div>
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default Schedule;

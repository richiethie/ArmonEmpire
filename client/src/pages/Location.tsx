import Header from "@/components/Header";
import { MapPin, Phone, Mail, Clock, Navigation } from "lucide-react";

const Location = () => {
  return (
    <>
      <Header />
      <div className="min-h-screen bg-white text-black">
        {/* Hero Section */}
        <div className="bg-black text-white py-28 px-6">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-4xl md:text-5xl font-bold mb-4 mt-8">Visit Our Location</h2>
            <p className="text-xl opacity-80">Experience exceptional service at Armon Empire</p>
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-6xl mx-auto px-6 py-12">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            {/* Left Column - Contact Info */}
            <div className="space-y-8">
              <div className="bg-gray-100 p-8 rounded-lg shadow-md">
                <h2 className="text-3xl font-bold mb-6 border-b border-gray-300 pb-3">Contact Information</h2>
                
                <div className="space-y-6">
                  <div className="flex items-start">
                    <MapPin className="mt-1 mr-4 flex-shrink-0 text-gray-800" size={24} />
                    <div>
                      <h3 className="font-semibold text-xl mb-1">Address</h3>
                      <p className="text-lg">759 S Main St</p>
                      <p className="text-lg">Fond du Lac, WI 54935</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <Phone className="mt-1 mr-4 flex-shrink-0 text-gray-800" size={24} />
                    <div>
                      <h3 className="font-semibold text-xl mb-1">Phone</h3>
                      <a href="tel:+19205391063" className="text-lg hover:text-gray-600 transition-colors">
                        (920) 539-71063
                      </a>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <Mail className="mt-1 mr-4 flex-shrink-0 text-gray-800" size={24} />
                    <div>
                      <h3 className="font-semibold text-xl mb-1">Email</h3>
                      <a href="mailto:armonempire@gmail.com" className="text-lg hover:text-gray-600 transition-colors">
                        armonempire@gmail.com
                      </a>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <Clock className="mt-1 mr-4 flex-shrink-0 text-gray-800" size={24} />
                    <div>
                      <h3 className="font-semibold text-xl mb-1">Hours</h3>
                      <div className="grid grid-cols-2 gap-1 text-lg">
                        <p>Tuesday - Friday</p><p>11:00 AM - 7:00 PM</p>
                        <p>Saturday</p><p>12:00 PM - 7:00 PM</p>
                        <p>Sunday</p><p>Closed</p>
                        <p>Monday</p><p>Closed</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="bg-black text-white p-8 rounded-lg shadow-md">
                <h2 className="text-2xl font-bold mb-4">Get Directions</h2>
                <p className="mb-6">Use your preferred navigation app to find us:</p>
                <div className="flex flex-wrap gap-4">
                  <a 
                    href="https://www.google.com/maps/dir/?api=1&destination=759+S+Main+St,+Fond+du+Lac,+WI+54935" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex items-center justify-center bg-white text-black py-3 px-6 rounded-lg font-semibold hover:bg-gray-200 transition-colors"
                  >
                    <Navigation className="mr-2" size={20} />
                    Google Maps
                  </a>
                  <a 
                    href="https://maps.apple.com/?address=759+S+Main+St,+Fond+du+Lac,+WI+54935" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex items-center justify-center bg-white text-black py-3 px-6 rounded-lg font-semibold hover:bg-gray-200 transition-colors"
                  >
                    <Navigation className="mr-2" size={20} />
                    Apple Maps
                  </a>
                </div>
              </div>
            </div>
            
            {/* Right Column - Map */}
            <div className="space-y-8">
              <div className="rounded-lg overflow-hidden shadow-lg h-96 md:h-full">
                <iframe
                  className="w-full h-full border-0"
                  src={`https://www.google.com/maps/embed/v1/place?key=${import.meta.env.VITE_GOOGLE_MAPS_API_KEY}&q=759+S+Main+St,+Fond+du+Lac,+WI+54935&zoom=15`}
                  allowFullScreen
                  loading="lazy"
                  title="Armon Empire Location"
                ></iframe>
              </div>
              
              <div className="bg-gray-100 p-8 rounded-lg shadow-md">
                <h2 className="text-2xl font-bold mb-4">Parking Information</h2>
                <p className="mb-4">Free parking is available in our dedicated lot directly in front of our building.</p>
                <p className="text-gray-700">Additional street parking can be found along S Main St.</p>
              </div>
            </div>
          </div>
          
          {/* Call to Action Section */}
          <div className="mt-16">
            <h2 className="text-3xl font-bold mb-6">Ready to Visit?</h2>
            <div className="flex flex-wrap justify-start gap-4">
              <a 
                href="/schedule" 
                className="bg-black text-white py-3 px-8 rounded-lg font-semibold hover:bg-gray-800 transition-colors"
              >
                Book an Appointment
              </a>
              <a 
                href="/services" 
                className="bg-white text-black border-2 border-black py-3 px-8 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
              >
                View Our Services
              </a>
            </div>
          </div>
        </div>
        
        {/* Footer */}
        <footer className="bg-gray-100 py-8 px-6 mt-12">
          <div className="max-w-6xl mx-auto">
            <div className="text-center">
              <p className="text-lg font-semibold">&copy; {new Date().getFullYear()} Armon Empire. All Rights Reserved.</p>
              <div className="flex justify-center gap-3 md:gap-6 mt-4">
                <a href="/" className="hover:text-gray-600 transition-colors">Home</a>
                <a href="/memberships" className="hover:text-gray-600 transition-colors">Membership</a>
                <a href="/services" className="hover:text-gray-600 transition-colors">Services</a>
                <a href="/schedule" className="hover:text-gray-600 transition-colors">Book Now</a>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </>
  );
};

export default Location;
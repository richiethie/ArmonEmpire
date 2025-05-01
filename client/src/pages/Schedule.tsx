import { useState, useEffect } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { useIsMobile } from '@/context/MobileContext';
import { barberCalendars } from "@/helpers";

// Type for barber object - update this to match your actual structure
type BarberType = {
  type: string;
  name: string;
  calendarId: string;
  title?: string; // Optional properties
  specialty?: string;
  description?: string;
  img?: string;
};

// Booking Embed Component
const BookingEmbed = ({ calendarId }: { calendarId: string }) => {
  const isMobile = useIsMobile();
  
  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://embed.acuityscheduling.com/js/embed.js";
    script.async = true;
    document.body.appendChild(script);
  }, []);

  return (
    <div className={`${isMobile ? "w-full" : "w-full"} rounded-xl shadow-2xl overflow-hidden`}>
      <iframe
        src={`https://app.acuityscheduling.com/schedule.php?owner=26056634&calendarID=${calendarId}&ref=embedded_csp`}
        title="Schedule Appointment"
        className="w-full min-h-screen rounded-lg"
        frameBorder="0"
      ></iframe>
    </div>
  );
};

const Schedule = () => {
  const [selectedBarber, setSelectedBarber] = useState<string | null>(null);
  const isMobile = useIsMobile();

  // Get the selected barber's calendar ID
  const selectedCalendar = barberCalendars.find(barber => barber.name === selectedBarber)?.calendarId;
  
  // Find selected barber's details
  const selectedBarberDetails = barberCalendars.find(barber => barber.name === selectedBarber);

  return (
    <div className="bg-gray-100">
      <div className="min-h-screen">
        {/* Header */}
        <Header />

        {/* Hero Section */}
        <div className="pt-[100px] bg-black">
          <div className="max-w-6xl mx-auto px-4 md:px-8">
            <div className="relative py-12 md:py-16 border-b border-[#1b1f23]">
              {/* Decorative elements */}
              {/* <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-radial from-[#1b1f23] to-transparent opacity-30 rounded-full transform translate-x-1/3 -translate-y-1/3"></div> */}
              <div className="absolute bottom-0 left-0 w-48 h-48 bg-gradient-radial from-[#1b1f23] to-transparent opacity-20 rounded-full transform -translate-x-1/3 translate-y-1/3"></div>
              
              <h2 className="text-4xl md:text-5xl font-bold text-white mb-4 md:mb-6 relative">Book Your Experience</h2>
              <div className="w-24 h-1 bg-gray-200 mb-6 md:mb-8"></div>
              <p className="text-sm md:text-xl text-gray-300 max-w-2xl">
                We're committed to delivering premium grooming services tailored to your style. Choose your preferred stylist below to schedule your appointment.
              </p>
              <p className="text-sm md:text-lg text-gray-200 font-bold mt-6">
                <span className="inline-block border-l-4 border-gray-200 pl-3">Members:</span> Please <a className="bg-black border border-gray-700 px-3 py-[3px] font-normal text-white rounded-sm tracking-wider hover:text-white hover:bg-black transition duration-300" href="/login">Login</a> to access exclusive member appointments in the Member Center.
              </p>
            </div>
          </div>
        </div>

        {/* Page Content */}
        <div className="max-w-6xl mx-auto px-4 md:px-8 py-12 flex flex-col items-center">
          {/* Show Options if No Barber is Selected */}
          {!selectedBarber ? (
            <div className="w-full">
              <h2 className="text-2xl md:text-3xl text-black font-bold mb-8 text-center">Who's Taking Care of You Today?</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-4xl mx-auto">
                {barberCalendars
                  .filter((barber) => barber.type === "guest")
                  .map((barber: BarberType) => (
                  <div 
                    key={barber.name} 
                    className="bg-[#1b1f23] border border-[#1b1f23] rounded-xl overflow-hidden hover:border-orange-300 transition-all duration-300 transform hover:scale-[1.02] hover:shadow-lg cursor-pointer group"
                    onClick={() => setSelectedBarber(barber.name)}
                  >
                    {/* Generic stylist icon - no image property in your data */}
                    <div className="h-48 bg-[#1b1f23] relative overflow-hidden flex items-center justify-center">
                      {barber.img ? (
                        <img
                          src={barber.img}
                          alt={barber.name}
                          className="w-32 h-32 rounded-full object-cover shadow-lg z-5"
                        />
                      ) : (
                        <div className="relative w-24 h-24 rounded-full bg-black flex items-center justify-center">
                          <svg className="w-16 h-16 text-gray-600" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                          </svg>
                        </div>
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent opacity-60"></div>
                    </div>
                    
                    <div className="p-6">
                      <h3 className="text-xl font-bold text-white mb-2 group-hover:text-orange-300 transition duration-300">{barber.name}</h3>
                      <p className="text-gray-400 text-sm mb-4">{barber.title || "Expert Stylist"}</p>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-300 text-sm">{barber.specialty || "All Services"}</span>
                        <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-black text-white group-hover:bg-orange-300 group-hover:text-black transition duration-300">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                          </svg>
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="w-full flex flex-col items-center">
              {/* Barber details header */}
              <div className="mb-8 text-center w-full max-w-2xl">
                <h2 className="text-2xl md:text-3xl font-bold text-black mb-4">Schedule with {selectedBarber}</h2>
                {selectedBarberDetails && (
                  <p className="text-gray-600 mb-6">{"Choose from available services and times below."}</p>
                )}
                
                {/* Back Button */}
                <button 
                  onClick={() => setSelectedBarber(null)} 
                  className="inline-flex items-center py-2 px-4 border border-gray-700 bg-[#1b1f23] rounded-md text-gray-300 hover:border-orange-300 hover:text-orange-300 transition duration-300"
                >
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                  </svg>
                  Back to Selection
                </button>
              </div>

              {/* Acuity Scheduling Embed with framed background */}
              <div className="w-full flex justify-center">
                <div className={`${isMobile ? "w-full" : "w-full"} bg-[#1b1f23] rounded-xl p-1 md:p-2 shadow-2xl border border-[#1b1f23]`}>
                  {selectedCalendar && <BookingEmbed calendarId={selectedCalendar} />}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Pre-Footer CTA */}
      <div className="bg-[#1b1f23] border-t border-[#1b1f23]">
        <div className="max-w-4xl mx-auto py-12 px-4 text-center">
          <h3 className="text-2xl font-bold text-white mb-4">Need Help Choosing?</h3>
          <p className="text-gray-300 mb-6">Not sure which service is right for you? Our team is here to help.</p>
          <a 
            href="/location" 
            className="inline-flex items-center px-6 py-3 rounded-md bg-black text-white border border-gray-700 hover:border-orange-300 hover:text-orange-300 transition duration-300"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
            </svg>
            Contact Us
          </a>
        </div>
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default Schedule;
import { useState, useEffect } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { useIsMobile } from '@/context/MobileContext';
import { barberCalendars } from "@/helpers";

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
    <div className={`${isMobile ? "w-full" : "w-[60%]"} rounded-xl`}>
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

  // Get the selected barber's calendar ID
  const selectedCalendar = barberCalendars.find(barber => barber.name === selectedBarber)?.calendarId;

  return (
    <div className="bg-black">
      <div className="min-h-screen">
        {/* Header */}
        <Header />

        {/* Page Content */}
        <div className="pt-[100px] px-8 py-12 text-center text-crispWhite flex flex-col items-center w-full">
          <h1 className="text-4xl md:text-6xl text-white my-6">Schedule Your Service</h1>
          <p className="text-sm md:text-xl text-white mb-6">
            We're excited to serve you! Choose your desired team member and/or service to schedule your appointment below.
          </p>
          <p className="text-sm md:text-xl text-orange-300 mb-12">
            - Members: Please <a className="underline hover:text-white" href="/login">Login</a> and book member appointments in the Member Center. -
          </p>

          {/* Show Options if No Barber is Selected */}
          {!selectedBarber ? (
            <div className="flex flex-col justify-center items-center w-full md:w-[30%] mt-12">
              {barberCalendars
                .filter((barber) => barber.type === "guest")
                .map((barber) => (
                <div 
                  key={barber.name} 
                  className="py-4 px-6 border border-white rounded-lg mb-8 w-full hover:border-orange-300 hover:text-orange-300 cursor-pointer"
                  onClick={() => setSelectedBarber(barber.name)}
                >
                  <p>{barber.name}</p>
                </div>
              ))}
            </div>
          ) : (
            <>
              {/* Back Button */}
              <button 
                onClick={() => setSelectedBarber(null)} 
                className="hover:text-white flex items-center py-2 px-4 border border-white rounded-lg cursor-pointer hover:border-orange-300 hover:text-orange-300"
              >
                ← Back to Selection
              </button>

              {/* Acuity Scheduling Embed */}
              <div className="my-12 flex flex-col justify-center items-center w-full">
                {selectedCalendar && <BookingEmbed calendarId={selectedCalendar} />}
              </div>
            </>
          )}
        </div>
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default Schedule;

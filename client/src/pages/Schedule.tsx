import Header from "../components/Header";
import Footer from "../components/Footer";
import { useEffect } from "react";
import { useIsMobile } from '@/context/MobileContext';

const BookingEmbed = () => {
  const isMobile = useIsMobile();
  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://embed.acuityscheduling.com/js/embed.js";
    script.async = true;
    document.body.appendChild(script);
  }, []);

  return (
    <div className={`${ isMobile ? ("w-full") : ("w-[60%]")} rounded-xl shadow-lg drop-shadow-[0_0_30px_rgba(255,255,255,0.6)]`}>
      <iframe
        src="https://app.acuityscheduling.com/schedule.php?owner=26056634&ref=embedded_csp"
        title="Schedule Appointment"
        className="w-full min-h-screen rounded-lg"
        frameBorder="0"
      ></iframe>
    </div>
  );
};

const Schedule = () => {

  return (
    <div className="bg-black min-h-screen">
      {/* Header */}
      <Header />

      {/* Page Content */}
      <div className="pt-[100px] px-8 py-12 text-center text-crispWhite">
        <h1 className="text-4xl font-bold text-white mb-6">Schedule Your Service</h1>
        <p className="text-xl text-white mb-12">
          We're excited to serve you! Choose your desired service and schedule your appointment below.
        </p>

        {/* Acuity Scheduling Inline Embed */}
        <div className="my-12 flex flex-col justify-center items-center">
          <BookingEmbed />
        </div>
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default Schedule;

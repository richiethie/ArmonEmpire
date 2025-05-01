import SampleLandingVideo from "../assets/video/SampleLandingVideo.mp4";
import VerticalHero from "../assets/video/vertical-hero.mp4";
import ArmonEmpireLogo from "../assets/img/ArmonEmpireLogo.png";
import { useIsMobile } from '@/context/MobileContext';
import { Link } from "react-router-dom";

const Hero = () => {
  const isMobile = useIsMobile();

  if (isMobile) {
    return (
      <div className="relative w-full h-screen flex flex-col justify-center items-center bg-charcoal text-white">
        {/* Mobile Background Video */}
        <video
          className="absolute top-0 left-0 w-full h-full object-cover"
          autoPlay
          loop
          muted
          playsInline
        >
          <source src={VerticalHero} type="video/mp4" />
          Your browser does not support the video tag.
        </video>

        {/* Dark Overlay for Mobile */}
        <div className="absolute top-0 left-0 w-full h-full bg-black opacity-50"></div>

        {/* Mobile Logo and Button */}
        <div className="relative z-5 flex flex-col justify-center items-center text-white">
          <img
            src={ArmonEmpireLogo}
            alt="Logo"
            className="w-3/4 max-w-[300px] sm:max-w-[400px]"
          />
          <Link to="/schedule">
            <button className="mt-6 text-xl text-nowrap font-bold border-2 border-white px-6 py-3 rounded-md cursor-pointer hover:text-orange-300 hover:border-orange-300">
              Book Now
            </button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="relative w-full h-screen">
      {/* Desktop Background Video */}
      <video
        className="absolute top-0 left-0 w-full h-full object-cover"
        autoPlay
        loop
        muted
        playsInline
      >
        <source src={SampleLandingVideo} type="video/mp4" />
        Your browser does not support the video tag.
      </video>

      {/* Dark Overlay */}
      <div className="absolute top-0 left-0 w-full h-full bg-black opacity-50"></div>

      {/* Centered Content */}
      <div className="absolute flex flex-col justify-center items-center w-full h-full text-white">
        <div className="absolute left-1/4 flex flex-col items-center transform -translate-x-1/2">
          <img
            src={ArmonEmpireLogo}
            alt="Logo"
            className="w-3/4 max-w-[300px] sm:max-w-[400px] md:max-w-[500px] lg:max-w-[600px]"
          />
          <Link to="/schedule">
            <button className="mt-6 text-3xl font-bold text-nowrap border-4 border-white px-6 py-3 rounded-md cursor-pointer hover:text-orange-300 hover:border-orange-300">
              Book Now
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Hero;
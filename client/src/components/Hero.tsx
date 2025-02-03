import SampleLandingVideo from "../assets/video/SampleLandingVideo.mp4";
import ArmonEmpireLogo from "../assets/img/ArmonEmpireLogo.png";

const Hero = () => {
  return (
    <div className="relative w-full h-screen">
      {/* Background Video */}
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
            <button className="mt-6 text-3xl w-[80%] font-bold border-4 border-white px-6 py-3 rounded-md cursor-pointer hover:text-orange-300 hover:border-orange-300">
                Book Now
            </button>
        </div>
        
      </div>
    </div>
  );
};

export default Hero;

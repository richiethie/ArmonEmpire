import LandingServicesPhoto from "../assets/img/LandingServicesPhoto.jpg"; 
import Team from "../assets/img/Team.jpeg";
import { useIsMobile } from '@/context/MobileContext';
import { Link } from "react-router-dom";

const LandingServices = () => {
    const isMobile = useIsMobile();

    if (isMobile) {
        return (
            <div className="flex flex-col items-center py-[4rem]">
                {/* Mobile: Image with Fade at Bottom */}
                <div className="relative w-full">
                    <img
                        src={Team}
                        alt="Landing Services"
                        className="w-full h-[30rem] object-cover"
                    />
                    {/* Fade to Black on the Bottom */}
                    <div className="absolute bottom-0 left-0 w-full h-[40%] bg-gradient-to-t from-black to-transparent"></div>
                </div>

                {/* Mobile: Description */}
                <div className="w-full bg-black text-white p-8">
                    <div className="flex flex-col items-center">
                        <h1 className="text-4xl text-center mb-4">Armon Empire: Redefining Men’s Grooming</h1>
                        <p className="text-sm font-semibold mb-4 text-center">
                            In today’s world, the modern man deserves more than just a quick trim. He deserves a grooming experience that caters to his style, confidence, and individuality. Welcome to Armon Empire, a place where precision meets luxury in a setting unlike any other. No more cookie-cutter salons or crowded spaces. Just an exclusive, sophisticated environment designed with the modern man in mind.
                        </p>
                        <p className="text-sm font-semibold mb-4 text-center">
                            It’s not just about looking good—it’s about feeling good. And at Armon Empire, we believe in delivering a full experience, from sharp cuts to premium service. Whether you're here for a fresh cut, a classic shave, or to just unwind with a good drink, we’ve got you covered.
                        </p>
                        <p className="text-xl text-center font-bold uppercase mb-4">
                            Your go-to destination for the ultimate men’s grooming experience.
                        </p>
                        <Link to="/services">
                            <button className="mt-6 text-xl text-nowrap font-bold border-2 border-white px-6 py-3 rounded-md cursor-pointer hover:text-orange-300 hover:border-orange-300">
                                Our Custom Services
                            </button>
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="flex items-center justify-between py-[10rem]">
            {/* Desktop: Image with Fade to Right */}
            <div className="relative w-1/2">
                <img
                    src={LandingServicesPhoto}
                    alt="Landing Services"
                    className="w-full h-full object-cover"
                />
                {/* Fade to Black on the Right */}
                <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-transparent to-black"></div>
            </div>

            {/* Desktop: Description */}
            <div className="w-1/2 flex justify-center bg-black text-white p-8">
                <div className="flex flex-col items-center max-w-4xl">
                    <h1 className="text-6xl text-center mb-4">Armon Empire: Redefining Men’s Grooming</h1>
                    <p className="text-xl font-semibold mb-4">
                        In today’s world, the modern man deserves more than just a quick trim. He deserves a grooming experience that caters to his style, confidence, and individuality. Welcome to Armon Empire, a place where precision meets luxury in a setting unlike any other. No more cookie-cutter salons or crowded spaces. Just an exclusive, sophisticated environment designed with the modern man in mind.
                    </p>
                    <p className="text-xl font-semibold mb-4">
                        It’s not just about looking good—it’s about feeling good. And at Armon Empire, we believe in delivering a full experience, from sharp cuts to premium service. Whether you're here for a fresh cut, a classic shave, or to just unwind with a good drink, we’ve got you covered.
                    </p>
                    <p className="text-2xl text-center font-bold uppercase mb-4">
                        Your go-to destination for the ultimate men’s grooming experience.
                    </p>
                    <Link to="/services">
                        <button className="mt-6 text-3xl text-nowrap font-bold border-4 border-white px-6 py-3 rounded-md cursor-pointer hover:text-orange-300 hover:border-orange-300">
                            Our Custom Services
                        </button>
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default LandingServices;

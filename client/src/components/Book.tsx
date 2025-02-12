import Backsplash from "../assets/img/Backsplash.jpg";
import { useIsMobile } from '@/context/MobileContext';
import { Link } from "react-router-dom";

const Book = () => {
  const isMobile = useIsMobile();

  if (isMobile) {
    return (
      <div
        className="flex flex-col items-center py-[4rem] bg-cover bg-center sm:py-[4rem]"
        style={{ backgroundImage: `url(${Backsplash})` }}
      >
        <h1 className="text-white text-3xl sm:text-4xl mb-2 text-center px-4 sm:px-8">
          Ready to elevate your look?
        </h1>
        <h1 className="text-white text-3xl sm:text-4xl mb-2 text-center px-4 sm:px-8">
          Book your appointment today.
        </h1>
        <Link to="/schedule">
          <button className="mt-6 text-xl sm:text-2xl text-white w-xs font-bold border-2 border-white px-3 py-3 rounded-md cursor-pointer hover:text-orange-300 hover:border-orange-300">
            Book Now
          </button>
        </Link>
      </div>
    );
  }

  return (
    <div
      className="flex flex-col items-center py-[10rem] bg-cover bg-center sm:py-[6rem] md:py-[10rem]"
      style={{ backgroundImage: `url(${Backsplash})` }}
    >
      <h1 className="text-white text-4xl sm:text-5xl md:text-6xl mb-2 text-center px-4 sm:px-8">
        Ready to elevate your look?
      </h1>
      <h1 className="text-white text-4xl sm:text-5xl md:text-6xl mb-2 text-center px-4 sm:px-8">
        Book your appointment today.
      </h1>
      <Link to="/schedule">
        <button className="mt-6 text-2xl sm:text-3xl text-white w-xl font-bold border-4 border-white px-6 py-3 rounded-md cursor-pointer hover:text-orange-300 hover:border-orange-300">
          Book Now
        </button>
      </Link>
    </div>
  );
};

export default Book;

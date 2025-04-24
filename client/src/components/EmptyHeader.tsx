import { useNavigate } from "react-router-dom";
import ArmonPartialLogo from "../assets/img/ArmonPartialLogo.png";
import { useIsMobile } from "@/context/MobileContext";

const EmptyHeader = () => {
  const navigate = useNavigate();
  const isMobile = useIsMobile();

  return (
    <header className="fixed top-0 left-0 w-full z-10 p-4 bg-black shadow-lg border-b border-bg-[#1b1f23]">
      <div className="flex items-center mx-auto">
        {/* Logo (Left) */}
        <div 
          className={`flex items-center text-4xl cursor-pointer`}
          onClick={() => navigate("/")}
        >
          <div className={`flex justify-center items-center ${isMobile ? ("w-10") : ("w-12")} bg-white rounded-full`}>
            <img src={ArmonPartialLogo} alt="Armon Empire Logo" className={`${isMobile ? ("h-10") : ("h-12")} pb-1`} />
          </div>
          <h1 className={`text-white ${isMobile ? ("text-4xl") : ("text-6xl")} ml-1 mt-1`}>Armon Empire</h1>
        </div>
      </div>
    </header>
  );
};

export default EmptyHeader;

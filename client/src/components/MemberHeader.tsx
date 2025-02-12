import { useNavigate } from "react-router-dom";
import ArmonPartialLogo from "../assets/img/ArmonPartialLogo.png";
import { FaUserCircle } from "react-icons/fa"; // User avatar icon

const MemberHeader = () => {
  const navigate = useNavigate();

  return (
    <header className="fixed top-0 left-0 w-full z-10 p-4 bg-black shadow-lg">
      <div className="flex justify-between items-center mx-auto">
        {/* Logo (Left) */}
        <div 
          className="flex items-center text-4xl cursor-pointer"
          onClick={() => navigate("/members")}
        >
          <div className="flex justify-center items-center w-12 bg-white rounded-full">
            <img src={ArmonPartialLogo} alt="Armon Empire Logo" className="h-12 pb-1" />
          </div>
          <h1 className="text-white ml-1">Armon Empire</h1>
        </div>

        {/* Empty Middle Section */}
        <div className="flex-1"></div>

        {/* Avatar Icon (Right) */}
        <button onClick={() => navigate("/account")} className="text-white text-3xl">
          <FaUserCircle />
        </button>
      </div>
    </header>
  );
};

export default MemberHeader;

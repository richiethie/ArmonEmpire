import Backsplash from "../assets/img/Backsplash.jpg";

const Book = () => {
  return (
    <div
      className="flex flex-col items-center py-[10rem] bg-cover bg-center"
      style={{ backgroundImage: `url(${Backsplash})` }}
    >
      <h1 className="text-white text-6xl mb-2">Ready to elevate your look?</h1>
      <h1 className="text-white text-6xl mb-2">Book your appointment today.</h1>
      <button className="mt-6 text-3xl text-white w-xl font-bold border-4 border-white px-6 py-3 rounded-md cursor-pointer hover:text-orange-300 hover:border-orange-300">
        Book Now
      </button>
    </div>
  );
};

export default Book;

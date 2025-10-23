import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Navigation } from "swiper/modules";
import { Box, HStack } from "@chakra-ui/react";
import 'swiper/swiper-bundle.css'; // Import Swiper styles
import Charles from "../assets/img/Charles2.jpeg"
import Jaylen from "../assets/img/Jaylen2.1.jpg"
import Trish from "../assets/img/Trish2.2.jpg"
import Tyler from "../assets/img/Tyler2.jpg"
import { useIsMobile } from '@/context/MobileContext';
import { Link } from "react-router-dom";

const teamMembers = [
  {
    image: Charles, // Replace with actual image path
    title: "Master Barber",
    name: "CHARLES B ARMON",
    description: "It all begins with an idea. Maybe you want to launch a business. Maybe you want to turn a hobby into something more. Or maybe you have a creative project to share with the world. Whatever it is, the way you tell your story online can make all the difference. I decided to make that dream into a reality.",
  },
  {
    image: Jaylen,
    title: "Barber",
    name: "JAYLEN LIEDKE",
    description: "Nothing is predestined, the obsticles of your past can become the gateways that lead to new beginnings. With Friends and love you can accomplish anything.",
  },
  {
    image: Trish,
    title: "Barber",
    name: "PATRICIA WARE",
    description: "Its a constant quest to try to be a better today than yesterday and better tomorrow than you were the day before.",
  },
  {
    image: Tyler,
    title: "Barber",
    name: "TYLER ROGERS",
    description: "Every cut tells a story — of patience, craft, and pride. What starts as skill becomes art when you pour your heart into every detail.",
  },
  // {
  //   image: Tyler,
  //   title: "Barber",
  //   name: "TYLER ROGERS",
  //   description: "Blessed are the cosmetologists, for they bring out the beauty in others.",
  // },
];

const Team = () => {
  const isMobile = useIsMobile();

  if (isMobile) {
    return (
      <div className="py-10 bg-white text-white">
        <h1 className="text-5xl text-center text-black mb-8">Meet Our Team</h1>
        {/* Mobile view: Displaying team members in a horizontal scroll with HStack */}
        <Box
          overflowX="scroll"
          display="flex"
          scrollSnapType="x mandatory"
          px={0.5}
          className="overflow-hidden"
        >
          <HStack as="ul" align="flex-start">
            {teamMembers.map((member, index) => (
              <div
                key={index}
                className="bg-black rounded-lg overflow-hidden shadow-lg p-4 text-center flex-shrink-0 w-[350px] mx-2"
              >
                <img
                  src={member.image}
                  alt={member.name}
                  className="h-[15rem] w-full mx-auto object-cover object-top mb-4 rounded-lg"
                />
                <div className="flex flex-col px-4">
                  <div className="flex flex-col items-center mb-4">
                    <h2 className="text-2xl font-bold text-white">{member.title}</h2>
                    <h3 className="text-lg font-semibold text-white">{member.name}</h3>
                  </div>
                  <Link to="/schedule">
                    <button className="text-white text-xl font-semibold border border-white px-6 py-2 rounded-md cursor-pointer hover:text-orange-300 hover:border-orange-300 mb-4">
                      Schedule Now
                    </button>
                  </Link>
                  <p className="text-sm text-center text-gray-300">{member.description}</p>
                </div>
              </div>
            ))}
          </HStack>
        </Box>
      </div>
    );
  }  

  return (
    <div className="py-10 bg-white text-white">
      <h1 className="text-6xl text-black mb-8 ml-8">Meet Our Team</h1>

      <Swiper
        modules={[Pagination, Navigation]}
        spaceBetween={30}
        slidesPerView={1}
        breakpoints={{
          640: { slidesPerView: 1 },
          768: { slidesPerView: 2 },
          1024: { slidesPerView: 3 },
        }}
        pagination={{ clickable: true }}
        navigation
        className="mx-auto"
      >
        {teamMembers.map((member, index) => (
          <SwiperSlide key={index} className="p-4">
            <div className="bg-black rounded-lg overflow-hidden shadow-lg p-6 text-center">
              <img
                src={member.image}
                alt={member.name}
                className="h-[30rem] w-full mx-auto object-cover object-top mb-4"
              />
              <div className="flex flex-col px-4">
                <div className="flex justify-between">
                    <div className="flex flex-col items-start">
                        <h2 className="text-3xl font-bold text-white">{member.title}</h2>
                        <h3 className="text-xl font-semibold">{member.name}</h3>
                    </div>
                    <Link to="/schedule">
                      <button className="text-white text-xl font-semibold border border-white px-4 py-2 rounded-md cursor-pointer hover:text-orange-300 hover:border-orange-300">Schedule Now</button>
                    </Link>
                </div>
                <p className="mt-4 text-xl text-start text-gray-300">{member.description}</p>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default Team;

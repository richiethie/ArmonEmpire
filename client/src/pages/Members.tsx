import { useEffect, useState } from "react";
import Footer from "@/components/Footer";
import { useAuth } from "@/context/AuthContext";
import { User } from "@/types/User";
import MemberHeader from "@/components/MemberHeader";
import axios from "axios";
import Appointments from "@/components/Appointments";

const Members = () => {
    const { user } = useAuth(); // Access current user from the AuthContext
    const [member, setMember] = useState<User | null>(null);
    const [isEditing, setIsEditing] = useState(false);
    const [preferredBarber, setPreferredBarber] = useState<string>(member?.preferredBarber || "");
    const [drinkOfChoice, setDrinkOfChoice] = useState<string>(member?.drinkOfChoice || "");

    const handleCancel = () => {
        if (member) {
            setPreferredBarber(member.preferredBarber);
            setDrinkOfChoice(member.drinkOfChoice);
        }
        setIsEditing(false);
    };

    const handleSave = async () => {
        const token = localStorage.getItem("token");
        try {
          const response = await axios.put(
            `${import.meta.env.VITE_API_URL}/api/user/update`,
            {
              preferredBarber,
              drinkOfChoice,
            },
            {
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
              },
            }
          );
      
          if (response.status === 200) {
            setMember((prev) => {
              if (!prev) return prev; // Prevents errors if `prev` is null
              return {
                ...prev, // Keep existing values
                preferredBarber,
                drinkOfChoice,
              };
            });
            setIsEditing(false);
          }
        } catch (error) {
          console.error("Error updating profile:", error);
        }
    };

    useEffect(() => {
        const fetchMember = async () => {
            const token = localStorage.getItem("token");
            try {
                const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/user`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                console.log(response.data);
                setMember(response.data);
            } catch (error) {
                console.error("Error fetching members:", error);
            }
        };

        fetchMember();
    }, []);

    // Update preferredBarber and drinkOfChoice when member is fetched
    useEffect(() => {
        if (member) {
            setPreferredBarber(member.preferredBarber || "");
            setDrinkOfChoice(member.drinkOfChoice || "");
        }
    }, [member]);

    return (
        <>
            <MemberHeader />
            <div className="bg-black text-crispWhite min-h-screen w-full py-8 mt-20">
                <div className="flex flex-col w-full px-20">
                    <h1 className="text-7xl text-center mb-8">Member Center</h1>

                    <div className="w-full">
                        {user ? (
                            <div className="flex items-center justify-between mb-6 text-start">
                                <h2 className="text-2xl font-semibold">Welcome, {member?.firstName}!</h2>
                                <p className="mt-2 text-sm">{member?.membership} member</p>
                            </div>
                        ) : (
                            <div className="text-center text-lg text-orange-300">
                                <p>Please sign in to access the members area.</p>
                            </div>
                        )}
                        {/* Membership hub */}
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                            {/* Left Column - Membership Hub */}
                            <div className="rounded-lg border border-white p-6">
                                <h3 className="text-2xl text-center font-semibold mb-4">Your account</h3>
                                <div className="space-y-4">
                                    {member ? (
                                        <div key={member._id} className="p-4 rounded-lg">
                                            <>
                                                <h4 className="text-xl font-semibold">{member.firstName} {member.lastName}</h4>
                                                <p className="my-4 text-xl font-semibold text-gray-400">{member.email}</p>
                                                <div className="flex justify-between items-center my-2">
                                                    <p className="text-xl font-semibold">Membership tier: </p>
                                                    <p className="text-xl font-bold text-orange-300">{member.membership}</p>
                                                </div>

                                                <label className="block mt-6 text-xl mb-2 font-semibold">Preferred Barber:</label>
                                                <select 
                                                    value={preferredBarber} 
                                                    onChange={(e) => setPreferredBarber(e.target.value)} 
                                                    className={`p-2 w-full rounded bg-gray-800 text-white ${!isEditing && "opacity-50 cursor-not-allowed"}`}
                                                    disabled={!isEditing}
                                                >
                                                    <option value="" disabled>Select a Barber</option>
                                                    <option value="Charles Armon">Charles Armon</option>
                                                    <option value="Jaylen Liedke">Jaylen Liedke</option>
                                                    <option value="Tyler Rogers">Tyler Rogers</option>
                                                </select>

                                                <label className="block mt-6 text-xl mb-2 font-semibold">Drink of Choice:</label>
                                                <select 
                                                    value={drinkOfChoice} 
                                                    onChange={(e) => setDrinkOfChoice(e.target.value)} 
                                                    className={`p-2 w-full my-2 rounded bg-gray-800 text-white ${!isEditing && "opacity-50 cursor-not-allowed"}`}
                                                    disabled={!isEditing}
                                                >
                                                    <option value="" disabled>Select a Drink</option>
                                                    <option value="Water">Water</option>
                                                    <option value="Coca-Cola">Coca-Cola</option>
                                                    <option value="Pepsi">Pepsi</option>
                                                    <option value="Sprite">Sprite</option>
                                                    <option value="Whiskey">Whiskey</option>
                                                    <option value="Vodka">Vodka</option>
                                                    <option value="Rum">Rum</option>
                                                    <option value="Gin">Gin</option>
                                                    <option value="Tequila">Tequila</option>
                                                    <option value="Scotch">Scotch</option>
                                                    <option value="Bourbon">Bourbon</option>
                                                    <option value="Brandy">Brandy</option>
                                                    <option value="Cognac">Cognac</option>
                                                    <option value="Red Wine">Red Wine</option>
                                                    <option value="White Wine">White Wine</option>
                                                    <option value="Champagne">Champagne</option>
                                                    <option value="Beer">Beer</option>
                                                </select>

                                                {isEditing ? (
                                                    <div className="flex gap-2 mt-6">
                                                        <button 
                                                            className="bg-orange-300 cursor-pointer text-white px-4 py-2 rounded w-1/2" 
                                                            onClick={handleSave}
                                                        >
                                                            Save
                                                        </button>
                                                        <button 
                                                            className="bg-gray-800 cursor-pointer text-white px-4 py-2 rounded w-1/2" 
                                                            onClick={handleCancel}
                                                        >
                                                            Cancel
                                                        </button>
                                                    </div>
                                                ) : (
                                                    <button 
                                                        className="mt-6 cursor-pointer bg-orange-300 text-white px-4 py-2 rounded w-full" 
                                                        onClick={() => setIsEditing(true)}
                                                    >
                                                        Edit
                                                    </button>
                                                )}
                                            </>
                                        </div>
                                    ) : (
                                        <p className="text-center text-sm text-gray-400">No member found.</p>
                                    )}
                                </div>
                            </div>

                            {/* Center Column - Book Appointment & Check-In */}
                            <div className="space-y-6 md:col-span-2">
                                {/* Book an Appointment */}
                                <div className="rounded-lg border border-white p-8 bg-charcoal">
                                    {/* Book an Appointment Header */}
                                    <h3 className="text-xl text-center font-bold mb-4">
                                        Book an Appointment with <span className="text-orange-300">{member?.preferredBarber || "Your Preferred Barber"}</span>
                                    </h3>

                                    {/* Embed Acuity Scheduling iframe */}
                                    <iframe
                                        src="https://app.acuityscheduling.com/schedule.php?owner=26056634&calendarID=6774376&ref=embedded_csp"
                                        title="Schedule Appointment"
                                        width="100%"
                                        height="800"
                                        frameBorder="0"
                                        className="rounded-lg shadow-secondary" // Optional for styling
                                    ></iframe>
                                    <script
                                        src="https://embed.acuityscheduling.com/js/embed.js"
                                        type="text/javascript"
                                    ></script>
                                </div>

                                
                            </div>

                            {/* Right Column - Loyalty & Shop */}
                            <div className="space-y-6">
                                {/* Check-In System */}
                                <div className="rounded-lg border border-white p-10 bg-charcoal text-center">
                                    <h3 className="text-xl font-semibold mb-4">Check-In</h3>
                                    <button className="w-full bg-green-500 p-2 rounded text-white">I'm Here</button>
                                    <p className="mt-2 text-gray-400">Estimated wait time: ~10 min</p>
                                </div>
                                {/* Appointments */}
                                <Appointments />
                                
                                {/* Loyalty Points */}
                                <div className="rounded-lg border border-white p-6 bg-charcoal text-center">
                                    <h3 className="text-xl font-semibold mb-4">Specialty Services</h3>
                                    <button 
                                        className="mt-6 cursor-pointer bg-orange-300 text-white px-4 py-2 rounded w-full" 
                                        onClick={() => console.log("Hello")}
                                    >
                                        Book Now
                                    </button>
                                </div>

                            </div>
                        </div>

                    </div>
                </div>
            </div>
            <Footer />
        </>
    );
};

export default Members;

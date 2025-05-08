import { useEffect, useState } from "react";
import Footer from "@/components/Footer";
import { useAuth } from "@/context/AuthContext";
import { User } from "@/types/User";
import MemberHeader from "@/components/MemberHeader";
import axios from "axios";
import Appointments from "@/components/Appointments";
import { useIsMobile } from "@/context/MobileContext";
import Loader from "./Loader";
import "../styles/Loader.css";
import { barberCalendars } from "@/helpers";
import { useNavigate } from "react-router-dom";

const Members = () => {
    const { user } = useAuth(); // Access current user from the AuthContext
    const [member, setMember] = useState<User | null>(null);
    const [isEditing, setIsEditing] = useState<boolean>(false);
    const [preferredBarber, setPreferredBarber] = useState<string>(member?.preferredBarber || "");
    const [drinkOfChoice, setDrinkOfChoice] = useState<string>(member?.drinkOfChoice || "");
    const [selectedPhoto, setSelectedPhoto] = useState<File | null>(null);
    const [selectedPhotoName, setSelectedPhotoName] = useState<string | null>(null);
    const [firstName, setFirstName] = useState<string>(member?.firstName || "");
    const [lastName, setLastName] = useState<string>(member?.lastName || "");
    const [email, setEmail] = useState<string>(member?.email || "");
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [buttonLoading, setButtonLoading] = useState<boolean>(false);
    const [checkedIn, setCheckedIn] = useState<boolean>(false);
    const [photoIdError, setPhotoIdError] = useState<string>("");

    const isMobile = useIsMobile();
    const navigate = useNavigate();

    const matchedBarberData = barberCalendars.find(
        barber => barber.name === member?.preferredBarber && barber.type === "guest"
    );

    // Normalize phone number to international format (e.g., +1234567890)
    const normalizePhoneNumber = (phone: string | undefined): string => {
        if (!phone) return "";
        // Remove non-digits except leading +
        let normalized = phone.replace(/[^\d+]/g, "");
        // Ensure it starts with +1 for US numbers
        if (!normalized.startsWith("+")) {
            normalized = `+1${normalized}`;
        }
        return normalized;
    };

    const handleCancel = () => {
        if (member) {
            // Reverting to the original member data
            setPreferredBarber(member.preferredBarber);
            setDrinkOfChoice(member.drinkOfChoice);
            setSelectedPhoto(null);
            
            // Reverting firstName, lastName, and email as well
            setFirstName(member.firstName);
            setLastName(member.lastName);
            setEmail(member.email);
            setPhotoIdError("");
        }
        setIsEditing(false);
    };

    const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0]; // Optional chaining to prevent errors
        if (file) {
            setSelectedPhoto(file);
            setSelectedPhotoName(file.name);  // Update the file name as well
            setPhotoIdError("");
        }
    };    

    const handleCheckIn = async () => {
        setButtonLoading(true);
        if (!member) {
            console.error("No member data available!");
            return; // Early return if `member` is null
        }
    
        try {
            const { photoId, ...memberData } = member; // Exclude `photoId` from member data
    
            const response = await axios.post(`${import.meta.env.VITE_CHECK_IN_URL}/check-in`, 
                { member: memberData }, // Send filtered user info
                {
                    headers: {
                        "Content-Type": "application/json",
                    },
                }
            );
    
            console.log("Checked in successfully!", response.data);
            setCheckedIn(true);
        } catch (error) {
            console.error("Check-in failed:", error);
        }
        setButtonLoading(false);
    };

    const handleSave = async () => {
        if (!member) return; // Exit early if member is null

        if (drinkOfChoice && !selectedPhotoName) {
            setPhotoIdError("A Photo ID upload is required to select a drink.");
            return;
        }
    
        const token = localStorage.getItem("token");
        const formData = new FormData();
    
        formData.append("preferredBarber", preferredBarber);
        formData.append("drinkOfChoice", drinkOfChoice);
        formData.append("firstName", firstName);
        formData.append("lastName", lastName);
        formData.append("email", email);
    
        if (selectedPhoto) {
            formData.append("photoID", selectedPhoto); // Append the file
            if (selectedPhotoName) {
                formData.append("photoIDName", selectedPhotoName); // Append the file name only if it's not null
            }
        }
    
        try {
            const response = await axios.put(
                `${import.meta.env.VITE_API_URL}/api/user/update`,
                formData,
                {
                    headers: {
                        "Content-Type": "multipart/form-data",
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
    
            if (response.status === 200) {
                setMember((prev) => {
                    if (!prev) return prev;
                
                    return {
                        ...prev,
                        preferredBarber,
                        drinkOfChoice,
                        firstName: prev.firstName,
                        lastName: prev.lastName,
                        email: prev.email,
                        photoID: selectedPhoto || prev.photoId, // Ensuring `photoID` is of type `File | null | undefined`
                    };
                });
                setPhotoIdError("");
                setIsEditing(false);
            }
        } catch (error) {
            console.error("Error updating profile:", error);
        }
    };
    
    

    useEffect(() => {
        const fetchMember = async () => {
            setIsLoading(true);
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
            setFirstName(member.firstName || "");
            setLastName(member.lastName || "");
            setEmail(member.email || "");
            setSelectedPhotoName(member?.photoId?.fileName || null);
            setPhotoIdError("");

        }
        console.log("MEMBER", member);
    }, [member]);

    useEffect(() => {
        // Minimum loading duration
        const loaderTimeout = setTimeout(() => {
          setIsLoading(false); // Force stop loader after 2 seconds minimum
        }, 2000); // Adjust 2000ms (2 seconds) based on your desired loader duration
    
        // Cleanup timeout
        return () => clearTimeout(loaderTimeout);
    }, [isLoading]);

    if (member?.membership === "Cancelled") {

        return (
            <>
                {isLoading && <Loader />}
                <MemberHeader />
                <div className="bg-black text-white min-h-screen w-full py-8 flex flex-col items-center justify-center">
                    <p className="font-bold text-lg">This membership has been cancelled.</p>
                    <button 
                        className="mt-6 cursor-pointer bg-orange-300 text-white px-4 py-2 rounded w-[60%]" 
                        onClick={() => navigate("/select-membership")}
                    >
                        Restart Membership
                    </button>
                </div>
                <Footer />
            </>
        );
    }

    if (member?.stripeCustomerId === null) {

        return (
            <>
                {isLoading && <Loader />}
                <MemberHeader />
                <div className="bg-black text-white min-h-screen w-full py-8 flex flex-col items-center justify-center">
                    <p className="font-bold text-lg">Please complete set membership set up.</p>
                    <button 
                        className="mt-6 cursor-pointer bg-orange-300 text-white px-4 py-2 rounded w-[60%]" 
                        onClick={() => navigate("/select-membership")}
                    >
                        Set up Membership
                    </button>
                </div>
                <Footer />
            </>
        );
    }

    return (
        <>
            {isLoading && <Loader />}
            <MemberHeader />
            <div className="bg-black text-white min-h-screen w-full py-8 mt-20">
                <div className="flex flex-col w-full px-4 md:px-20">
                    {member?.paymentStatus === "past_due" && (
                        <div className="bg-red-800 text-white py-2 px-2 rounded-md mb-8 text-sm flex items-center">
                            <div className="w-2 h-12 mr-4 rounded-md bg-red-500"></div>
                            <p>Your payment is past due. Please update your payment information. <a href="/manage-membership" className="underline">Manage Membership</a></p>
                        </div>
                    )}
                    <h2 className="text-3xl md:text-5xl font-bold text-center mb-10">Member Center</h2>

                    <div className="w-full">
                        {user ? (
                            <div className="flex items-center justify-between px-1 mb-2 md:b-6 text-start">
                                <h2 className="text-md md:text-xl font-semibold">Welcome, {member?.firstName}</h2>
                                <p className="text-md"><span className={`${getMembershipColor(member?.membership)} py-[2px]`}>{member?.membership}</span> member</p>
                            </div>
                        ) : (
                            <div className="text-center text-lg text-orange-300">
                                <p>Please sign in to access the members area.</p>
                            </div>
                        )}
                        {/* Membership hub */}
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                            {/* Right Column - Loyalty & Shop */}
                            <div className="space-y-6">
                                {/* Check-In System */}
                                <div className="rounded-lg bg-[#1b1f23] text-white p-10 text-center">
                                    <h3 className="text-xl font-semibold mb-4">Check-In</h3>
                                    {checkedIn ? (
                                        <button disabled className="w-full bg-gray-500 p-2 rounded text-white">Checked In</button>
                                    ) : (
                                        <button 
                                            onClick={handleCheckIn} 
                                            className="w-full bg-green-500 p-2 rounded text-white cursor-pointer hover:bg-green-700"
                                        >
                                            {buttonLoading ? (
                                                <div className="loading-dots flex justify-center items-center space-x-2 my-2">
                                                    <div className="dot"></div>
                                                    <div className="dot"></div>
                                                    <div className="dot"></div>
                                                    <div className="dot"></div>
                                                </div>
                                            ) :  ("I'm Here")}
                                        </button>
                                    )}
                                    <p className="mt-2 text-gray-400">Estimated wait time: Unavailable</p>
                                </div>
                                {/* Appointments */}
                                <Appointments />
                                
                                {/* Loyalty Points */}
                                <div className="rounded-lg bg-[#1b1f23] text-white p-6 bg-charcoal text-center">
                                    <h3 className="text-xl font-semibold mb-2">Specialty Services</h3>
                                    <div className="flex justify-center text-gray-500">
                                        <p>Cosmetology | SMYLEXO</p>
                                    </div>
                                    <button 
                                        className="mt-6 cursor-pointer bg-white text-black px-4 py-2 rounded w-full" 
                                        onClick={() => navigate("/schedule")}
                                    >
                                        Book Now
                                    </button>
                                </div>

                            </div>

                            {/* Center Column - Book Appointment & Check-In */}
                            <div className="space-y-6 md:col-span-2">
                                {/* Book an Appointment */}
                                <div className="rounded-lg bg-[#1b1f23] text-white p-2 md:p-8 bg-charcoal">
                                    {/* Book an Appointment Header */}
                                    <h3 className={`text-xl text-center font-bold mb-4 ${isMobile && ("mt-2")}`}>
                                        Book with <span className="text-gray-300">{member?.preferredBarber || "Your Preferred Barber"}</span>
                                    </h3>

                                    {/* Embed Acuity Scheduling iframe */}
                                    <iframe
                                        src={`https://app.acuityscheduling.com/schedule.php?owner=26056634&calendarID=${
                                            matchedBarberData?.calendarId
                                        }&ref=embedded_csp${
                                            member?.email ? `&email=${encodeURIComponent(member.email)}` : ""
                                        }${
                                            member?.phoneNumber
                                                ? `&phone=${encodeURIComponent(normalizePhoneNumber(member.phoneNumber))}`
                                                : ""
                                        }${member?.firstName ? `&firstName=${encodeURIComponent(member.firstName)}` : ""}${
                                            member?.lastName ? `&lastName=${encodeURIComponent(member.lastName)}` : ""
                                        }`}
                                        title="Schedule Appointment"
                                        width="100%"
                                        height="800"
                                        frameBorder="0"
                                        className="rounded-lg shadow-secondary"
                                    ></iframe>
                                    <script
                                        src="https://embed.acuityscheduling.com/js/embed.js"
                                        type="text/javascript"
                                    ></script>
                                    <p className="text-gray-400 text-xs text-center mt-4">
                                        Note: The form is prefilled with your membership email and phone number ({member?.email}, {member?.phoneNumber}).
                                    </p>
                                </div>
                            </div>

                            {/* Left Column - Membership Hub */}
                            <div className="rounded-lg bg-[#1b1f23] text-white p-6">
                                <h3 className="text-2xl text-center font-semibold mb-4">Your account</h3>
                                <div className="space-y-4">
                                    {member ? (
                                        <div key={member._id} className="p-2 md:p-4 rounded-lg">
                                            <>
                                                {/* COME BACK TO HANDLE UPDATE */}
                                                {isEditing ? (
                                                    <div className="flex items-center space-x-2">
                                                        <input type="text" value={firstName} onChange={(e) => setFirstName(e.target.value)} className={`p-2 w-[40%] my-2 rounded bg-gray-800 text-white ${!isEditing && "opacity-30 cursor-not-allowed"}`} />
                                                        <input type="text" value={lastName} onChange={(e) => setLastName(e.target.value)} className={`p-2 w-[60%] my-2 rounded bg-gray-800 text-white ${!isEditing && "opacity-30 cursor-not-allowed"}`} />
                                                    </div>
                                                ) : (
                                                    <div className="flex items-center space-x-2">
                                                        <input disabled type="text" value={firstName} className={`p-2 w-[40%] my-2 rounded bg-gray-800 text-white ${!isEditing && "opacity-30 cursor-not-allowed"}`} />
                                                        <input disabled type="text" value={lastName} className={`p-2 w-[60%] my-2 rounded bg-gray-800 text-white ${!isEditing && "opacity-30 cursor-not-allowed"}`} />
                                                    </div>
                                                )}
                                                {isEditing ? (
                                                    <input type="text" value={email} onChange={(e) => setEmail(e.target.value)} className={`p-2 w-full my-2 rounded bg-gray-800 text-white ${!isEditing && "opacity-30 cursor-not-allowed"}`} />
                                                ) : (
                                                    <input disabled type="text" value={email} className={`p-2 w-full my-2 rounded bg-gray-800 text-white ${!isEditing && "opacity-30 cursor-not-allowed"}`} />
                                                )}
                                                <div className="flex justify-between items-center my-2">
                                                    <p className="text-xl font-semibold">Membership tier: </p>
                                                    <p className={`text-xl font-bold ${getMembershipColor(member?.membership)}`}>{member.membership}</p>
                                                </div>

                                                {isEditing && (
                                                    <button onClick={() => navigate("/manage-membership")} className="cursor-pointer bg-white text-black px-4 py-2 rounded w-full">Change Membership</button>
                                                )}

                                                <label className="block mt-6 text-xl mb-2 font-semibold">Preferred Barber:</label>
                                                <select 
                                                    value={preferredBarber} 
                                                    onChange={(e) => setPreferredBarber(e.target.value)} 
                                                    className={`p-2 w-full rounded bg-gray-800 text-white ${!isEditing && "opacity-30 cursor-not-allowed"}`}
                                                    disabled={!isEditing}
                                                >
                                                    <option value="" disabled>Select a Barber</option>
                                                    <option value="Charles Armon">Charles Armon</option>
                                                    {/* <option value="Jaylen Liedke">Jaylen Liedke</option>
                                                    <option value="Tyler Rogers">Tyler Rogers</option> */}
                                                </select>

                                                <label className="block mt-6 text-xl mb-2 font-semibold">Drink of Choice:</label>
                                                <select 
                                                    value={drinkOfChoice} 
                                                    onChange={(e) => {
                                                        setDrinkOfChoice(e.target.value);
                                                        if (!e.target.value) setPhotoIdError("");
                                                    }} 
                                                    className={`p-2 w-full my-2 rounded bg-gray-800 text-white ${!isEditing && "opacity-30 cursor-not-allowed"}`}
                                                    disabled={!isEditing}
                                                >
                                                    <option value="" >No Drink Selected</option>
                                                    <option value="Whiskey">Wine</option>
                                                    <option value="Vodka">Beer</option>
                                                    <option value="Rum">House's Choice</option>
                                                </select>

                                                <div className="flex items-center justify-between mt-6 mb-4">
                                                    <label className="block text-xl font-semibold">Photo ID:</label>
                                                    {selectedPhotoName && (<p className={`px-2 py-1 text-xs text-white rounded-lg border  ${member.verifiedId ? ("border-green-500 bg-green-800/50") : ("border-red-500 bg-red-800/50")}`}>{member.verifiedId ? ("Verified Id") : ("Not Verified")}</p>)}
                                                </div>
                                                <label
                                                    htmlFor="fileUpload"
                                                    className={`p-2 w-full rounded-md flex items-center justify-center cursor-pointer transition-all ${
                                                        drinkOfChoice && isEditing 
                                                            ? "bg-white text-black hover:bg-gray-300" 
                                                            : "bg-gray-800 text-white opacity-30 cursor-not-allowed"
                                                    }`}
                                                >
                                                    {drinkOfChoice ? ("Upload") : ("Select a Drink")}
                                                </label>
                                                <input id="fileUpload" type="file" accept="image/*" capture="environment" onChange={handleFileUpload} className="hidden" disabled={!isEditing} />
                                                {selectedPhotoName ? (<p className="mt-2 text-sm text-gray-500">Selected: {selectedPhotoName}</p>) : (<p className="mt-2 ml-1 text-sm text-gray-700">No Photo ID has been uploaded.</p>)}
                                                {photoIdError && (
                                                    <p className="mt-2 text-sm text-red-500">{photoIdError}</p>
                                                )}
                                                {isEditing ? (
                                                    <div className="flex gap-2 mt-6">
                                                        <button
                                                            className={`px-4 py-2 rounded w-1/2 transition-all ${
                                                                Boolean(drinkOfChoice)
                                                                    ? "bg-white text-black cursor-pointer hover:bg-gray-300"
                                                                    : "bg-gray-800 text-gray-500 cursor-not-allowed"
                                                            }`}
                                                            onClick={handleSave}
                                                            disabled={!selectedPhotoName} 
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
                                                        className="mt-6 cursor-pointer bg-white text-black px-4 py-2 rounded w-full" 
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
                        </div>

                    </div>
                </div>
            </div>
            <Footer />
        </>
    );
};

const getMembershipColor = (tier: string | undefined) => {
    switch (tier) {
        case "Gold": return "text-orange-300";
        case "Silver": return "text-gray-400";
        case "Bronze": return "text-orange-800";
        default: return "text-green-500";
    }
};

export default Members;

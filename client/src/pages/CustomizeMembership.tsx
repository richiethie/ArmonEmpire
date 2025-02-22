import EmptyHeader from "@/components/EmptyHeader";
import { useEffect, useState } from "react";
import { haircuts } from "@/data/data";
import whiskey from "../assets/video/whiskey.mp4"
import { Checkbox } from "@/components/ui/checkbox";
import { barbers } from "@/data/data";
import axios from "axios";
import { User } from "@/types/User";
import { Appointment } from "@/types/Appointment";
import { useIsMobile } from "@/context/MobileContext";
import { useNavigate } from "react-router-dom";
import ArmonEmpireLogo from "../assets/img/ArmonEmpireLogo.png";

import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import CheckoutForm from "../components/CheckoutForm";

const stripePromise = loadStripe(`${import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY}`);

interface FormData {
  haircut: string;
  wantsDrink: boolean;
  dob: string;
  photoID: File | null;
  drinkOfChoice: string;
  preferredBarber: string;
  appointments: Appointment[];
}

// const iframe = document.querySelector("iframe");
// const iframeDocument = iframe?.contentWindow?.document;

const CustomizeMembership = () => {
    const [step, setStep] = useState<number>(1);
    const [member, setMember] = useState<User | null>(null);
    const [completedAppointments, setCompletedAppointments] = useState<number>(4);

    const isMobile = useIsMobile();
    const navigate = useNavigate();

    const [formData, setFormData] = useState<FormData>({
        haircut: "",
        wantsDrink: false,
        dob: "",
        photoID: null,
        drinkOfChoice: "",
        preferredBarber: "",
        appointments: []
    });

    const nextStep = () => setStep((prev) => prev + 1);
    const prevStep = () => setStep((prev) => prev - 1);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleCheckboxChange = () => {
        setFormData({ ...formData, wantsDrink: !formData.wantsDrink });
    };

    const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
        setFormData({ ...formData, photoID: e.target.files[0] });
        }
    };

    const isNextDisabled = formData.wantsDrink
            ? !formData.dob || (parseInt(formData.dob) < 21 && !formData.photoID) || !formData.drinkOfChoice
            : false; // If wantsDrink is false, next is always enabled

    const getAge = (dob: string): number => {
        if (!dob) return 0; // Handle empty case
        const birthDate = new Date(dob);
        const today = new Date();
        
        let age = today.getFullYear() - birthDate.getFullYear();
        const monthDiff = today.getMonth() - birthDate.getMonth();
        const dayDiff = today.getDate() - birthDate.getDate();
    
        // Adjust age if birthday hasn't occurred yet this year
        if (monthDiff < 0 || (monthDiff === 0 && dayDiff < 0)) {
            age--;
        }
    
        return age;
    };

    const priceMap = {
        Gold: 90.00,
        Silver: 62.50,
        Bronze: 45.00
    };

    const displayAmount = priceMap[member?.membership as keyof typeof priceMap] || 0;

    useEffect(() => {
        const script = document.createElement('script');
        script.src = "https://js.stripe.com/v3/";
        script.async = true;
        document.body.appendChild(script);
        
        return () => {
          document.body.removeChild(script);
        };
    }, []);

    useEffect(() => {
        const fetchMemberData = async () => {
            try {
                const token = localStorage.getItem("token"); // Retrieve token from local storage
                const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/user`, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
    
                const data = response.data;
    
                setMember({
                    _id: data._id || "",
                    firstName: data.firstName || "",
                    lastName: data.lastName || "",
                    email: data.email || "",
                    password: "", // Password should not be autofilled for security reasons
                    membership: data.membership || "Free",
                    preferredBarber: data.preferredBarber || "",
                    drinkOfChoice: data.drinkOfChoice || "",
                    isOfLegalDrinkingAge: data.isOfLegalDrinkingAge || false,
                    appointments: data.appointments || [],
                    phoneNumber: data.phoneNumber || "",
                    dob: data.dob || "",
                    photoId: data.photoId
                      ? {
                          data: data.photoId.data || "",
                          contentType: data.photoId.contentType || "",
                          fileName: data.photoId.fileName || "",
                        }
                      : null, // Ensure the object structure is correct
                    wantsDrink: data.wantsDrink || false,
                    verifiedId: data.verifiedId || false, // Ensure all required fields are included
                    isAdmin: data.isAdmin || false,
                    createdAt: data.createdAt || new Date().toISOString(),
                    updatedAt: data.updatedAt || new Date().toISOString(),
                  });
            } catch (error) {
                console.error("Error fetching member data:", error);
            }
        };
    
        fetchMemberData();
    }, []);

    const requiredAppointments = member?.membership === "Gold" ? 4 : member?.membership === "Silver" ? 3 : 2;

    useEffect(() => {
        const eventSource = new EventSource(`${import.meta.env.VITE_API_URL}/api/appointments/updates`);
    
        eventSource.onmessage = (event) => {
            const data = JSON.parse(event.data);
            console.log("Appointment update:", data.appointment);
    
            // Destructure status and appointment data

            console.log("Status: ", data.appointment.status);
            console.log("appointment: ", data.appointment);
    
            // Ensure the appointment contains acuityAppointmentId
            if (!data.appointment.acuityAppointmentId) {
                console.error("Appointment missing acuityAppointmentId:", data.appointment);
                return;
            }
    
            // Update the appointments array within formData
            setFormData((prevFormData) => {
                // Correctly type the updatedAppointments array
                let updatedAppointments: Appointment[] = [...prevFormData.appointments];
    
                // Handle appointment statuss (scheduled, rescheduled, canceled)
                if (data.appointment.status === "Scheduled" || data.appointment.status === "Rescheduled") {
                    // Ensure to filter out existing appointments with the same acuityAppointmentId
                    updatedAppointments = updatedAppointments.filter((appt) => appt.acuityAppointmentId !== data.appointment.acuityAppointmentId);
                    updatedAppointments.push(data.appointment); // Add the new or rescheduled appointment
                }
    
                // If it's canceled, remove the canceled appointment from the array
                if (data.appointment.status === "Canceled") {
                    updatedAppointments = updatedAppointments.filter((appt) => appt.acuityAppointmentId !== data.appointment.acuityAppointmentId);
                }
    
                return {
                    ...prevFormData,
                    appointments: updatedAppointments,
                };
            });
    
            // Update completedAppointments state based on the status type
            setCompletedAppointments((prevCompleted) => {
                if (data.appointment.status === "Scheduled") {
                    return prevCompleted + 1; // Increment for new appointment
                } else if (data.appointment.status === "Canceled") {
                    return prevCompleted - 1; // Decrement for canceled appointment
                } else {
                    return prevCompleted; // No change for rescheduled
                }
            });
        };
    
        return () => {
            eventSource.close(); // Clean up when the component is unmounted
        };
    }, []);

    useEffect(() => {
        console.log("Updated Completed Appointments: ", completedAppointments);
    }, [completedAppointments]); // Runs when completedAppointments changes
    
    
    //POTENTIAL COME BACK TO, REQUIRES ACUITY API ACCESS
    // useEffect(() => {
    //     if (member) {
    //         console.log(member)
    //         window.onload = function () {
                
    //             if (iframe) {
                    
    //                 console.log("FIRED1")

    //                 if (iframeDocument) {
    //                     // Get form fields inside iframe by id
    //                     const firstNameField = iframeDocument.getElementById('client[firstName]') as HTMLInputElement;
    //                     const lastNameField = iframeDocument.getElementById('client[lastName]') as HTMLInputElement;
    //                     const emailField = iframeDocument.getElementById('client[email]') as HTMLInputElement;

    //                     // Set the values if fields are found
    //                     if (firstNameField && member.firstName) {
    //                         firstNameField.value = member.firstName;
    //                         console.log("FIRED")
    //                     }
    //                     if (lastNameField && member.lastName) {
    //                         lastNameField.value = member.lastName;
    //                     }
    //                     if (emailField && member.email) {
    //                         emailField.value = member.email;
    //                     }
    //                 }
    //             }
    //         };
    //     }
    // }, [iframeDocument]);

  return (
    <>
        <EmptyHeader />
        <div className="p-6 mx-auto mt-25">
            {/* HAIRCUT */}
            {step === 1 && (
                <div className={`px-4 ${isMobile ? "w-full" : "mx-[12rem]"}`}>
                    <h1 className="text-4xl md:text-6xl text-center mb-4 md:mb-6">Choose your haircut</h1>
                    <h2 className="text-md md:text-xl font-bold text-center mb-4 md:mb-6">
                        Select your haircut from the following options, or select "Other"
                    </h2>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        {haircuts.map((cut) => (
                            <div
                                key={cut.id}
                                className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                                    formData.haircut === cut.id
                                        ? "border-orange-300 shadow-lg shadow-orange-300/50"
                                        : "border-gray-500"
                                }`}
                                onClick={() => setFormData({ ...formData, haircut: cut.id })}
                            >
                                <img
                                    src={cut.image}
                                    alt={cut.name}
                                    className="w-full h-60 md:h-[35rem] object-cover rounded-md"
                                />
                                <h3 className="text-center md:text-lg font-semibold mt-2">{cut.name}</h3>
                                <button
                                    className={`mt-2 w-full py-2 cursor-pointer rounded text-white ${
                                        formData.haircut === cut.id ? "bg-orange-300" : "bg-gray-700 hover:bg-orange-400"
                                    }`}
                                >
                                    {formData.haircut === cut.id ? "Selected" : "Select"}
                                </button>
                            </div>
                        ))}

                        {/* "Other" Option */}
                        <div
                            className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                                formData.haircut === "Other"
                                    ? "border-orange-300 shadow-lg shadow-orange-300/50"
                                    : "border-gray-500"
                            }`}
                            onClick={() => setFormData({ ...formData, haircut: "Other" })}
                        >
                            <h3 className="text-base md:text-lg font-semibold text-center">Other</h3>
                            <button
                                className={`mt-2 w-full py-2 rounded text-white ${
                                    formData.haircut === "Other" ? "bg-orange-300" : "bg-gray-700 hover:bg-orange-400"
                                }`}
                            >
                                {formData.haircut === "Other" ? "Selected" : "Select"}
                            </button>
                        </div>
                    </div>

                    <div className="flex justify-between mt-6">
                        <button
                            onClick={() => navigate('/select-membership')}
                            className="py-2 px-6 md:px-8 rounded text-white text-lg md:text-xl font-bold bg-gray-500 hover:bg-gray-600 transition-all"
                        >
                            Back
                        </button>
                        <button
                            onClick={nextStep}
                            disabled={!formData.haircut || (formData.haircut === "Other" && !formData.haircut.trim())}
                            className={`py-2 px-6 md:px-8 rounded text-white text-lg md:text-xl font-bold transition-all ${
                                formData.haircut && (formData.haircut !== "Other" || formData.haircut.trim())
                                    ? "bg-orange-300 cursor-pointer hover:bg-orange-500"
                                    : "bg-gray-500 cursor-not-allowed"
                            }`}
                        >
                            Next
                        </button>
                    </div>
                </div>
            )}

            {step === 2 && (
                <div className={`flex flex-col items-center px-4 ${isMobile ? ("") : ("py-8")}`}>
                    <h1 className="text-4xl md:text-6xl text-center mb-4 md:mb-6">Complimentary Drink</h1>

                    {isMobile ? (
                        // Mobile View
                        <div className="flex flex-col items-center w-full max-w-xl mx-auto mb-[5rem]">
                            {/* Video Section */}
                            <div className="w-full h-[35rem]">
                                <video 
                                    src={whiskey} 
                                    autoPlay 
                                    muted 
                                    loop 
                                    playsInline 
                                    controls={false}
                                    className="relative w-full h-full object-cover rounded-lg" 
                                />
                            </div>
                            {/* Form Section with Transparent Background */}
                            <div className="absolute bg-gray-600/20 p-6 h-[30rem] mt-6 w-[70%] rounded-lg z-10">
                                <label className="text-md font-semibold">Would you like a complimentary drink?</label>
                                <div className="flex items-center space-x-4 mt-2">
                                    <label className="flex items-center space-x-2">
                                        <Checkbox
                                            className="cursor-pointer"
                                            colorPalette="blue"
                                            name="wantsDrink"
                                            checked={formData.wantsDrink === true}
                                            onCheckedChange={handleCheckboxChange}
                                            size="lg"
                                        >
                                            Yes
                                        </Checkbox>
                                    </label>
                                    <label className="flex items-center space-x-2">
                                        <Checkbox
                                            className="cursor-pointer"
                                            colorPalette="blue"
                                            name="wantsDrink"
                                            checked={formData.wantsDrink === false}
                                            onCheckedChange={handleCheckboxChange}
                                            size="lg"
                                        >
                                            No
                                        </Checkbox>
                                    </label>
                                </div>

                                {/* Date of Birth */}
                                <div className="mt-4 space-y-4">
                                    <div>
                                        <label className={`block text-md mb-2 font-semibold ${!formData.wantsDrink ? "text-gray-400" : ""}`}>
                                            Select your Date of Birth:
                                        </label>
                                        <input
                                            type="date"
                                            name="dob"
                                            value={formData.dob}
                                            onChange={handleChange}
                                            className={`border p-3 w-full rounded-md ${!formData.wantsDrink ? "text-gray-400 border-gray-400" : ""}`}
                                            disabled={!formData.wantsDrink}
                                        />
                                    </div>

                                    {/* If age >= 21, show additional options */}
                                    {getAge(formData.dob) >= 21 && (
                                        <div className="space-y-4">
                                            {/* Upload ID */}
                                            <div>
                                                <label className={`block text-md mb-2 font-semibold ${!formData.wantsDrink ? "text-gray-400" : ""}`}>
                                                    Upload Photo ID:
                                                </label>
                                                <label
                                                    htmlFor="fileUpload"
                                                    className={`p-3 w-full rounded-md flex items-center justify-center cursor-pointer transition-all ${
                                                        !formData.wantsDrink
                                                            ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                                                            : "bg-orange-300 text-white hover:bg-orange-400"
                                                    }`}
                                                >
                                                    Upload
                                                </label>
                                                <input id="fileUpload" type="file" accept="image/*" capture="environment" onChange={handleFileUpload} className="hidden" disabled={!formData.wantsDrink} />
                                                <p className="mt-2 text-sm text-gray-700">
                                                    Selected:{" "}
                                                    {formData.photoID
                                                    ? formData.photoID.name
                                                    : member?.photoId?.fileName || "No Photo ID has been uploaded."}
                                                </p>
                                            </div>

                                            {/* Choose Drink */}
                                            <div>
                                                <label className={`block text-md mb-2 font-semibold ${!formData.wantsDrink ? "text-gray-400" : ""}`}>
                                                    Choose your drink:
                                                </label>
                                                <select
                                                    name="drinkOfChoice"
                                                    value={formData.drinkOfChoice}
                                                    onChange={handleChange}
                                                    className={`border p-3 w-full rounded-md ${!formData.wantsDrink ? "text-gray-400 border-gray-400" : ""}`}
                                                    disabled={!formData.wantsDrink}
                                                >
                                                    <option className="text-black" value="">Select a drink</option>
                                                    <option className="text-black" value="Water">Water</option>
                                                    <option className="text-black" value="Whiskey">Whiskey</option>
                                                    <option className="text-black" value="Vodka">Vodka</option>
                                                    <option className="text-black" value="Rum">Rum</option>
                                                    <option className="text-black" value="Gin">Gin</option>
                                                    <option className="text-black" value="Tequila">Tequila</option>
                                                    <option className="text-black" value="Scotch">Scotch</option>
                                                    <option className="text-black" value="Bourbon">Bourbon</option>
                                                    <option className="text-black" value="Brandy">Brandy</option>
                                                    <option className="text-black" value="Cognac">Cognac</option>
                                                    <option className="text-black" value="Red Wine">Red Wine</option>
                                                    <option className="text-black" value="White Wine">White Wine</option>
                                                    <option className="text-black" value="Champagne">Champagne</option>
                                                </select>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>

                        </div>
                    ) : (
                        
                        <div
                            className={`flex ${isMobile ? "flex-col" : "flex-row"} text-black bg-gray-200 rounded-lg w-full max-w-6xl mx-auto`}
                            style={{ boxShadow: '0 0 25px rgba(255, 255, 255, 0.5)' }}
                        >
                            {/* Form Section */}
                            <div className={`p-6 md:p-8 w-full ${isMobile ? "rounded-t-lg" : "rounded-l-lg md:w-1/2"}`}>
                                <label className="text-lg font-semibold">Would you like a complimentary drink?</label>
                                <div className="flex items-center space-x-4 md:space-x-6 mt-2">
                                    <label className="flex items-center space-x-2">
                                        <Checkbox
                                            className="cursor-pointer"
                                            colorPalette="blue"
                                            name="wantsDrink"
                                            checked={formData.wantsDrink === true}
                                            onCheckedChange={handleCheckboxChange}
                                            size="lg"
                                        >
                                            Yes
                                        </Checkbox>
                                    </label>
                                    <label className="flex items-center space-x-2">
                                        <Checkbox
                                            className="cursor-pointer"
                                            colorPalette="blue"
                                            name="wantsDrink"
                                            checked={formData.wantsDrink === false}
                                            onCheckedChange={handleCheckboxChange}
                                            size="lg"
                                        >
                                            No
                                        </Checkbox>
                                    </label>
                                </div>

                                {/* Date of Birth */}
                                <div className="mt-4 space-y-4">
                                    <div>
                                        <label className={`block text-lg mb-2 font-semibold ${!formData.wantsDrink ? "text-gray-400" : ""}`}>
                                            Select your Date of Birth:
                                        </label>
                                        <input
                                            type="date"
                                            name="dob"
                                            value={formData.dob}
                                            onChange={handleChange}
                                            className={`border p-3 w-full rounded-md ${!formData.wantsDrink ? "text-gray-400 border-gray-400" : ""}`}
                                            disabled={!formData.wantsDrink}
                                        />
                                    </div>

                                    {/* If age >= 21, show additional options */}
                                    {getAge(formData.dob) >= 21 && (
                                        <div className="space-y-4">
                                            {/* Upload ID */}
                                            <div>
                                                <label className={`block text-md mb-2 font-semibold ${!formData.wantsDrink ? "text-gray-400" : ""}`}>
                                                    Upload Photo ID:
                                                </label>

                                                <label
                                                    htmlFor="fileUpload"
                                                    className={`p-3 w-full rounded-md flex items-center justify-center cursor-pointer transition-all ${
                                                        !formData.wantsDrink
                                                            ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                                                            : "bg-orange-300 text-white hover:bg-orange-400"
                                                    }`}
                                                >
                                                    Choose File
                                                </label>

                                                <input
                                                    id="fileUpload"
                                                    type="file"
                                                    onChange={handleFileUpload}
                                                    className="hidden"
                                                    disabled={!formData.wantsDrink}
                                                />

                                                {formData.photoID && (
                                                    <p className="mt-2 text-sm text-gray-700">Selected: {formData.photoID.name}</p>
                                                )}
                                            </div>

                                            {/* Choose Drink */}
                                            <div>
                                                <label className={`block text-md mb-2 font-semibold ${!formData.wantsDrink ? "text-gray-400" : ""}`}>
                                                    Choose your drink:
                                                </label>
                                                <select
                                                    name="drinkOfChoice"
                                                    value={formData.drinkOfChoice}
                                                    onChange={handleChange}
                                                    className={`border p-3 w-full rounded-md ${!formData.wantsDrink ? "text-gray-400 border-gray-400" : ""}`}
                                                    disabled={!formData.wantsDrink}
                                                >
                                                    <option value="">Select a drink</option>
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
                                                </select>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Video Section */}
                            <div className={`w-full ${isMobile ? "rounded-b-lg" : "md:w-1/2"} h-64 md:h-full`}>
                                <video
                                    src={whiskey}
                                    autoPlay
                                    muted
                                    loop
                                    className="w-full h-full object-cover rounded-b-lg md:rounded-r-lg"
                                />
                            </div>
                        </div>
                    )}

                    {/* Navigation Buttons */}
                    <div className={`absolute ${isMobile ? ("bottom-5 left-2 right-2 text-sm") : ("bottom-20 left-20 right-20 text-xl")} flex justify-between p-4 font-bold mx-auto`}>
                        <button
                            onClick={prevStep}
                            className="bg-gray-400 text-white px-8 py-3 rounded-lg cursor-pointer transition-all hover:bg-gray-500"
                        >
                            Back
                        </button>

                        <button
                        onClick={nextStep}
                        className={`px-8 py-3 rounded-lg transition-all font-bold ${
                            isNextDisabled
                            ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                            : "bg-orange-300 text-white hover:bg-orange-400 cursor-pointer"
                        }`}
                        disabled={isNextDisabled}
                        >
                        Next
                        </button>
                    </div>
                </div>
            )}

            {step === 3 && (
                <div className="flex flex-col items-center">
                    <h1 className={`${ isMobile ? ("text-5xl") : ("text-6xl")} mb-6`}>Choose Your Barber</h1>
                    
                    <div className={`grid grid-cols-1 md:grid-cols-3 gap-6 w-full h-full ${isMobile ? ("mb-24") : ("")}`}>
                        {barbers.map((barber) => (
                            <div
                                key={barber.id}
                                onClick={() => setFormData({ ...formData, preferredBarber: barber.name })}
                                style={{ boxShadow: '0 0 15px rgba(255, 255, 255, 0.5)' }}
                                className={`relative border-2 rounded-lg overflow-hidden cursor-pointer transition-all flex flex-col items-center ${ isMobile ? ("h-[19rem]") : ("h-[40rem]")} ${
                                    formData.preferredBarber === barber.name ? "border-orange-300" : ""
                                }`}
                            >
                                {/* Checkbox in top-right */}
                                <div className="absolute top-2 right-2">
                                    <Checkbox 
                                        checked={formData.preferredBarber === barber.name} 
                                        onCheckedChange={() => setFormData({ ...formData, preferredBarber: barber.name })} 
                                        colorScheme="orange"
                                    />
                                </div>

                                {/* Barber Image */}
                                <img src={barber.image} alt={barber.name} className={`w-[90%] mt-10 rounded-lg ${ isMobile ? ("h-[12rem]") : ("h-[30rem]")} object-cover`} />

                                {/* Barber Name */}
                                <div className={`p-4 ${ isMobile ? ("") : ("mt-4")} text-center text-3xl font-bold`}>{barber.name}</div>
                            </div>
                        ))}
                    </div>

                    <div className={`absolute ${isMobile ? ("bottom-5 left-2 right-2 text-sm") : ("bottom-20 left-20 right-20 text-xl")} flex justify-between p-4 font-bold mx-auto`}>
                        <button
                            onClick={prevStep}
                            className="bg-gray-400 cursor-pointer text-white px-8 py-3 rounded-lg transition-all hover:bg-gray-500"
                        >
                            Back
                        </button>

                        <button
                            onClick={nextStep}
                            className={`px-8 py-3 rounded-lg transition-all font-bold ${
                                !formData.preferredBarber
                                    ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                                    : "bg-orange-300 text-white hover:bg-orange-400 cursor-pointer"
                            }`}
                            disabled={!formData.preferredBarber} // Disable if no barber is selected
                        >
                            Next
                        </button>
                    </div>
                </div>
            )}

            {step === 4 && (
                <div className="flex flex-col items-center">
                    <h1 className={`${isMobile ? ("text-5xl") : ("text-6xl")}`}>Book Appointments</h1>
                    <p className={`mb-4 ${isMobile ? ("text-center") : ("")}`}>To begin your membership, you are required to book the next 2 months in advance.</p>
                    <div
                        className={`flex w-full justify-center space-x-6 max-w-[100rem] ${
                            isMobile ? "flex-col space-x-0 space-y-6 mb-16" : "flex-row-reverse"
                        }`}
                    >
                        <div className="bg-white rounded-lg text-black p-6 flex flex-col justify-between w-full">
                            <div>
                                <div className="flex justify-between items-center px-2 mb-4">
                                    <h3 className="font-bold text-lg">Membership Tier</h3>
                                    <span className="text-orange-300 font-bold text-lg">{member?.membership}</span>
                                </div>
                                <p className={`${isMobile ? ("text-center") : ("text-center")} mb-2`}>
                                    Your {member?.membership} Membership includes a haircut every {member?.membership === "Gold" ? "2" : member?.membership === "Silver" ? "3" : "4"} weeks.
                                </p>
                                <p className={`${isMobile ? ("text-center") : ("text-center")} mb-4`}>
                                    Please schedule {member?.membership === "Gold" ? "4" : member?.membership === "Silver" ? "3" : "2"} appointments to complete your membership.
                                </p>
                            </div>

                            <div className={`flex flex-col items-center space-y-4 ${isMobile ? ("my-10") : ("")}`}>
                                {/* Appointment Progress Indicator */}
                                <p className="font-bold">Appointments created</p>
                                <div className="flex justify-center items-center gap-4">
                                    {Array.from({ length: requiredAppointments }).map((_, index) => (
                                        <div
                                            key={index}
                                            className={`w-4 h-4 rounded-full transition-all ${index < completedAppointments ? "bg-orange-300" : "bg-gray-300"}`}
                                        ></div>
                                    ))}
                                </div>
                            </div>
                            <div>
                                <p className={`text-gray-600 text-center ${isMobile ? ("text-xs mt-4") : ("")}`}>Please Note: The email and phone number used in the booking form must match the info used to register your membership (shown below) or appointments will not be valid.</p>
                                <div className={`flex justify-center space-x-6 mt-2 ${isMobile ? ("flex-col items-center space-y-2") : ("")}`}>
                                    <p className={`${isMobile ? ("text-xs") : ("")} text-gray-600`}>Email: {member?.email}</p>
                                    <p className={`${isMobile ? ("text-xs") : ("")} text-gray-600`}>Phone Number: {member?.phoneNumber}</p>
                                </div>
                                <p className="text-gray-600 text-xs text-center mt-2">The +1 phone number prefix can remain in the form. You do not need to remove it.</p>
                            </div>
                        </div>
                        {/* Acuity Scheduling Embedded Calendar */}
                        <iframe 
                            src="https://app.acuityscheduling.com/schedule.php?owner=26056634&calendarID=11548211&ref=embedded_csp" 
                            title="Schedule Appointment" 
                            width="100%" 
                            height="1000" 
                            frameBorder="0"
                            className="rounded-lg"
                        ></iframe>
                        <script 
                            src="https://embed.acuityscheduling.com/js/embed.js" 
                            type="text/javascript"
                        ></script>

                    </div>
                    <div className={`absolute ${isMobile ? ("bottom-5 left-2 right-2 text-sm") : ("bottom-20 left-20 right-20 text-xl")} flex justify-between p-4 font-bold mx-auto`}>
                        <button
                            onClick={prevStep}
                            className="bg-gray-400 cursor-pointer text-white px-8 py-3 rounded-lg transition-all hover:bg-gray-500"
                        >
                            Back
                        </button>

                        <button
                            onClick={nextStep}
                            className={`px-8 py-3 rounded-lg transition-all font-bold ${
                                !formData.preferredBarber || completedAppointments < requiredAppointments
                                    ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                                    : "bg-orange-300 text-white hover:bg-orange-400 cursor-pointer"
                            }`}
                            disabled={!formData.preferredBarber || completedAppointments < requiredAppointments} // Disable if no barber is selected or if not enough appointments are booked
                        >
                            Next
                        </button>
                    </div>
                </div>
            )}

            {step === 5 && (
                <div className="flex flex-col items-center text-black">
                    <h1 className="text-4xl md:text-6xl text-white">Review your selections</h1>
                    <div className={`flex ${isMobile ? "flex-col" : "flex-row space-x-6"} `}>
                        {/* Your Information Card */}
                        <div className="bg-white shadow-lg rounded-lg p-6 mt-6 w-full md:w-2xl space-y-4 max-w-xl">
                            <h2 className="text-xl md:text-2xl font-bold mb-6 text-center">Your Information</h2>
                            <p><strong>First Name:</strong> {member?.firstName}</p>
                            <p><strong>Last Name:</strong> {member?.lastName}</p>
                            <p><strong>Email:</strong> {member?.email}</p>
                            <p><strong>Phone Number:</strong> {member?.phoneNumber || "Not provided"}</p>
                        </div>

                        {/* Booking Details Card */}
                        <div className="bg-white shadow-lg rounded-lg p-6 mt-6 w-full md:w-2xl space-y-4 text-nowrap">
                            <h2 className="text-xl md:text-2xl font-bold mb-6 text-center">Membership Details</h2>
                            <p><strong>Haircut:</strong> {formData.haircut.charAt(0).toUpperCase() + formData.haircut.slice(1)}</p>
                            <p><strong>Drink:</strong> {formData.wantsDrink ? formData.drinkOfChoice : "No drink selected"}</p>
                            <p><strong>Barber:</strong> {formData.preferredBarber}</p>
                            <p><strong>Membership Type:</strong> {member?.membership || "Not selected"}</p>
                            <p><strong>Appointments Booked:</strong> {formData.appointments.length > 0 ? formData.appointments.join(", ") : "Not booked"}</p>
                        </div>
                    </div>

                    {/* Navigation Buttons */}
                    <div className={`absolute ${isMobile ? ("bottom-5 left-2 right-2 text-sm") : ("bottom-20 left-20 right-20 text-xl")} flex justify-between p-4 font-bold mx-auto`}>
                        <button
                            onClick={prevStep}
                            className="bg-gray-400 cursor-pointer text-white px-8 py-3 rounded-lg transition-all hover:bg-gray-500"
                        >
                            Back
                        </button>

                        <button
                            onClick={nextStep}
                            className={`px-8 py-3 rounded-lg transition-all font-bold ${
                                !formData.preferredBarber
                                    ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                                    : "bg-orange-300 text-white hover:bg-orange-400 cursor-pointer"
                            }`}
                            disabled={!formData.preferredBarber} // Disable if no barber is selected
                        >
                            Proceed to payment
                        </button>
                    </div>
                </div>
            )}

            {step === 6 && (
                <div className="flex flex-col items-center justify-center">
                    <h1 className="text-6xl">Checkout</h1>
                    <p>Set up your monthly membership payment.</p>

                    {/* CHECKOUT */}
                    <div className={`flex ${isMobile ? "flex-col mb-15" : "flex-row space-x-4"} `}>
                        <div className={`flex flex-col justify-between ${isMobile ? "w-[full]" : "w-[30rem]"} bg-white text-black p-6 rounded-lg my-4`}>
                            <div className="flex flex-col space-y-2">
                                <div className="flex justify-center items-center mb-4">
                                    <img src={ArmonEmpireLogo} alt="Armon Empire Logo" className={`${isMobile ? ("h-25") : ("h-30")}`} />
                                </div>
                                <div className="flex items-center justify-between">
                                    <h2 className="font-semibold">Membership</h2>
                                    <p className="text-orange-300 font-bold">{member?.membership}</p>
                                </div>
                                <div className="flex items-center justify-between">
                                    <h2 className="font-semibold">Price</h2>
                                    <p>
                                        {member?.membership === "Gold"
                                            ? "$90/mo"
                                            : member?.membership === "Silver"
                                            ? "$62.50/mo"
                                            : member?.membership === "Bronze"
                                            ? "$45/mo"
                                            : "N/A"}
                                    </p>
                                </div>
                                <h2 className="font-semibold ">Benefits</h2>
                                <div className="flex flex-col space-y-2 my-2">    
                                    <p>
                                        • Haircut every{" "}
                                        {member?.membership === "Gold"
                                            ? "2 weeks"
                                            : member?.membership === "Silver"
                                            ? "3 weeks"
                                            : member?.membership === "Bronze"
                                            ? "4 weeks"
                                            : "N/A"}
                                    </p>
                                    <p>• Complimentary drinks provided</p>
                                    <p>• Savings on specialty services</p>
                                    <p>• No overtime fees on late bookings</p>
                                    <p>• No fees for last-minute bookings</p>
                                </div>
                            </div>
                            <div>
                                <div className="flex justify-between border-t-2 pt-4 mt-4">
                                    <h2 className="text-lg font-bold">Total due today:</h2>
                                    <p className="text-xl font-bold">${displayAmount.toFixed(2)}</p>
                                </div>
                                <p className="text-gray-500 text-xs mt-3 text-center">Memberships are charged to the card saved as a monthly recurring bill.</p>
                            </div>
                        </div>
                        <div className="flex bg-white text-black p-6 rounded-lg my-4">
                            
                            <Elements stripe={stripePromise}>
                                <CheckoutForm member={member} />
                            </Elements>
                        </div>
                    </div>

                    {/* Navigation Buttons */}
                    <div className={`absolute ${isMobile ? ("bottom-5 left-2 right-2 text-sm") : ("bottom-20 left-20 right-20 text-xl")} flex justify-between p-4 font-bold mx-auto`}>
                        <button
                            onClick={prevStep}
                            className="bg-gray-400 cursor-pointer text-white px-8 py-3 rounded-lg transition-all hover:bg-gray-500"
                        >
                            Back
                        </button>
                    </div>
                </div>
            )}
        </div>
    </>
  );
};

export default CustomizeMembership;

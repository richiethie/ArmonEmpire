import EmptyHeader from "@/components/EmptyHeader";
import { useEffect, useState } from "react";
import { haircuts, barbers } from "@/data/data";
import whiskey from "../assets/video/whiskey.mp4";
import { Checkbox } from "@/components/ui/checkbox";
import axios from "axios";
import { User } from "@/types/User";
import { Appointment } from "@/types/Appointment";
import { useIsMobile } from "@/context/MobileContext";
import { useNavigate } from "react-router-dom";
import ArmonEmpireLogo from "../assets/img/ArmonEmpireLogo.png";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import CheckoutForm from "../components/CheckoutForm";
import { barberCalendars } from "@/helpers";

const stripePromise = loadStripe(`${import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY}`);

interface FormData {
  wantsDrink: boolean;
  dob: string;
  photoID: File | null;
  drinkOfChoice: string;
  preferredBarber: string;
  appointments: Appointment[];
}

const CustomizeMembership = () => {
  const [step, setStep] = useState<number>(1);
  const [member, setMember] = useState<User | null>(null);
  const [completedAppointments, setCompletedAppointments] = useState<number>(0);
  const isMobile = useIsMobile();
  const navigate = useNavigate();

  const [formData, setFormData] = useState<FormData>({
    wantsDrink: false,
    dob: "",
    photoID: null,
    drinkOfChoice: "",
    preferredBarber: "",
    appointments: [],
  });

  const matchedBarberData = barberCalendars.find(
    (barber) => barber.name === formData?.preferredBarber && barber.type === "guest"
  );

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

  const getAge = (dob: string): number => {
    if (!dob) return 0;
    const birthDate = new Date(dob);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    const dayDiff = today.getDate() - birthDate.getDate();
    if (monthDiff < 0 || (monthDiff === 0 && dayDiff < 0)) {
      age--;
    }
    return age;
  };

  const isNextDisabled = formData.wantsDrink
    ? !formData.dob || (getAge(formData.dob) < 21 && !formData.photoID) || !formData.drinkOfChoice
    : false;

  const priceMap = {
    Gold: 100.0,
    Silver: 75.0,
    Bronze: 50.0,
  };

  const displayAmount = priceMap[member?.membership as keyof typeof priceMap] || 0;

  const requiredAppointments = member?.membership === "Gold" ? 4 : member?.membership === "Silver" ? 3 : 2;

  const normalizePhoneNumber = (phone: string | undefined): string => {
    if (!phone) return "";
    let normalized = phone.replace(/[^\d+]/g, "");
    if (!normalized.startsWith("+")) {
      normalized = `+1${normalized}`;
    }
    return normalized;
  };

  const saveUserData = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        alert("Please log in to save your preferences.");
        return;
      }
  
      // 1) Build FormData with the exact keys your route expects
      const formDataToSend = new FormData();
      formDataToSend.append("preferredBarber", formData.preferredBarber);
      formDataToSend.append("drinkOfChoice", formData.drinkOfChoice);
  
      // 2) Multer is configured as single('photoID'), so:
      if (formData.photoID) {
        formDataToSend.append("photoID", formData.photoID);           // the file itself
        formDataToSend.append("photoIDName", formData.photoID.name);  // the filename string
      }
  
      // 3) Don’t manually set Content-Type—let the browser include the multipart boundary
      const response = await axios.put(
        `${import.meta.env.VITE_API_URL}/api/user/update`,
        formDataToSend,
        {
          headers: {
            Authorization: `Bearer ${token}`
          },
        }
      );
  
      console.log("User data saved:", response.data);
      setMember(response.data.user); // your route returns { message, user }
    } catch (error) {
      console.error("Error saving user data:", error);
      alert("Failed to save your preferences. Please try again.");
    }
  };

  useEffect(() => {
    const script = document.createElement("script");
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
        const token = localStorage.getItem("token");
        const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/user`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const data = response.data;
        setMember({
          _id: data._id || "",
          firstName: data.firstName || "",
          lastName: data.lastName || "",
          email: data.email || "",
          password: "",
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
            : null,
          wantsDrink: data.wantsDrink || false,
          verifiedId: data.verifiedId || false,
          isAdmin: data.isAdmin || false,
          createdAt: data.createdAt || new Date().toISOString(),
          updatedAt: data.updatedAt || new Date().toISOString(),
          stripeCustomerId: data.stripeCustomerId || "",
          subscriptionId: data.subscriptionId || "",
          paymentStatus: data.paymentStatus || "active",
        });
      } catch (error) {
        console.error("Error fetching member data:", error);
      }
    };
    fetchMemberData();
  }, []);

  useEffect(() => {
    // only fire when we land on step 4
    if (step !== 4) return;
  
    const autoSave = async () => {
      try {
        await saveUserData();
        console.log("Auto‐saved user data on step 4");
      } catch (err) {
        console.error("Auto‐save failed on step 4:", err);
      }
    };
  
    autoSave();
  }, [step]);

  useEffect(() => {
    const eventSource = new EventSource(`${import.meta.env.VITE_API_URL}/api/appointments/updates`);
    eventSource.onmessage = (event) => {
      const data = JSON.parse(event.data);
      console.log("Appointment update:", data.appointment);
      if (!data.appointment.acuityAppointmentId) {
        console.error("Appointment missing acuityAppointmentId:", data.appointment);
        return;
      }
      setFormData((prevFormData) => {
        let updatedAppointments: Appointment[] = [...prevFormData.appointments];
        if (data.appointment.status === "Scheduled" || data.appointment.status === "Rescheduled") {
          updatedAppointments = updatedAppointments.filter(
            (appt) => appt.acuityAppointmentId !== data.appointment.acuityAppointmentId
          );
          updatedAppointments.push(data.appointment);
        }
        if (data.appointment.status === "Canceled") {
          updatedAppointments = updatedAppointments.filter(
            (appt) => appt.acuityAppointmentId !== data.appointment.acuityAppointmentId
          );
        }
        return {
          ...prevFormData,
          appointments: updatedAppointments,
        };
      });
      setCompletedAppointments((prevCompleted) => {
        if (data.appointment.status === "Scheduled") {
          return prevCompleted + 1;
        } else if (data.appointment.status === "Canceled") {
          return prevCompleted - 1;
        }
        return prevCompleted;
      });
    };
    return () => {
      eventSource.close();
    };
  }, []);

  return (
    <>
      <EmptyHeader />
      <main className="min-h-screen bg-black text-white pt-20 md:pt-28 pb-20">
        {/* Step 1: Haircut Selection */}
        {/* {step === 1 && (
          <section className="px-4 py-8 max-w-7xl mx-auto">
            <h1 className="text-4xl md:text-5xl text-center mb-4">Choose Your Haircut</h1>
            <p className="text-base md:text-lg text-center mb-6 text-gray-300">
              Select your haircut from the options below or choose "Other"
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {haircuts.map((cut) => (
                <article
                  key={cut.id}
                  className={`p-4 rounded-lg border-2 cursor-pointer transition-all duration-300 hover:shadow-lg ${
                    formData.haircut === cut.id
                      ? "border-orange-300 shadow-orange-300/50"
                      : "border-gray-600"
                  }`}
                  onClick={() => setFormData({ ...formData, haircut: cut.id })}
                >
                  <img
                    src={cut.image}
                    alt={cut.name}
                    className="w-full h-48 md:h-64 object-cover rounded-md mb-2"
                  />
                  <h3 className="text-lg md:text-xl font-semibold text-center">{cut.name}</h3>
                  <button
                    className={`mt-2 w-full py-2 rounded-md text-white font-medium ${
                      formData.haircut === cut.id
                        ? "bg-orange-300"
                        : "bg-gray-700 hover:bg-orange-500 transition-colors"
                    }`}
                    aria-label={`Select ${cut.name}`}
                  >
                    {formData.haircut === cut.id ? "Selected" : "Select"}
                  </button>
                </article>
              ))}
              <article
                className={`p-4 rounded-lg border-2 cursor-pointer transition-all duration-300 hover:shadow-lg ${
                  formData.haircut === "Other"
                    ? "border-orange-300 shadow-orange-300/50"
                    : "border-gray-600"
                }`}
                onClick={() => setFormData({ ...formData, haircut: "Other" })}
              >
                <h3 className="text-lg md:text-xl font-semibold text-center">Other</h3>
                <button
                  className={`mt-2 w-full py-2 rounded-md text-white font-medium ${
                    formData.haircut === "Other"
                      ? "bg-orange-300"
                      : "bg-gray-700 hover:bg-orange-500 transition-colors"
                  }`}
                  aria-label="Select Other haircut"
                >
                  {formData.haircut === "Other" ? "Selected" : "Select"}
                </button>
              </article>
            </div>
          </section>
        )} */}

        {/* Step 1: Complimentary Drink */}
        {step === 1 && (
          <section className="px-4 py-8 max-w-7xl mx-auto">
            <h1 className="text-4xl md:text-5xl text-center mb-4">Complimentary Drink</h1>
            {isMobile ? (
              <div className="flex flex-col items-center w-full max-w-xl mx-auto mb-[5rem]">
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
                <div className="absolute bg-[#1b1f23]/70 p-6 h-[30rem] mt-6 w-[70%] rounded-lg z-10">
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
                  <div className="mt-4 space-y-4">
                    <div>
                      <label
                        className={`block text-md mb-2 font-semibold ${
                          !formData.wantsDrink ? "text-gray-400" : ""
                        }`}
                      >
                        Select your Date of Birth:
                      </label>
                      <input
                        type="date"
                        name="dob"
                        value={formData.dob}
                        onChange={handleChange}
                        className={`border p-3 w-full rounded-md ${
                          !formData.wantsDrink ? "text-gray-400 border-gray-400" : ""
                        }`}
                        disabled={!formData.wantsDrink}
                      />
                    </div>
                    {getAge(formData.dob) >= 21 && (
                      <div className="space-y-4">
                        <div>
                          <label
                            className={`block text-md mb-2 font-semibold ${
                              !formData.wantsDrink ? "text-gray-400" : ""
                            }`}
                          >
                            Upload Photo ID:
                          </label>
                          <label
                            htmlFor="fileUpload"
                            className={`p-3 w-full rounded-md flex items-center justify-center cursor-pointer transition-all ${
                              !formData.wantsDrink
                                ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                                : "bg-white text-black hover:bg-gray-300"
                            }`}
                          >
                            Upload
                          </label>
                          <input
                            id="fileUpload"
                            type="file"
                            accept="image/*"
                            capture="environment"
                            onChange={handleFileUpload}
                            className="hidden"
                            disabled={!formData.wantsDrink}
                          />
                          <p className="mt-2 text-sm text-gray-700">
                            Selected:{" "}
                            {formData.photoID
                              ? formData.photoID.name
                              : member?.photoId?.fileName || "No Photo ID has been uploaded."}
                          </p>
                        </div>
                        <div>
                          <label
                            className={`block text-md mb-2 font-semibold ${
                              !formData.wantsDrink ? "text-gray-400" : ""
                            }`}
                          >
                            Choose your drink:
                          </label>
                          <select
                            name="drinkOfChoice"
                            value={formData.drinkOfChoice}
                            onChange={handleChange}
                            className={`border p-3 w-full rounded-md ${
                              !formData.wantsDrink ? "text-gray-400 border-gray-400" : ""
                            }`}
                            disabled={!formData.wantsDrink}
                          >
                            <option className="text-black" value="">
                              Select a drink
                            </option>
                            <option className="text-black" value="Wine">
                              Wine
                            </option>
                            <option className="text-black" value="Beer">
                              Beer
                            </option>
                            <option className="text-black" value="House's Choice">
                              House's Choice
                            </option>
                          </select>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex flex-row bg-[#1b1f23] rounded-lg max-w-6xl mx-auto shadow-2xl">
                <div className="p-6 md:p-8 w-1/2">
                  <label className="text-lg font-semibold">Would you like a complimentary drink?</label>
                  <div className="flex items-center space-x-6 mt-2">
                    <label className="flex items-center space-x-2">
                      <Checkbox
                        className="cursor-pointer"
                        colorPalette="blue"
                        name="wantsDrink"
                        checked={formData.wantsDrink === true}
                        onCheckedChange={handleCheckboxChange}
                        size="lg"
                        aria-label="Yes, I want a complimentary drink"
                      />
                      <span>Yes</span>
                    </label>
                    <label className="flex items-center space-x-2">
                      <Checkbox
                        className="cursor-pointer"
                        colorPalette="blue"
                        name="wantsDrink"
                        checked={formData.wantsDrink === false}
                        onCheckedChange={handleCheckboxChange}
                        size="lg"
                        aria-label="No, I do not want a complimentary drink"
                      />
                      <span>No</span>
                    </label>
                  </div>
                  <div className="mt-4 space-y-4">
                    <div>
                      <label
                        className={`block text-lg font-semibold mb-2 ${
                          !formData.wantsDrink ? "text-gray-400" : ""
                        }`}
                      >
                        Date of Birth
                      </label>
                      <input
                        type="date"
                        name="dob"
                        value={formData.dob}
                        onChange={handleChange}
                        className={`border p-3 w-full rounded-md ${
                          !formData.wantsDrink ? "text-gray-400 border-gray-400" : "border-gray-600"
                        }`}
                        disabled={!formData.wantsDrink}
                        aria-label="Select your date of birth"
                      />
                    </div>
                    {getAge(formData.dob) >= 21 && (
                      <div className="space-y-4">
                        <div>
                          <label
                            className={`block text-lg font-semibold mb-2 ${
                              !formData.wantsDrink ? "text-gray-400" : ""
                            }`}
                          >
                            Upload Photo ID
                          </label>
                          <label
                            htmlFor="fileUpload"
                            className={`p-3 w-full rounded-md flex items-center justify-center cursor-pointer transition-all ${
                              !formData.wantsDrink
                                ? "bg-gray-600 text-gray-400 cursor-not-allowed"
                                : "bg-orange-300 text-white hover:bg-orange-500"
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
                            aria-label="Upload photo ID"
                          />
                          {formData.photoID && (
                            <p className="mt-2 text-sm text-gray-300">
                              Selected: {formData.photoID.name}
                            </p>
                          )}
                        </div>
                        <div>
                          <label
                            className={`block text-lg font-semibold mb-2 ${
                              !formData.wantsDrink ? "text-gray-400" : ""
                            }`}
                          >
                            Choose Your Drink
                          </label>
                          <select
                            name="drinkOfChoice"
                            value={formData.drinkOfChoice}
                            onChange={handleChange}
                            className={`border p-3 w-full rounded-md ${
                              !formData.wantsDrink ? "text-gray-400 border-gray-400" : "border-gray-600"
                            }`}
                            disabled={!formData.wantsDrink}
                            aria-label="Select your drink"
                          >
                            <option value="">Select a drink</option>
                            {[
                              "Wine",
                              "Beer",
                              "House's Choice"
                            ].map((drink) => (
                              <option key={drink} value={drink}>
                                {drink}
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
                <div className="w-1/2">
                  <video
                    src={whiskey}
                    autoPlay
                    muted
                    loop
                    className="w-full h-full object-cover rounded-r-lg"
                  />
                </div>
              </div>
            )}
          </section>
        )}

        {/* Step 2: Choose Barber */}
        {step === 2 && (
          <section className="px-4 py-8 max-w-7xl mx-auto">
            <h1 className="text-4xl md:text-5xl text-center mb-4">Choose Your Barber</h1>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-10">
              {barbers.map((barber) => (
                <article
                  key={barber.id}
                  onClick={() =>
                    setFormData({ ...formData, preferredBarber: barber.name })
                  }
                  className={`
                    bg-[#1b1f23]
                    border border-[#1b1f23]
                    rounded-xl
                    overflow-hidden
                    hover:border-orange-300
                    transition-all duration-300
                    transform hover:scale-[1.02] hover:shadow-lg
                    cursor-pointer
                    group
                    relative
                  `}
                >
                  {/* Checkbox overlay */}
                  <div className="absolute top-2 right-2 z-10">
                    <Checkbox
                      checked={formData.preferredBarber === barber.name}
                      onCheckedChange={() =>
                        setFormData({ ...formData, preferredBarber: barber.name })
                      }
                      colorScheme="orange"
                      aria-label={`Select ${barber.name} as preferred barber`}
                    />
                  </div>

                  {/* Image area with gradient overlay */}
                  <div className="h-48 bg-[#1b1f23] relative overflow-hidden flex items-center justify-center">
                    <img
                      src={barber.image}
                      alt={barber.name}
                      className="w-40 h-40 rounded-full object-cover shadow-lg"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent opacity-60" />
                  </div>

                  {/* Name */}
                  <div className="p-6">
                      <h3 className="text-xl font-bold text-white mb-2 group-hover:text-orange-300 transition duration-300">{barber.name}</h3>
                      <p className="text-gray-400 text-sm mb-4">{barber.title || "Expert Stylist"}</p>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-300 text-sm">{"Choose"}</span>
                        <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-black text-white group-hover:bg-orange-300 group-hover:text-black transition duration-300">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                          </svg>
                        </span>
                      </div>
                    </div>
                </article>
              ))}
            </div>
          </section>
        )}

        {/* Step 3: Book Appointments */}
        {step === 3 && (
          <section className="px-4 py-8 max-w-7xl mx-auto">
            <h1 className="text-3xl md:text-5xl text-center mb-4">Book Appointments</h1>
            <p className="text-base md:text-lg text-center mb-6 text-gray-300">
              Schedule your next 2 months in advance to begin your membership.
            </p>
            <div
              className={`flex ${
                isMobile ? "flex-col space-y-6" : "flex-row-reverse space-x-reverse space-x-6"
              } max-w-6xl mx-auto`}
            >
              <div className="bg-white text-black p-6 rounded-lg flex flex-col justify-between w-full md:w-1/3">
                <div>
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="font-bold text-lg">Membership Tier</h3>
                    <span className="text-orange-400 font-bold text-lg">{member?.membership}</span>
                  </div>
                  <p className="text-center mb-2">
                    Your {member?.membership} Membership includes a haircut every{" "}
                    {member?.membership === "Gold"
                      ? "2"
                      : member?.membership === "Silver"
                      ? "3"
                      : "4"}{" "}
                    weeks.
                  </p>
                  <p className="text-center mb-4">
                    Schedule {requiredAppointments} appointments to complete your membership.
                  </p>
                </div>
                <div className="flex flex-col items-center space-y-4 my-6">
                  <p className="font-bold">Appointments Created</p>
                  <div className="flex justify-center items-center gap-2">
                    {Array.from({ length: requiredAppointments }).map((_, index) => (
                      <div
                        key={index}
                        className={`w-3 h-3 rounded-full transition-all ${
                          index < completedAppointments ? "bg-orange-400" : "bg-gray-300"
                        }`}
                      />
                    ))}
                  </div>
                </div>
                <div>
                  <p className="text-gray-600 text-sm text-center">
                    Note: Use the same email and phone number as your membership (
                    {member?.email}, {member?.phoneNumber}).
                  </p>
                </div>
              </div>
              <div className="w-full md:w-2/3">
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
                  height={isMobile ? "600" : "800"}
                  frameBorder="0"
                  className="rounded-lg"
                />
                <script
                  src="https://embed.acuityscheduling.com/js/embed.js"
                  type="text/javascript"
                  async
                />
              </div>
            </div>
          </section>
        )}

        {/* Step 4: Review Selections */}
        {step === 4 && (
          <section className="px-4 py-8 max-w-7xl mx-auto">
            <h1 className="text-4xl md:text-5xl text-center mb-4">Review Your Selections</h1>
            <div
              className={`flex ${isMobile ? "flex-col space-y-6" : "flex-row space-x-6"} max-w-5xl mx-auto`}
            >
              <article className="bg-white text-black p-6 rounded-lg shadow-lg w-full">
                <h2 className="text-xl md:text-2xl font-bold mb-4 text-center">Your Information</h2>
                <div className="space-y-2">
                  <p>
                    <strong>First Name:</strong> {member?.firstName}
                  </p>
                  <p>
                    <strong>Last Name:</strong> {member?.lastName}
                  </p>
                  <p>
                    <strong>Email:</strong> {member?.email}
                  </p>
                  <p>
                    <strong>Phone Number:</strong> {member?.phoneNumber || "Not provided"}
                  </p>
                </div>
              </article>
              <article className="bg-white text-black p-6 rounded-lg shadow-lg w-full">
                <h2 className="text-xl md:text-2xl font-bold mb-4 text-center">Membership Details</h2>
                <div className="space-y-2">
                  <p>
                    <strong>Drink:</strong>{" "}
                    {formData.wantsDrink ? formData.drinkOfChoice : "No drink selected"}
                  </p>
                  <p>
                    <strong>Barber:</strong> {formData.preferredBarber}
                  </p>
                  <p>
                    <strong>Membership Type:</strong> {member?.membership || "Not selected"}
                  </p>
                  <p>
                    <strong>Appointments Booked:</strong>{" "}
                    {formData.appointments.length > 0
                      ? formData.appointments.length
                      : "Not booked"}
                  </p>
                </div>
              </article>
            </div>
          </section>
        )}

        {/* Step 5: Checkout */}
        {step === 5 && (
          <section className="px-4 py-8 max-w-7xl mx-auto">
            <h1 className="text-4xl md:text-5xl text-center mb-4">Checkout</h1>
            <p className="text-base md:text-lg text-center mb-6 text-gray-300">
              Set up your monthly membership payment
            </p>
            <div
              className={`flex ${isMobile ? "flex-col space-y-6" : "flex-row space-x-6"} max-w-5xl mx-auto`}
            >
              <article className="bg-white text-black p-6 rounded-lg shadow-lg w-full md:w-1/2 flex flex-col justify-between">
                <div className="space-y-4">
                  <div className="flex justify-center mb-4">
                    <img
                      src={ArmonEmpireLogo}
                      alt="Armon Empire Logo"
                      className="h-16 md:h-20 object-contain"
                    />
                  </div>
                  <div className="flex justify-between">
                    <h2 className="font-semibold">Membership</h2>
                    <p className="text-orange-300 font-bold">{member?.membership}</p>
                  </div>
                  <div className="flex justify-between">
                    <h2 className="font-semibold">Price</h2>
                    <p>
                      {member?.membership === "Gold"
                        ? "$100/mo"
                        : member?.membership === "Silver"
                        ? "$75/mo"
                        : member?.membership === "Bronze"
                        ? "$50/mo"
                        : "N/A"}
                    </p>
                  </div>
                  <h2 className="font-semibold">Benefits</h2>
                  <ul className="space-y-2 text-sm">
                    <li>
                      • Haircut every{" "}
                      {member?.membership === "Gold"
                        ? "2 weeks"
                        : member?.membership === "Silver"
                        ? "3 weeks"
                        : member?.membership === "Bronze"
                        ? "4 weeks"
                        : "N/A"}
                    </li>
                    <li>• Complimentary drinks provided</li>
                    <li>• Savings on specialty services</li>
                    <li>• No overtime fees on late bookings</li>
                    <li>• No fees for last-minute bookings</li>
                  </ul>
                </div>
                <div className="mt-4">
                  <div className="flex justify-between border-t-2 pt-4">
                    <h2 className="text-lg font-bold">Total due today:</h2>
                    <p className="text-xl font-bold">${displayAmount.toFixed(2)}</p>
                  </div>
                  <p className="text-gray-500 text-xs text-center mt-2">
                    Memberships are charged monthly to the saved card.
                  </p>
                </div>
              </article>
              <article className="bg-white text-black p-6 rounded-lg shadow-lg w-full md:w-1/2">
                <Elements stripe={stripePromise}>
                  <CheckoutForm member={member} />
                </Elements>
              </article>
            </div>
          </section>
        )}

        {/* Navigation Footer */}
        <footer
          className={`fixed bottom-0 left-0 right-0 bg-black p-4 flex justify-between items-center z-50 ${
            isMobile ? "px-4" : "px-8"
          }`}
        >
          {step === 1 && (
            <button
              onClick={() => navigate("/select-membership")}
              className="px-6 py-2 rounded-md bg-gray-600 text-white font-semibold hover:bg-gray-700 cursor-pointer transition-colors"
              aria-label="Go to select membership"
            >
              Back
            </button>
          )}
          {step > 1 && (
            <button
              onClick={prevStep}
              className="px-6 py-2 rounded-md bg-gray-600 text-white font-semibold hover:bg-gray-700 cursor-pointer transition-colors"
              aria-label="Go to previous step"
            >
              Back
            </button>
          )}
          {step < 5 && (
            <button
              onClick={nextStep}
              disabled={
                (step === 1 && isNextDisabled) ||
                (step === 2 && !formData.preferredBarber) ||
                (step === 3 && (!formData.preferredBarber || completedAppointments < requiredAppointments)) ||
                (step === 4 && !formData.preferredBarber)
              }
              className={`px-6 py-2 rounded-md font-semibold transition-colors cursor-pointer ml-auto ${
                (step === 1 && !isNextDisabled) ||
                (step === 2 && formData.preferredBarber) ||
                (step === 3 && formData.preferredBarber && completedAppointments >= requiredAppointments) ||
                (step === 4 && formData.preferredBarber)
                  ? "bg-white text-black hover:bg-gray-300"
                  : "bg-gray-800 text-gray-500 cursor-not-allowed"
              }`}
              aria-label={step === 4 ? "Proceed to payment" : "Proceed to next step"}
            >
              {step === 4 ? "Proceed to Payment" : "Next"}
            </button>
          )}
        </footer>
      </main>
    </>
  );
};

export default CustomizeMembership;
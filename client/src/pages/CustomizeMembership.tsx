import EmptyHeader from "@/components/EmptyHeader";
import { useState } from "react";
import { haircuts } from "@/data/data";
import whiskey from "../assets/video/whiskey.mp4"
import { Checkbox } from "@/components/ui/checkbox";

interface FormData {
  haircut: string;
  wantsDrink: boolean;
  dob: string;
  photoID: File | null;
  drinkOfChoice: string;
  preferredBarber: string;
  appointments: Date[];
}

const CustomizeMembership = () => {
  const [step, setStep] = useState<number>(1);
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

  return (
    <>
        <EmptyHeader />
        <div className="p-6 mx-auto mt-25">
            {/* HAIRCUT */}
            {step === 1 && (
                <div className="mx-[12rem]">
                    <h1 className="text-6xl text-center mb-6">Choose your haircut</h1>
                    <h2 className="text-xl font-bold text-center mb-6">Select your haircut from the following options, or select "Other"</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        {haircuts.map((cut) => (
                            <div
                                key={cut.id}
                                className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                                    formData.haircut === cut.id ? "border-orange-300 shadow-lg shadow-orange-300/50" : "border-gray-500"
                                }`}
                                onClick={() => setFormData({ ...formData, haircut: cut.id })}
                            >
                                <img src={cut.image} alt={cut.name} className="w-full h-40 object-cover rounded-md" />
                                <h3 className="text-lg font-semibold mt-2">{cut.name}</h3>
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
                                formData.haircut === "Other" ? "border-orange-300 shadow-lg shadow-orange-300/50" : "border-gray-500"
                            }`}
                            onClick={() => setFormData({ ...formData, haircut: "Other" })}
                        >
                            <h3 className="text-lg font-semibold text-center">Other</h3>
                            <button
                                className={`mt-2 w-full py-2 rounded text-white ${
                                formData.haircut === "Other" ? "bg-orange-300" : "bg-gray-700 hover:bg-orange-400"
                                }`}
                            >
                                {formData.haircut === "Other" ? "Selected" : "Select"}
                            </button>
                        </div>
                    </div>

                    {/* Next Button */}
                    <button
                        onClick={nextStep}
                        disabled={!formData.haircut || (formData.haircut === "Other" && !formData.haircut.trim())}
                        className={`fixed bottom-20 right-20 py-2 px-8 rounded text-white text-xl font-bold ${
                            formData.haircut && (formData.haircut !== "Other" || formData.haircut.trim())
                            ? "bg-orange-300 cursor-pointer hover:bg-orange-500"
                            : "bg-gray-500 cursor-not-allowed"
                        }`}
                    >
                        Next
                    </button>
                </div>
            )}

            {step === 2 && (
                <div className="flex flex-col items-center px-6 py-10">
                    <h1 className="text-6xl text-center mb-6">Complimentary Drink</h1>

                    <div className="flex text-black bg-gray-200 items-stretch justify-center rounded-lg w-full h-full max-w-6xl mx-auto" style={{ boxShadow: '0 0 25px rgba(255, 255, 255, 0.5)' }}>
                        {/* Form Section */}
                        <div
                            className={`p-8 w-full h-full rounded-l-lg md:w-1/2`}
                        >
                            <label className="text-lg font-semibold">
                                <span>Would you like a complimentary drink?</span>
                            </label>
                            <div className="flex items-center space-x-6 mt-2">
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
                                        defaultChecked
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
                                    <label className={`block text-lg mb-2 font-semibold ${ !formData.wantsDrink ? ("text-gray-400") : ("")}`}>Select your Date of Birth:</label>
                                    <input
                                        type="date"
                                        name="dob" // Change the name to reflect the user's date of birth
                                        value={formData.dob} // Update with the correct state property
                                        onChange={handleChange}
                                        className={`border p-3 w-full rounded-md ${ !formData.wantsDrink ? ("text-gray-400 border-gray-400") : ("")}`}
                                        disabled={!formData.wantsDrink}
                                    />
                                </div>

                                {parseInt(formData.dob) >= 21 && (
                                    <div className="space-y-4">
                                        <div>
                                            <label className={`block text-md mb-2 font-semibold ${ !formData.wantsDrink ? ("text-gray-400") : ("")}`}>Upload Photo ID:</label>
                                            <input
                                                type="file"
                                                onChange={handleFileUpload}
                                                className={`border p-3 w-full rounded-md ${ !formData.wantsDrink ? ("text-gray-400 border-gray-400") : ("")}`}
                                                disabled={!formData.wantsDrink}
                                            />
                                        </div>

                                        <div>
                                            <label className={`block text-md mb-2 font-semibold ${ !formData.wantsDrink ? ("text-gray-400") : ("")}`}>Choose your drink:</label>
                                            <select
                                                name="drinkOfChoice"
                                                value={formData.drinkOfChoice}
                                                onChange={handleChange}
                                                className={`border p-3 w-full rounded-md ${ !formData.wantsDrink ? ("text-gray-400 border-gray-400") : ("")}`}
                                                disabled={!formData.wantsDrink}
                                            >
                                                <option value="">Select a drink</option>
                                                <option value="whiskey">Whiskey</option>
                                                <option value="beer">Beer</option>
                                                <option value="soda">Soda</option>
                                            </select>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Video Section */}
                        <div className="w-full md:w-1/2 h-full">
                            <video
                                src={whiskey} // Make sure to replace this with your correct video path
                                autoPlay
                                muted
                                loop
                                className="w-full h-full object-cover rounded-r-lg"
                            />
                        </div>
                    </div>

                    <div className="absolute bottom-20 left-20 right-20 flex justify-between p-4 font-bold text-xl mx-auto">
                        <button
                            onClick={prevStep}
                            className="bg-gray-400 text-white px-8 py-3 rounded-lg transition-all hover:bg-gray-500"
                        >
                            Back
                        </button>
                        <button
                            onClick={nextStep}
                            className="bg-orange-300 text-white px-8 py-3 rounded-lg transition-all hover:bg-orange-400"
                        >
                            Next
                        </button>
                    </div>
                </div>
            )}

            {step === 3 && (
                <div>
                <h2 className="text-xl font-bold">Step 3: Choose Your Barber</h2>
                <select name="preferredBarber" value={formData.preferredBarber} onChange={handleChange} className="border p-2 w-full">
                    <option value="">Select a barber</option>
                    <option value="barber1">Barber 1</option>
                    <option value="barber2">Barber 2</option>
                    <option value="barber3">Barber 3</option>
                </select>
                <div className="mt-4 flex justify-between">
                    <button onClick={prevStep} className="bg-gray-400 text-white p-2">Back</button>
                    <button onClick={nextStep} className="bg-blue-500 text-white p-2">Next</button>
                </div>
                </div>
            )}

            {step === 4 && (
                <div>
                <h2 className="text-xl font-bold">Step 4: Book Initial Appointments</h2>
                <p>Select dates for the next two months.</p>
                {/* Placeholder for a calendar component */}
                <input type="date" name="appointments" onChange={handleChange} className="border p-2 w-full" />
                <div className="mt-4 flex justify-between">
                    <button onClick={prevStep} className="bg-gray-400 text-white p-2">Back</button>
                    <button onClick={nextStep} className="bg-blue-500 text-white p-2">Next</button>
                </div>
                </div>
            )}

            {step === 5 && (
                <div>
                <h2 className="text-xl font-bold">Step 5: Review Your Selections</h2>
                <p><strong>Haircut:</strong> {formData.haircut}</p>
                <p><strong>Drink:</strong> {formData.wantsDrink ? formData.drinkOfChoice : "No drink selected"}</p>
                <p><strong>Barber:</strong> {formData.preferredBarber}</p>
                <p><strong>Appointments:</strong> {formData.appointments.length > 0 ? formData.appointments.join(", ") : "Not booked"}</p>
                <div className="mt-4 flex justify-between">
                    <button onClick={prevStep} className="bg-gray-400 text-white p-2">Back</button>
                    <button onClick={nextStep} className="bg-green-500 text-white p-2">Proceed to Checkout</button>
                </div>
                </div>
            )}

            {step === 6 && (
                <div>
                <h2 className="text-xl font-bold">Step 6: Checkout</h2>
                <p>Set up your monthly membership payment.</p>
                {/* Placeholder for Stripe integration */}
                <button className="mt-4 bg-green-500 text-white p-2">Subscribe</button>
                </div>
            )}
        </div>
    </>
  );
};

export default CustomizeMembership;

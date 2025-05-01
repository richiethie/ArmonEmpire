import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import { useAuth } from "@/context/AuthContext";  // Assuming your AuthContext is set up
import PhoneInput from 'react-phone-number-input';
import 'react-phone-number-input/style.css'; // Import styles

const Signup = () => {
  const navigate = useNavigate();
  const { login } = useAuth(); // Use the login function from your AuthContext

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phoneNumber: "",
    password: "",
    confirmPassword: "",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [value, setValue] = useState<string | undefined>('');

  // Handle input change
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handlePhoneNumberChange = (value: string | undefined) => {
    // Remove the leading country code (+1) if it exists
  
    setFormData({ ...formData, phoneNumber: value ?? '' });
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match!");
      return;
    }
    console.log(formData);

    try {
      setLoading(true);

      const response = await axios.post(`${import.meta.env.VITE_API_URL}/api/auth/signup`, {
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        phoneNumber: formData.phoneNumber,
        password: formData.password,
      });

      if (response.status === 201) {
        
        // On successful signup, log the user in using the returned token
        login({ user: response.data.user, token: response.data.token });

        // Redirect to /members after login
        navigate("/select-membership");
      }
    } catch (err: any) {
      setError(err.response?.data?.message || "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Header />
      <div className="flex justify-center items-center min-h-screen bg-charcoal text-crispWhite">
        <div className="bg-steelGray p-8 rounded-2xl shadow-secondary w-full max-w-md">
          <h2 className="text-2xl font-semibold text-center mb-6">Start your Membership</h2>

          {error && <p className="text-red-500 text-sm text-center mb-4">{error}</p>}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* First Name */}
            <div>
              <label className="block text-sm font-medium mb-1">First Name</label>
              <input
                type="text"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                className="w-full px-4 py-2 rounded-md bg-charcoal border border-steelGray focus:border-orange-300 outline-none"
                placeholder="Enter your first name"
                required
              />
            </div>

            {/* Last Name */}
            <div>
              <label className="block text-sm font-medium mb-1">Last Name</label>
              <input
                type="text"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                className="w-full px-4 py-2 rounded-md bg-charcoal border border-steelGray focus:border-orange-300 outline-none"
                placeholder="Enter your last name"
                required
              />
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium mb-1">Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full px-4 py-2 rounded-md bg-charcoal border border-steelGray focus:border-orange-300 outline-none"
                placeholder="Enter your email"
                required
              />
            </div>

            {/* Phone Number */}
            <div>
              <label className="block text-sm font-medium mb-1">Phone Number</label>
              <PhoneInput
                international={false}
                defaultCountry="US"
                value={formData.phoneNumber}
                onChange={handlePhoneNumberChange}
                className="w-full px-4 py-2 rounded-md bg-charcoal border border-steelGray focus:border-orange-300 outline-none"
                placeholder="Enter your phone number"
                required
              />
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-medium mb-1">Password</label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="w-full px-4 py-2 rounded-md bg-charcoal border border-steelGray focus:border-orange-300 outline-none"
                placeholder="Create a password"
                required
              />
            </div>

            {/* Confirm Password */}
            <div>
              <label className="block text-sm font-medium mb-1">Confirm Password</label>
              <input
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                className="w-full px-4 py-2 rounded-md bg-charcoal border border-steelGray focus:border-orange-300 outline-none"
                placeholder="Confirm your password"
                required
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full bg-white cursor-pointer text-black font-semibold py-3 rounded-md hover:bg-gray-300 transition"
              disabled={loading}
            >
              {loading ? "Signing Up..." : "Sign Up"}
            </button>
          </form>

          {/* Login Link */}
          <p className="text-center text-sm mt-4">
            Already have an account?{" "}
            <a href="/login" className="text-gray-300 underline">
              Sign in
            </a>
          </p>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Signup;

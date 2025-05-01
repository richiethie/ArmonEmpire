import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import { useAuth } from "@/context/AuthContext";
import { FaExternalLinkAlt } from "react-icons/fa";

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();  // Use the login function from AuthContext

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // Handle input change
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");

    try {
      setLoading(true);

      const response = await axios.post(`${import.meta.env.VITE_API_URL}/api/auth/login`, {
        email: formData.email,
        password: formData.password,
      });

      if (response.status === 200) {
        // On successful login, log the user in using the returned token
        login({ user: response.data.user, token: response.data.token });

        // Redirect to /members after login
        navigate("/members");
      }
    } catch (err: any) {
      setError(err.response?.data?.message || "Invalid credentials. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Header />
      <div className="flex justify-center items-center min-h-screen bg-charcoal text-crispWhite">
        <div className="bg-steelGray p-8 rounded-2xl shadow-secondary w-full max-w-md">
          <h2 className="text-2xl font-semibold text-center mb-6">Member Sign In</h2>

          {error && <p className="text-red-500 text-sm text-center mb-4">{error}</p>}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email */}
            <div>
              <label className="block text-sm font-medium mb-1">Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full px-4 py-2 rounded-md bg-charcoal border border-steelGray focus:border-cornflowerBlue outline-none"
                placeholder="Enter your email"
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
                className="w-full px-4 py-2 rounded-md bg-charcoal border border-steelGray focus:border-cornflowerBlue outline-none"
                placeholder="Enter your password"
                required
              />
            </div>

            <div className="flex items-center justify-between">
              <a
                href="/forgot-password"
                className="text-sm text-gray-300 underline flex items-center justify-center"
              >
                Forgot password?
              </a>
              <FaExternalLinkAlt className="text-gray-300" />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full bg-white text-black font-semibold py-3 rounded-md hover:bg-gray-300 transition"
              disabled={loading}
            >
              {loading ? "Signing In..." : "Sign In"}
            </button>
          </form>

          {/* Signup Link */}
          <p className="text-center text-sm mt-4">
            Don't have an account?{" "}
            <a href="/signup" className="text-gray-300 font-semibold underline">
              Sign up
            </a>
          </p>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Login;

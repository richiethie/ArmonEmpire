import React, { useState, useEffect } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { FaSpinner } from "react-icons/fa";
import axios from "axios";
import EmptyHeader from "@/components/EmptyHeader";
import { useNavigate, useLocation } from "react-router-dom"; // for accessing query params

interface FormData {
  password: string;
  confirmPassword: string;
}

const ResetPassword = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { register, handleSubmit, formState: { errors } } = useForm<FormData>();
  const [message, setMessage] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [token, setToken] = useState<string | null>(null);
  const [email, setEmail] = useState<string | null>(null);

  // Extract token and email from the URL query params
  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const tokenFromUrl = urlParams.get("token");
    const emailFromUrl = urlParams.get("email");

    if (tokenFromUrl && emailFromUrl) {
      setToken(tokenFromUrl);
      setEmail(emailFromUrl);
    } else {
      setError("Invalid or missing token and email.");
    }
  }, [location]);

  const onSubmit: SubmitHandler<FormData> = async (data) => {
    if (!token || !email) {
      setError("Missing token or email. Please try again.");
      return;
    }

    setLoading(true);
    setMessage("");
    setError("");

    try {
      const response = await axios.post<{ message: string }>(`${import.meta.env.VITE_API_URL}/api/auth/reset-password`, {
        token,
        email,
        password: data.password
      });

      setMessage(response.data.message);
      setTimeout(() => navigate("/login"), 2000); // Redirect to login after a successful reset
    } catch (error) {
      setError("Failed to reset password. Please check the link and try again.");
    }

    setLoading(false);
  };

  return (
    <>
      <EmptyHeader />
      <div className="flex flex-col items-center justify-center min-h-screen bg-black text-white p-4">
        <div className="w-full max-w-md p-6">
          <h2 className="text-2xl font-semibold mb-4 text-center">Reset Password</h2>
          <p className="text-sm text-gray-300 text-center mb-4">Enter your new password below.</p>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Enter your new password</label>
              <input
                type="password"
                placeholder="New Password"
                className="w-full px-4 py-2 rounded-md border border-steelGray focus:border-orange-300 outline-none"
                {...register("password", { required: "Password is required" })}
              />
              {errors.password && <p className="text-red-400 text-sm mt-1">{errors.password.message}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Confirm your new password</label>
              <input
                type="password"
                placeholder="Confirm Password"
                className="w-full px-4 py-2 rounded-md border border-steelGray focus:border-orange-300 outline-none"
                {...register("confirmPassword", { required: "Please confirm your password" })}
              />
              {errors.confirmPassword && <p className="text-red-400 text-sm mt-1">{errors.confirmPassword.message}</p>}
            </div>

            <button
              type="submit"
              className="w-full p-2 rounded bg-orange-300 hover:bg-orange-400 text-black font-semibold flex justify-center items-center cursor-pointer gap-2"
              disabled={loading}
            >
              {loading && <FaSpinner className="animate-spin" />} Reset Password
            </button>
          </form>

          {message && <p className="text-center text-sm text-green-400 mt-4">{message}</p>}
          {error && <p className="text-center text-sm text-red-400 mt-4">{error}</p>}
        </div>
      </div>
    </>
  );
};

export default ResetPassword;

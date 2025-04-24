import { useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { FaSpinner } from "react-icons/fa";
import axios from "axios";
import EmptyHeader from "@/components/EmptyHeader";

interface FormData {
  email: string;
}

const ForgotPassword = () => {
  const { register, handleSubmit, formState: { errors } } = useForm<FormData>();
  const [message, setMessage] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  const onSubmit: SubmitHandler<FormData> = async (data) => {
    setLoading(true);
    setMessage("");

    try {
      const response = await axios.post<{ message: string }>(`${import.meta.env.VITE_API_URL}/api/auth/forgot-password`, { email: data.email });
      setMessage(response.data.message);
    } catch (error) {
        setError("Failed to send reset link. Check that email is valid and try again.");
    }

    setLoading(false);
  };

  return (
    <>
        <EmptyHeader />
        <div className="flex flex-col items-center justify-center min-h-screen bg-black text-white p-4">
            <div className="w-full max-w-md p-6">
                <h2 className="text-2xl font-semibold mb-4 text-center">Forgot Password</h2>
                <p className="text-sm text-gray-300 text-center mb-4"></p>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div>
                    <label className="block text-sm text-center font-medium mb-2">Enter your email to receive a reset link.</label>
                    <input
                    type="email"
                    placeholder="Enter your email"
                    className="w-full px-4 py-2 rounded-md border border-steelGray focus:border-orange-300 outline-none"
                    {...register("email", { required: "Email is required" })}
                    />
                    {errors.email && <p className="text-red-400 text-sm mt-1">{errors.email.message}</p>}
                </div>

                <button
                    type="submit"
                    className="w-full p-2 rounded bg-orange-300 hover:bg-orange-400 text-black font-semibold flex justify-center items-center cursor-pointer gap-2"
                    disabled={loading}
                >
                    {loading && <FaSpinner className="animate-spin" />} Send Reset Link
                </button>
                </form>

                {message && <p className="text-center text-sm text-green-400 mt-4">{message}</p>}
                {error && <p className="text-center text-sm text-red-400 mt-4">{error}</p>}
            </div>
        </div>
    </>
  );
};

export default ForgotPassword;

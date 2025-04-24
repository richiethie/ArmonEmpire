import { Elements, PaymentElement, useStripe, useElements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import { useEffect, useState } from "react";
import axios from "axios";
import Footer from "@/components/Footer";
import MemberHeader from "@/components/MemberHeader";
import { useAuth } from "@/context/AuthContext";
import { IoChevronBackOutline } from "react-icons/io5";
import { useNavigate } from "react-router-dom";

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

const UpdatePaymentMethod = () => {
    const [clientSecret, setClientSecret] = useState<string | null>(null);

    const { user } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {

        if (!user) return;
    
        axios.post(
            `${import.meta.env.VITE_API_URL}/api/stripe/setup-intent`,
            { currentUser: user }, // Send user ID to backend
        )
        .then((res) => setClientSecret(res.data.clientSecret))
        .catch((err) => console.error("Error fetching setupIntent:", err));
    }, [user]);

    return (
        <>
            <MemberHeader />
            <div className="h-screen flex flex-col items-center mt-28">
                <div className="flex flex-col items-start overflow-y-auto mb-4">
                    <div className="mb-4 flex items-center cursor-pointer hover:text-orange-300" onClick={() => navigate("/manage-membership")}>
                        <IoChevronBackOutline className="mr-1 text-lg" />
                        <p>Manage Membership</p>
                    </div>
                    <h2 className="text-2xl md:text-3xl font-semibold mb-4">Update your card</h2>
                    {clientSecret ? (
                        <Elements stripe={stripePromise} options={{ clientSecret }}>
                            <UpdatePaymentForm clientSecret={clientSecret} />
                        </Elements>
                    ) : (
                        <p>Loading payment form...</p>
                    )}
                </div>
            </div>
            <Footer />
        </>
    );
};

interface UpdatePaymentFormProps {
    clientSecret: string | null; // or string if it's always defined
}

const UpdatePaymentForm: React.FC<UpdatePaymentFormProps> = ({ clientSecret }) => {
    const appearance: any = {
        theme: 'night'
    };

    const stripe = useStripe();
    const elements = useElements();
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");

    const { user } = useAuth();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setMessage("");
      
        if (!stripe || !elements) {
          setLoading(false);
          return;
        }
      
        // Confirm the SetupIntent using the PaymentElement
        const { setupIntent, error } = await stripe.confirmSetup({
          elements,
          confirmParams: {
            return_url: `${window.location.origin}/manage-membership`,
          },
          redirect: "if_required",
        });
      
        if (error) {
          setMessage(error.message || "Failed to update payment method.");
        } else if (setupIntent) {
          // Extract the PaymentMethod ID from the SetupIntent
          const paymentMethodId = setupIntent.payment_method;
          if (!paymentMethodId) {
            setMessage("No payment method received.");
            setLoading(false);
            return;
          }
      
          try {
            // Call your backend route to attach the new payment method and set it as default
            const response = await axios.post(
              `${import.meta.env.VITE_API_URL}/api/stripe/update-payment-method`,
              {
                email: user?.email, // assuming user has an email property
                paymentMethodId,
              }
            );
            if (response.data.success) {
              setMessage("Payment method updated successfully!");
              // Optionally, redirect after a short delay
              setTimeout(() => (window.location.href = "/manage-membership"), 1000);
            } else {
              setMessage(response.data.message || "Failed to update payment method on backend.");
            }
          } catch (err: any) {
            setMessage(err.response?.data?.error || "Error updating payment method on backend.");
          }
        }
        setLoading(false);
      };

    return (
        <form onSubmit={handleSubmit} className="w-full md:w-[600px] max-w-2xl p-4 bg-white rounded-lg flex flex-col gap-4">
            <PaymentElement />
            <button
                type="submit"
                className="px-4 py-2 bg-blue-600 text-white rounded cursor-pointer disabled:opacity-50"
                disabled={!stripe || loading}
            >
                {loading ? "Updating..." : "Update Payment Method"}
            </button>
            {message && <p className={`mt-2 ${message.includes("successfully") ? "text-green-500" : "text-red-500"}`}>{message}</p>}
        </form>
    );
};

export default UpdatePaymentMethod;

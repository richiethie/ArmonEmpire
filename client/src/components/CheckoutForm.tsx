import { useState, useEffect } from "react";
import { Elements, PaymentElement, useStripe, useElements } from "@stripe/react-stripe-js";
import { PaymentIntentResult } from "@stripe/stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import axios from "axios";

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

function PaymentForm() {
    const stripe = useStripe();
    const elements = useElements();
    const [isLoading, setIsLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();
        setIsLoading(true);
        setErrorMessage("");
      
        if (!stripe || !elements) return;
      
        const result = await stripe.confirmPayment({
          elements,
          confirmParams: {
            return_url: `${window.location.origin}/success`,
          },
        }) as PaymentIntentResult; // Type assertion here
      
        if (result.error) {
          setErrorMessage(result.error.message || "Payment failed. Please try again.");
          setIsLoading(false);
        } else if (result.paymentIntent && result.paymentIntent.status === "succeeded") {
          console.log("Payment Successful!");
          // Handle successful payment (e.g., update UI, show success message, etc.)
        }
    };

    return (
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <PaymentElement />
            {errorMessage && <p className="text-red-500">{errorMessage}</p>}
            <button 
                type="submit"
                disabled={isLoading}
                className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 cursor-pointer"
            >
                {isLoading ? "Processing..." : "Subscribe"}
            </button>
        </form>
    );
}

export default function CheckoutForm() {
    const [clientSecret, setClientSecret] = useState<string | null>(null);

    useEffect(() => {
        axios.post(`${import.meta.env.VITE_API_URL}/api/stripe/create-payment-intent`, {
            priceId: "price_1QtzuJKwDDaoYcMewTLSjUxU", // Replace with your actual priceId
        })
        .then((res) => {
            console.log("API Response:", res.data);
            setClientSecret(res.data.clientSecret);
        })
        .catch((err) => console.error("Error fetching client secret:", err));
    }, []);

    return (
        clientSecret ? (
            <Elements stripe={stripePromise} options={{ clientSecret }}>
                <PaymentForm />
            </Elements>
        ) : (
            <p>Loading payment options...</p>
        )
    );
}

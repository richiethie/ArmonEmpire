import { useState, useEffect } from "react";
import { Elements, PaymentElement, useStripe, useElements } from "@stripe/react-stripe-js";
import { PaymentIntentResult } from "@stripe/stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import axios from "axios";
import { User } from "@/types/User";

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

interface CheckoutFormProps {
    member: User | null;
}

// PaymentForm uses the PaymentElement and confirms the payment.
function PaymentForm() {
    const stripe = useStripe();
    const elements = useElements();
    const [isLoading, setIsLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const [successMessage, setSuccessMessage] = useState("");

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();
        setIsLoading(true);
        setErrorMessage("");

        if (!stripe || !elements) return;

        const result = await stripe.confirmPayment({
            elements,
            confirmParams: {
                return_url: `${window.location.origin}/members` // Use a simple URL like the current page
            },
            redirect: 'if_required',
        }) as PaymentIntentResult;

        if (result.error) {
            setErrorMessage(result.error.message || "Payment failed. Please try again.");
            setIsLoading(false);
        } else if (result.paymentIntent && result.paymentIntent.status === "succeeded") {
            console.log("Subscription Payment Successful!");
            setSuccessMessage("Payment Successful! Thank you for your subscription.");
            setIsLoading(false);
            // Redirect to /members after 1 second
            setTimeout(() => {
                window.location.href = "/members"; // Redirects after 1 second
            }, 1000);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <PaymentElement />
            {errorMessage && <p className="text-red-500 text-center">{errorMessage}</p>}
            {successMessage && <p className="text-green-500 text-center">{successMessage}</p>}
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

// CheckoutForm fetches the subscription clientSecret and displays total due.
export default function CheckoutForm({ member }: CheckoutFormProps) {
    const [clientSecret, setClientSecret] = useState<string | null>(null);

    // Map membership to display price
    const priceMapping: { [key: string]: number } = {
        Gold: 90.00,
        Silver: 60.00,
        Bronze: 45.00,
    };
    const displayAmount = member ? priceMapping[member.membership] || 0 : 0;

    useEffect(() => {
        if (!member?.membership || !member.email) return; // Ensure membership and email are available

        // Call the backend to create the subscription and get the clientSecret
        axios.post(`${import.meta.env.VITE_API_URL}/api/stripe/create-subscription`, {
            email: member.email,
            membership: member.membership,
        })
        .then((res) => {
            console.log("Subscription API Response:", res.data);
            setClientSecret(res.data.clientSecret);
        })
        .catch((err) => console.error("Error creating subscription:", err));
    }, [member?.membership, member?.email]);

    return (
        <div>
            <div className="flex items-center justify-between mb-2 text-sm">
                <p className="font-semibold">Total due</p>
                <p>${displayAmount.toFixed(2)}</p>
            </div>
            
            {clientSecret ? (
                <Elements stripe={stripePromise} options={{ clientSecret }}>
                    <PaymentForm />
                </Elements>
            ) : (
                <p>Loading payment options...</p>
            )}
        </div>
    );
}

import { useState, useEffect, FormEvent } from "react";
import { Elements, PaymentElement, useStripe, useElements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import axios from "axios";
import { User } from "@/types/User";
import { useAuth } from "@/context/AuthContext";
import { useNavigate } from "react-router-dom";

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY as string);

interface CheckoutFormProps {
  member: User | null;
}

function UnifiedPaymentForm({
  email,
  membership,
  onSuccess,
}: {
  email: string;
  membership: string;
  onSuccess: () => void;
}) {
  const stripe = useStripe();
  const elements = useElements();
  const [error, setError] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!stripe || !elements) return;
    setLoading(true);
    setError("");

    // Submit the PaymentElement to validate and collect payment details
    const { error: submitError } = await elements.submit();
    if (submitError) {
      setError(submitError.message || "Failed to validate payment details.");
      setLoading(false);
      return;
    }

    // Create payment method using PaymentElement
    const { paymentMethod, error: paymentMethodError } = await stripe.createPaymentMethod({
      elements,
      params: {
        billing_details: {
          email,
        },
      },
    });

    if (paymentMethodError) {
      setError(paymentMethodError.message || "Failed to create payment method.");
      setLoading(false);
      return;
    }

    try {
      // Send payment method ID to backend to create subscription
      const response = await axios.post(`${import.meta.env.VITE_API_URL}/api/stripe/create-subscription`, {
        email,
        membership,
        paymentMethodId: paymentMethod.id,
      });

      const { clientSecret, status, subscriptionId } = response.data;

      if (response.data.error) {
        setError(
          response.data.error === "No payment intent available for the invoice"
            ? "Unable to process payment. Please try a different payment method."
            : response.data.details || response.data.error || "An error occurred. Please try again or contact support."
        );
        setLoading(false);
        return;
      }

      // If subscription is already active, no further action needed
      if (status === "active") {
        setLoading(false);
        onSuccess();
        return;
      }

      // Confirm the payment if required
      if (status === "requires_confirmation") {
        if (!clientSecret) {
          setError("Payment initialization failed. Please contact support.");
          setLoading(false);
          return;
        }

        const { error: confirmError, paymentIntent } = await stripe.confirmPayment({
          elements,
          clientSecret,
          confirmParams: { return_url: `${window.location.origin}/members` },
          redirect: "if_required",
        });

        if (confirmError) {
          console.error("Payment confirmation error:", {
            message: confirmError.message,
            code: confirmError.code,
            type: confirmError.type,
          });
          setError(
            confirmError.code === "card_declined"
              ? "Your card was declined. Please try a different payment method."
              : confirmError.message || "Payment failed. Please try again."
          );
          setLoading(false);
          return;
        }

        if (paymentIntent.status === "succeeded") {
          // Verify subscription status with backend
          const verifyResponse = await axios.get(
            `${import.meta.env.VITE_API_URL}/api/stripe/verify-subscription/${subscriptionId}`
          );

          if (verifyResponse.data.status === "active") {
            onSuccess();
          } else {
            setError("Subscription not activated. Please contact support.");
          }
        }
      } else {
        setError("Unexpected subscription status. Please try again.");
      }
    } catch (err: any) {
      console.error("Error processing subscription:", {
        message: err.message,
        response: err.response?.data,
        status: err.response?.status,
      });
      setError(
        err.response?.data?.error === "No payment intent available for the invoice"
          ? "Unable to process payment. Please try a different payment method."
          : err.response?.data?.details || err.response?.data?.error || "An error occurred. Please try again or contact support."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <PaymentElement />
      {error && <p className="text-red-500">{error}</p>}
      <button
        type="submit"
        disabled={loading || !stripe || !elements}
        className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 disabled:bg-gray-400"
      >
        {loading ? "Processing…" : "Subscribe"}
      </button>
    </form>
  );
}

export default function CheckoutForm({ member }: CheckoutFormProps) {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isSuccess, setIsSuccess] = useState<boolean>(false);

  useEffect(() => {
    if (!user?.email || !member?.membership) {
      setError("User email or membership details are missing.");
      setIsLoading(false);
      return;
    }

    setIsLoading(false);
  }, [user?.email, member?.membership]);

  const handleSuccess = () => {
    setIsSuccess(true);
    setTimeout(() => navigate("/members"), 2000);
  };

  return (
    <div className="space-y-6 max-w-md mx-auto p-4">
      {isLoading ? (
        <p>Loading subscription form...</p>
      ) : isSuccess ? (
        <p className="text-green-500 text-center">
          Subscription activated successfully! Redirecting...
        </p>
      ) : error ? (
        <p className="text-red-500 text-center">{error}</p>
      ) : user?.email && member?.membership ? (
        <Elements
          stripe={stripePromise}
          options={{
            mode: "subscription",
            amount: 0,
            currency: "usd",
            paymentMethodCreation: "manual",
          }}
        >
          <UnifiedPaymentForm
            email={user.email}
            membership={member.membership}
            onSuccess={handleSuccess}
          />
        </Elements>
      ) : (
        <p className="text-red-500 text-center">
          Unable to load payment form. Please try again or contact support.
        </p>
      )}
    </div>
  );
}
import { useState, useEffect } from "react";
import axios from "axios";
import Footer from "@/components/Footer";
import MemberHeader from "@/components/MemberHeader";
import { loadStripe } from "@stripe/stripe-js";
import { Elements, CardElement, useStripe, useElements } from "@stripe/react-stripe-js";
import { User } from "@/types/User";
import { useAuth } from "@/context/AuthContext";
import { useNavigate } from "react-router-dom";
import { IoChevronBackOutline, IoClose } from "react-icons/io5";
import { FaCcAmex, FaCcVisa, FaCcMastercard, FaCcDiscover } from "react-icons/fa6";

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY!);

const ManageMembership = () => {
  const { user } = useAuth();
  const [membership, setMembership] = useState<string | null>(null);
  const [newTier, setNewTier] = useState("");
  const [loading, setLoading] = useState(false);
  const [member, setMember] = useState<User | null>(null);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [cancellationSuccess, setCancellationSuccess] = useState(false);

  const navigate = useNavigate();

  // State for payment method details
  const [paymentMethod, setPaymentMethod] = useState<{
    brand?: string;
    last4?: string;
    exp_month?: number;
    exp_year?: number;
  } | null>(null);

  // Assuming user comes from context or state

  useEffect(() => {
    fetchMember();
  }, []);

  useEffect(() => {
    fetchCurrentPaymentMethod();
  }, [member]);

  const fetchMember = async () => {
    const token = localStorage.getItem("token");
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/user`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setNewTier(response.data.membership);
      setMember(response.data);
    } catch (error) {
      console.error("Error fetching user:", error);
    }
  };

  // Fetch current payment method from your backend
  const fetchCurrentPaymentMethod = async () => {
    try {
      const { data } = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/stripe/get-payment-method`,
        {
          params: { customerId: member?.stripeCustomerId },
        }
      );
      console.log("data: ", data)
      if (data && data.paymentMethod) {
        setPaymentMethod(data.paymentMethod.card);
      } else {
        setPaymentMethod(null);
      }
    } catch (error) {
      console.error("Error fetching payment method:", error);
      setPaymentMethod(null);
    }
  };

  const handleChangeMembership = async () => {
    setLoading(true);
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/stripe/update-subscription`,
        {
          email: member?.email,
          newMembership: newTier,
        }
      );

      if (response.data.success) {
        setMembership(newTier);
        alert("Membership updated successfully!");
      } else {
        alert(response.data.error || "Failed to update membership.");
      }
    } catch (error) {
      console.error("Error updating membership:", error);
      alert("An error occurred while updating membership.");
    } finally {
      setLoading(false);
    }
  };

  const handleCancelMembership = async () => {
    setLoading(true);
    try {
      const response = await axios.post(`${import.meta.env.VITE_API_URL}/api/stripe/cancel-subscription`, {
        email: member?.email,
      });

      if (response.data.success) {
        setCancellationSuccess(true);
        setMembership(null);
      } else {
        alert(response.data.error || "Failed to cancel membership.");
      }
    } catch (error) {
      console.error("Error canceling membership:", error);
      alert("An error occurred while canceling membership.");
    } finally {
      setLoading(false);
    }
  };

  const getCardLogo = (brand: string) => {
    switch (brand) {
      case 'visa':
        return <FaCcVisa />;
      case 'mastercard':
        return <FaCcMastercard />;
      case 'amex':
        return <FaCcAmex />;
      case 'discover':
        return <FaCcDiscover />;
      default:
        return null;
    }
  };

  return (
    <>
      <MemberHeader />
      <div className="h-screen flex flex-col items-center p-6">
        <div className="w-full max-w-3xl">
          <div className="mb-4 flex items-center cursor-pointer text-white hover:text-orange-300 mt-18 md:mt-24" onClick={() => navigate("/members")}>
              <IoChevronBackOutline className="mr-1 text-lg" />
              <p>Member Center</p>
          </div>
          {/* --- Netflix-like header area --- */}
          <h2 className="text-4xl font-bold mb-4">Membership</h2>
          <p className="font-semibold text-xl mb-4">Plan Details</p>

          {/* --- Membership Details Card --- */}
          <div className="w-full bg-[#1b1f23] p-6 rounded-lg shadow-md">
            <div className="px-2 py-4 rounded-lg space-y-2">
              <h3 className="text-xl md:text-2xl font-semibold">
                {newTier} Membership •{" "}
                <strong className="text-xl md:text-2xl font-bold text-orange-300">
                  {newTier === "Gold"
                    ? "$100"
                    : newTier === "Silver"
                    ? "$75"
                    : newTier === "Bronze"
                    ? "$50"
                    : "N/A"}
                </strong>
              </h3>
              <p className="text-sm md:text-md">
                Haircut every{" "}
                {newTier === "Gold"
                  ? "2 weeks"
                  : newTier === "Silver"
                  ? "3 weeks"
                  : newTier === "Bronze"
                  ? "4 weeks"
                  : "N/A"}
                , complimentary drinks, savings included and more.
              </p>
            </div>

            <div 
              onClick={() => navigate('/change-membership')} 
              className="w-full p-4 border-y mt-4 bg-[#1b1f23] text-white cursor-pointer hover:bg-[#272b30] flex justify-between items-center"
            >
              <span>Change Plan</span>
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
              </svg>
            </div>

          </div>
          <p className="font-semibold text-xl mt-6 mb-4">Payment Info</p>

          {/* --- Payment Method Section --- */}
          <div className="w-full bg-[#1b1f23] p-6 rounded-lg shadow-md mt-6">
            <h2 className="text-xl md:text-2xl font-semibold mb-2">Payment Method</h2>
            
            {/* Show current payment method if available */}
            {paymentMethod ? (
              <div className="mb-4">
                <div className="mr-2 flex items-center"><span className="text-2xl mr-2">{getCardLogo(paymentMethod.brand || "")}</span> <p className="text-white">•••• •••• •••• <span className="font-medium">{paymentMethod.last4}</span></p></div>
                
                <p className="text-white mt-2">
                  Expires:{" "}
                  <span className="font-medium">
                    {paymentMethod?.exp_month !== undefined
                      ? `${paymentMethod.exp_month < 10 ? `0${paymentMethod.exp_month}` : paymentMethod.exp_month}/${paymentMethod.exp_year}`
                      : "N/A"}
                  </span>
                </p>
              </div>
            ) : (
              <p className="mb-4">No payment method on file.</p>
            )}

            {/* --- Update Payment Method Form --- */}
            <Elements stripe={stripePromise}>
              <PaymentForm
                email={member?.email ?? ""}
                onUpdatePaymentMethod={fetchCurrentPaymentMethod}
              />
            </Elements>
          </div>
          <button 
            className="w-full p-3 mt-6 border border-red-400 rounded-lg text-red-400 hover:bg-red-400 cursor-pointer hover:text-white"
            onClick={() => setShowCancelModal(true)}
          >
            Cancel Membership
          </button>
        </div>
      </div>

      {/* Cancel Membership Modal */}
      {showCancelModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-[#1b1f23] px-6 py-4 rounded-lg shadow-lg w-96 relative">
            {!cancellationSuccess ? (
              <>
                <h3 className="text-xl font-semibold text-center text-white">Cancel Membership?</h3>
                <button 
                  className="absolute top-2 right-2 px-2 py-2 text-white text-xl cursor-pointer rounded hover:text-orange-300"
                  onClick={() => setShowCancelModal(false)}
                >
                  <IoClose />
                </button>
                <p className="text-gray-400 mt-2 text-center">
                  Are you sure you want to cancel your membership? This action cannot be undone.
                </p>
                <div className="mt-6 px-2 flex justify-between">
                  
                  <button 
                    className="px-4 py-2 bg-red-600 w-full cursor-pointer text-white rounded hover:bg-red-500"
                    onClick={handleCancelMembership}
                    disabled={loading}
                  >
                    {loading ? "Processing..." : "Confirm"}
                  </button>
                </div>
              </>
            ) : (
              <>
                <h3 className="text-xl font-semibold text-white">Membership Cancelled</h3>
                <p className="text-gray-400 mt-2">
                  Your membership has been successfully cancelled.
                </p>
                <div className="mt-4 text-center">
                  <button 
                    className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-500"
                    onClick={() => {
                      setShowCancelModal(false); 
                      navigate('/members');
                    }}
                  >
                    OK
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      <Footer />
    </>
  );
};

interface PaymentFormProps {
  email: string;
  onUpdatePaymentMethod: () => void;
}

const PaymentForm = ({ email, onUpdatePaymentMethod }: PaymentFormProps) => {
  const stripe = useStripe();
  const elements = useElements();
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!stripe || !elements) return;

    setLoading(true);
    try {
      const { error, paymentMethod } = await stripe.createPaymentMethod({
        type: "card",
        card: elements.getElement(CardElement)!,
      });

      if (error) {
        alert(error.message);
        setLoading(false);
        return;
      }

      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/stripe/update-payment-method`,
        {
          email,
          paymentMethodId: paymentMethod?.id,
        }
      );

      if (response.data.success) {
        alert("Payment method updated!");
        onUpdatePaymentMethod(); // Refresh the displayed payment method
      } else {
        alert(response.data.error || "Failed to update payment method.");
      }
    } catch (error) {
      console.error("Error updating payment method:", error);
      alert("An error occurred while updating the payment method.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mt-4">
      {/* <CardElement className="p-2 border text-white rounded" />
      <button
        type="submit"
        className="w-full bg-green-500 text-white p-2 mt-4 rounded disabled:bg-gray-400"
        disabled={!stripe || loading}
      >
        {loading ? "Saving..." : "Save Payment Method"}
      </button> */}
      <div 
        onClick={() => navigate('/update-payment-method')} 
        className="w-full p-4 border-y mt-4 bg-[#1b1f23] text-white cursor-pointer hover:bg-[#272b30] flex justify-between items-center"
      >
        <span>Update Payment Method</span>
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
        </svg>
      </div>
    </form>
  );
};

export default ManageMembership;

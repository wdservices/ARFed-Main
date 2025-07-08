import React, { useState, useEffect } from "react";
import { getCookie } from "cookies-next";
import { Modal } from "antd";
import axios from "axios";
import { toast } from "@/components/ui/use-toast";
import { FaCrown, FaCheck, FaCalendarAlt, FaCalendarDay, FaCalendarWeek } from "react-icons/fa";
import PropTypes from "prop-types";
import { useUser } from "../context/UserContext";

const Payment = ({ open, closeModal, user, refreshUser = () => {} }) => {
  const { fetchUser } = useUser();
  const id = getCookie("id");
  const token = getCookie("token");
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isScriptLoaded, setIsScriptLoaded] = useState(false);
  const [currency, setCurrency] = useState("NGN");

  useEffect(() => {
    let script = null;
    const loadScript = () => {
      // Remove any existing script
      const existingScript = document.querySelector('script[src="https://checkout.flutterwave.com/v3.js"]');
      if (existingScript) {
        document.body.removeChild(existingScript);
      }

      // Create and append new script
      script = document.createElement("script");
      script.src = "https://checkout.flutterwave.com/v3.js";
      script.async = true;
      
      script.onload = () => {
        console.log("Flutterwave script loaded successfully");
        setIsScriptLoaded(true);
      };
      
      script.onerror = (error) => {
        console.error("Failed to load Flutterwave script:", error);
        toast.error("Failed to load payment system. Please try again later.");
        setIsScriptLoaded(false);
      };

      document.body.appendChild(script);
    };

    if (open) {
      loadScript();
    }

    return () => {
      if (script && document.body.contains(script)) {
        document.body.removeChild(script);
      }
    };
  }, [open]);

  // Check if device is mobile
  const isMobile = () => {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
  };

  // Check if Flutterwave is available
  const isFlutterwaveAvailable = () => {
    return typeof window !== 'undefined' && window.FlutterwaveCheckout;
  };

  function generateReferenceKey(length) {
    const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    let result = "";
    for (let i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return result;
  }

  const plans = [
    // Daily Plan for NGN
    ...(currency === "NGN"
      ? [{
          id: "daily",
          name: "Daily Plan",
          price: "₦250",
          period: "per day",
          icon: <FaCalendarDay className="text-orange-500" size={24} />,
          features: [
            "Full access to all AR lessons for 24 hours",
            "AI tutor assistance",
            "Basic progress tracking"
          ],
          amount: 250,
          planId: 142602
        }]
      : []),
    // Daily Plan for USD
    ...(currency === "USD"
      ? [{
          id: "daily",
          name: "Daily Plan",
          price: "$1",
          period: "per day",
          icon: <FaCalendarDay className="text-orange-500" size={24} />,
          features: [
            "Full access to all AR lessons for 24 hours",
            "AI tutor assistance",
            "Basic progress tracking"
          ],
          amount: 1.00,
          planId: 143651
        }]
      : []),
    {
      id: "weekly",
      name: "Weekly Plan",
      price: currency === "NGN" ? "₦1,500" : "$2.99",
      period: "per week",
      icon: <FaCalendarWeek className="text-pink-500" size={24} />,
      features: [
        "Full access to all AR lessons",
        "AI tutor assistance",
        "Basic progress tracking",
        "24-hour support"
      ],
      amount: currency === "NGN" ? 1500 : 2.99,
      planId: currency === "NGN" ? 143575 : 143652
    },
    {
      id: "monthly",
      name: "Monthly Plan",
      price: currency === "NGN" ? "₦10,500" : "$7.99",
      period: "per month",
      icon: <FaCalendarAlt className="text-blue-500" size={24} />,
      features: [
        "All Daily Plan features",
        "Unlimited AR model uploads",
        "Advanced progress tracking",
        "Priority support",
        "Custom lesson plans"
      ],
      amount: currency === "NGN" ? 10500 : 7.99,
      planId: currency === "NGN" ? 142599 : 143599,
      popular: true
    },
    {
      id: "termly",
      name: "Termly Plan",
      price: currency === "NGN" ? "₦31,000" : "$23.99",
      period: "per 3 months",
      icon: <FaCalendarWeek className="text-green-500" size={24} />,
      features: [
        "All Monthly Plan features",
        "Group access (up to 5 users)",
        "Advanced analytics",
        "Dedicated support",
        "Early access to new features"
      ],
      amount: currency === "NGN" ? 31000 : 23.99,
      planId: currency === "NGN" ? 142601 : 143601
    },
    {
      id: "yearly",
      name: "Yearly Plan",
      price: currency === "NGN" ? "₦126,000" : "$99.99",
      period: "per year",
      icon: <FaCrown className="text-purple-500" size={24} />,
      features: [
        "All Termly Plan features",
        "Unlimited group access",
        "Custom branding",
        "API access",
        "Priority feature requests",
        "2 months free"
      ],
      amount: currency === "NGN" ? 126000 : 99.99,
      planId: currency === "NGN" ? 142600 : 143602
    }
  ];

  const handlePayment = async (plan) => {
    if (!user) {
      toast.error("Please log in to make a payment");
      return;
    }

    if (!isScriptLoaded) {
      toast.error("Payment system is still loading. Please try again in a moment.");
      return;
    }

    setIsProcessing(true);
    setSelectedPlan(plan);

    try {
      const config = {
        public_key: "FLWPUBK-f1ca421754831757166c4e74547967c0-X",
        tx_ref: generateReferenceKey(25),
        amount: plan.amount,
        payment_plan: plan.planId,
        currency: currency,
        payment_options: "card,banktransfer,ussd",
        customer: {
          email: user?.email,
          name: user?.name,
        },
        customizations: {
          title: "ARFed",
          description: `ARFed ${plan.name} Subscription`,
          logo: "/arfed.png",
        },
        onClose: () => {
          toast.error("Payment cancelled");
          setIsProcessing(false);
          setSelectedPlan(null);
        },
        callback: async (response) => {
          try {
            const result = await axios.put(
              `https://arfed-api.onrender.com/api/user/suscribe/${id}`,
              {
                plan: plan.id,
                startDate: new Date().toISOString(),
                endDate: calculateEndDate(plan.id),
                paymentId: response.transaction_id
              },
              {
                headers: {
                  "Content-Type": "application/json",
                  Accept: "application/json",
                  "auth-token": token,
                },
              }
            );
            console.log(result.data);
            toast.success("Payment Successful! Your subscription is now active.");
            if (refreshUser) {
              await refreshUser();
            }
            if (fetchUser) {
              await fetchUser();
            }
            closeModal();
          } catch (e) {
            console.error("Payment verification failed:", e);
            toast.error("Payment verification failed. Please contact support.");
          } finally {
            setIsProcessing(false);
            setSelectedPlan(null);
          }
        },
        // Mobile-specific configurations
        ...(isMobile() && {
          redirect_url: window.location.href,
          meta: {
            source: "mobile_web",
            user_agent: navigator.userAgent
          }
        })
      };

      if (isFlutterwaveAvailable()) {
        window.FlutterwaveCheckout(config);
      } else {
        // Retry loading the script if not available
        if (!isScriptLoaded) {
          toast.error("Payment system is still loading. Please try again in a moment.");
        } else {
          toast.error("Payment system not available. Please refresh the page and try again.");
        }
        setIsProcessing(false);
        setSelectedPlan(null);
      }
    } catch (error) {
      console.error("Payment initialization failed:", error);
      toast.error(`Payment error: ${error.message || "Failed to initialize payment. Please try again."}`);
      setIsProcessing(false);
      setSelectedPlan(null);
    }
  };

  const calculateEndDate = (planId) => {
    const now = new Date();
    switch (planId) {
      case 'daily':
        return new Date(now.setDate(now.getDate() + 1)).toISOString();
      case 'monthly':
        return new Date(now.setMonth(now.getMonth() + 1)).toISOString();
      case 'termly':
        return new Date(now.setMonth(now.getMonth() + 3)).toISOString();
      case 'yearly':
        return new Date(now.setFullYear(now.getFullYear() + 1)).toISOString();
      default:
        return new Date(now.setMonth(now.getMonth() + 1)).toISOString();
    }
  };

  return (
    <Modal
      title={
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-800">Choose Your Plan</h2>
          <p className="text-gray-600 mt-2">Select a plan that works best for you</p>
          <div className="flex justify-center mt-4">
            <button
              className={`px-4 py-2 rounded-l-lg border ${currency === "NGN" ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-700"}`}
              onClick={() => setCurrency("NGN")}
              disabled={currency === "NGN"}
            >
              Pay in Naira (₦)
            </button>
            <button
              className={`px-4 py-2 rounded-r-lg border -ml-px ${currency === "USD" ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-700"}`}
              onClick={() => setCurrency("USD")}
              disabled={currency === "USD"}
            >
              Pay in USD ($)
            </button>
          </div>
        </div>
      }
      centered
      open={open}
      footer={null}
      onCancel={closeModal}
      width={isMobile() ? "95%" : 800}
      className="subscription-modal bg-white text-gray-800"
    >
      <div className={`grid ${isMobile() ? 'grid-cols-1 gap-4' : 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6'} p-4`}>
        {plans.map((plan, index) => (
          <div
            key={plan.id}
            className={`relative bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 border-2 ${
              plan.popular ? 'border-purple-500 scale-105' : 'border-gray-200'
            }`}
          >
            {plan.popular && (
              <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-purple-500 to-pink-500 text-white px-4 py-1 rounded-full text-sm font-medium">
                Most Popular
              </div>
            )}
            
            <div className="p-6">
              <div className="flex justify-center mb-4">
                <div className="p-3 rounded-full bg-gray-100">
                  {plan.icon}
                </div>
              </div>
              
              <h3 className="text-xl font-bold text-center text-gray-800 mb-2">
                {plan.name}
              </h3>
              
              <div className="text-center mb-4">
                <div className="text-3xl font-bold text-gray-900">
                  {plan.price}
                </div>
                <div className="text-sm text-gray-500">
                  {plan.period}
                </div>
              </div>

              <ul className="space-y-3 mb-6">
                {plan.features.map((feature, index) => (
                  <li key={index} className="flex items-start space-x-3">
                    <FaCheck className="text-green-500 mt-1 flex-shrink-0" size={14} />
                    <span className="text-sm text-gray-600">{feature}</span>
                  </li>
                ))}
              </ul>

              <button
                onClick={() => handlePayment(plan)}
                disabled={isProcessing && selectedPlan?.id === plan.id}
                className={`w-full py-3 px-4 rounded-lg font-semibold transition-all duration-200 transform hover:scale-105 ${
                  plan.popular
                    ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:from-purple-600 hover:to-pink-600'
                    : 'bg-gray-900 text-white hover:bg-gray-800'
                } ${isProcessing && selectedPlan?.id === plan.id ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                {isProcessing && selectedPlan?.id === plan.id ? (
                  <div className="flex items-center justify-center">
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                    Processing...
                  </div>
                ) : (
                  'Subscribe Now'
                )}
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="text-center mt-6 text-sm text-gray-500">
        <p>All subscriptions start immediately upon payment and end at the same time on the expiration date.</p>
        <p className="mt-2">Need help? Contact our support team.</p>
      </div>
    </Modal>
  );
};

Payment.propTypes = {
  open: PropTypes.bool.isRequired,
  closeModal: PropTypes.func.isRequired,
  user: PropTypes.object,
  refreshUser: PropTypes.func,
};

export default Payment;
